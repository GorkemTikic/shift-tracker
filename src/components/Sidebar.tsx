import React from 'react';
import { useShiftData } from '../context/ShiftContext';
import { getTodayDateString } from '../utils/timeHelpers';
import { cn } from '../utils/cn';
import { Calendar, Plus } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { data, activeDate, setActiveDate } = useShiftData();
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

      <button 
        onClick={() => setActiveDate(today)}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all mb-6",
          activeDate === today 
            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" 
            : "glass hover:bg-white/10 text-slate-300"
        )}
      >
        <Plus className="w-4 h-4" />
        Today's Shift
      </button>

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
                    onClick={() => setActiveDate(date)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      activeDate === date
                        ? "bg-slate-700/50 text-indigo-400"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    )}
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
