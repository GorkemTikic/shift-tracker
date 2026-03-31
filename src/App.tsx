import React, { useState } from 'react';
import { ShiftProvider } from './context/ShiftContext';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { SegmentList } from './components/SegmentList';
import { HistoryPage } from './components/HistoryPage';
import { ExportModal } from './components/ExportModal';
import { Menu, X } from 'lucide-react';
import { cn } from './utils/cn';

const AppContent: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [view, setView] = useState<'dashboard' | 'history'>('dashboard');

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500/30">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen mix-blend-mode-screen"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-800/20 rounded-full blur-[150px] mix-blend-screen mix-blend-mode-screen"></div>
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen mix-blend-mode-screen"></div>
      </div>

      {/* Mobile Header / Nav Toggle */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between p-4">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-extrabold pb-0.5">T</span>
          </div>
          T-Shift
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 glass rounded-lg">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "absolute md:relative z-30 h-full transition-transform duration-300 ease-in-out md:translate-x-0",
        mobileMenuOpen ? "translate-x-0 w-3/4 sm:w-1/2 max-w-sm" : "-translate-x-full md:block"
      )}>
        <Sidebar view={view} setView={(v) => { setView(v); setMobileMenuOpen(false); }} />
      </div>

      {/* Mobile menu backdrop */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 h-full w-full relative z-10 overflow-y-auto pt-20 md:pt-0 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto h-full flex flex-col mt-4 md:mt-8">
          {view === 'dashboard' ? (
            <>
              <DashboardHeader onExport={() => setExportModalOpen(true)} />
              <SegmentList />
            </>
          ) : (
            <HistoryPage />
          )}
        </div>
      </main>

      {/* Export Modal */}
      {exportModalOpen && <ExportModal onClose={() => setExportModalOpen(false)} />}
    </div>
  );
};

function App() {
  return (
    <ShiftProvider>
      <AppContent />
    </ShiftProvider>
  );
}

export default App;
