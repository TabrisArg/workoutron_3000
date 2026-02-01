
import { TranslationSchema } from './types';

export const ar: TranslationSchema = {
  common: {
    appName: "ووركاوت-رون",
    appVersion: "3000",
    fullVersion: "3.1.0-PREVIEW",
    back: "رجوع",
    cancel: "إلغاء",
    confirm: "تأكيد",
    done: "تم",
    save: "حفظ",
    loading: "جاري التحميل...",
    errorTitle: "خطأ",
    storageLimitMsg: "تم الوصول للحد الأقصى للتخزين: يرجى حذف تدريبات قديمة لحفظ الجديد.",
    storageFullMsg: "الذاكرة ممتلئة: لا يمكن الحفظ. احذف بعض الروتينات من المكتبة أولاً.",
    unexpectedError: "حدث خطأ غير متوقع أثناء الحفظ."
  },
  header: {
    settings: "الإعدادات"
  },
  nav: {
    library: "المكتبة",
    add: "إضافة",
    history: "السجل"
  },
  uploader: {
    analyzingTitle: "تحليل المعدات",
    analyzingDesc: "جاري التعرف على المعدات وتصميم روتينك الخاص...",
    cameraDenied: "تم رفض الوصول للكاميرا. حاول رفع صورة بدلاً من ذلك.",
    snapTitle: "التقط صورة",
    snapDesc: "التقط صورة لأي معدات تدريب لإنشاء روتين مخصص.",
    uploadBtn: "رفع من المعرض",
    legalInfo: "إخلاء مسؤولية الذكاء الاصطناعي"
  },
  workout: {
    identified: "تم التعرف",
    exitBtn: "خروج من التمرين",
    intensityTitle: "وضع الكثافة",
    exerciseLabel: "تمرين",
    sets: "جولات",
    reps: "تكرارات",
    time: "وقت",
    dist: "مسافة",
    rest: "راحة",
    bodyweight: "وزن الجسم",
    safetyTitle: "السلامة والسياق",
    legalDisclaimerBtn: "إخلاء المسؤولية القانونية",
    legalModalTitle: "تنبيه قانوني",
    legalBody: [
      "روتينات التمرين التي ينشئها Workoutron 3000 مقدمة بواسطة الذكاء الاصطناعي لأغراض إعلامية فقط.",
      "تحذير: استشر دائماً مدرباً محترفاً أو طبيباً مختصاً قبل البدء في أي برنامج تمارين جديد."
    ],
    legalUnderstand: "أفهم ذلك",
    startTraining: "بدء التدريب",
    skip: "تخطي",
    recovery: "استشفاء",
    complete: "مكتمل",
    doneWithSet: "انتهت الجولة",
    langMismatch: "تم إنشاؤه بلغة مختلفة",
    shareBtn: "مشاركة الروتين"
  },
  share: {
    title: "شارك روتينك",
    preview: "معاينة",
    downloadBtn: "تحميل الصورة",
    nativeBtn: "اختر تطبيقك",
    twitter: "نشر على X",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    // Fix: Added missing social platforms for Arabic
    telegram: "تيليجرام",
    instagram: "إنستغرام",
    snapchat: "سناب شات",
    copyLink: "نسخ الرابط",
    linkCopied: "تم نسخ الرابط!",
    generatedBy: "حمل Workoutron من Google Play أو Apple App Store"
  },
  library: {
    title: "مكتبتك",
    searchPlaceholder: "ابحث عن معداتك...",
    noRoutinesTitle: "لا توجد روتينات محفوظة",
    noRoutinesDesc: "امسح المعدات بالكاميرا لبناء مكتبة التدريب الشخصية الخاصة بك.",
    removeTitle: "حذف الروتين",
    favAdd: "إضافة للمفضلة",
    favRemove: "إزالة من المفضلة"
  },
  activity: {
    title: "مركز النشاط",
    descPrefix: "سجل التدريب لعام",
    totalEffort: "إجمالي الجهد",
    currentStreak: "الاستمرارية",
    days: "يوم",
    consistency: "التناسق",
    intensityKey: "مفتاح الكثافة",
    recentProgress: "التقدم الأخير",
    lastSessions: "آخر 10 جلسات",
    noActivity: "لم يتم تسجيل نشاط بعد. ابدأ بمسح المعدات!",
    months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
    scores: {
      none: "لا يوجد",
      elite: "نخبة",
      pro: "محترف",
      good: "جيد",
      active: "نشط"
    }
  },
  settings: {
    title: "خيارات",
    subtitle: "خصص تجربة تدريبك",
    prefTitle: "التفضيلات",
    prefDesc: "اختر معايير القياس الخاصة بك.",
    unitSystem: "نظام الوحدات",
    metric: "متري",
    imperial: "إمبراطوري",
    audioTitle: "الصوت والتغذية الراجعة",
    audioDesc: "إدارة الأصوات والتنبيهات.",
    interfaceSounds: "أصوات الواجهة",
    muted: "صامت",
    enabled: "مفعل",
    aboutTitle: "حول التطبيق",
    version: "الإصدار",
    aiModel: "نموذج الذكاء الاصطناعي",
    footer: "صُمم بدقة للرياضيين",
    returnBtn: "العودة للتمرين",
    language: "اللغة"
  },
  modals: {
    completeTitle: "اكتمل التمرين!",
    completeDesc: "عمل رائع! لقد انتهيت بنجاح من جميع تمارين هذه الجلسة.",
    saveBtn: "حفظ في المكتبة",
    savedBtn: "تم الحفظ",
    viewBtn: "عرض الروتين",
    duplicateTitle: "تم العثور على تكرار",
    duplicateDesc: "\"{name}\" موجود بالفعل في مكتبتك.",
    saveNew: "حفظ كنسخة جديدة",
    updateExisting: "تحديث الإدخال الحالي"
  }
};
