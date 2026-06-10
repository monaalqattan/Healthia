import { useState } from "react"
import { X, XCircle, Loader2 } from "lucide-react"
import type { AppointmentType } from "../../../pages/Appointment/Appointment"
import type { ApiPatient } from "@/lib/api"
import { appointmentService, patientService } from "@/services/api"

interface SlotData {
  _id: string
  time: string
}

interface Props {
  appointments: AppointmentType[]
  selectedDay: number
  selectedDate: string
  onWalkInSaved: () => void
}

const statusConfig = {
  scheduled: { label: "Scheduled", bg: "bg-green-100", text: "text-green-700" },
  completed: { label: "Completed", bg: "bg-gray-100", text: "text-gray-600" },
  cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-500" },
}

export default function UpcomingAppointments({
  appointments,
  selectedDay,
  selectedDate,
  onWalkInSaved,
}: Props) {
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [patients, setPatients] = useState<ApiPatient[]>([])
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [availableSlots] = useState<SlotData[]>([])

  const [form, setForm] = useState({
    patientId: "",
    time: "",
    type: "Follow-up",
    status: "scheduled",
  })

  const openForm = async () => {
    setShowForm(true)
    setError("")
    try {
      const res = await patientService.getMyPatients()
      setPatients(res.data)
    } catch {
      setPatients([])
    }
  }

  const handleDone = async () => {
    if (!form.patientId || !form.time || !form.type) {
      setError("Please fill all required fields.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await appointmentService.add({
        patient: form.patientId,
        date: selectedDate,
        time: form.time,
        type: form.type,
        status: form.status,
      })
      setForm({
        patientId: "",
        time: "",
        type: "Follow-up",
        status: "scheduled",
      })
      setShowForm(false)
      onWalkInSaved()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
      setError(message || "Failed to save appointment.")
    } finally {
      setSaving(false)
    }
  }

  // الدكتور يلغي appointment
  const handleCancel = async (id: string) => {
    setCancellingId(id)
    try {
      await appointmentService.update(id, { status: "cancelled" })
      onWalkInSaved() // reload
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
      alert(message || "Failed to cancel appointment.")
    } finally {
      setCancellingId(null)
      setConfirmId(null)
    }
  }

  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-sm md:p-6">
      <h2 className="mb-4 text-base font-bold text-gray-800 md:text-lg">
        Upcoming Appointments
        {selectedDay !== undefined ? ` · Day ${selectedDay}` : ""}
      </h2>

      <div className="flex flex-col gap-3">
        {appointments.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">
            No appointments for this day.
          </p>
        ) : (
          appointments
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((appt) => {
              const apptId = String(appt.id)
              const config = statusConfig[appt.status] ?? statusConfig.scheduled
              const isConfirming = confirmId === apptId
              const isCancelling = cancellingId === apptId

              return (
                <div
                  key={appt.id}
                  className="rounded-2xl border border-gray-100 p-3 transition-shadow hover:shadow-sm md:p-4"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* الوقت */}
                    <div className="w-16 shrink-0 text-center">
                      <p className="text-sm leading-tight font-bold text-gray-800">
                        {appt.timeDisplay}
                      </p>
                    </div>
                    <div className="h-8 w-px shrink-0 bg-gray-200" />

                    {/* اسم المريض */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {appt.name}
                      </p>
                      <p className="text-xs text-gray-400">{appt.type}</p>
                    </div>

                    {/* الحالة */}
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
                    >
                      {config.label}
                    </span>

                    {/* زرار Cancel — بس لو scheduled */}
                    {appt.status === "scheduled" && (
                      <button
                        onClick={() => setConfirmId(apptId)}
                        title="Cancel appointment"
                        className="shrink-0 rounded-lg p-1.5 text-gray-300 transition-all hover:bg-red-50 hover:text-red-400"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </div>

                  {/* Confirm Dialog */}
                  {isConfirming && (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                      <p className="text-xs font-medium text-red-600">
                        Cancel <span className="font-bold">{appt.name}</span>'s
                        appointment?
                      </p>
                      <div className="flex shrink-0 gap-2">
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
                        >
                          No
                        </button>
                        <button
                          onClick={() => handleCancel(apptId)}
                          disabled={isCancelling}
                          className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs text-white hover:bg-red-600 disabled:opacity-60"
                        >
                          {isCancelling ? (
                            <>
                              <Loader2 size={10} className="animate-spin" />{" "}
                              Cancelling...
                            </>
                          ) : (
                            "Yes, Cancel"
                          )}
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
        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-green-800">
              Add Walk-in Patient
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Patient <span className="text-red-400">*</span>
              </label>
              <select
                value={form.patientId}
                onChange={(e) =>
                  setForm({ ...form, patientId: e.target.value })
                }
                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
              >
                <option value="">— Select patient —</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Time <span className="text-red-400">*</span>
              </label>
              {availableSlots.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-1.5">
                    {availableSlots.map((s) => {
                      const [h, m] = s.time.split(":").map(Number)
                      const p = h >= 12 ? "PM" : "AM"
                      const display = `${(h % 12 || 12).toString().padStart(2, "0")}:${String(m).padStart(2, "0")} ${p}`
                      return (
                        <button
                          key={s._id}
                          type="button"
                          onClick={() => setForm({ ...form, time: s.time })}
                          className={`rounded-lg border py-1.5 text-xs font-semibold transition-all ${
                            form.time === s.time
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-gray-200 bg-gray-50 text-gray-600 hover:border-green-400"
                          }`}
                        >
                          {display}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Or enter manually:
                  </p>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                  />
                </div>
              ) : (
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Visit Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
              >
                {[
                  "Initial Consultation",
                  "Follow-up",
                  "Nutrition Review",
                  "Emergency",
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              onClick={handleDone}
              disabled={saving}
              className="mt-1 w-full cursor-pointer rounded-xl bg-green-700 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Done"}
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={openForm}
          className="mt-4 w-full cursor-pointer rounded-2xl border border-dashed border-gray-300 py-3 text-sm text-gray-500 transition-all hover:border-green-500 hover:text-green-600"
        >
          + Add Walk-in
        </button>
      )}
    </div>
  )
}
