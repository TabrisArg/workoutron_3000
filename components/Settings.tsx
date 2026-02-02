
import React, { useState, useRef, useEffect } from 'react';
import { UserSettings } from '../types';
import { soundService } from '../utils/soundService';
import { TranslationSchema } from '../i18n/types';

interface SettingsProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onBack: () => void;
  t: TranslationSchema;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings, onBack, t }) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleUnits = (units: 'metric' | 'imperial') => {
    if (settings.units === units) return;
    soundService.playTap();
    onUpdateSettings({ ...settings, units });
  };

  const setAppearance = (appearance: UserSettings['appearance']) => {
    if (settings.appearance === appearance) return;
    soundService.playTap();
    onUpdateSettings({ ...settings, appearance });
  };

  const handleLanguageChange = (lang: UserSettings['language']) => {
    if (settings.language === lang) {
      setIsLangOpen(false);
      return;
    }
    soundService.playTap();
    onUpdateSettings({ ...settings, language: lang });
    setIsLangOpen(false);
  };

  const toggleMute = () => {
    const nextMute = !settings.isMuted;
    if (!nextMute) {
      soundService.setEnabled(true);
      soundService.playPlayful();
    } else {
      soundService.playSad();
    }
    onUpdateSettings({ ...settings, isMuted: nextMute });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="max-w-2xl mx-auto w-full space-y-10 py-6 animate-reveal px-2">
      <div className="space-y-1 px-1">
        <h2 className="text-3xl font-black tracking-tight text-apple-text dark:text-white">{t.settings.title}</h2>
        <p className="text-apple-gray font-bold text-sm tracking-tight">{t.settings.subtitle}</p>
      </div>

      <div className="space-y-6">
        <section className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-ios border border-black/5 dark:border-white/5 relative">
          <div className="p-6 border-b border-apple-bg dark:border-white/5">
            <h3 className="text-[10px] font-black text-apple-gray dark:text-apple-gray uppercase tracking-widest mb-1">{t.settings.prefTitle}</h3>
            <p className="text-xs font-medium text-apple-label/60 dark:text-apple-gray/60">{t.settings.prefDesc}</p>
          </div>
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-sm text-apple-text dark:text-white">{t.settings.unitSystem}</span>
              <div className="flex bg-black/[0.05] dark:bg-white/[0.05] p-1 rounded-full border border-black/[0.02] dark:border-white/[0.02] shadow-inner no-print shrink-0">
                <button
                  onClick={() => toggleUnits('metric')}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${settings.units === 'metric' ? 'bg-white dark:bg-[#3A3A3C] shadow-md text-vizofit-accent scale-100 opacity-100' : 'text-apple-gray hover:text-apple-text scale-95 opacity-50 active:scale-90'}`}
                >
                  {t.settings.metric}
                </button>
                <button
                  onClick={() => toggleUnits('imperial')}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${settings.units === 'imperial' ? 'bg-white dark:bg-[#3A3A3C] shadow-md text-vizofit-accent scale-100 opacity-100' : 'text-apple-gray hover:text-apple-text scale-95 opacity-50 active:scale-90'}`}
                >
                  {t.settings.imperial}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-sm text-apple-text dark:text-white">Appearance</span>
              <div className="flex bg-black/[0.05] dark:bg-white/[0.05] p-1 rounded-full border border-black/[0.02] dark:border-white/[0.02] shadow-inner no-print shrink-0">
                {(['light', 'dark', 'system'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAppearance(mode)}
                    className={`px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${settings.appearance === mode ? 'bg-white dark:bg-[#3A3A3C] shadow-md text-vizofit-accent scale-100 opacity-100' : 'text-apple-gray hover:text-apple-text scale-95 opacity-50 active:scale-90'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-sm text-apple-text dark:text-white">{t.settings.language}</span>
              <div className="relative shrink-0 w-32" ref={dropdownRef}>
                <div
                  onClick={() => {
                    soundService.playTap();
                    setIsLangOpen(!isLangOpen);
                  }}
                  className={`flex items-center justify-between bg-black/[0.05] dark:bg-white/[0.05] border border-black/[0.02] dark:border-white/[0.02] shadow-inner rounded-full px-5 py-2.5 cursor-pointer transition-all duration-300 active:scale-95 ${isLangOpen ? 'ring-4 ring-vizofit-accent/10 border-vizofit-accent/20' : ''}`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-apple-text dark:text-white">
                    {settings.language.toUpperCase()}
                  </span>
                  <span className={`material-symbols-rounded text-lg text-vizofit-accent font-black transition-transform duration-300 ${isLangOpen ? 'rotate-180' : 'rotate-0'}`}>
                    expand_more
                  </span>
                </div>

                {isLangOpen && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-[#2C2C2E] rounded-ios-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-black/[0.08] dark:border-white/[0.08] overflow-hidden z-[1000] animate-spring origin-top max-h-[40vh] overflow-y-auto no-scrollbar">
                    <div className="flex flex-col p-1.5">
                      {[
                        { code: 'en', name: 'English' },
                        { code: 'es', name: 'Español' },
                        { code: 'fr', name: 'Français' },
                        { code: 'de', name: 'Deutsch' },
                        { code: 'pt', name: 'Português' },
                        { code: 'ru', name: 'Русский' },
                        { code: 'hi', name: 'हिन्दी' },
                        { code: 'ar', name: 'العربية' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code as any)}
                          className={`w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest rounded-ios transition-colors mt-0.5 first:mt-0 ${settings.language === lang.code ? 'bg-vizofit-accent text-apple-text shadow-sm' : 'text-apple-text dark:text-white hover:bg-apple-bg dark:hover:bg-white/5'}`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-ios border border-black/5 dark:border-white/5 overflow-hidden">
          <div className="p-6 border-b border-apple-bg dark:border-white/5">
            <h3 className="text-[10px] font-black text-apple-gray dark:text-apple-gray uppercase tracking-widest mb-1">{t.settings.audioTitle}</h3>
            <p className="text-xs font-medium text-apple-label/60 dark:text-apple-gray/60">{t.settings.audioDesc}</p>
          </div>
          <div className="p-6">
            <button
              onClick={toggleMute}
              className="w-full flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`size-10 rounded-full flex items-center justify-center ios-transition ${settings.isMuted ? 'bg-apple-bg dark:bg-white/5 text-apple-gray' : 'bg-vizofit-accent/10 text-vizofit-accent'}`}>
                  <span className="material-symbols-rounded text-xl">
                    {settings.isMuted ? 'volume_off' : 'volume_up'}
                  </span>
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-apple-text dark:text-white">{t.settings.interfaceSounds}</span>
                  <span className="block text-[10px] font-medium text-apple-gray">{settings.isMuted ? t.settings.muted : t.settings.enabled}</span>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full ios-transition relative ${settings.isMuted ? 'bg-apple-gray/20' : 'bg-vizofit-accent'}`}>
                <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm ios-transition ${settings.isMuted ? 'left-1' : 'left-7'}`}></div>
              </div>
            </button>
          </div>
        </section>

        <section className="bg-white dark:bg-[#1C1C1E] rounded-[2rem] shadow-ios border border-black/5 dark:border-white/5 overflow-hidden">
          <div className="p-6 border-b border-apple-bg dark:border-white/5">
            <h3 className="text-[10px] font-black text-apple-gray uppercase tracking-widest mb-1">{t.settings.aboutTitle}</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-apple-text dark:text-white">{t.settings.version}</span>
              <span className="text-xs font-black text-vizofit-accent">{t.common.fullVersion}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-apple-text dark:text-white">{t.settings.aiModel}</span>
              <span className="text-[10px] font-black text-apple-gray bg-apple-bg dark:bg-white/5 dark:text-apple-gray px-2 py-1 rounded-md">GEMINI-3-FLASH</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
