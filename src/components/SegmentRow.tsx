import type { Segment } from '../types';
import { CategorySelect, CATEGORY_COLORS } from './CategorySelect';
import { Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';

interface Props {
  segment: Segment;
  index: number;
  onUpdate: (updates: Partial<Segment>) => void;
  onDelete: () => void;
}

export const SegmentRow: React.FC<Props> = ({ segment, index, onUpdate, onDelete }) => {
  return (
    <div 
      className="group relative w-full p-4 mb-3 glass-card bg-slate-800/40 rounded-2xl flex flex-col md:flex-row items-center gap-4 transition-all hover:bg-slate-800/80 border border-slate-700 hover:border-slate-600/50 hover:shadow-2xl hover:shadow-black/20"
      style={{ zIndex: 50 - index }}
    >
      
      {/* Visual Accent Line */}
      <div className={cn("absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full transition-colors", CATEGORY_COLORS[segment.category])}></div>
      
      {/* Time Controls */}
      <div className="flex w-full md:w-auto items-center gap-2 pl-2">
        <input 
          type="time" 
          value={segment.startTime}
          onChange={(e) => onUpdate({ startTime: e.target.value })}
          className="bg-slate-900/50 border border-slate-700 text-slate-200 text-lg md:text-base font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-full md:w-[130px] shadow-inner"
        />
        <span className="text-slate-500 font-medium">-</span>
        <input 
          type="time" 
          value={segment.endTime}
          onChange={(e) => onUpdate({ endTime: e.target.value })}
          className="bg-slate-900/50 border border-slate-700 text-slate-200 text-lg md:text-base font-medium rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-full md:w-[130px] shadow-inner"
        />
      </div>

      {/* Category Selection */}
      <div className="w-full md:w-56 mt-2 md:mt-0 flex-shrink-0 z-10">
         <CategorySelect 
           value={segment.category} 
           onChange={(cat) => onUpdate({ category: cat })} 
         />
      </div>

      {/* Notes */}
      <div className="w-full flex-1 flex gap-3 items-center">
        <input 
          type="text" 
          placeholder="Notes (optional, e.g. TKT-1234)" 
          value={segment.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          className="w-full bg-slate-900/30 border border-transparent hover:border-slate-700 focus:bg-slate-900/50 focus:border-slate-600 text-slate-300 placeholder-slate-500/60 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm md:text-base"
        />
        <button 
          onClick={onDelete}
          className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all active:scale-95 flex-shrink-0"
          title="Delete segment"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      
    </div>
  );
};
