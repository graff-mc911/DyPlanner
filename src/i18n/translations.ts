export type Language = 'en' | 'es' | 'fr' | 'de' | 'uk' | 'pt' | 'it' | 'pl' | 'ru' | 'zh';

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

interface Translations {
  welcome: {
    title: string;
    subtitle: string;
    button: string;
  };
  tabs: {
    focus: string;
    tasks: string;
    habits: string;
    decide: string;
  };
  habits: {
    title: string;
    subtitle: string;
    addButton: string;
    placeholder: string;
    maxReached: string;
    streak: string;
    days: string;
  };
  tasks: {
    title: string;
    subtitle: string;
    addButton: string;
    placeholder: string;
    maxReached: string;
    resetsDaily: string;
  };
  focus: {
    title: string;
    subtitle: string;
    start: string;
    pause: string;
    resume: string;
    reset: string;
    complete: string;
    minutes: string;
  };
  decision: {
    title: string;
    subtitle: string;
    titlePlaceholder: string;
    doHappens: string;
    dontHappens: string;
    doLose: string;
    dontLose: string;
    cardPlaceholder: string;
  };
  footer: string;
  language: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    welcome: {
      title: 'Clear your mind.',
      subtitle: 'In 3 taps.',
      button: 'Start',
    },
    tabs: {
      focus: 'Focus',
      tasks: 'Tasks',
      habits: 'Habits',
      decide: 'Decide',
    },
    habits: {
      title: 'Daily Habits',
      subtitle: 'Build consistency, one day at a time',
      addButton: 'Add Habit',
      placeholder: 'Enter habit name',
      maxReached: 'Maximum 6 habits',
      streak: 'streak',
      days: 'days',
    },
    tasks: {
      title: 'Today\'s Tasks',
      subtitle: 'What will you accomplish today?',
      addButton: 'Add Task',
      placeholder: 'Enter task',
      maxReached: 'Maximum 5 tasks',
      resetsDaily: 'Resets daily',
    },
    focus: {
      title: 'Focus Timer',
      subtitle: 'Choose your focus time',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      reset: 'Reset',
      complete: 'Time\'s up!',
      minutes: 'min',
    },
    decision: {
      title: 'Decision Tool',
      subtitle: 'Descartes Square for clarity',
      titlePlaceholder: 'What decision are you making?',
      doHappens: 'What happens if I do this?',
      dontHappens: 'What happens if I don\'t?',
      doLose: 'What do I lose if I do this?',
      dontLose: 'What do I lose if I don\'t?',
      cardPlaceholder: 'Write your thoughts...',
    },
    footer: 'One tool. $1. For clarity.',
    language: 'Language',
  },
  es: {
    welcome: {
      title: 'Aclara tu mente.',
      subtitle: 'En 3 toques.',
      button: 'Empezar',
    },
    tabs: {
      focus: 'Enfoque',
      tasks: 'Tareas',
      habits: 'Hábitos',
      decide: 'Decidir',
    },
    habits: {
      title: 'Hábitos Diarios',
      subtitle: 'Construye consistencia, día a día',
      addButton: 'Añadir Hábito',
      placeholder: 'Nombre del hábito',
      maxReached: 'Máximo 6 hábitos',
      streak: 'racha',
      days: 'días',
    },
    tasks: {
      title: 'Tareas de Hoy',
      subtitle: '¿Qué lograrás hoy?',
      addButton: 'Añadir Tarea',
      placeholder: 'Escribe una tarea',
      maxReached: 'Máximo 5 tareas',
      resetsDaily: 'Se reinicia diariamente',
    },
    focus: {
      title: 'Temporizador de Enfoque',
      subtitle: 'Elige tu tiempo de enfoque',
      start: 'Iniciar',
      pause: 'Pausar',
      resume: 'Reanudar',
      reset: 'Reiniciar',
      complete: '¡Tiempo terminado!',
      minutes: 'min',
    },
    decision: {
      title: 'Herramienta de Decisión',
      subtitle: 'Cuadrado de Descartes para claridad',
      titlePlaceholder: '¿Qué decisión estás tomando?',
      doHappens: '¿Qué pasa si hago esto?',
      dontHappens: '¿Qué pasa si no lo hago?',
      doLose: '¿Qué pierdo si hago esto?',
      dontLose: '¿Qué pierdo si no lo hago?',
      cardPlaceholder: 'Escribe tus pensamientos...',
    },
    footer: 'Una herramienta. $1. Para claridad.',
    language: 'Idioma',
  },
  fr: {
    welcome: {
      title: 'Clarifiez votre esprit.',
      subtitle: 'En 3 clics.',
      button: 'Commencer',
    },
    tabs: {
      focus: 'Focus',
      tasks: 'Tâches',
      habits: 'Habitudes',
      decide: 'Décider',
    },
    habits: {
      title: 'Habitudes Quotidiennes',
      subtitle: 'Construisez la cohérence, jour après jour',
      addButton: 'Ajouter Habitude',
      placeholder: 'Nom de l\'habitude',
      maxReached: 'Maximum 6 habitudes',
      streak: 'série',
      days: 'jours',
    },
    tasks: {
      title: 'Tâches du Jour',
      subtitle: 'Qu\'accomplirez-vous aujourd\'hui?',
      addButton: 'Ajouter Tâche',
      placeholder: 'Entrez une tâche',
      maxReached: 'Maximum 5 tâches',
      resetsDaily: 'Réinitialise quotidiennement',
    },
    focus: {
      title: 'Minuteur de Focus',
      subtitle: 'Choisissez votre temps de focus',
      start: 'Démarrer',
      pause: 'Pause',
      resume: 'Reprendre',
      reset: 'Réinitialiser',
      complete: 'Temps écoulé!',
      minutes: 'min',
    },
    decision: {
      title: 'Outil de Décision',
      subtitle: 'Carré de Descartes pour la clarté',
      titlePlaceholder: 'Quelle décision prenez-vous?',
      doHappens: 'Que se passe-t-il si je fais cela?',
      dontHappens: 'Que se passe-t-il si je ne fais pas?',
      doLose: 'Que perds-je si je fais cela?',
      dontLose: 'Que perds-je si je ne fais pas?',
      cardPlaceholder: 'Écrivez vos pensées...',
    },
    footer: 'Un outil. $1. Pour la clarté.',
    language: 'Langue',
  },
  de: {
    welcome: {
      title: 'Kläre deinen Geist.',
      subtitle: 'In 3 Klicks.',
      button: 'Starten',
    },
    tabs: {
      focus: 'Fokus',
      tasks: 'Aufgaben',
      habits: 'Gewohnheiten',
      decide: 'Entscheiden',
    },
    habits: {
      title: 'Tägliche Gewohnheiten',
      subtitle: 'Baue Beständigkeit auf, Tag für Tag',
      addButton: 'Gewohnheit Hinzufügen',
      placeholder: 'Gewohnheit eingeben',
      maxReached: 'Maximum 6 Gewohnheiten',
      streak: 'Serie',
      days: 'Tage',
    },
    tasks: {
      title: 'Heutige Aufgaben',
      subtitle: 'Was wirst du heute erreichen?',
      addButton: 'Aufgabe Hinzufügen',
      placeholder: 'Aufgabe eingeben',
      maxReached: 'Maximum 5 Aufgaben',
      resetsDaily: 'Täglich zurücksetzen',
    },
    focus: {
      title: 'Fokus-Timer',
      subtitle: 'Wähle deine Fokuszeit',
      start: 'Start',
      pause: 'Pause',
      resume: 'Fortsetzen',
      reset: 'Zurücksetzen',
      complete: 'Zeit ist um!',
      minutes: 'Min',
    },
    decision: {
      title: 'Entscheidungshilfe',
      subtitle: 'Descartes-Quadrat für Klarheit',
      titlePlaceholder: 'Welche Entscheidung triffst du?',
      doHappens: 'Was passiert, wenn ich das tue?',
      dontHappens: 'Was passiert, wenn ich es nicht tue?',
      doLose: 'Was verliere ich, wenn ich das tue?',
      dontLose: 'Was verliere ich, wenn ich es nicht tue?',
      cardPlaceholder: 'Schreibe deine Gedanken...',
    },
    footer: 'Ein Werkzeug. $1. Für Klarheit.',
    language: 'Sprache',
  },
  uk: {
    welcome: {
      title: 'Очисти свій розум.',
      subtitle: 'За 3 дотики.',
      button: 'Почати',
    },
    tabs: {
      focus: 'Фокус',
      tasks: 'Завдання',
      habits: 'Звички',
      decide: 'Рішення',
    },
    habits: {
      title: 'Щоденні Звички',
      subtitle: 'Будуй послідовність, день за днем',
      addButton: 'Додати Звичку',
      placeholder: 'Назва звички',
      maxReached: 'Максимум 6 звичок',
      streak: 'серія',
      days: 'днів',
    },
    tasks: {
      title: 'Завдання на Сьогодні',
      subtitle: 'Що ти досягнеш сьогодні?',
      addButton: 'Додати Завдання',
      placeholder: 'Введіть завдання',
      maxReached: 'Максимум 5 завдань',
      resetsDaily: 'Скидається щодня',
    },
    focus: {
      title: 'Таймер Фокусу',
      subtitle: 'Обери свій час для фокусу',
      start: 'Старт',
      pause: 'Пауза',
      resume: 'Продовжити',
      reset: 'Скинути',
      complete: 'Час вийшов!',
      minutes: 'хв',
    },
    decision: {
      title: 'Інструмент Рішень',
      subtitle: 'Квадрат Декарта для ясності',
      titlePlaceholder: 'Яке рішення ти приймаєш?',
      doHappens: 'Що станеться, якщо я це зроблю?',
      dontHappens: 'Що станеться, якщо я не зроблю?',
      doLose: 'Що я втрачу, якщо зроблю?',
      dontLose: 'Що я втрачу, якщо не зроблю?',
      cardPlaceholder: 'Напиши свої думки...',
    },
    footer: 'Один інструмент. $1. Для ясності.',
    language: 'Мова',
  },
  pt: {
    welcome: {
      title: 'Clareie sua mente.',
      subtitle: 'Em 3 toques.',
      button: 'Começar',
    },
    tabs: {
      focus: 'Foco',
      tasks: 'Tarefas',
      habits: 'Hábitos',
      decide: 'Decidir',
    },
    habits: {
      title: 'Hábitos Diários',
      subtitle: 'Construa consistência, dia após dia',
      addButton: 'Adicionar Hábito',
      placeholder: 'Nome do hábito',
      maxReached: 'Máximo 6 hábitos',
      streak: 'sequência',
      days: 'dias',
    },
    tasks: {
      title: 'Tarefas de Hoje',
      subtitle: 'O que você vai realizar hoje?',
      addButton: 'Adicionar Tarefa',
      placeholder: 'Digite uma tarefa',
      maxReached: 'Máximo 5 tarefas',
      resetsDaily: 'Reinicia diariamente',
    },
    focus: {
      title: 'Timer de Foco',
      subtitle: 'Escolha seu tempo de foco',
      start: 'Iniciar',
      pause: 'Pausar',
      resume: 'Continuar',
      reset: 'Reiniciar',
      complete: 'Tempo esgotado!',
      minutes: 'min',
    },
    decision: {
      title: 'Ferramenta de Decisão',
      subtitle: 'Quadrado de Descartes para clareza',
      titlePlaceholder: 'Que decisão você está tomando?',
      doHappens: 'O que acontece se eu fizer isso?',
      dontHappens: 'O que acontece se eu não fizer?',
      doLose: 'O que perco se eu fizer isso?',
      dontLose: 'O que perco se eu não fizer?',
      cardPlaceholder: 'Escreva seus pensamentos...',
    },
    footer: 'Uma ferramenta. $1. Para clareza.',
    language: 'Idioma',
  },
  it: {
    welcome: {
      title: 'Chiarisci la tua mente.',
      subtitle: 'In 3 tocchi.',
      button: 'Inizia',
    },
    tabs: {
      focus: 'Focus',
      tasks: 'Attività',
      habits: 'Abitudini',
      decide: 'Decidere',
    },
    habits: {
      title: 'Abitudini Giornaliere',
      subtitle: 'Costruisci coerenza, giorno dopo giorno',
      addButton: 'Aggiungi Abitudine',
      placeholder: 'Nome abitudine',
      maxReached: 'Massimo 6 abitudini',
      streak: 'serie',
      days: 'giorni',
    },
    tasks: {
      title: 'Attività di Oggi',
      subtitle: 'Cosa realizzerai oggi?',
      addButton: 'Aggiungi Attività',
      placeholder: 'Inserisci attività',
      maxReached: 'Massimo 5 attività',
      resetsDaily: 'Si resetta quotidianamente',
    },
    focus: {
      title: 'Timer di Focus',
      subtitle: 'Scegli il tuo tempo di focus',
      start: 'Avvia',
      pause: 'Pausa',
      resume: 'Riprendi',
      reset: 'Resetta',
      complete: 'Tempo scaduto!',
      minutes: 'min',
    },
    decision: {
      title: 'Strumento di Decisione',
      subtitle: 'Quadrato di Cartesio per chiarezza',
      titlePlaceholder: 'Quale decisione stai prendendo?',
      doHappens: 'Cosa succede se lo faccio?',
      dontHappens: 'Cosa succede se non lo faccio?',
      doLose: 'Cosa perdo se lo faccio?',
      dontLose: 'Cosa perdo se non lo faccio?',
      cardPlaceholder: 'Scrivi i tuoi pensieri...',
    },
    footer: 'Uno strumento. $1. Per chiarezza.',
    language: 'Lingua',
  },
  pl: {
    welcome: {
      title: 'Oczyść swój umysł.',
      subtitle: 'W 3 kliknięcia.',
      button: 'Rozpocznij',
    },
    tabs: {
      focus: 'Fokus',
      tasks: 'Zadania',
      habits: 'Nawyki',
      decide: 'Decyduj',
    },
    habits: {
      title: 'Codzienne Nawyki',
      subtitle: 'Buduj konsekwencję, dzień po dniu',
      addButton: 'Dodaj Nawyk',
      placeholder: 'Nazwa nawyku',
      maxReached: 'Maksymalnie 6 nawyków',
      streak: 'seria',
      days: 'dni',
    },
    tasks: {
      title: 'Dzisiejsze Zadania',
      subtitle: 'Co osiągniesz dzisiaj?',
      addButton: 'Dodaj Zadanie',
      placeholder: 'Wpisz zadanie',
      maxReached: 'Maksymalnie 5 zadań',
      resetsDaily: 'Resetuje się codziennie',
    },
    focus: {
      title: 'Timer Koncentracji',
      subtitle: 'Wybierz czas koncentracji',
      start: 'Start',
      pause: 'Pauza',
      resume: 'Wznów',
      reset: 'Resetuj',
      complete: 'Czas minął!',
      minutes: 'min',
    },
    decision: {
      title: 'Narzędzie Decyzyjne',
      subtitle: 'Kwadrat Kartezjusza dla jasności',
      titlePlaceholder: 'Jaką decyzję podejmujesz?',
      doHappens: 'Co się stanie, jeśli to zrobię?',
      dontHappens: 'Co się stanie, jeśli tego nie zrobię?',
      doLose: 'Co stracę, jeśli to zrobię?',
      dontLose: 'Co stracę, jeśli tego nie zrobię?',
      cardPlaceholder: 'Napisz swoje myśli...',
    },
    footer: 'Jedno narzędzie. $1. Dla jasności.',
    language: 'Język',
  },
  ru: {
    welcome: {
      title: 'Очисти свой разум.',
      subtitle: 'За 3 касания.',
      button: 'Начать',
    },
    tabs: {
      focus: 'Фокус',
      tasks: 'Задачи',
      habits: 'Привычки',
      decide: 'Решить',
    },
    habits: {
      title: 'Ежедневные Привычки',
      subtitle: 'Стройте последовательность, день за днём',
      addButton: 'Добавить Привычку',
      placeholder: 'Название привычки',
      maxReached: 'Максимум 6 привычек',
      streak: 'серия',
      days: 'дней',
    },
    tasks: {
      title: 'Задачи на Сегодня',
      subtitle: 'Что вы достигнете сегодня?',
      addButton: 'Добавить Задачу',
      placeholder: 'Введите задачу',
      maxReached: 'Максимум 5 задач',
      resetsDaily: 'Сбрасывается ежедневно',
    },
    focus: {
      title: 'Таймер Фокуса',
      subtitle: 'Выберите время для фокуса',
      start: 'Старт',
      pause: 'Пауза',
      resume: 'Продолжить',
      reset: 'Сбросить',
      complete: 'Время вышло!',
      minutes: 'мин',
    },
    decision: {
      title: 'Инструмент Решений',
      subtitle: 'Квадрат Декарта для ясности',
      titlePlaceholder: 'Какое решение вы принимаете?',
      doHappens: 'Что произойдёт, если я сделаю это?',
      dontHappens: 'Что произойдёт, если я не сделаю?',
      doLose: 'Что я потеряю, если сделаю это?',
      dontLose: 'Что я потеряю, если не сделаю?',
      cardPlaceholder: 'Напишите свои мысли...',
    },
    footer: 'Один инструмент. $1. Для ясности.',
    language: 'Язык',
  },
  zh: {
    welcome: {
      title: '清空你的思绪。',
      subtitle: '只需3次点击。',
      button: '开始',
    },
    tabs: {
      focus: '专注',
      tasks: '任务',
      habits: '习惯',
      decide: '决策',
    },
    habits: {
      title: '每日习惯',
      subtitle: '建立坚持，日复一日',
      addButton: '添加习惯',
      placeholder: '输入习惯名称',
      maxReached: '最多6个习惯',
      streak: '连续',
      days: '天',
    },
    tasks: {
      title: '今日任务',
      subtitle: '你今天要完成什么？',
      addButton: '添加任务',
      placeholder: '输入任务',
      maxReached: '最多5个任务',
      resetsDaily: '每日重置',
    },
    focus: {
      title: '专注计时器',
      subtitle: '选择您的专注时间',
      start: '开始',
      pause: '暂停',
      resume: '继续',
      reset: '重置',
      complete: '时间到！',
      minutes: '分钟',
    },
    decision: {
      title: '决策工具',
      subtitle: '笛卡尔方格助你决策',
      titlePlaceholder: '你在做什么决定？',
      doHappens: '如果我这样做会怎样？',
      dontHappens: '如果我不这样做会怎样？',
      doLose: '如果我这样做会失去什么？',
      dontLose: '如果我不这样做会失去什么？',
      cardPlaceholder: '写下你的想法...',
    },
    footer: '一个工具。$1。为清晰而生。',
    language: '语言',
  },
};
