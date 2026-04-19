import { useState, useEffect } from 'react';
import { Flame, Plus, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  streak: number;
}

export default function HabitTracker() {
  const { t } = useLanguage();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('habits');
    if (stored) {
      setHabits(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const addHabit = () => {
    if (newHabitName.trim() && habits.length < 6) {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        completedDates: [],
        streak: 0,
      };
      setHabits([...habits, newHabit]);
      setNewHabitName('');
      setIsAdding(false);
    }
  };

  const toggleHabit = (id: string) => {
    const today = getTodayString();
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const isCompletedToday = habit.completedDates.includes(today);
        let newCompletedDates: string[];
        let newStreak: number;

        if (isCompletedToday) {
          newCompletedDates = habit.completedDates.filter(date => date !== today);
          newStreak = Math.max(0, habit.streak - 1);
        } else {
          newCompletedDates = [...habit.completedDates, today];
          newStreak = habit.streak + 1;
        }

        return {
          ...habit,
          completedDates: newCompletedDates,
          streak: newStreak,
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const isCompletedToday = (habit: Habit) => {
    return habit.completedDates.includes(getTodayString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full p-6 pb-24"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t.habits.title}</h1>
        <p className="text-gray-400">Build consistency, one day at a time</p>
      </div>

      <div className="space-y-3 flex-1">
        <AnimatePresence mode="popLayout">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all shadow-lg"
            >
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={() => toggleHabit(habit.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isCompletedToday(habit)
                      ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/50'
                      : 'bg-white/5 backdrop-blur-xl hover:bg-white/10 border-2 border-white/20'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isCompletedToday(habit) && (
                      <motion.svg
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="flex-1">
                  <motion.h3
                    animate={{
                      opacity: isCompletedToday(habit) ? 0.7 : 1,
                      textDecoration: isCompletedToday(habit) ? 'line-through' : 'none'
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-white font-medium"
                  >
                    {habit.name}
                  </motion.h3>
                  <div className="flex items-center gap-2 mt-1">
                    <motion.div
                      animate={{
                        scale: habit.streak > 0 ? [1, 1.2, 1] : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Flame className={`w-4 h-4 ${habit.streak > 0 ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]' : 'text-gray-500'}`} />
                    </motion.div>
                    <span className={`text-sm ${habit.streak > 0 ? 'text-orange-300 font-medium' : 'text-gray-400'}`}>
                      {habit.streak} {t.habits.days} {t.habits.streak}
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={() => deleteHabit(habit.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 backdrop-blur-xl hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-gray-400 hover:text-red-400 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {habits.length < 6 && !isAdding && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: habits.length * 0.05 + 0.1 }}
            onClick={() => setIsAdding(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300"
          >
            <Plus className="w-5 h-5" />
            <span>{t.habits.addButton}</span>
          </motion.button>
        )}

        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 shadow-lg"
            >
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                placeholder={t.habits.placeholder}
                className="w-full bg-white/5 backdrop-blur-xl text-white rounded-xl px-4 py-3 border border-white/10 focus:border-blue-500/50 focus:outline-none mb-3 placeholder-gray-500"
                autoFocus
              />
              <div className="flex gap-2">
                <motion.button
                  onClick={addHabit}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl py-2 font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all backdrop-blur-xl"
                >
                  Add
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsAdding(false);
                    setNewHabitName('');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-white/5 backdrop-blur-xl text-gray-300 rounded-xl py-2 font-medium hover:bg-white/10 border border-white/10 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {habits.length === 0 && !isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="text-center text-gray-500">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="text-6xl mb-4"
            >
              🎯
            </motion.div>
            <p className="text-lg">No habits yet</p>
            <p className="text-sm mt-2">Add your first habit to get started</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
