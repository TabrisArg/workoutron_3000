
export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  weight?: string;
  instructions: string;
}

export interface WorkoutRoutine {
  equipmentName: string;
  equipmentDescription: string;
  targetMuscles: string[];
  exercises: Exercise[];
  safetyTips: string[];
  estimatedDuration: string;
  suggestedIntensity?: string;
  generatedLanguage?: string;
  debugRawResponse?: string; // For debug menu
}

export interface SavedWorkout {
  id: string;
  date: string;
  routine: WorkoutRoutine;
  imagePreview: string | null;
  isFavorited?: boolean;
  favoritedAt?: string; // ISO string
}

export interface ActivityLog {
  id: string;
  date: string; // ISO string for sorting and filtering
  equipmentName: string;
  duration?: string;
}

export interface UserSettings {
  units: 'metric' | 'imperial';
  isMuted: boolean;
  language: 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'hi' | 'ar';
  appearance: 'light' | 'dark' | 'system';
  isPro: boolean; // NEW: Track monetization status
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  LIBRARY = 'LIBRARY',
  ACTIVITY = 'ACTIVITY'
}
