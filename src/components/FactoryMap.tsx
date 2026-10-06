import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { STATIONS } from '@/data';
import type { FactoryStation, StationStatus } from '@/types';
import { statusColor, statusBg, statusGlow, statusDot } from './statusUtils';

interface FactoryMapProps {
  highlightStation?: string;
  onStationClick?: (station: FactoryStation) => void;
}

const STATION_ICONS: Record<string, string> = {
  'warehouse-in': '📦',
  welding: '🔥',
  painting: '🎨',
  assembly: '🔧',
  quality: '✓',
  'warehouse-out': '🚚',
};

function statusFill(status: StationStatus): string {
  switch (status) {
    case 'NORMAL':
      return '#22c55e';
    case 'WARNING':
      return '#eab308';
    case 'CRITICAL':
      return '#ef4444';
  }
}

export function FactoryMap({ highlightStation, onStationClick }: FactoryMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<FactoryStation | null>(null);

  const stationWidth = 150;
  const stationHeight = 100;
  const gap = 50;
  const totalWidth = STATIONS.length * stationWidth + (STATIONS.length - 1) * gap;
  const svgHeight = 200;
  const y = 50;

  const positions = STATIONS.map((_, i) => ({
    x: i * (stationWidth + gap) + 10,
    y,
  }));

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${totalWidth + 20} ${svgHeight}`}
        className="w-full"
        style={{ maxHeight: '260px' }}
      >
        <defs>
          <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#eab308" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines with flowing animation */}
        {positions.slice(0, -1).map((pos, i) => {
          const next = positions[i + 1];
          const midY = pos.y + stationHeight / 2;
          return (
            <g key={`conn-${i}`}>
              <line
                x1={pos.x + stationWidth}
                y1={midY}
                x2={next.x}
                y2={midY}
                stroke="#1e293b"
                strokeWidth="2"
              />
              <line
                x1={pos.x + stationWidth}
                y1={midY}
                x2={next.x}
                y2={midY}
                stroke="url(#flowGrad)"
                strokeWidth="2"
                strokeDasharray="8 6"
                className="animate-flow"
              />
              {/* Arrow */}
              <polygon
                points={`${next.x - 8},${midY - 5} ${next.x},${midY} ${next.x - 8},${midY + 5}`}
                fill="#475569"
              />
            </g>
          );
        })}

        {/* Station nodes */}
        {STATIONS.map((station, i) => {
          const pos = positions[i];
          const isHovered = hovered === station.id;
          const isHighlighted = highlightStation === station.name;
          const fill = statusFill(station.status);
          const scale = isHovered || isHighlighted ? 1.05 : 1;
          const opacity = isHovered ? 1 : 0.92;

          return (
            <g
              key={station.id}
              transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
              transform-origin={`${stationWidth / 2} ${stationHeight / 2}`}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              onMouseEnter={() => setHovered(station.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => {
                setSelected(station);
                onStationClick?.(station);
              }}
            >
              {/* Background */}
              <rect
                width={stationWidth}
                height={stationHeight}
                rx="10"
                fill="#111827"
                stroke={fill}
                strokeWidth={isHovered || isHighlighted ? 2 : 1.5}
                opacity={opacity}
                filter={isHovered || isHighlighted ? 'url(#glow)' : undefined}
              />

              {/* Top accent line */}
              <rect width={stationWidth} height="3" rx="10" fill={fill} opacity="0.8" />

              {/* Status dot */}
              <circle
                cx="16"
                cy="18"
                r="5"
                fill={fill}
                className={station.status === 'CRITICAL' ? 'animate-pulse-soft' : ''}
              />

              {/* Station icon */}
              <text
                x={stationWidth - 20}
                y="24"
                fontSize="20"
                textAnchor="middle"
                opacity="0.5"
              >
                {STATION_ICONS[station.id] || '⚙'}
              </text>

              {/* Station name */}
              <text
                x="28"
                y="50"
                fontSize="13"
                fontWeight="700"
                fill="#f1f5f9"
                fontFamily="Inter, sans-serif"
              >
                {station.shortName.toUpperCase()}
              </text>

              {/* Status text */}
              <text
                x="28"
                y="68"
                fontSize="10"
                fontWeight="600"
                fill={fill}
                fontFamily="Inter, sans-serif"
              >
                {station.status}
              </text>

              {/* Mini metrics */}
              {station.metrics.slice(0, 2).map((m, mi) => (
                <text
                  key={mi}
                  x="28"
                  y={82 + mi * 11}
                  fontSize="9"
                  fill="#64748b"
                  fontFamily="Inter, sans-serif"
                >
                  {m.label}: {m.value}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Station detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass-panel rounded-2xl p-6 w-[420px] animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className={`w-3 h-3 rounded-full ${statusDot(selected.status)}`} />
                  <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                </div>
                <span
                  className={`inline-block text-xs font-bold px-2 py-0.5 rounded border ${statusBg(
                    selected.status,
                  )}`}
                >
                  {selected.status}
                </span>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-400 mb-4">{selected.description}</p>

            <div className="space-y-2">
              {selected.metrics.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30"
                >
                  <span className="text-xs text-slate-500">{m.label}</span>
                  <span className="text-sm font-semibold text-slate-200">{m.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full mt-5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/60 text-slate-300 text-sm font-medium hover:bg-slate-700/60 transition-colors"
            >
              Закрыть
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
