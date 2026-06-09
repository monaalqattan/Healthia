// src/components/ui/Appointment/ManageAvailability.tsx
import { useState, useEffect } from "react"
import { slotService } from "@/services/api"
import { Plus, Trash2, Clock, CalendarDays, CheckCircle } from "lucide-react"

interface Slot {
  _id: string
  date: string
  time: string
  isBooked: boolean
  bookedBy?: { name: string } | null
}

interface Props {
  selectedDate?: string // YYYY-MM-DD — بييجي من الـ WeeklySchedule
}

// ولّد times كل ساعة من 6 الصبح لـ 10 بالليل
const ALL_TIMES: string[] = []
for (let h = 6; h <= 21; h++) {
  ALL_TIMES.push(`${String(h).padStart(2,"0")}:00`)
}

function to12h(t: string) {
  const [h, m] = t.split(":").map(Number)
  const p = h >= 12 ? "PM" : "AM"
  return `${(h % 12 || 12).toString().padStart(2,"0")}:${String(m).padStart(2,"0")} ${p}`
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric"
  })
}

export default function ManageAvailability({ selectedDate }: Props) {
  const today = (() => {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`
  })()

  const [activeDate, setActiveDate]       = useState(selectedDate || today)
  const [slots, setSlots]                 = useState<Slot[]>([])
  const [loading, setLoading]             = useState(false)
  const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set())
  const [saving, setSaving]               = useState(false)
  const [saved, setSaved]                 = useState(false)

  // لما الـ parent يغير التاريخ
  useEffect(() => {
    if (selectedDate) setActiveDate(selectedDate)
  }, [selectedDate])

  // جيب الـ slots لما يتغير التاريخ
  useEffect(() => {
    setLoading(true)
    setSelectedTimes(new Set())
    setSaved(false)
    slotService.getMySlots(activeDate)
      .then(res => setSlots(res.data || []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }, [activeDate])

  const existingTimes = new Set(slots.map(s => s.time))

  const toggleTime = (t: string) => {
    if (existingTimes.has(t)) return // موجود بالفعل
    setSelectedTimes(prev => {
      const next = new Set(prev)
      next.has(t) ? next.delete(t) : next.add(t)
      return next
    })
  }

  const handleSave = async () => {
    if (selectedTimes.size === 0) return
    setSaving(true)
    try {
      await slotService.addSlots(activeDate, Array.from(selectedTimes))
      const res = await slotService.getMySlots(activeDate)
      setSlots(res.data || [])
      setSelectedTimes(new Set())
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await slotService.deleteSlot(id)
      setSlots(prev => prev.filter(s => s._id !== id))
    } catch (err: any) {
      alert(err?.response?.data?.message || "Cannot delete")
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">
      <div className="flex items-center gap-2 mb-1">
        <CalendarDays size={18} className="text-green-700" />
        <h2 className="font-bold text-gray-800 text-base md:text-lg">Manage Availability</h2>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Select a date and pick the time slots you're available.
      </p>

      {/* اختيار التاريخ */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-gray-500 mb-1 block">Date</label>
        <input
          type="date"
          value={activeDate}
          min={today}
          onChange={e => setActiveDate(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 cursor-pointer"
        />
        {activeDate && (
          <p className="text-[11px] text-green-700 font-semibold mt-1.5 px-1">
            {formatDate(activeDate)}
          </p>
        )}
      </div>

      {/* اختيار الـ times */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-gray-500 mb-2 block flex items-center gap-1">
          <Clock size={12} /> Pick Time Slots (1 hour each)
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ALL_TIMES.map(t => {
            const isExisting  = existingTimes.has(t)
            const isSelected  = selectedTimes.has(t)
            const slot        = slots.find(s => s.time === t)
            const isBooked    = slot?.isBooked

            return (
              <button
                key={t}
                onClick={() => toggleTime(t)}
                disabled={isExisting}
                className={`py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isBooked
                    ? "bg-red-50 text-red-400 border-red-100 cursor-not-allowed"
                    : isExisting
                    ? "bg-green-50 text-green-700 border-green-200 cursor-default"
                    : isSelected
                    ? "bg-green-700 text-white border-green-700 shadow"
                    : "bg-gray-50 text-gray-500 border-gray-100 hover:border-green-300 hover:text-green-700"
                }`}
              >
                {to12h(t)}
                {isBooked && <span className="block text-[9px] mt-0.5">booked</span>}
                {isExisting && !isBooked && <span className="block text-[9px] mt-0.5">added ✓</span>}
              </button>
            )
          })}
        </div>
        <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block"/>added</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"/>booked by patient</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-700 inline-block"/>selected</span>
        </div>
      </div>

      {/* Save */}
      {selectedTimes.size > 0 && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition-all text-sm mb-4"
        >
          {saving ? "Saving..." : `Add ${selectedTimes.size} Slot${selectedTimes.size > 1 ? "s" : ""} →`}
        </button>
      )}
      {saved && (
        <p className="text-xs text-green-600 text-center mb-4 font-medium flex items-center justify-center gap-1">
          <CheckCircle size={13}/> Slots saved! Patients can now book these times.
        </p>
      )}

      {/* الـ slots المضافة */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-2">
          Slots for this day ({slots.length})
        </h3>
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-3">Loading...</p>
        ) : slots.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">No slots added yet. Pick times above.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {slots.sort((a,b) => a.time.localeCompare(b.time)).map(slot => (
              <div key={slot._id}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${
                  slot.isBooked ? "bg-red-50 border border-red-100" : "bg-gray-50"
                }`}
              >
                <span className="text-xs font-bold text-gray-800">{to12h(slot.time)}</span>
                {slot.isBooked
                  ? <span className="text-xs text-red-500 font-semibold">
                      Booked — {slot.bookedBy?.name || "Patient"}
                    </span>
                  : <span className="text-xs text-green-600 font-medium">Available</span>
                }
                {!slot.isBooked && (
                  <button onClick={() => handleDelete(slot._id)}
                    className="text-gray-300 hover:text-red-400 transition-colors p-1">
                    <Trash2 size={13}/>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}