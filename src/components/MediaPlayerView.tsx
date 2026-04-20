import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Video, Upload, X, ListMusic } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { saveMedia, loadAllMedia, deleteMedia, StoredMedia } from '../utils/mediaDB';

interface MediaEntry extends StoredMedia {
  objectUrl: string;
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

  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
  const entriesRef = useRef<MediaEntry[]>([]);
  const currentIdRef = useRef<string | null>(null);
  const volumeRef = useRef(80);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  entriesRef.current = entries;
  currentIdRef.current = currentId;
  volumeRef.current = volume;

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
      entriesRef.current.forEach(e => URL.revokeObjectURL(e.objectUrl));
    };
  }, []);

  const playEntry = useCallback((id: string) => {
    setCurrentId(id);
    currentIdRef.current = id;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const advanceToNext = useCallback(() => {
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
    playEntry(next.id);
  }, [playEntry]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'video') => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    e.target.value = '';
    const newEntries: MediaEntry[] = [];
    for (const file of Array.from(fileList)) {
      const id = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      const item: StoredMedia = { id, title: file.name.replace(/\.[^/.]+$/, ''), type, blob };
      await saveMedia(item);
      newEntries.push({ ...item, objectUrl: URL.createObjectURL(blob) });
    }
    setEntries(prev => {
      const updated = [...prev, ...newEntries];
      return updated;
    });
    if (!currentIdRef.current) {
      playEntry(newEntries[0].id);
    }
  };

  const togglePlay = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
    } else {
      el.volume = volumeRef.current / 100;
      el.play().catch(() => {});
    }
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = mediaRef.current;
    const val = Number(e.target.value);
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
    playEntry(next.id);
  }, [playEntry]);

  const removeEntry = async (id: string) => {
    if (mediaRef.current && currentIdRef.current === id) {
      mediaRef.current.pause();
    }
    await deleteMedia(id);
    setEntries(prev => {
      const removed = prev.find(e => e.id === id);
      if (removed) URL.revokeObjectURL(removed.objectUrl);
      return prev.filter(e => e.id !== id);
    });
    if (currentId === id) {
      const list = entriesRef.current.filter(e => e.id !== id);
      const idx = entriesRef.current.findIndex(e => e.id === id);
      const next = list[idx] ?? list[idx - 1] ?? null;
      setCurrentId(next?.id ?? null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    volumeRef.current = val;
    if (mediaRef.current) mediaRef.current.volume = val / 100;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const setMediaRef = useCallback((el: HTMLAudioElement | HTMLVideoElement | null) => {
    mediaRef.current = el;
    if (!el) return;
    el.volume = volumeRef.current / 100;
    el.onloadedmetadata = () => {
      setDuration(el.duration);
      el.volume = volumeRef.current / 100;
      el.play().catch(() => {});
    };
    el.ontimeupdate = () => setCurrentTime(el.currentTime);
    el.onplay = () => setIsPlaying(true);
    el.onpause = () => setIsPlaying(false);
    el.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      advanceToNext();
    };
  }, [advanceToNext]);

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

      <input ref={audioFileRef} type="file" accept="audio/*" multiple className="hidden"
        onChange={e => handleFileUpload(e, 'audio')} />
      <input ref={videoFileRef} type="file" accept="video/*" multiple className="hidden"
        onChange={e => handleFileUpload(e, 'video')} />

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

            {current.type === 'video' ? (
              <video
                key={current.id}
                ref={el => setMediaRef(el)}
                src={current.objectUrl}
                className="w-full rounded-2xl mb-3 max-h-44 object-cover bg-black"
              />
            ) : (
              <audio
                key={current.id}
                ref={el => setMediaRef(el)}
                src={current.objectUrl}
                preload="auto"
              />
            )}

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-500 tabular-nums w-9">{formatTime(currentTime)}</span>
              <input
                type="range" min="0" max="100" step="0.1"
                value={progress}
                onChange={handleSeek}
                className="flex-1 accent-blue-500"
                style={{ height: '4px' }}
              />
              <span className="text-xs text-gray-500 tabular-nums w-9 text-right">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => skipTrack(-1)}
                  className="text-gray-500 hover:text-white transition-colors">
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
                <button onClick={() => skipTrack(1)}
                  className="text-gray-500 hover:text-white transition-colors">
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
                  onClick={() => playEntry(entry.id)}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      entry.type === 'audio' ? 'bg-blue-500/20' : 'bg-pink-500/20'
                    }`}>
                      {entry.type === 'audio'
                        ? <Music className="w-4 h-4 text-blue-400" />
                        : <Video className="w-4 h-4 text-pink-400" />
                      }
                    </div>
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
                    }`}>{entry.title}</span>
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
