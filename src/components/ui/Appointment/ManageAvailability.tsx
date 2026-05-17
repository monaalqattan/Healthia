// src/components/ui/Appointment/ManageAvailability.tsx
import { useState } from "react"
import { defaultSessions } from "../../../store/appointmentStore"
import type {  Session } from "../../../store/appointmentStore"

interface ManageAvailabilityProps {
  // ✅ بيبعت الـ sessions لأي حد محتاجها
  onSessionsChange: (sessions: Session[]) => void
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-all duration-300 cursor-pointer ${
        enabled ? "bg-green-600" : "bg-gray-300"
      }`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
        enabled ? "left-5" : "left-1"
      }`} />
    </button>
  )
}

function to12h(time: string) {
  const [h, m] = time.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const hour = h % 12 || 12
  return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`
}

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"]

export default function ManageAvailability({ onSessionsChange }: ManageAvailabilityProps) {
  const [activeDay, setActiveDay] = useState("Tue")
  const [sessions, setSessions] = useState<Session[]>(defaultSessions)
  const [saved, setSaved] = useState(false)

  const toggleSession = (index: number) => {
    setSaved(false)
    setSessions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s))
    )
  }

  const updateTime = (index: number, field: "from" | "to", value: string) => {
    setSaved(false)
    setSessions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    )
  }

  const handleSave = () => {
    // ✅ بنبعت الـ sessions المحدّثة للأعلى
    onSessionsChange(sessions)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">
      <h2 className="font-bold text-gray-800 text-base md:text-lg">Manage Availability</h2>
      <p className="text-xs text-gray-400 mt-1 mb-5">
        Define your standard weekly availability and time slots.
      </p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {weekDays.map((day) => (
          <button
            key={day}
            onClick={() => { setActiveDay(day); setSaved(false) }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap
              ${activeDay === day ? "bg-green-700 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {sessions.map((session, index) => (
          <div
            key={session.label}
            className={`rounded-2xl p-4 transition-all ${
              session.enabled ? "bg-white border border-gray-100 shadow-sm" : "bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <span className={`text-sm font-semibold ${session.enabled ? "text-gray-800" : "text-gray-400"}`}>
                {session.label}
              </span>
              <Toggle enabled={session.enabled} onChange={() => toggleSession(index)} />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="time" value={session.from} disabled={!session.enabled}
                onChange={(e) => updateTime(index, "from", e.target.value)}
                className={`flex-1 bg-gray-50 border rounded-xl px-3 py-2 text-xs text-center font-medium outline-none transition-all
                  ${session.enabled ? "text-gray-700 border-gray-200 focus:border-green-500 cursor-pointer" : "text-gray-300 border-transparent cursor-not-allowed"}`}
              />
              <span className="text-xs text-gray-400 shrink-0">TO</span>
              <input
                type="time" value={session.to} disabled={!session.enabled}
                onChange={(e) => updateTime(index, "to", e.target.value)}
                className={`flex-1 bg-gray-50 border rounded-xl px-3 py-2 text-xs text-center font-medium outline-none transition-all
                  ${session.enabled ? "text-gray-700 border-gray-200 focus:border-green-500 cursor-pointer" : "text-gray-300 border-transparent cursor-not-allowed"}`}
              />
            </div>

            {session.enabled && (
              <p className="text-[10px] text-gray-400 mt-1.5 text-center">
                {to12h(session.from)} → {to12h(session.to)}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        {saved && (
          <p className="text-xs text-green-600 text-center mb-2 font-medium">
            ✓ Availability saved! Slots updated for patients.
          </p>
        )}
        <button
          onClick={handleSave}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-2xl transition-all text-sm cursor-pointer"
        >
          Save Availability
        </button>
      </div>
    </div>
  )
}