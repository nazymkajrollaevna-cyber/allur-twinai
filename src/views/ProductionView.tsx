import { useState } from 'react';
import { AlertTriangle, Database, TrendingUp, Car } from 'lucide-react';
import { DateSwitcher } from '@/components/DateSwitcher';
import { PRODUCTION_DATA, QUALITY_DATA, CAR_MODELS, MONTHLY_TARGET, DEFECT_NORM } from '@/data';
import { qualityStatus, qualityLabel } from '@/utils';
import type { DateKey } from '@/types';
import { statusBg, statusDot } from '@/components/statusUtils';

export function ProductionView() {
  const [date, setDate] = useState<DateKey>('02.10.2026');

  const prod = PRODUCTION_DATA[date];
  const quality = QUALITY_DATA[date];
  const totalPlan = CAR_MODELS.reduce((s, m) => s + m.planPerMonth, 0);
  const gap = MONTHLY_TARGET - totalPlan;

  return (
    <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Производство</h2>
          <p className="text-sm text-slate-500 mt-0.5">Данные производства и контроля качества</p>
        </div>
        <DateSwitcher value={date} onChange={(d) => setDate(d as DateKey)} />
      </div>

      {/* Production lines */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
          Производственные линии · {date}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {prod.map((line) => {
            const ratio = Math.round((line.fact / line.plan) * 100);
            return (
              <div key={line.name} className="glass-panel rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-white">{line.name}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      ratio >= 100
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : ratio >= 95
                          ? 'bg-yellow-500/15 text-yellow-400'
                          : 'bg-red-500/15 text-red-400'
                    }`}
                  >
                    {ratio}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">План</div>
                    <div className="text-lg font-bold text-slate-200">{line.plan}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Факт</div>
                    <div className="text-lg font-bold text-white">{line.fact}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Время работы</div>
                    <div className="text-sm font-semibold text-slate-300">{line.workHours} ч</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Загрузка</div>
                    <div className="text-sm font-semibold text-slate-300">{line.utilization}%</div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ratio >= 100 ? 'bg-emerald-500' : ratio >= 95 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, ratio)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quality section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Контроль качества · {date}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Норматив брака:</span>
            <span className="font-bold text-slate-300">≤ {DEFECT_NORM}%</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {quality.map((q) => {
            const status = qualityStatus(q.defectRate);
            const exceedRatio = q.defectRate > DEFECT_NORM
              ? (q.defectRate / DEFECT_NORM).toFixed(1)
              : null;
            return (
              <div
                key={q.station}
                className={`glass-panel rounded-xl p-4 border ${statusBg(status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-white">{q.station}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${statusDot(status)} ${status === 'CRITICAL' ? 'animate-pulse-soft' : ''}`} />
                    <span className={`text-xs font-bold ${status === 'NORMAL' ? 'text-emerald-400' : status === 'WARNING' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {qualityLabel(q.defectRate)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div>
                    <div className="text-xs text-slate-500">Выпущено</div>
                    <div className="text-lg font-bold text-slate-200">{q.produced}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Брак</div>
                    <div className={`text-lg font-bold ${status === 'NORMAL' ? 'text-slate-200' : 'text-red-400'}`}>
                      {q.defects}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Доля</div>
                    <div className={`text-lg font-bold ${status === 'NORMAL' ? 'text-emerald-400' : status === 'WARNING' ? 'text-yellow-400' : 'text-red-400 text-glow-red'}`}>
                      {q.defectRate.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      status === 'NORMAL' ? 'bg-emerald-500' : status === 'WARNING' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (q.defectRate / 6) * 100)}%` }}
                  />
                </div>

                {exceedRatio && (
                  <div className="mt-3 text-xs text-red-400 font-semibold">
                    Превышение норматива в {exceedRatio} раза
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Painting critical highlight */}
      {(() => {
        const painting = quality.find((q) => q.station === 'Окраска');
        if (!painting || painting.defectRate <= DEFECT_NORM) return null;
        return (
          <div className="glass-panel rounded-xl p-5 border-red-500/30 glow-red">
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-red-400 shrink-0" size={28} />
              <div>
                <div className="text-sm font-bold text-red-400 mb-1">КРИТИЧЕСКОЕ ОТКЛОНЕНИЕ · Окраска</div>
                <div className="text-2xl font-bold text-white">
                  {painting.defectRate.toFixed(1)}%{' '}
                  <span className="text-sm text-slate-500 font-normal">при норме ≤{DEFECT_NORM}%</span>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Превышение нормативного уровня в{' '}
                  {(painting.defectRate / DEFECT_NORM).toFixed(1)}{' '}
                  раза
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Production plan */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">
          Производственный план · Месяц
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {CAR_MODELS.map((car) => (
            <div key={car.name} className="glass-panel rounded-xl p-4 group hover:border-slate-600/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
                  <Car className="text-slate-400" size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{car.name}</div>
                  <div className="text-xs text-slate-500">План / месяц</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {car.planPerMonth.toLocaleString('ru-RU')}
                <span className="text-sm text-slate-500 font-normal ml-1">авто</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-400" size={20} />
            <div>
              <div className="text-sm text-slate-500">Сумма модельного плана</div>
              <div className="text-2xl font-bold text-white">
                {totalPlan.toLocaleString('ru-RU')}{' '}
                <span className="text-sm text-slate-500 font-normal">авто</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Общий целевой показатель</div>
            <div className="text-2xl font-bold text-slate-300">
              ≥{MONTHLY_TARGET.toLocaleString('ru-RU')}{' '}
              <span className="text-sm text-slate-500 font-normal">авто</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Quality Alert - WOW element */}
      <div className="glass-panel rounded-2xl p-5 border-yellow-500/30 glow-yellow">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
            <Database className="text-yellow-400" size={24} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-yellow-400 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} />
              ТРЕБУЕТСЯ УТОЧНЕНИЕ ДАННЫХ
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Сумма модельного производственного плана составляет{' '}
              <span className="font-bold text-white">{totalPlan.toLocaleString('ru-RU')}</span>{' '}
              автомобилей, тогда как общий целевой показатель указан как{' '}
              <span className="font-bold text-white">≥{MONTHLY_TARGET.toLocaleString('ru-RU')}</span>{' '}
              автомобилей в месяц.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <span className="text-xs text-slate-500">Разница: </span>
                <span className="text-lg font-bold text-yellow-400">
                  ≥{gap.toLocaleString('ru-RU')} автомобилей
                </span>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 italic">
              TwinAI контролирует не только производство, но и качество исходных данных
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
