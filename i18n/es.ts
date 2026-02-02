
import { TranslationSchema } from './types';

export const es: TranslationSchema = {
  common: {
    appName: "VizoFit",
    appVersion: "1.0.0",
    fullVersion: "1.0.0-PRO",
    back: "Atrás",
    cancel: "Cancelar",
    confirm: "Confirmar",
    done: "Hecho",
    save: "Guardar",
    loading: "Cargando...",
    errorTitle: "Error",
    storageLimitMsg: "Límite de Almacenamiento Alcanzado: Elimina entrenamientos antiguos para guardar nuevos.",
    storageFullMsg: "Almacenamiento Lleno: No se puede guardar. Elimina rutinas de tu Biblioteca primero.",
    unexpectedError: "Ocurrió un error inesperado al guardar."
  },
  header: {
    settings: "Ajustes"
  },
  nav: {
    library: "Biblioteca",
    add: "Añadir",
    history: "Historial"
  },
  uploader: {
    analyzingTitle: "Analizando Equipo",
    analyzingDesc: "Identificando equipo y creando tu rutina especializada...",
    cameraDenied: "Acceso a cámara denegado. Intenta subir una foto.",
    snapTitle: "Captura para Empezar",
    snapDesc: "Toma una foto de cualquier equipo para generar una rutina personalizada.",
    uploadBtn: "Subir desde Biblioteca",
    legalInfo: "Descargo de Responsabilidad de IA"
  },
  workout: {
    identified: "Identificado",
    exitBtn: "Salir del Entrenamiento",
    intensityTitle: "Modo de Intensidad",
    exerciseLabel: "EJERCICIO",
    sets: "SERIES",
    reps: "REPS",
    time: "TIEMPO",
    dist: "DIST",
    rest: "DESCANSO",
    bodyweight: "Cuerpo",
    safetyTitle: "Resumen de Seguridad y Contexto",
    legalDisclaimerBtn: "Términos y Descargo Legal",
    legalModalTitle: "Descargo de Responsabilidad Legal",
    legalBody: [
      "Las rutinas y ejercicios generados por VizoFit son proporcionados por inteligencia artificial solo con fines informativos.",
      "Advertencia: Consulta siempre con un profesional del fitness o médico antes de comenzar cualquier programa de ejercicios."
    ],
    legalUnderstand: "Entiendo",
    startTraining: "Empezar Entrenamiento",
    skip: "Saltar",
    recovery: "Recuperación",
    complete: "Completo",
    doneWithSet: "Serie Terminada",
    langMismatch: "Generado en un idioma diferente",
    shareBtn: "Compartir Rutina"
  },
  share: {
    title: "Compartir Tu Rutina",
    preview: "Vista Previa",
    downloadBtn: "Descargar Imagen",
    nativeBtn: "Elegir aplicación",
    twitter: "Publicar en X",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    // Fix: Added missing social platforms for Spanish
    telegram: "Telegram",
    instagram: "Instagram",
    snapchat: "Snapchat",
    copyLink: "Copiar Enlace",
    linkCopied: "¡Enlace Copiado!",
    generatedBy: "Descarga VizoFit en Google Play o Apple App Store"
  },
  library: {
    title: "Tu Biblioteca",
    searchPlaceholder: "Buscar tu equipo...",
    noRoutinesTitle: "Sin Rutinas Guardadas",
    noRoutinesDesc: "Escanea algún equipo con la cámara para construir tu biblioteca personal.",
    removeTitle: "Eliminar Rutina",
    favAdd: "Añadir a Favoritos",
    favRemove: "Quitar de Favoritos"
  },
  activity: {
    title: "Centro de Actividad",
    descPrefix: "Historial dinámico para",
    totalEffort: "Esfuerzo Total",
    currentStreak: "Racha Actual",
    days: "días",
    consistency: "Consistencia",
    intensityKey: "Clave de Intensidad",
    recentProgress: "Progreso Reciente",
    lastSessions: "Últimas 10 sesiones",
    noActivity: "Aún no hay actividad. ¡Empieza escaneando equipo!",
    months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    scores: {
      none: "Ninguno",
      elite: "Élite",
      pro: "Pro",
      good: "Bueno",
      active: "Activo"
    }
  },
  settings: {
    title: "Opciones",
    subtitle: "Personaliza tu experiencia",
    prefTitle: "Preferencias",
    prefDesc: "Elige tus estándares de medición.",
    unitSystem: "Sistema de Unidades",
    metric: "Métrico",
    imperial: "Imperial",
    audioTitle: "Audio y Respuesta",
    audioDesc: "Gestiona sonidos y alertas.",
    interfaceSounds: "Sonidos de Interfaz",
    muted: "Silenciado",
    enabled: "Activado",
    aboutTitle: "Acerca de",
    version: "Versión",
    aiModel: "Modelo de IA",
    footer: "Construído con precisión para atletas",
    returnBtn: "Volver al Entrenamiento",
    language: "Idioma"
  },
  modals: {
    completeTitle: "¡Entrenamiento Terminado!",
    completeDesc: "¡Buen trabajo! Has terminado todos los ejercicios de esta sesión.",
    saveBtn: "Guardar en Biblioteca",
    savedBtn: "Guardado en Biblioteca",
    viewBtn: "Ver Rutina",
    duplicateTitle: "Duplicado Encontrado",
    duplicateDesc: "Ya tienes \"{name}\" en tu biblioteca.",
    saveNew: "Guardar como Copia Nueva",
    updateExisting: "Actualizar Existente"
  }
};
