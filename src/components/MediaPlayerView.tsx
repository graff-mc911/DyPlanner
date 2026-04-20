import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Video, Upload, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface MediaFile {
  id: string;
  title: string;
  file: File | null;
  type: 'audio' | 'video';
}

export default function MediaPlayerView() {
  const { t } = useLanguage();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [currentFile, setCurrentFile] = useState<MediaFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mediaFile: MediaFile = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      file,
      type,
    };
    setFiles(prev => [mediaFile, ...prev]);
    setCurrentFile(mediaFile);
    setIsPlaying(false);
    setProgress(0);
    e.target.value = '';
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.volume = volume / 100;
        audioRef.current.play().catch(() => {});
      }
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.volume = volume / 100;
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (currentFile?.id === id) {
      setCurrentFile(null);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val / 100;
    if (videoRef.current) videoRef.current.volume = val / 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col h-full p-6 pb-28"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t.player.title}</h1>
        <p className="text-gray-400">{t.player.supported}</p>
      </div>

      <input ref={audioFileRef} type="file" accept="audio/*" className="hidden" onChange={e => handleFileUpload(e, 'audio')} />
      <input ref={videoFileRef} type="file" accept="video/*" className="hidden" onChange={e => handleFileUpload(e, 'video')} />

      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => audioFileRef.current?.click()}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 hover:border-white/20 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Music className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-sm text-gray-300">{t.player.uploadAudio}</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
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
        {currentFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mb-6"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t.player.nowPlaying}</p>
            <p className="text-white font-semibold truncate mb-4">{currentFile.title}</p>

            {currentFile.type === 'video' && currentFile.file && (
              <video
                ref={videoRef}
                src={URL.createObjectURL(currentFile.file)}
                className="w-full rounded-2xl mb-4 max-h-48 object-cover"
                onTimeUpdate={e => {
                  const el = e.target as HTMLVideoElement;
                  if (el.duration) setProgress((el.currentTime / el.duration) * 100);
                }}
                onEnded={() => setIsPlaying(false)}
              />
            )}

            {currentFile.type === 'audio' && currentFile.file && (
              <audio
                ref={audioRef}
                src={URL.createObjectURL(currentFile.file)}
                onTimeUpdate={e => {
                  const el = e.target as HTMLAudioElement;
                  if (el.duration) setProgress((el.currentTime / el.duration) * 100);
                }}
                onEnded={() => setIsPlaying(false)}
              />
            )}

            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40"
                >
                  {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
                </motion.button>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range" min="0" max="100" value={volume}
                  onChange={e => handleVolumeChange(Number(e.target.value))}
                  className="w-20 accent-blue-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-400 mb-3">{t.player.playlist}</p>
        {files.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-gray-600"
          >
            <Upload className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-center">{t.player.empty}</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {files.map(file => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    currentFile?.id === file.id
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => { setCurrentFile(file); setIsPlaying(false); setProgress(0); }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    file.type === 'audio' ? 'bg-blue-500/20' : 'bg-pink-500/20'
                  }`}>
                    {file.type === 'audio'
                      ? <Music className="w-4 h-4 text-blue-400" />
                      : <Video className="w-4 h-4 text-pink-400" />
                    }
                  </div>
                  <span className="flex-1 text-white text-sm truncate">{file.title}</span>
                  {currentFile?.id === file.id && isPlaying && (
                    <span className="text-xs text-blue-400 flex-shrink-0">▶</span>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); removeFile(file.id); }}
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
