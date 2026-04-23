export type Language =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'uk'
  | 'pt'
  | 'it'
  | 'pl'
  | 'ru'
  | 'zh'
  | 'nl'
  | 'cs'
  | 'sk'
  | 'ro'
  | 'hu'
  | 'tr'
  | 'ar'
  | 'ja'
  | 'ko'
  | 'hi'
  | 'bn'
  | 'vi'
  | 'id'
  | 'kk';

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
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
];

export interface Translations {
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
    player: string;
    reader: string;
    settings: string;
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
    analysisTitle: string;
    analysisFillAll: string;
    verdictDo: string;
    verdictDont: string;
    verdictUnclear: string;
    reasonsFor: string;
    reasonsAgainst: string;
    clear: string;
  };
  player: {
    title: string;
    uploadAudio: string;
    uploadVideo: string;
    addUrl: string;
    addYoutube: string;
    supported: string;
    empty: string;
    nowPlaying: string;
    playlist: string;
    urlPlaceholder: string;
    youtubePlaceholder: string;
    invalidUrl: string;
    add: string;
    loading: string;
  };
  reader: {
    title: string;
    upload: string;
    supported: string;
    empty: string;
    page: string;
    of: string;
    backToLibrary: string;
    fontSize: string;
    previewText: string;
  };
  settings: {
    title: string;
    languageLabel: string;
    themeLabel: string;
    dark: string;
    light: string;
  };
  footer: string;
  language: string;
}

type TranslationOverrides = {
  welcome?: Partial<Translations['welcome']>;
  tabs?: Partial<Translations['tabs']>;
  habits?: Partial<Translations['habits']>;
  tasks?: Partial<Translations['tasks']>;
  focus?: Partial<Translations['focus']>;
  decision?: Partial<Translations['decision']>;
  player?: Partial<Translations['player']>;
  reader?: Partial<Translations['reader']>;
  settings?: Partial<Translations['settings']>;
  footer?: string;
  language?: string;
};

const enBase: Translations = {
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
    player: 'Player',
    reader: 'Reader',
    settings: 'Settings',
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
    title: "Today's Tasks",
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
    complete: "Time's up!",
    minutes: 'min',
  },
  decision: {
    title: 'Decision Tool',
    subtitle: 'Descartes Square for clarity',
    titlePlaceholder: 'What decision are you making?',
    doHappens: 'What happens if I do this?',
    dontHappens: "What happens if I don't?",
    doLose: 'What do I lose if I do this?',
    dontLose: "What do I lose if I don't?",
    cardPlaceholder: 'Write your thoughts...',
    analysisTitle: 'Verdict',
    analysisFillAll: 'Fill in all four quadrants to see the analysis.',
    verdictDo: 'Do it',
    verdictDont: "Don't do it",
    verdictUnclear: 'Weigh carefully',
    reasonsFor: 'Reasons for',
    reasonsAgainst: 'Reasons against',
    clear: 'Clear all',
  },
  player: {
    title: 'Media Player',
    uploadAudio: 'Upload Audio',
    uploadVideo: 'Upload Video',
    addUrl: 'Add URL',
    addYoutube: 'YouTube',
    supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · Direct URL',
    empty: 'No files. Upload media or add a URL to start.',
    nowPlaying: 'Now Playing',
    playlist: 'Playlist',
    urlPlaceholder: 'Paste direct media URL (mp3, mp4...)',
    youtubePlaceholder: 'Paste YouTube URL or video ID',
    invalidUrl: 'Invalid URL or YouTube link',
    add: 'Add',
    loading: 'Loading...',
  },
  reader: {
    title: 'Book Reader',
    upload: 'Upload Book',
    supported: 'EPUB, PDF, TXT, FB2',
    empty: 'No books yet. Upload a file to start reading.',
    page: 'Page',
    of: 'of',
    backToLibrary: 'Library',
    fontSize: 'Font size',
    previewText: 'Book content will appear here. Full EPUB and PDF rendering supported.',
  },
  settings: {
    title: 'Settings',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    dark: 'Dark',
    light: 'Light',
  },
  footer: 'One tool. $1. For clarity.',
  language: 'Language',
};

