// تاب الـ Body — بيانات الجسم
import { usePatients } from "@/store/patientsStore"
import { useState } from "react"
import { Save } from "lucide-react"

export default function BodyTab() {
  const { patients, selectedId, updatePatient } = usePatients()
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]

  const [form, setForm] = useState({
    weight: patient.weight || 0,
    height: patient.height || 0,
  })
  const [saved, setSaved] = useState(false)

  const bmi = form.weight && form.height
    ? +(form.weight / (form.height / 100) ** 2).toFixed(1) : 0

  const bmiCategory = bmi < 18.5 ? { label: "Underweight", color: "text-blue-500" }
    : bmi < 25 ? { label: "Normal", color: "text-green-600" }
    : bmi < 30 ? { label: "Overweight", color: "text-yellow-600" }
    : { label: "Obese", color: "text-red-500" }

  const handleSave = () => {
    updatePatient(patient.id, { weight: form.weight, height: form.height, bmi })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-5">Body Measurements</h3>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide block mb-2">Weight (kg)</label>
            <input type="number" value={form.weight}
              onChange={e => setForm(p => ({ ...p, weight: +e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide block mb-2">Height (cm)</label>
            <input type="number" value={form.height}
              onChange={e => setForm(p => ({ ...p, height: +e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400" />
          </div>
        </div>

        {/* BMI Result */}
        {bmi > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">BMI</span>
              <div className="text-right">
                <span className="text-xl font-bold text-gray-800">{bmi}</span>
                <span className={`ml-2 text-sm font-semibold ${bmiCategory.color}`}>{bmiCategory.label}</span>
              </div>
            </div>
            {/* BMI Bar */}
            <div className="mt-3 relative h-2 bg-gradient-to-r from-blue-300 via-green-400 via-yellow-400 to-red-400 rounded-full">
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-gray-600 rounded-full shadow"
                style={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>
        )}

        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            saved ? "bg-green-100 text-green-700" : "bg-green-700 text-white hover:bg-green-800"
          }`}>
          <Save size={14} />
          {saved ? "Saved ✓" : "Save Measurements"}
        </button>
      </div>
    </div>
  )
}