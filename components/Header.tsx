import React from 'react';
import { UserSettings } from '../types';
import { soundService } from '../utils/soundService';
import { TranslationSchema } from '../i18n/types';

interface HeaderProps {
  view: 'analyzer' | 'library' | 'activity' | 'settings';
  onNavigate: (view: 'analyzer' | 'library' | 'activity' | 'settings') => void;
  settings: UserSettings;
  t: TranslationSchema;
}

const Header: React.FC<HeaderProps> = ({ view, onNavigate, settings, t }) => {
  return (
    <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-[100] bg-apple-bg/80 dark:bg-black/80 backdrop-blur-md border-b border-black/[0.03] dark:border-white/10">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('analyzer')}>
        <div className="size-8 rounded-lg bg-apple-blue flex items-center justify-center text-white shadow-sm ring-4 ring-apple-blue/10">
          <span className="material-symbols-rounded text-lg font-bold">fitness_center</span>
        </div>
        <div className="flex flex-col -space-y-1">
           <span className="font-black text-sm tracking-tight text-apple-text dark:text-white uppercase">{t.common.appName}</span>
           <span className="text-[10px] font-bold text-apple-blue/60 uppercase tracking-widest">{t.common.appVersion}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            soundService.playTap();
            onNavigate(view === 'settings' ? 'analyzer' : 'settings');
          }}
          className={`size-10 rounded-full flex items-center justify-center ios-transition active:scale-90 border no-print ${view === 'settings' ? 'bg-apple-blue text-white border-apple-blue' : 'bg-white dark:bg-white/10 text-apple-gray dark:text-apple-gray border-black/5 dark:border-white/10 hover:text-apple-blue shadow-sm'}`}
          title={t.header.settings}
        >
          <span className="material-symbols-rounded text-2xl font-bold">
            {view === 'settings' ? 'close' : 'settings'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Header;