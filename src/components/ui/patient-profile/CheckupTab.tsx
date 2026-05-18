// تاب الـ Check-up — أسئلة يومية للمريض يجاوب عليها
import { useState } from "react"
import { usePatients } from "@/store/patientsStore"
import type { CheckupAnswer } from "@/store/patientsStore"
import { Droplets, Moon, Smile, Dumbbell, Save } from "lucide-react"

const MOODS = [
  { value: "great", label: "Great 😄", color: "bg-green-100 text-green-700 border-green-300" },
  { value: "good",  label: "Good 🙂",  color: "bg-blue-100 text-blue-700 border-blue-300"   },
  { value: "ok",    label: "OK 😐",    color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "bad",   label: "Bad 😔",   color: "bg-red-100 text-red-500 border-red-300"      },
] as const

export default function CheckupTab() {
  const { patients, selectedId, updatePatient } = usePatients()
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]

  const [form, setForm] = useState({
    water: 0, sleep: 7, mood: "good" as CheckupAnswer["mood"],
    exercise: false, note: ""
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const entry: CheckupAnswer = {
      date: new Date().toISOString().split("T")[0],
      ...form
    }
    updatePatient(patient.id, {
      checkups: [entry, ...(patient.checkups || [])],
      lastCheckIn: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Today's Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-gray-800">Today's Check-up</h3>
          <span className="text-xs text-gray-400">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
        </div>

        <div className="flex flex-col gap-5">
          {/* Water */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Droplets size={15} className="text-blue-500" />
              <label className="text-sm font-semibold text-gray-700">Water Intake</label>
              <span className="ml-auto text-sm font-bold text-blue-600">{form.water} glasses</span>
            </div>
            <input type="range" min={0} max={15} value={form.water}
              onChange={e => setForm(p => ({ ...p, water: +e.target.value }))}
              className="w-full accent-blue-500" />
            <div className="flex justify-between text-xs text-gray-300 mt-1">
              <span>0</span><span>8 (goal)</span><span>15</span>
            </div>
          </div>

          {/* Sleep */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Moon size={15} className="text-indigo-500" />
              <label className="text-sm font-semibold text-gray-700">Sleep Hours</label>
              <span className="ml-auto text-sm font-bold text-indigo-600">{form.sleep}h</span>
            </div>
            <input type="range" min={0} max={12} value={form.sleep}
              onChange={e => setForm(p => ({ ...p, sleep: +e.target.value }))}
              className="w-full accent-indigo-500" />
          </div>

          {/* Mood */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Smile size={15} className="text-yellow-500" />
              <label className="text-sm font-semibold text-gray-700">How are you feeling?</label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOODS.map(m => (
                <button key={m.value} onClick={() => setForm(p => ({ ...p, mood: m.value }))}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.mood === m.value ? m.color + " ring-2 ring-offset-1" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell size={15} className="text-green-600" />
              <label className="text-sm font-semibold text-gray-700">Exercised today?</label>
            </div>
            <button onClick={() => setForm(p => ({ ...p, exercise: !p.exercise }))}
              className={`w-12 h-6 rounded-full transition-all relative ${form.exercise ? "bg-green-600" : "bg-gray-200"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.exercise ? "left-6" : "left-0.5"}`} />
            </button>
          </div>

          {/* Note */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Notes / Observations</label>
            <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
              placeholder="Any notes about today's meals, symptoms, or feelings..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none" />
          </div>

          <button onClick={handleSave}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
              saved ? "bg-green-100 text-green-700" : "bg-green-700 text-white hover:bg-green-800"
            }`}>
            <Save size={15} />
            {saved ? "Saved Successfully ✓" : "Save Check-up"}
          </button>
        </div>
      </div>

      {/* History */}
      {patient.checkups && patient.checkups.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Previous Check-ups</h3>
          <div className="flex flex-col gap-3">
            {patient.checkups.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{c.date}</p>
                  <p className="text-xs text-gray-400">
                    💧 {c.water}g &nbsp; 🌙 {c.sleep}h &nbsp; {c.exercise ? "🏃 Exercised" : "🛋️ Rest day"}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  c.mood === "great" ? "bg-green-100 text-green-700" :
                  c.mood === "good"  ? "bg-blue-100 text-blue-700" :
                  c.mood === "ok"    ? "bg-yellow-100 text-yellow-600" :
                                       "bg-red-100 text-red-500"
                }`}>{c.mood}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}