import { useState, useCallback } from "react"
import "./styles/Addplan.css"
import { PatientBar, DietCalculator, MealStructure } from "../../components/addplan/features/components"
import type { PatientForm, DietTargets, Meal, Equation } from "../../components/addplan/features/types"
import { PAGE_TABS } from "../../components/addplan/features/constants"
import { INITIAL_FORM, INITIAL_TARGETS, INITIAL_MEALS } from "../../components/addplan/features/data"
import { computeTargets } from "../../components/addplan/features/logic/calculations"
import { selectTotalEaten } from "../../components/addplan/features/logic/selectors"
import { usePatients } from "@/store/patientsStore"
import { useNavigate } from "react-router"
import { ChevronRight, Clock, Droplets, Moon, Dumbbell } from "lucide-react"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/footer/Footer"

// ── Patient Overview Tab ───────────────────────────────────────────────────────
function PatientOverviewTab() {
  const { patients, selectedId } = usePatients()
  const navigate = useNavigate()
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]

  if (!patient) return (
    <div className="flex items-center justify-center py-20 text-gray-400">No patient selected</div>
  )

  const checkups = patient.checkups || []
  const moodColor = (m: string) =>
    m === "great" ? "bg-green-100 text-green-700" :
    m === "good"  ? "bg-blue-100 text-blue-700"   :
    m === "ok"    ? "bg-yellow-100 text-yellow-600":
                    "bg-red-100 text-red-500"

  return (
    <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Patient Info */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-5">
          <img src={patient.avatar || `https://i.pravatar.cc/150?u=${patient.id}`}
            alt={patient.name} className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{patient.name}</h2>
            <p className="text-xs text-gray-400">{patient.id} · {patient.category}</p>
            <div className="flex gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                patient.planStatus === "active"    ? "bg-green-100 text-green-700"   :
                patient.planStatus === "on-review" ? "bg-yellow-100 text-yellow-700" :
                                                     "bg-red-100 text-red-500"
              }`}>{patient.planStatus.toUpperCase()}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{patient.clientType}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: "Weight",    value: `${patient.weight || "—"} kg`  },
            { label: "Height",    value: `${patient.height || "—"} cm`  },
            { label: "BMI",       value: patient.bmi || "—"              },
            { label: "Adherence", value: `${patient.adherence || 0}%`   },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
              <p className="font-bold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          {[
            { label: "Email",   value: patient.email           },
            { label: "Phone",   value: patient.phone || "—"    },
            { label: "Program", value: patient.period           },
            { label: "Start",   value: patient.startDate || "—"},
          ].map(f => (
            <div key={f.label} className="flex justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-gray-400 text-xs">{f.label}</span>
              <span className="text-gray-700 font-medium text-xs">{f.value}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/patientProfile")}
          className="mt-4 w-full flex items-center justify-center gap-1 text-xs text-green-700 font-semibold hover:underline">
          View Full Profile <ChevronRight size={12} />
        </button>
      </div>

      {/* Daily Check-up Logs */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Patient Daily Check-ups</h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
            {checkups.length} entries
          </span>
        </div>

        {checkups.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-300">
            <Clock size={36} className="mb-2" />
            <p className="text-sm">No check-ups logged yet</p>
            <p className="text-xs mt-1">Patient will submit daily updates from their dashboard</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
            {checkups.map((c, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3 hover:border-green-100 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-gray-700">{c.date}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${moodColor(c.mood)}`}>
                    {c.mood}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Droplets size={11} className="text-blue-400" /> {c.water} glasses
                  </span>
                  <span className="flex items-center gap-1">
                    <Moon size={11} className="text-indigo-400" /> {c.sleep}h sleep
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell size={11} className={c.exercise ? "text-green-500" : "text-gray-300"} />
                    {c.exercise ? "Exercised" : "Rest day"}
                  </span>
                </div>
                {c.note && (
                  <p className="text-xs text-gray-500 italic bg-gray-50 rounded-lg px-2 py-1.5">
                    "{c.note}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── History Tab ───────────────────────────────────────────────────────────────
function HistoryTab() {
  // بيانات static للـ history — قابلة للتوسع مستقبلاً
  const plans = [
    { date: "Oct 1 – Oct 31, 2024", label: "Weight Loss Plan",   cal: 1850, status: "Completed" },
    { date: "Sep 1 – Sep 30, 2024", label: "Maintenance Plan",   cal: 2100, status: "Completed" },
    { date: "Aug 1 – Aug 31, 2024", label: "Initial Diet Plan",  cal: 2000, status: "Completed" },
  ]

  return (
    <div className="p-5">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Plan History</h3>
          <p className="text-xs text-gray-400 mt-0.5">All previously saved diet plans for this patient</p>
        </div>
        {plans.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-300">
            <Clock size={40} className="mb-3" />
            <p className="text-sm">No saved plans yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {plans.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{p.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.date} · {p.cal} kcal/day</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                    {p.status}
                  </span>
                  <button className="text-xs text-green-700 font-semibold hover:underline">
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main AddPlan ──────────────────────────────────────────────────────────────
export default function AddPlan() {
  const [activeTab, setActiveTab] = useState<string>("Clinical Diet Planner")
  const [equation,  setEquation]  = useState<Equation>("katch")
  const [form,      setForm]      = useState<PatientForm>(INITIAL_FORM)
  const [targets,   setTargets]   = useState<DietTargets>(INITIAL_TARGETS)
  const [meals,     setMeals]     = useState<Meal[]>(INITIAL_MEALS)
  const { patients, selectedId }  = usePatients()
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]

  const totalEaten = selectTotalEaten(meals)

  const handleFormChange = useCallback(
    (key: keyof PatientForm, value: string | number) =>
      setForm(prev => ({ ...prev, [key]: value })), [])

  const handleCalculate = useCallback(() => {
    setTargets(computeTargets({ ...form, equation }))
  }, [form, equation])

  const handleAddFood = useCallback((mealId: string) => {
    const name = window.prompt("Food name:")
    if (!name) return
    const kcal = parseInt(window.prompt("Calories (kcal):") ?? "0") || 0
    setMeals(prev => prev.map(m =>
      m.id === mealId ? { ...m, foods: [...m.foods, { name, kcal }] } : m
    ))
  }, [])

  const handleAddMeal = useCallback(() => {
    const name = window.prompt("Meal name:") || "New Meal"
    setMeals(prev => [
      ...prev,
      { id: `meal_${Date.now()}`, name, icon: "🍽️", suggested: "custom", foods: [] },
    ])
  }, [])

  return (
    <>
      <Navbar />
      <div className="addplan-page pt-6">

        {/* ── Topbar ── */}
        <div className="topbar">
          <span className="topbar-title">Clinical Diet Planner</span>

          <div className="topbar-tabs">
            {PAGE_TABS.map(t => (
              <button key={t}
                className={`tab-btn ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}>
                {t}
              </button>
            ))}
          </div>

          <div className="topbar-actions">
            <button className="btn-outline">Export PDF</button>
            <button className="btn-primary">Save &amp; Publish</button>
          </div>
        </div>

        {/* ── Patient Bar — بيظهر في كل التابات ── */}
        <PatientBar
          firstName={patient?.name.split(" ")[0] || form.firstName}
          lastName={patient?.name.split(" ")[1]  || form.lastName}
          weight={patient?.weight || form.weight}
          height={patient?.height || form.height}
          goal={form.goal}
        />

        {/* ── Tab Content ── */}

        {/* Clinical Diet Planner */}
        {activeTab === "Clinical Diet Planner" && (
          <div className="content-grid">
            <DietCalculator
              form={form} onFormChange={handleFormChange}
              equation={equation} onEqChange={setEquation}
              onCalculate={handleCalculate} targets={targets} />
            <MealStructure
              meals={meals} onAddFood={handleAddFood}
              onAddMeal={handleAddMeal} targets={targets} totalEaten={totalEaten} />
          </div>
        )}

        {/* Patient Overview */}
        {activeTab === "Patient Overview" && <PatientOverviewTab />}

        {/* History */}
        {activeTab === "History" && <HistoryTab />}

      </div>
      <Footer />
    </>
  )
}
