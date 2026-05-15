// src/components/ui/appointment/WeeklySchedule.tsx

interface DayProps {
  name: string
  number: number
  isActive?: boolean
  hasDot?: boolean
}

// كومبوننت صغير لكل يوم في الأسبوع
function DayCell({ name, number, isActive, hasDot }: DayProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-gray-400 uppercase">{name}</span>
      <div
        className={`
          w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
          font-bold text-sm md:text-base transition-all
          ${isActive
            ? "bg-green-700 text-white"
            : "text-gray-700 hover:bg-gray-100 cursor-pointer"
          }
        `}
      >
        {number}
      </div>
      {/* نقطة صغيرة تحت اليوم لو عنده appointment */}
      <div className={`w-1.5 h-1.5 rounded-full ${hasDot ? "bg-green-500" : "bg-transparent"}`} />
    </div>
  )
}

const days = [
  { name: "MON", number: 16, hasDot: false },
  { name: "TUE", number: 17, isActive: true, hasDot: false },
  { name: "WED", number: 18, hasDot: true  },
  { name: "THU", number: 19, hasDot: true  },
  { name: "FRI", number: 20, hasDot: false },
  { name: "SAT", number: 21, hasDot: false },
  { name: "SUN", number: 22, hasDot: false },
]

export default function WeeklySchedule() {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-6">
        <h2 className="font-bold text-gray-800 text-base md:text-lg">
          Weekly Schedule
        </h2>
        <span className="text-sm text-gray-400">Oct 16 - Oct 22</span>
      </div>

      {/* Days Row
          justify-between عشان الأيام تتوزع على العرض كله
      */}
      <div className="flex justify-between items-center">
        {days.map((day) => (
          <DayCell key={day.number} {...day} />
        ))}
      </div>

    </div>
  )
}