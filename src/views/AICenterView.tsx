import { BrainCircuit, Lightbulb, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { QUALITY_DATA, EQUIPMENT, DEFECT_NORM } from '@/data';

interface RiskCard {
  station: string;
  level: 'ВЫСОКИЙ' | 'СРЕДНИЙ' | 'НИЗКИЙ';
  reason: string;
  color: string;
  bg: string;
  border: string;
}

const riskConfig = {
  ВЫСОКИЙ: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', glow: 'glow-red' },
  СРЕДНИЙ: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', glow: 'glow-yellow' },
  НИЗКИЙ: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: '' },
};

export function AICenterView() {
  const date = '02.10.2026';
  const quality = QUALITY_DATA[date];

  const riskCards: RiskCard[] = [
    {
      station: 'Окраска',
      level: 'ВЫСОКИЙ',
      reason: `Брак ${quality[1].defectRate.toFixed(1)}% при норме ≤${DEFECT_NORM}%`,
      color: riskConfig['ВЫСОКИЙ'].color,
      bg: riskConfig['ВЫСОКИЙ'].bg,
      border: riskConfig['ВЫСОКИЙ'].border,
    },
    {
      station: 'Сварка',
      level: 'СРЕДНИЙ',
      reason: `Брак ${quality[0].defectRate.toFixed(1)}% при норме ≤${DEFECT_NORM}%`,
      color: riskConfig['СРЕДНИЙ'].color,
      bg: riskConfig['СРЕДНИЙ'].bg,
      border: riskConfig['СРЕДНИЙ'].border,
    },
    {
      station: 'Конвейер-03',
      level: 'ВЫСОКИЙ',
      reason: 'Простой 55 мин из 60 мин лимита',
      color: riskConfig['ВЫСОКИЙ'].color,
      bg: riskConfig['ВЫСОКИЙ'].bg,
      border: riskConfig['ВЫСОКИЙ'].border,
    },
    {
      station: 'Сборка',
      level: 'НИЗКИЙ',
      reason: `Брак ${quality[2].defectRate.toFixed(1)}% в пределах нормы`,
      color: riskConfig['НИЗКИЙ'].color,
      bg: riskConfig['НИЗКИЙ'].bg,
      border: riskConfig['НИЗКИЙ'].border,
    },
  ];

  // Risk matrix: likelihood vs impact
  const matrixItems = [
    { name: 'Окраска', x: 4, y: 4, level: 'ВЫСОКИЙ' },
    { name: 'Конвейер-03', x: 3, y: 4, level: 'ВЫСОКИЙ' },
    { name: 'Сварка', x: 3, y: 2, level: 'СРЕДНИЙ' },
    { name: 'Сборка', x: 1, y: 1, level: 'НИЗКИЙ' },
  ] as const;

  return (
    <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin h-full">
      <div className="flex items-center gap-3">
        <BrainCircuit className="text-red-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-white">AI-центр прогнозирования</h2>
          <p className="text-sm text-slate-500 mt-0.5">Демонстрационный прогноз MVP · Explainable AI</p>
        </div>
      </div>

      {/* Risk cards */}
      <div className="grid grid-cols-4 gap-4">
        {riskCards.map((card) => {
          const cfg = riskConfig[card.level];
          return (
            <div key={card.station} className={`glass-panel rounded-xl p-4 border ${cfg.border} ${cfg.glow}`}>
              <div className="text-sm font-bold text-white mb-2">{card.station}</div>
              <div className={`text-xs font-bold ${cfg.color} mb-2`}>
                РИСК: {card.level}
              </div>
              <div className="text-xs text-slate-500">{card.reason}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Risk Matrix */}
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <Target size={16} className="text-red-400" />
            Risk Matrix · Вероятность × Влияние
          </h3>
          <div className="relative">
            <div className="grid grid-cols-5 gap-1.5 mb-1.5">
              {[5, 4, 3, 2, 1].map((y) => (
                <div key={y} className="contents">
                  {[1, 2, 3, 4, 5].map((x) => {
                    const item = matrixItems.find((m) => m.x === x && m.y === y);
                    const score = x * y;
                    let cellBg = 'bg-slate-800/30 border-slate-700/20';
                    if (score >= 12) cellBg = 'bg-red-500/10 border-red-500/20';
                    else if (score >= 6) cellBg = 'bg-yellow-500/10 border-yellow-500/20';
                    else cellBg = 'bg-emerald-500/10 border-emerald-500/20';

                    return (
                      <div
                        key={`${x}-${y}`}
                        className={`relative h-16 rounded-lg border ${cellBg} flex items-center justify-center`}
                      >
                        {item && (
                          <div
                            className={`absolute inset-1 rounded-md flex flex-col items-center justify-center text-center ${
                              item.level === 'ВЫСОКИЙ'
                                ? 'bg-red-500/20 border border-red-500/40'
                                : item.level === 'СРЕДНИЙ'
                                  ? 'bg-yellow-500/20 border border-yellow-500/40'
                                  : 'bg-emerald-500/20 border border-emerald-500/40'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-white leading-tight">{item.name}</span>
                            <span
                              className={`text-[8px] ${
                                item.level === 'ВЫСОКИЙ'
                                  ? 'text-red-400'
                                  : item.level === 'СРЕДНИЙ'
                                    ? 'text-yellow-400'
                                    : 'text-emerald-400'
                              }`}
                            >
                              {item.level}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            {/* Axis labels */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-slate-600">Низкая ← Вероятность → Высокая</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-600 rotate-[-90px] origin-left">Влияние →</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500/40" />
              <span className="text-slate-400">Высокий риск</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500/40" />
              <span className="text-slate-400">Средний</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/40" />
              <span className="text-slate-400">Низкий</span>
            </div>
          </div>
        </div>

        {/* Bottleneck analysis */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border-red-500/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-400" size={18} />
              <h3 className="text-sm font-bold text-white">Потенциальное узкое место</h3>
            </div>
            <div className="text-xl font-bold text-red-400 mb-3">Окраска</div>

            <div className="space-y-2 mb-4">
              <div className="text-xs text-slate-500 uppercase tracking-wider">Причины:</div>
              <ul className="space-y-1.5 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  брак {quality[1].defectRate.toFixed(1)}%
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  рост относительно предыдущего дня (3.5% → {quality[1].defectRate.toFixed(1)}%)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  событие обслуживания Камера-02
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Рекомендация:</div>
              <p className="text-sm text-slate-200">
                «Проверить параметры окрасочного процесса до следующей производственной смены».
              </p>
            </div>
          </div>

          {/* AI disclaimer */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-400">Explainable AI · Аналитическая гипотеза</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Формулировка является аналитической гипотезой на основе тестовых данных. Не утверждается
              причинно-следственная связь, не подтверждённая данными. MVP использует пороговый анализ и
              анализ динамики. Прогнозная ML-модель может быть подключена после накопления исторических
              данных.
            </p>
          </div>

          {/* Forecast badge */}
          <div className="glass-panel rounded-xl p-4 border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-300">Демонстрационный прогноз MVP</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">Прогноз на смену:</span>
                <div className="text-slate-200 font-semibold">Риск роста брака Окраска</div>
              </div>
              <div>
                <span className="text-slate-500">Уверенность:</span>
                <div className="text-slate-200 font-semibold">Качественная оценка</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
