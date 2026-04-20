import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, Music, Video,
  Upload, X, ListMusic, Youtube, Link, Plus, AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  saveMedia, loadAllMedia, deleteMedia, extractYouTubeId, StoredMedia, MediaSourceType,
} from '../utils/mediaDB';

interface MediaEntry extends StoredMedia {
  objectUrl?: string;
}

type AddMode = null | 'youtube' | 'url';

const VIDEO_EXTS = /\.(mp4|webm|ogv|mov|avi|mkv|m4v)(\?|#|$)/i;
const AUDIO_EXTS = /\.(mp3|wav|ogg|flac|aac|m4a|opus|weba)(\?|#|$)/i;

function detectUrlMediaType(url: string): 'audio' | 'video' | 'url' {
  if (VIDEO_EXTS.test(url)) return 'video';
  if (AUDIO_EXTS.test(url)) return 'audio';
  return 'url';
}

async function fetchYouTubeTitle(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.title || null;
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
  if (!isFinite(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function typeIcon(type: MediaSourceType) {
  if (type === 'youtube') return <Youtube className="w-4 h-4 text-red-400" />;
  if (type === 'url') return <Link className="w-4 h-4 text-cyan-400" />;
  if (type === 'video') return <Video className="w-4 h-4 text-pink-400" />;
  return <Music className="w-4 h-4 text-blue-400" />;
}

function typeIconBg(type: MediaSourceType) {
  if (type === 'youtube') return 'bg-red-500/20';
  if (type === 'url') return 'bg-cyan-500/20';
  if (type === 'video') return 'bg-pink-500/20';
  return 'bg-blue-500/20';
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
  const { t } = useLanguage();
  const [entries, setEntries] = useState<MediaEntry[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(true);
  const [addMode, setAddMode] = useState<AddMode>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [fetchingTitle, setFetchingTitle] = useState(false);

  // Persistent refs — audio & video are ALWAYS mounted, never unmounted
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const ytTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const entriesRef = useRef<MediaEntry[]>([]);
  const currentIdRef = useRef<string | null>(null);
  const volumeRef = useRef(80);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const ytApiReady = useRef(false);
  const ytApiLoading = useRef(false);
  const advanceToNextRef = useRef<() => void>(() => {});

  entriesRef.current = entries;
  currentIdRef.current = currentId;
  volumeRef.current = volume;

  const current = entries.find(e => e.id === currentId) ?? null;
  const isYT = current?.type === 'youtube';

  // ── advanceToNext via ref to avoid stale closures ─────────────────
  const advanceToNext = useCallback(() => {
    advanceToNextRef.current();
  }, []);

  useEffect(() => {
    advanceToNextRef.current = () => {
      const list = entriesRef.current;
      const cid = currentIdRef.current;
      if (!cid || list.length === 0) return;
      const idx = list.findIndex(e => e.id === cid);
      if (idx < 0 || idx >= list.length - 1) {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }
      const next = list[idx + 1];
      setCurrentId(next.id);
      currentIdRef.current = next.id;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };
  });

  // ── Wire audio element once on mount ─────────────────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volumeRef.current / 100;
    el.ontimeupdate = () => setCurrentTime(el.currentTime);
    el.ondurationchange = () => { if (isFinite(el.duration)) setDuration(el.duration); };
    el.onplay = () => setIsPlaying(true);
    el.onpause = () => setIsPlaying(false);
    el.onended = () => { setIsPlaying(false); setCurrentTime(0); advanceToNextRef.current(); };
    el.onerror = () => setIsPlaying(false);
  }, []);

  // ── Wire video element once on mount ─────────────────────────────
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = volumeRef.current / 100;
    el.ontimeupdate = () => setCurrentTime(el.currentTime);
    el.ondurationchange = () => { if (isFinite(el.duration)) setDuration(el.duration); };
    el.onplay = () => setIsPlaying(true);
    el.onpause = () => setIsPlaying(false);
    el.onended = () => { setIsPlaying(false); setCurrentTime(0); advanceToNextRef.current(); };
    el.onerror = () => setIsPlaying(false);
  }, []);

  // ── Load persisted media ──────────────────────────────────────────
  useEffect(() => {
    loadAllMedia().then(items => {
      const loaded: MediaEntry[] = items.map(item => ({
        ...item,
        objectUrl: item.blob ? URL.createObjectURL(item.blob) : undefined,
      }));
      setEntries(loaded);
      setLoading(false);
    }).catch(() => setLoading(false));

    return () => {
      entriesRef.current.forEach(e => { if (e.objectUrl) URL.revokeObjectURL(e.objectUrl); });
      if (ytTimerRef.current) clearInterval(ytTimerRef.current);
    };
  }, []);

  // ── YouTube IFrame API ────────────────────────────────────────────
  const loadYTApi = useCallback((): Promise<void> => {
    if (ytApiReady.current && window.YT?.Player) return Promise.resolve();
    return new Promise(resolve => {
      if (window.YT?.Player) { ytApiReady.current = true; resolve(); return; }
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        ytApiReady.current = true;
        if (prev) prev();
        resolve();
      };
      if (!ytApiLoading.current) {
        ytApiLoading.current = true;
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    });
  }, []);

  const destroyYT = useCallback(() => {
    if (ytTimerRef.current) { clearInterval(ytTimerRef.current); ytTimerRef.current = null; }
    if (ytPlayerRef.current) {
      try { ytPlayerRef.current.destroy(); } catch (_) {}
      ytPlayerRef.current = null;
    }
  }, []);

  // ── YouTube player lifecycle ──────────────────────────────────────
  useEffect(() => {
    if (!current || current.type !== 'youtube') { destroyYT(); return; }
    if (!current.url) return;
    const videoId = extractYouTubeId(current.url);
    if (!videoId) return;

    let cancelled = false;
    loadYTApi().then(() => {
      if (cancelled || !ytContainerRef.current) return;
      destroyYT();
      if (cancelled || !ytContainerRef.current) return;
      ytContainerRef.current.innerHTML = '';
      const div = document.createElement('div');
      ytContainerRef.current.appendChild(div);

      ytPlayerRef.current = new window.YT.Player(div, {
        videoId,
        playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (cancelled) return;
            e.target.setVolume(volumeRef.current);
            e.target.playVideo();
            setIsPlaying(true);
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
              advanceToNextRef.current();
            }
          },
        },
      });
    });
    return () => { cancelled = true; };
  }, [current?.id, current?.type, destroyYT, loadYTApi]);

  // ── Audio/video playback on track change ──────────────────────────
  useEffect(() => {
    if (!current || current.type === 'youtube' || current.type === 'url') return;

    const isVideo = current.type === 'video';
    const el = isVideo ? videoRef.current : audioRef.current;
    if (!el) return;

    // Stop the other element
    const other = isVideo ? audioRef.current : videoRef.current;
    if (other) { other.pause(); other.src = ''; }

    const src = current.objectUrl ?? current.url ?? '';
    if (!src) return;

    el.src = src;
    el.volume = volumeRef.current / 100;
    el.load();

    const onCanPlay = () => {
      el.play().catch(() => {});
    };
    el.addEventListener('canplay', onCanPlay, { once: true });

    return () => {
      el.removeEventListener('canplay', onCanPlay);
    };
  }, [current?.id, current?.type]);

  // ── File upload ───────────────────────────────────────────────────
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'audio' | 'video',
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    e.target.value = '';
    const newEntries: MediaEntry[] = [];

    for (const file of Array.from(fileList)) {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const item: StoredMedia = {
        id,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type,
        blob: file,
      };
      await saveMedia(item);
      newEntries.push({ ...item, objectUrl: URL.createObjectURL(file) });
    }

    setEntries(prev => {
      const updated = [...prev, ...newEntries];
      // Auto-select first uploaded if nothing playing
      if (!currentIdRef.current && newEntries.length > 0) {
        const first = newEntries[0];
        setCurrentId(first.id);
        currentIdRef.current = first.id;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
      return updated;
    });
  };

  // ── Add URL / YouTube ─────────────────────────────────────────────
  const handleAddUrl = async () => {
    const raw = inputValue.trim();
    if (!raw || fetchingTitle) return;

    const ytId = extractYouTubeId(raw);
    const effectiveMode = addMode === 'url' && ytId ? 'youtube' : addMode;

    if (effectiveMode === 'youtube') {
      const videoId = ytId ?? extractYouTubeId(raw);
      if (!videoId) { setInputError(true); return; }
      setFetchingTitle(true);
      const fetched = await fetchYouTubeTitle(raw);
      setFetchingTitle(false);
      const title = fetched || `YouTube: ${videoId}`;
      const id = `yt_${Date.now()}`;
      const item: StoredMedia = {
        id, title, type: 'youtube',
        url: raw,
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      };
      await saveMedia(item);
      setEntries(prev => {
        if (!currentIdRef.current) {
          setCurrentId(id);
          currentIdRef.current = id;
          setIsPlaying(false); setCurrentTime(0); setDuration(0);
        }
        return [...prev, { ...item }];
      });
    } else {
      try { new URL(raw); } catch { setInputError(true); return; }
      const detectedType = detectUrlMediaType(raw);
      setFetchingTitle(true);
      const fetched = detectedType === 'url' ? await fetchPageTitle(raw) : null;
      setFetchingTitle(false);
      const fallback = raw.split('/').filter(Boolean).pop()?.split('?')[0] || 'Media';
      const title = fetched || fallback;
      const id = `url_${Date.now()}`;
      const item: StoredMedia = { id, title, type: detectedType, url: raw };
      await saveMedia(item);
      setEntries(prev => {
        if (!currentIdRef.current) {
          setCurrentId(id);
          currentIdRef.current = id;
          setIsPlaying(false); setCurrentTime(0); setDuration(0);
        }
        return [...prev, { ...item }];
      });
    }

    setInputValue('');
    setInputError(false);
    setAddMode(null);
  };

  // ── Controls ──────────────────────────────────────────────────────
  const selectTrack = useCallback((id: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.src = ''; }
    destroyYT();
    setCurrentId(id);
    currentIdRef.current = id;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [destroyYT]);

  const togglePlay = useCallback(() => {
    if (isYT && ytPlayerRef.current) {
      if (isPlaying) ytPlayerRef.current.pauseVideo();
      else ytPlayerRef.current.playVideo();
      return;
    }
    const el = current?.type === 'video' ? videoRef.current : audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
    } else {
      el.volume = volumeRef.current / 100;
      el.play().catch(() => {});
    }
  }, [isPlaying, isYT, current?.type]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (isYT && ytPlayerRef.current) {
      const dur = ytPlayerRef.current.getDuration();
      if (dur > 0) {
        ytPlayerRef.current.seekTo((val / 100) * dur, true);
        setCurrentTime((val / 100) * dur);
      }
      return;
    }
    const el = current?.type === 'video' ? videoRef.current : audioRef.current;
    if (el && isFinite(el.duration)) {
      el.currentTime = (val / 100) * el.duration;
      setCurrentTime(el.currentTime);
    }
  };

  const skipTrack = useCallback((dir: 1 | -1) => {
    const list = entriesRef.current;
    const cid = currentIdRef.current;
    if (!cid || list.length === 0) return;
    const idx = list.findIndex(e => e.id === cid);
    const next = list[(idx + dir + list.length) % list.length];
    selectTrack(next.id);
  }, [selectTrack]);

  const removeEntry = async (id: string) => {
    if (currentIdRef.current === id) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
      if (videoRef.current) { videoRef.current.pause(); videoRef.current.src = ''; }
      destroyYT();
    }
    await deleteMedia(id);
    const removed = entriesRef.current.find(e => e.id === id);
    if (removed?.objectUrl) URL.revokeObjectURL(removed.objectUrl);

    setEntries(prev => {
      const updated = prev.filter(e => e.id !== id);
      if (currentIdRef.current === id) {
        const oldIdx = prev.findIndex(e => e.id === id);
        const next = updated[oldIdx] ?? updated[oldIdx - 1] ?? null;
        setCurrentId(next?.id ?? null);
        currentIdRef.current = next?.id ?? null;
        setIsPlaying(false); setCurrentTime(0); setDuration(0);
      }
      return updated;
    });
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    volumeRef.current = val;
    if (audioRef.current) audioRef.current.volume = val / 100;
    if (videoRef.current) videoRef.current.volume = val / 100;
    if (ytPlayerRef.current) ytPlayerRef.current.setVolume(val);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col h-full p-6 pb-28"
    >
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-white mb-1">{t.player.title}</h1>
        <p className="text-gray-400 text-sm">{t.player.supported}</p>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={audioFileRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={e => handleFileUpload(e, 'audio')}
      />
      <input
        ref={videoFileRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={e => handleFileUpload(e, 'video')}
      />

      {/*
        Persistent media elements — ALWAYS in DOM, never conditionally unmounted.
        Visibility controlled via CSS only. This ensures refs are always valid.
      */}
      <audio ref={audioRef} preload="auto" style={{ display: 'none' }} />
      <video
        ref={videoRef}
        playsInline
        style={{ display: 'none' }}
        className="w-full rounded-2xl mb-3 max-h-52 object-contain bg-black"
      />

      {/* Action buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => audioFileRef.current?.click()}
          className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Music className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs text-gray-400 text-center leading-tight">{t.player.uploadAudio}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => videoFileRef.current?.click()}
          className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Video className="w-4 h-4 text-pink-400" />
          </div>
          <span className="text-xs text-gray-400 text-center leading-tight">{t.player.uploadVideo}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setAddMode(m => m === 'youtube' ? null : 'youtube');
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
            setAddMode(m => m === 'url' ? null : 'url');
            setInputValue('');
            setInputError(false);
          }}
          className={`border rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all ${
            addMode === 'url'
              ? 'bg-cyan-500/15 border-cyan-500/40'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Link className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-xs text-gray-400 text-center leading-tight">{t.player.addUrl}</span>
        </motion.button>
      </div>

      {/* URL input */}
      <AnimatePresence>
        {addMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className={`flex gap-2 p-3 rounded-2xl border ${
              inputError
                ? 'border-red-500/50 bg-red-500/5'
                : addMode === 'youtube'
                  ? 'border-red-500/30 bg-red-500/5'
                  : 'border-cyan-500/30 bg-cyan-500/5'
            }`}>
              <input
                type="text"
                value={inputValue}
                onChange={e => { setInputValue(e.target.value); setInputError(false); }}
                onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
                placeholder={addMode === 'youtube' ? t.player.youtubePlaceholder : t.player.urlPlaceholder}
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
                autoFocus
              />
              {inputError && (
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 self-center" />
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
                {fetchingTitle
                  ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  : <Plus className="w-3 h-3" />
                }
                {fetchingTitle ? t.player.loading : t.player.add}
              </button>
            </div>
            {inputError && (
              <p className="text-xs text-red-400 mt-1 ml-3">{t.player.invalidUrl}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Now playing */}
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mb-5"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.player.nowPlaying}</p>
            <p className="text-white font-semibold truncate mb-3">{current.title}</p>

            {/* YouTube player container */}
            <div
              ref={ytContainerRef}
              className="w-full rounded-2xl mb-3 overflow-hidden bg-black"
              style={{
                aspectRatio: '16/9',
                display: current.type === 'youtube' ? 'block' : 'none',
              }}
            />

            {/* Video element — moved from hidden to visible when needed */}
            {current.type === 'video' && (() => {
              // Make the persistent video element visible inside the player card
              // We use a portal-like trick: render a placeholder and sync via JS
              // Instead, we just show/hide via the ref style in a useEffect
              return null;
            })()}

            {/* Seek + time */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500 tabular-nums w-9">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="flex-1 accent-blue-500"
                style={{ height: '4px' }}
              />
              <span className="text-xs text-gray-500 tabular-nums w-9 text-right">
                {formatTime(duration)}
              </span>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => skipTrack(-1)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40"
                >
                  {isPlaying
                    ? <Pause className="w-5 h-5 text-white" />
                    : <Play className="w-5 h-5 text-white ml-0.5" />
                  }
                </motion.button>
                <button
                  onClick={() => skipTrack(1)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={e => handleVolumeChange(Number(e.target.value))}
                  className="w-16 accent-blue-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*
        Video element display — shown here so it's always in the DOM but
        repositioned visually. We control visibility via a useEffect.
      */}
      <VideoDisplay
        videoRef={videoRef}
        isVideo={current?.type === 'video'}
        currentId={current?.id ?? null}
      />

      {/* Playlist */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <ListMusic className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-400">{t.player.playlist}</p>
          {entries.length > 0 && (
            <span className="text-xs text-gray-600 ml-auto">{entries.length}</span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-gray-600"
          >
            <Upload className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-center text-sm">{t.player.empty}</p>
          </motion.div>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1">
            <AnimatePresence>
              {entries.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group ${
                    currentId === entry.id
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => selectTrack(entry.id)}
                >
                  <div className="relative flex-shrink-0">
                    {entry.type === 'youtube' && entry.thumbnail ? (
                      <div className="w-10 h-8 rounded-lg overflow-hidden bg-black">
                        <img
                          src={entry.thumbnail}
                          alt=""
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeIconBg(entry.type)}`}>
                        {typeIcon(entry.type)}
                      </div>
                    )}
                    {currentId === entry.id && isPlaying && (
                      <motion.div
                        className="absolute inset-0 rounded-lg border-2 border-blue-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm truncate block ${
                      currentId === entry.id ? 'text-white font-medium' : 'text-gray-300'
                    }`}>
                      {entry.title}
                    </span>
                    <span className="text-xs text-gray-600 capitalize">{entry.type}</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); removeEntry(entry.id); }}
                    className="flex-shrink-0 w-6 h-6 rounded-lg opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── VideoDisplay ──────────────────────────────────────────────────────
// Keeps the <video> always in the DOM (so videoRef is always valid),
// but shows/hides it and moves it visually based on current track type.
interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isVideo: boolean;
  currentId: string | null;
}

function VideoDisplay({ videoRef, isVideo, currentId }: VideoDisplayProps) {
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.style.display = isVideo ? 'block' : 'none';
  }, [isVideo, currentId, videoRef]);

  return null;
}
