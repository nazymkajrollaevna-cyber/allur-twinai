import { Wrench, Clock, AlertTriangle } from 'lucide-react';
import { EQUIPMENT, DOWNTIME_LIMIT } from '@/data';
import { downtimeProgress } from '@/utils';
import { equipmentStatusBg } from '@/components/statusUtils';

export function EquipmentView() {
  const totalDown = EQUIPMENT.reduce((s, e) => s + e.downtime, 0);
  const critical = EQUIPMENT.filter((e) => e.status === 'Critical');
  const warning = EQUIPMENT.filter((e) => e.status === 'Warning');
  const maintenance = EQUIPMENT.filter((e) => e.status === 'Maintenance');

  return (
    <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin h-full">
      <div>
        <h2 className="text-2xl font-bold text-white">Оборудование и простои</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Мониторинг простоев оборудования · Критический норматив: ≤{DOWNTIME_LIMIT} минут/сутки
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Всего единиц</div>
          <div className="text-3xl font-bold text-white">{EQUIPMENT.length}</div>
        </div>
        <div className="glass-panel rounded-xl p-4 border-red-500/20">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Критические</div>
          <div className="text-3xl font-bold text-red-400">{critical.length}</div>
        </div>
        <div className="glass-panel rounded-xl p-4 border-yellow-500/20">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Предупреждения</div>
          <div className="text-3xl font-bold text-yellow-400">{warning.length}</div>
        </div>
        <div className="glass-panel rounded-xl p-4 border-blue-500/20">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Суммарный простой</div>
          <div className="text-3xl font-bold text-white">
            {totalDown}
            <span className="text-sm text-slate-500 ml-1">мин</span>
          </div>
        </div>
      </div>

      {/* Equipment cards */}
      <div className="grid grid-cols-2 gap-4">
        {EQUIPMENT.map((eq) => {
          const progress = downtimeProgress(eq);
          const remaining = DOWNTIME_LIMIT - eq.downtime;
          const isCritical = eq.status === 'Critical';
          const isNearLimit = eq.downtime >= DOWNTIME_LIMIT * 0.85;

          return (
            <div
              key={eq.id}
              className={`glass-panel rounded-xl p-5 ${
                isCritical ? 'border-red-500/30 glow-red' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
                    <Wrench
                      className={
                        eq.status === 'Critical'
                          ? 'text-red-400'
                          : eq.status === 'Warning'
                            ? 'text-yellow-400'
                            : 'text-blue-400'
                      }
                      size={20}
                    />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">{eq.id}</div>
                    <div className="text-xs text-slate-500">Участок: {eq.station}</div>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md border ${equipmentStatusBg(eq.status)}`}
                >
                  {eq.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-xs text-slate-500">Причина простоя</div>
                  <div className="text-sm font-semibold text-slate-200">{eq.cause}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Простой</div>
                  <div className="text-sm font-semibold text-white">{eq.downtime} мин</div>
                </div>
              </div>

              {/* Progress bar for near-limit or critical */}
              {isNearLimit && (
                <div className={`rounded-lg p-3 ${isCritical ? 'bg-red-500/10 border border-red-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> Прогресс к лимиту
                    </span>
                    <span className={`text-sm font-bold ${isCritical ? 'text-red-400' : 'text-yellow-400'}`}>
                      {eq.downtime} / {DOWNTIME_LIMIT} мин · {progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCritical ? 'bg-red-500 animate-pulse-soft' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {isCritical && (
                    <div className="flex items-center gap-2 mt-2">
                      <AlertTriangle size={14} className="text-red-400" />
                      <span className="text-xs text-red-400 font-semibold">
                        Осталось до критического лимита: {remaining} минут
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Critical downtime highlight - Конвейер-03 */}
      <div className="glass-panel rounded-2xl p-6 border-red-500/30 glow-red animate-pulse-red">
        <div className="flex items-center gap-6">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <AlertTriangle className="text-red-400" size={28} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-red-400 mb-1">РИСК КРИТИЧЕСКОГО ПРОСТОЯ</div>
            <div className="text-2xl font-bold text-white">Конвейер-03</div>
            <div className="text-sm text-slate-400 mt-1">
              Простой: 55 / 60 минут · Осталось до лимита: 5 минут
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-red-400 text-glow-red">92%</div>
            <div className="text-xs text-slate-500">от лимита</div>
          </div>
        </div>
      </div>
    </div>
  );
}
