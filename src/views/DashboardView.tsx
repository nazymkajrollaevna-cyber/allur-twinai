import { FactoryMap } from '@/components/FactoryMap';
import { KPICard } from '@/components/KPICard';
import { AIAnalysis } from '@/components/AIAnalysis';
import { calcKPI, defectExceedsNorm } from '@/utils';
import type { DateKey } from '@/types';

interface DashboardViewProps {
  date: DateKey;
}

export function DashboardView({ date }: DashboardViewProps) {
  const kpi = calcKPI(date);
  const exceed = defectExceedsNorm(date);

  return (
    <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin h-full">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            ALLUR <span className="text-red-500">TwinAI</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Цифровой двойник автомобильного завода</p>
          <p className="text-[11px] text-slate-600 mt-1">
            Показатели рассчитаны на основе предоставленного тестового набора
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-6 gap-3">
        <KPICard label="План производства" value={kpi.plan} unit="авто" accent="blue" />
        <KPICard label="Факт" value={kpi.fact} unit="авто" accent="default" />
        <KPICard
          label="Выполнение"
          value={kpi.fulfillment}
          unit="%"
          accent={kpi.fulfillment >= 95 ? 'green' : 'yellow'}
        />
        <KPICard
          label="Средняя загрузка"
          value={kpi.avgUtilization}
          unit="%"
          accent={kpi.avgUtilization >= 95 ? 'green' : 'yellow'}
        />
        <KPICard
          label="Активные отклонения"
          value={kpi.activeDeviations}
          accent={kpi.activeDeviations > 0 ? 'yellow' : 'green'}
        />
        <KPICard
          label="Критические риски"
          value={kpi.criticalRisks}
          accent={kpi.criticalRisks > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Factory map */}
      <div className="glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Технологический поток завода</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Нажмите на участок для подробной информации
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-400">Норма</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="text-slate-400">Внимание</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-slate-400">Критично</span>
            </div>
          </div>
        </div>
        <FactoryMap />
      </div>

      {/* Critical deviation highlight */}
      {exceed && (
        <div className="glass-panel rounded-2xl p-5 border-red-500/30 glow-red animate-pulse-red">
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <div className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">
                Критическое отклонение
              </div>
              <div className="text-2xl font-bold text-white">{exceed.station}</div>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <div className="text-xs text-slate-500">Текущий брак</div>
                <div className="text-4xl font-bold text-red-400 text-glow-red">
                  {exceed.rate.toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Норма</div>
                <div className="text-2xl font-bold text-slate-300">≤2%</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Превышение</div>
                <div className="text-2xl font-bold text-red-400">
                  в {exceed.exceedRatio} раза
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      <AIAnalysis date={date} />
    </div>
  );
}
