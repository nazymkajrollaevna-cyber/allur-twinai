import { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Loader2, Lightbulb, ShieldAlert, Clock } from 'lucide-react';
import { runAIAnalysis } from '@/utils';
import type { AIResult, DateKey } from '@/types';

interface AIAnalysisProps {
  date: DateKey;
}

const ANALYSIS_STEPS = [
  'Анализ производственных линий...',
  'Проверка качества...',
  'Анализ простоев...',
  'Поиск потенциальных узких мест...',
];

function levelConfig(level: AIResult['level']) {
  switch (level) {
    case 'КРИТИЧЕСКИЙ РИСК':
      return {
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        glow: 'glow-red',
        icon: ShieldAlert,
      };
    case 'ПОВЫШЕННЫЙ РИСК':
      return {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10 border-yellow-500/30',
        glow: 'glow-yellow',
        icon: AlertTriangle,
      };
    case 'РИСК ПРОСТОЯ':
      return {
        color: 'text-orange-400',
        bg: 'bg-orange-500/10 border-orange-500/30',
        glow: '',
        icon: Clock,
      };
  }
}

export function AIAnalysis({ date }: AIAnalysisProps) {
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [stepIdx, setStepIdx] = useState(0);
  const [results, setResults] = useState<AIResult[]>([]);

  useEffect(() => {
    if (phase === 'idle') {
      setResults([]);
      setStepIdx(0);
    }
  }, [phase]);

  const startAnalysis = () => {
    setPhase('analyzing');
    setStepIdx(0);
    setResults([]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < ANALYSIS_STEPS.length) {
        setStepIdx(step);
      } else {
        clearInterval(interval);
        setResults(runAIAnalysis(date));
        setPhase('done');
      }
    }, 900);
  };

  if (phase === 'idle') {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-blue-500/20 border border-slate-600/30 mb-4">
          <Sparkles className="text-red-400" size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">AI-анализ производственных данных</h3>
        <p className="text-sm text-slate-400 mb-5 max-w-md mx-auto">
          TwinAI последовательно проанализирует производственные линии, качество, простои и выявит
          потенциальные узкие места.
        </p>
        <button
          onClick={startAnalysis}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-base hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles size={18} />
          ЗАПУСТИТЬ AI-АНАЛИЗ
        </button>
      </div>
    );
  }

  if (phase === 'analyzing') {
    return (
      <div className="glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Loader2 className="text-red-400 animate-spin" size={24} />
          <h3 className="text-lg font-bold text-white">AI-анализ выполняется...</h3>
        </div>

        <div className="space-y-3">
          {ANALYSIS_STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 ${
                i < stepIdx
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : i === stepIdx
                    ? 'bg-slate-800/60 border-slate-600/40'
                    : 'bg-slate-800/20 border-slate-700/20 opacity-40'
              }`}
            >
              {i < stepIdx ? (
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              ) : i === stepIdx ? (
                <Loader2 className="text-red-400 animate-spin" size={18} />
              ) : (
                <span className="w-5 h-5 rounded-full border border-slate-600/40" />
              )}
              <span
                className={`text-sm ${
                  i <= stepIdx ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-500"
            style={{ width: `${((stepIdx + 1) / ANALYSIS_STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <Sparkles className="text-emerald-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Результаты AI-анализа</h3>
            <p className="text-xs text-slate-500">
              Обнаружено сигналов: {results.length} · Explainable AI
            </p>
          </div>
        </div>
        <button
          onClick={() => setPhase('idle')}
          className="px-4 py-2 rounded-lg bg-slate-800/60 text-slate-300 text-sm font-medium hover:bg-slate-700/60 transition-colors"
        >
          Повторить анализ
        </button>
      </div>

      {/* Explainable AI badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400">
          <Lightbulb size={14} /> Explainable AI
        </span>
        <span className="text-xs text-slate-500">
          Каждый сигнал отвечает на вопросы: что обнаружено, почему это риск, какой норматив, что
          рекомендуется сделать.
        </span>
      </div>

      {results.map((r, idx) => {
        const cfg = levelConfig(r.level);
        const Icon = cfg.icon;
        return (
          <div
            key={r.id}
            className={`glass-panel rounded-xl p-5 border ${cfg.bg} animate-slide-up`}
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            <div className="flex items-start gap-4">
              <div
                className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg} border ${cfg.color}`}
              >
                <Icon size={20} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-sm font-bold ${cfg.color}`}>{r.level}</span>
                  <span className="text-xs text-slate-500">Результат №{r.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
                  <div>
                    <span className="text-slate-500">Участок: </span>
                    <span className="text-slate-200 font-semibold">{r.station}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">{r.indicator}: </span>
                    <span className={`font-bold ${cfg.color}`}>{r.value}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Норматив: </span>
                    <span className="text-slate-200 font-semibold">{r.norm}</span>
                  </div>
                  {r.dynamic && (
                    <div>
                      <span className="text-slate-500">Динамика: </span>
                      <span className="text-slate-200 font-semibold">{r.dynamic}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 text-sm">
                  <div>
                    <span className="text-slate-500 font-medium">Причина сигнала: </span>
                    <span className="text-slate-300">{r.reason}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Рекомендация: </span>
                    <span className="text-slate-200">{r.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Honest AI disclaimer */}
      <div className="px-4 py-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold text-slate-400">MVP:</span> AI/аналитический модуль работает
          на предоставленных тестовых данных. На текущем этапе используются пороговый анализ, анализ
          динамики и выявление отклонений. Прогнозная ML-модель может быть подключена после накопления
          достаточного объёма исторических производственных данных.
        </p>
      </div>
    </div>
  );
}
