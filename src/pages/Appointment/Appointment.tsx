// src/pages/Appointment/Appointment.tsx
import { useState, useEffect, useCallback } from "react"
import WeeklySchedule from "../../components/ui/Appointment/WeeklySchedule"
import UpcomingAppointments from "../../components/ui/Appointment/UpcomingAppointments"
import ManageAvailability from "../../components/ui/Appointment/ManageAvailability"
import { appointmentService } from "@/services/api"

export interface AppointmentType {
  id: number | string
  time: string        // HH:mm (24h) — للمقارنة
  timeDisplay: string // "9:00 AM" — للعرض
  name: string
  type: string
  status: "scheduled" | "completed" | "cancelled"
  date: string        // YYYY-MM-DD
  day: number
}

function mapApiToLocal(a: any): AppointmentType {
  const date   = new Date(a.date)
  const timeRaw = a.time ?? "00:00"          // HH:mm من الباك إند
  const [h, m] = timeRaw.split(":").map(Number)
  const period = h >= 12 ? "PM" : "AM"
  const h12    = h % 12 || 12
  return {
    id:          a._id,
    time:        timeRaw,
    timeDisplay: `${h12}:${String(m).padStart(2,"0")} ${period}`,
    name:        a.patient?.name || "Patient",
    type:        a.type || "Follow-up",
    status:      a.status || "scheduled",
    date:        `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`,
    day:         date.getDate(),
  }
}

export default function Appointment() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [selectedDay, setSelectedDay]   = useState(new Date().getDate())
  const [selectedDate, setSelectedDate] = useState(() => {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`
  })
  const [weekOffset, setWeekOffset]     = useState(0)
  const [isLoading, setIsLoading]       = useState(true)

  const loadAppointments = useCallback(() => {
    appointmentService.getMyAppointments()
      .then(res => setAppointments(res.data.map(mapApiToLocal)))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => { loadAppointments() }, [loadAppointments])

  // لما يختار يوم من الأسبوع، نحسب التاريخ الكامل
  const handleSelectDay = (day: number, date: string) => {
    setSelectedDay(day)
    setSelectedDate(date)
  }

  // بعد walk-in يتحفظ، نعيد التحميل
  const handleWalkInSaved = () => loadAppointments()

  const dayAppointments = appointments.filter(a => a.date === selectedDate)

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Schedule</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your upcoming appointments and availability.
          </p>
        </div>
        <div className="flex gap-2 self-start">
          <button onClick={() => setWeekOffset(w => w - 1)}
            className="flex items-center gap-1 border border-gray-200 bg-white rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-all cursor-pointer">
            ‹ Prev
          </button>
          <button onClick={() => setWeekOffset(w => w + 1)}
            className="flex items-center gap-1 border border-gray-200 bg-white rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-all cursor-pointer">
            Next ›
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
          Loading appointments...
        </div>
      ) : (
        <>
          <WeeklySchedule
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
            weekOffset={weekOffset}
            appointments={appointments}
          />
          <div className="mt-4 flex flex-col gap-4 lg:grid lg:gap-4"
            style={{ gridTemplateColumns: "1fr 380px" }}>
            <UpcomingAppointments
              appointments={dayAppointments}
              selectedDay={selectedDay}
              selectedDate={selectedDate}
              onWalkInSaved={handleWalkInSaved}
            />
            <ManageAvailability selectedDate={selectedDate} />
          </div>
        </>
      )}
    </div>
  )
}