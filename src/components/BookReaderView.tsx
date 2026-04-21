import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, BookOpen, ChevronLeft, ChevronRight, Type, X, Library, AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface Book {
  id: string;
  title: string;
  type: string;
  content: string;
  currentPage: number;
  totalPages: number;
}

const BOOKS_STORAGE_KEY = 'reader_books_v3';
const SUPPORTED_READABLE_EXTS = new Set(['txt', 'fb2']);

function loadStoredBooks(): Book[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(BOOKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map(item => {
        if (!item || typeof item !== 'object') return null;
        const b = item as Partial<Book>;
        if (!b.id || !b.title || !b.type || typeof b.content !== 'string') return null;
        return {
          id: b.id,
          title: b.title,
          type: b.type,
          content: b.content,
          currentPage: Math.max(1, Number(b.currentPage) || 1),
          totalPages: Math.max(1, Number(b.totalPages) || 1),
        } as Book;
      })
      .filter((b): b is Book => Boolean(b));
  } catch {
    return [];
  }
}

function decodeTextBuffer(buf: ArrayBuffer): string {
  const decoders = ['utf-8', 'windows-1251', 'koi8-r', 'iso-8859-1'];
  let bestText = '';
  let bestScore = Number.POSITIVE_INFINITY;

  for (const encoding of decoders) {
    try {
      const decoded = new TextDecoder(encoding).decode(buf);
      const replacements = (decoded.match(/\uFFFD/g) ?? []).length;
      const score = replacements / Math.max(decoded.length, 1);
      if (score < bestScore) {
        bestScore = score;
        bestText = decoded;
      }
    } catch {
      // Skip unavailable encoding and continue.
    }
  }

  if (!bestText) {
    return new TextDecoder('utf-8').decode(buf);
  }

  return bestText;
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripXmlTags(xml: string): string {
  return normalizeText(
    xml
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
  );
}

function parseFb2Content(xmlText: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');
    if (doc.querySelector('parsererror')) return stripXmlTags(xmlText);

    const blocks = Array.from(doc.querySelectorAll('body title p, body subtitle, body p, body v'))
      .map(el => el.textContent?.trim() ?? '')
      .filter(Boolean);

    if (blocks.length === 0) return stripXmlTags(xmlText);
    return normalizeText(blocks.join('\n\n'));
  } catch {
    return stripXmlTags(xmlText);
  }
}

function charsPerPage(fontSize: number): number {
  const safeFont = Math.min(32, Math.max(12, fontSize));
  const base = 2600;
  const scaled = Math.round((base * 18) / safeFont);
  return Math.min(5000, Math.max(900, scaled));
}

function paginateText(content: string, fontSize: number): string[] {
  const text = normalizeText(content);
  if (!text) return [''];

  const target = charsPerPage(fontSize);
  const pages: string[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const idealEnd = Math.min(text.length, cursor + target);
    let split = idealEnd;

    if (idealEnd < text.length) {
      const windowStart = Math.max(cursor + Math.floor(target * 0.6), cursor);
      const chunk = text.slice(windowStart, idealEnd);
      const breakAt = Math.max(chunk.lastIndexOf('\n'), chunk.lastIndexOf('. '), chunk.lastIndexOf(' '));
      if (breakAt > 0) split = windowStart + breakAt + 1;
    }

    pages.push(text.slice(cursor, split).trim());
    cursor = split;
  }

  return pages.length > 0 ? pages : [''];
}

async function parseBookFile(file: File): Promise<{ content: string; type: string; error?: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const upperType = ext.toUpperCase() || 'TXT';

  if (!SUPPORTED_READABLE_EXTS.has(ext)) {
    return {
      content: '',
      type: upperType,
      error: 'Поки підтримуються TXT та FB2. Для EPUB/PDF/MOBI зробіть експорт у TXT.',
    };
  }

  const buffer = await file.arrayBuffer();
  const decoded = decodeTextBuffer(buffer);

  if (ext === 'fb2') {
    const parsed = parseFb2Content(decoded);
    if (!parsed) {
      return { content: '', type: upperType, error: 'Не вдалося прочитати FB2-файл.' };
    }
    return { content: parsed, type: upperType };
  }

  const plain = normalizeText(decoded);
  if (!plain) {
    return { content: '', type: upperType, error: 'У файлі не знайдено текст.' };
  }

  return { content: plain, type: upperType };
}

