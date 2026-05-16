// src/features/diet-plan/components/Ring.tsx
// يعتمد على: types → RingProps | constants → RING_RADIUS

import type { RingProps } from "../types";
import { RING_RADIUS } from "../constants";

export default function Ring({ value, unit, offset = 0 }: RingProps) {
  const circumference = 2 * Math.PI * RING_RADIUS;
  return (
    <div className="ring-wrap">
      <svg width={70} height={70} viewBox="0 0 64 64">
        <circle cx={32} cy={32} r={RING_RADIUS} fill="none" stroke="var(--g100)" strokeWidth={6} />
        <circle
          cx={32} cy={32} r={RING_RADIUS}
          fill="none" stroke="var(--g600)" strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="ring-center">
        <div className="ring-value">{value}</div>
        <div className="ring-unit">{unit}</div>
      </div>
    </div>
  );
}