
import { TranslationSchema } from './types';

export const de: TranslationSchema = {
  common: {
    appName: "Workoutron",
    appVersion: "3000",
    fullVersion: "3.1.0-PREVIEW",
    back: "Zurück",
    cancel: "Abbrechen",
    confirm: "Bestätigen",
    done: "Fertig",
    save: "Speichern",
    loading: "Laden...",
    errorTitle: "Fehler",
    storageLimitMsg: "Speicherlimit erreicht: Bitte löschen Sie alte Workouts, um neue zu speichern.",
    storageFullMsg: "Speicher voll: Workout kann nicht gespeichert werden. Löschen Sie zuerst Routinen aus Ihrer Bibliothek.",
    unexpectedError: "Ein unerwarteter Fehler ist beim Speichern aufgetreten."
  },
  header: {
    settings: "Einstellungen"
  },
  nav: {
    library: "Bibliothek",
    add: "Hinzufügen",
    history: "Verlauf"
  },
  uploader: {
    analyzingTitle: "Analyse läuft",
    analyzingDesc: "Ausrüstung wird identifiziert und Ihr spezieller Trainingsplan erstellt...",
    cameraDenied: "Kamerazugriff verweigert. Versuchen Sie stattdessen ein Foto hochzuladen.",
    snapTitle: "Foto machen",
    snapDesc: "Machen Sie ein Foto von einem Trainingsgerät, um einen individuellen Plan zu erstellen.",
    uploadBtn: "Aus Galerie hochladen",
    legalInfo: "KI-Haftungsausschluss"
  },
  workout: {
    identified: "Identifiziert",
    exitBtn: "Training beenden",
    intensityTitle: "Intensitätsmodus",
    exerciseLabel: "ÜBUNG",
    sets: "SÄTZE",
    reps: "WHD",
    time: "ZEIT",
    dist: "DIST",
    rest: "PAUSE",
    bodyweight: "Körper",
    safetyTitle: "Sicherheit & Kontext",
    legalDisclaimerBtn: "Haftungsausschluss",
    legalModalTitle: "Rechtlicher Hinweis",
    legalBody: [
      "Die von Workoutron 3000 generierten Trainingsroutinen dienen nur zu Informations- und Motivationszwecken.",
      "Warnung: Konsultieren Sie immer einen qualifizierten Fitnesstrainer oder Arzt, bevor Sie ein neues Trainingsprogramm beginnen."
    ],
    legalUnderstand: "Ich verstehe",
    startTraining: "Training starten",
    skip: "Überspringen",
    recovery: "Erholung",
    complete: "Fertig",
    doneWithSet: "Satz beendet",
    langMismatch: "In einer anderen Sprache generiert",
    shareBtn: "Routine teilen"
  },
  share: {
    title: "Routine teilen",
    preview: "Vorschau",
    downloadBtn: "Bild herunterladen",
    nativeBtn: "App wählen",
    twitter: "Auf X posten",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    // Fix: Added missing social platforms for German
    telegram: "Telegram",
    instagram: "Instagram",
    snapchat: "Snapchat",
    copyLink: "Link kopieren",
    linkCopied: "Link kopiert!",
    generatedBy: "Laden Sie Workoutron im Google Play oder Apple App Store herunter"
  },
  library: {
    title: "Ihre Bibliothek",
    searchPlaceholder: "Ausrüstung suchen...",
    noRoutinesTitle: "Keine gespeicherten Routinen",
    noRoutinesDesc: "Scannen Sie Geräte, um Ihre persönliche Trainingsbibliothek aufzubauen.",
    removeTitle: "Routine entfernen",
    favAdd: "Zu Favoriten hinzufügen",
    favRemove: "Aus Favoriten entfernen"
  },
  activity: {
    title: "Aktivitäts-Hub",
    descPrefix: "Trainingsverlauf für",
    totalEffort: "Gesamtaufwand",
    currentStreak: "Aktuelle Strähne",
    days: "Tage",
    consistency: "Konsistenz",
    intensityKey: "Intensitätsschlüssel",
    recentProgress: "Aktuelle Fortschritte",
    lastSessions: "Letzte 10 Sitzungen",
    noActivity: "Noch keine Aktivitäten aufgezeichnet. Scannen Sie ein Gerät, um zu beginnen!",
    months: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
    scores: {
      none: "Keine",
      elite: "Elite",
      pro: "Pro",
      good: "Gut",
      active: "Aktiv"
    }
  },
  settings: {
    title: "Optionen",
    subtitle: "Personalisieren Sie Ihr Training",
    prefTitle: "Präferenzen",
    prefDesc: "Wählen Sie Ihre Maßeinheiten.",
    unitSystem: "Einheitensystem",
    metric: "Metrisch",
    imperial: "Imperial",
    audioTitle: "Audio & Feedback",
    audioDesc: "Töne und Warnungen verwalten.",
    interfaceSounds: "Schnittstellentöne",
    muted: "Stumm",
    enabled: "Aktiviert",
    aboutTitle: "Über uns",
    version: "Version",
    aiModel: "KI-Modell",
    footer: "Präzision für Athleten",
    returnBtn: "Zurück zum Training",
    language: "Sprache"
  },
  modals: {
    completeTitle: "Training beendet!",
    completeDesc: "Gute Arbeit! Sie haben alle Übungen für heute erfolgreich abgeschlossen.",
    saveBtn: "In Bibliothek speichern",
    savedBtn: "Gespeichert",
    viewBtn: "Routine ansehen",
    duplicateTitle: "Duplikat gefunden",
    duplicateDesc: "\"{name}\" ist bereits in Ihrer Bibliothek vorhanden.",
    saveNew: "Als neue Kopie speichern",
    updateExisting: "Bestehenden Eintrag aktualisieren"
  }
};
