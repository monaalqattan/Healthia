// src/pages/AppointmentSuccess/AppointmentSuccess.tsx
import { useNavigate, useLocation } from "react-router"
import SuccessCard from "../../components/ui/appointment-success/SuccessCard"
import NextSteps from "../../components/ui/appointment-success/NextSteps"
import { FileText } from "lucide-react"

export default function AppointmentSuccess() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as {
    doctor: string
    title: string
    date: string
    time: string
    notes?: string
  } | null

  const data = state ?? {
    doctor: "Dr. Julian Vance",
    title: "Senior Clinician",
    date: "October 24, 2024",
    time: "10:20 AM",
    notes: "",
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 py-8 px-4">

      {/* Success Card */}
      <SuccessCard
        doctor={data.doctor}
        title={data.title}
        date={data.date}
        time={data.time}
      />

      {/* ✅ Notes - بتظهر بس لو في notes */}
      {data.notes && (
        <div className="w-full max-w-md mx-auto px-4 mt-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-green-600" />
              <p className="text-sm font-semibold text-gray-700">Your Notes</p>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{data.notes}</p>
          </div>
        </div>
      )}

      {/* Done + Return */}
      <div className="w-full max-w-md mx-auto px-4 mt-4 flex flex-col gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-2xl transition-all text-sm cursor-pointer"
        >
          Done
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-xs text-gray-500 hover:text-green-700 transition-colors text-center cursor-pointer"
        >
          ⬅ Return to Dashboard
        </button>
      </div>

      {/* Next Steps */}
      <div className="mt-6">
        <NextSteps />
      </div>

      {/* ✅ شلنا SuccessFooterCards */}
    </div>
  )
}