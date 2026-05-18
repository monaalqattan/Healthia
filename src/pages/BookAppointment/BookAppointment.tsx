// src/pages/BookAppointment/BookAppointment.tsx
import { useState } from "react"
import { useNavigate } from "react-router"
import DoctorCard from "../../components/ui/book-appointment/DoctorCard"
import AppointmentCalendar from "../../components/ui/book-appointment/AppointmentCalendar"
import TimeSlots from "../../components/ui/book-appointment/TimeSlots"
import AddNotes from "../../components/ui/book-appointment/AddNotes"
import { defaultSessions } from "../../store/appointmentStore"
import type { Session } from "../../store/appointmentStore"

const doctorData = {
  name: "Dr. Julian Vance",
  title: "Senior Clinician",
  clinic: "St. Mary's Medical Center",
  clinicAddress: "425 Health Plaza, Floor 5",
  specialty: "Dietitian & Preventive Cardiology",
  image: "https://i.pravatar.cc/300?img=12",
}

export default function BookAppointment() {
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [notes, setNotes] = useState("")

  // ✅ بنقرأ الـ sessions من localStorage لو الدكتور عدّلها
  const savedSessions = localStorage.getItem("doctorSessions")
  const sessions: Session[] = savedSessions
    ? JSON.parse(savedSessions)
    : defaultSessions

  const handleConfirm = () => {
    if (!selectedTime) return
    navigate("/appointment-success", {
      state: {
        doctor: doctorData.name,
        title: doctorData.title,
        date: selectedDate.toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
        }),
        time: selectedTime,
        // ✅ بنبعت الـ notes
        notes: notes.trim(),
      },
    })
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen w-full">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Book an Appointment</h1>
        <p className="text-sm text-gray-400 mt-1">
          Select a convenient date and time to consult with Dr. Julian Vance.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:gap-6"
        style={{ gridTemplateColumns: "240px 1fr" }}
      >
        <DoctorCard {...doctorData} />

        <div className="flex flex-col gap-4">
          <AppointmentCalendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          {/* ✅ بنبعت الـ sessions لـ TimeSlots */}
          <TimeSlots
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            sessions={sessions}
          />
          <AddNotes
            notes={notes}
            onNotesChange={setNotes}
            onConfirm={handleConfirm}
            onCancel={() => navigate(-1)}
            isConfirmDisabled={!selectedTime}
          />
        </div>
      </div>
    </div>
  )
}