import { History, FileText, ChevronRight } from "lucide-react";

const actions = [
  {
    icon: History,
    title: "View Historical Data",
    desc: "Compare current metrics with previous quarters",
  },
  {
    icon: FileText,
    title: "Generate Full Report",
    desc: "Send this dashboard view to the patient app",
  },
];

export function BottomActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <button
          key={action.title}
          className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-sm transition-all duration-150 text-left group"
        >
          <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
            <action.icon className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-zinc-800">{action.title}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{action.desc}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
        </button>
      ))}
    </div>
  );
}
