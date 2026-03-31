import React from 'react';
import { useShiftData } from '../context/ShiftContext';
import { getTodayDateString } from '../utils/timeHelpers';
import { cn } from '../utils/cn';
import { Calendar, FileText, History } from 'lucide-react';

interface SidebarProps {
  view: 'dashboard' | 'history';
  setView: (v: 'dashboard' | 'history') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView }) => {
  const { data, activeDate, setActiveDate } = useShiftData();
  const dateInputRef = React.useRef<HTMLInputElement>(null);
  const today = getTodayDateString();

  // Group dates by month-year
  // date format: YYYY-MM-DD
  const monthlyGroups: Record<string, string[]> = {};
  
  const allDates = Array.from(new Set([...Object.keys(data), today])).sort().reverse(); // new to old

  allDates.forEach(d => {
    const [y, m, day] = d.split('-');
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(day));
    const monthYearStr = dateObj.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    if (!monthlyGroups[monthYearStr]) {
      monthlyGroups[monthYearStr] = [];
    }
    monthlyGroups[monthYearStr].push(d);
  });

  return (
    <div className="w-full md:w-64 glass border-r border-white/5 h-full flex flex-col p-4 bg-slate-900/50">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">T-Shift</h1>
      </div>

      <div className="flex flex-col gap-2 mb-6 border-b border-slate-700/50 pb-4">
        <button 
          onClick={() => { setView('dashboard'); setActiveDate(today); }}
          className={cn(
            "w-full flex items-center justify-start gap-3 py-2.5 px-4 rounded-xl font-semibold transition-all",
            view === 'dashboard' 
              ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
              : "hover:bg-slate-800 text-slate-300"
          )}
        >
          <Calendar className="w-5 h-5" />
          Daily Tracking
        </button>
        
        <button 
          onClick={() => setView('history')}
          className={cn(
            "w-full flex items-center justify-start gap-3 py-2.5 px-4 rounded-xl font-semibold transition-all",
            view === 'history' 
              ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25" 
              : "hover:bg-slate-800 text-slate-300"
          )}
        >
          <FileText className="w-5 h-5" />
          History & Reports
        </button>

        <div className="relative mt-2 pt-2 border-t border-slate-800">
          <button 
            onClick={() => {
              try {
                dateInputRef.current?.showPicker();
              } catch (e) {
                // Fallback for older browsers
                dateInputRef.current?.focus();
              }
            }}
            className="w-full flex items-center justify-start gap-3 py-2.5 px-4 rounded-xl font-semibold transition-all hover:bg-slate-800 text-slate-300"
          >
            <History className="w-5 h-5" />
            Log Past Shift
          </button>
          <input 
            ref={dateInputRef}
            type="date"
            className="absolute w-0 h-0 opacity-0 -z-10"
            style={{ pointerEvents: 'none' }}
            onChange={(e) => {
              if(e.target.value) {
                setView('dashboard');
                setActiveDate(e.target.value);
                // Reset input value so same date can be picked again if needed
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {Object.entries(monthlyGroups).map(([monthStr, dates]) => (
          <div key={monthStr}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
              {monthStr}
            </div>
            <div className="space-y-1">
              {dates.map(date => {
                const [y, m, d] = date.split('-');
                const displayDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric'
                });

                return (
                  <button
                    key={date}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      (activeDate === date && view === 'dashboard')
                        ? "bg-slate-700/50 text-indigo-400"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    )}
                    onClick={() => {
                      setView('dashboard');
                      setActiveDate(date);
                    }}
                  >
                    {displayDate}
                    {date === today && " (Today)"}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
