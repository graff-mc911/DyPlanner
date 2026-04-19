import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, UUID, TaskStatus, TaskPriority } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface PlannerState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task
  updateTask: (id: UUID, updates: Partial<Task>) => void
  deleteTask: (id: UUID) => void
  toggleTask: (id: UUID) => void
  getTodayTasks: () => Task[]
  getStats: () => { total: number; completed: number; rate: number }
}

export const usePlannerStore = create<PlannerState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
          subtasks: taskData.subtasks || [],
          tags: taskData.tags || [],
        }
        set((state) => ({ tasks: [...state.tasks, task] }))
        return task
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
          ),
        }))
      },
      
      deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }))
      },
      
      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t
            const newStatus = t.status === 'done' ? 'todo' : 'done'
            return {
              ...t,
              status: newStatus,
              completedAt: newStatus === 'done' ? new Date() : undefined,
              updatedAt: new Date(),
            }
          }),
        }))
      },
      
      getTodayTasks: () => {
        const today = new Date().setHours(0, 0, 0, 0)
        return get().tasks.filter((t) => {
          if (!t.dueDate) return false
          const due = new Date(t.dueDate).setHours(0, 0, 0, 0)
          return due === today
        })
      },
      
      getStats: () => {
        const { tasks } = get()
        const completed = tasks.filter((t) => t.status === 'done').length
        return {
          total: tasks.length,
          completed,
          rate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
        }
      },
    }),
    { name: 'dyplanner-tasks' }
  )
)