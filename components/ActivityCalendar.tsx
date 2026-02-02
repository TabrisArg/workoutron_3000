import React, { useState, useEffect, useMemo } from 'react';
import { ActivityLog, SavedWorkout } from '../types';
import { soundService } from '../utils/soundService';
import { TranslationSchema } from '../i18n/types';

interface MonthProps {
  year: number;
  monthIndex: number;
  logs: ActivityLog[];
  t: TranslationSchema;
}

const MonthGrid: React.FC<MonthProps> = ({ year, monthIndex, logs, t }) => {
  const monthNames = t.activity.months;
  const daysInMonth = useMemo(() => new Date(year, monthIndex + 1, 0).getDate(), [year, monthIndex]);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getLogsForDay = (day: number) => {
    // Generate local YYYY-MM-DD string to match log.date (which is also formatted locally in App.tsx)
    const y = year;
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    return logs.filter(log => log.date.split('T')[0] === dateStr);
  };

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-apple-bg dark:bg-white/10';
    if (count === 1) return 'bg-vizofit-accent/30';
    if (count === 2) return 'bg-vizofit-accent/60';
    return 'bg-vizofit-accent';
  };

  return (
    <div className="flex flex-col space-y-2 shrink-0">
      <span className="text-[10px] font-black text-apple-gray dark:text-apple-gray uppercase tracking-widest ps-0.5 border-s-2 border-vizofit-accent/20 ms-0.5">
        {monthNames[monthIndex]}
      </span>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayLogs = getLogsForDay(day);
          const count = dayLogs.length;
          return (
            <div
              key={day}
              onMouseEnter={() => { if (count > 0) soundService.playTick(); }}
              className={`size-3 sm:size-3.5 rounded-sm ios-transition ${getColorClass(count)} hover:scale-125 hover:z-10 shadow-sm`}
            />
          );
        })}
      </div>
    </div>
  );
};

interface ActivityCalendarProps {
  t: TranslationSchema;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ t }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    // 1. Load logs
    const raw = localStorage.getItem('vizofit_activity');
    let currentLogs: ActivityLog[] = raw ? JSON.parse(raw) : [];

    // 2. Resource Management: Prune old history if it gets too large (>200 items)
    // We only prune un-favorited routines from the library side, 
    // but here we just keep the last 300 logs to keep memory low.
    if (currentLogs.length > 300) {
      currentLogs = currentLogs.slice(0, 300);
      localStorage.setItem('vizofit_activity', JSON.stringify(currentLogs));
    }

    setLogs(currentLogs);
  }, []);

  const streak = useMemo(() => {
    if (logs.length === 0) return 0;
    const activeDates = Array.from(new Set<string>(logs.map(l => l.date.split('T')[0])))
      .sort((a, b) => b.localeCompare(a));
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (activeDates[0] !== today && activeDates[0] !== yesterday) return 0;
    let count = 0;
    let checkDate = new Date(activeDates[0]);
    for (let i = 0; i < activeDates.length; i++) {
      const currentDate = new Date(activeDates[i]);
      const diffDays = Math.ceil(Math.abs(checkDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      if (i === 0 || diffDays === 1) { count++; checkDate = currentDate; }
      else if (diffDays !== 0) break;
    }
    return count;
  }, [logs]);

  const consistencyScore = useMemo(() => {
    if (logs.length === 0) return t.activity.scores.none;
    const sessionsPerMonth = logs.length / (new Date().getMonth() + 1);
    if (sessionsPerMonth > 15) return t.activity.scores.elite;
    if (sessionsPerMonth > 4) return t.activity.scores.good;
    return t.activity.scores.active;
  }, [logs, t]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12 w-full">
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-apple-text dark:text-white">{t.activity.title}</h2>
        <p className="text-apple-gray dark:text-apple-gray font-bold text-sm tracking-tight">{t.activity.descPrefix} {currentYear}</p>
      </div>

      <div className="bg-white dark:bg-[#1C1C1E] p-6 md:p-8 rounded-[2rem] shadow-ios border border-black/5 dark:border-white/10 w-full">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-wrap gap-x-1 gap-y-10 justify-center md:justify-start">
            {t.activity.months.map((_, i) => (
              <MonthGrid key={i} year={currentYear} monthIndex={i} logs={logs} t={t} />
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-apple-bg dark:border-white/10 gap-6">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-apple-gray uppercase tracking-widest mb-1">{t.activity.totalEffort}</span>
                <span className="text-3xl font-black tracking-tighter dark:text-white">{logs.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-apple-gray uppercase tracking-widest mb-1">{t.activity.currentStreak}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black tracking-tighter text-vizofit-accent">{streak}</span>
                  <span className="text-xs font-black text-vizofit-accent uppercase">{t.activity.days}</span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[9px] font-black text-apple-gray uppercase tracking-widest mb-1">{t.activity.consistency}</span>
                <span className="text-3xl font-black tracking-tighter text-apple-text dark:text-white">{consistencyScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
