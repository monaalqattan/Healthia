import { useState } from "react"
import WeeklySchedule from "../../components/ui/Appointment/WeeklySchedule"
import UpcomingAppointments from "../../components/ui/Appointment/UpcomingAppointments"
import ManageAvailability from "../../components/ui/Appointment/ManageAvailability"
import Navbar from "@/components/Navbar/Navbar"

// نوع الـ Appointment
export interface AppointmentType {
  id: number
  time: string
  period: string
  name: string
  type: string
  status: "start" | "review"
  avatar: string
  day: number  // ← رقم اليوم عشان نعرض المواعيد حسب اليوم
}

// البيانات الابتدائية
const initialAppointments: AppointmentType[] = [
  {
    id: 1, time: "9:00", period: "AM",
    name: "manar rabie", type: "Initial Consult",
    status: "start", avatar: "https://i.pravatar.cc/40?img=47",
    day: 17,
  },
  {
    id: 2, time: "10:30", period: "AM",
    name: "mohamed rabie", type: "Follow-up",
    status: "review", avatar: "https://i.pravatar.cc/40?img=11",
    day: 17,
  },
]

export default function Appointment() {
  // ── State مشترك بين الكومبوننتات ──

  // قائمة المواعيد - بتتشارك مع UpcomingAppointments
  const [appointments, setAppointments] = useState<AppointmentType[]>(initialAppointments)

  // اليوم المختار - بيتشارك بين WeeklySchedule و UpcomingAppointments
  const [selectedDay, setSelectedDay] = useState(17)

  // رقم الأسبوع للـ Prev/Next
  const [weekOffset, setWeekOffset] = useState(0)

  // دالة إضافة appointment جديد - بتتبعت لـ UpcomingAppointments
  const addAppointment = (newAppt: Omit<AppointmentType, "id" | "avatar">) => {
    setAppointments((prev) => [
      ...prev,
      {
        ...newAppt,
        id: Date.now(),  // id فريد بناءً على الوقت
        avatar: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70)}`,
      },
    ])
  }

  return (
    <>
      <Navbar />
      <div className="min-h-full w-full bg-gray-50 p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Schedule
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your upcoming appointments and availability.
            </p>
          </div>
          {/* Prev / Next - بيغير الـ weekOffset */}
          <div className="flex gap-2 self-start">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-all hover:bg-gray-100"
            >
              ‹ Prev
            </button>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-all hover:bg-gray-100"
            >
              Next ›
            </button>
          </div>
        </div>

        {/* Weekly Schedule */}
        <WeeklySchedule
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          weekOffset={weekOffset}
          appointments={appointments}
        />

        {/* Main Content */}
        <div
          className="mt-4 flex flex-col gap-4 lg:grid lg:gap-4"
          style={{ gridTemplateColumns: "1fr 380px" }}
        >
          <UpcomingAppointments
            appointments={appointments.filter((a) => a.day === selectedDay)}
            selectedDay={selectedDay}
            onAddAppointment={addAppointment}
          />
          <ManageAvailability />
        </div>
      </div>
    </>
  )
}