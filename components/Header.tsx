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
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('analyzer')}>
        <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-ios border border-black/5 overflow-hidden">
          <img src="assets/Branding/SVG/Full_logo_Icon.svg" className="w-full h-full object-cover p-1" alt="Logo" />
        </div>
        <div className="flex flex-col -space-y-1">
          <span className="font-black text-sm tracking-tight text-apple-text dark:text-white uppercase">{t.common.appName}</span>
          <span className="text-[10px] font-bold text-vizofit-accent/60 uppercase tracking-widest">{t.common.appVersion}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            soundService.playTap();
            onNavigate(view === 'settings' ? 'analyzer' : 'settings');
          }}
          className={`size-10 rounded-full flex items-center justify-center ios-transition active:scale-90 border no-print ${view === 'settings' ? 'bg-vizofit-accent text-apple-text border-vizofit-accent' : 'bg-white dark:bg-white/10 text-apple-gray dark:text-apple-gray border-black/5 dark:border-white/10 hover:text-vizofit-accent shadow-sm'}`}
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
