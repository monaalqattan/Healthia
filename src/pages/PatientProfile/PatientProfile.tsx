import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { MessageCircle, PencilLine, ChevronRight, Utensils, Flame, Beef, Wheat, Droplets } from "lucide-react"
import PatientCard from "../../components/ui/patient-profile/PatientCard"
import ActiveGoalsCard from "../../components/ui/patient-profile/ActiveGoalsCard"
import WeightChart from "../../components/ui/patient-profile/WeightChart"
import ActivityLog from "../../components/ui/patient-profile/ActivityLog"
import TabsNav from "../../components/ui/patient-profile/TabsNav"
import CheckupTab from "../../components/ui/patient-profile/CheckupTab"
import NotesTab from "../../components/ui/patient-profile/NotesTab"
import BodyTab from "../../components/ui/patient-profile/BodyTab"
import { patientService } from "@/services/api"
import { fetchPatientPlans } from "@/lib/api"

// ─── DietPlanView: عرض الخطة للدكتور (أيام + وجبات + progress) ───
const DAYS_ORDER = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

function DietPlanView({ plan, patientId, patientName, navigate, onPlanUpdate }: {
  plan: any, patientId: string, patientName: string,
  navigate: any, onPlanUpdate: (p: any) => void
}) {
  const [activeDay, setActiveDay] = useState<string>(() => {
    // نفتح أول يوم عنده وجبات
    const first = DAYS_ORDER.find(d => plan.days?.some((pd: any) => pd.day === d && pd.meals?.length > 0))
    return first ?? "Sun"
  })

  const dayData = plan.days?.find((d: any) => d.day === activeDay)
  const daysWithData = new Set(plan.days?.filter((d: any) => d.meals?.length > 0).map((d: any) => d.day) ?? [])
  const completedDays = new Set(plan.days?.filter((d: any) => d.completed).map((d: any) => d.day) ?? [])

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 p-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Utensils size={18} className="text-green-700" />
            <h2 className="text-base font-bold text-gray-800">{plan.title}</h2>
          </div>
          <p className="text-xs text-gray-400">
            {completedDays.size} / {daysWithData.size} days completed
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <button
            onClick={() => {
              localStorage.setItem("selectedPatientId", patientId)
              localStorage.setItem("editPlanId", plan._id)
              navigate("/doctor/add-plan")
            }}
            className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
          >
            <PencilLine size={14} /> Edit Plan
          </button>
          <p className="text-[10px] text-gray-400">Saving resets patient progress ↺</p>
        </div>
      </div>

      {/* Macro Targets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 border-b border-gray-100">
        {[
          { label: "Calories Target", value: `${plan.caloriesTarget} kcal`, icon: <Flame size={15} className="text-orange-500" />, color: "text-orange-500" },
          { label: "Protein",  value: `${plan.protein}g`,  icon: <Beef size={15} className="text-blue-500" />,    color: "text-blue-500" },
          { label: "Carbs",    value: `${plan.carbs}g`,    icon: <Wheat size={15} className="text-yellow-500" />, color: "text-yellow-500" },
          { label: "Fats",     value: `${plan.fats}g`,     icon: <Droplets size={15} className="text-purple-500" />, color: "text-purple-500" },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              {item.icon}
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">{item.label}</span>
            </div>
            <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Days Tabs */}
      <div className="flex gap-2 p-4 border-b border-gray-100 overflow-x-auto">
        {DAYS_ORDER.map(d => {
          const has       = daysWithData.has(d)
          const done      = completedDays.has(d)
          const isActive  = activeDay === d
          return (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              disabled={!has}
              className={[
                "flex flex-col items-center px-3 py-2 rounded-xl text-xs font-semibold min-w-12 transition-all relative",
                isActive  ? "bg-green-700 text-white shadow-sm"
                : done    ? "bg-green-50 text-green-700 border border-green-200"
                : has     ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                :           "opacity-30 cursor-not-allowed bg-gray-50 text-gray-300"
              ].join(" ")}
            >
              {d}
              {done && (
                <span className={`text-[9px] mt-0.5 font-bold ${isActive ? "text-green-200" : "text-green-600"}`}>✓ Done</span>
              )}
              {!done && has && (
                <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isActive ? "bg-white" : "bg-green-500"}`} />
              )}
            </button>
          )
        })}
      </div>

      {/* وجبات اليوم */}
      <div className="p-5">
        {dayData && dayData.meals?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {["BREAKFAST","LUNCH","DINNER","SNACKS"].map(type => {
              const items = dayData.meals.filter((m: any) => m.type === type)
              if (!items.length) return null
              const dayKcal = items.reduce((s: number, m: any) => s + (m.calories || 0), 0)
              return (
                <div key={type} className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-2.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{type}</span>
                    <span className="text-[11px] text-gray-400 font-semibold">{dayKcal} kcal</span>
                  </div>
                  {items.map((meal: any, i: number) => (
                    <div key={i} className={`flex justify-between items-center px-4 py-3 border-t border-gray-50 transition-colors ${meal.completed ? "bg-green-50" : "hover:bg-gray-50"}`}>
                      <div className="flex items-center gap-2">
                        {meal.completed && <span className="text-green-600 text-xs">✓</span>}
                        <span className={`text-sm font-medium ${meal.completed ? "text-green-700 line-through opacity-60" : "text-gray-700"}`}>{meal.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-semibold">{meal.calories} kcal</span>
                    </div>
                  ))}
                </div>
              )
            })}

            {/* Day completion status */}
            <div className={`rounded-xl p-3 flex items-center gap-2 mt-1 ${completedDays.has(activeDay) ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}>
              {completedDays.has(activeDay) ? (
                <>
                  <span className="text-green-600 font-bold">✓</span>
                  <span className="text-sm text-green-700 font-medium">Patient completed this day</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">Patient hasn't completed this day yet</span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No meals planned for {activeDay}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PatientProfile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [patient, setPatient]     = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dietPlan, setDietPlan]   = useState<any>(null)
  const [planLoading, setPlanLoading] = useState(false)

  useEffect(() => {
    const id = localStorage.getItem("selectedPatientId")
    if (!id) { navigate("/doctor/patients"); return }
    patientService.getById(id)
      .then(res => setPatient(res.data))
      .catch(() => navigate("/doctor/patients"))
      .finally(() => setIsLoading(false))
  }, [])

  // جيب الـ diet plan لما الدكتور يضغط على تاب diet
  useEffect(() => {
    if (activeTab !== "diet" || !patient) return
    setPlanLoading(true)
    fetchPatientPlans(patient._id)
      .then((plans: any[]) => {
        const nutritionPlan = plans.find((p: any) => p.category === "nutrition") || plans[0] || null
        setDietPlan(nutritionPlan)
      })
      .catch(() => setDietPlan(null))
      .finally(() => setPlanLoading(false))
  }, [activeTab, patient])

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Loading...</div>
  )
  if (!patient) return null

  const patientId = patient._id

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full w-full">

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-4">
        <div>
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <button onClick={() => navigate("/doctor/patients")} className="hover:text-green-700 transition-colors">
              Patients
            </button>
            <ChevronRight size={13} />
            <span className="text-gray-600">{patient.name}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Patient Progress</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
              {patient.patientId}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
              {patient.category}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium capitalize">
              {patient.clientType}
            </span>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => {
              const phone = (patient?.phone || "").replace(/[^0-9]/g, "")
              if (phone) window.open(`https://wa.me/${phone}`, "_blank")
              else alert("No phone number recorded for this patient.")
            }}
            className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={15} className="text-gray-600" /> Message
          </button>
          <button
            onClick={() => { localStorage.setItem("selectedPatientId", patientId); navigate("/doctor/add-plan") }}
            className="flex items-center gap-2 bg-green-700 text-white rounded-full px-4 py-2 text-sm hover:bg-green-800 transition-colors">
            <PencilLine size={15} /> Edit Plan
          </button>
        </div>
      </div>

      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === "overview" && (
          <div className="flex flex-col gap-4 lg:grid lg:gap-4" style={{ gridTemplateColumns: "300px 1fr" }}>
            <div className="flex flex-col gap-4">
              <PatientCard
                name={patient.name}
                patientId={patient.patientId || "—"}
                weight={patient.weight || 0}
                bmi={patient.bmi || 0}
                adherence={patient.adherence || 0}
                avatar={patient.profileImage}
              />
              <ActiveGoalsCard goals={patient.goals?.length > 0 ? patient.goals : ["No goals set yet"]} />
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Contact Info</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "Email",   value: patient.email },
                    { label: "Phone",   value: patient.phone || "—" },
                    { label: "Program", value: patient.period || "—" },
                    { label: "Start",   value: patient.startDate ? new Date(patient.startDate).toLocaleDateString() : "—" },
                    { label: "Payment", value: patient.initialPaymentAmount ? `$${patient.initialPaymentAmount}` : "—" },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] text-gray-400 uppercase">{item.label}</p>
                      <p className="text-sm text-gray-700 font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <WeightChart patientId={patientId} patientWeight={patient?.weight || 0} />
              <ActivityLog patientId={patientId} />
            </div>
          </div>
        )}

        {activeTab === "checkup" && (
          <div className="w-full">
            <CheckupTab patientId={patientId} patientWeight={patient?.weight || 0} />
          </div>
        )}

        {activeTab === "diet" && (
          <div className="flex flex-col gap-4">
            {planLoading ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-center text-gray-400">
                Loading diet plan...
              </div>
            ) : dietPlan ? (
              <DietPlanView
                plan={dietPlan}
                patientId={patientId}
                patientName={patient.name}
                navigate={navigate}
                onPlanUpdate={setDietPlan}
              />
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                  <Utensils size={24} className="text-green-700" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-800 mb-1">No Diet Plan Yet</p>
                  <p className="text-sm text-gray-400">
                    Create a personalized nutrition plan for <strong>{patient.name}</strong>.
                  </p>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem("selectedPatientId", patientId)
                    localStorage.removeItem("editPlanId")
                    navigate("/doctor/add-plan")
                  }}
                  className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors"
                >
                  <PencilLine size={16} /> Create Diet Plan
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "body" && (
          <div className="w-full">
            <BodyTab patientId={patientId} patientData={patient} onUpdate={setPatient} />
          </div>
        )}

        {activeTab === "notes" && (
          <div className="w-full">
            <NotesTab patientId={patientId} patientData={patient} onUpdate={setPatient} />
          </div>
        )}
      </div>
    </div>
  )
}