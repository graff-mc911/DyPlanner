import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../stores/settingsStore'
import { Card } from '../common/Card'
import { Button } from '../common/Button'

export function SettingsPage() {
  const { t } = useTranslation()
  const { language, theme, setLanguage, setTheme, reset } = useSettingsStore()

  const themes = [
    { id: 'light', name: t('common.light'), color: 'bg-white' },
    { id: 'dark', name: t('common.dark'), color: 'bg-slate-950' },
    { id: 'oled', name: t('common.oled'), color: 'bg-black' },
    { id: 'sepia', name: t('common.sepia'), color: 'bg-[#f4ecd8]' },
  ]

  const languages = [
    { code: 'uk', name: 'Українська' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-100">{t('settings.title')}</h1>
      
      {/* Language */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">{t('settings.language')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? 'default' : 'outline'}
              onClick={() => setLanguage(lang.code as any)}
              className="justify-start"
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Theme */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">{t('settings.theme')}</h2>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => (
            <Button
              key={t.id}
              variant={theme === t.id ? 'default' : 'outline'}
              onClick={() => setTheme(t.id as any)}
              className="justify-start"
            style={{ backgroundColor: t.color }}
            <span style={{ color: t.id === 'light' ? '#000' : '#fff' }}>
                {t.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Reset */}
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