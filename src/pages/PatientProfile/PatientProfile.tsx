import { useState } from "react"
import { useNavigate } from "react-router"
import { MessageCircle, PencilLine, ChevronRight, Pencil, Save, X } from "lucide-react"
import { usePatients } from "@/store/patientsStore"
import PatientCard from "../../components/ui/patient-profile/PatientCard"
import ActiveGoalsCard from "../../components/ui/patient-profile/ActiveGoalsCard"
import WeightChart from "../../components/ui/patient-profile/WeightChart"
import ActivityLog from "../../components/ui/patient-profile/ActivityLog"
import TabsNav from "../../components/ui/patient-profile/TabsNav"
import NotesTab from "../../components/ui/patient-profile/NotesTab"
import BodyTab from "../../components/ui/patient-profile/BodyTab"

// ── Editable Contact Info ─────────────────────────────────────────────────────
function ContactInfoCard() {
  const { patients, selectedId, updatePatient } = usePatients()
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    email:     patient?.email     || "",
    phone:     patient?.phone     || "",
    period:    patient?.period    || "",
    startDate: patient?.startDate || "",
    payment:   patient?.payment   || 0,
  })

  if (!patient) return null

  const handleSave = () => {
    updatePatient(patient.id, form)
    setEditing(false)
  }

  const handleCancel = () => {
    setForm({
      email:     patient.email,
      phone:     patient.phone     || "",
      period:    patient.period,
      startDate: patient.startDate || "",
      payment:   patient.payment   || 0,
    })
    setEditing(false)
  }

  const fields = [
    { label: "Email",    key: "email",     type: "email"  },
    { label: "Phone",    key: "phone",     type: "tel"    },
    { label: "Program",  key: "period",    type: "text"   },
    { label: "Start",    key: "startDate", type: "date"   },
    { label: "Payment",  key: "payment",   type: "number" },
  ] as const

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Contact Info</p>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs text-green-700 hover:text-green-800 font-medium">
            <Pencil size={11} /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600">
              <X size={11} /> Cancel
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-1 text-xs text-green-700 font-semibold hover:text-green-800">
              <Save size={11} /> Save
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2.5">
        {fields.map(f => (
          <div key={f.key}>
            <p className="text-[10px] text-gray-400 uppercase mb-0.5">{f.label}</p>
            {editing ? (
              <input
                type={f.type}
                value={form[f.key] as string}
                onChange={e => setForm(p => ({ ...p, [f.key]: f.type === "number" ? +e.target.value : e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-green-400"
              />
            ) : (
              <p className="text-sm text-gray-700 font-medium">
                {f.key === "payment" && patient.payment ? `$${patient.payment}` : (patient[f.key] as string) || "—"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Check-up History for Doctor ───────────────────────────────────────────────
function CheckupHistory() {
  const { patients, selectedId } = usePatients()
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]
  const checkups = patient?.checkups || []

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
        Patient Daily Logs
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
          {checkups.length} entries
        </span>
      </h3>
      {checkups.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No check-ups logged yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {checkups.slice(0, 7).map((c, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-3 hover:border-gray-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-semibold text-gray-600">{c.date}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  c.mood === "great" ? "bg-green-100 text-green-700" :
                  c.mood === "good"  ? "bg-blue-100 text-blue-700"   :
                  c.mood === "ok"    ? "bg-yellow-100 text-yellow-600":
                                       "bg-red-100 text-red-500"
                }`}>{c.mood}</span>
              </div>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>💧 {c.water} glasses</span>
                <span>🌙 {c.sleep}h sleep</span>
                <span>{c.exercise ? "🏃 Exercised" : "🛋️ Rest day"}</span>
              </div>
              {c.note && (
                <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-50 pt-2">"{c.note}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PatientProfile() {
  const { patients, selectedId } = usePatients()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")

  const patient = patients.find(p => p.id === selectedId) ?? patients[0]

  if (!patient) return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">No patient selected.</div>
  )

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full w-full">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-4">
        <div>
          <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
            <button onClick={() => navigate("/patients")} className="hover:text-green-700 transition-colors">Patients</button>
            <ChevronRight size={13} />
            <span className="text-gray-600">{patient.name}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Patient Progress</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">{patient.id}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{patient.category}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{patient.clientType}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              patient.planStatus === "active"    ? "bg-green-100 text-green-700"  :
              patient.planStatus === "on-review" ? "bg-yellow-100 text-yellow-700":
                                                   "bg-red-100 text-red-500"}`}>
              {patient.planStatus.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
            <MessageCircle size={15} className="text-gray-600" /> Message
          </button>
          <button onClick={() => navigate("/add-plan")}
            className="flex items-center gap-2 bg-green-700 text-white rounded-full px-4 py-2 text-sm hover:bg-green-800 transition-colors">
            <PencilLine size={15} /> Edit Plan
          </button>
        </div>
      </div>

      {/* Tabs — Overview, Diet Plan, Body, Notes فقط */}
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-4 lg:grid lg:gap-4" style={{ gridTemplateColumns: "300px 1fr" }}>
            <div className="flex flex-col gap-4">
              <PatientCard name={patient.name} patientId={patient.id.replace("#", "")}
                weight={patient.weight} bmi={patient.bmi} adherence={patient.adherence} avatar={patient.avatar} />
              <ActiveGoalsCard goals={patient.goals.length > 0 ? patient.goals : ["No goals set yet"]} />
              <ContactInfoCard />
            </div>
            <div className="flex flex-col gap-4">
              <WeightChart />
              <ActivityLog />
              {/* Check-up logs من المريض */}
              <CheckupHistory />
            </div>
          </div>
        )}

        {/* ── Diet Plan ── */}
        {activeTab === "diet" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800 mb-2">Diet Plan</p>
              <p className="text-sm text-gray-400 mb-5">
                Open the Diet Planner to create or edit the weekly nutrition plan for <strong>{patient.name}</strong>.
              </p>
            </div>
            <button onClick={() => navigate("/add-plan")}
              className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition-colors">
              <PencilLine size={16} /> Open Diet Planner
            </button>
          </div>
        )}

        {/* ── Body ── */}
        {activeTab === "body" && (
          <div className="max-w-2xl"><BodyTab /></div>
        )}

        {/* ── Notes ── */}
        {activeTab === "notes" && (
          <div className="max-w-2xl"><NotesTab /></div>
        )}

      </div>
    </div>
  )
}