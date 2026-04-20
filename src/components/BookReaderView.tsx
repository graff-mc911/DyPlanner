import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BookOpen, ChevronLeft, ChevronRight, Type, X, Library } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Book {
  id: string;
  title: string;
  type: string;
  currentPage: number;
  totalPages: number;
}

export default function BookReaderView() {
  const { t } = useLanguage();
  const [books, setBooks] = useState<Book[]>(() => {
    const stored = localStorage.getItem('reader_books_v2');
    return stored ? JSON.parse(stored) : [];
  });
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveBooks = (updated: Book[]) => {
    setBooks(updated);
    localStorage.setItem('reader_books_v2', JSON.stringify(updated));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'txt';
    const book: Book = {
      id: Date.now().toString(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      type: ext.toUpperCase(),
      currentPage: 1,
      totalPages: 100,
    };
    saveBooks([book, ...books]);
    setCurrentBook(book);
    e.target.value = '';
  };

  const removeBook = (id: string) => {
    saveBooks(books.filter(b => b.id !== id));
    if (currentBook?.id === id) setCurrentBook(null);
  };

  const changePage = (delta: number) => {
    if (!currentBook) return;
    const newPage = Math.max(1, Math.min(currentBook.totalPages, currentBook.currentPage + delta));
    const updated = { ...currentBook, currentPage: newPage };
    setCurrentBook(updated);
    saveBooks(books.map(b => b.id === currentBook.id ? updated : b));
  };

  if (currentBook) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full pb-28"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <button
            onClick={() => setCurrentBook(null)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.reader.backToLibrary}
          </button>
          <span className="text-gray-400 text-sm truncate max-w-[180px]">{currentBook.title}</span>
        </div>

        <div className="px-6 py-3 flex items-center gap-3 border-b border-white/5">
          <Type className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <span className="text-xs text-gray-500">{t.reader.fontSize}</span>
          <input
            type="range" min="12" max="30" value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <span className="text-xs text-gray-400 w-8">{fontSize}px</span>
        </div>

        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-64">
            <p
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
              className="text-gray-300"
            >
              {t.reader.previewText}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => changePage(-1)}
            disabled={currentBook.currentPage <= 1}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <span className="text-gray-400 text-sm">
            {t.reader.page} {currentBook.currentPage} {t.reader.of} {currentBook.totalPages}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => changePage(1)}
            disabled={currentBook.currentPage >= currentBook.totalPages}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col h-full p-6 pb-28"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">{t.reader.title}</h1>
        <p className="text-gray-400">{t.reader.supported}</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".epub,.pdf,.txt,.fb2,.mobi"
        className="hidden"
        onChange={handleFileUpload}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => fileInputRef.current?.click()}
        className="w-full mb-6 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/15 rounded-3xl p-8 flex flex-col items-center gap-3 hover:border-blue-500/40 hover:bg-white/10 transition-all"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
          <Upload className="w-7 h-7 text-blue-400" />
        </div>
        <span className="text-white font-medium">{t.reader.upload}</span>
        <span className="text-xs text-gray-500">{t.reader.supported}</span>
      </motion.button>

      <div className="flex-1">
        <p className="text-sm font-medium text-gray-400 mb-3">
          <Library className="w-4 h-4 inline mr-1.5 opacity-60" />
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </p>
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-gray-600"
          >
            <BookOpen className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-center text-sm">{t.reader.empty}</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <AnimatePresence>
              {books.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCurrentBook(book)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-left hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-teal-500/20 flex items-center justify-center mb-3">
                      <BookOpen className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-white text-sm font-medium truncate mb-1">{book.title}</p>
                    <p className="text-gray-600 text-xs uppercase">{book.type}</p>
                    <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500/60 rounded-full"
                        style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                      />
                    </div>
                    <p className="text-gray-600 text-xs mt-1">{t.reader.page} {book.currentPage}</p>
                  </motion.button>
                  <button
                    onClick={() => removeBook(book.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
