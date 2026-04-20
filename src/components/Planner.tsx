import { useState, useEffect } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'

interface Task {
  id: string
  text: string
  done: boolean
  createdAt: number
}

export function Planner({ language }: { language: 'uk' | 'en' }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')

  const t = {
    uk: {
      title: 'Планер задач',
      placeholder: 'Нова задача...',
      add: 'Додати',
      empty: 'Немає задач',
      completed: 'виконано',
      of: 'з'
    },
    en: {
      title: 'Task Planner',
      placeholder: 'New task...',
      add: 'Add',
      empty: 'No tasks',
      completed: 'completed',
      of: 'of'
    }
  }[language]

  useEffect(() => {
    const saved = localStorage.getItem('planner-tasks')
    if (saved) {
      try {
        setTasks(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse tasks')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('planner-tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: Date.now().toString(),
      text: newTask.trim(),
      done: false,
      createdAt: Date.now()
    }
    setTasks([task, ...tasks])
    setNewTask('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const completedCount = tasks.filter(t => t.done).length

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder={t.placeholder}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-white transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          {t.add}
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-slate-500 text-center py-8">{t.empty}</p>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-2">
            {completedCount} {t.of} {tasks.length} {t.completed}
          </p>
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  task.done 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    task.done 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-slate-500 hover:border-sky-500'
                  }`}
                >
                  {task.done && <Check size={14} />}
                </button>
                <span className={`flex-1 ${task.done ? 'line-through text-slate-500' : ''}`}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}