const createTranslation = (overrides: TranslationOverrides = {}): Translations => ({
  welcome: { ...enBase.welcome, ...overrides.welcome },
  tabs: { ...enBase.tabs, ...overrides.tabs },
  habits: { ...enBase.habits, ...overrides.habits },
  tasks: { ...enBase.tasks, ...overrides.tasks },
  focus: { ...enBase.focus, ...overrides.focus },
  decision: { ...enBase.decision, ...overrides.decision },
  player: { ...enBase.player, ...overrides.player },
  reader: { ...enBase.reader, ...overrides.reader },
  settings: { ...enBase.settings, ...overrides.settings },
  footer: overrides.footer ?? enBase.footer,
  language: overrides.language ?? enBase.language,
});

export const translations: Record<Language, Translations> = {
  en: enBase,

  es: createTranslation({
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
      player: 'Reproductor',
      reader: 'Lector',
      settings: 'Ajustes',
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
      analysisTitle: 'Veredicto',
      analysisFillAll: 'Rellena los cuatro cuadrantes para ver el análisis.',
      verdictDo: 'Hazlo',
      verdictDont: 'No lo hagas',
      verdictUnclear: 'Pondera con cuidado',
      reasonsFor: 'Razones a favor',
      reasonsAgainst: 'Razones en contra',
      clear: 'Borrar todo',
    },
    player: {
      title: 'Reproductor',
      uploadAudio: 'Subir Audio',
      uploadVideo: 'Subir Video',
      addUrl: 'Agregar URL',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: 'Sin archivos.',
      nowPlaying: 'Reproduciendo',
      playlist: 'Lista',
      urlPlaceholder: 'Pegar URL de medios (mp3, mp4...)',
      youtubePlaceholder: 'Pegar URL o ID de YouTube',
      invalidUrl: 'URL o enlace de YouTube inválido',
      add: 'Agregar',
      loading: 'Cargando...',
    },
    reader: {
      title: 'Lector de Libros',
      upload: 'Subir Libro',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: 'Sin libros. Sube un archivo.',
      page: 'Pág.',
      of: 'de',
      backToLibrary: 'Biblioteca',
      fontSize: 'Tamaño de fuente',
      previewText: 'El contenido del libro aparecerá aquí.',
    },
    settings: {
      title: 'Ajustes',
      languageLabel: 'Idioma',
      themeLabel: 'Tema',
      dark: 'Oscuro',
      light: 'Claro',
    },
    footer: 'Una herramienta. $1. Para claridad.',
    language: 'Idioma',
  }),

  fr: createTranslation({
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
      player: 'Lecteur',
      reader: 'Livres',
      settings: 'Réglages',
    },
    habits: {
      title: 'Habitudes Quotidiennes',
      subtitle: 'Construisez la cohérence, jour après jour',
      addButton: 'Ajouter Habitude',
      placeholder: "Nom de l'habitude",
      maxReached: 'Maximum 6 habitudes',
      streak: 'série',
      days: 'jours',
    },
    tasks: {
      title: 'Tâches du Jour',
      subtitle: "Qu'accomplirez-vous aujourd'hui?",
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
      analysisTitle: 'Verdict',
      analysisFillAll: 'Remplissez les quatre quadrants pour voir l\'analyse.',
      verdictDo: 'Faites-le',
      verdictDont: 'Ne le faites pas',
      verdictUnclear: 'Pesez soigneusement',
      reasonsFor: 'Raisons pour',
      reasonsAgainst: 'Raisons contre',
      clear: 'Tout effacer',
    },
    player: {
      title: 'Lecteur Média',
      uploadAudio: 'Charger Audio',
      uploadVideo: 'Charger Vidéo',
      addUrl: 'Ajouter URL',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: 'Pas de fichiers.',
      nowPlaying: 'En cours',
      playlist: 'Playlist',
      urlPlaceholder: "Coller l'URL (mp3, mp4...)",
      youtubePlaceholder: "Coller l'URL ou ID YouTube",
      invalidUrl: 'URL ou lien YouTube invalide',
      add: 'Ajouter',
      loading: 'Chargement...',
    },
    reader: {
      title: 'Lecteur de Livres',
      upload: 'Charger un Livre',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: 'Pas de livres. Chargez un fichier.',
      page: 'Page',
      of: 'sur',
      backToLibrary: 'Bibliothèque',
      fontSize: 'Taille du texte',
      previewText: 'Le contenu du livre apparaîtra ici.',
    },
    settings: {
      title: 'Réglages',
      languageLabel: 'Langue',
      themeLabel: 'Thème',
      dark: 'Sombre',
      light: 'Clair',
    },
    footer: 'Un outil. $1. Pour la clarté.',
    language: 'Langue',
  }),

  de: createTranslation({
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
      player: 'Player',
      reader: 'Bücher',
      settings: 'Einstellungen',
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
      analysisTitle: 'Ergebnis',
      analysisFillAll: 'Füllen Sie alle vier Quadranten aus, um die Analyse zu sehen.',
      verdictDo: 'Tu es',
      verdictDont: 'Tu es nicht',
      verdictUnclear: 'Sorgfältig abwägen',
      reasonsFor: 'Gründe dafür',
      reasonsAgainst: 'Gründe dagegen',
      clear: 'Alles löschen',
    },
    player: {
      title: 'Media Player',
      uploadAudio: 'Audio laden',
      uploadVideo: 'Video laden',
      addUrl: 'URL hinzufügen',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: 'Keine Dateien.',
      nowPlaying: 'Spielt',
      playlist: 'Playlist',
      urlPlaceholder: 'Medien-URL einfügen (mp3, mp4...)',
      youtubePlaceholder: 'YouTube-URL oder Video-ID einfügen',
      invalidUrl: 'Ungültige URL oder YouTube-Link',
      add: 'Hinzufügen',
      loading: 'Laden...',
    },
    reader: {
      title: 'Buchleser',
      upload: 'Buch laden',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: 'Keine Bücher. Lade eine Datei hoch.',
      page: 'Seite',
      of: 'von',
      backToLibrary: 'Bibliothek',
      fontSize: 'Schriftgröße',
      previewText: 'Buchinhalt erscheint hier.',
    },
    settings: {
      title: 'Einstellungen',
      languageLabel: 'Sprache',
      themeLabel: 'Thema',
      dark: 'Dunkel',
      light: 'Hell',
    },
    footer: 'Ein Werkzeug. $1. Für Klarheit.',
    language: 'Sprache',
  }),

  uk: createTranslation({
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
      player: 'Плеєр',
      reader: 'Читалка',
      settings: 'Налашт.',
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
      analysisTitle: 'Вердикт',
      analysisFillAll: 'Заповніть усі чотири квадранти, щоб побачити аналіз.',
      verdictDo: 'Зроби це',
      verdictDont: 'Не роби цього',
      verdictUnclear: 'Зваж уважно',
      reasonsFor: 'Причини за',
      reasonsAgainst: 'Причини проти',
      clear: 'Очистити все',
    },
    player: {
      title: 'Медіа-плеєр',
      uploadAudio: 'Аудіо з пристрою',
      uploadVideo: 'Відео з пристрою',
      addUrl: 'Пряме посилання',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: 'Немає файлів. Завантажте медіа або додайте посилання.',
      nowPlaying: 'Зараз грає',
      playlist: 'Плейлист',
      urlPlaceholder: 'Вставте пряме посилання на медіа (mp3, mp4...)',
      youtubePlaceholder: 'Вставте посилання YouTube або ID відео',
      invalidUrl: 'Невірне посилання YouTube або URL',
      add: 'Додати',
      loading: 'Завантаження...',
    },
    reader: {
      title: 'Читалка книг',
      upload: 'Завантажити книгу',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: 'Немає книг. Завантажте файл.',
      page: 'Стор.',
      of: 'з',
      backToLibrary: 'Бібліотека',
      fontSize: 'Розмір шрифту',
      previewText: 'Вміст книги відображатиметься тут. Підтримується EPUB та PDF.',
    },
    settings: {
      title: 'Налаштування',
      languageLabel: 'Мова',
      themeLabel: 'Тема',
      dark: 'Темна',
      light: 'Світла',
    },
    footer: 'Один інструмент. $1. Для ясності.',
    language: 'Мова',
  }),

  pt: createTranslation({
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
      player: 'Player',
      reader: 'Leitor',
      settings: 'Config.',
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
      analysisTitle: 'Veredicto',
      analysisFillAll: 'Preencha os quatro quadrantes para ver a análise.',
      verdictDo: 'Faça',
      verdictDont: 'Não faça',
      verdictUnclear: 'Pondere com cuidado',
      reasonsFor: 'Razões a favor',
      reasonsAgainst: 'Razões contra',
      clear: 'Limpar tudo',
    },
    player: {
      title: 'Player de Mídia',
      uploadAudio: 'Carregar Áudio',
      uploadVideo: 'Carregar Vídeo',
      addUrl: 'Adicionar URL',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: 'Sem arquivos.',
      nowPlaying: 'Tocando',
      playlist: 'Playlist',
      urlPlaceholder: 'Colar URL de mídia (mp3, mp4...)',
      youtubePlaceholder: 'Colar URL ou ID do YouTube',
      invalidUrl: 'URL ou link do YouTube inválido',
      add: 'Adicionar',
      loading: 'Carregando...',
    },
    reader: {
      title: 'Leitor de Livros',
      upload: 'Carregar Livro',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: 'Sem livros. Carregue um arquivo.',
      page: 'Pág.',
      of: 'de',
      backToLibrary: 'Biblioteca',
      fontSize: 'Tamanho da fonte',
      previewText: 'O conteúdo do livro aparecerá aqui.',
    },
    settings: {
      title: 'Configurações',
      languageLabel: 'Idioma',
      themeLabel: 'Tema',
      dark: 'Escuro',
      light: 'Claro',
    },
    footer: 'Uma ferramenta. $1. Para clareza.',
    language: 'Idioma',
  }),

  it: createTranslation({
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
      player: 'Player',
      reader: 'Lettura',
      settings: 'Opzioni',
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
      analysisTitle: 'Verdetto',
      analysisFillAll: 'Compila tutti e quattro i quadranti per vedere l\'analisi.',
      verdictDo: 'Fallo',
      verdictDont: 'Non farlo',
      verdictUnclear: 'Valuta attentamente',
      reasonsFor: 'Ragioni a favore',
      reasonsAgainst: 'Ragioni contro',
      clear: 'Cancella tutto',
    },
    player: {
      title: 'Lettore Multimediale',
      uploadAudio: 'Carica Audio',
      uploadVideo: 'Carica Video',
      addUrl: 'Aggiungi URL',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: 'Nessun file.',
      nowPlaying: 'In riproduzione',
      playlist: 'Playlist',
      urlPlaceholder: 'Incolla URL media (mp3, mp4...)',
      youtubePlaceholder: 'Incolla URL o ID YouTube',
      invalidUrl: 'URL o link YouTube non valido',
      add: 'Aggiungi',
      loading: 'Caricamento...',
    },
    reader: {
      title: 'Lettore di Libri',
      upload: 'Carica Libro',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: 'Nessun libro. Carica un file.',
      page: 'Pag.',
      of: 'di',
      backToLibrary: 'Biblioteca',
      fontSize: 'Dimensione font',
      previewText: 'Il contenuto del libro apparirà qui.',
    },
    settings: {
      title: 'Impostazioni',
      languageLabel: 'Lingua',
      themeLabel: 'Tema',
      dark: 'Scuro',
      light: 'Chiaro',
    },
    footer: 'Uno strumento. $1. Per chiarezza.',
    language: 'Lingua',
  }),

  pl: createTranslation({
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
      player: 'Player',
      reader: 'Czytnik',
      settings: 'Ustawienia',
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
      analysisTitle: 'Werdykt',
      analysisFillAll: 'Wypełnij wszystkie cztery ćwiartki, aby zobaczyć analizę.',
      verdictDo: 'Zrób to',
      verdictDont: 'Nie rób tego',
      verdictUnclear: 'Rozważ ostrożnie',
      reasonsFor: 'Powody za',
      reasonsAgainst: 'Powody przeciw',
      clear: 'Wyczyść wszystko',
    },
    player: {
      title: 'Odtwarzacz',
      uploadAudio: 'Wgraj Audio',
      uploadVideo: 'Wgraj Wideo',
      addUrl: 'Dodaj URL',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: 'Brak plików.',
      nowPlaying: 'Odtwarzanie',
      playlist: 'Lista',
      urlPlaceholder: 'Wklej URL mediów (mp3, mp4...)',
      youtubePlaceholder: 'Wklej URL lub ID YouTube',
      invalidUrl: 'Nieprawidłowy URL lub link YouTube',
      add: 'Dodaj',
      loading: 'Ładowanie...',
    },
    reader: {
      title: 'Czytnik Książek',
      upload: 'Wgraj Książkę',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: 'Brak książek. Wgraj plik.',
      page: 'Str.',
      of: 'z',
      backToLibrary: 'Biblioteka',
      fontSize: 'Rozmiar czcionki',
      previewText: 'Treść książki pojawi się tutaj.',
    },
    settings: {
      title: 'Ustawienia',
      languageLabel: 'Język',
      themeLabel: 'Motyw',
      dark: 'Ciemny',
      light: 'Jasny',
    },
    footer: 'Jedno narzędzie. $1. Dla jasności.',
    language: 'Język',
  }),

  ru: createTranslation({
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
      player: 'Плеер',
      reader: 'Читалка',
      settings: 'Настройки',
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
      analysisTitle: 'Вердикт',
      analysisFillAll: 'Заполните все четыре квадранта, чтобы увидеть анализ.',
      verdictDo: 'Сделай это',
      verdictDont: 'Не делай этого',
      verdictUnclear: 'Взвесь внимательно',
      reasonsFor: 'Причины за',
      reasonsAgainst: 'Причины против',
      clear: 'Очистить всё',
    },
    player: {
      title: 'Медиа-плеер',
      uploadAudio: 'Загрузить аудио',
      uploadVideo: 'Загрузить видео',
      addUrl: 'Добавить URL',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: 'Нет файлов.',
      nowPlaying: 'Сейчас играет',
      playlist: 'Плейлист',
      urlPlaceholder: 'Вставьте прямую ссылку (mp3, mp4...)',
      youtubePlaceholder: 'Вставьте ссылку YouTube или ID видео',
      invalidUrl: 'Неверная ссылка YouTube или URL',
      add: 'Добавить',
      loading: 'Загрузка...',
    },
    reader: {
      title: 'Читалка книг',
      upload: 'Загрузить книгу',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: 'Нет книг. Загрузите файл.',
      page: 'Стр.',
      of: 'из',
      backToLibrary: 'Библиотека',
      fontSize: 'Размер шрифта',
      previewText: 'Содержимое книги появится здесь. Поддерживается EPUB и PDF.',
    },
    settings: {
      title: 'Настройки',
      languageLabel: 'Язык',
      themeLabel: 'Тема',
      dark: 'Тёмная',
      light: 'Светлая',
    },
    footer: 'Один инструмент. $1. Для ясности.',
    language: 'Язык',
  }),

  zh: createTranslation({
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
      player: '播放器',
      reader: '阅读',
      settings: '设置',
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
      analysisTitle: '判定',
      analysisFillAll: '填写所有四个象限以查看分析。',
      verdictDo: '去做',
      verdictDont: '不要做',
      verdictUnclear: '仔细权衡',
      reasonsFor: '赞成的理由',
      reasonsAgainst: '反对的理由',
      clear: '全部清除',
    },
    player: {
      title: '媒体播放器',
      uploadAudio: '上传音频',
      uploadVideo: '上传视频',
      addUrl: '添加URL',
      addYoutube: 'YouTube',
      supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL',
      empty: '没有文件。',
      nowPlaying: '正在播放',
      playlist: '播放列表',
      urlPlaceholder: '粘贴媒体URL (mp3, mp4...)',
      youtubePlaceholder: '粘贴YouTube链接或视频ID',
      invalidUrl: '无效的URL或YouTube链接',
      add: '添加',
      loading: '加载中...',
    },
    reader: {
      title: '电子书阅读器',
      upload: '上传书籍',
      supported: 'EPUB, PDF, TXT, FB2',
      empty: '没有书籍。请上传文件。',
      page: '页',
      of: '共',
      backToLibrary: '书库',
      fontSize: '字体大小',
      previewText: '书籍内容将在此显示。支持EPUB和PDF格式。',
    },
    settings: {
      title: '设置',
      languageLabel: '语言',
      themeLabel: '主题',
      dark: '深色',
      light: '浅色',
    },
    footer: '一个工具。$1。为清晰而生。',
    language: '语言',
  }),

  nl: createTranslation({
    tabs: { settings: 'Instellingen' },
    settings: {
      title: 'Instellingen',
      languageLabel: 'Taal',
      themeLabel: 'Thema',
      dark: 'Donker',
      light: 'Licht',
    },
    language: 'Taal',
  }),

  cs: createTranslation({
    tabs: { settings: 'Nastavení' },
    settings: {
      title: 'Nastavení',
      languageLabel: 'Jazyk',
      themeLabel: 'Motiv',
      dark: 'Tmavý',
      light: 'Světlý',
    },
    language: 'Jazyk',
  }),

  sk: createTranslation({
    tabs: { settings: 'Nastavenia' },
    settings: {
      title: 'Nastavenia',
      languageLabel: 'Jazyk',
      themeLabel: 'Téma',
      dark: 'Tmavá',
      light: 'Svetlá',
    },
    language: 'Jazyk',
  }),

  ro: createTranslation({
    tabs: { settings: 'Setări' },
    settings: {
      title: 'Setări',
      languageLabel: 'Limbă',
      themeLabel: 'Temă',
      dark: 'Întunecată',
      light: 'Luminoasă',
    },
    language: 'Limbă',
  }),

  hu: createTranslation({
    tabs: { settings: 'Beállítások' },
    settings: {
      title: 'Beállítások',
      languageLabel: 'Nyelv',
      themeLabel: 'Téma',
      dark: 'Sötét',
      light: 'Világos',
    },
    language: 'Nyelv',
  }),

  tr: createTranslation({
    tabs: { settings: 'Ayarlar' },
    settings: {
      title: 'Ayarlar',
      languageLabel: 'Dil',
      themeLabel: 'Tema',
      dark: 'Koyu',
      light: 'Acik',
    },
    language: 'Dil',
  }),

  ar: createTranslation({
    tabs: { settings: 'الإعدادات' },
    settings: {
      title: 'الإعدادات',
      languageLabel: 'اللغة',
      themeLabel: 'السمة',
      dark: 'داكن',
      light: 'فاتح',
    },
    language: 'اللغة',
  }),

  ja: createTranslation({
    tabs: { settings: '設定' },
    settings: {
      title: '設定',
      languageLabel: '言語',
      themeLabel: 'テーマ',
      dark: 'ダーク',
      light: 'ライト',
    },
    language: '言語',
  }),

  ko: createTranslation({
    tabs: { settings: '설정' },
    settings: {
      title: '설정',
      languageLabel: '언어',
      themeLabel: '테마',
      dark: '다크',
      light: '라이트',
    },
    language: '언어',
  }),

  hi: createTranslation({
    tabs: { settings: 'सेटिंग्स' },
    settings: {
      title: 'सेटिंग्स',
      languageLabel: 'भाषा',
      themeLabel: 'थीम',
      dark: 'डार्क',
      light: 'लाइट',
    },
    language: 'भाषा',
  }),

  bn: createTranslation({
    tabs: { settings: 'সেটিংস' },
    settings: {
      title: 'সেটিংস',
      languageLabel: 'ভাষা',
      themeLabel: 'থিম',
      dark: 'ডার্ক',
      light: 'লাইট',
    },
    language: 'ভাষা',
  }),

  vi: createTranslation({
    tabs: { settings: 'Cài đặt' },
    settings: {
      title: 'Cài đặt',
      languageLabel: 'Ngôn ngữ',
      themeLabel: 'Giao diện',
      dark: 'Tối',
      light: 'Sáng',
    },
    language: 'Ngôn ngữ',
  }),

  id: createTranslation({
    tabs: { settings: 'Pengaturan' },
    settings: {
      title: 'Pengaturan',
      languageLabel: 'Bahasa',
      themeLabel: 'Tema',
      dark: 'Gelap',
      light: 'Terang',
    },
    language: 'Bahasa',
  }),

  kk: createTranslation({
    tabs: { settings: 'Баптаулар' },
    settings: {
      title: 'Баптаулар',
      languageLabel: 'Тіл',
      themeLabel: 'Тақырып',
      dark: 'Қараңғы',
      light: 'Жарық',
    },
    language: 'Тіл',
  }),
};
