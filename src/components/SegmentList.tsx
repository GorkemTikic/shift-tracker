import React from 'react';
import { useShiftData } from '../context/ShiftContext';
import { SegmentRow } from './SegmentRow';
import { Plus } from 'lucide-react';

export const SegmentList: React.FC = () => {
  const { data, activeDate, addSegment, updateSegment, deleteSegment } = useShiftData();
  const dayData = data[activeDate];
  const segments = dayData?.segments || [];

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col space-y-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-slate-200">Shift Segments</h3>
        <span className="text-sm font-medium text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          {segments.length} entries
        </span>
      </div>

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
    </div>
  );
};
