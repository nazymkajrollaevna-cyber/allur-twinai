import {
  Cpu, Database, ShieldCheck, Layers, BrainCircuit,
  Monitor, Bell, ArrowDown, Server, Wifi, Zap,
} from 'lucide-react';

export function ArchitectureView() {
  const inputSources = [
    { icon: Cpu, label: 'ДАТЧИКИ / PLC', sub: 'IIoT телеметрия' },
    { icon: Database, label: 'ERP', sub: 'Планы, заказы' },
    { icon: ShieldCheck, label: 'СИСТЕМА КАЧЕСТВА', sub: 'Контроль брака' },
  ];

  const pipeline = [
    { icon: Layers, label: 'СЛОЙ СБОРА ДАННЫХ', sub: 'ETL · нормализация · потоковая обработка' },
    { icon: Server, label: 'ALLUR DIGITAL TWIN', sub: 'Модель производства в реальном времени' },
    { icon: BrainCircuit, label: 'ANALYTICS + AI', sub: 'Пороговый анализ · прогнозная модель' },
    { icon: Monitor, label: 'DASHBOARD РУКОВОДИТЕЛЯ', sub: 'KPI · карта завода · отклонения' },
  ];

  const outputs = ['ПРЕДУПРЕЖДЕНИЯ', 'ПРОГНОЗЫ', 'РЕКОМЕНДАЦИИ'];

  return (
    <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin h-full">
      <div>
        <h2 className="text-2xl font-bold text-white">Архитектура</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Схема системы цифрового двойника · Текущий MVP и будущая версия
        </p>
      </div>

      {/* Architecture diagram */}
      <div className="glass-panel rounded-2xl p-8">
        {/* Input sources */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {inputSources.map((src) => {
            const Icon = src.icon;
            return (
              <div key={src.label} className="glass-panel-light rounded-xl p-4 text-center">
                <Icon className="text-blue-400 mx-auto mb-2" size={28} />
                <div className="text-sm font-bold text-white">{src.label}</div>
                <div className="text-xs text-slate-500 mt-1">{src.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Plus signs */}
        <div className="flex items-center justify-center gap-16 mb-2">
          {inputSources.slice(1).map((_, i) => (
            <span key={i} className="text-slate-600 text-xl font-bold">+</span>
          ))}
          <span className="text-slate-600 text-xl font-bold">=</span>
        </div>

        <ArrowDown className="text-slate-600 mx-auto mb-4" size={24} />

        {/* Pipeline */}
        <div className="space-y-3">
          {pipeline.map((stage, i) => {
            const Icon = stage.icon;
            return (
              <div key={stage.label}>
                <div className="glass-panel-light rounded-xl p-4 flex items-center gap-4 hover:border-slate-600/50 transition-all">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
                    <Icon className="text-red-400" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">{stage.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{stage.sub}</div>
                  </div>
                  <div className="text-xs text-slate-600">Уровень {i + 1}</div>
                </div>
                {i < pipeline.length - 1 && (
                  <ArrowDown className="text-slate-700 mx-auto my-1" size={18} />
                )}
              </div>
            );
          })}
        </div>

        <ArrowDown className="text-slate-600 mx-auto mb-4" size={24} />

        {/* Outputs */}
        <div className="grid grid-cols-3 gap-4">
          {outputs.map((out, i) => {
            const Icon = i === 0 ? Bell : i === 1 ? Zap : BrainCircuit;
            return (
              <div
                key={out}
                className="glass-panel-light rounded-xl p-4 text-center border-red-500/20"
              >
                <Icon className="text-red-400 mx-auto mb-2" size={24} />
                <div className="text-sm font-bold text-white">{out}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current vs Future */}
      <div className="grid grid-cols-2 gap-5">
        <div className="glass-panel rounded-2xl p-6 border-blue-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
              <Wifi className="text-blue-400" size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">ТЕКУЩИЙ MVP</div>
              <div className="text-xs text-slate-500">Тестовые данные</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              Локальный typed mock/test dataset
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              Пороговый анализ и анализ динамики
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              Explainable AI — объяснимые сигналы
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              Интерактивный dashboard для демонстрации
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-2xl p-6 border-emerald-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="text-emerald-400" size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">БУДУЩАЯ ВЕРСИЯ</div>
              <div className="text-xs text-slate-500">Подключение к реальным системам</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Подключение к промышленным системам в near real-time
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Интеграция с ERP, SCADA, системами качества
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Прогнозная ML-модель на исторических данных
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              Автоматические уведомления и рекомендации
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
