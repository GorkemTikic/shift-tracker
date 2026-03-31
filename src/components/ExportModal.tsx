import React, { useState } from 'react';
import { useShiftData } from '../context/ShiftContext';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ExportModal: React.FC<Props> = ({ onClose }) => {
  const { data, activeDate } = useShiftData();
  const [copied, setCopied] = useState(false);
  
  const dayData = data[activeDate];
  const segments = dayData?.segments || [];
  
  // Create Date string like "March 12 Summary:"
  const d = new Date(activeDate);
  const dateStr = `${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'UTC' })} Summary:`;
  
  // Format segments: "15:00 - 18:00: AD HOC"
  const segmentsText = segments.map((seg: any) => {
    let timeText = seg.startTime === seg.endTime 
      ? seg.startTime 
      : `${seg.startTime} - ${seg.endTime}`;
      
    let text = `${timeText} - ${seg.category}`;
    if (seg.notes) text += ` (${seg.notes})`;
    return text;
  }).join('\n');
  
  const finalReport = `${dateStr}\n\n${segmentsText}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glass-card bg-slate-800/90 border border-slate-600 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">Export Shift Summary</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <p className="text-slate-400 text-sm">
            Here is your smart summary for <strong>{dateStr}</strong>. Ready to be pasted into Teams or Slack.
          </p>
          
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 shadow-inner">
            <p className="font-mono text-sm text-indigo-200 break-words whitespace-pre-wrap leading-relaxed">
              {finalReport}
            </p>
          </div>
          
          <button
            onClick={copyToClipboard}
            className="w-full py-4 glass bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 rounded-xl font-bold flex items-center justify-center gap-3 transition-all group"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Copy All for Slack/Teams
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
