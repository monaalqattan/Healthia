import type { StatCardData } from "../types";

export function StatCard({ icon: Icon, label, value, unit, color }: StatCardData) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-zinc-100 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-[11px] text-zinc-400 font-medium tracking-wide uppercase">{label}</p>
      <p className="text-2xl font-semibold text-zinc-900 leading-none">
        {value}
        {unit && <span className="text-sm font-normal text-zinc-400 ml-1">{unit}</span>}
      </p>
    </div>
  );
}
