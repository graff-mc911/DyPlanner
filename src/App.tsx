import { useState } from 'react'
import { LayoutGrid, Calendar, BookOpen, Music, Settings } from 'lucide-react'
import { Planner } from './components/Planner'
import { Reader } from './components/Reader'
import { Player } from './components/Player'
import { SettingsPanel } from './components/Settings'

type View = 'home' | 'planner' | 'reader' | 'player' | 'settings'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [language, setLanguage] = useState<'uk' | 'en'>('uk')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const t = {
    uk: {
      title: 'DyPlanner Universal',
      planner: 'Планер',
      reader: 'Читалка',
      player: 'Плеєр',
      settings: 'Налаштування',
      back: '← Назад'
    },
    en: {
      title: 'DyPlanner Universal',
      planner: 'Planner',
      reader: 'Reader',
      player: 'Player',
      settings: 'Settings',
      back: '← Back'
    }
  }[language]

  if (view !== 'home') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
        <div className="p-4">
          <button
            onClick={() => setView('home')}
            className="mb-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-white transition-colors"
          >
            {t.back}
          </button>
          
          {view === 'planner' && <Planner language={language} />}
          {view === 'reader' && <Reader language={language} />}
          {view === 'player' && <Player language={language} />}
          {view === 'settings' && (
            <SettingsPanel 
              language={language} 
              setLanguage={setLanguage}
              theme={theme}
              setTheme={setTheme}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 pt-8">{t.title}</h1>
        
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-200px)] min-h-[400px]">
          {/* Planner */}
          <button
            onClick={() => setView('planner')}
            className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all hover:scale-[1.02]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Calendar size={64} className="mb-4" />
              <span className="text-2xl font-bold">{t.planner}</span>
            </div>
          </button>

          {/* Reader */}
          <button
            onClick={() => setView('reader')}
            className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.02]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <BookOpen size={64} className="mb-4" />
              <span className="text-2xl font-bold">{t.reader}</span>
            </div>
          </button>

          {/* Player */}
          <button
            onClick={() => setView('player')}
            className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all hover:scale-[1.02]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Music size={64} className="mb-4" />
              <span className="text-2xl font-bold">{t.player}</span>
            </div>
          </button>

          {/* Settings */}
          <button
            onClick={() => setView('settings')}
            className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 transition-all hover:scale-[1.02]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Settings size={64} className="mb-4" />
              <span className="text-2xl font-bold">{t.settings}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}