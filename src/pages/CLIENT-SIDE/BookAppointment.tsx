import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { slotService, patientService } from "@/services/api"
import { Calendar, Clock, CheckCircle, Loader2, ChevronLeft, User, AlertCircle } from "lucide-react"

const MONTH_NAMES = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"]

interface Slot { _id: string; date: string; time: string; isBooked: boolean }

function toLocalDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}

export default function BookAppointment() {
  const navigate = useNavigate()

  const [doctor, setDoctor]             = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [appointmentType, setAppointmentType] = useState("Follow-up")
  const [notes, setNotes]               = useState("")
  const [isLoading, setIsLoading]       = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError]               = useState("")
  const [success, setSuccess]           = useState(false)
  const [slots, setSlots]               = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const today = new Date(); today.setHours(0,0,0,0)

  // جيب بيانات الدكتور
  useEffect(() => {
    patientService.getMyProfile()
      .then(res => setDoctor(res.data.doctor || null))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  // لما يتغير التاريخ، جيب الـ slots المتاحة
  useEffect(() => {
    setSelectedSlot(null)
    setError("")
    setSlotsLoading(true)
    slotService.getAvailableSlots(toLocalDateStr(selectedDate))
      .then(res => setSlots(res.data || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false))
  }, [selectedDate])

  // Calendar state
  const [calMonth, setCalMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const daysInMonth    = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay()

  const handleConfirm = async () => {
    if (!selectedSlot) return
    setIsSubmitting(true)
    setError("")
    try {
      await slotService.bookSlot(selectedSlot._id, appointmentType, notes.trim())
      setSuccess(true)
      setTimeout(() => navigate("/patient"), 2500)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to book. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
    </div>
  )

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 p-6">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-emerald-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Appointment Booked!</h2>
      <p className="text-sm text-gray-400 text-center">
        {selectedDate.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} at {selectedSlot ? (() => { const [h,m]=selectedSlot.time.split(":").map(Number); const p=h>=12?"PM":"AM"; return `${(h%12||12).toString().padStart(2,"0")}:${String(m).padStart(2,"0")} ${p}` })() : ""}
      </p>
      <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Book Appointment</h1>
          <p className="text-xs text-gray-400 mt-0.5">Choose a date and available time</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5" style={{ maxWidth: 900 }}>

        {/* Left */}
        <div className="flex flex-col gap-4 lg:w-72 shrink-0">
          {/* Doctor Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {doctor?.profileImage
                  ? <img src={doctor.profileImage} alt={doctor.name} className="w-full h-full object-cover"/>
                  : <User className="w-6 h-6 text-gray-300"/>}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{doctor ? `Dr. ${doctor.name}` : "Your Doctor"}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{doctor?.specialization || "Nutritionist"}</p>
                {doctor?.email && <p className="text-[10px] text-gray-400 mt-0.5">{doctor.email}</p>}
              </div>
            </div>
          </div>

          {/* Appointment Type */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Appointment Type</h3>
            <div className="flex flex-col gap-2">
              {["Initial Consultation","Follow-up","Nutrition Review","Emergency"].map(type => (
                <button key={type} onClick={() => setAppointmentType(type)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    appointmentType === type ? "bg-[#065F46] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}>{type}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Calendar */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Select Date</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth()-1, 1))}
                  className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronLeft size={16}/></button>
                <span className="text-sm font-semibold text-gray-700 w-32 text-center">
                  {MONTH_NAMES[calMonth.getMonth()]} {calMonth.getFullYear()}
                </span>
                <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth()+1, 1))}
                  className="p-1.5 rounded-lg hover:bg-gray-100"><ChevronLeft size={16} className="rotate-180"/></button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_,i) => <div key={`e-${i}`}/>)}
              {Array.from({ length: daysInMonth }).map((_,i) => {
                const day  = i + 1
                const date = new Date(calMonth.getFullYear(), calMonth.getMonth(), day)
                date.setHours(0,0,0,0)
                const isPast     = date < today
                const isSelected = selectedDate.toDateString() === date.toDateString()
                const isToday    = new Date().toDateString() === date.toDateString()
                return (
                  <button key={day} disabled={isPast} onClick={() => setSelectedDate(date)}
                    className={`aspect-square rounded-full text-xs font-semibold flex items-center justify-center transition-all ${
                      isSelected ? "bg-[#065F46] text-white shadow"
                      : isToday  ? "bg-green-50 text-emerald-700 font-bold border border-emerald-200"
                      : isPast   ? "text-gray-200 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                    }`}>{day}</button>
                )
              })}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-semibold bg-gray-50 rounded-xl px-4 py-2.5">
              <Calendar size={14} className="text-[#065F46]"/>
              {selectedDate.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={15} className="text-[#065F46]"/> Available Times
            </h3>
            {slotsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600"/>
              </div>
            ) : slots.length === 0 ? (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5"/>
                <p className="text-sm text-amber-700">
                  No available slots on this day. Try another date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map(slot => {
                  const [h,m] = slot.time.split(":").map(Number)
                  const p     = h >= 12 ? "PM" : "AM"
                  const h12   = h % 12 || 12
                  const display = `${h12}:${String(m).padStart(2,"0")} ${p}`
                  const isChosen = selectedSlot?._id === slot._id
                  return (
                    <button key={slot._id} onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                        isChosen
                          ? "bg-[#065F46] text-white border-[#065F46] shadow"
                          : "bg-gray-50 text-gray-600 border-gray-100 hover:border-emerald-300 hover:text-emerald-700"
                      }`}>{display}</button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Notes + Confirm */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Add Notes (Optional)</h3>
            <textarea rows={3} placeholder="Any symptoms or questions for your doctor..."
              value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-500 resize-none"/>

            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {selectedSlot && (
              <div className="mt-3 bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 text-xs text-gray-600">
                <CheckCircle size={15} className="text-emerald-600 shrink-0"/>
                <span>
                  <span className="font-bold text-gray-800">
                    {selectedDate.toLocaleDateString("en-US",{month:"short",day:"numeric"})} at {(() => {
                      const [h,m] = selectedSlot.time.split(":").map(Number)
                      const p = h>=12?"PM":"AM"
                      return `${(h%12||12).toString().padStart(2,"0")}:${String(m).padStart(2,"0")} ${p}`
                    })()}
                  </span>
                  {" · "}{appointmentType}
                </span>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => navigate(-1)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleConfirm}
                disabled={!selectedSlot || isSubmitting}
                className="flex-1 py-3 bg-[#065F46] text-white rounded-xl text-sm font-bold hover:bg-[#054d38] disabled:opacity-50 flex items-center justify-center gap-2">
                {isSubmitting ? <><Loader2 size={15} className="animate-spin"/> Booking...</> : "Confirm Appointment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}