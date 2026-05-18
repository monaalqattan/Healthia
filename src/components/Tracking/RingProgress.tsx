// ── MacroRing ────────────────────────────────────────────────────────────────

interface MacroRingProps {
  label: string;
  value: string;
  pct: number;
  color: string;
}

export function MacroRing({ label, value, pct, color }: MacroRingProps) {
  const size = 64;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#f4f4f5"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-zinc-700">
          {pct}%
        </span>
      </div>
      <p className="text-[11px] text-zinc-400">{label}</p>
      <p className="text-sm font-semibold text-zinc-800">{value}</p>
    </div>
  );
}

// ── WeightGoalRing ───────────────────────────────────────────────────────────

interface WeightGoalRingProps {
  pct: number;
}

export function WeightGoalRing({ pct }: WeightGoalRingProps) {
  const size = 140;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#f0fdf4"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#16a34a"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-green-700">{pct}%</span>
        <span className="text-[11px] text-zinc-400 font-medium">complete</span>
      </div>
    </div>
  );
}

// ── ProgressBar ──────────────────────────────────────────────────────────────

interface ProgressBarProps {
  pct: number;
  color: string;
}

export function ProgressBar({ pct, color }: ProgressBarProps) {
  return (
    <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
