"use client";

import { Moon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { SleepPoint } from "../types";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function SleepTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-zinc-600">{label}</p>
      <p className="text-violet-500 font-medium">{payload[0]?.value.toFixed(1)} hrs</p>
    </div>
  );
}

const sleepStats = [
  { label: "Deep Sleep", value: "1.8 hrs", color: "text-violet-600" },
  { label: "REM",        value: "1.4 hrs", color: "text-blue-500"   },
  { label: "Sleep Score",value: "84/100",  color: "text-emerald-600"},
];

interface SleepCardProps {
  data: SleepPoint[];
}

export function SleepCard({ data }: SleepCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
          <Moon className="w-4 h-4 text-violet-500" />
          Sleep Tracking
        </h2>
        <span className="text-xs px-2.5 py-1 bg-violet-50 text-violet-700 rounded-full font-semibold">
          7.2 hrs avg
        </span>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: -30, bottom: 0 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 10]}
            tickFormatter={(v) => `${v}h`}
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip content={<SleepTooltip />} />
          <ReferenceLine
            y={8}
            stroke="#7c3aed"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            strokeOpacity={0.5}
          />
          <Bar dataKey="hours" fill="#a78bfa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {sleepStats.map((s) => (
          <div key={s.label} className="bg-zinc-50 rounded-xl p-2.5 text-center">
            <p className="text-[10px] text-zinc-400 mb-0.5">{s.label}</p>
            <p className={`text-xs font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
