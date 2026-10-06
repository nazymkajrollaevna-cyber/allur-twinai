import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, ReferenceLine,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Area, AreaChart, Cell,
} from 'recharts';
import { PRODUCTION_DATA, QUALITY_DATA, EQUIPMENT, DATES, DEFECT_NORM } from '@/data';
import { DateSwitcher } from '@/components/DateSwitcher';
import type { DateKey } from '@/types';

type Metric = 'plan-fact' | 'utilization' | 'defects' | 'downtime';

const METRICS: { id: Metric; label: string }[] = [
  { id: 'plan-fact', label: 'План vs Факт' },
  { id: 'utilization', label: 'Загрузка оборудования' },
  { id: 'defects', label: 'Процент брака' },
  { id: 'downtime', label: 'Простои' },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg p-3 text-xs border border-slate-600/40">
      <div className="text-slate-400 mb-1.5 font-semibold">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-slate-300">
            {p.name}: <span className="font-bold text-white">{p.value}{p.unit || ''}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsView() {
  const [metric, setMetric] = useState<Metric>('plan-fact');

  const planFactData = useMemo(() => {
    return DATES.map((d) => {
      const prod = PRODUCTION_DATA[d];
      return {
        date: d,
        'Сварка-1 План': prod[0].plan,
        'Сварка-1 Факт': prod[0].fact,
        'Окраска-1 План': prod[1].plan,
        'Окраска-1 Факт': prod[1].fact,
        'Сборка-1 План': prod[2].plan,
        'Сборка-1 Факт': prod[2].fact,
      };
    });
  }, []);

  const utilizationData = useMemo(() => {
    return DATES.map((d) => {
      const prod = PRODUCTION_DATA[d];
      return {
        date: d,
        'Сварка-1': prod[0].utilization,
        'Окраска-1': prod[1].utilization,
        'Сборка-1': prod[2].utilization,
      };
    });
  }, []);

  const defectData = useMemo(() => {
    return DATES.map((d) => {
      const q = QUALITY_DATA[d];
      return {
        date: d,
        'Сварка': q[0].defectRate,
        'Окраска': q[1].defectRate,
        'Сборка': q[2].defectRate,
      };
    });
  }, []);

  const downtimeData = useMemo(() => {
    return EQUIPMENT.map((e) => ({
      name: e.id,
      downtime: e.downtime,
      status: e.status,
    }));
  }, []);

  return (
    <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin h-full">
      <div>
        <h2 className="text-2xl font-bold text-white">Аналитика</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Интерактивные графики · Данные за 01.10.2026 — 02.10.2026
        </p>
      </div>

      {/* Metric filter */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 uppercase tracking-wider">Показатель:</span>
        <div className="flex flex-wrap gap-2">
          {METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                metric === m.id
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-slate-800/40 text-slate-400 border border-slate-700/30 hover:text-slate-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="glass-panel rounded-2xl p-5">
        {metric === 'plan-fact' && (
          <>
            <h3 className="text-sm font-bold text-slate-300 mb-4">План vs Факт по участкам</h3>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={planFactData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Bar dataKey="Сварка-1 План" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Сварка-1 Факт" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Окраска-1 План" fill="#4a1e1e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Окраска-1 Факт" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Сборка-1 План" fill="#1e3a1e" radius={[3, 3, 0, 0]} />
                <Bar dataKey="Сборка-1 Факт" fill="#22c55e" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {metric === 'utilization' && (
          <>
            <h3 className="text-sm font-bold text-slate-300 mb-4">Загрузка оборудования (%)</h3>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={utilizationData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[80, 105]} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Area type="monotone" dataKey="Сварка-1" stroke="#3b82f6" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="Окраска-1" stroke="#ef4444" fill="url(#g2)" strokeWidth={2} />
                <Area type="monotone" dataKey="Сборка-1" stroke="#22c55e" fill="url(#g3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </>
        )}

        {metric === 'defects' && (
          <>
            <h3 className="text-sm font-bold text-slate-300 mb-4">
              Процент брака по участкам · Норма {DEFECT_NORM}%
            </h3>
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={defectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit="%" />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <ReferenceLine
                  y={DEFECT_NORM}
                  stroke="#22c55e"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  label={{ value: `НОРМА ${DEFECT_NORM}%`, fill: '#22c55e', fontSize: 11, position: 'right' }}
                />
                <Line type="monotone" dataKey="Сварка" stroke="#eab308" strokeWidth={2.5} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="Окраска" stroke="#ef4444" strokeWidth={3} dot={{ r: 6 }} />
                <Line type="monotone" dataKey="Сборка" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {metric === 'downtime' && (
          <>
            <h3 className="text-sm font-bold text-slate-300 mb-4">
              Простои оборудования (мин) · Лимит {60} мин
            </h3>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={downtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} unit=" мин" />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine
                  y={60}
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  label={{ value: 'ЛИМИТ 60', fill: '#ef4444', fontSize: 11, position: 'right' }}
                />
                <Bar dataKey="downtime" radius={[4, 4, 0, 0]}>
                  {downtimeData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.status === 'Critical' ? '#ef4444' : entry.status === 'Warning' ? '#eab308' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>

      {/* Data summary table */}
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-300 mb-4">Сводная таблица</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-slate-700/40">
                <th className="pb-2 pr-4">Дата</th>
                <th className="pb-2 pr-4">Участок</th>
                <th className="pb-2 pr-4">План</th>
                <th className="pb-2 pr-4">Факт</th>
                <th className="pb-2 pr-4">Загрузка</th>
                <th className="pb-2 pr-4">Брак</th>
              </tr>
            </thead>
            <tbody>
              {DATES.map((d) =>
                PRODUCTION_DATA[d].map((line, i) => {
                  const q = QUALITY_DATA[d][i];
                  return (
                    <tr key={`${d}-${line.name}`} className="border-b border-slate-800/40 hover:bg-slate-800/20">
                      <td className="py-2 pr-4 text-slate-400">{d}</td>
                      <td className="py-2 pr-4 text-slate-200 font-medium">{line.name}</td>
                      <td className="py-2 pr-4 text-slate-300">{line.plan}</td>
                      <td className="py-2 pr-4 text-slate-300">{line.fact}</td>
                      <td className="py-2 pr-4 text-slate-300">{line.utilization}%</td>
                      <td className={`py-2 pr-4 font-semibold ${q.defectRate > DEFECT_NORM ? 'text-red-400' : 'text-emerald-400'}`}>
                        {q.defectRate.toFixed(1)}%
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


