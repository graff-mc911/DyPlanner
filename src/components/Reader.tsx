import { useState, useRef, useEffect } from 'react'
import { Upload, BookOpen, ChevronLeft, ChevronRight, Type } from 'lucide-react'

interface Book {
  id: string
  title: string
  file: File
  type: 'epub' | 'pdf' | 'other'
  currentPage: number
  totalPages: number
}

export function Reader({ language }: { language: 'uk' | 'en' }) {
  const [books, setBooks] = useState<Book[]>([])
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [fontSize, setFontSize] = useState(18)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = {
    uk: {
      title: 'Читалка книг',
      upload: 'Завантажити книгу',
      supported: 'Підтримувані формати: EPUB, PDF, TXT',
      empty: 'Немає книг. Завантажте файл.',
      page: 'Стор.',
      of: 'з',
      fontSize: 'Розмір шрифту'
    },
    en: {
      title: 'Book Reader',
      upload: 'Upload Book',
      supported: 'Supported formats: EPUB, PDF, TXT',
      empty: 'No books. Upload a file.',
      page: 'Page',
      of: 'of',
      fontSize: 'Font size'
    }
  }[language]

  useEffect(() => {
    const saved = localStorage.getItem('reader-books')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setBooks(parsed.map((b: any) => ({ ...b, file: null })))
      } catch (e) {
        console.error('Failed to parse books')
      }
    }
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    const type = ext === 'epub' ? 'epub' : ext === 'pdf' ? 'pdf' : 'other'

    const book: Book = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      file,
      type,
      currentPage: 1,
      totalPages: 100
    }

    const newBooks = [book, ...books]
    setBooks(newBooks)
    localStorage.setItem('reader-books', JSON.stringify(newBooks.map(b => ({ ...b, file: null }))))
    
    setCurrentBook(book)
  }

  if (currentBook) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentBook(null)}
            className="flex items-center gap-2 text-sky-400 hover:text-sky-300"
          >
            <ChevronLeft size={20} />
            {language === 'uk' ? 'До бібліотеки' : 'Back to library'}
          </button>
          <span className="text-sm text-slate-400">{currentBook.title}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 p-3 bg-slate-800 rounded-lg">
          <Type size={20} className="text-slate-400" />
          <span className="text-sm">{t.fontSize}:</span>
          <input
            type="range"
            min="12"
            max="32"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm w-8">{fontSize}px</span>
        </div>

        <div className="bg-slate-900 rounded-lg p-8 min-h-[400px]">
          <p style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }} className="text-slate-300">
            {language === 'uk' 
              ? 'Тут буде відображатися вміст книги. У повній версії підтримується EPUB та PDF.'
              : 'Book content will appear here. Full version supports EPUB and PDF.'}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            <ChevronLeft size={24} />
          </button>
          <span className="text-slate-400">
            {t.page} {currentBook.currentPage} {t.of} {currentBook.totalPages}
          </span>
          <button className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".epub,.pdf,.txt,.fb2,.mobi"
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full mb-4 p-6 border-2 border-dashed border-slate-600 rounded-lg hover:border-sky-500 hover:bg-slate-800/50 transition-colors flex flex-col items-center gap-2"
      >
        <Upload size={32} className="text-sky-500" />
        <span className="text-lg">{t.upload}</span>
        <span className="text-sm text-slate-500">{t.supported}</span>
      </button>

      {books.length === 0 ? (
        <p className="text-slate-500 text-center py-8">{t.empty}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {books.map(book => (
            <button
              key={book.id}
              onClick={() => setCurrentBook(book)}
              className="p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-left"
            >
              <BookOpen size={32} className="text-sky-500 mb-2" />
              <p className="font-medium truncate">{book.title}</p>
              <p className="text-sm text-slate-500 uppercase">{book.type}</p>
              <p className="text-xs text-slate-600 mt-2">
                {t.page} {book.currentPage} {t.of} {book.totalPages}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}