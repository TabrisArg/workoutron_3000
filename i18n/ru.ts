
import { TranslationSchema } from './types';

export const ru: TranslationSchema = {
  common: {
    appName: "Workoutron",
    appVersion: "3000",
    fullVersion: "3.1.0-PREVIEW",
    back: "Назад",
    cancel: "Отмена",
    confirm: "Подтвердить",
    done: "Готово",
    save: "Сохранить",
    loading: "Загрузка...",
    errorTitle: "Ошибка",
    storageLimitMsg: "Лимит памяти исчерпан: пожалуйста, удалите старые тренировки, чтобы сохранить новые.",
    storageFullMsg: "Память заполнена: невозможно сохранить. Сначала удалите программы из библиотеки.",
    unexpectedError: "Произошла непредвиденная ошибка при сохранении."
  },
  header: {
    settings: "Настройки"
  },
  nav: {
    library: "Библиотека",
    add: "Добавить",
    history: "История"
  },
  uploader: {
    analyzingTitle: "Анализ оборудования",
    analyzingDesc: "Определяем инвентарь и составляем ваш план тренировки...",
    cameraDenied: "Доступ к камере запрещен. Попробуйте загрузить фото.",
    snapTitle: "Сфотографируйте",
    snapDesc: "Сделайте фото любого снаряда, чтобы создать персональную программу.",
    uploadBtn: "Загрузить из галереи",
    legalInfo: "Отказ от ответственности ИИ"
  },
  workout: {
    identified: "Определено",
    exitBtn: "Выйти из тренировки",
    intensityTitle: "Режим интенсивности",
    exerciseLabel: "УПРАЖНЕНИЕ",
    sets: "ПОДХОДЫ",
    reps: "ПОВТОРЫ",
    time: "ВРЕМЯ",
    dist: "ДИСТ",
    rest: "ОТДЫХ",
    bodyweight: "Свой вес",
    safetyTitle: "Безопасность и контекст",
    legalDisclaimerBtn: "Юридическая информация",
    legalModalTitle: "Отказ от ответственности",
    legalBody: [
      "Программы тренировок, созданные Workoutron 3000, предоставляются ИИ только в ознакомительных целях.",
      "Предупреждение: Всегда консультируйтесь с профессиональным тренером или врачом перед началом новой программы."
    ],
    legalUnderstand: "Я понимаю",
    startTraining: "Начать тренировку",
    skip: "Пропустить",
    recovery: "Восстановление",
    complete: "Завершено",
    doneWithSet: "Подход выполнен",
    langMismatch: "Создано на другом языке",
    shareBtn: "Поделиться программой"
  },
  share: {
    title: "Поделиться тренировкой",
    preview: "Предпросмотр",
    downloadBtn: "Скачать изображение",
    nativeBtn: "Выбрать приложение",
    twitter: "Опубликовать в X",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    // Fix: Added missing social platforms for Russian
    telegram: "Telegram",
    instagram: "Instagram",
    snapchat: "Snapchat",
    copyLink: "Копировать ссылку",
    linkCopied: "Ссылка скопирована!",
    generatedBy: "Загрузите Workoutron в Google Play или Apple App Store"
  },
  library: {
    title: "Ваша библиотека",
    searchPlaceholder: "Поиск инвентаря...",
    noRoutinesTitle: "Нет сохраненных программ",
    noRoutinesDesc: "Сканируйте оборудование камерой, чтобы собрать личную библиотеку тренировок.",
    removeTitle: "Удалить программу",
    favAdd: "В избранное",
    favRemove: "Из избранного"
  },
  activity: {
    title: "Центр активности",
    descPrefix: "История тренировок за",
    totalEffort: "Всего сессий",
    currentStreak: "Ударный режим",
    days: "дн.",
    consistency: "Стабильность",
    intensityKey: "Уровни нагрузки",
    recentProgress: "Последние достижения",
    lastSessions: "Последние 10 сессий",
    noActivity: "Активность пока не записана. Начните со сканирования оборудования!",
    months: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    scores: {
      none: "Нет",
      elite: "Элита",
      pro: "Профи",
      good: "Хорошо",
      active: "Активен"
    }
  },
  settings: {
    title: "Опции",
    subtitle: "Персонализируйте свой опыт",
    prefTitle: "Предпочтения",
    prefDesc: "Выберите стандарты измерения.",
    unitSystem: "Система единиц",
    metric: "Метрическая",
    imperial: "Имперская",
    audioTitle: "Звук и отклик",
    audioDesc: "Управление звуками интерфейса.",
    interfaceSounds: "Звуки интерфейса",
    muted: "Выкл",
    enabled: "Вкл",
    aboutTitle: "О приложении",
    version: "Версия",
    aiModel: "Модель ИИ",
    footer: "Создано для атлетов",
    returnBtn: "Вернуться к тренировке",
    language: "Язык"
  },
  modals: {
    completeTitle: "Тренировка окончена!",
    completeDesc: "Отличная работа! Вы успешно выполнили все упражнения на сегодня.",
    saveBtn: "Сохранить в библиотеку",
    savedBtn: "Сохранено",
    viewBtn: "Посмотреть программу",
    duplicateTitle: "Дубликат найден",
    duplicateDesc: "\"{name}\" уже есть в вашей библиотеке.",
    saveNew: "Сохранить как копию",
    updateExisting: "Обновить существующую"
  }
};
