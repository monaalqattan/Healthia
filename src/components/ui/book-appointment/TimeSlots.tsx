// src/components/ui/book-appointment/TimeSlots.tsx
import { generateSlotsFromSessions } from "../../../store/appointmentStore"

interface TimeSlotsProps {
  selectedDate: Date
  selectedTime: string | null
  onSelectTime: (time: string) => void
  // ✅ بنستقبل الـ sessions من برا
  sessions: { label: string; from: string; to: string; enabled: boolean }[]
}

export default function TimeSlots({
  selectedDate,
  selectedTime,
  onSelectTime,
  sessions,
}: TimeSlotsProps) {

  // ✅ بنولّد الـ slots من الـ sessions بتاعة الدكتور
  const slots = generateSlotsFromSessions(sessions)

  const dateLabel = selectedDate.toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  })

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-gray-700">
          Available Slots: {dateLabel}
        </p>
        <span className="text-xs text-green-700 font-semibold bg-green-50 px-2 py-1 rounded-full">
          {slots.length} Slots Remaining
        </span>
      </div>

      {/* لو مفيش slots متاحة */}
      {slots.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No available slots. Please check availability settings.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot
            return (
              <button
                key={slot}
                onClick={() => onSelectTime(slot)}
                className={`
                  py-2 px-1 rounded-xl text-xs font-semibold transition-all cursor-pointer
                  ${isSelected
                    ? "bg-green-700 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200"
                  }
                `}
              >
                {slot}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}