export default function BookReaderView() {
  const { t } = useLanguage();
  const [books, setBooks] = useState<Book[]>(() => loadStoredBooks());
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [importError, setImportError] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentBook = useMemo(
    () => books.find(book => book.id === currentBookId) ?? null,
    [books, currentBookId]
  );

  const pages = useMemo(() => {
    if (!currentBook) return [];
    return paginateText(currentBook.content, fontSize);
  }, [currentBook, fontSize]);

  const saveBooks = useCallback((updated: Book[]) => {
    setBooks(updated);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      setImportError('Не вдалося зберегти книги: недостатньо місця на пристрої.');
    }
  }, []);

  useEffect(() => {
    if (!currentBook) return;
    const totalPages = Math.max(1, pages.length);
    const clampedPage = Math.min(totalPages, Math.max(1, currentBook.currentPage));
    if (currentBook.totalPages === totalPages && currentBook.currentPage === clampedPage) return;

    const updatedBook: Book = { ...currentBook, totalPages, currentPage: clampedPage };
    saveBooks(books.map(book => (book.id === currentBook.id ? updatedBook : book)));
  }, [currentBook, pages.length, books, saveBooks]);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setImportError('');
    setIsImporting(true);

    try {
      const parsed = await parseBookFile(file);
      if (parsed.error) {
        setImportError(parsed.error);
        setIsImporting(false);
        return;
      }

      const previewPages = paginateText(parsed.content, fontSize);
      const book: Book = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        type: parsed.type,
        content: parsed.content,
        currentPage: 1,
        totalPages: Math.max(1, previewPages.length),
      };

      const updated = [book, ...books];
      saveBooks(updated);
      setCurrentBookId(book.id);
    } catch {
      setImportError('Не вдалося відкрити файл.');
    } finally {
      setIsImporting(false);
    }
  };

  const removeBook = (id: string) => {
    const updated = books.filter(book => book.id !== id);
    saveBooks(updated);
    if (currentBookId === id) setCurrentBookId(null);
  };

  const changePage = (delta: number) => {
    if (!currentBook) return;
    const maxPage = Math.max(1, pages.length || currentBook.totalPages);
    const nextPage = Math.max(1, Math.min(maxPage, currentBook.currentPage + delta));
    if (nextPage === currentBook.currentPage) return;
    const updatedBook: Book = { ...currentBook, currentPage: nextPage, totalPages: maxPage };
    saveBooks(books.map(book => (book.id === currentBook.id ? updatedBook : book)));
  };

  if (currentBook) {
    const totalPages = Math.max(1, pages.length || currentBook.totalPages);
    const currentPage = Math.max(1, Math.min(totalPages, currentBook.currentPage));
    const pageText = pages[currentPage - 1] ?? '';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full pb-28"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <button
            onClick={() => setCurrentBookId(null)}
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
            type="range"
            min="12"
            max="30"
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            className="flex-1 accent-blue-500"
          />
          <span className="text-xs text-gray-400 w-8">{fontSize}px</span>
        </div>

        <div className="flex-1 overflow-auto px-6 py-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-64">
            <p
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}
              className="text-gray-300"
            >
              {pageText || 'Текст на цій сторінці відсутній.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => changePage(-1)}
            disabled={currentPage <= 1}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <span className="text-gray-400 text-sm">
            {t.reader.page} {currentPage} {t.reader.of} {totalPages}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => changePage(1)}
            disabled={currentPage >= totalPages}
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
        accept=".txt,.fb2,.epub,.pdf,.mobi"
        className="hidden"
        onChange={handleFileUpload}
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="w-full mb-4 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/15 rounded-3xl p-8 flex flex-col items-center gap-3 hover:border-blue-500/40 hover:bg-white/10 transition-all disabled:opacity-70"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
          {isImporting ? (
            <div className="w-6 h-6 border-2 border-blue-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-7 h-7 text-blue-400" />
          )}
        </div>
        <span className="text-white font-medium">{isImporting ? 'Імпорт...' : t.reader.upload}</span>
        <span className="text-xs text-gray-500">TXT, FB2 (EPUB/PDF/MOBI через конвертацію в TXT)</span>
      </motion.button>

      {importError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-300 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-200">{importError}</p>
        </div>
      )}

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
                    onClick={() => setCurrentBookId(book.id)}
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
                        style={{ width: `${(book.currentPage / Math.max(1, book.totalPages)) * 100}%` }}
                      />
                    </div>
                    <p className="text-gray-600 text-xs mt-1">
                      {t.reader.page} {book.currentPage} / {book.totalPages}
                    </p>
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
