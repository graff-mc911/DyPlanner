
  Upload,
  X,
  ListMusic,
  Youtube,
  Link,
  Plus,
  Cloud,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  saveMedia,
  loadAllMedia,
  deleteMedia,
  extractYouTubeId,
  type StoredMedia,
  type MediaSourceType,
} from '../utils/mediaDB';
  objectUrl?: string;
}

type AddMode = null | 'youtube' | 'url';
type PlayableMediaType = Extract<MediaSourceType, 'audio' | 'video' | 'youtube'>;
type PlayableMediaType = Extract<MediaSourceType, 'audio' | 'video'>;
type UploadKind = 'audio' | 'video' | 'mixed';

const VIDEO_EXTS = /\.(mp4|webm|ogv|mov|avi|mkv|m4v|m3u8|mpd)(\?|#|$)/i;
const AUDIO_EXTS = /\.(mp3|wav|ogg|flac|aac|m4a|opus|weba|m3u|pls)(\?|#|$)/i;
const AUDIO_ACCEPT = '.mp3,.wav,.ogg,.flac,.aac,.m4a,.opus,.weba,.m3u,.pls,audio/*';
const VIDEO_ACCEPT = '.mp4,.webm,.ogv,.mov,.avi,.mkv,.m4v,.m3u8,.mpd,video/*';
const CLOUD_ACCEPT = `${AUDIO_ACCEPT},${VIDEO_ACCEPT}`;

const GROUP_ORDER: PlayableMediaType[] = ['audio', 'video', 'youtube'];
const GROUP_ORDER: PlayableMediaType[] = ['audio', 'video'];
const GROUP_LABELS: Record<PlayableMediaType, string> = {
  audio: 'Аудіо',
  video: 'Відео',
  youtube: 'YouTube',
  audio: 'Audio',
  video: 'Video',
};

const SUPPORTED_HINT = 'MP3, WAV, OGG, MP4, WEBM - Google Drive / iCloud / Dropbox / OneDrive';
const CLOUD_HINT =
  'Cloud files: tap "Cloud" and choose media from Google Drive, iCloud, Dropbox, OneDrive, or local storage.';
const EMPTY_HINT = 'No media yet. Add audio or video from your device or cloud.';

function isPlayableType(type: MediaSourceType): type is PlayableMediaType {
  return type === 'audio' || type === 'video' || type === 'youtube';
  return type === 'audio' || type === 'video';
}

function normalizeUrlInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function detectUrlMediaTypeByExt(url: string): 'audio' | 'video' | null {
  if (VIDEO_EXTS.test(url)) return 'video';
  if (AUDIO_EXTS.test(url)) return 'audio';
  return null;
}

function detectLocalFileType(file: File, fallback: 'audio' | 'video'): 'audio' | 'video' {
function detectLocalFileType(
  file: File,
  fallback?: 'audio' | 'video'
): 'audio' | 'video' | null {
  const mime = file.type.toLowerCase();
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';
  return detectUrlMediaTypeByExt(file.name) ?? fallback;

  const byExt = detectUrlMediaTypeByExt(file.name);
  if (byExt) return byExt;

  return fallback ?? null;
}

function canPlayLocalFile(file: File, type: 'audio' | 'video'): boolean {
function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

async function detectUrlMediaType(url: string): Promise<'audio' | 'video' | null> {
  const byExt = detectUrlMediaTypeByExt(url);
  if (byExt) return byExt;

  try {
    const res = await fetch(url, { method: 'HEAD' });
    const contentType = res.headers.get('content-type')?.toLowerCase() ?? '';
    if (contentType.startsWith('audio/')) return 'audio';
    if (contentType.startsWith('video/')) return 'video';
  } catch {
    // Some hosts block HEAD/CORS; we'll fall back to a playable default in caller.
  }

  return null;
}

async function findEmbeddedMediaUrl(pageUrl: string): Promise<{ url: string; type: 'audio' | 'video' } | null> {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const html = (data.contents as string) || '';

    const attrMatches = Array.from(
      html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi),
      m => m[1].trim().replace(/&amp;/gi, '&')
    );

    const candidates = Array.from(
      new Set(
        attrMatches
          .map(raw => {
            try {
              return new URL(raw, pageUrl).href;
            } catch {
              return null;
            }
          })
          .filter((v): v is string => Boolean(v))
      )
    );

    for (const candidate of candidates) {
      const type = detectUrlMediaTypeByExt(candidate);
      if (type) return { url: candidate, type };
    }
  } catch {
    // If page fetch/parsing fails, caller will show invalid URL message.
  }

  return null;
}

async function fetchYouTubeTitle(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return (data.title as string) || null;
  } catch {
    return null;
  }
}

async function fetchPageTitle(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const match = (data.contents as string)?.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

declare global {
  interface Window {
    YT: {
      Player: new (el: HTMLElement, opts: object) => YTPlayer;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead?: boolean): void;
  setVolume(v: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

export default function MediaPlayerView() {
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(true);
  const [addMode, setAddMode] = useState<AddMode>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [fileError, setFileError] = useState('');
  const [fetchingTitle, setFetchingTitle] = useState(false);
  const [collapsed, setCollapsed] = useState<Partial<Record<PlayableMediaType, boolean>>>({});

  const audioEl = useRef<HTMLAudioElement | null>(null);
  const videoEl = useRef<HTMLVideoElement | null>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const ytTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const entriesRef = useRef<MediaEntry[]>([]);
  const currentIdRef = useRef<string | null>(null);
  const volumeRef = useRef(80);
  const ytApiReady = useRef(false);
  const ytApiLoading = useRef(false);
  const isIOS = isIOSDevice();

  entriesRef.current = entries;
  currentIdRef.current = currentId;
  volumeRef.current = volume;
  const isIOS = isIOSDevice();

  const current = entries.find(entry => entry.id === currentId) ?? null;

  const destroyYT = useCallback(() => {
    if (ytTimerRef.current) {
      clearInterval(ytTimerRef.current);
      ytTimerRef.current = null;
    }
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.destroy();
      } catch {
        // noop
      }
      ytPlayerRef.current = null;
    }
  }, []);

  const stopNativeMedia = useCallback(() => {
    if (audioEl.current) {
      videoEl.current.load();
    }
  }, []);

  const stopAll = useCallback(() => {
    stopNativeMedia();
    destroyYT();
  }, [stopNativeMedia, destroyYT]);

  const advanceToNext = useCallback(() => {
    const list = entriesRef.current;
      entriesRef.current.forEach(entry => {
        if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl);
      });
      stopAll();
      stopNativeMedia();
    };
  }, [stopAll]);
  }, [stopNativeMedia]);

  useEffect(() => {
    const el = audioEl.current;
    };
  }, [advanceToNext]);

  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoEl.current = el;
    if (!el) return;
  const setVideoRef = useCallback(
    (el: HTMLVideoElement | null) => {
      videoEl.current = el;
      if (!el) return;

    el.volume = volumeRef.current / 100;
    el.ontimeupdate = () => setCurrentTime(el.currentTime);
    el.ondurationchange = () => {
      if (isFinite(el.duration)) setDuration(el.duration);
    };
    el.onplay = () => setIsPlaying(true);
    el.onpause = () => setIsPlaying(false);
    el.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      advanceToNext();
    };
    el.onerror = () => setIsPlaying(false);
  }, [advanceToNext]);

  const loadYTApi = useCallback((): Promise<void> => {
    if (ytApiReady.current && window.YT?.Player) return Promise.resolve();

    return new Promise(resolve => {
      if (window.YT?.Player) {
        ytApiReady.current = true;
        resolve();
        return;
      }

      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        ytApiReady.current = true;
        if (prev) prev();
        resolve();
      el.volume = volumeRef.current / 100;
      el.ontimeupdate = () => setCurrentTime(el.currentTime);
      el.ondurationchange = () => {
        if (isFinite(el.duration)) setDuration(el.duration);
      };
      el.onplay = () => setIsPlaying(true);
      el.onpause = () => setIsPlaying(false);
      el.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        advanceToNext();
      };

      if (!ytApiLoading.current) {
        ytApiLoading.current = true;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    });
  }, []);
      el.onerror = () => setIsPlaying(false);
    },
    [advanceToNext]
  );

  useEffect(() => {
    if (!current || current.type === 'youtube') return;
    if (!current) return;

    destroyYT();
    setCurrentTime(0);
    setDuration(0);

      }

      const el = audioEl.current;
      const src = current.objectUrl ?? current.url ?? '';
      if (!el || !src) return;

      el.pause();
      el.src = src;
      el.currentTime = 0;
      el.volume = volumeRef.current / 100;
      el.load();
      el.play().catch(() => {});
      return;
    }

    if (current.type === 'video') {
      if (audioEl.current) {
        audioEl.current.pause();
        audioEl.current.removeAttribute('src');
        audioEl.current.load();
      }

      const el = videoEl.current;
      const src = current.objectUrl ?? current.url ?? '';
      if (!el || !src) return;

      el.volume = volumeRef.current / 100;
      el.load();
      el.play().catch(() => {});
    }
  }, [current?.id, current?.type, destroyYT]);

  useEffect(() => {
    if (!current || current.type !== 'youtube') {
      destroyYT();
      return;
    }

    const videoId = extractYouTubeId(current.url ?? '');
    if (!videoId) return;

    if (audioEl.current) {
      audioEl.current.pause();
      audioEl.current.removeAttribute('src');
      audioEl.current.load();
    }

    if (videoEl.current) {
      videoEl.current.pause();
      videoEl.current.removeAttribute('src');
      videoEl.current.load();
    }
    const el = videoEl.current;
    const src = current.objectUrl ?? current.url ?? '';
    if (!el || !src) return;

    let cancelled = false;
    el.pause();
    el.src = src;
    el.currentTime = 0;
    el.volume = volumeRef.current / 100;
    el.load();
    el.play().catch(() => {});
  }, [current?.id, current?.type]);

    loadYTApi().then(() => {
      if (cancelled || !ytContainerRef.current) return;
  const addFilesToPlaylist = useCallback(
    async (files: File[], kind: UploadKind) => {
      if (files.length === 0) return;

      destroyYT();
      if (cancelled || !ytContainerRef.current) return;
      const persistBlobs = !isIOS;
      const newEntries: MediaEntry[] = [];
      let skipped = 0;

      ytContainerRef.current.innerHTML = '';
      const div = document.createElement('div');
      ytContainerRef.current.appendChild(div);
      for (const file of files) {
        const fallback = kind === 'mixed' ? undefined : kind;
        const actualType = detectLocalFileType(file, fallback);
        if (!actualType || !canPlayLocalFile(file, actualType)) {
          skipped += 1;
          continue;
        }

      ytPlayerRef.current = new window.YT.Player(div, {
        videoId,
        playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (cancelled) return;
        const id = `${actualType}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const objectUrl = URL.createObjectURL(file);
        const item: StoredMedia = {
          id,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: actualType,
          ...(persistBlobs ? { blob: file } : {}),
        };

            e.target.setVolume(volumeRef.current);
            e.target.playVideo();
            setIsPlaying(true);
            setCurrentTime(0);
            setDuration(0);
        if (persistBlobs) {
          try {
            await saveMedia(item);
          } catch (error) {
            console.error('Failed to save media to IndexedDB:', error);
          }
        }

            ytTimerRef.current = setInterval(() => {
              if (!ytPlayerRef.current) return;
              const ct = ytPlayerRef.current.getCurrentTime();
              const dur = ytPlayerRef.current.getDuration();
              setCurrentTime(ct);
              if (dur > 0) setDuration(dur);
            }, 500);
          },
          onStateChange: (e: { data: number }) => {
            if (cancelled) return;

            if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setCurrentTime(0);
              advanceToNext();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
  }, [current?.id, current?.type, loadYTApi, destroyYT, advanceToNext]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'audio' | 'video') => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    e.target.value = '';

    const newEntries: MediaEntry[] = [];
    let skipped = 0;
    const persistBlobs = !isIOS;

    for (const file of files) {
      const actualType = detectLocalFileType(file, type);
      if (!canPlayLocalFile(file, actualType)) {
        skipped += 1;
        continue;
        newEntries.push({ ...item, objectUrl });
      }

      const id = `${actualType}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const objectUrl = URL.createObjectURL(file);
      const item: StoredMedia = {
        id,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: actualType,
        ...(persistBlobs ? { blob: file } : {}),
      };

      if (persistBlobs) {
        try {
          await saveMedia(item);
        } catch (error) {
          console.error('Failed to save media to IndexedDB:', error);
        }
      if (skipped > 0) {
        setFileError(`Could not play ${skipped} file(s) on this device.`);
      } else {
        setFileError('');
      }

      newEntries.push({ ...item, objectUrl });
    }
      if (newEntries.length === 0) return;

    if (skipped > 0) {
      setFileError(`Не вдалося відтворити ${skipped} файл(и) на цьому пристрої.`);
    } else {
      setFileError('');
    }

    if (newEntries.length === 0) return;

    setEntries(prev => [...prev, ...newEntries]);

    if (!currentIdRef.current && newEntries.length > 0) {
      const first = newEntries[0];
      setCurrentId(first.id);
      currentIdRef.current = first.id;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handleAddUrl = async () => {
    const raw = normalizeUrlInput(inputValue);
    if (!raw || fetchingTitle) return;

    try {
      new URL(raw);
    } catch {
      setInputError(true);
      return;
    }

    const ytId = extractYouTubeId(raw);
    const effectiveMode = addMode === 'youtube' || ytId ? 'youtube' : 'url';

    if (effectiveMode === 'youtube') {
      const videoId = ytId ?? extractYouTubeId(raw);
      if (!videoId) {
        setInputError(true);
        return;
      }

      setFetchingTitle(true);
      const fetched = await fetchYouTubeTitle(raw);
      setFetchingTitle(false);

      const id = `yt_${Date.now()}`;
      const item: StoredMedia = {
        id,
        title: fetched || `YouTube: ${videoId}`,
        type: 'youtube',
        url: raw,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      };

      try {
        await saveMedia(item);
      } catch (error) {
        console.error('Failed to save YouTube item:', error);
      }

      setEntries(prev => [...prev, { ...item }]);
      setEntries(prev => [...prev, ...newEntries]);

      if (!currentIdRef.current) {
        setCurrentId(id);
        currentIdRef.current = id;
        const first = newEntries[0];
        setCurrentId(first.id);
        currentIdRef.current = first.id;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
    },
    [isIOS]
  );

      setInputValue('');
      setInputError(false);
      setAddMode(null);
      return;
    }
  const handleFileUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>, kind: 'audio' | 'video') => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      e.target.value = '';
      void addFilesToPlaylist(files, kind);
    },
    [addFilesToPlaylist]
  );

    let finalUrl = raw;
    let finalType = await detectUrlMediaType(raw);
  const handleCloudUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      e.target.value = '';
      void addFilesToPlaylist(files, 'mixed');
    },
    [addFilesToPlaylist]
  );

    if (!finalType) {
      const embedded = await findEmbeddedMediaUrl(raw);
      if (embedded) {
        finalUrl = embedded.url;
        finalType = embedded.type;
      }
    }

    if (!finalType) {
      setInputError(true);
      return;
    }

    setFetchingTitle(true);
    const fetched = await fetchPageTitle(raw);
    setFetchingTitle(false);

    const fallback = finalUrl.split('/').filter(Boolean).pop()?.split('?')[0] || 'Media';
    const id = `${finalType}_${Date.now()}`;
    const item: StoredMedia = {
      id,
      title: fetched || fallback,
      type: finalType,
      url: finalUrl,
    };

    try {
      await saveMedia(item);
    } catch (error) {
      console.error('Failed to save direct media URL:', error);
    }

    setEntries(prev => [...prev, { ...item }]);

    if (!currentIdRef.current) {
  const selectTrack = useCallback(
    (id: string) => {
      stopNativeMedia();
      setCurrentId(id);
      currentIdRef.current = id;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }

    setInputValue('');
    setInputError(false);
    setAddMode(null);
  };

  const selectTrack = useCallback((id: string) => {
    stopAll();
    setCurrentId(id);
    currentIdRef.current = id;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [stopAll]);
    },
    [stopNativeMedia]
  );

  const togglePlay = useCallback(() => {
    if (!current) return;

    if (current.type === 'youtube' && ytPlayerRef.current) {
      if (isPlaying) ytPlayerRef.current.pauseVideo();
      else ytPlayerRef.current.playVideo();
      return;
    }

    if (current.type === 'video' && videoEl.current) {
      if (isPlaying) videoEl.current.pause();
      else {
      if (isPlaying) {
        videoEl.current.pause();
      } else {
        videoEl.current.volume = volumeRef.current / 100;
        videoEl.current.play().catch(() => {});
      }
    }

    if (current.type === 'audio' && audioEl.current) {
      if (isPlaying) audioEl.current.pause();
      else {
      if (isPlaying) {
        audioEl.current.pause();
      } else {
        audioEl.current.volume = volumeRef.current / 100;
        audioEl.current.play().catch(() => {});
      }

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);

    if (current?.type === 'youtube' && ytPlayerRef.current) {
      const dur = ytPlayerRef.current.getDuration();
      if (dur > 0) {
        const nextTime = (val / 100) * dur;
        ytPlayerRef.current.seekTo(nextTime, true);
        setCurrentTime(nextTime);
      }
      return;
    }
    const el = current?.type === 'video' ? videoEl.current : audioEl.current;

    const el = current?.type === 'video' ? videoEl.current : audioEl.current;
    if (el && isFinite(el.duration)) {
      el.currentTime = (val / 100) * el.duration;
      setCurrentTime(el.currentTime);
    }
  };

  const skipTrack = useCallback((dir: 1 | -1) => {
    const list = entriesRef.current;
    const cid = currentIdRef.current;
    if (!cid || list.length === 0) return;
  const skipTrack = useCallback(
    (dir: 1 | -1) => {
      const list = entriesRef.current;
      const cid = currentIdRef.current;
      if (!cid || list.length === 0) return;

    const idx = list.findIndex(entry => entry.id === cid);
    const next = list[(idx + dir + list.length) % list.length];
    selectTrack(next.id);
  }, [selectTrack]);
      const idx = list.findIndex(entry => entry.id === cid);
      const next = list[(idx + dir + list.length) % list.length];
      selectTrack(next.id);
    },
    [selectTrack]
  );

  const removeEntry = async (id: string) => {
    if (currentIdRef.current === id) {
      stopAll();
      stopNativeMedia();
    }

    try {

    if (audioEl.current) audioEl.current.volume = val / 100;
    if (videoEl.current) videoEl.current.volume = val / 100;
    if (ytPlayerRef.current) ytPlayerRef.current.setVolume(val);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    >
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-white mb-1">{t.player.title}</h1>
        <p className="text-gray-400 text-sm">{t.player.supported}</p>
        <p className="text-gray-400 text-sm">{SUPPORTED_HINT}</p>
        <p className="text-gray-500 text-xs mt-1">{CLOUD_HINT}</p>
        {isIOS && (
          <p className="text-amber-300/80 text-xs mt-1">
            iPhone: працюють сумісні формати (MP3/M4A/MP4). iOS не дозволяє веб-додатку читати папку автоматично.
            iPhone/iPad: choose files in the system picker. Keep cloud provider app installed and enabled in Files.
          </p>
        )}
        {fileError && (
          <p className="text-xs text-amber-300/90 mt-1">{fileError}</p>
          <p className="text-xs text-amber-300/90 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {fileError}
          </p>
        )}
      </div>

        onChange={e => handleFileUpload(e, 'video')}
      />

      <input
        id="cloud-upload"
        type="file"
        accept={CLOUD_ACCEPT}
        multiple
        className="sr-only"
        onChange={handleCloudUpload}
      />

      <audio ref={audioEl} preload="auto" style={{ display: 'none' }} />

      <div className="grid grid-cols-4 gap-2 mb-4">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <motion.label
          htmlFor="audio-upload"
          whileHover={{ scale: 1.03 }}
          <span className="text-xs text-gray-400 text-center leading-tight">{t.player.uploadVideo}</span>
        </motion.label>

        <motion.button
        <motion.label
          htmlFor="cloud-upload"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setAddMode(mode => mode === 'youtube' ? null : 'youtube');
            setInputValue('');
            setInputError(false);
          }}
          className={`border rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all ${
            addMode === 'youtube'
              ? 'bg-red-500/15 border-red-500/40'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Youtube className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-xs text-gray-400 text-center leading-tight">{t.player.addYoutube}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setAddMode(mode => mode === 'url' ? null : 'url');
            setInputValue('');
            setInputError(false);
          }}
          className={`border rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all ${
            addMode === 'url'
              ? 'bg-cyan-500/15 border-cyan-500/40'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          }`}
          className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Link className="w-4 h-4 text-cyan-400" />
            <Cloud className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-xs text-gray-400 text-center leading-tight">{t.player.addUrl}</span>
        </motion.button>
          <span className="text-xs text-gray-400 text-center leading-tight">Cloud</span>
        </motion.label>
      </div>

      <AnimatePresence>
        {addMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div
              className={`flex gap-2 p-3 rounded-2xl border ${
                inputError
                  ? 'border-red-500/50 bg-red-500/5'
                  : addMode === 'youtube'
                    ? 'border-red-500/30 bg-red-500/5'
                    : 'border-cyan-500/30 bg-cyan-500/5'
              }`}
            >
              <input
                type="text"
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                  setInputError(false);
                }}
                onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
                placeholder={addMode === 'youtube' ? t.player.youtubePlaceholder : t.player.urlPlaceholder}
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
                autoFocus
              />

              {inputError && (
                <AlertCircle className="w-4 h-4 text-red-400 self-center flex-shrink-0" />
              )}

              <button
                onClick={handleAddUrl}
                disabled={fetchingTitle}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all disabled:opacity-60 ${
                  addMode === 'youtube'
                    ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                }`}
              >
                {fetchingTitle ? (
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                {fetchingTitle ? t.player.loading : t.player.add}
              </button>
            </div>

            {inputError && (
              <p className="text-xs text-red-400 mt-1 ml-3">{t.player.invalidUrl}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {current && (
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.player.nowPlaying}</p>
            <p className="text-white font-semibold truncate mb-3">{current.title}</p>

            {current.type === 'youtube' && (
              <div
                ref={ytContainerRef}
                className="w-full rounded-2xl mb-3 overflow-hidden bg-black"
                style={{ aspectRatio: '16/9' }}
              />
            )}

            {current.type === 'video' && (
              <video
        <div className="flex items-center gap-2 mb-3">
          <ListMusic className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-400">{t.player.playlist}</p>
          {entries.length > 0 && (
            <span className="text-xs text-gray-600 ml-auto">{entries.length}</span>
          )}
          {entries.length > 0 && <span className="text-xs text-gray-600 ml-auto">{entries.length}</span>}
        </div>

        {loading ? (
            className="flex flex-col items-center justify-center py-12 text-gray-600"
          >
            <Upload className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-center text-sm">{t.player.empty}</p>
            <p className="text-center text-sm">{EMPTY_HINT}</p>
          </motion.div>
        ) : (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                          onClick={() => selectTrack(entry.id)}
                        >
                          <div className="relative flex-shrink-0">
                            {entry.type === 'youtube' && entry.thumbnail ? (
                              <div className="w-10 h-8 rounded-lg overflow-hidden bg-black">
                                <img src={entry.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                              </div>
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  entry.type === 'audio'
                                    ? 'bg-blue-500/20'
                                    : entry.type === 'video'
                                      ? 'bg-pink-500/20'
                                      : 'bg-red-500/20'
                                }`}
                              >
                                {entry.type === 'audio' ? (
                                  <Music className="w-4 h-4 text-blue-400" />
                                ) : entry.type === 'video' ? (
                                  <Video className="w-4 h-4 text-pink-400" />
                                ) : (
                                  <Youtube className="w-4 h-4 text-red-400" />
                                )}
                              </div>
                            )}
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                entry.type === 'audio' ? 'bg-blue-500/20' : 'bg-pink-500/20'
                              }`}
                            >
                              {entry.type === 'audio' ? (
                                <Music className="w-4 h-4 text-blue-400" />
                              ) : (
                                <Video className="w-4 h-4 text-pink-400" />
                              )}
                            </div>

                            {currentId === entry.id && isPlaying && (
                              <motion.div
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              removeEntry(entry.id);
                              void removeEntry(entry.id);
                            }}
                            className="flex-shrink-0 w-6 h-6 rounded-lg opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all"
                          >