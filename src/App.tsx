import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckSquare, Flame, Grid3x3, Globe } from 'lucide-react';
import HabitTracker from './components/HabitTracker';
import DailyPlanner from './components/DailyPlanner';
import FocusTimer from './components/FocusTimer';
import DecisionTool from './components/DecisionTool';
import WelcomeScreen from './components/WelcomeScreen';
import { useLanguage } from './i18n/LanguageContext';
import { languages } from './i18n/translations';

type Tab = 'focus' | 'tasks' | 'habits' | 'decide';

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowWelcome(false);
    }
  }, []);

  const handleDismissWelcome = () => {
    localStorage.setItem('hasVisited', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onDismiss={handleDismissWelcome} />;
  }

  const tabs = [
    { id: 'focus' as Tab, icon: Timer, label: t.tabs.focus },
    { id: 'tasks' as Tab, icon: CheckSquare, label: t.tabs.tasks },
    { id: 'habits' as Tab, icon: Flame, label: t.tabs.habits },
    { id: 'decide' as Tab, icon: Grid3x3, label: t.tabs.decide },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto h-screen flex flex-col relative">
        <div className="fixed top-4 right-4 z-40">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{languages.find(l => l.code === language)?.nativeName}</span>
            </motion.button>

            <AnimatePresence>
              {showLanguageMenu && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowLanguageMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.code}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLanguageMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 transition-colors ${
                          language === lang.code ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-white' : 'text-gray-300'
                        }`}
                      >
                        <div className="font-medium">{lang.nativeName}</div>
                        <div className="text-xs text-gray-500">{lang.name}</div>
                      </motion.button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full overflow-y-auto"
            >
              {activeTab === 'focus' && <FocusTimer />}
              {activeTab === 'tasks' && <DailyPlanner />}
              {activeTab === 'habits' && <HabitTracker />}
              {activeTab === 'decide' && <DecisionTool />}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl px-2 py-2">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-6 py-3 rounded-2xl transition-all"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative flex flex-col items-center gap-1">
                      <Icon
                        className={`w-5 h-5 transition-all ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                      <span
                        className={`text-xs font-medium transition-all ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`}
                      >
                        {tab.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;
