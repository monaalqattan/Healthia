// src/pages/Appointment/Appointment.tsx
import { useState } from "react"
import WeeklySchedule from "../../components/ui/Appointment/WeeklySchedule"
import UpcomingAppointments from "../../components/ui/Appointment/UpcomingAppointments"
import ManageAvailability from "../../components/ui/Appointment/ManageAvailability"
import type { Session } from "../../store/appointmentStore"

// ✅ شلنا import Navbar لأنه مش مستخدم

export interface AppointmentType {
  id: number
  time: string
  period: string
  name: string
  type: string
  status: "start" | "review"
  avatar: string
  day: number
}

const initialAppointments: AppointmentType[] = [
  {
    id: 1, time: "9:00", period: "AM",
    name: "manar rabie", type: "Initial Consult",
    status: "start", avatar: "https://i.pravatar.cc/40?img=47", day: 17,
  },
  {
    id: 2, time: "10:30", period: "AM",
    name: "mohamed rabie", type: "Follow-up",
    status: "review", avatar: "https://i.pravatar.cc/40?img=11", day: 17,
  },
]

export default function Appointment() {
  const [appointments, setAppointments] = useState<AppointmentType[]>(initialAppointments)
  const [selectedDay, setSelectedDay] = useState(17)
  const [weekOffset, setWeekOffset] = useState(0)

  const addAppointment = (newAppt: Omit<AppointmentType, "id" | "avatar">) => {
    setAppointments((prev) => [
      ...prev,
      {
        ...newAppt,
        id: Date.now(),
        avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
      },
    ])
  }

  const handleSessionsChange = (newSessions: Session[]) => {
    localStorage.setItem("doctorSessions", JSON.stringify(newSessions))
  }

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
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="flex items-center gap-1 border border-gray-200 bg-white rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          >
            ‹ Prev
          </button>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="flex items-center gap-1 border border-gray-200 bg-white rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          >
            Next ›
          </button>
        </div>
      </div>

      <WeeklySchedule
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        weekOffset={weekOffset}
        appointments={appointments}
      />

      <div
        className="mt-4 flex flex-col gap-4 lg:grid lg:gap-4"
        style={{ gridTemplateColumns: "1fr 380px" }}
      >
        {/* ✅ شلنا الـ props المكررة: onSelectDay, weekOffset, appointments التانية */}
        <UpcomingAppointments
          appointments={appointments.filter((a) => a.day === selectedDay)}
          selectedDay={selectedDay}
          onAddAppointment={addAppointment}
        />
        <ManageAvailability onSessionsChange={handleSessionsChange} />
      </div>
    </div>
  )
}