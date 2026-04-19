import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

interface DecisionData {
  title: string;
  doHappens: string;
  dontHappens: string;
  doLose: string;
  dontLose: string;
}

export default function DecisionTool() {
  const { t } = useLanguage();
  const [data, setData] = useState<DecisionData>({
    title: '',
    doHappens: '',
    dontHappens: '',
    doLose: '',
    dontLose: '',
  });
  const [focusedCard, setFocusedCard] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('decision_data');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const updateField = (field: keyof DecisionData, value: string) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    localStorage.setItem('decision_data', JSON.stringify(newData));
  };

  const cards = [
    { id: 'doHappens', label: t.decision.doHappens, value: data.doHappens, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
    { id: 'dontHappens', label: t.decision.dontHappens, value: data.dontHappens, color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
    { id: 'doLose', label: t.decision.doLose, value: data.doLose, color: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30' },
    { id: 'dontLose', label: t.decision.dontLose, value: data.dontLose, color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
  ];

  return (
    <div className="flex flex-col h-full p-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">{t.decision.title}</h1>
        <p className="text-gray-400">{t.decision.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <input
          type="text"
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder={t.decision.titlePlaceholder}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 text-center text-xl font-semibold text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
        />
      </motion.div>

      <div className="grid grid-cols-2 gap-4 flex-1">
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: focusedCard === card.id ? 1.05 : 1,
            }}
            transition={{
              delay: 0.2 + index * 0.1,
              scale: { duration: 0.2 }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <div
              className={`h-full bg-gradient-to-br ${card.color} backdrop-blur-xl border ${card.border} rounded-3xl p-5 transition-all ${
                focusedCard === card.id ? 'shadow-2xl shadow-blue-500/20' : ''
              }`}
            >
              <label className="block text-sm font-medium text-gray-300 mb-3">
                {card.label}
              </label>
              <textarea
                value={card.value}
                onChange={(e) => updateField(card.id as keyof DecisionData, e.target.value)}
                onFocus={() => setFocusedCard(card.id)}
                onBlur={() => setFocusedCard(null)}
                placeholder={t.decision.cardPlaceholder}
                className="w-full h-32 bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/20 focus:bg-black/30 transition-all resize-none"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
