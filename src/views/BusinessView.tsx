import { useState, useMemo } from 'react';
import { Calculator, TrendingDown, Coins, Calendar } from 'lucide-react';

export function BusinessView() {
  const [costPerHour, setCostPerHour] = useState(1000000);
  const [downtimeHours, setDowntimeHours] = useState(40);
  const [reductionPct, setReductionPct] = useState(20);

  const calc = useMemo(() => {
    const currentLoss = downtimeHours * costPerHour;
    const preventedHours = Math.round((downtimeHours * reductionPct) / 100);
    const monthlySavings = preventedHours * costPerHour;
    const annualSavings = monthlySavings * 12;
    return { currentLoss, preventedHours, monthlySavings, annualSavings };
  }, [costPerHour, downtimeHours, reductionPct]);

  const fmt = (n: number) => n.toLocaleString('ru-RU');

  return (
    <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin h-full">
      <div className="flex items-center gap-3">
        <Calculator className="text-red-400" size={28} />
        <div>
          <h2 className="text-2xl font-bold text-white">Оценка потенциального бизнес-эффекта</h2>
          <p className="text-sm text-slate-500 mt-0.5">Сценарный калькулятор экономии от сокращения простоев</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Inputs */}
        <div className="glass-panel rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Параметры расчёта</h3>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Стоимость 1 часа простоя, ₸
            </label>
            <input
              type="number"
              value={costPerHour}
              onChange={(e) => setCostPerHour(Number(e.target.value) || 0)}
              step={100000}
              min={0}
              className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700/40 text-white text-lg font-semibold focus:border-red-500/50 focus:outline-none transition-colors"
            />
            <div className="flex gap-2 mt-2">
              {[500000, 1000000, 2000000].map((v) => (
                <button
                  key={v}
                  onClick={() => setCostPerHour(v)}
                  className="px-2.5 py-1 rounded-md text-xs bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-700/30 transition-colors"
                >
                  {fmt(v)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Простой в месяц, часов: <span className="text-white font-bold">{downtimeHours}</span>
            </label>
            <input
              type="range"
              min={0}
              max={120}
              value={downtimeHours}
              onChange={(e) => setDowntimeHours(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>0 ч</span>
              <span>120 ч</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 mb-2 block">
              Ожидаемое сокращение простоев: <span className="text-white font-bold">{reductionPct}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={50}
              value={reductionPct}
              onChange={(e) => setReductionPct(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="glass-panel rounded-2xl p-5 border-red-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="text-red-400" size={18} />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Текущие потери</span>
            </div>
            <div className="text-3xl font-bold text-red-400">
              {fmt(calc.currentLoss)} <span className="text-base text-slate-500 font-normal">₸ / месяц</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {downtimeHours} ч × {fmt(costPerHour)} ₸
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="text-emerald-400" size={18} />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Предотвращённый простой</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              {calc.preventedHours} <span className="text-base text-slate-500 font-normal">часов</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {reductionPct}% от {downtimeHours} ч
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-emerald-500/30 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="text-emerald-400" size={18} />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Потенциальная экономия</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              {fmt(calc.monthlySavings)} <span className="text-base text-slate-500 font-normal">₸ / месяц</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {calc.preventedHours} ч × {fmt(costPerHour)} ₸
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border-emerald-500/30 glow-green">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-emerald-400" size={18} />
              <span className="text-xs text-slate-500 uppercase tracking-wider">Потенциальная годовая экономия</span>
            </div>
            <div className="text-4xl font-bold text-emerald-400 text-glow-green">
              {fmt(calc.annualSavings)} <span className="text-base text-slate-500 font-normal">₸</span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {fmt(calc.monthlySavings)} ₸ × 12 месяцев
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="glass-panel rounded-xl p-4 border-slate-700/30">
        <p className="text-xs text-slate-500 leading-relaxed">
          Оценочный сценарный расчёт. Значения не являются финансовыми показателями АО «Группа компаний
          АЛЛЮР». Расчёт демонстрирует потенциальный экономический эффект от внедрения системы
          цифрового двойника на основе заданных пользователем параметров.
        </p>
      </div>
    </div>
  );
}
