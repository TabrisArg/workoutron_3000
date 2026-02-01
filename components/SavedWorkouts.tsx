import React, { useState, useEffect, useMemo } from 'react';
import { SavedWorkout } from '../types';
import { soundService } from '../utils/soundService';
import { TranslationSchema } from '../i18n/types';

interface SavedWorkoutsProps {
  onSelect: (workout: SavedWorkout) => void;
  t: TranslationSchema;
}

const SavedWorkouts: React.FC<SavedWorkoutsProps> = ({ onSelect, t }) => {
  const [saved, setSaved] = useState<SavedWorkout[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('equipfit_saved');
    if (raw) setSaved(JSON.parse(raw));
  }, []);

  const saveToStorage = (updated: SavedWorkout[]) => {
    localStorage.setItem('equipfit_saved', JSON.stringify(updated));
    setSaved(updated);
  };

  const deleteWorkout = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.playSad();
    const updated = saved.filter(s => s.id !== id);
    saveToStorage(updated);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const workout = saved.find(s => id === s.id);
    if (workout) {
      if (!workout.isFavorited) soundService.playFavorite();
      else soundService.playSad();
    }
    const updated = saved.map(s => {
      if (s.id === id) {
        const isFavoriting = !s.isFavorited;
        return {
          ...s,
          isFavorited: isFavoriting,
          favoritedAt: isFavoriting ? new Date().toISOString() : undefined
        };
      }
      return s;
    });
    saveToStorage(updated);
  };

  const sortedAndFiltered = useMemo(() => {
    const filtered = saved.filter(s => 
      s.routine.equipmentName.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (a.isFavorited && !b.isFavorited) return -1;
      if (!a.isFavorited && b.isFavorited) return 1;
      
      if (a.isFavorited && b.isFavorited) {
        const dateA = a.favoritedAt ? new Date(a.favoritedAt).getTime() : 0;
        const dateB = b.favoritedAt ? new Date(b.favoritedAt).getTime() : 0;
        return dateB - dateA;
      }
      
      return b.id.localeCompare(a.id);
    });
  }, [saved, search]);

  if (saved.length === 0) {
    return (
      <div className="text-center py-24 flex flex-col items-center animate-spring w-full">
        <div className="size-24 bg-white dark:bg-[#1C1C1E] rounded-full flex items-center justify-center mb-8 border border-black/[0.03] dark:border-white/5 shadow-sm animate-float">
          <span className="material-symbols-rounded text-6xl text-apple-gray/40 font-light">folder_open</span>
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-3 text-apple-text dark:text-white">{t.library.noRoutinesTitle}</h3>
        <p className="text-apple-gray font-bold text-sm px-8 max-w-[280px] leading-relaxed dark:text-apple-gray/80">{t.library.noRoutinesDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 w-full">
      <div className="space-y-4 animate-reveal max-w-2xl">
        <h2 className="text-4xl font-black tracking-tight dark:text-white">{t.library.title}</h2>
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-rounded text-apple-gray text-2xl group-focus-within:text-apple-blue transition-colors z-10">search</span>
          <input 
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1C1C1E] dark:text-white rounded-ios border-none shadow-sm focus:ring-4 focus:ring-apple-blue/10 text-lg font-medium placeholder:text-apple-gray/50 ios-transition relative" 
            placeholder={t.library.searchPlaceholder} 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {sortedAndFiltered.map((workout, i) => (
          <div 
            key={workout.id}
            onClick={() => onSelect(workout)}
            className={`group relative bg-white dark:bg-[#1C1C1E] rounded-ios-lg overflow-hidden shadow-sm hover:shadow-ios-card hover:-translate-y-0.5 ios-transition cursor-pointer border border-black/5 dark:border-white/10 animate-reveal stagger-${(i % 5) + 1} vfx-glow-border`}
          >
            <div className="relative aspect-square bg-apple-bg dark:bg-[#2C2C2E] overflow-hidden">
              {workout.imagePreview ? (
                <img 
                  src={workout.imagePreview} 
                  className="w-full h-full object-cover group-hover:scale-110 ios-transition duration-500" 
                  alt={workout.routine.equipmentName}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-rounded text-5xl text-apple-gray/20">fitness_center</span>
                </div>
              )}
              
              <button 
                onClick={(e) => toggleFavorite(workout.id, e)}
                className={`absolute top-3 left-3 size-11 rounded-full flex items-center justify-center shadow-2xl border-2 z-20 transition-all duration-300 ${workout.isFavorited ? 'bg-yellow-400 text-white border-yellow-200 scale-105' : 'bg-white/90 dark:bg-black/60 backdrop-blur-md text-apple-text dark:text-white border-apple-blue/10 hover:bg-yellow-400 hover:text-white dark:border-white/10'}`}
                title={workout.isFavorited ? t.library.favRemove : t.library.favAdd}
              >
                <span className={`material-symbols-rounded text-[22px] leading-none ${workout.isFavorited ? 'fill-1 drop-shadow-md' : ''}`} style={{ fontVariationSettings: `'FILL' ${workout.isFavorited ? 1 : 0}` }}>
                  star
                </span>
              </button>

              <button 
                onClick={(e) => deleteWorkout(workout.id, e)}
                className="absolute top-3 right-3 size-11 bg-white/90 dark:bg-black/60 backdrop-blur-md text-apple-text dark:text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-red-500/10 dark:border-white/10 hover:bg-red-500 hover:text-white hover:scale-110 active:scale-90 z-20 transition-all duration-200"
                title={t.library.removeTitle}
              >
                <span className="material-symbols-rounded text-[22px] font-bold select-none leading-none">close</span>
              </button>

              <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-apple-blue uppercase opacity-80">{workout.date}</span>
                {workout.isFavorited && (
                  <span className="material-symbols-rounded text-yellow-500 text-sm fill-1">star</span>
                )}
              </div>
              <h3 className="font-bold text-base tracking-tight truncate leading-tight dark:text-white">{workout.routine.equipmentName}</h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {workout.routine.targetMuscles.slice(0, 2).map((m, mIdx) => (
                  <span key={mIdx} className="text-[8px] px-2 py-0.5 rounded-full bg-apple-bg dark:bg-white/5 text-apple-label dark:text-apple-gray font-black uppercase tracking-tighter border border-black/[0.03] dark:border-white/5">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedWorkouts;