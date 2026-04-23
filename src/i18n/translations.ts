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
    welcome: { title: 'Helder hoofd.', subtitle: 'In 3 tikken.', button: 'Start' },
    tabs: { focus: 'Focus', tasks: 'Taken', habits: 'Gewoontes', decide: 'Besluit', player: 'Speler', reader: 'Lezer', settings: 'Instellingen' },
    habits: { title: 'Dagelijkse Gewoontes', subtitle: 'Bouw consistentie, dag voor dag', addButton: 'Gewoonte toevoegen', placeholder: 'Voer gewoonte in', maxReached: 'Maximum 6 gewoontes', streak: 'reeks', days: 'dagen' },
    tasks: { title: 'Taken van Vandaag', subtitle: 'Wat ga je vandaag bereiken?', addButton: 'Taak toevoegen', placeholder: 'Voer taak in', maxReached: 'Maximum 5 taken', resetsDaily: 'Wordt dagelijks gereset' },
    focus: { title: 'Focus Timer', subtitle: 'Kies je focustijd', start: 'Start', pause: 'Pauze', resume: 'Hervat', reset: 'Reset', complete: 'Tijd is om!', minutes: 'min' },
    decision: { title: 'Beslissingstool', subtitle: 'Descartes Vierkant voor helderheid', titlePlaceholder: 'Welke beslissing neem je?', doHappens: 'Wat gebeurt er als ik dit doe?', dontHappens: 'Wat gebeurt er als ik dit niet doe?', doLose: 'Wat verlies ik als ik dit doe?', dontLose: 'Wat verlies ik als ik dit niet doe?', cardPlaceholder: 'Schrijf je gedachten...', analysisTitle: 'Oordeel', analysisFillAll: 'Vul alle vier kwadranten in om de analyse te zien.', verdictDo: 'Doe het', verdictDont: 'Doe het niet', verdictUnclear: 'Weeg zorgvuldig af', reasonsFor: 'Redenen voor', reasonsAgainst: 'Redenen tegen', clear: 'Alles wissen' },
    player: { title: 'Mediaspeler', uploadAudio: 'Audio uploaden', uploadVideo: 'Video uploaden', addUrl: 'URL toevoegen', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · Directe URL', empty: 'Geen bestanden. Upload media of voeg een URL toe.', nowPlaying: 'Nu afspelen', playlist: 'Afspeellijst', urlPlaceholder: 'Plak directe media URL (mp3, mp4...)', youtubePlaceholder: 'Plak YouTube URL of video-ID', invalidUrl: 'Ongeldige URL of YouTube link', add: 'Toevoegen', loading: 'Laden...' },
    reader: { title: 'Boeklezer', upload: 'Boek uploaden', supported: 'EPUB, PDF, TXT, FB2', empty: 'Nog geen boeken. Upload een bestand om te beginnen.', page: 'Pagina', of: 'van', backToLibrary: 'Bibliotheek', fontSize: 'Lettergrootte', previewText: 'Boekinhoud verschijnt hier.' },
    settings: { title: 'Instellingen', languageLabel: 'Taal', themeLabel: 'Thema', dark: 'Donker', light: 'Licht' },
    footer: 'Eén tool. $1. Voor helderheid.',
    language: 'Taal',
  }),

  cs: createTranslation({
    welcome: { title: 'Vyčisti mysl.', subtitle: 'Na 3 kliknutí.', button: 'Začít' },
    tabs: { focus: 'Soustředění', tasks: 'Úkoly', habits: 'Návyky', decide: 'Rozhodnutí', player: 'Přehrávač', reader: 'Čtečka', settings: 'Nastavení' },
    habits: { title: 'Denní návyky', subtitle: 'Buduj konzistenci, den po dni', addButton: 'Přidat návyk', placeholder: 'Zadej název návyku', maxReached: 'Maximum 6 návyků', streak: 'série', days: 'dní' },
    tasks: { title: 'Dnešní úkoly', subtitle: 'Co dnes splníš?', addButton: 'Přidat úkol', placeholder: 'Zadej úkol', maxReached: 'Maximum 5 úkolů', resetsDaily: 'Resetuje se denně' },
    focus: { title: 'Focus Timer', subtitle: 'Zvol dobu soustředění', start: 'Start', pause: 'Pauza', resume: 'Pokračovat', reset: 'Reset', complete: 'Čas vypršel!', minutes: 'min' },
    decision: { title: 'Rozhodovací nástroj', subtitle: 'Descartův čtverec pro jasnost', titlePlaceholder: 'Jaké rozhodnutí děláš?', doHappens: 'Co se stane, když to udělám?', dontHappens: 'Co se stane, když to neudělám?', doLose: 'Co ztratím, když to udělám?', dontLose: 'Co ztratím, když to neudělám?', cardPlaceholder: 'Napiš své myšlenky...', analysisTitle: 'Verdikt', analysisFillAll: 'Vyplň všechny čtyři kvadranty pro zobrazení analýzy.', verdictDo: 'Udělej to', verdictDont: 'Nedělej to', verdictUnclear: 'Pečlivě zvaž', reasonsFor: 'Důvody pro', reasonsAgainst: 'Důvody proti', clear: 'Vymazat vše' },
    player: { title: 'Přehrávač médií', uploadAudio: 'Nahrát audio', uploadVideo: 'Nahrát video', addUrl: 'Přidat URL', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · Přímá URL', empty: 'Žádné soubory. Nahrajte médium nebo přidejte URL.', nowPlaying: 'Právě hraje', playlist: 'Playlist', urlPlaceholder: 'Vlož přímou URL média (mp3, mp4...)', youtubePlaceholder: 'Vlož YouTube URL nebo ID videa', invalidUrl: 'Neplatná URL nebo YouTube odkaz', add: 'Přidat', loading: 'Načítání...' },
    reader: { title: 'Čtečka knih', upload: 'Nahrát knihu', supported: 'EPUB, PDF, TXT, FB2', empty: 'Zatím žádné knihy. Nahrajte soubor.', page: 'Strana', of: 'z', backToLibrary: 'Knihovna', fontSize: 'Velikost písma', previewText: 'Obsah knihy se zobrazí zde.' },
    settings: { title: 'Nastavení', languageLabel: 'Jazyk', themeLabel: 'Motiv', dark: 'Tmavý', light: 'Světlý' },
    footer: 'Jeden nástroj. $1. Pro jasnost.',
    language: 'Jazyk',
  }),

  sk: createTranslation({
    welcome: { title: 'Vyčisti myseľ.', subtitle: 'Na 3 kliknutia.', button: 'Začať' },
    tabs: { focus: 'Sústredenie', tasks: 'Úlohy', habits: 'Návyky', decide: 'Rozhodnutie', player: 'Prehrávač', reader: 'Čítačka', settings: 'Nastavenia' },
    habits: { title: 'Denné návyky', subtitle: 'Buduj konzistenciu, deň po dni', addButton: 'Pridať návyk', placeholder: 'Zadaj názov návyku', maxReached: 'Maximum 6 návykov', streak: 'séria', days: 'dní' },
    tasks: { title: 'Dnešné úlohy', subtitle: 'Čo dnes splníš?', addButton: 'Pridať úlohu', placeholder: 'Zadaj úlohu', maxReached: 'Maximum 5 úloh', resetsDaily: 'Resetuje sa denne' },
    focus: { title: 'Focus Timer', subtitle: 'Zvoľ dobu sústredenia', start: 'Štart', pause: 'Pauza', resume: 'Pokračovať', reset: 'Reset', complete: 'Čas vypršal!', minutes: 'min' },
    decision: { title: 'Rozhodovací nástroj', subtitle: 'Descartov štvorec pre jasnosť', titlePlaceholder: 'Aké rozhodnutie robíš?', doHappens: 'Čo sa stane, keď to urobím?', dontHappens: 'Čo sa stane, keď to neurobím?', doLose: 'Čo stratím, keď to urobím?', dontLose: 'Čo stratím, keď to neurobím?', cardPlaceholder: 'Napíš svoje myšlienky...', analysisTitle: 'Verdikt', analysisFillAll: 'Vyplň všetky štyri kvadranty pre zobrazenie analýzy.', verdictDo: 'Urob to', verdictDont: 'Nerob to', verdictUnclear: 'Starostlivo zváž', reasonsFor: 'Dôvody za', reasonsAgainst: 'Dôvody proti', clear: 'Vymazať všetko' },
    player: { title: 'Prehrávač médií', uploadAudio: 'Nahrať audio', uploadVideo: 'Nahrať video', addUrl: 'Pridať URL', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · Priama URL', empty: 'Žiadne súbory. Nahrajte médium alebo pridajte URL.', nowPlaying: 'Práve hrá', playlist: 'Playlist', urlPlaceholder: 'Vlož priamu URL média (mp3, mp4...)', youtubePlaceholder: 'Vlož YouTube URL alebo ID videa', invalidUrl: 'Neplatná URL alebo YouTube odkaz', add: 'Pridať', loading: 'Načítanie...' },
    reader: { title: 'Čítačka kníh', upload: 'Nahrať knihu', supported: 'EPUB, PDF, TXT, FB2', empty: 'Zatiaľ žiadne knihy. Nahrajte súbor.', page: 'Strana', of: 'z', backToLibrary: 'Knižnica', fontSize: 'Veľkosť písma', previewText: 'Obsah knihy sa zobrazí tu.' },
    settings: { title: 'Nastavenia', languageLabel: 'Jazyk', themeLabel: 'Téma', dark: 'Tmavá', light: 'Svetlá' },
    footer: 'Jeden nástroj. $1. Pre jasnosť.',
    language: 'Jazyk',
  }),

  ro: createTranslation({
    welcome: { title: 'Clarifică-ți mintea.', subtitle: 'În 3 atingeri.', button: 'Start' },
    tabs: { focus: 'Focus', tasks: 'Sarcini', habits: 'Obiceiuri', decide: 'Decide', player: 'Player', reader: 'Cititor', settings: 'Setări' },
    habits: { title: 'Obiceiuri zilnice', subtitle: 'Construiește consistență, zi de zi', addButton: 'Adaugă obicei', placeholder: 'Introdu numele obiceiului', maxReached: 'Maximum 6 obiceiuri', streak: 'serie', days: 'zile' },
    tasks: { title: 'Sarcinile de azi', subtitle: 'Ce vei realiza azi?', addButton: 'Adaugă sarcină', placeholder: 'Introdu sarcina', maxReached: 'Maximum 5 sarcini', resetsDaily: 'Se resetează zilnic' },
    focus: { title: 'Cronometru Focus', subtitle: 'Alege timpul de concentrare', start: 'Start', pause: 'Pauză', resume: 'Continuă', reset: 'Resetare', complete: 'Timpul a expirat!', minutes: 'min' },
    decision: { title: 'Instrument de Decizie', subtitle: 'Pătratul Descartes pentru claritate', titlePlaceholder: 'Ce decizie iei?', doHappens: 'Ce se întâmplă dacă fac asta?', dontHappens: 'Ce se întâmplă dacă nu fac?', doLose: 'Ce pierd dacă fac asta?', dontLose: 'Ce pierd dacă nu fac?', cardPlaceholder: 'Scrie gândurile tale...', analysisTitle: 'Verdictul', analysisFillAll: 'Completează toate cele patru cadrane pentru a vedea analiza.', verdictDo: 'Fă-o', verdictDont: 'Nu o face', verdictUnclear: 'Cântărește cu grijă', reasonsFor: 'Motive pentru', reasonsAgainst: 'Motive împotrivă', clear: 'Șterge tot' },
    player: { title: 'Player Media', uploadAudio: 'Încarcă audio', uploadVideo: 'Încarcă video', addUrl: 'Adaugă URL', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL direct', empty: 'Niciun fișier. Încarcă media sau adaugă un URL.', nowPlaying: 'Redare curentă', playlist: 'Playlist', urlPlaceholder: 'Lipește URL direct media (mp3, mp4...)', youtubePlaceholder: 'Lipește URL YouTube sau ID video', invalidUrl: 'URL sau link YouTube invalid', add: 'Adaugă', loading: 'Se încarcă...' },
    reader: { title: 'Cititor de cărți', upload: 'Încarcă carte', supported: 'EPUB, PDF, TXT, FB2', empty: 'Nicio carte încă. Încarcă un fișier.', page: 'Pagina', of: 'din', backToLibrary: 'Bibliotecă', fontSize: 'Mărimea fontului', previewText: 'Conținutul cărții va apărea aici.' },
    settings: { title: 'Setări', languageLabel: 'Limbă', themeLabel: 'Temă', dark: 'Întunecată', light: 'Luminoasă' },
    footer: 'Un instrument. $1. Pentru claritate.',
    language: 'Limbă',
  }),

  hu: createTranslation({
    welcome: { title: 'Tisztítsd meg az elméd.', subtitle: '3 érintéssel.', button: 'Indítás' },
    tabs: { focus: 'Fókusz', tasks: 'Feladatok', habits: 'Szokások', decide: 'Döntés', player: 'Lejátszó', reader: 'Olvasó', settings: 'Beállítások' },
    habits: { title: 'Napi szokások', subtitle: 'Építs következetességet, napról napra', addButton: 'Szokás hozzáadása', placeholder: 'Írd be a szokás nevét', maxReached: 'Maximum 6 szokás', streak: 'sorozat', days: 'nap' },
    tasks: { title: 'Mai feladatok', subtitle: 'Mit érsz el ma?', addButton: 'Feladat hozzáadása', placeholder: 'Írd be a feladatot', maxReached: 'Maximum 5 feladat', resetsDaily: 'Naponta visszaáll' },
    focus: { title: 'Fókusz Időzítő', subtitle: 'Válaszd ki a fókuszidőt', start: 'Indítás', pause: 'Szünet', resume: 'Folytatás', reset: 'Visszaállítás', complete: 'Lejárt az idő!', minutes: 'perc' },
    decision: { title: 'Döntési eszköz', subtitle: 'Descartes négyzet a tisztánlátásért', titlePlaceholder: 'Milyen döntést hozol?', doHappens: 'Mi történik, ha megteszem?', dontHappens: 'Mi történik, ha nem teszem meg?', doLose: 'Mit veszítek, ha megteszem?', dontLose: 'Mit veszítek, ha nem teszem meg?', cardPlaceholder: 'Írd le a gondolataidat...', analysisTitle: 'Ítélet', analysisFillAll: 'Töltsd ki mind a négy negyedet az elemzés megjelenítéséhez.', verdictDo: 'Tedd meg', verdictDont: 'Ne tedd meg', verdictUnclear: 'Mérlegeld gondosan', reasonsFor: 'Érvek mellette', reasonsAgainst: 'Érvek ellene', clear: 'Összes törlése' },
    player: { title: 'Médialejátszó', uploadAudio: 'Audió feltöltése', uploadVideo: 'Videó feltöltése', addUrl: 'URL hozzáadása', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · Közvetlen URL', empty: 'Nincsenek fájlok. Tölts fel médiát vagy adj hozzá URL-t.', nowPlaying: 'Most játszik', playlist: 'Lejátszási lista', urlPlaceholder: 'Illeszd be a közvetlen média URL-t (mp3, mp4...)', youtubePlaceholder: 'Illeszd be a YouTube URL-t vagy videó ID-t', invalidUrl: 'Érvénytelen URL vagy YouTube link', add: 'Hozzáadás', loading: 'Betöltés...' },
    reader: { title: 'Könyvolvasó', upload: 'Könyv feltöltése', supported: 'EPUB, PDF, TXT, FB2', empty: 'Még nincsenek könyvek. Tölts fel egy fájlt.', page: 'Oldal', of: '/', backToLibrary: 'Könyvtár', fontSize: 'Betűméret', previewText: 'A könyv tartalma itt jelenik meg.' },
    settings: { title: 'Beállítások', languageLabel: 'Nyelv', themeLabel: 'Téma', dark: 'Sötét', light: 'Világos' },
    footer: 'Egy eszköz. $1. A tisztánlátásért.',
    language: 'Nyelv',
  }),

  tr: createTranslation({
    welcome: { title: 'Zihnini temizle.', subtitle: '3 dokunuşta.', button: 'Başla' },
    tabs: { focus: 'Odak', tasks: 'Görevler', habits: 'Alışkanlıklar', decide: 'Karar', player: 'Oynatıcı', reader: 'Okuyucu', settings: 'Ayarlar' },
    habits: { title: 'Günlük Alışkanlıklar', subtitle: 'Tutarlılık oluştur, her gün', addButton: 'Alışkanlık ekle', placeholder: 'Alışkanlık adı gir', maxReached: 'Maksimum 6 alışkanlık', streak: 'seri', days: 'gün' },
    tasks: { title: 'Bugünün Görevleri', subtitle: 'Bugün ne başaracaksın?', addButton: 'Görev ekle', placeholder: 'Görev gir', maxReached: 'Maksimum 5 görev', resetsDaily: 'Günlük sıfırlanır' },
    focus: { title: 'Odak Zamanlayıcı', subtitle: 'Odak süresini seç', start: 'Başla', pause: 'Duraklat', resume: 'Devam et', reset: 'Sıfırla', complete: 'Süre doldu!', minutes: 'dk' },
    decision: { title: 'Karar Aracı', subtitle: 'Netlik için Descartes Karesi', titlePlaceholder: 'Hangi kararı veriyorsun?', doHappens: 'Bunu yaparsam ne olur?', dontHappens: 'Bunu yapmazsam ne olur?', doLose: 'Bunu yaparsam ne kaybederim?', dontLose: 'Bunu yapmazsam ne kaybederim?', cardPlaceholder: 'Düşüncelerini yaz...', analysisTitle: 'Karar', analysisFillAll: 'Analizi görmek için dört kadranı da doldur.', verdictDo: 'Yap', verdictDont: 'Yapma', verdictUnclear: 'Dikkatle tart', reasonsFor: 'Lehine nedenler', reasonsAgainst: 'Aleyhine nedenler', clear: 'Tümünü temizle' },
    player: { title: 'Medya Oynatıcı', uploadAudio: 'Ses yükle', uploadVideo: 'Video yükle', addUrl: 'URL ekle', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · Doğrudan URL', empty: 'Dosya yok. Medya yükle veya URL ekle.', nowPlaying: 'Şimdi çalıyor', playlist: 'Çalma listesi', urlPlaceholder: 'Doğrudan medya URL yapıştır (mp3, mp4...)', youtubePlaceholder: 'YouTube URL veya video ID yapıştır', invalidUrl: 'Geçersiz URL veya YouTube bağlantısı', add: 'Ekle', loading: 'Yükleniyor...' },
    reader: { title: 'Kitap Okuyucu', upload: 'Kitap yükle', supported: 'EPUB, PDF, TXT, FB2', empty: 'Henüz kitap yok. Başlamak için dosya yükle.', page: 'Sayfa', of: '/', backToLibrary: 'Kütüphane', fontSize: 'Yazı boyutu', previewText: 'Kitap içeriği burada görünecek.' },
    settings: { title: 'Ayarlar', languageLabel: 'Dil', themeLabel: 'Tema', dark: 'Koyu', light: 'Açık' },
    footer: 'Bir araç. $1. Netlik için.',
    language: 'Dil',
  }),

  ar: createTranslation({
    welcome: { title: 'صفِّ ذهنك.', subtitle: 'في 3 نقرات.', button: 'ابدأ' },
    tabs: { focus: 'تركيز', tasks: 'مهام', habits: 'عادات', decide: 'قرار', player: 'مشغل', reader: 'قارئ', settings: 'الإعدادات' },
    habits: { title: 'العادات اليومية', subtitle: 'ابنِ الاتساق، يوماً بيوم', addButton: 'إضافة عادة', placeholder: 'أدخل اسم العادة', maxReached: 'الحد الأقصى 6 عادات', streak: 'سلسلة', days: 'أيام' },
    tasks: { title: 'مهام اليوم', subtitle: 'ماذا ستنجز اليوم؟', addButton: 'إضافة مهمة', placeholder: 'أدخل المهمة', maxReached: 'الحد الأقصى 5 مهام', resetsDaily: 'يُعاد تعيينه يومياً' },
    focus: { title: 'مؤقت التركيز', subtitle: 'اختر وقت التركيز', start: 'ابدأ', pause: 'إيقاف مؤقت', resume: 'استئناف', reset: 'إعادة تعيين', complete: 'انتهى الوقت!', minutes: 'د' },
    decision: { title: 'أداة القرار', subtitle: 'مربع ديكارت للوضوح', titlePlaceholder: 'ما القرار الذي تتخذه؟', doHappens: 'ماذا يحدث إذا فعلت هذا؟', dontHappens: 'ماذا يحدث إذا لم أفعل؟', doLose: 'ماذا أخسر إذا فعلت هذا؟', dontLose: 'ماذا أخسر إذا لم أفعل؟', cardPlaceholder: 'اكتب أفكارك...', analysisTitle: 'الحكم', analysisFillAll: 'املأ جميع الأرباع الأربعة لرؤية التحليل.', verdictDo: 'افعلها', verdictDont: 'لا تفعلها', verdictUnclear: 'وازن بعناية', reasonsFor: 'أسباب مع', reasonsAgainst: 'أسباب ضد', clear: 'مسح الكل' },
    player: { title: 'مشغل الوسائط', uploadAudio: 'رفع صوت', uploadVideo: 'رفع فيديو', addUrl: 'إضافة رابط', addYoutube: 'يوتيوب', supported: 'MP3, WAV, OGG, MP4, WEBM · يوتيوب · رابط مباشر', empty: 'لا ملفات. ارفع وسائط أو أضف رابطاً.', nowPlaying: 'يعمل الآن', playlist: 'قائمة التشغيل', urlPlaceholder: 'الصق رابط وسائط مباشر (mp3, mp4...)', youtubePlaceholder: 'الصق رابط يوتيوب أو معرف الفيديو', invalidUrl: 'رابط أو رابط يوتيوب غير صالح', add: 'إضافة', loading: 'جارٍ التحميل...' },
    reader: { title: 'قارئ الكتب', upload: 'رفع كتاب', supported: 'EPUB, PDF, TXT, FB2', empty: 'لا كتب بعد. ارفع ملفاً للبدء.', page: 'صفحة', of: 'من', backToLibrary: 'المكتبة', fontSize: 'حجم الخط', previewText: 'سيظهر محتوى الكتاب هنا.' },
    settings: { title: 'الإعدادات', languageLabel: 'اللغة', themeLabel: 'السمة', dark: 'داكن', light: 'فاتح' },
    footer: 'أداة واحدة. $1. للوضوح.',
    language: 'اللغة',
  }),

  ja: createTranslation({
    welcome: { title: '心をクリアに。', subtitle: '3タップで。', button: 'スタート' },
    tabs: { focus: '集中', tasks: 'タスク', habits: '習慣', decide: '決定', player: 'プレーヤー', reader: 'リーダー', settings: '設定' },
    habits: { title: '毎日の習慣', subtitle: '一日一日、一貫性を築く', addButton: '習慣を追加', placeholder: '習慣名を入力', maxReached: '最大6つの習慣', streak: '連続', days: '日' },
    tasks: { title: '今日のタスク', subtitle: '今日何を達成しますか？', addButton: 'タスクを追加', placeholder: 'タスクを入力', maxReached: '最大5つのタスク', resetsDaily: '毎日リセット' },
    focus: { title: 'フォーカスタイマー', subtitle: '集中時間を選択', start: 'スタート', pause: '一時停止', resume: '再開', reset: 'リセット', complete: '時間です！', minutes: '分' },
    decision: { title: '意思決定ツール', subtitle: '明確さのためのデカルトの四角形', titlePlaceholder: 'どんな決断をしていますか？', doHappens: 'これをしたらどうなる？', dontHappens: 'しなかったらどうなる？', doLose: 'これをしたら何を失う？', dontLose: 'しなかったら何を失う？', cardPlaceholder: '考えを書いてください...', analysisTitle: '判定', analysisFillAll: '分析を見るには4つの象限すべてを記入してください。', verdictDo: 'やりましょう', verdictDont: 'やめましょう', verdictUnclear: '慎重に検討', reasonsFor: '賛成の理由', reasonsAgainst: '反対の理由', clear: 'すべてクリア' },
    player: { title: 'メディアプレーヤー', uploadAudio: 'オーディオをアップロード', uploadVideo: 'ビデオをアップロード', addUrl: 'URLを追加', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · 直接URL', empty: 'ファイルなし。メディアをアップロードまたはURLを追加。', nowPlaying: '再生中', playlist: 'プレイリスト', urlPlaceholder: '直接メディアURLを貼り付け（mp3, mp4...）', youtubePlaceholder: 'YouTube URLまたはビデオIDを貼り付け', invalidUrl: '無効なURLまたはYouTubeリンク', add: '追加', loading: '読み込み中...' },
    reader: { title: 'ブックリーダー', upload: '本をアップロード', supported: 'EPUB, PDF, TXT, FB2', empty: 'まだ本がありません。ファイルをアップロードしてください。', page: 'ページ', of: '/', backToLibrary: 'ライブラリ', fontSize: 'フォントサイズ', previewText: '本の内容がここに表示されます。' },
    settings: { title: '設定', languageLabel: '言語', themeLabel: 'テーマ', dark: 'ダーク', light: 'ライト' },
    footer: 'ひとつのツール。$1。明確さのために。',
    language: '言語',
  }),

  ko: createTranslation({
    welcome: { title: '마음을 정리하세요.', subtitle: '3번의 탭으로.', button: '시작' },
    tabs: { focus: '집중', tasks: '할일', habits: '습관', decide: '결정', player: '플레이어', reader: '리더', settings: '설정' },
    habits: { title: '일일 습관', subtitle: '하루하루 꾸준히', addButton: '습관 추가', placeholder: '습관 이름 입력', maxReached: '최대 6개 습관', streak: '연속', days: '일' },
    tasks: { title: '오늘의 할일', subtitle: '오늘 무엇을 달성할 건가요?', addButton: '할일 추가', placeholder: '할일 입력', maxReached: '최대 5개 할일', resetsDaily: '매일 초기화' },
    focus: { title: '집중 타이머', subtitle: '집중 시간을 선택하세요', start: '시작', pause: '일시정지', resume: '재개', reset: '초기화', complete: '시간 종료!', minutes: '분' },
    decision: { title: '의사결정 도구', subtitle: '명확성을 위한 데카르트 사각형', titlePlaceholder: '어떤 결정을 내리고 있나요?', doHappens: '이것을 하면 무슨 일이 일어나나요?', dontHappens: '하지 않으면 무슨 일이 일어나나요?', doLose: '이것을 하면 무엇을 잃나요?', dontLose: '하지 않으면 무엇을 잃나요?', cardPlaceholder: '생각을 적어보세요...', analysisTitle: '판정', analysisFillAll: '분석을 보려면 네 사분면을 모두 채우세요.', verdictDo: '하세요', verdictDont: '하지 마세요', verdictUnclear: '신중히 따져보세요', reasonsFor: '찬성 이유', reasonsAgainst: '반대 이유', clear: '전체 삭제' },
    player: { title: '미디어 플레이어', uploadAudio: '오디오 업로드', uploadVideo: '비디오 업로드', addUrl: 'URL 추가', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · 직접 URL', empty: '파일 없음. 미디어를 업로드하거나 URL을 추가하세요.', nowPlaying: '재생 중', playlist: '재생목록', urlPlaceholder: '직접 미디어 URL 붙여넣기 (mp3, mp4...)', youtubePlaceholder: 'YouTube URL 또는 비디오 ID 붙여넣기', invalidUrl: '잘못된 URL 또는 YouTube 링크', add: '추가', loading: '로딩 중...' },
    reader: { title: '북 리더', upload: '책 업로드', supported: 'EPUB, PDF, TXT, FB2', empty: '아직 책이 없습니다. 파일을 업로드하세요.', page: '페이지', of: '/', backToLibrary: '라이브러리', fontSize: '글꼴 크기', previewText: '책 내용이 여기에 표시됩니다.' },
    settings: { title: '설정', languageLabel: '언어', themeLabel: '테마', dark: '다크', light: '라이트' },
    footer: '하나의 도구. $1. 명확함을 위해.',
    language: '언어',
  }),

  hi: createTranslation({
    welcome: { title: 'मन साफ करें।', subtitle: '3 टैप में।', button: 'शुरू करें' },
    tabs: { focus: 'फोकस', tasks: 'कार्य', habits: 'आदतें', decide: 'निर्णय', player: 'प्लेयर', reader: 'रीडर', settings: 'सेटिंग्स' },
    habits: { title: 'दैनिक आदतें', subtitle: 'हर दिन निरंतरता बनाएं', addButton: 'आदत जोड़ें', placeholder: 'आदत का नाम दर्ज करें', maxReached: 'अधिकतम 6 आदतें', streak: 'श्रृंखला', days: 'दिन' },
    tasks: { title: 'आज के कार्य', subtitle: 'आज आप क्या हासिल करेंगे?', addButton: 'कार्य जोड़ें', placeholder: 'कार्य दर्ज करें', maxReached: 'अधिकतम 5 कार्य', resetsDaily: 'दैनिक रीसेट' },
    focus: { title: 'फोकस टाइमर', subtitle: 'अपना फोकस समय चुनें', start: 'शुरू', pause: 'रोकें', resume: 'जारी रखें', reset: 'रीसेट', complete: 'समय हो गया!', minutes: 'मिनट' },
    decision: { title: 'निर्णय उपकरण', subtitle: 'स्पष्टता के लिए डेकार्ट वर्ग', titlePlaceholder: 'आप कौन सा निर्णय ले रहे हैं?', doHappens: 'अगर मैं ऐसा करूं तो क्या होगा?', dontHappens: 'अगर मैं न करूं तो क्या होगा?', doLose: 'अगर मैं करूं तो क्या खोऊंगा?', dontLose: 'अगर न करूं तो क्या खोऊंगा?', cardPlaceholder: 'अपने विचार लिखें...', analysisTitle: 'निर्णय', analysisFillAll: 'विश्लेषण देखने के लिए चारों खंड भरें।', verdictDo: 'करें', verdictDont: 'न करें', verdictUnclear: 'सावधानी से तौलें', reasonsFor: 'पक्ष के कारण', reasonsAgainst: 'विपक्ष के कारण', clear: 'सब मिटाएं' },
    player: { title: 'मीडिया प्लेयर', uploadAudio: 'ऑडियो अपलोड', uploadVideo: 'वीडियो अपलोड', addUrl: 'URL जोड़ें', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · सीधा URL', empty: 'कोई फाइल नहीं। मीडिया अपलोड करें या URL जोड़ें।', nowPlaying: 'अभी चल रहा', playlist: 'प्लेलिस्ट', urlPlaceholder: 'सीधा मीडिया URL चिपकाएं (mp3, mp4...)', youtubePlaceholder: 'YouTube URL या वीडियो ID चिपकाएं', invalidUrl: 'अमान्य URL या YouTube लिंक', add: 'जोड़ें', loading: 'लोड हो रहा...' },
    reader: { title: 'पुस्तक पाठक', upload: 'पुस्तक अपलोड', supported: 'EPUB, PDF, TXT, FB2', empty: 'अभी कोई पुस्तक नहीं। फाइल अपलोड करें।', page: 'पृष्ठ', of: 'का', backToLibrary: 'पुस्तकालय', fontSize: 'फ़ॉन्ट आकार', previewText: 'पुस्तक की सामग्री यहां दिखाई देगी।' },
    settings: { title: 'सेटिंग्स', languageLabel: 'भाषा', themeLabel: 'थीम', dark: 'डार्क', light: 'लाइट' },
    footer: 'एक उपकरण। $1। स्पष्टता के लिए।',
    language: 'भाषा',
  }),

  bn: createTranslation({
    welcome: { title: 'মন পরিষ্কার করুন।', subtitle: '৩ ট্যাপে।', button: 'শুরু করুন' },
    tabs: { focus: 'ফোকাস', tasks: 'কাজ', habits: 'অভ্যাস', decide: 'সিদ্ধান্ত', player: 'প্লেয়ার', reader: 'রিডার', settings: 'সেটিংস' },
    habits: { title: 'দৈনিক অভ্যাস', subtitle: 'প্রতিদিন ধারাবাহিকতা তৈরি করুন', addButton: 'অভ্যাস যোগ করুন', placeholder: 'অভ্যাসের নাম লিখুন', maxReached: 'সর্বোচ্চ ৬টি অভ্যাস', streak: 'ধারা', days: 'দিন' },
    tasks: { title: 'আজকের কাজ', subtitle: 'আজ আপনি কী অর্জন করবেন?', addButton: 'কাজ যোগ করুন', placeholder: 'কাজ লিখুন', maxReached: 'সর্বোচ্চ ৫টি কাজ', resetsDaily: 'প্রতিদিন রিসেট হয়' },
    focus: { title: 'ফোকাস টাইমার', subtitle: 'আপনার ফোকাস সময় বেছে নিন', start: 'শুরু', pause: 'বিরতি', resume: 'চালিয়ে যান', reset: 'রিসেট', complete: 'সময় শেষ!', minutes: 'মিনিট' },
    decision: { title: 'সিদ্ধান্ত সরঞ্জাম', subtitle: 'স্পষ্টতার জন্য ডেকার্ট বর্গ', titlePlaceholder: 'আপনি কোন সিদ্ধান্ত নিচ্ছেন?', doHappens: 'এটি করলে কী হবে?', dontHappens: 'না করলে কী হবে?', doLose: 'করলে কী হারাবো?', dontLose: 'না করলে কী হারাবো?', cardPlaceholder: 'আপনার চিন্তা লিখুন...', analysisTitle: 'রায়', analysisFillAll: 'বিশ্লেষণ দেখতে চারটি অংশ পূরণ করুন।', verdictDo: 'করুন', verdictDont: 'করবেন না', verdictUnclear: 'সাবধানে বিবেচনা করুন', reasonsFor: 'পক্ষে কারণ', reasonsAgainst: 'বিপক্ষে কারণ', clear: 'সব মুছুন' },
    player: { title: 'মিডিয়া প্লেয়ার', uploadAudio: 'অডিও আপলোড', uploadVideo: 'ভিডিও আপলোড', addUrl: 'URL যোগ করুন', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · সরাসরি URL', empty: 'কোনো ফাইল নেই। মিডিয়া আপলোড করুন বা URL যোগ করুন।', nowPlaying: 'এখন চলছে', playlist: 'প্লেলিস্ট', urlPlaceholder: 'সরাসরি মিডিয়া URL পেস্ট করুন (mp3, mp4...)', youtubePlaceholder: 'YouTube URL বা ভিডিও ID পেস্ট করুন', invalidUrl: 'অবৈধ URL বা YouTube লিংক', add: 'যোগ করুন', loading: 'লোড হচ্ছে...' },
    reader: { title: 'বই পাঠক', upload: 'বই আপলোড', supported: 'EPUB, PDF, TXT, FB2', empty: 'এখনো কোনো বই নেই। ফাইল আপলোড করুন।', page: 'পৃষ্ঠা', of: 'এর', backToLibrary: 'লাইব্রেরি', fontSize: 'ফন্ট সাইজ', previewText: 'বইয়ের বিষয়বস্তু এখানে দেখাবে।' },
    settings: { title: 'সেটিংস', languageLabel: 'ভাষা', themeLabel: 'থিম', dark: 'ডার্ক', light: 'লাইট' },
    footer: 'একটি টুল। $1। স্পষ্টতার জন্য।',
    language: 'ভাষা',
  }),

  vi: createTranslation({
    welcome: { title: 'Làm sáng tâm trí.', subtitle: 'Trong 3 chạm.', button: 'Bắt đầu' },
    tabs: { focus: 'Tập trung', tasks: 'Việc cần làm', habits: 'Thói quen', decide: 'Quyết định', player: 'Trình phát', reader: 'Đọc sách', settings: 'Cài đặt' },
    habits: { title: 'Thói quen hàng ngày', subtitle: 'Xây dựng sự nhất quán, từng ngày', addButton: 'Thêm thói quen', placeholder: 'Nhập tên thói quen', maxReached: 'Tối đa 6 thói quen', streak: 'chuỗi', days: 'ngày' },
    tasks: { title: 'Việc hôm nay', subtitle: 'Hôm nay bạn sẽ hoàn thành gì?', addButton: 'Thêm việc', placeholder: 'Nhập việc cần làm', maxReached: 'Tối đa 5 việc', resetsDaily: 'Đặt lại hàng ngày' },
    focus: { title: 'Hẹn giờ tập trung', subtitle: 'Chọn thời gian tập trung', start: 'Bắt đầu', pause: 'Tạm dừng', resume: 'Tiếp tục', reset: 'Đặt lại', complete: 'Hết giờ!', minutes: 'phút' },
    decision: { title: 'Công cụ quyết định', subtitle: 'Hình vuông Descartes để rõ ràng', titlePlaceholder: 'Bạn đang quyết định gì?', doHappens: 'Điều gì xảy ra nếu tôi làm?', dontHappens: 'Điều gì xảy ra nếu tôi không làm?', doLose: 'Tôi mất gì nếu làm?', dontLose: 'Tôi mất gì nếu không làm?', cardPlaceholder: 'Viết suy nghĩ của bạn...', analysisTitle: 'Phán quyết', analysisFillAll: 'Điền cả bốn phần tư để xem phân tích.', verdictDo: 'Hãy làm', verdictDont: 'Đừng làm', verdictUnclear: 'Cân nhắc kỹ', reasonsFor: 'Lý do ủng hộ', reasonsAgainst: 'Lý do phản đối', clear: 'Xóa tất cả' },
    player: { title: 'Trình phát media', uploadAudio: 'Tải âm thanh', uploadVideo: 'Tải video', addUrl: 'Thêm URL', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL trực tiếp', empty: 'Không có tệp. Tải media hoặc thêm URL.', nowPlaying: 'Đang phát', playlist: 'Danh sách', urlPlaceholder: 'Dán URL media trực tiếp (mp3, mp4...)', youtubePlaceholder: 'Dán URL YouTube hoặc ID video', invalidUrl: 'URL hoặc link YouTube không hợp lệ', add: 'Thêm', loading: 'Đang tải...' },
    reader: { title: 'Đọc sách', upload: 'Tải sách', supported: 'EPUB, PDF, TXT, FB2', empty: 'Chưa có sách. Tải tệp lên để bắt đầu.', page: 'Trang', of: '/', backToLibrary: 'Thư viện', fontSize: 'Cỡ chữ', previewText: 'Nội dung sách sẽ hiển thị ở đây.' },
    settings: { title: 'Cài đặt', languageLabel: 'Ngôn ngữ', themeLabel: 'Giao diện', dark: 'Tối', light: 'Sáng' },
    footer: 'Một công cụ. $1. Cho sự rõ ràng.',
    language: 'Ngôn ngữ',
  }),

  id: createTranslation({
    welcome: { title: 'Jernihkan pikiran.', subtitle: 'Dalam 3 ketukan.', button: 'Mulai' },
    tabs: { focus: 'Fokus', tasks: 'Tugas', habits: 'Kebiasaan', decide: 'Keputusan', player: 'Pemutar', reader: 'Pembaca', settings: 'Pengaturan' },
    habits: { title: 'Kebiasaan Harian', subtitle: 'Bangun konsistensi, hari demi hari', addButton: 'Tambah kebiasaan', placeholder: 'Masukkan nama kebiasaan', maxReached: 'Maksimal 6 kebiasaan', streak: 'berturut-turut', days: 'hari' },
    tasks: { title: 'Tugas Hari Ini', subtitle: 'Apa yang akan kamu capai hari ini?', addButton: 'Tambah tugas', placeholder: 'Masukkan tugas', maxReached: 'Maksimal 5 tugas', resetsDaily: 'Reset setiap hari' },
    focus: { title: 'Timer Fokus', subtitle: 'Pilih waktu fokus', start: 'Mulai', pause: 'Jeda', resume: 'Lanjutkan', reset: 'Reset', complete: 'Waktu habis!', minutes: 'mnt' },
    decision: { title: 'Alat Keputusan', subtitle: 'Kotak Descartes untuk kejelasan', titlePlaceholder: 'Keputusan apa yang kamu ambil?', doHappens: 'Apa yang terjadi jika saya melakukannya?', dontHappens: 'Apa yang terjadi jika tidak?', doLose: 'Apa yang hilang jika melakukannya?', dontLose: 'Apa yang hilang jika tidak?', cardPlaceholder: 'Tulis pikiranmu...', analysisTitle: 'Keputusan', analysisFillAll: 'Isi keempat kuadran untuk melihat analisis.', verdictDo: 'Lakukan', verdictDont: 'Jangan lakukan', verdictUnclear: 'Pertimbangkan baik-baik', reasonsFor: 'Alasan mendukung', reasonsAgainst: 'Alasan menentang', clear: 'Hapus semua' },
    player: { title: 'Pemutar Media', uploadAudio: 'Unggah audio', uploadVideo: 'Unggah video', addUrl: 'Tambah URL', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · URL langsung', empty: 'Tidak ada file. Unggah media atau tambah URL.', nowPlaying: 'Sedang diputar', playlist: 'Daftar putar', urlPlaceholder: 'Tempel URL media langsung (mp3, mp4...)', youtubePlaceholder: 'Tempel URL YouTube atau ID video', invalidUrl: 'URL atau link YouTube tidak valid', add: 'Tambah', loading: 'Memuat...' },
    reader: { title: 'Pembaca Buku', upload: 'Unggah buku', supported: 'EPUB, PDF, TXT, FB2', empty: 'Belum ada buku. Unggah file untuk mulai.', page: 'Halaman', of: 'dari', backToLibrary: 'Perpustakaan', fontSize: 'Ukuran huruf', previewText: 'Konten buku akan muncul di sini.' },
    settings: { title: 'Pengaturan', languageLabel: 'Bahasa', themeLabel: 'Tema', dark: 'Gelap', light: 'Terang' },
    footer: 'Satu alat. $1. Untuk kejelasan.',
    language: 'Bahasa',
  }),

  kk: createTranslation({
    welcome: { title: 'Ойыңды тазала.', subtitle: '3 рет басу.', button: 'Бастау' },
    tabs: { focus: 'Фокус', tasks: 'Тапсырмалар', habits: 'Әдеттер', decide: 'Шешім', player: 'Ойнатқыш', reader: 'Оқырман', settings: 'Баптаулар' },
    habits: { title: 'Күнделікті әдеттер', subtitle: 'Күн сайын тұрақтылық құр', addButton: 'Әдет қосу', placeholder: 'Әдет атауын енгіз', maxReached: 'Ең көбі 6 әдет', streak: 'серия', days: 'күн' },
    tasks: { title: 'Бүгінгі тапсырмалар', subtitle: 'Бүгін нені орындайсыз?', addButton: 'Тапсырма қосу', placeholder: 'Тапсырма енгіз', maxReached: 'Ең көбі 5 тапсырма', resetsDaily: 'Күн сайын қалпына келеді' },
    focus: { title: 'Фокус таймер', subtitle: 'Фокус уақытын таңда', start: 'Бастау', pause: 'Тоқтату', resume: 'Жалғастыру', reset: 'Қалпына келтіру', complete: 'Уақыт бітті!', minutes: 'мин' },
    decision: { title: 'Шешім құралы', subtitle: 'Анықтық үшін Декарт шаршысы', titlePlaceholder: 'Қандай шешім қабылдайсыз?', doHappens: 'Мұны жасасам не болады?', dontHappens: 'Жасамасам не болады?', doLose: 'Жасасам нені жоғалтамын?', dontLose: 'Жасамасам нені жоғалтамын?', cardPlaceholder: 'Ойларыңды жаз...', analysisTitle: 'Шешім', analysisFillAll: 'Талдауды көру үшін төрт бөлікті де толтырыңыз.', verdictDo: 'Жаса', verdictDont: 'Жасама', verdictUnclear: 'Мұқият тарт', reasonsFor: 'Жақтаушы себептер', reasonsAgainst: 'Қарсы себептер', clear: 'Бәрін тазалау' },
    player: { title: 'Медиа ойнатқыш', uploadAudio: 'Аудио жүктеу', uploadVideo: 'Бейне жүктеу', addUrl: 'URL қосу', addYoutube: 'YouTube', supported: 'MP3, WAV, OGG, MP4, WEBM · YouTube · Тікелей URL', empty: 'Файлдар жоқ. Медиа жүктеңіз немесе URL қосыңыз.', nowPlaying: 'Қазір ойнатылуда', playlist: 'Ойнату тізімі', urlPlaceholder: 'Тікелей медиа URL қойыңыз (mp3, mp4...)', youtubePlaceholder: 'YouTube URL немесе бейне ID қойыңыз', invalidUrl: 'Жарамсыз URL немесе YouTube сілтеме', add: 'Қосу', loading: 'Жүктелуде...' },
    reader: { title: 'Кітап оқырман', upload: 'Кітап жүктеу', supported: 'EPUB, PDF, TXT, FB2', empty: 'Әзірше кітаптар жоқ. Файл жүктеңіз.', page: 'Бет', of: '/', backToLibrary: 'Кітапхана', fontSize: 'Қаріп өлшемі', previewText: 'Кітап мазмұны осында пайда болады.' },
    settings: { title: 'Баптаулар', languageLabel: 'Тіл', themeLabel: 'Тақырып', dark: 'Қараңғы', light: 'Жарық' },
    footer: 'Бір құрал. $1. Анықтық үшін.',
    language: 'Тіл',
  }),
};
