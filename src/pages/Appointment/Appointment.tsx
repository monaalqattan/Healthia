// src/pages/Appointment/Appointment.tsx
import WeeklySchedule from "../../components/ui/Appointment/WeeklySchedule"

import UpcomingAppointments from "../../components/ui/Appointment/UpcomingAppointments"
import ManageAvailability from "../../components/ui/Appointment/ManageAvailability"

export default function Appointment() {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full w-full">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Schedule</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your upcoming appointments and availability.
          </p>
        </div>
        {/* Prev / Next */}
        <div className="flex gap-2 self-start">
          <button className="flex items-center gap-1 border border-gray-200 bg-white rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-all cursor-pointer">
            ‹ Prev
          </button>
          <button className="flex items-center gap-1 border border-gray-200 bg-white rounded-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-all cursor-pointer">
            Next ›
          </button>
        </div>
      </div>

      {/* ── Weekly Schedule (فوق الكل) ── */}
      <WeeklySchedule />

      {/*
        ── Main Content ──
        موبايل  → عمود واحد
        lg+     → عمودين: اليسار للـ Appointments، اليمين للـ Availability
      */}
      <div className="mt-4 flex flex-col gap-4 lg:grid lg:gap-4"
        style={{ gridTemplateColumns: "1fr 380px" }}
      >
        {/* العمود الأيسر */}
        <UpcomingAppointments />

        {/* العمود الأيمن */}
        <ManageAvailability />
      </div>

    </div>
  )
}
