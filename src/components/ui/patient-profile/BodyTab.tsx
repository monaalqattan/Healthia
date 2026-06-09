import { useState } from "react"
import { Save, Loader2, Weight, Ruler, Activity, Target, Plus, X } from "lucide-react"
import { patientService } from "@/services/api"

const GOAL_SUGGESTIONS = [
  "Weight Loss",
  "Weight Gain",
  "Maintain Weight",
  "Build Muscle",
  "Improve Sleep",
  "Increase Water Intake",
  "Reduce Sugar",
  "Eat More Protein",
]

export default function BodyTab({ patientId, patientData, onUpdate }: {
  patientId: string
  patientData: any
  onUpdate: (updated: any) => void
}) {
  const [form, setForm] = useState({
    weight: patientData?.weight || 0,
    height: patientData?.height || 0,
  })
  const [saved, setSaved]           = useState(false)
  const [isSaving, setIsSaving]     = useState(false)

  // Goals state
  const [goals, setGoals]           = useState<string[]>(patientData?.goals || [])
  const [newGoal, setNewGoal]       = useState("")
  const [isSavingGoals, setIsSavingGoals] = useState(false)
  const [goalsSaved, setGoalsSaved] = useState(false)

  const bmi = form.weight && form.height
    ? +(form.weight / (form.height / 100) ** 2).toFixed(1) : 0

  const bmiCategory = bmi < 18.5 ? { label: "Underweight", color: "text-blue-500",    bg: "bg-blue-50"   }
    : bmi < 25      ? { label: "Normal",      color: "text-green-600", bg: "bg-green-50"  }
    : bmi < 30      ? { label: "Overweight",  color: "text-yellow-600",bg: "bg-yellow-50" }
    :                 { label: "Obese",        color: "text-red-500",   bg: "bg-red-50"    }

  // ─── Save Measurements ───
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await patientService.updateByDoctor(patientId, { weight: form.weight, height: form.height })
      onUpdate({ ...patientData, weight: form.weight, height: form.height, bmi })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Goals ───
  const addGoal = (goal: string) => {
    const trimmed = goal.trim()
    if (!trimmed || goals.includes(trimmed)) return
    setGoals(prev => [...prev, trimmed])
    setNewGoal("")
  }

  const removeGoal = (index: number) => {
    setGoals(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveGoals = async () => {
    setIsSavingGoals(true)
    try {
      await patientService.updateByDoctor(patientId, { goals })
      onUpdate({ ...patientData, goals })
      setGoalsSaved(true)
      setTimeout(() => setGoalsSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSavingGoals(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Body Measurements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm w-full">
        <h3 className="font-bold text-gray-800 mb-5">Body Measurements</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Weight */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Weight size={15} className="text-green-600" />
              <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Weight (kg)</label>
            </div>
            <input type="number" value={form.weight}
              onChange={e => setForm(p => ({ ...p, weight: +e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 bg-white" />
          </div>

          {/* Height */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Ruler size={15} className="text-green-600" />
              <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">Height (cm)</label>
            </div>
            <input type="number" value={form.height}
              onChange={e => setForm(p => ({ ...p, height: +e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 bg-white" />
          </div>

          {/* BMI Value */}
          <div className={`rounded-xl p-4 ${bmiCategory.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={15} className="text-green-600" />
              <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide">BMI</label>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-800">{bmi > 0 ? bmi : "—"}</span>
              {bmi > 0 && <span className={`text-sm font-semibold ${bmiCategory.color}`}>{bmiCategory.label}</span>}
            </div>
          </div>

          {/* BMI Scale */}
          {bmi > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 flex flex-col justify-between">
              <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-3">BMI Scale</label>
              <div>
                <div className="relative h-2 bg-gradient-to-r from-blue-300 via-green-400 via-yellow-400 to-red-400 rounded-full">
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-gray-600 rounded-full shadow"
                    style={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button onClick={handleSave} disabled={isSaving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
            saved ? "bg-green-100 text-green-700" : "bg-green-700 text-white hover:bg-green-800"
          }`}>
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Saved ✓" : "Save Measurements"}
        </button>
      </div>

      {/* Active Goals */}
      <div className="bg-white rounded-2xl p-6 shadow-sm w-full">
        <div className="flex items-center gap-2 mb-5">
          <Target size={16} className="text-green-600" />
          <h3 className="font-bold text-gray-800">Active Goals</h3>
        </div>

        {/* Current Goals */}
        <div className="flex flex-wrap gap-2 mb-5 min-h-[36px]">
          {goals.length === 0 ? (
            <span className="text-sm text-gray-400 italic">No goals set yet</span>
          ) : (
            goals.map((goal, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full text-xs font-semibold">
                {goal}
                <button onClick={() => removeGoal(i)}
                  className="text-green-400 hover:text-red-400 transition-colors ml-1">
                  <X size={11} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Custom Goal */}
        <div className="flex gap-2 mb-4">
          <input
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addGoal(newGoal)}
            placeholder="Type a custom goal..."
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-400"
          />
          <button onClick={() => addGoal(newGoal)} disabled={!newGoal.trim()}
            className="flex items-center gap-1.5 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-40">
            <Plus size={14} /> Add
          </button>
        </div>

        {/* Suggestions */}
        <div className="mb-5">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Quick Add</p>
          <div className="flex flex-wrap gap-2">
            {GOAL_SUGGESTIONS.filter(s => !goals.includes(s)).map(s => (
              <button key={s} onClick={() => addGoal(s)}
                className="text-xs px-3 py-1.5 border border-dashed border-gray-300 rounded-full text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Save Goals */}
        <button onClick={handleSaveGoals} disabled={isSavingGoals}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
            goalsSaved ? "bg-green-100 text-green-700" : "bg-green-700 text-white hover:bg-green-800"
          }`}>
          {isSavingGoals ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {goalsSaved ? "Goals Saved ✓" : "Save Goals"}
        </button>
      </div>
    </div>
  )
}