import { motion } from 'framer-motion';
import { Globe, Moon, Sun, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { languages, Language } from '../i18n/translations';

type AppTheme = 'dark' | 'light';

interface SettingsViewProps {
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
}

export default function SettingsView({ theme, onThemeChange }: SettingsViewProps) {
  const { t, language, setLanguage } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col h-full p-6 pb-28"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t.settings.title}</h1>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">{t.settings.themeLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['dark', 'light'] as AppTheme[]).map(th => (
              <motion.button
                key={th}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onThemeChange(th)}
                className={`relative flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  theme === th
                    ? 'bg-blue-500/15 border-blue-500/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {th === 'dark'
                  ? <Moon className="w-5 h-5 text-gray-300" />
                  : <Sun className="w-5 h-5 text-yellow-400" />
                }
                <span className="text-white font-medium text-sm">
                  {th === 'dark' ? t.settings.dark : t.settings.light}
                </span>
                {theme === th && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </section>

        <div className="h-px bg-white/5" />

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">{t.settings.languageLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang, i) => (
              <motion.button
                key={lang.code}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLanguage(lang.code as Language)}
                className={`relative flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  language === lang.code
                    ? 'bg-blue-500/15 border-blue-500/40'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${language === lang.code ? 'text-blue-300' : 'text-white'}`}>
                    {lang.nativeName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{lang.name}</p>
                </div>
                {language === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"
                  >
                    <Check className="w-2.5 h-2.5 text-white" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
