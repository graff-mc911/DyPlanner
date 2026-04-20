import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Video, Upload, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { saveMedia, loadAllMedia, deleteMedia, StoredMedia } from '../utils/mediaDB';

interface MediaEntry extends StoredMedia {
  objectUrl: string;
}

function formatTime(secs: number): string {
  if (!isFinite(secs)) return '0:00';
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
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  const current = entries.find(e => e.id === currentId) ?? null;

  useEffect(() => {
    loadAllMedia().then(items => {
      const loaded = items.map(item => ({
        ...item,
        objectUrl: URL.createObjectURL(item.blob),
      }));
      setEntries(loaded);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => {
      entries.forEach(e => URL.revokeObjectURL(e.objectUrl));
    };
  }, []);

  const applyVolume = useCallback((vol: number) => {
    if (mediaRef.current) mediaRef.current.volume = vol / 100;
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const id = Date.now().toString();
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    const item: StoredMedia = { id, title: file.name.replace(/\.[^/.]+$/, ''), type, blob };
    await saveMedia(item);
    const objectUrl = URL.createObjectURL(blob);
    const entry: MediaEntry = { ...item, objectUrl };
    setEntries(prev => [entry, ...prev]);
    setCurrentId(id);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const selectTrack = (id: string) => {
    if (mediaRef.current) {
      mediaRef.current.pause();
    }
    setCurrentId(id);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const togglePlay = () => {
    const el = mediaRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.volume = volume / 100;
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = mediaRef.current;
    const val = Number(e.target.value);
    if (el && isFinite(el.duration)) {
      el.currentTime = (val / 100) * el.duration;
      setCurrentTime(el.currentTime);
    }
  };

  const skipTrack = (dir: 1 | -1) => {
    if (!currentId || entries.length === 0) return;
    const idx = entries.findIndex(e => e.id === currentId);
    const next = entries[(idx + dir + entries.length) % entries.length];
    selectTrack(next.id);
  };

  const removeEntry = async (id: string) => {
    await deleteMedia(id);
    setEntries(prev => {
      const removed = prev.find(e => e.id === id);
      if (removed) URL.revokeObjectURL(removed.objectUrl);
      return prev.filter(e => e.id !== id);
    });
    if (currentId === id) {
      setCurrentId(null);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    applyVolume(val);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const setMediaRef = useCallback((el: HTMLAudioElement | HTMLVideoElement | null) => {
    mediaRef.current = el;
    if (el) {
      el.volume = volume / 100;
      el.onloadedmetadata = () => setDuration(el.duration);
      el.ontimeupdate = () => setCurrentTime(el.currentTime);
      el.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      el.onplay = () => setIsPlaying(true);
      el.onpause = () => setIsPlaying(false);
    }
  }, [current?.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col h-full p-6 pb-28"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t.player.title}</h1>
        <p className="text-gray-400 text-sm">{t.player.supported}</p>
      </div>

      <input ref={audioFileRef} type="file" accept="audio/*" className="hidden" onChange={e => handleFileUpload(e, 'audio')} />
      <input ref={videoFileRef} type="file" accept="video/*" className="hidden" onChange={e => handleFileUpload(e, 'video')} />

      <div className="grid grid-cols-2 gap-3 mb-5">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => audioFileRef.current?.click()}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Music className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-sm text-gray-300">{t.player.uploadAudio}</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => videoFileRef.current?.click()}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-pink-400" />
          </div>
          <span className="text-sm text-gray-300">{t.player.uploadVideo}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mb-5"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.player.nowPlaying}</p>
            <p className="text-white font-semibold truncate mb-3">{current.title}</p>

            {current.type === 'video' ? (
              <video
                key={current.objectUrl}
                ref={el => setMediaRef(el)}
                src={current.objectUrl}
                className="w-full rounded-2xl mb-3 max-h-44 object-cover bg-black"
              />
            ) : (
              <audio
                key={current.objectUrl}
                ref={el => setMediaRef(el)}
                src={current.objectUrl}
                preload="metadata"
              />
            )}

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 w-8">{formatTime(currentTime)}</span>
              <input
                type="range" min="0" max="100" step="0.1"
                value={progress}
                onChange={handleSeek}
                className="flex-1 accent-blue-500 h-1"
              />
              <span className="text-xs text-gray-500 w-8 text-right">{formatTime(duration)}</span>
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
                  {isPlaying
                    ? <Pause className="w-5 h-5 text-white" />
                    : <Play className="w-5 h-5 text-white ml-0.5" />
                  }
                </motion.button>
                <button onClick={() => skipTrack(1)} className="text-gray-500 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range" min="0" max="100" value={volume}
                  onChange={e => handleVolumeChange(Number(e.target.value))}
                  className="w-16 accent-blue-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-h-0">
        <p className="text-sm font-medium text-gray-400 mb-3">{t.player.playlist}</p>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-gray-600"
          >
            <Upload className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-center text-sm">{t.player.empty}</p>
          </motion.div>
        ) : (
          <div className="space-y-2 overflow-y-auto">
            <AnimatePresence>
              {entries.map(entry => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    currentId === entry.id
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => selectTrack(entry.id)}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    entry.type === 'audio' ? 'bg-blue-500/20' : 'bg-pink-500/20'
                  }`}>
                    {entry.type === 'audio'
                      ? <Music className="w-4 h-4 text-blue-400" />
                      : <Video className="w-4 h-4 text-pink-400" />
                    }
                  </div>
                  <span className="flex-1 text-white text-sm truncate">{entry.title}</span>
                  {currentId === entry.id && isPlaying && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="text-xs text-blue-400 flex-shrink-0"
                    >
                      ▶
                    </motion.span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); removeEntry(entry.id); }}
                    className="flex-shrink-0 w-6 h-6 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-500 hover:text-red-400 transition-all"
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
