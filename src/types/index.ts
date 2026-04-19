export type UUID = string

export type LanguageCode =
  | 'uk' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'pl' | 'ru'
  | 'ja' | 'zh' | 'ko' | 'ar' | 'hi' | 'tr' | 'nl' | 'sv' | 'cs'
  | 'ro' | 'hu' | 'bg' | 'hr' | 'sk' | 'lt'

export type Theme = 'light' | 'dark' | 'oled' | 'sepia'

export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Language {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
  direction: 'ltr' | 'rtl'
}

export interface Task {
  id: UUID
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  subtasks: Task[]
  tags: string[]
}

export interface Bookmark {
  id: UUID
  page: number
  title: string
  createdAt: Date
}

export interface Annotation {
  id: UUID
  page: number
  text: string
  note?: string
  color: string
  createdAt: Date
}

export interface Book {
  id: UUID
  title: string
  author: string
  format: 'pdf' | 'epub' | 'txt' | 'fb2'
  size: number
  currentPage: number
  progress: number
  createdAt: Date
  updatedAt: Date
  lastReadAt?: Date
  tags: string[]
  favorite: boolean
  bookmarks: Bookmark[]
  annotations: Annotation[]
}

export interface ReaderSettings {
  fontSize: number
  fontFamily: 'sans' | 'serif' | 'mono'
  lineHeight: number
  margins: number
  textAlign: 'left' | 'center' | 'justify' | 'right'
  theme: 'dark' | 'light' | 'sepia'
  brightness: number
}

export interface AppSettings {
  language: LanguageCode
  theme: Theme
  fontScale: number
  reader: ReaderSettings
  player: {
    autoPlay: boolean
    volume: number
    playbackRate: number
    miniPlayer: boolean
  }
  planner: {
    defaultView: 'day' | 'week' | 'month'
    startOfWeek: number
    pomodoroDuration: number
  }
}
