
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { WorkoutRoutine, Exercise, SavedWorkout, UserSettings } from '../types';
import { compressBase64 } from '../utils/imageUtils';
import { soundService } from '../utils/soundService';
import { TranslationSchema } from '../i18n/types';
import ShareStudio from './ShareStudio';

interface ExerciseWithId extends Exercise {
  id: string;
}

interface WorkoutRoutineDisplayProps {
  routine: WorkoutRoutine;
  imagePreview: string | null;
  initialSavedId: string | null;
  settings: UserSettings;
  t: TranslationSchema;
  onReset: () => void;
  onComplete: (routine: WorkoutRoutine, savedId: string | null) => void;
  onUpgrade: () => void; // NEW: Callback for upgrade prompt
  onDuplicateDetected: (match: SavedWorkout, onResolve: (mode: 'new' | 'overwrite') => void) => void;
}

const CONV = { KG_TO_LB: 2.20462, M_TO_YD: 1.09361, KM_TO_MI: 0.621371 };

const convertValue = (val: string, toUnit: 'metric' | 'imperial'): string => {
  if (!val) return '';
  const lower = val.toLowerCase();
  if (toUnit === 'imperial' && (lower.includes('kg') || lower.includes('kilogram'))) {
    return val.replace(/(\d+(\.\d+)?)\s*(kg|kgs|kilogram|kilograms)/gi, (m, n) => {
      const converted = parseFloat(n) * CONV.KG_TO_LB;
      return converted < 10 ? converted.toFixed(1) + ' lbs' : Math.round(converted) + ' lbs';
    });
  }
  if (toUnit === 'metric' && (lower.includes('lb') || lower.includes('pound'))) {
    return val.replace(/(\d+(\.\d+)?)\s*(lb|lbs|pound|pounds)/gi, (m, n) => {
      const converted = parseFloat(n) / CONV.KG_TO_LB;
      return converted < 10 ? converted.toFixed(1) + ' kg' : Math.round(converted) + ' kg';
    });
  }
  return val;
};

const formatSmartDisplay = (val: string, units: 'metric' | 'imperial'): string => {
  if (!val) return '';
  let converted = convertValue(val, units);
  let text = converted.toLowerCase()
    .replace(/\bper arm\b/g, '/arm').replace(/\bper leg\b/g, '/leg').replace(/\bper side\b/g, '/side')
    .replace(/\brepetitions\b/g, 'reps').replace(/\bseconds?\b/g, 's').replace(/\bminutes?\b/g, 'm')
    .replace(/\s*sets?\b/g, '').replace(/\s*reps?\b/g, '').trim();
  text = text.replace(/(\d+)([a-z/]+)/gi, '$1 $2');
  return text;
};

const scaleByMultiplier = (val: string, multiplier: number): string => {
  if (!val || multiplier === 1) return val;
  return val.replace(/(\d+(\.\d+)?)/g, (match) => {
    const num = parseFloat(match);
    if (isNaN(num)) return match;
    const scaled = Math.round(num * multiplier);
    return Math.max(1, Math.min(scaled, 9999)).toString();
  });
};

const parseSmartNumber = (val: string): number => {
  const clean = val.toLowerCase().trim();
  const match = clean.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : (isNaN(parseFloat(clean)) ? 0 : parseFloat(clean));
};

