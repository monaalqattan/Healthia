import { useMemo } from "react"
import type { AppointmentType } from "../../../pages/Appointment/Appointment"

interface WeeklyScheduleProps {
  selectedDay: number
  onSelectDay: (day: number) => void
  weekOffset: number
  appointments: AppointmentType[]
}

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

export default function WeeklySchedule({
  selectedDay,
  onSelectDay,
  weekOffset,
  appointments,
}: WeeklyScheduleProps) {

  /*
    useMemo: بيحسب أيام الأسبوع بناءً على weekOffset
    مش بيحسبها تاني غير لما weekOffset يتغير
  */
  const { days, rangeLabel } = useMemo(() => {
    const today = new Date()
    // بنحرك التاريخ حسب الـ weekOffset (كل offset = أسبوع)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return {
        name: DAY_NAMES[(date.getDay())],
        number: date.getDate(),
        // بنشوف لو في appointments في اليوم ده
        hasDot: appointments.some((a) => a.day === date.getDate()),
      }
    })

    // نص نطاق الأسبوع مثلاً "Oct 16 - Oct 22"
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const rangeLabel = `${fmt(startOfWeek)} - ${fmt(days[6] ? new Date(startOfWeek.getTime() + 6 * 86400000) : startOfWeek)}`

    return { days, rangeLabel }
  }, [weekOffset, appointments])

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
        <h2 className="font-bold text-gray-800 text-base md:text-lg">
          Weekly Schedule
        </h2>
        <span className="text-sm text-gray-400">{rangeLabel}</span>
      </div>

      {/* Days Row */}
      <div className="flex justify-between items-center">
        {days.map((day) => {
          const isActive = day.number === selectedDay
          return (
            <div
              key={day.number}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => onSelectDay(day.number)}
            >
              <span className="text-xs text-gray-400 uppercase">{day.name}</span>
              <div
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                  font-bold text-sm md:text-base transition-all
                  ${isActive
                    ? "bg-green-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {day.number}
              </div>
              {/* نقطة خضرا لو في appointments */}
              <div className={`w-1.5 h-1.5 rounded-full transition-all ${day.hasDot ? "bg-green-500" : "bg-transparent"}`} />
            </div>
          )
        })}
      </div>

    </div>
  )
}