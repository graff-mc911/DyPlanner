import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useSettingsStore } from './stores/settingsStore'
import { Layout } from './components/layout/Layout'
import { HomePage } from './components/pages/HomePage'
import { PlannerPage } from './components/planner/PlannerPage'
import { ReaderPage } from './components/reader/ReaderPage'
import { PlayerPage } from './components/player/PlayerPage'
import { SettingsPage } from './components/settings/SettingsPage'

function App() {
  const { theme, language } = useSettingsStore()

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'oled', 'sepia')
    document.documentElement.classList.add(theme)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [theme, language])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/reader" element={<ReaderPage />} />
          <Route path="/player" element={<PlayerPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App