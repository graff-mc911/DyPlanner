import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function FocusTimer() {
  const { t } = useLanguage();
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,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');
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            if (audioRef.current) {
              audioRef.current.play().catch(() => {});
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectDuration = (minutes: number) => {
    setSelectedMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedMinutes * 60);
      setIsCompleted(false);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
    setIsCompleted(false);
  };

  const progress = ((selectedMinutes * 60 - timeLeft) / (selectedMinutes * 60)) * 100;

  return (
    <div className="flex flex-col h-full p-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">{t.focus.title}</h1>
        <p className="text-gray-400">{t.focus.subtitle}</p>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm mb-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            <svg className="w-full h-full transform -rotate-90 relative" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="12"
              />
              <motion.circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 85}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 85}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 85 * (1 - progress / 100)}` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className={`text-6xl font-bold mb-2 ${isCompleted ? 'text-emerald-400' : 'text-white'}`}>
                  {isCompleted ? '🎉' : formatTime(timeLeft)}
                </div>
                {isCompleted && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-emerald-400 font-medium"
                  >
                    {t.focus.complete}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl shadow-blue-500/50 hover:shadow-purple-500/60 transition-all flex items-center justify-center backdrop-blur-xl border border-white/10"
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetTimer}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 text-white shadow-lg transition-all flex items-center justify-center"
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="grid grid-cols-3 gap-3">
            {[5, 15, 25].map((minutes, i) => (
              <motion.button
                key={minutes}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectDuration(minutes)}
                disabled={isRunning}
                className={`py-4 rounded-2xl font-semibold transition-all backdrop-blur-xl ${
                  selectedMinutes === minutes
                    ? 'bg-gradient-to-br from-blue-500/90 to-purple-500/90 text-white shadow-lg shadow-blue-500/50 border border-blue-400/30'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {minutes}{t.focus.minutes}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
