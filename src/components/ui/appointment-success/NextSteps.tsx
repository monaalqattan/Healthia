// src/components/ui/appointment-success/NextSteps.tsx
import { CalendarPlus, ClipboardList, ArrowRight } from "lucide-react"

const steps = [
  {
    icon: CalendarPlus,
    title: "Add to Calendar",
    description: "Sync with Google, Outlook, or iCal",
  },
  {
    icon: ClipboardList,
    title: "View Appointment Details",
    description: "Review your appointment info",
  },
]

export default function NextSteps() {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <p className="text-sm font-semibold text-gray-600 mb-3">Next Steps</p>
      <div className="grid grid-cols-2 gap-3">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <button
              key={step.title}
              className="flex flex-col gap-2 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-green-200 transition-all text-left cursor-pointer group"
            >
              <Icon className="w-5 h-5 text-green-600" />
              <p className="text-xs font-semibold text-gray-700">{step.title}</p>
              <p className="text-[10px] text-gray-400 leading-relaxed">{step.description}</p>
              <ArrowRight className="w-3.5 h-3.5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </button>
          )
        })}
      </div>
    </div>
  )
}