import { Calendar, Database, Activity } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const today = '02.10.2026';
  return (
    <div className="flex items-center justify-between px-7 py-4 border-b border-slate-800/80 bg-[#0d1320]/60 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-bold text-white tracking-tight">{title}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
          <span>Система активна</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 border-l border-slate-700/50 pl-5">
          <Database size={14} className="text-slate-500" />
          <span className="text-slate-500">Тестовые данные кейса</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 border-l border-slate-700/50 pl-5">
          <Calendar size={14} className="text-slate-500" />
          <span>Дата: {today}</span>
        </div>
      </div>
    </div>
  );
}

export function SystemStatusBar() {
  return (
    <div className="flex items-center gap-4 text-xs text-slate-500">
      <div className="flex items-center gap-1.5">
        <Activity size={12} className="text-emerald-400" />
        <span>Online</span>
      </div>
    </div>
  );
}
