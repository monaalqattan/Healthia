import { useState } from "react"
import { X, XCircle, Loader2 } from "lucide-react"
import type { AppointmentType } from "../../../pages/Appointment/Appointment"
import { appointmentService, patientService } from "@/services/api"

interface Props {
  appointments: AppointmentType[]
  selectedDay:  number
  selectedDate: string
  onWalkInSaved: () => void
}

const statusConfig = {
  scheduled: { label: "Scheduled", bg: "bg-green-100",  text: "text-green-700" },
  completed: { label: "Completed", bg: "bg-gray-100",   text: "text-gray-600"  },
  cancelled: { label: "Cancelled", bg: "bg-red-100",    text: "text-red-500"   },
}

export default function UpcomingAppointments({ appointments, selectedDay, selectedDate, onWalkInSaved }: Props) {
  const [showForm,    setShowForm]    = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState("")
  const [patients,    setPatients]    = useState<any[]>([])
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [confirmId,   setConfirmId]   = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<any[]>([]) // الـ id اللي شايل dialog التأكيد

  const [form, setForm] = useState({
    patientId: "", time: "", type: "Follow-up", status: "scheduled",
  })

  const openForm = async () => {
    setShowForm(true); setError("")
    try { const res = await patientService.getMyPatients(); setPatients(res.data) }
    catch { setPatients([]) }
  }

  const handleDone = async () => {
    if (!form.patientId || !form.time || !form.type) { setError("Please fill all required fields."); return }
    setSaving(true); setError("")
    try {
      await appointmentService.add({ patient: form.patientId, date: selectedDate, time: form.time, type: form.type, status: form.status })
      setForm({ patientId: "", time: "", type: "Follow-up", status: "scheduled" })
      setShowForm(false); onWalkInSaved()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save appointment.")
    } finally { setSaving(false) }
  }

  // الدكتور يلغي appointment
  const handleCancel = async (id: string) => {
    setCancellingId(id)
    try {
      await appointmentService.update(id, { status: "cancelled" })
      onWalkInSaved() // reload
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to cancel appointment.")
    } finally {
      setCancellingId(null)
      setConfirmId(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">
      <h2 className="font-bold text-gray-800 text-base md:text-lg mb-4">Upcoming Appointments</h2>

      <div className="flex flex-col gap-3">
        {appointments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No appointments for this day.</p>
        ) : (
          appointments
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(appt => {
              const config = statusConfig[appt.status] ?? statusConfig.scheduled
              const isConfirming = confirmId === appt.id
              const isCancelling = cancellingId === appt.id

              return (
                <div key={appt.id}
                  className="border border-gray-100 rounded-2xl p-3 md:p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* الوقت */}
                    <div className="text-center shrink-0 w-16">
                      <p className="font-bold text-gray-800 text-sm leading-tight">{appt.timeDisplay}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200 shrink-0" />

                    {/* اسم المريض */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{appt.name}</p>
                      <p className="text-xs text-gray-400">{appt.type}</p>
                    </div>

                    {/* الحالة */}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${config.bg} ${config.text}`}>
                      {config.label}
                    </span>

                    {/* زرار Cancel — بس لو scheduled */}
                    {appt.status === "scheduled" && (
                      <button
                        onClick={() => setConfirmId(appt.id)}
                        title="Cancel appointment"
                        className="shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </div>

                  {/* Confirm Dialog */}
                  {isConfirming && (
                    <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-red-600 font-medium">
                        Cancel <span className="font-bold">{appt.name}</span>'s appointment?
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="px-3 py-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          No
                        </button>
                        <button
                          onClick={() => handleCancel(appt.id)}
                          disabled={isCancelling}
                          className="px-3 py-1.5 text-xs text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-60 flex items-center gap-1"
                        >
                          {isCancelling ? <><Loader2 size={10} className="animate-spin"/> Cancelling...</> : "Yes, Cancel"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
        )}
      </div>

      {/* Walk-in Form */}
      {showForm && (
        <div className="mt-4 border border-green-200 bg-green-50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-green-800 text-sm">Add Walk-in Patient</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Patient <span className="text-red-400">*</span></label>
              <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 bg-white cursor-pointer">
                <option value="">— Select patient —</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Time <span className="text-red-400">*</span></label>
              {availableSlots.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    {availableSlots.map((s: any) => {
                      const [h, m] = s.time.split(":").map(Number)
                      const p = h >= 12 ? "PM" : "AM"
                      const display = `${(h%12||12).toString().padStart(2,"0")}:${String(m).padStart(2,"0")} ${p}`
                      return (
                        <button key={s._id} type="button"
                          onClick={() => setForm({ ...form, time: s.time })}
                          className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            form.time === s.time ? "bg-green-700 text-white border-green-700" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-green-400"
                          }`}>{display}</button>
                      )
                    })}
                  </div>
                  <p className="text-[10px] text-gray-400">Or enter manually:</p>
                  <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 bg-white" />
                </div>
              ) : (
                <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 bg-white" />
              )}
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Visit Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 bg-white cursor-pointer">
                {["Initial Consultation","Follow-up","Nutrition Review","Emergency"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button onClick={handleDone} disabled={saving}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-all text-sm cursor-pointer mt-1">
              {saving ? "Saving..." : "Done"}
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button onClick={openForm}
          className="w-full mt-4 py-3 border border-dashed border-gray-300 rounded-2xl text-sm text-gray-500 hover:border-green-500 hover:text-green-600 transition-all cursor-pointer">
          + Add Walk-in
        </button>
      )}
    </div>
  )
}