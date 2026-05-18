"use client";

import { TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Range, WeightPoint } from "../types";
import { WeightGoalRing } from "./RingProgress";

// ── Tooltip ──────────────────────────────────────────────────────────────────

function WeightTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-zinc-600 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value.toFixed(1)} kg
        </p>
      ))}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface WeightSectionProps {
  data: WeightPoint[];
  range: Range;
  onRangeChange: (r: Range) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function WeightSection({ data, range, onRangeChange }: WeightSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Chart card */}
      <div className="col-span-2 bg-white rounded-2xl border border-zinc-100 p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Weight Progress</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Change:{" "}
              <span className="text-emerald-600 font-semibold">
                <TrendingDown className="inline w-3 h-3 mr-0.5" />
                −2.4 kg (1.2%)
              </span>
            </p>
          </div>

          {/* Range toggle */}
          <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-100 rounded-xl p-1">
            {(["week", "month", "3m"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                  range === r
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {r === "3m" ? "3M" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-zinc-400 mb-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" />
            Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-px bg-blue-400 inline-block rounded border-t border-dashed border-blue-400" />
            Target
          </span>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}kg`}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<WeightTooltip />} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#16a34a", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#60a5fa"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Goal ring card */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 self-start">Weight Goal</h2>
        <WeightGoalRing pct={75} />
        <div className="text-center space-y-3 w-full">
          <p className="text-xs text-zinc-400 leading-relaxed">
            2.6 kg away from target of{" "}
            <span className="font-semibold text-zinc-700">68 kg</span>
          </p>
          <button className="w-full py-2 rounded-xl text-xs font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-colors duration-150">
            Adjust Goal Details
          </button>
        </div>
      </div>
    </div>
  );
}
