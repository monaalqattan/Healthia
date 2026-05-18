import { Droplets } from "lucide-react";
import { MacroRing } from "./RingProgress";

const macros = [
  { label: "Protein", value: "82g",  pct: 82, color: "#16a34a" },
  { label: "Carbs",   value: "198g", pct: 65, color: "#3b82f6" },
  { label: "Fat",     value: "44g",  pct: 58, color: "#f59e0b" },
];

const calories = [
  { label: "Consumed", value: "1,850 kcal", color: "text-emerald-600" },
  { label: "Burned",   value: "420 kcal",   color: "text-amber-600"   },
  { label: "Net",      value: "1,430 kcal", color: "text-zinc-700"    },
];

export function NutritionCard() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-zinc-900">Water & Nutrition</h2>

      {/* Water progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            Water
          </span>
          <span className="font-semibold text-zinc-700">1.8 / 2.5 L</span>
        </div>
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-sky-400 transition-all duration-700"
            style={{ width: "72%" }}
          />
        </div>
        <p className="text-[10px] text-zinc-400">72% of daily goal</p>
      </div>

      {/* Macro rings */}
      <div className="flex justify-around pt-1">
        {macros.map((m) => (
          <MacroRing key={m.label} {...m} />
        ))}
      </div>

      {/* Calorie summary */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {calories.map((c) => (
          <div key={c.label} className="bg-zinc-50 rounded-xl p-2.5 text-center">
            <p className="text-[10px] text-zinc-400 mb-0.5">{c.label}</p>
            <p className={`text-xs font-semibold ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
