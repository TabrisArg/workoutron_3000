
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import WorkoutRoutineDisplay from './components/WorkoutRoutineDisplay';
import SavedWorkouts from './components/SavedWorkouts';
import ActivityCalendar from './components/ActivityCalendar';
import Settings from './components/Settings';
import { analyzeEquipment } from './services/geminiService';
import { WorkoutRoutine, AppStatus, SavedWorkout, UserSettings } from './types';
import { compressBase64 } from './utils/imageUtils';
import { soundService } from './utils/soundService';
import { getStringsByLanguage } from './strings';
import { isSimilarName } from './utils/stringUtils';

interface ResolutionWrapper { callback: (mode: 'new' | 'overwrite') => void; }

const getSystemLanguage = (): UserSettings['language'] => {
  const navLang = navigator.language.split('-')[0];
  const supported: UserSettings['language'][] = ['en', 'es', 'fr', 'de', 'pt', 'ru', 'hi', 'ar'];
  return supported.includes(navLang as any) ? (navLang as UserSettings['language']) : 'en';
};

const ConfettiBurst: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: string; delay: string; color: string; duration: string }>>([]);
  useEffect(() => {
    const colors = ['#007AFF', '#5856D6', '#FF2D55', '#FFCC00', '#34C759'];
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 1}s`, color: colors[Math.floor(Math.random() * colors.length)], duration: `${1.5 + Math.random() * 2}s`,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] overflow-hidden">
      {particles.map(p => <div key={p.id} className="vfx-confetti" style={{ left: p.left, backgroundColor: p.color, animationDelay: p.delay, animationDuration: p.duration, top: '-20px' }} />)}
    </div>
  );
};


const App: React.FC = () => {
  const [view, setView] = useState<'analyzer' | 'library' | 'activity' | 'settings'>('analyzer');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [routine, setRoutine] = useState<WorkoutRoutine | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showProModal, setShowProModal] = useState(false);

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('vizofit_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { appearance: 'system', language: getSystemLanguage(), isPro: true, ...parsed };
      } catch (e) { console.error("Failed to parse settings", e); }
    }
    return { units: 'metric', isMuted: false, language: getSystemLanguage(), appearance: 'system', isPro: true };
  });

  const t = useMemo(() => getStringsByLanguage(settings.language), [settings.language]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedRoutine, setCompletedRoutine] = useState<WorkoutRoutine | null>(null);
  const [modalSavedId, setModalSavedId] = useState<string | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingRoutine, setPendingRoutine] = useState<{ routine: WorkoutRoutine, image: string } | null>(null);
  const [showLegalLanding, setShowLegalLanding] = useState(false);

  useEffect(() => {
    const applyAppearance = () => {
      const isDark = settings.appearance === 'dark' || (settings.appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) { document.documentElement.classList.add('dark'); document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#000000'); }
      else { document.documentElement.classList.remove('dark'); document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff'); }
    };
    applyAppearance();
    localStorage.setItem('vizofit_settings', JSON.stringify(settings));
    soundService.setEnabled(!settings.isMuted);
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => { if (settings.appearance === 'system') applyAppearance(); };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [settings]);

  const handleUpdateSettings = (newSettings: UserSettings) => setSettings(newSettings);
  const handleNav = (target: 'analyzer' | 'library' | 'activity' | 'settings') => { soundService.playNav(); if (target === 'analyzer' && view !== 'analyzer') { resetApp(); } setView(target); };

  const handleImageSelected = useCallback(async (base64: string) => {
    setStatus(AppStatus.ANALYZING);
    setError(null);
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    setImagePreview(dataUrl);
    setActiveWorkoutId(null);
    try {
      const result = await analyzeEquipment(base64, settings.units, settings.language);
      setRoutine(result);
      setStatus(AppStatus.SUCCESS);
      soundService.playSuccess();

      const library = JSON.parse(localStorage.getItem('vizofit_library') || '[]');
      const duplicate = library.find((s: SavedWorkout) => isSimilarName(s.routine.equipmentName, result.equipmentName));

      if (duplicate) {
        setPendingRoutine({ routine: result, image: dataUrl });
        setShowConflictModal(true);
        // We don't auto-save if it's a potential duplicate, we wait for user choice
      } else {
        const targetId = Date.now().toString();
        setActiveWorkoutId(targetId);
        setTimeout(async () => {
          try {
            const compressedImg = await compressBase64(dataUrl);
            const freshLibrary = JSON.parse(localStorage.getItem('vizofit_library') || '[]');
            const newSaved: SavedWorkout = { id: targetId, date: new Date().toLocaleDateString(), routine: JSON.parse(JSON.stringify(result)), imagePreview: compressedImg, isFavorited: false };
            localStorage.setItem('vizofit_library', JSON.stringify([newSaved, ...freshLibrary]));
          } catch (e) { console.error("Background auto-save failed", e); }
        }, 50);
      }
    } catch (err: any) { setError(err.message || "Failed to analyze equipment."); setStatus(AppStatus.ERROR); }
  }, [settings.units, settings.language]);

  const resetApp = () => { setStatus(AppStatus.IDLE); setRoutine(null); setImagePreview(null); setActiveWorkoutId(null); setError(null); setShowCompletionModal(false); setModalSavedId(null); setShowConflictModal(false); };
  const handleWorkoutComplete = (finalRoutine: WorkoutRoutine, savedId: string | null) => { setCompletedRoutine(finalRoutine); setModalSavedId(savedId); setShowCompletionModal(true); };
  const toggleSaveInModal = async () => {
    if (!completedRoutine) return;
    const existing = JSON.parse(localStorage.getItem('vizofit_library') || '[]');
    if (modalSavedId) { soundService.playDelete(); const updated = existing.filter((s: SavedWorkout) => s.id !== modalSavedId); localStorage.setItem('vizofit_library', JSON.stringify(updated)); setModalSavedId(null); setActiveWorkoutId(null); }
    else {
      soundService.playTriumphant();
      try {
        const compressedImg = imagePreview ? await compressBase64(imagePreview) : null;
        const newId = Date.now().toString();
        const newSaved: SavedWorkout = { id: newId, date: new Date().toLocaleDateString(), routine: JSON.parse(JSON.stringify(completedRoutine)) as WorkoutRoutine, imagePreview: compressedImg, isFavorited: false };
        localStorage.setItem('vizofit_library', JSON.stringify([newSaved, ...existing]));
        setModalSavedId(newId); setActiveWorkoutId(newId);
      } catch (err: any) { console.error("Save error", err); }
    }
  };

  const handleUpdateExisting = async () => {
    if (!pendingRoutine) return;
    soundService.playTriumphant();
    const library = JSON.parse(localStorage.getItem('vizofit_library') || '[]');
    const index = library.findIndex((s: SavedWorkout) => s.routine.equipmentName.toLowerCase() === pendingRoutine.routine.equipmentName.toLowerCase());
    if (index !== -1) {
      const compressedImg = await compressBase64(pendingRoutine.image);
      library[index] = { ...library[index], routine: JSON.parse(JSON.stringify(pendingRoutine.routine)), imagePreview: compressedImg, date: new Date().toLocaleDateString() };
      localStorage.setItem('vizofit_library', JSON.stringify(library));
      setActiveWorkoutId(library[index].id);
    }
    setShowConflictModal(false);
    setPendingRoutine(null);
  };

  const handleSaveNew = async () => {
    if (!pendingRoutine) return;
    soundService.playTriumphant();
    const library = JSON.parse(localStorage.getItem('vizofit_library') || '[]');
    const targetId = Date.now().toString();
    const compressedImg = await compressBase64(pendingRoutine.image);
    const newSaved: SavedWorkout = { id: targetId, date: new Date().toLocaleDateString(), routine: JSON.parse(JSON.stringify(pendingRoutine.routine)), imagePreview: compressedImg, isFavorited: false };
    localStorage.setItem('vizofit_library', JSON.stringify([newSaved, ...library]));
    setActiveWorkoutId(targetId);
    setShowConflictModal(false);
    setPendingRoutine(null);
  };

  const handleUpgrade = () => {
    soundService.playTriumphant();
    setSettings(prev => ({ ...prev, isPro: true }));
    setShowProModal(false);
  };

  return (
    <>
      <div className={`min-h-screen flex flex-col bg-apple-bg dark:bg-[#000000] overflow-x-hidden relative ${settings.language === 'ar' ? 'font-sans' : ''}`}>
        <div className="w-full max-w-6xl mx-auto flex flex-col flex-grow">
          <Header view={view} onNavigate={handleNav} settings={settings} t={t} />
          <main className="flex-grow px-5 pb-32 pt-6 overflow-y-auto">
            <div key={view} className="animate-reveal h-full">
              {view === 'library' ? (
                <SavedWorkouts t={t} onSelect={(w) => { soundService.playTap(); setRoutine(w.routine); setImagePreview(w.imagePreview); setActiveWorkoutId(w.id); setView('analyzer'); setStatus(AppStatus.SUCCESS); }} />
              ) : view === 'activity' ? (
                <ActivityCalendar t={t} />
              ) : view === 'settings' ? (
                <Settings settings={settings} onUpdateSettings={handleUpdateSettings} onBack={() => setView('analyzer')} t={t} />
              ) : (
                <div className="space-y-8">
                  {status !== AppStatus.SUCCESS ? (
                    <div className="space-y-8 w-full max-w-lg mx-auto">
                      <ImageUploader onImageSelected={handleImageSelected} isLoading={status === AppStatus.ANALYZING} t={t} />
                      {status === AppStatus.IDLE && (
                        <div className="flex flex-col items-center gap-3 animate-reveal stagger-3">
                          <button onClick={() => { soundService.playTap(); setShowLegalLanding(true); }} className="text-[10px] font-black text-apple-gray/50 hover:text-apple-blue uppercase tracking-widest ios-transition flex items-center gap-1.5"><span className="material-symbols-rounded text-base">info</span>{t.uploader.legalInfo}</button>
                          {showLegalLanding && (
                            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => { soundService.playCancel(); setShowLegalLanding(false); }}>
                              <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-3xl shadow-2xl max-w-lg w-full space-y-6 animate-spring" onClick={e => e.stopPropagation()}>
                                <div className="flex justify-between items-center"><h4 className="text-sm font-black uppercase tracking-widest text-apple-text dark:text-white">{t.workout.legalModalTitle}</h4><button onClick={() => { soundService.playCancel(); setShowLegalLanding(false); }} className="size-8 rounded-full bg-apple-bg dark:bg-white/10 flex items-center justify-center text-apple-gray hover:text-apple-text"><span className="material-symbols-rounded">close</span></button></div>
                                <div className="space-y-4 text-[12px] leading-relaxed text-apple-label dark:text-apple-gray font-medium">{t.workout.legalBody.map((p, i) => <p key={i}>{p}</p>)}</div>
                                <button onClick={() => { soundService.playTap(); setShowLegalLanding(false); }} className="w-full bg-apple-blue text-white py-3 rounded-2xl font-bold text-sm">{t.workout.legalUnderstand}</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {status === AppStatus.ERROR && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 p-6 rounded-ios flex items-center gap-4 text-red-600 animate-spring">
                          <div className="size-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center"><span className="material-symbols-rounded font-bold">error</span></div>
                          <p className="font-bold text-sm leading-snug">{error}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    routine && <WorkoutRoutineDisplay routine={routine} imagePreview={imagePreview} initialSavedId={activeWorkoutId} settings={settings} t={t} onReset={() => { soundService.playCancel(); resetApp(); }} onComplete={handleWorkoutComplete} onUpgrade={() => { }} onDuplicateDetected={(r, img) => { setPendingRoutine({ routine: r, image: img || '' }); setShowConflictModal(true); }} />
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pb-10 px-6 pointer-events-none">
          <div className="glass-card flex items-center justify-between gap-4 px-4 py-3 rounded-full w-full max-w-md pointer-events-auto">
            <button onClick={() => handleNav('library')} className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-full ios-transition group ${view === 'library' ? 'text-vizofit-accent' : 'text-apple-gray dark:text-apple-gray hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <span className={`material-symbols-rounded text-3xl ios-transition ${view === 'library' ? 'scale-105' : 'group-active:scale-95'}`}>grid_view</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.nav.library}</span>
            </button>
            <button onClick={() => handleNav('analyzer')} className={`size-16 rounded-full flex items-center justify-center ios-transition relative z-50 overflow-hidden ${view === 'analyzer' && status === AppStatus.IDLE ? 'bg-vizofit-accent text-apple-text shadow-ios-deep scale-105' : 'bg-white dark:bg-[#2C2C2E] text-vizofit-accent border-2 border-vizofit-accent/20 shadow-ios'}`}>
              <span className={`material-symbols-rounded text-4xl font-black relative z-10 ios-transition ${view === 'analyzer' && status === AppStatus.IDLE ? 'rotate-90' : 'rotate-0'}`}>add</span>
            </button>
            <button onClick={() => handleNav('activity')} className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-full ios-transition group ${view === 'activity' ? 'text-vizofit-accent' : 'text-apple-gray dark:text-apple-gray hover:bg-black/5 dark:hover:bg-white/5'}`}>
              <span className={`material-symbols-rounded text-3xl ios-transition ${view === 'activity' ? 'scale-105' : 'group-active:scale-95'}`}>history</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.nav.history}</span>
            </button>
          </div>
        </nav>
      </div>

      {showCompletionModal && (
        <>
          <ConfettiBurst />
          <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#1C1C1E] p-8 md:p-10 max-w-sm w-[90%] rounded-ios-lg shadow-2xl text-center space-y-8 animate-spring relative overflow-hidden">
              <div className="size-20 bg-green-100 dark:bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-green-50 dark:ring-green-500/5 animate-glow-success"><span className="material-symbols-rounded text-4xl font-bold">celebration</span></div>
              <div className="space-y-2"><h2 className="text-2xl font-bold tracking-tight text-apple-text dark:text-white">{t.modals.completeTitle}</h2><p className="text-apple-gray font-medium text-base leading-snug px-2">{t.modals.completeDesc}</p></div>
              <div className="space-y-4">
                {!modalSavedId ? <button onClick={toggleSaveInModal} className="w-full bg-vizofit-accent/10 dark:bg-vizofit-accent/20 text-apple-text dark:text-vizofit-accent py-3.5 rounded-ios font-bold text-sm ios-transition active:scale-95 flex items-center justify-center gap-3 border border-vizofit-accent/10"><span className="material-symbols-rounded text-2xl">bookmark_add</span> {t.modals.saveBtn}</button> : <div onClick={toggleSaveInModal} className="w-full bg-vizofit-accent/10 dark:bg-vizofit-accent/30 text-apple-text dark:text-vizofit-accent py-3.5 rounded-ios font-bold text-sm flex items-center justify-center gap-3 animate-reveal cursor-pointer border border-vizofit-accent/20 dark:border-vizofit-accent/40 shadow-[0_0_15px_rgba(12,244,227,0.15)]"><span className="material-symbols-rounded text-2xl">bookmark_added</span> {t.modals.savedBtn}</div>}
                <button onClick={() => { soundService.playTap(); setShowCompletionModal(false); }} className="w-full bg-vizofit-accent text-apple-text py-4 rounded-ios font-bold text-lg shadow-lg ios-transition active:scale-95 active:shadow-sm">{t.common.done}</button>
              </div>
            </div>
          </div>
        </>
      )}
      {showConflictModal && pendingRoutine && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1C1C1E] p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full space-y-8 animate-spring text-center border border-white/10 relative overflow-hidden">
            <div className="size-20 bg-apple-blue/10 text-apple-blue rounded-full flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-rounded text-4xl font-black">copy_all</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight dark:text-white uppercase">{t.modals.duplicateTitle}</h3>
              <p className="text-apple-gray text-sm font-bold opacity-80 leading-snug">{t.modals.duplicateDesc.replace('{name}', pendingRoutine.routine.equipmentName)}</p>
            </div>
            <div className="space-y-3 pt-4">
              <button onClick={handleUpdateExisting} className="w-full bg-apple-blue text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3">
                <span className="material-symbols-rounded text-lg">edit_note</span>
                {t.modals.updateExisting}
              </button>
              <button onClick={handleSaveNew} className="w-full bg-apple-bg dark:bg-white/5 dark:text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-transform border border-black/5 dark:border-white/10 flex items-center justify-center gap-3">
                <span className="material-symbols-rounded text-lg">add_circle</span>
                {t.modals.saveNew}
              </button>
              <button onClick={() => { soundService.playCancel(); setShowConflictModal(false); setPendingRoutine(null); }} className="w-full py-4 text-apple-gray font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors uppercase">{t.common.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default App;
