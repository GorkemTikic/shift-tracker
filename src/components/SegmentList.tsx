import React from 'react';
import { useShiftData } from '../context/ShiftContext';
import { SegmentRow } from './SegmentRow';
import { Plus, Coffee } from 'lucide-react';
import { cn } from '../utils/cn';

export const SegmentList: React.FC = () => {
  const { data, activeDate, addSegment, updateSegment, deleteSegment, toggleOffDay } = useShiftData();
  const dayData = data[activeDate];
  const segments = dayData?.segments || [];
  const isOffDay = dayData?.isOffDay || false;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-200">Shift Segments</h3>
        <div className="flex gap-3 items-center">
          {!isOffDay && (
            <span className="text-sm font-medium text-slate-500 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              {segments.length} entries
            </span>
          )}
          <button
            onClick={() => {
              if (!isOffDay && segments.length > 0) {
                if(!confirm("Marking as Off-Day will clear your current segments. Continue?")) return;
              }
              toggleOffDay(activeDate, !isOffDay);
            }}
            className={cn(
              "px-4 py-1.5 rounded-xl text-sm font-bold transition-all border shadow-sm",
              isOffDay 
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10" 
                : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200"
            )}
          >
            {isOffDay ? "🟢 Off-Day Active" : "Mark as Off-Day"}
          </button>
        </div>
      </div>

      {isOffDay ? (
        <div className="flex flex-col items-center justify-center p-12 mt-8 text-center glass-card rounded-3xl border border-emerald-500/20 bg-emerald-900/10 animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-500/20">
            <Coffee className="w-10 h-10 text-emerald-400" />
          </div>
          <p className="text-emerald-400 font-extrabold text-2xl mb-2 tracking-tight">You took the day off!</p>
          <p className="text-emerald-500/70 text-sm max-w-sm">Enjoy your well-deserved break. This date will be explicitly marked as an 'Off-Day' in your historical reports.</p>
        </div>
      ) : (
        <>
          {segments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center glass-card rounded-3xl border border-dashed border-slate-600/50">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <Plus className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium text-lg mb-2">No segments logged for this date.</p>
          <p className="text-slate-500 text-sm mb-6 max-w-sm">Start your day by logging your first chunk of work.</p>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {segments.map((seg: any, index: number) => (
            <SegmentRow 
              key={seg.id}
              segment={seg}
              index={index}
              onUpdate={(updates) => updateSegment(activeDate, seg.id, updates)}
              onDelete={() => deleteSegment(activeDate, seg.id)}
            />
          ))}
        </div>
      )}

      {/* Add New Segment Button */}
      <div className="mt-8 relative z-0">
        <button
          onClick={() => addSegment(activeDate)}
          className="w-full relative group p-[2px] rounded-2xl transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl opacity-40 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200"></div>
          <div className="relative w-full glass-card hover:bg-slate-800 px-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
            <Plus className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span className="text-lg font-bold text-indigo-400 group-hover:text-white transition-colors">
              Log Activity
            </span>
          </div>
          </button>
        </div>
        </>
      )}
    </div>
  );
};
