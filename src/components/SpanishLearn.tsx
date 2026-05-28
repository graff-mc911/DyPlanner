import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, ChevronRight, ChevronLeft, RotateCcw,
  Check, Eye, EyeOff, BookOpen, Star,
  Bell, Pencil, ArrowLeft
} from 'lucide-react';
import { lessons, SpanishWord, SpanishSentence } from '../data/spanishWords';

type Screen = 'home' | 'lesson' | 'review' | 'write';

interface Progress {
  completedDays: number[];
  reviewQueue: number[]; // word indices for spaced review
  lastStudied: string;
  totalWords: number;
  streak: number;
  lastStreakDate: string;
}

const STORAGE_KEY = 'spanish_progress';

function loadProgress(): Progress {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  return {
    completedDays: [],
    reviewQueue: [],
    lastStudied: '',
    totalWords: 0,
    streak: 0,
    lastStreakDate: '',
  };
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function speak(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'es-ES';
  utt.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const esVoice = voices.find(v => v.lang.startsWith('es'));
  if (esVoice) utt.voice = esVoice;
  window.speechSynthesis.speak(utt);
}

// ─── Word Card ─────────────────────────────────────────────────────────────
function WordCard({ word, index, total }: { word: SpanishWord; index: number; total: number }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setRevealed(false); }, [word]);

  return (
    <motion.div
      key={word.es}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-gray-500">{index + 1} / {total}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => speak(word.es)}
          className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 hover:bg-sky-500/30 transition-colors"
        >
          <Volume2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Spanish word */}
      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-white mb-2 tracking-wide">{word.es}</p>
        <p className="text-sm text-sky-400/70 font-mono">[{word.pronunciation}]</p>
      </div>

      {/* Ukrainian translation */}
      <button
        onClick={() => setRevealed(r => !r)}
        className="w-full py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
      >
        {revealed ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
        <span className={`text-lg font-medium transition-all ${revealed ? 'text-emerald-400' : 'text-gray-600'}`}>
          {revealed ? word.uk : '••••••••'}
        </span>
      </button>
    </motion.div>
  );
}

// ─── Sentence Card ──────────────────────────────────────────────────────────
function SentenceCard({ sentence, index }: { sentence: SpanishSentence; index: number }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setRevealed(false); }, [sentence]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => speak(sentence.es)}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 hover:bg-sky-500/30 transition-colors mt-0.5"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </motion.button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium mb-1 leading-snug">{sentence.es}</p>
          <button
            onClick={() => setRevealed(r => !r)}
            className="text-sm transition-all"
          >
            <span className={revealed ? 'text-emerald-400' : 'text-gray-600'}>
              {revealed ? sentence.uk : 'Показати переклад →'}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Writing Practice ───────────────────────────────────────────────────────
