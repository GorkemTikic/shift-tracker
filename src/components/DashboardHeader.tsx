import React from 'react';
import { type ActivityCategory } from '../types';
import { useShiftData } from '../context/ShiftContext';
import { getDurationMins, minsToHm } from '../utils/timeHelpers';

const PRODUCTIVE_CATEGORIES: ActivityCategory[] = ['Online', 'AD HOC'];

export const DashboardHeader: React.FC<{
  onExport: () => void;
}> = ({ onExport }) => {
  const { data, activeDate } = useShiftData();
  const dayData = data[activeDate];
  const segments = dayData?.segments || [];

  let productiveMins = 0;
  let otherMins = 0;

  segments.forEach(seg => {
    if (!seg.startTime || !seg.endTime) return;
    const dur = getDurationMins(seg.startTime, seg.endTime);
    if (PRODUCTIVE_CATEGORIES.includes(seg.category)) {
      productiveMins += dur;
    } else {
      otherMins += dur;
    }
  });

  const totalMins = productiveMins + otherMins;
  const prodPct = totalMins > 0 ? Math.round((productiveMins / totalMins) * 100) : 0;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end p-6 glass-card rounded-2xl mb-8 border border-white/5 bg-slate-800/80 shadow-2xl relative overflow-hidden group">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-1000 ease-in-out"></div>
      
      <div className="relative z-10 w-full mb-6 md:mb-0">
        <h2 className="text-sm font-semibold text-indigo-400 tracking-wider uppercase mb-1">
          {activeDate} Shift
        </h2>
        <h1 className="text-3xl font-bold text-white mb-6">Daily Tracking</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wide">Productive Time</span>
            <div className="text-2xl font-bold text-emerald-400 flex items-baseline">
              {minsToHm(productiveMins)}
              <span className="text-sm text-emerald-500/50 ml-2 font-normal">hrs</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden flex">
               <div className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${prodPct}%` }} />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wide">Other (Breaks/Mtg)</span>
            <div className="text-2xl font-bold text-slate-300 flex items-baseline">
              {minsToHm(otherMins)}
              <span className="text-sm text-slate-500 ml-2 font-normal">hrs</span>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col">
            <span className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wide">Total Logged</span>
            <div className="text-2xl font-bold text-white flex items-baseline">
              {minsToHm(totalMins)}
              <span className="text-sm text-slate-500 ml-2 font-normal">hrs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-auto">
        <button 
          onClick={onExport}
          className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Generate Report
        </button>
      </div>
    </div>
  );
};
