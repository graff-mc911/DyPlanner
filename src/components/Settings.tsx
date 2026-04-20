import { Globe, Moon, Sun } from 'lucide-react'

interface SettingsProps {
  language: 'uk' | 'en'
  setLanguage: (lang: 'uk' | 'en') => void
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

export function SettingsPanel({ language, setLanguage, theme, setTheme }: SettingsProps) {
  const t = {
    uk: {
      title: 'Налаштування',
      language: 'Мова',
      theme: 'Тема',
      dark: 'Темна',
      light: 'Світла'
    },
    en: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light'
    }
  }[language]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t.title}</h2>

      {/* Language */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={20} className="text-sky-500" />
          <span className="font-medium">{t.language}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setLanguage('uk')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              language === 'uk' 
                ? 'border-sky-500 bg-sky-500/20' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            🇺🇦 Українська
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-lg border-2 transition-colors ${
              language === 'en' 
                ? 'border-sky-500 bg-sky-500/20' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Theme */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          {theme === 'dark' ? <Moon size={20} className="text-violet-500" /> : <Sun size={20} className="text-yellow-500" />}
          <span className="font-medium">{t.theme}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
              theme === 'dark' 
                ? 'border-violet-500 bg-violet-500/20' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <Moon size={18} />
            {t.dark}
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center gap-2 ${
              theme === 'light' 
                ? 'border-yellow-500 bg-yellow-500/20' 
                : 'border-slate-700 hover:border-slate-600'
            }`}
          >
            <Sun size={18} />
            {t.light}
          </button>
        </div>
      </div>
    </div>
  )
}