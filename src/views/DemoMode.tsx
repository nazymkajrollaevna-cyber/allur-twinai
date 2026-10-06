import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, X, Factory, TrendingUp, AlertTriangle,
  ShieldAlert, BrainCircuit, Calculator, Rocket, Sparkles,
} from 'lucide-react';
import { FactoryMap } from '@/components/FactoryMap';
import { KPICard } from '@/components/KPICard';
import { calcKPI, defectExceedsNorm } from '@/utils';
import { QUALITY_DATA, EQUIPMENT, DOWNTIME_LIMIT, CAR_MODELS, MONTHLY_TARGET } from '@/data';

interface DemoModeProps {
  onExit: () => void;
}

interface DemoStep {
  title: string;
  subtitle: string;
  icon: typeof Factory;
}

const STEPS: DemoStep[] = [
  { title: 'Цифровой двойник завода', subtitle: 'Технологический поток производства', icon: Factory },
  { title: 'Завод в цифрах', subtitle: 'Ключевые показатели производства', icon: TrendingUp },
  { title: 'TwinAI обнаруживает отклонение', subtitle: 'Участок Окраска · Критический сигнал', icon: AlertTriangle },
  { title: 'Риск критического простоя', subtitle: 'Конвейер-03 · 55 из 60 минут', icon: ShieldAlert },
  { title: 'Explainable AI', subtitle: 'Сигнал → причина → норматив → рекомендация', icon: BrainCircuit },
  { title: 'Бизнес-эффект', subtitle: 'Калькулятор потенциальной экономии', icon: Calculator },
  { title: 'Масштабирование', subtitle: 'От тестовых данных к прогнозной AI', icon: Rocket },
];

