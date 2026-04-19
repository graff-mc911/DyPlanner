// ==================== BASE TYPES ====================

export type UUID = string

export type LanguageCode = 
  | 'uk' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'pl' | 'ru' | 'ja'
  | 'zh' | 'ko' | 'ar' | 'hi' | 'tr' | 'nl' | 'sv' | 'cs' | 'ro' | 'hu'
  | 'bg' | 'hr' | 'sk' | 'lt'

export type Theme = 'light' | 'dark' | 'oled' | 'sepia'
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type BookFormat = 'epub' | 'pdf' | 'mobi' | 'fb2' | 'txt' | 'cbz' | 'cbr'

// ==================== TASK TYPES ====================

export interface Task {
  id: UUID
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
  subtasks: SubTask[]
  category?: string
}

export interface SubTask {
  id: UUID
  title: string
  completed: boolean
  order: number
}

// ==================== BOOK TYPES ====================

export interface Book {
  id: UUID
  title: string
  author?: string
  format: BookFormat
  size: number
  currentPage: number
  progress: number
  totalPages?: number
  cover?: string
  fileData?: Blob
  createdAt: Date
  updatedAt: Date
  tags: string[]
  favorite: boolean
  bookmarks: Bookmark[]
  annotations: Annotation[]
}

export interface Bookmark {
  id: UUID
  page: number
  createdAt: Date
  note?: string
}

export interface Annotation {
  id: UUID
  page: number
  text: string
  note?: string
  color: string
  createdAt: Date
}

// ==================== MEDIA TYPES ====================

export type MediaType = 'audio' | 'video'

export interface MediaFile {
  id: UUID
  title: string
  artist?: string
  album?: string
  type: MediaType
  format: string
  duration: number
  currentTime: number
  size: number
  cover?: string
  fileData?: Blob
  createdAt: Date
  tags: string[]
  favorite: boolean
}

// ==================== SETTINGS TYPES ====================

export interface ReaderSettings {
  fontSize: number
  fontFamily: 'sans' | 'serif' | 'mono'
  lineHeight: number
  margins: number
  textAlign: 'left' | 'justify' | 'center'
  theme: Theme
  brightness: number
}

export interface PlayerSettings {
  autoPlay: boolean
  volume: number
  playbackRate: number
  miniPlayer: boolean
}

export interface PlannerSettings {
  defaultView: 'day' | 'week' | 'month'
  startOfWeek: 0 | 1 | 6
  pomodoroDuration: number
}

export interface AppSettings {
  language: LanguageCode
  theme: Theme
  fontScale: number
  reader: ReaderSettings
  player: PlayerSettings
  planner: PlannerSettings
}