
import { TranslationSchema } from './types';

export const fr: TranslationSchema = {
  common: {
    appName: "Workoutron",
    appVersion: "3000",
    fullVersion: "3.1.0-PREVIEW",
    back: "Retour",
    cancel: "Annuler",
    confirm: "Confirmer",
    done: "Terminé",
    save: "Enregistrer",
    loading: "Chargement...",
    errorTitle: "Erreur",
    storageLimitMsg: "Limite de stockage atteinte : Veuillez supprimer d'anciens entraînements pour en enregistrer de nouveaux.",
    storageFullMsg: "Stockage plein : Impossible d'enregistrer. Supprimez d'abord des routines de votre bibliothèque.",
    unexpectedError: "Une erreur inattendue est survenue lors de l'enregistrement."
  },
  header: {
    settings: "Réglages"
  },
  nav: {
    library: "Bibliothèque",
    add: "Ajouter",
    history: "Historique"
  },
  uploader: {
    analyzingTitle: "Analyse en cours",
    analyzingDesc: "Identification de l'équipement et création de votre routine spécialisée...",
    cameraDenied: "Accès à la caméra refusé. Essayez de télécharger une photo.",
    snapTitle: "Prendre une photo",
    snapDesc: "Prenez une photo de n'importe quel équipement pour générer une routine personnalisée.",
    uploadBtn: "Importer de la galerie",
    legalInfo: "Avis de non-responsabilité IA"
  },
  workout: {
    identified: "Identifié",
    exitBtn: "Quitter l'entraînement",
    intensityTitle: "Mode d'intensité",
    exerciseLabel: "EXERCICE",
    sets: "SÉRIES",
    reps: "RÉPS",
    time: "TEMPS",
    dist: "DIST",
    rest: "REPOS",
    bodyweight: "Corps",
    safetyTitle: "Sécurité et contexte",
    legalDisclaimerBtn: "Mentions légales",
    legalModalTitle: "Avis de non-responsabilité",
    legalBody: [
      "Les routines d'entraînement générées par Workoutron 3000 sont fournies par l'IA à titre informatif uniquement.",
      "Attention : Consultez toujours un professionnel du fitness ou un médecin avant de commencer un nouveau programme d'exercice."
    ],
    legalUnderstand: "Je comprends",
    startTraining: "Démarrer",
    skip: "Passer",
    recovery: "Récupération",
    complete: "Terminé",
    doneWithSet: "Série terminée",
    langMismatch: "Généré dans une langue différente",
    shareBtn: "Partager la routine"
  },
  share: {
    title: "Partager votre routine",
    preview: "Aperçu",
    downloadBtn: "Télécharger l'image",
    nativeBtn: "Choisir l'application",
    twitter: "Publier sur X",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    // Fix: Added missing social platforms for French
    telegram: "Telegram",
    instagram: "Instagram",
    snapchat: "Snapchat",
    copyLink: "Copier le lien",
    linkCopied: "Lien copié !",
    generatedBy: "Téléchargez Workoutron sur Google Play ou l'Apple App Store"
  },
  library: {
    title: "Votre Bibliothèque",
    searchPlaceholder: "Rechercher un équipement...",
    noRoutinesTitle: "Aucune routine enregistrée",
    noRoutinesDesc: "Scannez un équipement pour construire votre bibliothèque personnelle.",
    removeTitle: "Supprimer la routine",
    favAdd: "Ajouter aux favoris",
    favRemove: "Retirer des favoris"
  },
  activity: {
    title: "Centre d'activité",
    descPrefix: "Historique pour",
    totalEffort: "Effort total",
    currentStreak: "Série actuelle",
    days: "jours",
    consistency: "Régularité",
    intensityKey: "Clé d'intensité",
    recentProgress: "Progrès récents",
    lastSessions: "10 dernières sessions",
    noActivity: "Aucune activité enregistrée. Commencez par scanner un équipement !",
    months: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    scores: {
      none: "Aucun",
      elite: "Élite",
      pro: "Pro",
      good: "Bon",
      active: "Actif"
    }
  },
  settings: {
    title: "Options",
    subtitle: "Personnalisez votre expérience",
    prefTitle: "Préférences",
    prefDesc: "Choisissez vos standards de mesure.",
    unitSystem: "Système d'unités",
    metric: "Métrique",
    imperial: "Impérial",
    audioTitle: "Audio et retours",
    audioDesc: "Gérez les sons et les alertes.",
    interfaceSounds: "Sons de l'interface",
    muted: "Muet",
    enabled: "Activé",
    aboutTitle: "À propos",
    version: "Version",
    aiModel: "Modèle IA",
    footer: "Conçu pour les athlètes",
    returnBtn: "Retour à l'entraînement",
    language: "Langue"
  },
  modals: {
    completeTitle: "Entraînement terminé !",
    completeDesc: "Bravo ! Vous avez terminé tous les exercices de cette session.",
    saveBtn: "Enregistrer",
    savedBtn: "Enregistré",
    viewBtn: "Voir la routine",
    duplicateTitle: "Doublon trouvé",
    duplicateDesc: "Vous avez déjà \"{name}\" dans votre bibliothèque.",
    saveNew: "Enregistrer comme nouveau",
    updateExisting: "Mettre à jour l'existant"
  }
};
