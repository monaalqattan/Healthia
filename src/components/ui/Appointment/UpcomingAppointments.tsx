import { useState } from "react"
import type { AppointmentType } from "../../../pages/Appointment/Appointment"
import { X } from "lucide-react"

interface Props {
  appointments: AppointmentType[]
  selectedDay: number
  onAddAppointment: (appt: Omit<AppointmentType, "id" | "avatar">) => void
}

const statusConfig = {
  start:  { label: "Start",  bg: "bg-green-100",  text: "text-green-700" },
  review: { label: "Review", bg: "bg-gray-100",   text: "text-gray-600"  },
}

export default function UpcomingAppointments({ appointments, selectedDay, onAddAppointment }: Props) {

  // هل الفورم ظاهر ولا لا
  const [showForm, setShowForm] = useState(false)

  // بيانات الفورم
  const [form, setForm] = useState({
    name: "",
    time: "",
    period: "AM" as "AM" | "PM",
    type: "",
    status: "start" as "start" | "review",
  })

  const handleDone = () => {
    // Validation بسيط - مش هيحفظ لو في خانة فاضية
    if (!form.name.trim() || !form.time.trim() || !form.type.trim()) return

    onAddAppointment({
      ...form,
      day: selectedDay,
    })

    // reset الفورم وإخفاءه
    setForm({ name: "", time: "", period: "AM", type: "", status: "start" })
    setShowForm(false)
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">

      <h2 className="font-bold text-gray-800 text-base md:text-lg mb-4">
        Upcoming Appointments
      </h2>

      {/* قايمة المواعيد */}
      <div className="flex flex-col gap-3">
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No appointments for this day.
          </p>
        ) : (
          appointments.map((appt) => {
            const config = statusConfig[appt.status]
            return (
              <div
                key={appt.id}
                className="flex items-center gap-3 md:gap-4 border border-gray-100 rounded-2xl p-3 md:p-4 hover:shadow-sm transition-shadow"
              >
                <div className="text-center shrink-0 w-12">
                  <p className="font-bold text-gray-800 text-sm md:text-base leading-tight">{appt.time}</p>
                  <p className="text-xs text-gray-400">{appt.period}</p>
                </div>
                <div className="w-px h-8 bg-gray-200 shrink-0" />
                <img src={appt.avatar} alt={appt.name} className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{appt.name}</p>
                  <p className="text-xs text-gray-400">{appt.type}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
                    {config.label}
                  </span>
                  <button className="text-xs text-gray-400 hover:text-green-700 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Walk-in Form ── */}
      {showForm && (
        <div className="mt-4 border border-green-200 bg-green-50 rounded-2xl p-4">

          {/* عنوان الفورم + زرار إغلاق */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-green-800 text-sm">Add Walk-in Patient</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">

            {/* Patient Name */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">
                Patient Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter patient name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 bg-white"
              />
            </div>

            {/* Time + Period */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">
                  Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => {
                    // بنحول الوقت من 24h لـ 12h
                    const [h, m] = e.target.value.split(":")
                    const hour = parseInt(h)
                    const period = hour >= 12 ? "PM" : "AM"
                    const hour12 = hour % 12 || 12
                    setForm({ ...form, time: `${hour12}:${m}`, period })
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Visit Type</label>
                <input
                  type="text"
                  placeholder="e.g. Consult"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 bg-white"
                />
              </div>
            </div>

            {/* Status Select */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "start" | "review" })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 bg-white cursor-pointer"
              >
                <option value="start">Start</option>
                <option value="review">Review</option>
              </select>
            </div>

            {/* Done Button */}
            <button
              onClick={handleDone}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-xl transition-all text-sm cursor-pointer mt-1"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Add Walk-in Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 py-3 border border-dashed border-gray-300 rounded-2xl text-sm text-gray-500 hover:border-green-500 hover:text-green-600 transition-all cursor-pointer"
        >
          + Add Walk-in
        </button>
      )}

    </div>
  )
}