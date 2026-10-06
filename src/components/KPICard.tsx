import type { StationStatus } from '@/types';
import { statusBg } from './statusUtils';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: StationStatus;
  accent?: 'red' | 'green' | 'yellow' | 'blue' | 'default';
  sublabel?: string;
}

export function KPICard({ label, value, unit, status, accent = 'default', sublabel }: KPICardProps) {
  const accentMap = {
    red: 'text-red-400',
    green: 'text-emerald-400',
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    default: 'text-white',
  };

  const borderMap = {
    red: 'border-red-500/20',
    green: 'border-emerald-500/20',
    yellow: 'border-yellow-500/20',
    blue: 'border-blue-500/20',
    default: 'border-slate-700/40',
  };

  return (
    <div
      className={`glass-panel rounded-xl p-4 border ${borderMap[accent]} hover:border-slate-600/50 transition-all duration-200`}
    >
      <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium mb-2">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-bold ${accentMap[accent]}`}>{value}</span>
        {unit && <span className="text-sm text-slate-500 font-medium">{unit}</span>}
      </div>
      {status && (
        <div className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded border ${statusBg(status)}`}>
          {status}
        </div>
      )}
      {sublabel && <div className="text-[10px] text-slate-600 mt-2">{sublabel}</div>}
    </div>
  );
}
