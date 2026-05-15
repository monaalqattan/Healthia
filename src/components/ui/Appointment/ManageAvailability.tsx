// src/components/ui/appointment/ManageAvailability.tsx
import { useState } from "react"

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"]

interface Session {
  label: string
  from: string
  to: string
  enabled: boolean
}

// Toggle Switch كومبوننت صغير
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`
        relative w-10 h-6 rounded-full transition-all duration-300 cursor-pointer
        ${enabled ? "bg-green-600" : "bg-gray-300"}
      `}
    >
      <span
        className={`
          absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300
          ${enabled ? "left-5" : "left-1"}
        `}
      />
    </button>
  )
}

export default function ManageAvailability() {
  const [activeDay, setActiveDay] = useState("Tue")

  // useState لكل session عشان نتحكم في الـ toggle
  const [sessions, setSessions] = useState<Session[]>([
    { label: "Morning Session",   from: "09:00 AM", to: "12:00 PM", enabled: true  },
    { label: "Afternoon Session", from: "01:00 PM", to: "04:00 PM", enabled: true  },
    { label: "Evening Session",   from: "05:00 PM", to: "07:00 PM", enabled: false },
  ])

  // بنغير الـ enabled بس للـ session اللي اتضغط عليها
  const toggleSession = (index: number) => {
    setSessions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s))
    )
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">

      {/* Header */}
      <h2 className="font-bold text-gray-800 text-base md:text-lg">
        Manage Availability
      </h2>
      <p className="text-xs text-gray-400 mt-1 mb-5">
        Define your standard weekly availability and time slots.
      </p>

      {/* Day Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {weekDays.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap
              ${activeDay === day
                ? "bg-green-700 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Sessions */}
      <div className="flex flex-col gap-4">
        {sessions.map((session, index) => (
          <div
            key={session.label}
            className={`rounded-2xl p-4 transition-all ${
              session.enabled ? "bg-white border border-gray-100 shadow-sm" : "bg-gray-50"
            }`}
          >
            {/* Session Header: اسم + Toggle */}
            <div className="flex justify-between items-center mb-3">
              <span className={`text-sm font-semibold ${session.enabled ? "text-gray-800" : "text-gray-400"}`}>
                {session.label}
              </span>
              <Toggle enabled={session.enabled} onChange={() => toggleSession(index)} />
            </div>

            {/* Time Range */}
            <div className="flex items-center gap-2">
              <div className={`flex-1 bg-gray-50 rounded-xl px-3 py-2 text-xs text-center font-medium ${session.enabled ? "text-gray-700" : "text-gray-400"}`}>
                {session.from}
              </div>
              <span className="text-xs text-gray-400 shrink-0">TO</span>
              <div className={`flex-1 bg-gray-50 rounded-xl px-3 py-2 text-xs text-center font-medium ${session.enabled ? "text-gray-700" : "text-gray-400"}`}>
                {session.to}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-2xl transition-all text-sm cursor-pointer">
        Save Availability
      </button>

    </div>
  )
}