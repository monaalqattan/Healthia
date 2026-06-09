import { useState, useEffect } from 'react'
import { Calendar, Loader2, Users, Clock } from 'lucide-react'
import { slotService } from '@/services/api'

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function getWeekDates() {
  const today = new Date()
  const sunday = new Date(today)
  sunday.setDate(today.getDate() - today.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    const yyyy = d.getFullYear()
    const mm   = String(d.getMonth() + 1).padStart(2, '0')
    const dd   = String(d.getDate()).padStart(2, '0')
    return { label: DAYS[i], date: `${yyyy}-${mm}-${dd}`, dayNum: d.getDate() }
  })
}

export default function AvailabilitySchedule() {
  const [slots, setSlots]       = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const weekDates = getWeekDates()

  useEffect(() => {
    // نجيب كل الـ slots من غير فلتر تاريخ عشان نشوف الأسبوع كله
    slotService.getMySlots()
      .then(res => setSlots(res.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  // نقسم الـ slots على الأيام
  const slotsByDay: Record<string, any[]> = {}
  weekDates.forEach(d => { slotsByDay[d.date] = [] })
  slots.forEach(slot => {
    if (slotsByDay[slot.date] !== undefined) {
      slotsByDay[slot.date].push(slot)
    }
  })

  const totalSlots  = slots.length
  const bookedSlots = slots.filter(s => s.isBooked).length
  const freeSlots   = totalSlots - bookedSlots

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <Calendar className="w-4 h-4 text-[#065F46]" />
          Availability & Schedule
          <span className="text-[10px] font-normal text-gray-400 ml-1">This Week</span>
        </h2>
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#065F46] block" /> Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 block" /> Booked
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-200 block" /> Free
          </span>
        </div>
      </div>

      {/* Summary */}
      {!isLoading && totalSlots > 0 && (
        <div className="flex gap-3 mb-4">
          {[
            { icon: <Clock size={12}/>,  label: 'Total Slots',  value: totalSlots,  color: 'text-gray-700',  bg: 'bg-gray-50'   },
            { icon: <Users size={12}/>,  label: 'Booked',       value: bookedSlots, color: 'text-blue-600',  bg: 'bg-blue-50'   },
            { icon: <Clock size={12}/>,  label: 'Available',    value: freeSlots,   color: 'text-green-700', bg: 'bg-green-50'  },
          ].map((s, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${s.bg}`}>
              <span className={s.color}>{s.icon}</span>
              <span className="text-[10px] text-gray-500">{s.label}:</span>
              <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-[#065F46]" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-2 min-w-[580px]">
            {weekDates.map(({ label, date, dayNum }) => {
              const daySlots = slotsByDay[date] || []
              const isToday  = date === new Date().toISOString().split('T')[0]

              return (
                <div key={date} className="flex-1 min-w-0">
                  {/* Day Header */}
                  <div className={`text-center mb-2 ${isToday ? 'text-[#065F46]' : 'text-gray-400'}`}>
                    <div className="text-[10px] font-bold uppercase">{label}</div>
                    <div className={`text-xs font-semibold ${isToday ? 'bg-[#065F46] text-white w-5 h-5 rounded-full flex items-center justify-center mx-auto mt-0.5' : ''}`}>
                      {dayNum}
                    </div>
                  </div>

                  {/* Slots */}
                  <div className="flex flex-col gap-1">
                    {daySlots.length === 0 ? (
                      <div className="text-[9px] text-center text-gray-300 py-2 bg-gray-50 rounded-lg">
                        No slots
                      </div>
                    ) : (
                      daySlots.map((slot: any) => (
                        <div key={slot._id}
                          className={`text-[9px] text-center px-1 py-1.5 rounded-lg font-medium truncate ${
                            slot.isBooked
                              ? 'bg-blue-50 text-blue-600 border border-blue-100'
                              : 'bg-[#065F46]/10 text-[#065F46]'
                          }`}
                          title={slot.isBooked ? `Booked by ${slot.bookedBy?.name || 'Patient'}` : 'Available'}
                        >
                          {slot.time}
                          {slot.isBooked && (
                            <span className="block text-[8px] text-blue-400 truncate">
                              {slot.bookedBy?.name || '👤 Booked'}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!isLoading && totalSlots === 0 && (
        <div className="text-center py-6 text-gray-300">
          <Calendar size={28} className="mx-auto mb-2" />
          <p className="text-sm">No slots this week</p>
          <p className="text-xs mt-1">Add slots from the Appointment page</p>
        </div>
      )}
    </div>
  )
}