import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Book, UUID, ReaderSettings } from '../types'
import { v4 as uuidv4 } from 'uuid'

interface BookState {
  books: Book[]
  currentBook: Book | null
  settings: ReaderSettings
  isLoading: boolean
  
  addBook: (file: File, metadata?: Partial<Book>) => Promise<Book>
  removeBook: (id: UUID) => void
  setCurrentBook: (book: Book | null) => void
  updateProgress: (id: UUID, progress: number, currentPage: number) => void
  getBooksByStatus: (status: 'reading' | 'finished' | 'unread') => Book[]
  updateSettings: (settings: Partial<ReaderSettings>) => void
}

const defaultReaderSettings: ReaderSettings = {
  fontSize: 18,
  fontFamily: 'sans',
  lineHeight: 1.6,
  margins: 20,
  textAlign: 'justify',
  theme: 'dark',
  brightness: 1,
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: [],
      currentBook: null,
      settings: defaultReaderSettings,
      isLoading: false,
      
      addBook: async (file, metadata = {}) => {
        const ext = file.name.split('.').pop()?.toLowerCase() || ''
        
        const book: Book = {
          id: uuidv4(),
          title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
          author: metadata.author || 'Unknown Author',
          format: ext as Book['format'],
          size: file.size,
          currentPage: 0,
          progress: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: metadata.tags || [],
          favorite: false,
          bookmarks: [],
          annotations: [],
        }
        
        set((state) => ({ books: [...state.books, book], isLoading: false }))
        return book
      },
      
      removeBook: (id) => {
        set((state) => ({
          books: state.books.filter((b) => b.id !== id),
          currentBook: state.currentBook?.id === id ? null : state.currentBook,
        }))
      },
      
      setCurrentBook: (book) => set({ currentBook: book }),
      
      updateProgress: (id, progress, currentPage) => {
        set((state) => ({
          books: state.books.map((b) =>
            b.id === id
              ? { ...b, progress, currentPage, lastReadAt: new Date(), updatedAt: new Date() }
              : b
          ),
        }))
      },
      
      getBooksByStatus: (status) => {
        const { books } = get()
        switch (status) {
          case 'reading':
            return books.filter((b) => b.progress > 0 && b.progress < 100)
          case 'finished':
            return books.filter((b) => b.progress === 100)
          case 'unread':
            return books.filter((b) => b.progress === 0)
          default:
            return books
        }
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({ settings: { ...state.settings, ...newSettings } }))
      },
    }),
    { name: 'dyplanner-books' }
  )
)