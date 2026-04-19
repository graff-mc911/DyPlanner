import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface WelcomeScreenProps {
  onDismiss: () => void;
}

export default function WelcomeScreen({ onDismiss }: WelcomeScreenProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-black animate-gradient" />

      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-blue-500/50 mb-8 relative animate-pulse-glow">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 blur-xl opacity-60 animate-pulse" />
            <Sparkles className="w-12 h-12 text-white relative z-10" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            FOCUS ONE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-3xl md:text-4xl font-light text-gray-200 mb-3"
          >
            {t.welcome.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xl text-gray-400"
          >
            {t.welcome.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 gap-4 text-sm">
            {['Clarity', 'Focus', 'Decisions', 'Flow'].map((word, i) => (
              <motion.div
                key={word}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl py-3 px-4"
              >
                <span className="text-gray-300 font-medium">{word}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDismiss}
          className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg py-6 rounded-2xl shadow-2xl shadow-blue-500/50 hover:shadow-purple-500/60 transition-all relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10">{t.welcome.button}</span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          className="text-gray-500 text-sm mt-8"
        >
          {t.footer}
        </motion.p>
      </motion.div>
    </div>
  );
}