const parseTimeSeconds = (str: string | undefined): number | null => {
  if (!str) return null;
  const lowerStr = str.toLowerCase().trim();
  const match = lowerStr.match(/(\d+(\.\d+)?)\s*(min|sec|m|s)?/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const unit = match[3];
  if (unit === 'min' || lowerStr.includes('min')) return value * 60;
  if (unit === 'sec' || unit === 's' || lowerStr.includes('sec')) return value;
  return null;
};

const INTENSITY_LEVELS = [
  { id: 1, mult: 0.5, color: '#BAE6FD', label: 'LITE', isPremium: false }, 
  { id: 2, mult: 0.75, color: '#7DD3FC', label: 'LOW', isPremium: false },
  { id: 3, mult: 1.0, color: '#007AFF', label: 'MID', isPremium: false },
  { id: 4, mult: 1.25, color: '#1D4ED8', label: 'HIGH', isPremium: true },
  { id: 5, mult: 1.5, color: '#1E3A8A', label: 'MAX', isPremium: true }
];

const ActiveTrainingOverlay: React.FC<{ 
  exercises: Exercise[], 
  units: 'metric' | 'imperial', 
  t: TranslationSchema, 
  onClose: () => void,
  onComplete: () => void
}> = ({ exercises, units, t, onClose, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [status, setStatus] = useState<'working' | 'resting' | 'finished'>('working');
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<any>(null);

  const currentExercise = exercises[currentIndex];
  const totalSets = Math.min(parseSmartNumber(currentExercise.sets) || 1, 99);
  const setDuration = parseTimeSeconds(currentExercise.reps);
  const restDuration = parseTimeSeconds(currentExercise.rest) || 60;

  useEffect(() => {
    if (status === 'resting' || (status === 'working' && setDuration && setDuration > 0)) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            if (status === 'working') finishSet();
            else startSet(currentSet + 1);
            return 0;
          }
          if (prev < 6) soundService.playTick();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [status, timeLeft]);

  const startSet = (setNum: number) => {
    if (setNum > totalSets) { nextExercise(); return; }
    soundService.playStart();
    setCurrentSet(setNum);
    setStatus('working');
    setTimeLeft(setDuration && setDuration > 0 ? setDuration : 0);
  };

  const finishSet = () => {
    soundService.playSetComplete();
    if (currentSet < totalSets) { setStatus('resting'); setTimeLeft(restDuration); }
    else { nextExercise(); }
  };

  const nextExercise = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentSet(1);
      setStatus('working');
      setTimeLeft(0);
    } else {
      setStatus('finished');
      onComplete();
    }
  };

  const skipTimer = () => {
    soundService.playTap();
    clearInterval(timerRef.current);
    if (status === 'resting') startSet(currentSet + 1);
    else finishSet();
  };

  const progress = ((currentIndex) / exercises.length) * 100 + ((currentSet / totalSets) * (100 / exercises.length));
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const timerTotal = status === 'resting' ? restDuration : (setDuration || 1);
  const strokeDashoffset = timeLeft > 0 ? circumference * (1 - timeLeft / timerTotal) : 0;

  if (status === 'finished') {
    return (
      <div className="fixed inset-0 z-[200] bg-apple-blue flex flex-col items-center justify-center p-10 text-white animate-reveal">
        <span className="material-symbols-rounded text-[120px] mb-6 animate-spring">celebration</span>
        <h2 className="text-4xl font-black tracking-tighter mb-2">{t.workout.complete}</h2>
        <p className="text-white/80 font-bold mb-10">You crushed it!</p>
        <button onClick={onClose} className="bg-white text-apple-blue px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-transform">
          {t.common.done}
        </button>
      </div>
    );
  }

  const repsText = formatSmartDisplay(currentExercise.reps, units);
  const hasUnitInReps = repsText.match(/[a-z]/i);
  const circleLabel = status === 'resting' ? t.workout.recovery : (hasUnitInReps ? t.workout.exerciseLabel : t.workout.reps);

  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-[#000000] flex flex-col animate-reveal">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-apple-bg dark:bg-white/10">
        <div className="h-full bg-apple-blue transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>
      <header className="p-6 flex justify-between items-center shrink-0">
        <button onClick={onClose} className="size-10 rounded-full bg-apple-bg dark:bg-white/10 flex items-center justify-center text-apple-text dark:text-white">
          <span className="material-symbols-rounded">close</span>
        </button>
        <div className="flex flex-col items-center max-w-[60%]">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-apple-gray">Exercise {currentIndex + 1} of {exercises.length}</span>
          <span className="font-bold text-sm dark:text-white truncate w-full text-center uppercase tracking-tight">{currentExercise.name}</span>
        </div>
        <div className="size-10"></div>
      </header>
      <main className="flex-grow flex flex-col items-center px-8 text-center overflow-y-auto no-scrollbar">
        <div className="mb-8 mt-4 space-y-2 shrink-0">
          <span className="text-apple-blue font-black text-xs uppercase tracking-widest">Set {currentSet} of {totalSets}</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white leading-tight break-words max-w-lg mx-auto uppercase">{currentExercise.name}</h2>
        </div>
        <div className="w-full max-sm mx-auto space-y-4 mb-8 shrink-0">
          <div className="flex flex-col gap-4">
            {status === 'working' && !setDuration ? (
              <button onClick={finishSet} className="w-full bg-apple-text dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 ios-transition uppercase tracking-widest">
                {t.workout.doneWithSet}
              </button>
            ) : (
              <button onClick={skipTimer} className="w-full bg-apple-blue text-white py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 ios-transition uppercase tracking-widest">
                {status === 'resting' ? t.workout.skip : t.workout.skip}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-apple-bg dark:bg-[#1C1C1E] p-4 rounded-2xl flex flex-col border border-black/5 dark:border-white/5">
               <span className="text-[9px] font-black text-apple-gray uppercase tracking-widest">{t.workout.exerciseLabel}</span>
               <span className="text-lg font-black dark:text-white">{currentExercise.weight || 'Body'}</span>
            </div>
            <div className="bg-apple-bg dark:bg-[#1C1C1E] p-4 rounded-2xl flex flex-col border border-black/5 dark:border-white/5">
               <span className="text-[9px] font-black text-apple-gray uppercase tracking-widest">{t.workout.rest}</span>
               <span className="text-lg font-black dark:text-white">{currentExercise.rest}</span>
            </div>
          </div>
        </div>
        <div className="relative size-60 md:size-72 flex items-center justify-center mb-10 shrink-0">
          <div className="absolute inset-0 rounded-full border-8 border-apple-bg dark:border-white/5"></div>
          <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className={`text-apple-blue transition-all duration-1000 ${status === 'resting' ? 'text-orange-400' : ''}`} strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
          </svg>
          <div className="flex flex-col items-center animate-pulse-soft">
            {timeLeft > 0 ? (
              <>
                <span className="text-6xl font-black tracking-tighter dark:text-white drop-shadow-md">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-apple-gray mt-2">{circleLabel}</span>
              </>
            ) : (
              <>
                <span className="text-6xl font-black tracking-tighter dark:text-white drop-shadow-md">{repsText}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-apple-gray mt-2">{circleLabel}</span>
              </>
            )}
          </div>
        </div>
        <div className="w-full max-w-md mx-auto pb-12">
          <p className="text-apple-label dark:text-apple-gray/80 text-sm font-medium leading-relaxed break-words px-4">{currentExercise.instructions}</p>
        </div>
      </main>
    </div>
  );
};

const IntensityGauge: React.FC<{ activeId: number, isPro: boolean, onChange: (id: number) => void }> = ({ activeId, isPro, onChange }) => {
  const activeLevel = INTENSITY_LEVELS.find(l => l.id === activeId) || INTENSITY_LEVELS[2];
  return (
    <div className="flex items-center justify-center py-2 animate-reveal select-none">
      <div className="flex bg-black/[0.05] dark:bg-white/[0.05] p-1 rounded-full border border-black/[0.02] dark:border-white/[0.02] shadow-inner no-print w-full sm:w-[280px] relative h-10 items-center">
        <div className="absolute inset-0 flex px-1">
          {INTENSITY_LEVELS.map(level => (
            <button key={level.id} onClick={() => onChange(level.id)} className="flex-1 h-full cursor-pointer z-20 outline-none flex items-center justify-center relative">
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-opacity duration-300 ${level.id === activeId ? 'opacity-0' : 'opacity-30 dark:text-white'}`}>{level.label}</span>
              {level.isPremium && !isPro && (
                <span className="material-symbols-rounded text-[8px] text-yellow-500 absolute top-1 right-1 font-black opacity-40">lock</span>
              )}
            </button>
          ))}
        </div>
        <div className="absolute top-1 bottom-1 w-[calc(20%-2px)] rounded-full shadow-lg ios-transition z-10 flex items-center justify-center" style={{ backgroundColor: activeLevel.color, left: `calc(4px + ${(activeId - 1) * 20}%)` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/10 rounded-full"></div>
          <span className="text-[10px] font-black text-white uppercase tracking-tighter drop-shadow-sm relative z-10">{activeLevel.label}</span>
        </div>
      </div>
    </div>
  );
};

const WorkoutRoutineDisplay: React.FC<WorkoutRoutineDisplayProps> = ({ routine, imagePreview, initialSavedId, settings, t, onReset, onComplete, onUpgrade, onDuplicateDetected }) => {
  const prepareRoutine = (r: WorkoutRoutine) => ({
    ...r,
    exercises: r.exercises.map((ex, i) => ({ ...ex, id: `ex-${i}-${Date.now()}` } as ExerciseWithId))
  });

  const [baselineRoutine, setBaselineRoutine] = useState(prepareRoutine(routine));
  const [intensityId, setIntensityId] = useState(3);
  const [sessionSavedId, setSessionSavedId] = useState<string | null>(initialSavedId);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showShareStudio, setShowShareStudio] = useState(false);
  const [isActiveMode, setIsActiveMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const currentRoutine = useMemo(() => {
    const multiplier = INTENSITY_LEVELS.find(l => l.id === intensityId)?.mult || 1;
    if (multiplier === 1) return baselineRoutine;
    return {
      ...baselineRoutine,
      exercises: baselineRoutine.exercises.map(ex => ({
        ...ex,
        sets: scaleByMultiplier(ex.sets, multiplier),
        reps: scaleByMultiplier(ex.reps, multiplier),
        weight: (ex.weight && ex.weight.toLowerCase() !== 'bodyweight') ? scaleByMultiplier(ex.weight, multiplier) : ex.weight
      }))
    };
  }, [baselineRoutine, intensityId]);

  useEffect(() => { 
    if (initialSavedId && initialSavedId !== sessionSavedId) setSessionSavedId(initialSavedId);
    if (initialSavedId) {
       const saved = JSON.parse(localStorage.getItem('equipfit_saved') || '[]');
       const current = saved.find((s: SavedWorkout) => s.id === initialSavedId);
       if (current) setIsFavorited(!!current.isFavorited);
    }
  }, [initialSavedId]);

  useEffect(() => {
    const handleGlobalUp = () => {
      if (draggedIdx !== null) { setDraggedIdx(null); soundService.playSuccess(); document.body.classList.remove('reordering-active'); }
    };
    window.addEventListener('pointerup', handleGlobalUp);
    return () => window.removeEventListener('pointerup', handleGlobalUp);
  }, [draggedIdx]);

  const persistToLibrary = (updatedRoutine: any, favStatus?: boolean) => {
    if (!sessionSavedId) return;
    const saved = JSON.parse(localStorage.getItem('equipfit_saved') || '[]');
    const index = saved.findIndex((s: SavedWorkout) => s.id === sessionSavedId);
    if (index !== -1) {
      const updatedFav = favStatus !== undefined ? favStatus : saved[index].isFavorited;
      saved[index] = { ...saved[index], routine: JSON.parse(JSON.stringify(updatedRoutine)), isFavorited: updatedFav };
      localStorage.setItem('equipfit_saved', JSON.stringify(saved));
    }
  };

  const updateEquipmentName = (name: string) => setBaselineRoutine(prev => ({ ...prev, equipmentName: name }));
  const updateExercise = (idx: number, field: keyof Exercise, val: string) => {
    setBaselineRoutine(prev => {
      const exercises = [...prev.exercises];
      exercises[idx] = { ...exercises[idx], [field]: val };
      return { ...prev, exercises };
    });
  };

  const handlePointerDown = (idx: number) => { setDraggedIdx(idx); soundService.playTick(); document.body.classList.add('reordering-active'); };
  const handlePointerEnterCard = (targetIdx: number) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    setBaselineRoutine(prev => {
      const exercises = [...prev.exercises];
      const item = exercises.splice(draggedIdx, 1)[0];
      exercises.splice(targetIdx, 0, item);
      return { ...prev, exercises };
    });
    setDraggedIdx(targetIdx);
  };

  const handleEditToggle = () => {
    if (isEditing) { soundService.playSuccess(); if (sessionSavedId) persistToLibrary(baselineRoutine); }
    else { soundService.playTap(); }
    setIsEditing(!isEditing);
  };

  const handleIntensityChange = (id: number) => {
    const target = INTENSITY_LEVELS.find(l => l.id === id);
    if (target?.isPremium && !settings.isPro) {
      soundService.playSad();
      onUpgrade();
      return;
    }
    if (id > intensityId) soundService.playAscending();
    else if (id < intensityId) soundService.playDescending();
    setIntensityId(id);
  };

  const toggleFavorite = () => {
    const nextStatus = !isFavorited;
    if (nextStatus) soundService.playFavorite(); else soundService.playSad();
    setIsFavorited(nextStatus);
    if (sessionSavedId) persistToLibrary(currentRoutine, nextStatus);
  };

  const handleSaveClick = () => {
    if (sessionSavedId) {
      soundService.playSad();
      const existing = JSON.parse(localStorage.getItem('equipfit_saved') || '[]');
      const updated = existing.filter((s: SavedWorkout) => s.id !== sessionSavedId);
      localStorage.setItem('equipfit_saved', JSON.stringify(updated));
      setSessionSavedId(null);
      setIsFavorited(false);
    } else {
      soundService.playTriumphant();
      performSave();
    }
  };

  const performSave = async () => {
    const library = JSON.parse(localStorage.getItem('equipfit_saved') || '[]');
    const targetId = Date.now().toString();
    const compressedImg = imagePreview ? await compressBase64(imagePreview) : null;
    const newSaved: SavedWorkout = { id: targetId, date: new Date().toLocaleDateString(), routine: JSON.parse(JSON.stringify(currentRoutine)) as WorkoutRoutine, imagePreview: compressedImg, isFavorited: false };
    localStorage.setItem('equipfit_saved', JSON.stringify([newSaved, ...library]));
    setSessionSavedId(targetId);
  };

  const finalizeWorkout = () => {
    soundService.playWorkoutComplete();
    onComplete(currentRoutine as unknown as WorkoutRoutine, sessionSavedId);
    const log = { id: Date.now().toString(), date: new Date().toISOString(), equipmentName: currentRoutine.equipmentName, duration: currentRoutine.estimatedDuration };
    const logs = JSON.parse(localStorage.getItem('equipfit_activity_logs') || '[]');
    localStorage.setItem('equipfit_activity_logs', JSON.stringify([log, ...logs]));
    setIsActiveMode(false);
  };

  const isLanguageMismatch = baselineRoutine.generatedLanguage && baselineRoutine.generatedLanguage !== settings.language;

  return (
    <div className="space-y-8 pb-64 w-full max-w-6xl mx-auto px-4 relative">
      <style>{`
        body.reordering-active { cursor: grabbing !important; user-select: none !important; }
        body.reordering-active * { cursor: grabbing !important; pointer-events: auto !important; }
      `}</style>
      
      {isActiveMode && (
        <ActiveTrainingOverlay exercises={currentRoutine.exercises} units={settings.units} t={t} onClose={() => setIsActiveMode(false)} onComplete={finalizeWorkout} />
      )}

      {showShareStudio && (
        <ShareStudio routine={currentRoutine as unknown as WorkoutRoutine} imagePreview={imagePreview} t={t} settings={settings} onClose={() => setShowShareStudio(false)} />
      )}

      <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-ios-lg overflow-hidden shadow-ios animate-reveal">
        <img src={imagePreview || ''} className="w-full h-full object-cover" alt="Equip" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-1 overflow-hidden w-full">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{t.workout.identified}</span>
                <div className="size-1 bg-apple-blue rounded-full"></div>
                <span className="text-[10px] font-black text-apple-blue uppercase tracking-widest">{currentRoutine.suggestedIntensity || 'Moderate'}</span>
                {isLanguageMismatch && (
                  <div className="flex items-center gap-1.5 ms-1 bg-orange-500/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-orange-500/30">
                    <span className="material-symbols-rounded text-[10px] text-orange-400 font-black">translate</span>
                    <span className="text-[8px] font-black text-orange-400 uppercase tracking-tighter leading-none">{t.workout.langMismatch}</span>
                  </div>
                )}
              </div>
              {isEditing ? (
                <input type="text" value={baselineRoutine.equipmentName} onChange={(e) => updateEquipmentName(e.target.value)} className="w-full bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-2xl px-5 py-3 text-2xl md:text-4xl font-black text-white focus:outline-none focus:border-apple-blue/50 focus:ring-4 focus:ring-apple-blue/10 ios-transition shadow-2xl" />
              ) : (
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none break-words drop-shadow-lg uppercase">{currentRoutine.equipmentName}</h2>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          {!isEditing && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-1 mb-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black tracking-tight dark:text-white uppercase">
                  {t.workout.intensityTitle}
                  {!settings.isPro && <span className="ms-3 text-[9px] bg-yellow-400 text-black px-2 py-0.5 rounded-full font-black">PRO FEATURE</span>}
                </h3>
                <p className="text-[10px] font-black text-apple-gray uppercase tracking-widest">Adjust volume based on your capacity</p>
              </div>
              <IntensityGauge activeId={intensityId} isPro={settings.isPro} onChange={handleIntensityChange} />
            </div>
          )}

          <div className="space-y-4 relative">
            {currentRoutine.exercises.map((ex, idx) => (
              <div key={ex.id} onPointerEnter={() => handlePointerEnterCard(idx)} className={`bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-ios border border-black/5 dark:border-white/10 flex flex-col md:flex-row gap-6 relative group overflow-hidden transition-all duration-300 ease-out ${draggedIdx === idx ? 'opacity-30 scale-[0.97] border-apple-blue/50 shadow-none z-0' : 'opacity-100 z-10'}`}>
                {isEditing && (
                  <div onPointerDown={() => handlePointerDown(idx)} className="absolute inset-s-0 top-0 bottom-0 w-12 bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-center border-e border-black/[0.05] dark:border-white/[0.05] cursor-grab active:cursor-grabbing hover:bg-apple-blue/5 transition-colors z-30">
                    <span className="material-symbols-rounded text-apple-gray group-hover:text-apple-blue transition-colors pointer-events-none select-none">drag_indicator</span>
                  </div>
                )}
                <div className={`flex-grow space-y-4 overflow-hidden ${isEditing ? 'ps-10' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 w-full">
                      <div className="flex items-center gap-3">
                        <span className="size-6 rounded-full bg-apple-blue text-white text-[10px] font-black flex items-center justify-center shrink-0">{idx + 1}</span>
                        {isEditing ? (
                          <input type="text" value={ex.name} onChange={(e) => updateExercise(idx, 'name', e.target.value)} className="w-full bg-apple-bg dark:bg-[#2C2C2E] border-2 border-black/[0.05] dark:border-white/10 rounded-2xl px-4 py-2 text-lg font-black dark:text-white focus:outline-none focus:border-apple-blue/50 focus:ring-4 focus:ring-apple-blue/10 ios-transition" />
                        ) : (
                          <h4 className="text-xl font-black tracking-tight dark:text-white leading-tight break-words uppercase">{ex.name}</h4>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="flex flex-wrap gap-2 ps-9">
                          <span className="text-[9px] font-black bg-apple-bg dark:bg-white/5 dark:text-apple-gray px-2 py-1 rounded-md uppercase tracking-widest">{t.workout.exerciseLabel}: {ex.weight || t.workout.bodyweight}</span>
                          <span className="text-[9px] font-black bg-apple-bg dark:bg-white/5 dark:text-apple-gray px-2 py-1 rounded-md uppercase tracking-widest">{t.workout.rest}: {ex.rest}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isEditing ? (
                    <textarea value={ex.instructions} onChange={(e) => updateExercise(idx, 'instructions', e.target.value)} className="w-full bg-apple-bg dark:bg-[#2C2C2E] border-2 border-black/[0.05] dark:border-white/10 rounded-2xl px-4 py-3 text-sm font-medium dark:text-apple-gray focus:outline-none focus:border-apple-blue/50 focus:ring-4 focus:ring-apple-blue/10 ios-transition min-h-[100px] leading-relaxed" />
                  ) : (
                    <p className="text-sm font-medium text-apple-label dark:text-apple-gray/80 leading-relaxed ps-9 break-words">{ex.instructions}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-3 shrink-0 md:w-36">
                   <div className="p-4 rounded-[2rem] flex flex-col items-center justify-center text-center bg-apple-bg dark:bg-[#2C2C2E]">
                      <span className="text-[8px] font-black text-apple-gray uppercase tracking-widest mb-1">{t.workout.sets}</span>
                      {isEditing ? (
                        <input type="text" value={ex.sets} onChange={(e) => updateExercise(idx, 'sets', e.target.value)} className="w-full bg-transparent text-center text-xl font-black dark:text-white focus:outline-none placeholder:text-apple-gray/30 p-0 border-none ring-0 shadow-none focus:ring-0 focus:border-none" placeholder="Sets" />
                      ) : (
                        <span className="text-2xl font-black text-apple-text dark:text-white tracking-tighter uppercase">{formatSmartDisplay(ex.sets, settings.units)}</span>
                      )}
                   </div>
                   <div className={`p-4 rounded-[2rem] flex flex-col items-center justify-center text-center ${isEditing ? 'bg-apple-blue/5' : 'bg-apple-blue/10'}`}>
                      <span className="text-[8px] font-black text-apple-blue uppercase tracking-widest mb-1">{t.workout.reps}</span>
                      {isEditing ? (
                        <input type="text" value={ex.reps} onChange={(e) => updateExercise(idx, 'reps', e.target.value)} className="w-full bg-transparent text-center text-xl font-black text-apple-blue focus:outline-none placeholder:text-apple-blue/30 p-0 border-none ring-0 shadow-none focus:ring-0 focus:border-none" placeholder="Reps" />
                      ) : (
                        <span className="text-2xl font-black text-apple-blue tracking-tighter uppercase">{formatSmartDisplay(ex.reps, settings.units)}</span>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <section className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group inner-glow">
            <div className="absolute top-0 inset-e-0 size-32 bg-apple-blue/10 dark:bg-apple-blue/30 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 rtl:-translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-apple-blue flex items-center justify-center text-white shadow-lg">
                   <span className="material-symbols-rounded font-black text-xl">timer</span>
                </div>
                <div className="flex flex-col -space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-apple-gray dark:text-white/40">Estimated</span>
                  <span className="text-xl font-black text-apple-text dark:text-white uppercase tracking-tight">{currentRoutine.estimatedDuration}</span>
                </div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-apple-gray dark:text-white/30">{t.workout.safetyTitle}</h4>
                 <ul className="space-y-3">
                   {currentRoutine.safetyTips.map((tip, i) => (
                     <li key={i} className="flex gap-3 text-xs font-bold leading-relaxed text-apple-label dark:text-white/80 uppercase tracking-tight">
                       <span className="material-symbols-rounded text-apple-blue text-sm">shield</span>
                       {tip}
                     </li>
                   ))}
                 </ul>
              </div>
              <div className="pt-6 border-t border-black/5 dark:border-white/10 flex flex-col gap-3">
                 {!isEditing && (
                   <button onClick={() => setIsActiveMode(true)} className="w-full bg-apple-blue text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg ios-transition active:scale-95 flex items-center justify-center gap-3 ring-2 ring-apple-blue/20">
                      <span className="material-symbols-rounded fill-1">play_arrow</span>
                      {t.workout.startTraining}
                   </button>
                 )}
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleEditToggle} className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest ios-transition flex items-center justify-center gap-2 border shadow-sm ${isEditing ? 'bg-green-500 text-white border-green-400' : 'bg-black/5 dark:bg-[#2C2C2E] text-apple-text dark:text-white border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-[#3A3A3C]'}`}>
                      <span className="material-symbols-rounded text-sm">{isEditing ? 'check_circle' : 'edit'}</span>
                      {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button onClick={() => { soundService.playTap(); setShowShareStudio(true); }} className="py-4 rounded-2xl bg-black/5 dark:bg-[#2C2C2E] hover:bg-black/10 dark:hover:bg-[#3A3A3C] text-apple-text dark:text-white border border-black/5 dark:border-white/5 font-black text-[10px] uppercase tracking-widest ios-transition flex items-center justify-center gap-3 active:scale-95 group transition-all">
                      <span className="material-symbols-rounded text-lg group-hover:scale-110 transition-transform leading-none">share</span>
                      <div className="flex flex-col items-start leading-[1.1]">
                        {t.workout.shareBtn.split(' ').map((word, i) => <span key={i} className="block">{word}</span>)}
                      </div>
                    </button>
                 </div>
                 <div className={`flex items-center w-full transition-all duration-500 overflow-hidden ${sessionSavedId ? 'gap-3' : 'gap-0'}`}>
                    <button onClick={handleSaveClick} className={`h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest ios-transition flex items-center justify-center gap-2 border transition-all duration-500 ease-in-out ${sessionSavedId ? 'bg-green-600/20 text-green-600 dark:text-green-400 border-green-500/20 flex-grow-[2]' : 'bg-black/5 dark:bg-[#2C2C2E] hover:bg-black/10 dark:hover:bg-[#3A3A3C] text-apple-text dark:text-white border-black/5 dark:border-white/5 flex-grow'}`}>
                       <span className="material-symbols-rounded text-sm">{sessionSavedId ? 'bookmark_added' : 'bookmark_add'}</span>
                       {sessionSavedId ? 'Saved' : 'Save'}
                    </button>
                    <div className={`transition-all duration-500 ease-in-out flex items-center ${sessionSavedId ? 'w-14 opacity-100 scale-100' : 'w-0 opacity-0 scale-50 pointer-events-none'}`}>
                      <button onClick={toggleFavorite} className={`size-14 rounded-2xl flex items-center justify-center ios-transition border-2 shrink-0 ${isFavorited ? 'bg-yellow-400 border-yellow-200 text-white shadow-[0_0_20px_rgba(250,204,21,0.4)]' : 'bg-black/5 dark:bg-[#2C2C2E] border-black/5 dark:border-white/20 text-apple-text dark:text-white hover:bg-yellow-400/10'}`}>
                         <span className={`material-symbols-rounded text-[22px] leading-none transition-all duration-300 ${isFavorited ? 'fill-1 scale-125' : 'scale-100'}`}>star</span>
                      </button>
                    </div>
                 </div>
                 <button onClick={onReset} className="w-full bg-red-500/5 hover:bg-red-500/10 text-red-500 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest ios-transition flex items-center justify-center gap-2 border border-red-500/10 mt-2">
                    <span className="material-symbols-rounded text-sm">logout</span>
                    {t.workout.exitBtn}
                 </button>
              </div>
            </div>
          </section>
          
          {!settings.isPro && (
             <div onClick={onUpgrade} className="w-full p-6 rounded-[2rem] bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-lg cursor-pointer hover:scale-[1.02] transition-transform animate-float">
                <div className="flex items-center gap-4">
                   <div className="size-10 bg-black/10 rounded-full flex items-center justify-center">
                      <span className="material-symbols-rounded font-black">diamond</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Unlock Pro</span>
                      <span className="text-sm font-black uppercase">Get High-Intensity Plans</span>
                   </div>
                   <span className="material-symbols-rounded ms-auto">arrow_forward_ios</span>
                </div>
             </div>
          )}

          <button onClick={() => setShowDisclaimer(true)} className="w-full py-4 rounded-2xl border-2 border-dashed border-apple-gray/20 dark:border-white/10 text-apple-gray font-black text-[10px] uppercase tracking-widest hover:border-apple-blue/40 hover:text-apple-blue transition-colors">
            {t.workout.legalDisclaimerBtn}
          </button>
        </div>
      </div>

      {showDisclaimer && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowDisclaimer(false)}>
          <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6 animate-spring" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
               <h4 className="text-sm font-black uppercase tracking-widest text-apple-text dark:text-white">{t.workout.legalModalTitle}</h4>
               <button onClick={() => setShowDisclaimer(false)} className="size-8 rounded-full bg-apple-bg dark:bg-white/10 flex items-center justify-center text-apple-gray hover:text-apple-text">
                  <span className="material-symbols-rounded">close</span>
               </button>
            </div>
            <div className="space-y-4 text-[12px] leading-relaxed text-apple-label dark:text-apple-gray font-medium">
              {t.workout.legalBody.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <button onClick={() => setShowDisclaimer(false)} className="w-full bg-apple-blue text-white py-3 rounded-2xl font-bold text-sm">{t.workout.legalUnderstand}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutRoutineDisplay;
