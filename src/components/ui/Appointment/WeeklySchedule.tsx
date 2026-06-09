// src/components/ui/Appointment/WeeklySchedule.tsx
import { useMemo } from "react"
import type { AppointmentType } from "../../../pages/Appointment/Appointment"

interface WeeklyScheduleProps {
  selectedDay:  number
  onSelectDay:  (day: number, date: string) => void  // بنبعت التاريخ كامل
  weekOffset:   number
  appointments: AppointmentType[]
}

const DAY_NAMES = ["SUN","MON","TUE","WED","THU","FRI","SAT"]

export default function WeeklySchedule({ selectedDay, onSelectDay, weekOffset, appointments }: WeeklyScheduleProps) {

  const { days, rangeLabel } = useMemo(() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}` // YYYY-MM-DD
      return {
        name:   DAY_NAMES[date.getDay()],
        number: date.getDate(),
        dateStr,
        hasDot: appointments.some(a => a.date === dateStr),
      }
    })

    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const rangeLabel = `${fmt(startOfWeek)} - ${fmt(new Date(startOfWeek.getTime() + 6 * 86400000))}`

    return { days, rangeLabel }
  }, [weekOffset, appointments])

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
        <h2 className="font-bold text-gray-800 text-base md:text-lg">Weekly Schedule</h2>
        <span className="text-sm text-gray-400">{rangeLabel}</span>
      </div>

      <div className="flex justify-between items-center">
        {days.map((day) => {
          const isActive = day.number === selectedDay
          return (
            <div
              key={day.dateStr}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => onSelectDay(day.number, day.dateStr)}
            >
              <span className="text-xs text-gray-400 uppercase">{day.name}</span>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all ${
                isActive ? "bg-green-700 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
              }`}>
                {day.number}
              </div>
              <div className={`w-1.5 h-1.5 rounded-full transition-all ${day.hasDot ? "bg-green-500" : "bg-transparent"}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}