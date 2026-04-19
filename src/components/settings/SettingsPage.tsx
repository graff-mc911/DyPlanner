import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../stores/settingsStore'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import type { LanguageCode } from '../types'

const ALL_LANGUAGES: { code: LanguageCode; nativeName: string }[] = [
  { code: 'uk', nativeName: 'Українська' },
  { code: 'en', nativeName: 'English' },
  { code: 'es', nativeName: 'Español' },
  { code: 'fr', nativeName: 'Français' },
  { code: 'de', nativeName: 'Deutsch' },
  { code: 'it', nativeName: 'Italiano' },
  { code: 'pt', nativeName: 'Português' },
  { code: 'pl', nativeName: 'Polski' },
  { code: 'ru', nativeName: 'Русский' },
  { code: 'ja', nativeName: '日本語' },
  { code: 'zh', nativeName: '中文' },
  { code: 'ko', nativeName: '한국어' },
  { code: 'ar', nativeName: 'العربية' },
  { code: 'hi', nativeName: 'हिन्दी' },
  { code: 'tr', nativeName: 'Türkçe' },
  { code: 'nl', nativeName: 'Nederlands' },
  { code: 'sv', nativeName: 'Svenska' },
  { code: 'cs', nativeName: 'Čeština' },
  { code: 'ro', nativeName: 'Română' },
  { code: 'hu', nativeName: 'Magyar' },
  { code: 'bg', nativeName: 'Български' },
  { code: 'hr', nativeName: 'Hrvatski' },
  { code: 'sk', nativeName: 'Slovenčina' },
  { code: 'lt', nativeName: 'Lietuvių' },
]

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { language, theme, setLanguage, setTheme, reset } = useSettingsStore()

  const themes = [
    { id: 'light', name: t('common.light') },
    { id: 'dark', name: t('common.dark') },
    { id: 'oled', name: t('common.oled') },
    { id: 'sepia', name: t('common.sepia') },
  ]

  const handleSetLanguage = (code: LanguageCode) => {
    setLanguage(code)
    i18n.changeLanguage(code)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-100">{t('settings.title')}</h1>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">{t('settings.language')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ALL_LANGUAGES.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? 'default' : 'outline'}
              onClick={() => handleSetLanguage(lang.code)}
              className="justify-start"
            >
              {lang.nativeName}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">{t('settings.theme')}</h2>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((th) => (
            <Button
              key={th.id}
              variant={theme === th.id ? 'default' : 'outline'}
              onClick={() => setTheme(th.id as 'light' | 'dark' | 'oled' | 'sepia')}
              className="justify-start"
            >
              {th.name}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-red-400">{t('common.reset')}</h2>
        <p className="text-slate-400 mb-4">{t('settings.resetDesc')}</p>
        <Button variant="destructive" onClick={reset}>
          {t('common.reset')}
        </Button>
      </Card>
    </div>
  )
}
