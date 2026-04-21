import { useState, useRef, useEffect, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music,
  Video,
  Upload,
  X,
  ListMusic,
  Cloud,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Plus,
  HardDrive,
  Globe,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { saveMedia, loadAllMedia, deleteMedia } from '../utils/mediaDB';
import type { StoredMedia, MediaSourceType } from '../utils/mediaDB';

interface MediaEntry extends StoredMedia {
  objectUrl?: string;
}

type PlayableMediaType = Extract<MediaSourceType, 'audio' | 'video'>;
type UploadKind = 'audio' | 'video' | 'mixed';
type RepeatMode = 'off' | 'all' | 'one';

const VIDEO_EXTS = /\.(mp4|webm|ogv|mov|avi|mkv|m4v|m3u8|mpd)(\?|#|$)/i;
const AUDIO_EXTS = /\.(mp3|wav|ogg|flac|aac|m4a|opus|weba|m3u|pls)(\?|#|$)/i;
const AUDIO_ACCEPT = '.mp3,.wav,.ogg,.flac,.aac,.m4a,.opus,.weba,.m3u,.pls,audio/*';
const VIDEO_ACCEPT = '.mp4,.webm,.ogv,.mov,.avi,.mkv,.m4v,.m3u8,.mpd,video/*';
const CLOUD_ACCEPT = `${AUDIO_ACCEPT},${VIDEO_ACCEPT}`;

const GROUP_ORDER: PlayableMediaType[] = ['audio', 'video'];
const GROUP_LABELS: Record<PlayableMediaType, string> = {
  audio: 'Audio',
  video: 'Video',
};

const EMPTY_HINT = 'No media yet. Add audio or video and start playback.';

function isPlayableType(type: MediaSourceType): type is PlayableMediaType {
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

function detectLocalFileType(file: File, fallback?: 'audio' | 'video'): 'audio' | 'video' | null {
  const mime = file.type.toLowerCase();
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';
  return detectUrlMediaTypeByExt(file.name) ?? fallback ?? null;
}

function canPlayLocalFile(file: File, type: 'audio' | 'video'): boolean {
  if (typeof document === 'undefined') return true;
  const el = document.createElement(type);

  if (file.type) {
    const support = el.canPlayType(file.type);
    if (support === 'probably' || support === 'maybe') return true;
  }

  return detectUrlMediaTypeByExt(file.name) === type;
}

function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandaloneWebApp(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
}

function normalizeCloudShareUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host === 'drive.google.com') {
      const queryId = parsed.searchParams.get('id');
      if (queryId) {
        return `https://drive.google.com/uc?export=download&id=${queryId}`;
      }

      const parts = parsed.pathname.split('/').filter(Boolean);
      if (parts[0] === 'file' && parts[1] === 'd' && parts[2]) {
        return `https://drive.google.com/uc?export=download&id=${parts[2]}`;
      }
    }

    if (host.includes('dropbox.com')) {
      parsed.searchParams.set('dl', '1');
      return parsed.toString();
    }

    if (host.includes('onedrive.live.com') || host.includes('1drv.ms')) {
      parsed.searchParams.set('download', '1');
      return parsed.toString();
    }
  } catch {
    return url;
  }

  return url;
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
    // Some servers block HEAD or cross-origin probing.
  }

  return null;
}

