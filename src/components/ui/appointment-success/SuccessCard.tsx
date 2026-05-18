// src/components/ui/appointment-success/SuccessCard.tsx
import { CheckCircle, Calendar, Clock } from "lucide-react"

interface SuccessCardProps {
  doctor: string
  title: string
  date: string
  time: string
}

export default function SuccessCard({ doctor, title, date, time }: SuccessCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-20 shadow-md w-full max-w-md mx-auto text-center">

      {/* أيقونة النجاح */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-green-700 mb-2">Appointment Booked!</h1>
      <p className="text-xs text-gray-400 mb-6">
        Your consultation is confirmed. A calendar invitation and summary details
        have been sent to your registered email.
      </p>

      {/* Doctor Info */}
      <div className="bg-gray-50 rounded-2xl p-4 text-left mb-6">
        <div className="flex items-center gap-3 mb-3">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt={doctor}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-bold text-gray-800 text-sm">{doctor}</p>
            <p className="text-xs text-gray-400">{title}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs text-gray-600">{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs text-gray-600">{time}</span>
          </div>
        </div>
      </div>

    </div>
  )
}