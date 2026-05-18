import { Sparkles } from "lucide-react";

const insights = [
  "Adherence is exceptional on weekdays (98%), but dips slightly on weekends. Consider meal prepping on Saturdays.",
  "Sodium intake decreased by 15% this week, positively impacting water retention metrics.",
  "Weight loss velocity is 0.6 kg/week — within the safe clinical range for Jane's metabolic profile.",
];

export function AIInsightsCard() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 text-white">
      <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        AI Weekly Insights
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <p className="text-xs text-zinc-300 leading-relaxed">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