async function findEmbeddedMediaUrl(pageUrl: string): Promise<{ url: string; type: 'audio' | 'video' } | null> {
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(pageUrl)}`);
    if (!response.ok) return null;
    const payload = await response.json();
    const html = String(payload.contents ?? '');

    const rawAttrs = Array.from(
      html.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi),
      m => m[1].trim().replace(/&amp;/gi, '&')
    );

    const candidates = Array.from(
      new Set(
        rawAttrs
          .map(raw => {
            try {
              return new URL(raw, pageUrl).href;
            } catch {
              return null;
            }
          })
          .filter((url): url is string => Boolean(url))
      )
    );

    for (const candidate of candidates) {
      const type = detectUrlMediaTypeByExt(candidate);
      if (type) return { url: candidate, type };
    }
  } catch {
    // Best effort only.
  }

  return null;
}

function buildAllOriginsRawUrl(url: string): string {
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}

function probePlayableUrl(url: string, type: 'audio' | 'video', timeoutMs = 10000): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(true);

  return new Promise(resolve => {
    const el = document.createElement(type);
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      el.oncanplay = null;
      el.onloadedmetadata = null;
      el.onerror = null;
      el.removeAttribute('src');
      el.load();
      resolve(ok);
    };

    const timer = window.setTimeout(() => finish(false), timeoutMs);

    el.preload = 'metadata';
    el.oncanplay = () => finish(true);
    el.onloadedmetadata = () => finish(true);
    el.onerror = () => finish(false);

    try {
      el.src = url;
      el.load();
    } catch {
      finish(false);
    }
  });
}

async function resolvePlayableWebSource(
  inputUrl: string,
  preferredType: PlayableMediaType
): Promise<{ url: string; type: PlayableMediaType; note?: string } | null> {
  const candidates: Array<{ url: string; hintType?: PlayableMediaType; note?: string }> = [];
  const seen = new Set<string>();

  const pushCandidate = (url: string, hintType?: PlayableMediaType, note?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    candidates.push({ url, hintType, note });
  };

  const normalized = normalizeCloudShareUrl(inputUrl);
  pushCandidate(normalized, detectUrlMediaTypeByExt(normalized) ?? undefined);
  pushCandidate(
    buildAllOriginsRawUrl(normalized),
    detectUrlMediaTypeByExt(normalized) ?? undefined,
    'The original host blocks playback, so compatibility proxy is used.'
  );

  const embedded = await findEmbeddedMediaUrl(inputUrl);
  if (embedded) {
    const embeddedUrl = normalizeCloudShareUrl(embedded.url);
    pushCandidate(embeddedUrl, embedded.type);
    pushCandidate(
      buildAllOriginsRawUrl(embeddedUrl),
      embedded.type,
      'Embedded media is opened through compatibility proxy.'
    );
  }

  for (const candidate of candidates) {
    const detected = candidate.hintType ?? (await detectUrlMediaType(candidate.url));
    const probeOrder: PlayableMediaType[] = detected
      ? [detected, detected === 'audio' ? 'video' : 'audio']
      : [preferredType, preferredType === 'audio' ? 'video' : 'audio'];

    for (const type of probeOrder) {
      const ok = await probePlayableUrl(candidate.url, type);
      if (ok) {
        return { url: candidate.url, type, note: candidate.note };
      }
    }
  }

  return null;
}

function inferTitleFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const leaf = parsed.pathname.split('/').filter(Boolean).pop();
    if (!leaf) return parsed.hostname;
    return decodeURIComponent(leaf).replace(/\.[^/.]+$/, '') || parsed.hostname;
  } catch {
    return 'Web media';
  }
}

function formatTime(secs: number): string {
  if (!isFinite(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MediaPlayerView() {
  const { t } = useLanguage();

  const [entries, setEntries] = useState<MediaEntry[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(true);
  const [fileError, setFileError] = useState('');
  const [collapsed, setCollapsed] = useState<Partial<Record<PlayableMediaType, boolean>>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [urlType, setUrlType] = useState<PlayableMediaType>('audio');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [urlNote, setUrlNote] = useState('');
  const [shuffleEnabled, setShuffleEnabled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');

  const deviceInputRef = useRef<HTMLInputElement | null>(null);
  const cloudInputRef = useRef<HTMLInputElement | null>(null);
  const audioEl = useRef<HTMLAudioElement | null>(null);
  const videoEl = useRef<HTMLVideoElement | null>(null);
  const entriesRef = useRef<MediaEntry[]>([]);
  const currentIdRef = useRef<string | null>(null);
  const volumeRef = useRef(80);
  const shuffleRef = useRef(false);
  const repeatModeRef = useRef<RepeatMode>('all');

  const isIOS = isIOSDevice();
  const isStandalone = isStandaloneWebApp();
  const cloudAccept = isIOS && isStandalone ? undefined : CLOUD_ACCEPT;

  entriesRef.current = entries;
  currentIdRef.current = currentId;
  volumeRef.current = volume;
  shuffleRef.current = shuffleEnabled;
  repeatModeRef.current = repeatMode;

  const current = entries.find(entry => entry.id === currentId) ?? null;

  const reportCurrentPlaybackError = useCallback(() => {
    const cid = currentIdRef.current;
    if (!cid) return;

    const currentEntry = entriesRef.current.find(entry => entry.id === cid);
    if (!currentEntry) return;

    if (currentEntry.url && !currentEntry.objectUrl) {
      setFileError('Web link is blocked by source site. Use a direct media file URL (.mp3/.mp4/.webm).');
    } else {
      setFileError('This file cannot be played on this device.');
    }
  }, []);

  const stopNativeMedia = useCallback(() => {
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
  }, []);

  const selectTrack = useCallback(
    (id: string) => {
      stopNativeMedia();
      setCurrentId(id);
      currentIdRef.current = id;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    },
    [stopNativeMedia]
  );

  const advanceToNext = useCallback(() => {
    const list = entriesRef.current;
    const cid = currentIdRef.current;
    if (!cid || list.length === 0) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    const idx = list.findIndex(item => item.id === cid);
    if (idx < 0) return;

    let nextIndex = idx + 1;

    if (shuffleRef.current && list.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * list.length);
      } while (nextIndex === idx);
    } else if (nextIndex >= list.length) {
      if (repeatModeRef.current === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }
    }

    const next = list[nextIndex];
    setCurrentId(next.id);
    currentIdRef.current = next.id;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const handleTrackEnded = useCallback(
    (el: HTMLAudioElement | HTMLVideoElement | null) => {
      if (!el) return;

      if (repeatModeRef.current === 'one') {
        el.currentTime = 0;
        el.play().catch(() => {});
        return;
      }

      setIsPlaying(false);
      setCurrentTime(0);
      advanceToNext();
    },
    [advanceToNext]
  );

  useEffect(() => {
    loadAllMedia()
      .then(items => {
        const loaded: MediaEntry[] = items
          .filter(item => isPlayableType(item.type))
          .map(item => ({
            ...item,
            objectUrl: item.blob ? URL.createObjectURL(item.blob) : undefined,
          }));

        setEntries(loaded);
        if (loaded.length > 0) {
          setCurrentId(loaded[0].id);
          currentIdRef.current = loaded[0].id;
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      entriesRef.current.forEach(entry => {
        if (entry.objectUrl) URL.revokeObjectURL(entry.objectUrl);
      });
      stopNativeMedia();
    };
  }, [stopNativeMedia]);

  useEffect(() => {
    const el = audioEl.current;
    if (!el) return;

    el.volume = volumeRef.current / 100;
    el.ontimeupdate = () => setCurrentTime(el.currentTime);
    el.ondurationchange = () => {
      if (isFinite(el.duration)) setDuration(el.duration);
    };
    el.onplay = () => setIsPlaying(true);
    el.onpause = () => setIsPlaying(false);
    el.onended = () => handleTrackEnded(el);
    el.onerror = () => {
      setIsPlaying(false);
      reportCurrentPlaybackError();
    };

    return () => {
      el.ontimeupdate = null;
      el.ondurationchange = null;
      el.onplay = null;
      el.onpause = null;
      el.onended = null;
      el.onerror = null;
    };
  }, [handleTrackEnded, reportCurrentPlaybackError]);

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
      el.onended = () => handleTrackEnded(el);
      el.onerror = () => {
        setIsPlaying(false);
        reportCurrentPlaybackError();
      };
    },
    [handleTrackEnded, reportCurrentPlaybackError]
  );

  useEffect(() => {
    if (!current) return;

    setCurrentTime(0);
    setDuration(0);

    if (current.type === 'audio') {
      if (videoEl.current) {
        videoEl.current.pause();
        videoEl.current.removeAttribute('src');
        videoEl.current.load();
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

    if (audioEl.current) {
      audioEl.current.pause();
      audioEl.current.removeAttribute('src');
      audioEl.current.load();
    }

    const el = videoEl.current;
    const src = current.objectUrl ?? current.url ?? '';
    if (!el || !src) return;

    el.pause();
    el.src = src;
    el.currentTime = 0;
    el.volume = volumeRef.current / 100;
    el.load();
    el.play().catch(() => {});
  }, [current?.id, current?.type]);

  const addFilesToPlaylist = useCallback(
    async (files: File[], kind: UploadKind) => {
      if (files.length === 0) return;

      const persistBlobs = !isIOS;
      const newEntries: MediaEntry[] = [];
      let skipped = 0;

      for (const file of files) {
        const fallback = kind === 'mixed' ? undefined : kind;
        const actualType = detectLocalFileType(file, fallback);
        if (!actualType || !canPlayLocalFile(file, actualType)) {
          skipped += 1;
          continue;
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
        }

        newEntries.push({ ...item, objectUrl });
      }

      if (skipped > 0) {
        setFileError(`Could not play ${skipped} file(s) on this device.`);
      } else {
        setFileError('');
      }

      if (newEntries.length === 0) return;

      setEntries(prev => [...prev, ...newEntries]);

      if (!currentIdRef.current) {
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

  const handleLocalUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      e.target.value = '';
      void addFilesToPlaylist(files, 'mixed');
    },
    [addFilesToPlaylist]
  );

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

  const handleAddUrl = useCallback(async () => {
    if (urlLoading) return;

    const normalized = normalizeUrlInput(urlValue);
    if (!normalized) {
      setUrlError('Paste a valid URL first.');
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(normalized);
    } catch {
      setUrlError('Invalid URL format.');
      return;
    }

    setUrlError('');
    setUrlNote('');
    setUrlLoading(true);

    let resolved: { url: string; type: PlayableMediaType; note?: string } | null = null;
    try {
      resolved = await resolvePlayableWebSource(parsed.toString(), urlType);
    } catch {
      setUrlLoading(false);
      setUrlError('Could not open this link right now. Try again or use another URL.');
      return;
    }

    if (!resolved) {
      setUrlLoading(false);
      setUrlError('This link is not directly playable. Use a direct media file URL (.mp3/.mp4/.webm).');
      return;
    }

    const finalUrl = resolved.url;
    const finalType = resolved.type;

    const id = `${finalType}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const item: StoredMedia = {
      id,
      title: inferTitleFromUrl(finalUrl),
      type: finalType,
      url: finalUrl,
    };

    try {
      await saveMedia(item);
    } catch (error) {
      console.error('Failed to save URL item:', error);
    }

    setEntries(prev => [...prev, item]);
    setCurrentId(id);
    currentIdRef.current = id;
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    setUrlLoading(false);
    setIsAddOpen(false);
    setShowUrlInput(false);
    setUrlValue('');
    setFileError(resolved.note ?? '');
  }, [urlLoading, urlValue, urlType]);

  const togglePlay = useCallback(() => {
    if (!current) return;

    if (current.type === 'video' && videoEl.current) {
      if (isPlaying) {
        videoEl.current.pause();
      } else {
        videoEl.current.volume = volumeRef.current / 100;
        videoEl.current.play().catch(() => {});
      }
      return;
    }

    if (current.type === 'audio' && audioEl.current) {
      if (isPlaying) {
        audioEl.current.pause();
      } else {
        audioEl.current.volume = volumeRef.current / 100;
        audioEl.current.play().catch(() => {});
      }
    }
  }, [current, isPlaying]);

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    const el = current?.type === 'video' ? videoEl.current : audioEl.current;

    if (el && isFinite(el.duration)) {
      el.currentTime = (val / 100) * el.duration;
      setCurrentTime(el.currentTime);
    }
  };

  const skipTrack = useCallback(
    (dir: 1 | -1) => {
      const list = entriesRef.current;
      const cid = currentIdRef.current;
      if (!cid || list.length === 0) return;

      const idx = list.findIndex(entry => entry.id === cid);
      if (idx < 0) return;

      let nextIndex = idx + dir;
      if (shuffleRef.current && list.length > 1 && dir === 1) {
        do {
          nextIndex = Math.floor(Math.random() * list.length);
        } while (nextIndex === idx);
      } else {
        if (nextIndex < 0) nextIndex = list.length - 1;
        if (nextIndex >= list.length) nextIndex = 0;
      }

      selectTrack(list[nextIndex].id);
    },
    [selectTrack]
  );

  const removeEntry = async (id: string) => {
    if (currentIdRef.current === id) {
      stopNativeMedia();
    }

    try {
      await deleteMedia(id);
    } catch (error) {
      console.error('Failed to delete media from IndexedDB:', error);
    }

    const removed = entriesRef.current.find(entry => entry.id === id);
    if (removed?.objectUrl) {
      URL.revokeObjectURL(removed.objectUrl);
    }

    setEntries(prev => {
      const updated = prev.filter(entry => entry.id !== id);

      if (currentIdRef.current === id) {
        const oldIdx = prev.findIndex(entry => entry.id === id);
        const next = updated[oldIdx] ?? updated[oldIdx - 1] ?? null;
        setCurrentId(next?.id ?? null);
        currentIdRef.current = next?.id ?? null;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }

      return updated;
    });
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    volumeRef.current = val;

    if (audioEl.current) audioEl.current.volume = val / 100;
    if (videoEl.current) videoEl.current.volume = val / 100;
  };

  const cycleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const groups = GROUP_ORDER
    .map(type => ({
      type,
      items: entries.filter(entry => entry.type === type),
    }))
    .filter(group => group.items.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col h-full p-6 pb-28"
    >
      <div className="mb-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-white mb-1">{t.player.title}</h1>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddOpen(prev => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25"
          >
            <Plus className="w-4 h-4" />
            Add media
          </motion.button>
        </div>

        {isIOS && (
          <p className="text-amber-300/80 text-xs mt-2">
            iPhone/iPad: for cloud access, ensure provider is enabled in Files app.
          </p>
        )}

        {isIOS && isStandalone && (
          <div className="mt-2 p-2 rounded-lg border border-amber-400/20 bg-amber-500/5">
            <p className="text-amber-200/90 text-xs">
              Home Screen mode on iOS may hide some cloud providers. If Google Drive is missing, open this page in
              Safari or use iCloud Drive / On My iPhone.
            </p>
            <button
              onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
              className="mt-1.5 text-[11px] px-2 py-1 rounded-md bg-amber-400/15 text-amber-200 hover:bg-amber-400/25 transition-colors"
            >
              Open in Safari
            </button>
          </div>
        )}

        {fileError && (
          <p className="text-xs text-amber-300/90 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {fileError}
          </p>
        )}
      </div>

      <input
        ref={deviceInputRef}
        type="file"
        accept={CLOUD_ACCEPT}
        multiple
        className="sr-only"
        onChange={handleLocalUpload}
      />

      <input
        ref={cloudInputRef}
        type="file"
        accept={cloudAccept}
        multiple
        className="sr-only"
        onChange={handleCloudUpload}
      />

      <audio ref={audioEl} preload="auto" style={{ display: 'none' }} />

      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setIsAddOpen(false);
                    setShowUrlInput(false);
                    cloudInputRef.current?.blur();
                    deviceInputRef.current?.click();
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                >
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-200">From device</span>
                </button>

                <button
                  onClick={() => {
                    setIsAddOpen(false);
                    setShowUrlInput(false);
                    cloudInputRef.current?.click();
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors"
                >
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-gray-200">From cloud</span>
                </button>

                <button
                  onClick={() => {
                    setShowUrlInput(prev => !prev);
                    setUrlError('');
                    setUrlNote('');
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-colors ${
                    showUrlInput
                      ? 'bg-emerald-500/15 border-emerald-500/40'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-gray-200">From internet URL</span>
                </button>
              </div>

              <AnimatePresence>
                {showUrlInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => setUrlType('audio')}
                          className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                            urlType === 'audio'
                              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                              : 'bg-white/5 border-white/10 text-gray-400'
                          }`}
                        >
                          Audio
                        </button>
                        <button
                          onClick={() => setUrlType('video')}
                          className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                            urlType === 'video'
                              ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                              : 'bg-white/5 border-white/10 text-gray-400'
                          }`}
                        >
                          Video
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={urlValue}
                          onChange={e => {
                            setUrlValue(e.target.value);
                            setUrlError('');
                            setUrlNote('');
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              void handleAddUrl();
                            }
                          }}
                          placeholder="Paste direct file URL or page URL"
                          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none border border-white/10 rounded-lg px-3 py-2"
                        />
                        <button
                          onClick={() => {
                            void handleAddUrl();
                          }}
                          disabled={urlLoading}
                          className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-60"
                        >
                          {urlLoading ? 'Adding...' : 'Add'}
                        </button>
                      </div>

                      {urlError && <p className="text-xs text-red-300 mt-2">{urlError}</p>}
                      {urlNote && <p className="text-xs text-emerald-200/90 mt-2">{urlNote}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-br from-white/10 via-white/5 to-cyan-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mb-5"
          >
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">{t.player.nowPlaying}</p>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] border ${
                  current.url && !current.objectUrl
                    ? 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10'
                    : 'text-blue-300 border-blue-500/40 bg-blue-500/10'
                }`}
              >
                {current.url && !current.objectUrl ? 'WEB' : 'FILE'}
              </span>
            </div>
            <p className="text-white font-semibold truncate mb-3">{current.title}</p>

            {current.type === 'video' && (
              <video
                key={current.id}
                ref={setVideoRef}
                playsInline
                className="w-full rounded-2xl mb-3 max-h-56 object-contain bg-black"
              />
            )}

            {current.type === 'audio' && (
              <div className="flex items-end justify-center gap-0.5 h-8 mb-3">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-1 rounded-full ${isPlaying ? 'bg-cyan-400/80' : 'bg-white/10'}`}
                    animate={isPlaying ? { height: ['20%', `${30 + Math.random() * 70}%`, '20%'] } : { height: '20%' }}
                    transition={{ duration: 0.4 + Math.random() * 0.4, repeat: isPlaying ? Infinity : 0, delay: i * 0.03 }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500 tabular-nums w-9">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="flex-1 accent-cyan-500"
                style={{ height: '4px' }}
              />
              <span className="text-xs text-gray-500 tabular-nums w-9 text-right">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => skipTrack(-1)} className="text-gray-500 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </motion.button>

                <button onClick={() => skipTrack(1)} className="text-gray-500 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShuffleEnabled(prev => !prev)}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                    shuffleEnabled
                      ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                      : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={cycleRepeatMode}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                    repeatMode === 'off'
                      ? 'bg-white/5 border-white/10 text-gray-500 hover:text-white'
                      : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  }`}
                >
                  {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>

                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={e => handleVolumeChange(Number(e.target.value))}
                  className="w-16 accent-cyan-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <ListMusic className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-400">{t.player.playlist}</p>
          {entries.length > 0 && <span className="text-xs text-gray-600 ml-auto">{entries.length}</span>}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/20 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-gray-600"
          >
            <Upload className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-center text-sm">{EMPTY_HINT}</p>
          </motion.div>
        ) : (
          <div className="space-y-3 overflow-y-auto flex-1 pr-1">
            {groups.map(group => (
              <div key={group.type}>
                <button
                  onClick={() => setCollapsed(prev => ({ ...prev, [group.type]: !prev[group.type] }))}
                  className="w-full flex items-center gap-2 mb-2 text-left"
                >
                  {collapsed[group.type] ? (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-600" />
                  )}
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {GROUP_LABELS[group.type]}
                  </span>
                  <span className="text-xs text-gray-700 ml-1">{group.items.length}</span>
                  <div className="flex-1 h-px bg-white/5 ml-2" />
                </button>

                <AnimatePresence>
                  {!collapsed[group.type] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-1.5"
                    >
                      {group.items.map((entry, idx) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 16 }}
                          transition={{ delay: idx * 0.02 }}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                            currentId === entry.id
                              ? 'bg-cyan-500/10 border-cyan-500/30'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                          onClick={() => selectTrack(entry.id)}
                        >
                          <div className="relative flex-shrink-0">
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
                                className="absolute inset-0 rounded-lg border-2 border-cyan-400"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <span
                              className={`block text-sm truncate ${
                                currentId === entry.id ? 'text-white font-medium' : 'text-gray-300'
                              }`}
                            >
                              {entry.title}
                            </span>
                            <span className="block text-[10px] text-gray-500">
                              {entry.url && !entry.objectUrl ? 'Web link' : 'Local file'}
                            </span>
                          </div>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              void removeEntry(entry.id);
                            }}
                            className="flex-shrink-0 w-6 h-6 rounded-lg opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
