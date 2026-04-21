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
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { saveMedia, loadAllMedia, deleteMedia } from '../utils/mediaDB';
import type { StoredMedia, MediaSourceType } from '../utils/mediaDB';

interface MediaEntry extends StoredMedia {
  objectUrl?: string;
}

type PlayableMediaType = Extract<MediaSourceType, 'audio' | 'video'>;
type UploadKind = 'audio' | 'video' | 'mixed';

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

const SUPPORTED_HINT = 'MP3, WAV, OGG, MP4, WEBM - Google Drive / iCloud / Dropbox / OneDrive';
const CLOUD_HINT =
  'Cloud files: tap "Cloud" and choose media from Google Drive, iCloud, Dropbox, OneDrive, or local storage.';
const EMPTY_HINT = 'No media yet. Add audio or video from your device or cloud.';

function isPlayableType(type: MediaSourceType): type is PlayableMediaType {
  return type === 'audio' || type === 'video';
}

function detectUrlMediaTypeByExt(url: string): 'audio' | 'video' | null {
  if (VIDEO_EXTS.test(url)) return 'video';
  if (AUDIO_EXTS.test(url)) return 'audio';
  return null;
}

function detectLocalFileType(
  file: File,
  fallback?: 'audio' | 'video'
): 'audio' | 'video' | null {
  const mime = file.type.toLowerCase();
  if (mime.startsWith('audio/')) return 'audio';
  if (mime.startsWith('video/')) return 'video';

  const byExt = detectUrlMediaTypeByExt(file.name);
  if (byExt) return byExt;

  return fallback ?? null;
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

  const audioEl = useRef<HTMLAudioElement | null>(null);
  const videoEl = useRef<HTMLVideoElement | null>(null);
  const entriesRef = useRef<MediaEntry[]>([]);
  const currentIdRef = useRef<string | null>(null);
  const volumeRef = useRef(80);
  const isIOS = isIOSDevice();

  entriesRef.current = entries;
  currentIdRef.current = currentId;
  volumeRef.current = volume;

  const current = entries.find(entry => entry.id === currentId) ?? null;

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

  const advanceToNext = useCallback(() => {
    const list = entriesRef.current;
    const cid = currentIdRef.current;
    if (!cid || list.length === 0) return;

    const idx = list.findIndex(item => item.id === cid);
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
  }, []);

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
    el.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      advanceToNext();
    };
    el.onerror = () => setIsPlaying(false);

    return () => {
      el.ontimeupdate = null;
      el.ondurationchange = null;
      el.onplay = null;
      el.onpause = null;
      el.onended = null;
      el.onerror = null;
    };
  }, [advanceToNext]);

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
    },
    [advanceToNext]
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
      const next = list[(idx + dir + list.length) % list.length];
      selectTrack(next.id);
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
        <h1 className="text-3xl font-bold text-white mb-1">{t.player.title}</h1>
        <p className="text-gray-400 text-sm">{SUPPORTED_HINT}</p>
        <p className="text-gray-500 text-xs mt-1">{CLOUD_HINT}</p>
        {isIOS && (
          <p className="text-amber-300/80 text-xs mt-1">
            iPhone/iPad: choose files in the system picker. Keep cloud provider app installed and enabled in Files.
          </p>
        )}
        {fileError && (
          <p className="text-xs text-amber-300/90 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {fileError}
          </p>
        )}
      </div>

      <input
        id="audio-upload"
        type="file"
        accept={AUDIO_ACCEPT}
        multiple
        className="sr-only"
        onChange={e => handleFileUpload(e, 'audio')}
      />

      <input
        id="video-upload"
        type="file"
        accept={VIDEO_ACCEPT}
        multiple
        className="sr-only"
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

      <div className="grid grid-cols-3 gap-2 mb-4">
        <motion.label
          htmlFor="audio-upload"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Music className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-xs text-gray-400 text-center leading-tight">{t.player.uploadAudio}</span>
        </motion.label>

        <motion.label
          htmlFor="video-upload"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Video className="w-4 h-4 text-pink-400" />
          </div>
          <span className="text-xs text-gray-400 text-center leading-tight">{t.player.uploadVideo}</span>
        </motion.label>

        <motion.label
          htmlFor="cloud-upload"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Cloud className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-xs text-gray-400 text-center leading-tight">Cloud</span>
        </motion.label>
      </div>

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

            {current.type === 'video' && (
              <video
                key={current.id}
                ref={setVideoRef}
                playsInline
                className="w-full rounded-2xl mb-3 max-h-52 object-contain bg-black"
              />
            )}

            {current.type === 'audio' && isPlaying && (
              <div className="flex items-end justify-center gap-0.5 h-8 mb-3">
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-blue-500/70"
                    animate={{ height: ['20%', `${30 + Math.random() * 70}%`, '20%'] }}
                    transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.04 }}
                  />
                ))}
              </div>
            )}

            {current.type === 'audio' && !isPlaying && (
              <div className="flex items-end justify-center gap-0.5 h-8 mb-3">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="w-1 rounded-full bg-white/10" style={{ height: '20%' }} />
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
                className="flex-1 accent-blue-500"
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
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40"
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

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <ListMusic className="w-4 h-4 text-gray-500" />
          <p className="text-sm font-medium text-gray-400">{t.player.playlist}</p>
          {entries.length > 0 && <span className="text-xs text-gray-600 ml-auto">{entries.length}</span>}
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
                              ? 'bg-blue-500/10 border-blue-500/30'
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
                                className="absolute inset-0 rounded-lg border-2 border-blue-400"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                          </div>

                          <span
                            className={`flex-1 text-sm truncate ${
                              currentId === entry.id ? 'text-white font-medium' : 'text-gray-300'
                            }`}
                          >
                            {entry.title}
                          </span>

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