function WritePractice({ word, onDone }: { word: SpanishWord; onDone: () => void }) {
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput(''); setChecked(false); setCorrect(false);
    inputRef.current?.focus();
  }, [word]);

  const check = () => {
    const norm = (s: string) => s.trim().toLowerCase().replace(/[¿?¡!.,]/g, '');
    const isCorrect = norm(input) === norm(word.es);
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) speak(word.es);
  };

  return (
    <div className="space-y-5">
      <div className="text-center bg-white/5 border border-white/10 rounded-2xl p-5">
        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Напиши іспанською</p>
        <p className="text-2xl font-bold text-white">{word.uk}</p>
        <p className="text-sm text-sky-400/70 font-mono mt-1">[{word.pronunciation}]</p>
        <button
          onClick={() => speak(word.es)}
          className="mt-3 flex items-center gap-1.5 mx-auto text-xs text-sky-400 hover:text-sky-300 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" /> Послухати
        </button>
      </div>

      <div>
        <input
          ref={inputRef}
          value={input}
          onChange={e => { setInput(e.target.value); setChecked(false); }}
          onKeyDown={e => e.key === 'Enter' && !checked && input.trim() && check()}
          placeholder="Введи іспанське слово..."
          className={`w-full bg-white/5 border rounded-2xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none transition-all text-lg text-center ${
            checked
              ? correct
                ? 'border-emerald-500/60 bg-emerald-500/10'
                : 'border-rose-500/60 bg-rose-500/10'
              : 'border-white/10 focus:border-sky-500/50'
          }`}
        />
      </div>

      {checked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center p-4 rounded-2xl ${correct ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-rose-500/10 border border-rose-500/30'}`}
        >
          {correct ? (
            <p className="text-emerald-400 font-semibold">Правильно!</p>
          ) : (
            <div>
              <p className="text-rose-400 font-semibold mb-1">Правильна відповідь:</p>
              <p className="text-white text-xl font-bold">{word.es}</p>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={check}
            disabled={!input.trim()}
            className="flex-1 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 disabled:bg-white/10 disabled:text-gray-600 text-white font-semibold transition-all"
          >
            Перевірити
          </button>
        ) : (
          <button
            onClick={onDone}
            className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ChevronRight className="w-4 h-4" /> Далі
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Lesson View ─────────────────────────────────────────────────────────────
function LessonView({
  day,
  onComplete,
  onBack,
}: {
  day: number;
  onComplete: () => void;
  onBack: () => void;
}) {
  const lesson = lessons[day - 1];
  const [phase, setPhase] = useState<'words' | 'sentences' | 'write'>('words');
  const [wordIndex, setWordIndex] = useState(0);
  const [writeIndex, setWriteIndex] = useState(0);

  const currentWord = lesson.words[wordIndex];

  const nextWord = () => {
    if (wordIndex < lesson.words.length - 1) {
      setWordIndex(i => i + 1);
    } else {
      setPhase('sentences');
    }
  };

  const nextWrite = () => {
    if (writeIndex < lesson.words.length - 1) {
      setWriteIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col h-full p-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-500">День {day}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                animate={{
                  width: phase === 'words'
                    ? `${((wordIndex + 1) / lesson.words.length) * 33}%`
                    : phase === 'sentences'
                    ? '66%'
                    : `${66 + ((writeIndex + 1) / lesson.words.length) * 34}%`
                }}
              />
            </div>
            <span className="text-[10px] text-gray-600">
              {phase === 'words' ? 'Слова' : phase === 'sentences' ? 'Речення' : 'Письмо'}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'words' && (
          <motion.div key="words" className="flex-1 flex flex-col gap-4">
            <WordCard word={currentWord} index={wordIndex} total={lesson.words.length} />
            <button
              onClick={nextWord}
              className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              {wordIndex < lesson.words.length - 1 ? (
                <><ChevronRight className="w-4 h-4" /> Наступне слово</>
              ) : (
                <><BookOpen className="w-4 h-4" /> До речень</>
              )}
            </button>
            <p className="text-center text-[11px] text-gray-600">
              Натисни <span className="text-sky-500">🔊</span> щоб почути вимову
            </p>
          </motion.div>
        )}

        {phase === 'sentences' && (
          <motion.div
            key="sentences"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-3xl p-5">
              <p className="text-xs text-violet-400 uppercase tracking-wider mb-4 font-semibold">Речення дня</p>
              <div className="space-y-3">
                {lesson.sentences.map((s, i) => (
                  <SentenceCard key={i} sentence={s} index={i} />
                ))}
              </div>
            </div>
            <button
              onClick={() => setPhase('write')}
              className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Pencil className="w-4 h-4" /> Практика письма
            </button>
          </motion.div>
        )}

        {phase === 'write' && (
          <motion.div
            key="write"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col gap-4"
          >
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Письмова практика</p>
                <span className="text-xs text-gray-500">{writeIndex + 1} / {lesson.words.length}</span>
              </div>
              <WritePractice word={lesson.words[writeIndex]} onDone={nextWrite} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Review View ─────────────────────────────────────────────────────────────
function ReviewView({ progress, onBack }: { progress: Progress; onBack: () => void }) {
  // Review last 3 completed lessons' words
  const completedLessons = progress.completedDays.slice(-3);
  const reviewWords = completedLessons.flatMap(d => lessons[d - 1]?.words ?? []);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<'listen' | 'write'>('listen');
  const [revealed, setRevealed] = useState(false);

  if (reviewWords.length === 0) {
    return (
      <div className="flex flex-col h-full p-5 pb-24">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white mb-5">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-center">
          <Star className="w-12 h-12 text-amber-400" />
          <p className="text-white font-semibold">Поки нічого для повторення</p>
          <p className="text-gray-500 text-sm">Спочатку пройдіть хоча б один урок</p>
        </div>
      </div>
    );
  }

  const word = reviewWords[index];

  return (
    <div className="flex flex-col h-full p-5 pb-24">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-white font-semibold">Повторення</p>
          <p className="text-xs text-gray-500">{index + 1} / {reviewWords.length} слів</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setMode('listen')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${mode === 'listen' ? 'bg-sky-600 text-white' : 'bg-white/5 text-gray-400'}`}
          >
            Слухати
          </button>
          <button
            onClick={() => setMode('write')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${mode === 'write' ? 'bg-amber-600 text-white' : 'bg-white/5 text-gray-400'}`}
          >
            Писати
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {mode === 'listen' ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="flex-1 flex flex-col gap-4"
            >
              <div className="flex-1 bg-gradient-to-br from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-3xl p-6 flex flex-col items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => speak(word.es)}
                  className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 hover:bg-sky-500/30 transition-colors"
                >
                  <Volume2 className="w-7 h-7" />
                </motion.button>
                <p className="text-4xl font-bold text-white">{word.es}</p>
                <p className="text-sm text-sky-400/70 font-mono">[{word.pronunciation}]</p>
                <button
                  onClick={() => setRevealed(r => !r)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <span className={`text-base font-medium ${revealed ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {revealed ? word.uk : 'Показати переклад'}
                  </span>
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setIndex(i => Math.max(0, i - 1)); setRevealed(false); }}
                  disabled={index === 0}
                  className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Назад
                </button>
                <button
                  onClick={() => { if (index < reviewWords.length - 1) { setIndex(i => i + 1); setRevealed(false); } else onBack(); }}
                  className="flex-1 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
                >
                  {index < reviewWords.length - 1 ? <><ChevronRight className="w-4 h-4" />Далі</> : <><Check className="w-4 h-4" />Готово</>}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <WritePractice
            word={word}
            onDone={() => {
              if (index < reviewWords.length - 1) setIndex(i => i + 1);
              else onBack();
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function SpanishLearn() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [progress, setProgress] = useState<Progress>(loadProgress);

  // Load voices on mount
  useEffect(() => {
    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => {};
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
  }, []);

  const currentDay = (progress.completedDays.length === 0)
    ? 1
    : Math.min(progress.completedDays.length + 1, lessons.length);

  const handleComplete = useCallback(() => {
    if (activeDay === null) return;
    const today = new Date().toDateString();
    const newCompleted = progress.completedDays.includes(activeDay)
      ? progress.completedDays
      : [...progress.completedDays, activeDay];

    let newStreak = progress.streak;
    let lastDate = progress.lastStreakDate;
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      newStreak = (lastDate === yesterday.toDateString()) ? newStreak + 1 : 1;
      lastDate = today;
    }

    const updated: Progress = {
      ...progress,
      completedDays: newCompleted,
      totalWords: newCompleted.length * 5,
      streak: newStreak,
      lastStreakDate: lastDate,
      lastStudied: today,
    };
    setProgress(updated);
    saveProgress(updated);
    setScreen('home');
    setActiveDay(null);
  }, [activeDay, progress]);

  const startLesson = (day: number) => {
    setActiveDay(day);
    setScreen('lesson');
  };

  if (screen === 'lesson' && activeDay !== null) {
    return (
      <LessonView
        day={activeDay}
        onComplete={handleComplete}
        onBack={() => { setScreen('home'); setActiveDay(null); }}
      />
    );
  }

  if (screen === 'review') {
    return <ReviewView progress={progress} onBack={() => setScreen('home')} />;
  }

  // Home
  const completedSet = new Set(progress.completedDays);
  const visibleDays = Array.from({ length: Math.min(currentDay + 4, lessons.length) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/5 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Español</h1>
            <p className="text-xs text-gray-500 mt-0.5">Рівень A1 → B1 · 2000 слів</p>
          </div>
          <div className="flex items-center gap-3">
            {progress.streak > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-amber-400">{progress.streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-xs font-bold text-sky-400">{progress.totalWords}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Вивчено слів', value: progress.totalWords, max: 2000, color: 'sky' },
            { label: 'Пройдено днів', value: progress.completedDays.length, max: lessons.length, color: 'emerald' },
            { label: 'Серія днів', value: progress.streak, max: null, color: 'amber' },
          ].map(({ label, value, max, color }) => (
            <div key={label} className={`bg-${color}-500/5 border border-${color}-500/20 rounded-2xl p-3 text-center`}>
              <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
              {max && <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full bg-${color}-500 rounded-full`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
              </div>}
              <p className="text-[10px] text-gray-600 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startLesson(currentDay)}
            className="col-span-2 py-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <Star className="w-5 h-5" />
            {completedSet.has(currentDay) ? `Повторити день ${currentDay}` : `День ${currentDay} → Розпочати`}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setScreen('review')}
            className="py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-violet-400" /> Повторення
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startLesson(currentDay)}
            className="py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Pencil className="w-4 h-4 text-amber-400" /> Письмо
          </motion.button>
        </div>

        {/* Reminder info */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4 flex items-start gap-3">
          <Bell className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-white font-medium">Нагадування</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Вчіть щодня: 5 слів + 3 речення. Повторюйте вранці, вдень і ввечері. Слухайте і пишіть вручну.</p>
          </div>
        </div>

        {/* Lesson list */}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Уроки</p>
          <div className="space-y-2">
            {visibleDays.map(day => {
              const done = completedSet.has(day);
              const isToday = day === currentDay;
              const lesson = lessons[day - 1];
              return (
                <motion.button
                  key={day}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => startLesson(day)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                    isToday
                      ? 'bg-sky-500/10 border-sky-500/30'
                      : done
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-white/3 border-white/8 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    done ? 'bg-emerald-500/20 text-emerald-400' : isToday ? 'bg-sky-500/20 text-sky-400' : 'bg-white/5 text-gray-600'
                  }`}>
                    {done ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{day}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isToday ? 'text-white' : done ? 'text-gray-300' : 'text-gray-500'}`}>
                      День {day}
                    </p>
                    <p className="text-[11px] text-gray-600 truncate mt-0.5">
                      {lesson.words.slice(0, 3).map(w => w.es).join(' · ')}...
                    </p>
                  </div>
                  {isToday && <span className="text-[10px] text-sky-400 font-semibold bg-sky-500/10 px-2 py-1 rounded-lg">Сьогодні</span>}
                  {done && <span className="text-[10px] text-emerald-400 font-semibold">+5 слів</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Progress to next batch */}
          {currentDay < lessons.length && (
            <p className="text-center text-xs text-gray-600 mt-4">
              Відкрито {visibleDays.length} / {lessons.length} уроків
            </p>
          )}
        </div>

        {/* Grammar tips */}
        <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-5">
          <p className="text-xs text-violet-400 uppercase tracking-wider font-semibold mb-3">Граматика дня</p>
          <div className="space-y-2 text-sm">
            <p className="text-white font-medium">Дієслово SER vs ESTAR</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              <span className="text-violet-300">Ser</span> — постійні якості: Soy ucraniano (Я українець){'\n'}
              <span className="text-violet-300">Estar</span> — тимчасовий стан: Estoy cansado (Я стомлений)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
