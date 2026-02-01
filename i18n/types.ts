export interface TranslationSchema {
  common: {
    appName: string;
    appVersion: string;
    fullVersion: string;
    back: string;
    cancel: string;
    confirm: string;
    done: string;
    save: string;
    loading: string;
    errorTitle: string;
    storageLimitMsg: string;
    storageFullMsg: string;
    unexpectedError: string;
  };
  header: {
    settings: string;
  };
  nav: {
    library: string;
    add: string;
    history: string;
  };
  uploader: {
    analyzingTitle: string;
    analyzingDesc: string;
    cameraDenied: string;
    snapTitle: string;
    snapDesc: string;
    uploadBtn: string;
    legalInfo: string;
  };
  workout: {
    identified: string;
    exitBtn: string;
    intensityTitle: string;
    exerciseLabel: string;
    sets: string;
    reps: string;
    time: string;
    dist: string;
    rest: string;
    bodyweight: string;
    safetyTitle: string;
    legalDisclaimerBtn: string;
    legalModalTitle: string;
    legalBody: string[];
    legalUnderstand: string;
    startTraining: string;
    skip: string;
    recovery: string;
    complete: string;
    doneWithSet: string;
    langMismatch: string;
    shareBtn: string;
  };
  share: {
    title: string;
    preview: string;
    downloadBtn: string;
    nativeBtn: string;
    twitter: string;
    facebook: string;
    whatsapp: string;
    telegram: string;
    instagram: string;
    snapchat: string;
    copyLink: string;
    linkCopied: string;
    generatedBy: string;
  };
  library: {
    title: string;
    searchPlaceholder: string;
    noRoutinesTitle: string;
    noRoutinesDesc: string;
    removeTitle: string;
    favAdd: string;
    favRemove: string;
  };
  activity: {
    title: string;
    descPrefix: string;
    totalEffort: string;
    currentStreak: string;
    days: string;
    consistency: string;
    intensityKey: string;
    recentProgress: string;
    lastSessions: string;
    noActivity: string;
    months: string[];
    scores: {
      none: string;
      elite: string;
      pro: string;
      good: string;
      active: string;
    };
  };
  settings: {
    title: string;
    subtitle: string;
    prefTitle: string;
    prefDesc: string;
    unitSystem: string;
    metric: string;
    imperial: string;
    audioTitle: string;
    audioDesc: string;
    interfaceSounds: string;
    muted: string;
    enabled: string;
    aboutTitle: string;
    version: string;
    aiModel: string;
    footer: string;
    returnBtn: string;
    language: string;
  };
  modals: {
    completeTitle: string;
    completeDesc: string;
    saveBtn: string;
    savedBtn: string;
    viewBtn: string;
    duplicateTitle: string;
    duplicateDesc: string;
    saveNew: string;
    updateExisting: string;
  };
}