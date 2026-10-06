import { AlertTriangle, ShieldAlert, Clock, Filter } from 'lucide-react';
import { QUALITY_DATA, EQUIPMENT, DATES, DEFECT_NORM, DOWNTIME_LIMIT } from '@/data';
import { qualityStatus, qualityLabel } from '@/utils';
import { statusBg, statusDot, equipmentStatusBg } from '@/components/statusUtils';
import type { StationStatus } from '@/types';

interface Incident {
  id: string;
  level: 'CRITICAL' | 'WARNING' | 'INFO';
  station: string;
  description: string;
  value: string;
  norm: string;
  date: string;
  status: StationStatus;
}

export function IncidentsView() {
  const incidents: Incident[] = [];

  for (const date of DATES) {
    for (const q of QUALITY_DATA[date]) {
      if (q.defectRate > DEFECT_NORM) {
        const status = qualityStatus(q.defectRate);
        incidents.push({
          id: `q-${date}-${q.station}`,
          level: status === 'CRITICAL' ? 'CRITICAL' : 'WARNING',
          station: q.station,
          description: `Превышение доли брака на участке ${q.station}`,
          value: `${q.defectRate.toFixed(1)}%`,
          norm: `≤${DEFECT_NORM}%`,
          date,
          status,
        });
      }
    }
  }

  for (const eq of EQUIPMENT) {
    if (eq.status === 'Critical' || eq.status === 'Warning') {
      incidents.push({
        id: `e-${eq.id}`,
        level: eq.status === 'Critical' ? 'CRITICAL' : 'WARNING',
        station: eq.id,
        description: `Простой оборудования: ${eq.cause}`,
        value: `${eq.downtime} мин`,
        norm: `≤${DOWNTIME_LIMIT} мин`,
        date: '02.10.2026',
        status: eq.status === 'Critical' ? 'CRITICAL' : 'WARNING',
      });
    }
  }

  const sorted = [...incidents].sort((a, b) => {
    const order = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    return order[a.level] - order[b.level];
  });

  const critical = sorted.filter((i) => i.level === 'CRITICAL');
  const warnings = sorted.filter((i) => i.level === 'WARNING');

  return (
    <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin h-full">
      <div>
        <h2 className="text-2xl font-bold text-white">Инциденты</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Журнал отклонений и инцидентов · Тестовые данные
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-panel rounded-xl p-4 border-red-500/20">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="text-red-400" size={18} />
            <span className="text-xs text-slate-500 uppercase tracking-wider">Критические</span>
          </div>
          <div className="text-3xl font-bold text-red-400">{critical.length}</div>
        </div>
        <div className="glass-panel rounded-xl p-4 border-yellow-500/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="text-yellow-400" size={18} />
            <span className="text-xs text-slate-500 uppercase tracking-wider">Предупреждения</span>
          </div>
          <div className="text-3xl font-bold text-yellow-400">{warnings.length}</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Filter className="text-slate-400" size={18} />
            <span className="text-xs text-slate-500 uppercase tracking-wider">Всего</span>
          </div>
          <div className="text-3xl font-bold text-white">{sorted.length}</div>
        </div>
      </div>

      {/* Incident list */}
      <div className="space-y-3">
        {sorted.map((inc) => {
          const isCritical = inc.level === 'CRITICAL';
          const Icon = isCritical ? ShieldAlert : AlertTriangle;
          return (
            <div
              key={inc.id}
              className={`glass-panel rounded-xl p-4 border ${statusBg(inc.status)} ${isCritical ? 'glow-red' : ''} flex items-center gap-4`}
            >
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${statusBg(inc.status)}`}>
                <Icon
                  className={isCritical ? 'text-red-400' : 'text-yellow-400'}
                  size={20}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-sm font-bold ${isCritical ? 'text-red-400' : 'text-yellow-400'}`}>
                    {isCritical ? 'Критический инцидент' : 'Предупреждение'}
                  </span>
                  <span className="text-xs text-slate-600">{inc.date}</span>
                </div>
                <div className="text-sm text-slate-300">{inc.description}</div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-lg font-bold ${isCritical ? 'text-red-400' : 'text-yellow-400'}`}>
                  {inc.value}
                </div>
                <div className="text-xs text-slate-500">Норма: {inc.norm}</div>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${statusDot(inc.status)} ${isCritical ? 'animate-pulse-soft' : ''}`} />
            </div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="glass-panel rounded-xl p-8 text-center">
          <Clock className="text-emerald-400 mx-auto mb-3" size={32} />
          <p className="text-slate-400">Активных инцидентов не обнаружено</p>
        </div>
      )}
    </div>
  );
}
