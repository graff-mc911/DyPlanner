import { Globe, Moon, Sun } from 'lucide-react'

interface SettingsProps {
  language: string
  setLanguage: (lang: string) => void
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

// Всі 24 мови
const languages = [
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' }
]

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
    },
    es: {
      title: 'Configuración',
      language: 'Idioma',
      theme: 'Tema',
      dark: 'Oscuro',
      light: 'Claro'
    },
    fr: {
      title: 'Paramètres',
      language: 'Langue',
      theme: 'Thème',
      dark: 'Sombre',
      light: 'Clair'
    },
    de: {
      title: 'Einstellungen',
      language: 'Sprache',
      theme: 'Thema',
      dark: 'Dunkel',
      light: 'Hell'
    },
    it: {
      title: 'Impostazioni',
      language: 'Lingua',
      theme: 'Tema',
      dark: 'Scuro',
      light: 'Chiaro'
    },
    pt: {
      title: 'Configurações',
      language: 'Idioma',
      theme: 'Tema',
      dark: 'Escuro',
      light: 'Claro'
    },
    pl: {
      title: 'Ustawienia',
      language: 'Język',
      theme: 'Motyw',
      dark: 'Ciemny',
      light: 'Jasny'
    },
    ru: {
      title: 'Настройки',
      language: 'Язык',
      theme: 'Тема',
      dark: 'Тёмная',
      light: 'Светлая'
    },
    ja: {
      title: '設定',
      language: '言語',
      theme: 'テーマ',
      dark: 'ダーク',
      light: 'ライト'
    },
    zh: {
      title: '设置',
      language: '语言',
      theme: '主题',
      dark: '深色',
      light: '浅色'
    },
    ko: {
      title: '설정',
      language: '언어',
      theme: '테마',
      dark: '다크',
      light: '라이트'
    },
    ar: {
      title: 'الإعدادات',
      language: 'اللغة',
      theme: 'السمة',
      dark: 'داكن',
      light: 'فاتح'
    },
    hi: {
      title: 'सेटिंग्स',
      language: 'भाषा',
      theme: 'थीम',
      dark: 'डार्क',
      light: 'लाइट'
    },
    tr: {
      title: 'Ayarlar',
      language: 'Dil',
      theme: 'Tema',
      dark: 'Koyu',
      light: 'Açık'
    },
    nl: {
      title: 'Instellingen',
      language: 'Taal',
      theme: 'Thema',
      dark: 'Donker',
      light: 'Licht'
    },
    sv: {
      title: 'Inställningar',
      language: 'Språk',
      theme: 'Tema',
      dark: 'Mörk',
      light: 'Ljus'
    },
    cs: {
      title: 'Nastavení',
      language: 'Jazyk',
      theme: 'Motiv',
      dark: 'Tmavý',
      light: 'Světlý'
    },
    ro: {
      title: 'Setări',
      language: 'Limbă',
      theme: 'Temă',
      dark: 'Întunecat',
      light: 'Deschis'
    },
    hu: {
      title: 'Beállítások',
      language: 'Nyelv',
      theme: 'Téma',
      dark: 'Sötét',
      light: 'Világos'
    },
    bg: {
      title: 'Настройки',
      language: 'Език',
      theme: 'Тема',
      dark: 'Тъмна',
      light: 'Светла'
    },
    hr: {
      title: 'Postavke',
      language: 'Jezik',
      theme: 'Tema',
      dark: 'Tamna',
      light: 'Svijetla'
    },
    sk: {
      title: 'Nastavenia',
      language: 'Jazyk',
      theme: 'Téma',
      dark: 'Tmavá',
      light: 'Svetlá'
    },
    lt: {
      title: 'Nustatymai',
      language: 'Kalba',
      theme: 'Tema',
      dark: 'Tamsi',
      light: 'Šviesi'
    }
  }[language] || t.en

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t.title}</h2>

      {/* Мова */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={20} className="text-sky-500" />
          <span className="font-medium">{t.language}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-lg border-2 transition-colors text-left ${
                language === lang.code 
                  ? 'border-sky-500 bg-sky-500/20' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <span className="mr-2">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Тема */}
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