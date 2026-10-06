import {
  LayoutDashboard,
  Factory,
  Wrench,
  BarChart3,
  AlertTriangle,
  BrainCircuit,
  Calculator,
  Network,
  Play,
} from 'lucide-react';
import type { ViewId } from '@/types';

interface SidebarProps {
  current: ViewId;
  onNavigate: (view: ViewId) => void;
  onDemo: () => void;
}

const NAV_ITEMS: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'home', label: 'Главная', icon: LayoutDashboard },
  { id: 'production', label: 'Производство', icon: Factory },
  { id: 'equipment', label: 'Оборудование', icon: Wrench },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  { id: 'incidents', label: 'Инциденты', icon: AlertTriangle },
  { id: 'ai-center', label: 'AI-центр', icon: BrainCircuit },
  { id: 'business', label: 'Бизнес-эффект', icon: Calculator },
  { id: 'architecture', label: 'Архитектура', icon: Network },
];

export function Sidebar({ current, onNavigate, onDemo }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 h-full flex flex-col border-r border-slate-800/80 bg-[#0d1320]/90 backdrop-blur-sm">
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="text-xl font-bold tracking-tight text-white">
          ALLUR <span className="text-red-500">TwinAI</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 leading-tight">
          Цифровой двойник
          <br />
          автомобильного завода
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon
                size={18}
                className={active ? 'text-red-400' : 'text-slate-500 group-hover:text-slate-300'}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-3">
        <div className="px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-xs text-slate-400">Система активна</span>
          </div>
          <div className="text-[10px] text-slate-600 mt-1 pl-4">Тестовые данные кейса</div>
        </div>

        <button
          onClick={onDemo}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play size={16} fill="currentColor" />
          ДЕМО ДЛЯ ЖЮРИ
        </button>
      </div>
    </aside>
  );
}
