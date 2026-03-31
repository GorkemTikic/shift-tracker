import React, { useState, useRef, useEffect } from 'react';
import { type ActivityCategory, CATEGORY_ORDER } from '../types';
import { cn } from '../utils/cn';
import { ChevronDown } from 'lucide-react';

export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  'Online': 'bg-emerald-500',
  'AD HOC': 'bg-blue-500',
  'Short Break': 'bg-slate-400',
  'Meal Break': 'bg-slate-400',
  'Wrap-Up': 'bg-orange-500',
  'Meeting': 'bg-purple-500',
  'Training': 'bg-pink-500',
  'Shift-End': 'bg-rose-500',
  'Log-Out': 'bg-slate-700',
};

interface Props {
  value: ActivityCategory;
  onChange: (cat: ActivityCategory) => void;
}

export const CategorySelect: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Split into Top (Online, AD HOC) and others
  const topOptions = CATEGORY_ORDER.slice(0, 2);
  const otherOptions = CATEGORY_ORDER.slice(2);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <div className="flex items-center gap-3">
          <span className={cn("w-3 h-3 rounded-full shadow-md", CATEGORY_COLORS[value])} />
          <span className="font-semibold text-slate-200">{value}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", open ? "rotate-180" : "")} />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-slate-900 border border-slate-700/80 shadow-2xl rounded-xl animate-in fade-in slide-in-from-top-2">
          {/* Top Options */}
          {topOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              className={cn(
                "w-full text-left px-4 py-2 flex items-center gap-3 transition-colors hover:bg-slate-700/50",
                value === cat ? "bg-slate-800" : ""
              )}
              onClick={() => {
                onChange(cat);
                setOpen(false);
              }}
            >
              <span className={cn("w-2.5 h-2.5 rounded-full", CATEGORY_COLORS[cat])} />
              <span className={cn("font-medium", value === cat ? "text-white" : "text-slate-300")}>{cat}</span>
            </button>
          ))}
          
          <div className="my-2 h-px bg-white/10 mx-4" />

          {/* Other Options */}
          {otherOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              className={cn(
                "w-full text-left px-4 py-2 flex items-center gap-3 transition-colors hover:bg-slate-700/50",
                value === cat ? "bg-slate-800" : ""
              )}
              onClick={() => {
                onChange(cat);
                setOpen(false);
              }}
            >
              <span className={cn("w-2 h-2 rounded-full", CATEGORY_COLORS[cat])} />
              <span className={cn("text-sm transition-colors", value === cat ? "text-slate-100 font-medium" : "text-slate-400 hover:text-slate-200")}>{cat}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
