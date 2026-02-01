
import { TranslationSchema } from './types';

export const hi: TranslationSchema = {
  common: {
    appName: "वॉकआउट्रॉन",
    appVersion: "3000",
    fullVersion: "3.1.0-PREVIEW",
    back: "पीछे",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    done: "हो गया",
    save: "सहेजें",
    loading: "लोड हो रहा है...",
    errorTitle: "त्रुटि",
    storageLimitMsg: "स्टोरेज की सीमा समाप्त: कृपया नया वर्कआउट सहेजने के लिए पुराने को हटा दें।",
    storageFullMsg: "स्टोरेज फुल: वर्कआउट सहेज नहीं सकते। पहले अपनी लाइब्रेरी से कुछ वर्कआउट हटाएं।",
    unexpectedError: "सहेजते समय एक अप्रत्याशित त्रुटि हुई।"
  },
  header: {
    settings: "सेटिंग्स"
  },
  nav: {
    library: "लाइब्रेरी",
    add: "जोड़ें",
    history: "इतिहास"
  },
  uploader: {
    analyzingTitle: "उपकरण का विश्लेषण",
    analyzingDesc: "उपकरण की पहचान और आपकी विशेष दिनचर्या तैयार की जा रही है...",
    cameraDenied: "कैमरा एक्सेस नहीं मिला। फोटो अपलोड करने का प्रयास करें।",
    snapTitle: "फोटो लें",
    snapDesc: "कस्टम रूटीन बनाने के लिए किसी भी उपकरण की फोटो लें।",
    uploadBtn: "गैलरी से अपलोड करें",
    legalInfo: "AI डिस्क्लेमर"
  },
  workout: {
    identified: "पहचाना गया",
    exitBtn: "वर्कआउट छोड़ें",
    intensityTitle: "तीव्रता मोड",
    exerciseLabel: "व्यायाम",
    sets: "सेट्स",
    reps: "रेप्स",
    time: "समय",
    dist: "दूरी",
    rest: "आराम",
    bodyweight: "शरीर भार",
    safetyTitle: "सुरक्षा और संदर्भ",
    legalDisclaimerBtn: "कानूनी जानकारी",
    legalModalTitle: "कानूनी अस्वीकरण",
    legalBody: [
      "वर्कआउट्रॉन 3000 द्वारा बनाए गए वर्कआउट केवल सूचनात्मक उद्देश्यों के लिए AI द्वारा प्रदान किए गए हैं।",
      "चेतावनी: कोई भी नया व्यायाम शुरू करने से पहले हमेशा एक योग्य ट्रेनर या डॉक्टर से सलाह लें।"
    ],
    legalUnderstand: "मैं समझता हूँ",
    startTraining: "ट्रेनिंग शुरू करें",
    skip: "छोड़ें",
    recovery: "रिकवरी",
    complete: "पूरा हुआ",
    doneWithSet: "सेट पूरा हुआ",
    langMismatch: "अलग भाषा में उत्पन्न",
    shareBtn: "रूटीन साझा करें"
  },
  share: {
    title: "रूटीन साझा करें",
    preview: "पूर्वावलोकन",
    downloadBtn: "इमेज डाउनलोड करें",
    nativeBtn: "ऐप चुनें",
    twitter: "X पर पोस्ट करें",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    // Fix: Added missing social platforms for Hindi
    telegram: "Telegram",
    instagram: "Instagram",
    snapchat: "Snapchat",
    copyLink: "लिंक कॉपी करें",
    linkCopied: "लिंक कॉपी हो गया!",
    generatedBy: "Google Play या Apple App Store से Workoutron डाउनलोड करें"
  },
  library: {
    title: "आपकी लाइब्रेरी",
    searchPlaceholder: "उपकरण खोजें...",
    noRoutinesTitle: "कोई वर्कआउट नहीं मिला",
    noRoutinesDesc: "अपनी व्यक्तिगत ट्रेनिंग लाइब्रेरी बनाने के लिए उपकरणों को स्कैन करें।",
    removeTitle: "रूटीन हटाएं",
    favAdd: "पसंदीदा में जोड़ें",
    favRemove: "पसंदीदा से हटाएं"
  },
  activity: {
    title: "गतिविधि हब",
    descPrefix: "ट्रेनिंग इतिहास",
    totalEffort: "कुल प्रयास",
    currentStreak: "लगातार दिन",
    days: "दिन",
    consistency: "निरंतरता",
    intensityKey: "तीव्रता कुंजी",
    recentProgress: "हालिया प्रगति",
    lastSessions: "पिछले 10 सत्र",
    noActivity: "अभी तक कोई गतिविधि नहीं। शुरू करने के लिए उपकरण स्कैन करें!",
    months: ["जन", "फर", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सित", "अक्टू", "नवं", "दिस"],
    scores: {
      none: "कोई नहीं",
      elite: "एलीट",
      pro: "प्रो",
      good: "अच्छा",
      active: "सक्रिय"
    }
  },
  settings: {
    title: "विकल्प",
    subtitle: "अपना अनुभव अनुकूलित करें",
    prefTitle: "वरीयताएँ",
    prefDesc: "अपनी माप मानक चुनें।",
    unitSystem: "इकाई प्रणाली",
    metric: "मीट्रिक",
    imperial: "इंपीरियल",
    audioTitle: "ऑडियो और फीडबैक",
    audioDesc: "ध्वनि और अलर्ट प्रबंधित करें।",
    interfaceSounds: "इंटरफेस ध्वनि",
    muted: "म्यूट",
    enabled: "सक्षम",
    aboutTitle: "ऐप के बारे में",
    version: "वर्जन",
    aiModel: "AI मॉडल",
    footer: "एथलीटों के लिए निर्मित",
    returnBtn: "वर्कआउट पर वापस लौटें",
    language: "भाषा"
  },
  modals: {
    completeTitle: "वर्कआउट पूरा हुआ!",
    completeDesc: "बहुत बढ़िया! आपने आज के सभी व्यायाम सफलतापूर्वक पूरे कर लिए हैं।",
    saveBtn: "लाइब्रेरी में सहेजें",
    savedBtn: "सहेजा गया",
    viewBtn: "रूटीन देखें",
    duplicateTitle: "डुप्लिकेट मिला",
    duplicateDesc: "\"{name}\" आपकी लाइब्रेरी में पहले से मौजूद है।",
    saveNew: "नई कॉपी के रूप में सहेजें",
    updateExisting: "पुराने को अपडेट करें"
  }
};
