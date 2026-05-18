import { CheckCircle2 } from "lucide-react";
import type { AchievementData } from "../types";
import { ProgressBar } from "./RingProgress";

interface AchievementsCardProps {
  items: AchievementData[];
}

export function AchievementsCard({ items }: AchievementsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5">
      <h2 className="text-sm font-semibold text-zinc-900 mb-4">Goals & Achievements</h2>

      <div className="grid grid-cols-4 gap-3">
        {items.map((a) => (
          <div key={a.title} className={`${a.bg} rounded-2xl p-4 flex flex-col gap-3`}>
            {/* Icon row */}
            <div className="flex items-center justify-between">
              <a.icon className={`w-5 h-5 ${a.iconColor}`} />
              {a.pct === 100 && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </div>

            {/* Text */}
            <div>
              <p className="text-sm font-semibold text-zinc-800">{a.title}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{a.desc}</p>
            </div>

            {/* Progress indicator */}
            {a.streak ? (
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-sm"
                    style={{ background: a.color }}
                  />
                ))}
              </div>
            ) : (
              <ProgressBar pct={a.pct} color={a.color} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
