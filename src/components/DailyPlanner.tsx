import { useState, useEffect } from 'react';
import { Plus, GripVertical, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export default function DailyPlanner() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [lastDate, setLastDate] = useState('');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  useEffect(() => {
    const stored = localStorage.getItem('dailyTasks');
    const storedDate = localStorage.getItem('dailyTasksDate');
    const today = getTodayString();

    if (stored && storedDate === today) {
      setTasks(JSON.parse(stored));
      setLastDate(storedDate);
    } else {
      setTasks([]);
      setLastDate(today);
      localStorage.setItem('dailyTasksDate', today);
    }
  }, []);

  useEffect(() => {
    const today = getTodayString();
    if (today !== lastDate) {
      setTasks([]);
      setLastDate(today);
      localStorage.setItem('dailyTasksDate', today);
      localStorage.setItem('dailyTasks', JSON.stringify([]));
    } else {
      localStorage.setItem('dailyTasks', JSON.stringify(tasks));
    }
  }, [tasks, lastDate]);

  const addTask = () => {
    if (newTaskText.trim() && tasks.length < 5) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        order: tasks.length,
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
      setIsAdding(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id).map((task, index) => ({
      ...task,
      order: index,
    })));
  };

  const handleDragStart = (id: string) => {
    setDraggedTask(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (!draggedTask || draggedTask === id) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTask);
    const targetIndex = tasks.findIndex(t => t.id === id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, removed);

    setTasks(newTasks.map((task, index) => ({ ...task, order: index })));
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col h-full p-6 pb-24"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{t.tasks.title}</h1>
        <motion.p
          key={completedCount}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-400"
        >
          {completedCount > 0 ? (
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">
              {completedCount} of {tasks.length} completed
            </span>
          ) : (
            'What will you accomplish today?'
          )}
        </motion.p>
      </div>

      <div className="space-y-3 flex-1">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -100 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              draggable
              onDragStart={() => handleDragStart(task.id)}
              onDragOver={(e) => handleDragOver(e, task.id)}
              onDragEnd={handleDragEnd}
              className={`bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all cursor-move shadow-lg ${
                draggedTask === task.id ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-600 flex-shrink-0" />

                <motion.button
                  onClick={() => toggleTask(task.id)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/50'
                      : 'border-2 border-white/20 hover:border-white/30 bg-white/5 backdrop-blur-xl'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {task.completed && (
                      <motion.svg
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.span
                  animate={{
                    opacity: task.completed ? 0.5 : 1,
                    textDecoration: task.completed ? 'line-through' : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                  className={`flex-1 ${task.completed ? 'text-gray-500' : 'text-white'}`}
                >
                  {task.text}
                </motion.span>

                <motion.button
                  onClick={() => deleteTask(task.id)}
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

        {tasks.length < 5 && !isAdding && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: tasks.length * 0.05 + 0.1 }}
            onClick={() => setIsAdding(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300"
          >
            <Plus className="w-5 h-5" />
            <span>{t.tasks.addButton}</span>
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
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                placeholder={t.tasks.placeholder}
                className="w-full bg-white/5 backdrop-blur-xl text-white rounded-xl px-4 py-3 border border-white/10 focus:border-blue-500/50 focus:outline-none mb-3 placeholder-gray-500"
                autoFocus
              />
              <div className="flex gap-2">
                <motion.button
                  onClick={addTask}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl py-2 font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all backdrop-blur-xl"
                >
                  Add
                </motion.button>
                <motion.button
                  onClick={() => {
                    setIsAdding(false);
                    setNewTaskText('');
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

      {tasks.length === 0 && !isAdding && (
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
              ✅
            </motion.div>
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm mt-2">Add your first task to plan your day</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
