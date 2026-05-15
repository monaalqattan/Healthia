// src/components/ui/appointment/UpcomingAppointments.tsx

interface Appointment {
  id: number
  time: string
  period: string
  name: string
  type: string
  status: "start" | "review"
  avatar: string
}

const appointments: Appointment[] = [
  {
    id: 1,
    time: "9:00", period: "AM",
    name: "manar rabie", type: "Initial Consult",
    status: "start",
    avatar: "https://i.pravatar.cc/40?img=47",
  },
  {
    id: 2,
    time: "10:30", period: "AM",
    name: "mohamed rabie", type: "Follow-up",
    status: "review",
    avatar: "https://i.pravatar.cc/40?img=11",
  },
]

// كل status ليه لون مختلف
const statusConfig = {
  start:  { label: "Start",  bg: "bg-green-100",  text: "text-green-700"  },
  review: { label: "Review", bg: "bg-gray-100",   text: "text-gray-600"   },
}

export default function UpcomingAppointments() {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">

      {/* Header */}
      <h2 className="font-bold text-gray-800 text-base md:text-lg mb-4">
        Upcoming Appointments
      </h2>

      {/* List */}
      <div className="flex flex-col gap-3">
        {appointments.map((appt) => {
          const config = statusConfig[appt.status]
          return (
            <div
              key={appt.id}
              className="flex items-center gap-3 md:gap-4 border border-gray-100 rounded-2xl p-3 md:p-4 hover:shadow-sm transition-shadow"
            >
              {/* Time */}
              <div className="text-center shrink-0 w-12">
                <p className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                  {appt.time}
                </p>
                <p className="text-xs text-gray-400">{appt.period}</p>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-200 shrink-0" />

              {/* Avatar */}
              <img
                src={appt.avatar}
                alt={appt.name}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shrink-0"
              />

              {/* Name + Type */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{appt.name}</p>
                <p className="text-xs text-gray-400">{appt.type}</p>
              </div>

              {/* Status Badge + Details */}
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
        })}
      </div>

      {/* Add Walk-in Button */}
      <button className="w-full mt-4 py-3 border border-dashed border-gray-300 rounded-2xl text-sm text-gray-500 hover:border-green-500 hover:text-green-600 transition-all">
        + Add Walk-in
      </button>

    </div>
  )
}