import { useState } from 'react'
import { Timer, CheckSquare, Flame, HelpCircle } from 'lucide-react'
import WelcomeScreen from './components/WelcomeScreen'
import FocusTimer from './components/FocusTimer'
import DailyPlanner from './components/DailyPlanner'
import HabitTracker from './components/HabitTracker'
import DecisionTool from './components/DecisionTool'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'

type Tab = 'focus' | 'tasks' | 'habits' | 'decide'

function AppContent() {
  const { t } = useLanguage()
  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem('focus_one_visited')
  })
  const [activeTab, setActiveTab] = useState<Tab>('focus')

  const handleDismissWelcome = () => {
    localStorage.setItem('focus_one_visited', 'true')
    setShowWelcome(false)
  }

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'focus', icon: <Timer className="w-5 h-5" />, label: t.tabs.focus },
    { id: 'tasks', icon: <CheckSquare className="w-5 h-5" />, label: t.tabs.tasks },
    { id: 'habits', icon: <Flame className="w-5 h-5" />, label: t.tabs.habits },
    { id: 'decide', icon: <HelpCircle className="w-5 h-5" />, label: t.tabs.decide },
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-md mx-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-black to-black pointer-events-none" />

      {showWelcome && <WelcomeScreen onDismiss={handleDismissWelcome} />}

      <div className="flex-1 overflow-auto relative z-10 pb-20">
        {activeTab === 'focus' && <FocusTimer />}
        {activeTab === 'tasks' && <DailyPlanner />}
        {activeTab === 'habits' && <HabitTracker />}
        {activeTab === 'decide' && <DecisionTool />}
      </div>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-black/80 backdrop-blur-xl border-t border-white/10 z-20">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-3 gap-1 transition-all ${
                activeTab === tab.id
                  ? 'text-blue-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.icon}
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}
