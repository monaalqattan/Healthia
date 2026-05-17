// src/components/ui/patient-profile/PatientCard.tsx

interface PatientCardProps {
  name:      string
  patientId: string
  weight:    number
  bmi:       number
  adherence: number
  avatar?:   string
}

export default function PatientCard({ name, patientId, weight, bmi, adherence, avatar }: PatientCardProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="bg-white rounded-2xl w-full p-6 shadow-sm">
      <div className="flex flex-col items-center gap-2 mb-6">
        {avatar ? (
          <img src={avatar} alt={name} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        )}
        <div className="text-center">
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">Patient ID: #{patientId}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400">Weight</p>
          <p className="font-bold text-gray-800">{weight || "—"}</p>
          <p className="text-xs text-gray-400">kg</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400">BMI</p>
          <p className="font-bold text-gray-800">{bmi || "—"}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Adherence</span>
          <span className={`text-xs font-bold ${adherence >= 80 ? "text-green-900" : "text-orange-500"}`}>
            {adherence}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-900 h-2 rounded-full transition-all duration-500"
            style={{ width: `${adherence}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">Last 30-day consistency</p>
      </div>
    </div>
  )
}