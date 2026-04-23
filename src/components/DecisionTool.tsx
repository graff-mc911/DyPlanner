import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Scale, Trash2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface DecisionData {
  title: string;
  doHappens: string;
  dontHappens: string;
  doLose: string;
  dontLose: string;
}

const EMPTY: DecisionData = {
  title: '',
  doHappens: '',
  dontHappens: '',
  doLose: '',
  dontLose: '',
};

function countPoints(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\n/).filter(l => l.trim().length > 0).length;
}

function analyzeDecision(data: DecisionData) {
  const doHappensScore = countPoints(data.doHappens);
  const dontHappensScore = countPoints(data.dontHappens);
  const doLoseScore = countPoints(data.doLose);
  const dontLoseScore = countPoints(data.dontLose);

  const forScore = doHappensScore + dontLoseScore;
  const againstScore = dontHappensScore + doLoseScore;

  const total = forScore + againstScore;
  const forPct = total > 0 ? Math.round((forScore / total) * 100) : 50;
  const againstPct = 100 - forPct;

  let verdict: 'do' | 'dont' | 'unclear';
  if (forScore > againstScore + 1) verdict = 'do';
  else if (againstScore > forScore + 1) verdict = 'dont';
  else verdict = 'unclear';

  return { forScore, againstScore, forPct, againstPct, verdict };
}

export default function DecisionTool() {
  const { t } = useLanguage();
  const [data, setData] = useState<DecisionData>(EMPTY);
  const [focusedCard, setFocusedCard] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('decision_data');
    if (stored) {
      try { setData(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const updateField = (field: keyof DecisionData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    localStorage.setItem('decision_data', JSON.stringify(newData));
  };

  const clearAll = () => {
    setData(EMPTY);
    localStorage.removeItem('decision_data');
  };

  const allFilled = !!(
    data.doHappens.trim() &&
    data.dontHappens.trim() &&
    data.doLose.trim() &&
    data.dontLose.trim()
  );

  const analysis = useMemo(() => {
    if (!allFilled) return null;
    return analyzeDecision(data);
  }, [data, allFilled]);

  const hasAnyContent = data.title || data.doHappens || data.dontHappens || data.doLose || data.dontLose;

  const cards = [
    { id: 'doHappens' as const, label: t.decision.doHappens, value: data.doHappens, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', sign: '+' },
    { id: 'dontHappens' as const, label: t.decision.dontHappens, value: data.dontHappens, color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', sign: '-' },
    { id: 'doLose' as const, label: t.decision.doLose, value: data.doLose, color: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/30', sign: '-' },
    { id: 'dontLose' as const, label: t.decision.dontLose, value: data.dontLose, color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', sign: '+' },
  ];

  const verdictConfig = {
    do: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', label: t.decision.verdictDo },
    dont: { icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', label: t.decision.verdictDont },
    unclear: { icon: Scale, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', label: t.decision.verdictUnclear },
  };

  return (
    <div className="flex flex-col h-full p-6 pb-28 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{t.decision.title}</h1>
            <p className="text-gray-400 text-sm">{t.decision.subtitle}</p>
          </div>
          {hasAnyContent && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all text-xs flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t.decision.clear}
            </motion.button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-5"
      >
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder={t.decision.titlePlaceholder}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-center text-xl font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
        />
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: focusedCard === card.id ? 1.02 : 1,
            }}
            transition={{
              delay: 0.2 + index * 0.1,
              scale: { duration: 0.2 }
            }}
            className="relative"
          >
            <div
              className={`h-full bg-gradient-to-br ${card.color} backdrop-blur-xl border ${card.border} rounded-3xl p-4 transition-all ${
                focusedCard === card.id ? 'shadow-2xl shadow-blue-500/10' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  card.sign === '+' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>{card.sign}</span>
                <label className="block text-xs font-medium text-gray-300 leading-tight">
                  {card.label}
                </label>
              </div>
              <textarea
                value={card.value}
                onChange={(e) => updateField(card.id, e.target.value)}
                onFocus={() => setFocusedCard(card.id)}
                onBlur={() => setFocusedCard(null)}
                placeholder={t.decision.cardPlaceholder}
                className="w-full h-28 bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-black/30 transition-all resize-none leading-relaxed"
              />
              {card.value.trim() && (
                <div className="mt-1.5 text-right">
                  <span className="text-[10px] text-gray-600">
                    {countPoints(card.value)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!allFilled ? (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-6 text-gray-600 text-sm"
          >
            {t.decision.analysisFillAll}
          </motion.div>
        ) : analysis && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-4"
          >
            {(() => {
              const cfg = verdictConfig[analysis.verdict];
              const Icon = cfg.icon;
              return (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className={`${cfg.bg} border rounded-2xl p-5 text-center`}
                >
                  <Icon className={`w-10 h-10 mx-auto mb-2 ${cfg.color}`} />
                  <h3 className={`text-2xl font-bold ${cfg.color}`}>{cfg.label}</h3>
                  {data.title && (
                    <p className="text-gray-400 text-sm mt-1">"{data.title}"</p>
                  )}
                </motion.div>
              );
            })()}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-emerald-400">{t.decision.reasonsFor}: {analysis.forScore}</span>
                <span className="text-rose-400">{t.decision.reasonsAgainst}: {analysis.againstScore}</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-white/5 flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.forPct}%` }}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.againstPct}%` }}
                  transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-rose-400 to-rose-500 rounded-r-full"
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 mt-1.5">
                <span>{analysis.forPct}%</span>
                <span>{analysis.againstPct}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-emerald-400 mb-2">{t.decision.reasonsFor}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span className="truncate">{t.decision.doHappens}</span>
                    <span className="ml-auto text-emerald-400 font-medium">{countPoints(data.doHappens)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="truncate">{t.decision.dontLose}</span>
                    <span className="ml-auto text-emerald-400 font-medium">{countPoints(data.dontLose)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-rose-400 mb-2">{t.decision.reasonsAgainst}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="truncate">{t.decision.dontHappens}</span>
                    <span className="ml-auto text-rose-400 font-medium">{countPoints(data.dontHappens)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                    <span className="truncate">{t.decision.doLose}</span>
                    <span className="ml-auto text-rose-400 font-medium">{countPoints(data.doLose)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
