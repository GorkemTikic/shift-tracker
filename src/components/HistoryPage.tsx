import React, { useMemo, useState } from 'react';
import { useShiftData } from '../context/ShiftContext';
import { aggregateData, type ReportGroup } from '../utils/historyHelpers';
import { generateAggregateReport } from '../utils/exportHelpers';
import { minsToHm } from '../utils/timeHelpers';
import { Calendar, Download, FileText } from 'lucide-react';
import { ExportModal } from './ExportModal';

export const HistoryPage: React.FC = () => {
  const { data } = useShiftData();
  const [modalGroup, setModalGroup] = useState<ReportGroup | null>(null);

  const { weeks, months } = useMemo(() => aggregateData(data), [data]);

  const downloadBackup = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderGroup = (group: ReportGroup) => (
    <div key={group.id} className="glass-card bg-slate-800/40 p-5 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all group relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            {group.title}
          </h4>
          <p className="text-sm text-slate-400 mt-1">{group.dayKeys.length} days logged</p>
        </div>
        <button
          onClick={() => setModalGroup(group)}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium transition-colors border border-indigo-500/20"
        >
          <FileText className="w-4 h-4" />
          Report
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Productive Time</span>
          <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-sm">
            {minsToHm(group.stats.productiveMins)} <span className="text-sm text-emerald-500">hrs</span>
          </span>
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total Logged</span>
          <span className="text-2xl font-black text-slate-100 font-mono tracking-tight drop-shadow-sm">
            {minsToHm(group.stats.totalMins)} <span className="text-sm text-slate-400">hrs</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/30 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-sm">
            History & Reports
          </h2>
          <p className="text-slate-400 text-sm mt-1">View past performance and generate multi-day summaries.</p>
        </div>
        
        <button
          onClick={downloadBackup}
          className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-600 shadow-md w-full sm:w-auto hover:shadow-lg"
        >
          <Download className="w-4 h-4" />
          Backup Data (JSON)
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-200 px-2 border-b border-slate-700/50 pb-2">Weekly Summaries</h3>
        {weeks.length === 0 ? (
          <p className="text-slate-500 px-2">No robust week data recorded yet. Start logging!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {weeks.map(renderGroup)}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-bold text-slate-200 px-2 border-b border-slate-700/50 pb-2">Monthly Summaries</h3>
        {months.length === 0 ? (
          <p className="text-slate-500 px-2">No month data recorded yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {months.map(renderGroup)}
          </div>
        )}
      </div>

      {modalGroup && (
        <ExportModal 
          onClose={() => setModalGroup(null)}
          overrideTitle={modalGroup.title + " Summary"}
          overrideText={generateAggregateReport(modalGroup, data)}
        />
      )}
    </div>
  );
};