export function DemoMode({ onExit }: DemoModeProps) {
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const kpi = calcKPI('02.10.2026');
  const exceed = defectExceedsNorm('02.10.2026');
  const conveyor = EQUIPMENT.find((e) => e.id === 'Конвейер-03')!;
  const totalPlan = CAR_MODELS.reduce((s, m) => s + m.planPerMonth, 0);

  const next = () => step < total - 1 && setStep(step + 1);
  const prev = () => step > 0 && setStep(step - 1);

  const StepIcon = STEPS[step].icon;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0e17] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-800/60 bg-[#0d1320]/80">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-white">
            ALLUR <span className="text-red-500">TwinAI</span>
          </div>
          <span className="text-xs text-slate-600">Демонстрация для жюри · Тестовые данные кейса</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            Шаг {step + 1} из {total}
          </span>
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X size={16} /> Выйти
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800/60">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-12 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Step header */}
          <div className="flex items-center gap-4 mb-8 animate-fade-in" key={step}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-blue-500/20 border border-slate-600/30 flex items-center justify-center">
              <StepIcon className="text-red-400" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{STEPS[step].title}</h2>
              <p className="text-sm text-slate-500 mt-1">{STEPS[step].subtitle}</p>
            </div>
          </div>

          {/* Step content */}
          <div key={`content-${step}`} className="animate-slide-up">
            {step === 0 && (
              <div className="glass-panel rounded-2xl p-8">
                <p className="text-slate-400 text-sm mb-6">
                  Полный технологический поток: от склада комплектующих до склада готовой продукции.
                  Каждый участок кликабелен и отображает实时 статус.
                </p>
                <FactoryMap />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-6 gap-4">
                  <KPICard label="План производства" value={kpi.plan} unit="авто" accent="blue" />
                  <KPICard label="Факт" value={kpi.fact} unit="авто" />
                  <KPICard label="Выполнение" value={kpi.fulfillment} unit="%" accent="green" />
                  <KPICard label="Средняя загрузка" value={kpi.avgUtilization} unit="%" accent="green" />
                  <KPICard label="Активные отклонения" value={kpi.activeDeviations} accent="yellow" />
                  <KPICard label="Критические риски" value={kpi.criticalRisks} accent="red" />
                </div>
                <div className="glass-panel rounded-xl p-5 text-center">
                  <p className="text-sm text-slate-500">
                    Показатели рассчитаны на основе предоставленного тестового набора · Дата: 02.10.2026
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl p-8 border-red-500/30 glow-red">
                  <div className="flex items-center gap-8">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">
                        Критическое отклонение · Окраска
                      </div>
                      <div className="flex items-baseline gap-6">
                        <div>
                          <div className="text-xs text-slate-500">Показатель брака</div>
                          <div className="text-6xl font-bold text-red-400 text-glow-red animate-pulse-soft">
                            {exceed?.rate.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Норма</div>
                          <div className="text-3xl font-bold text-slate-300">≤2%</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Динамика</div>
                          <div className="text-xl font-bold text-slate-200">3.5% → {exceed?.rate.toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-red-400 font-semibold">
                        Превышение нормативного уровня в {exceed?.exceedRatio} раза
                      </div>
                    </div>
                  </div>
                </div>
                <div className="glass-panel rounded-2xl p-6">
                  <FactoryMap highlightStation="Окраска" />
                  <p className="text-xs text-slate-500 text-center mt-3">
                    Участок Окраска подсвечен как критический
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl p-8 border-red-500/30 glow-red animate-pulse-red">
                  <div className="flex items-center gap-8">
                    <div className="shrink-0 w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                      <ShieldAlert className="text-red-400" size={32} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-red-400 mb-2">
                        РИСК КРИТИЧЕСКОГО ПРОСТОЯ · Конвейер-03
                      </div>
                      <div className="flex items-baseline gap-6">
                        <div>
                          <div className="text-xs text-slate-500">Простой</div>
                          <div className="text-5xl font-bold text-red-400 text-glow-red">
                            {conveyor.downtime} / {DOWNTIME_LIMIT}
                          </div>
                          <div className="text-sm text-slate-500">минут</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Запас до лимита</div>
                          <div className="text-3xl font-bold text-red-400">
                            {DOWNTIME_LIMIT - conveyor.downtime} мин
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Прогресс</div>
                          <div className="text-3xl font-bold text-red-400">
                            {Math.round((conveyor.downtime / DOWNTIME_LIMIT) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full animate-pulse-soft"
                      style={{ width: `${(conveyor.downtime / DOWNTIME_LIMIT) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-slate-400 mt-3">
                    Причина: {conveyor.cause} · Участок: {conveyor.station}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="glass-panel rounded-xl p-3 border-blue-500/20 flex items-center gap-3">
                  <Sparkles className="text-blue-400" size={18} />
                  <span className="text-sm font-bold text-blue-400">Explainable AI</span>
                  <span className="text-xs text-slate-500">
                    Каждый сигнал отвечает на 4 вопроса: что обнаружено, почему это риск, какой норматив, что делать
                  </span>
                </div>

                {[
                  {
                    level: 'КРИТИЧЕСКИЙ РИСК',
                    color: 'text-red-400',
                    bg: 'bg-red-500/10 border-red-500/30',
                    station: 'Окраска',
                    what: 'Брак 5.2% при норме ≤2%',
                    why: 'Рост доли брака и значительное превышение порога (в 2.6 раза)',
                    norm: '≤2%',
                    action: 'Внеплановая проверка параметров процесса окраски и состояния оборудования',
                  },
                  {
                    level: 'ПОВЫШЕННЫЙ РИСК',
                    color: 'text-yellow-400',
                    bg: 'bg-yellow-500/10 border-yellow-500/30',
                    station: 'Сварка',
                    what: 'Брак 2.7% при норме ≤2%',
                    why: 'Превышение нормативного порога брака',
                    norm: '≤2%',
                    action: 'Проверить причины снижения качества и сопоставить с событиями оборудования',
                  },
                  {
                    level: 'РИСК ПРОСТОЯ',
                    color: 'text-orange-400',
                    bg: 'bg-orange-500/10 border-orange-500/30',
                    station: 'Конвейер-03',
                    what: 'Простой 55 мин из 60 мин лимита',
                    why: 'Простой приближается к критическому лимиту',
                    norm: '≤60 мин',
                    action: 'Приоритизировать диагностику конвейера',
                  },
                ].map((s, i) => (
                  <div key={i} className={`glass-panel rounded-xl p-5 border ${s.bg}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-sm font-bold ${s.color}`}>{s.level}</span>
                      <span className="text-sm text-slate-300 font-semibold">· {s.station}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-slate-500">Что обнаружено: </span>
                        <span className="text-slate-200 font-semibold">{s.what}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Норматив: </span>
                        <span className="text-slate-200 font-semibold">{s.norm}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Почему это риск: </span>
                        <span className="text-slate-300">{s.why}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Рекомендация: </span>
                        <span className="text-slate-200">{s.action}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Data quality alert */}
                <div className="glass-panel rounded-xl p-5 border-yellow-500/30 glow-yellow">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="text-yellow-400" size={18} />
                    <span className="text-sm font-bold text-yellow-400">AI Data Quality Alert</span>
                  </div>
                  <div className="text-sm text-slate-300">
                    Сумма модельного плана: <span className="font-bold text-white">{totalPlan.toLocaleString('ru-RU')}</span> авто
                    vs целевой показатель: <span className="font-bold text-white">≥{MONTHLY_TARGET.toLocaleString('ru-RU')}</span> авто
                  </div>
                  <div className="text-sm text-yellow-400 mt-1">
                    Разница: ≥{(MONTHLY_TARGET - totalPlan).toLocaleString('ru-RU')} автомобилей · Требуется уточнение данных
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="glass-panel rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Параметры</div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                          <span className="text-sm text-slate-400">Стоимость 1 часа простоя</span>
                          <span className="text-lg font-bold text-white">1 000 000 ₸</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                          <span className="text-sm text-slate-400">Простой в месяц</span>
                          <span className="text-lg font-bold text-white">40 часов</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                          <span className="text-sm text-slate-400">Сокращение простоев</span>
                          <span className="text-lg font-bold text-white">20%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl p-5 bg-red-500/10 border border-red-500/20">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Текущие потери</div>
                      <div className="text-3xl font-bold text-red-400">40 000 000 ₸</div>
                      <div className="text-xs text-slate-500">40 ч × 1 000 000 ₸</div>
                    </div>
                    <div className="rounded-xl p-5 bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Экономия / месяц</div>
                      <div className="text-3xl font-bold text-emerald-400">8 000 000 ₸</div>
                      <div className="text-xs text-slate-500">8 часов × 1 000 000 ₸</div>
                    </div>
                    <div className="rounded-xl p-5 bg-emerald-500/15 border border-emerald-500/30 glow-green">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Годовая экономия</div>
                      <div className="text-4xl font-bold text-emerald-400 text-glow-green">96 000 000 ₸</div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 text-xs text-slate-600 text-center">
                  Оценочный сценарный расчёт. Значения не являются финансовыми показателями АО «Группа компаний АЛЛЮР».
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl p-8">
                  <div className="space-y-4">
                    {[
                      { label: 'Тестовые данные', sub: 'Текущий MVP', icon: '📊', color: 'text-blue-400' },
                      { label: 'Реальные системы предприятия', sub: 'ERP · SCADA · Качество', icon: '🔌', color: 'text-slate-300' },
                      { label: 'Near real-time digital twin', sub: 'Потоковая обработка данных', icon: '⚡', color: 'text-yellow-400' },
                      { label: 'Predictive AI', sub: 'Прогнозная ML-модель', icon: '🧠', color: 'text-emerald-400' },
                    ].map((s, i, arr) => (
                      <div key={i}>
                        <div className="glass-panel-light rounded-xl p-5 flex items-center gap-4">
                          <span className="text-3xl">{s.icon}</span>
                          <div className="flex-1">
                            <div className={`text-lg font-bold ${s.color}`}>{s.label}</div>
                            <div className="text-sm text-slate-500">{s.sub}</div>
                          </div>
                          {i === 0 && (
                            <span className="text-xs text-blue-400 font-bold px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30">
                              МЫ ЗДЕСЬ
                            </span>
                          )}
                        </div>
                        {i < arr.length - 1 && (
                          <div className="flex items-center justify-center py-2">
                            <ChevronDown className="text-slate-600" size={20} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final message */}
                <div className="glass-panel rounded-2xl p-10 text-center border-red-500/20 glow-red">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    ALLUR <span className="text-red-500">TwinAI</span>
                  </h2>
                  <div className="space-y-1 text-lg text-slate-300">
                    <div>Видеть завод.</div>
                    <div>Понимать риски.</div>
                    <div>Предотвращать простои.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between px-12 py-5 border-t border-slate-800/60 bg-[#0d1320]/80">
        <button
          onClick={prev}
          disabled={step === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800/60 text-slate-300 text-sm font-medium hover:bg-slate-700/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} /> Назад
        </button>

        <div className="flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-red-500' : i < step ? 'w-2 bg-emerald-500' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {step < total - 1 ? (
          <button
            onClick={next}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold hover:from-red-500 hover:to-red-400 transition-all shadow-lg shadow-red-500/20"
          >
            Далее <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            Завершить демо
          </button>
        )}
      </div>
    </div>
  );
}

function ChevronDown({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
