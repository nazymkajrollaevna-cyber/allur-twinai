interface DateSwitcherProps {
  value: string;
  onChange: (date: string) => void;
}

export function DateSwitcher({ value, onChange }: DateSwitcherProps) {
  const dates = ['01.10.2026', '02.10.2026'];
  return (
    <div className="inline-flex items-center rounded-lg border border-slate-700/50 bg-slate-800/40 p-0.5">
      {dates.map((d) => (
        <button
          key={d}
          onClick={() => onChange(d)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            value === d
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {d}
        </button>
      ))}
    </div>
  );
}
