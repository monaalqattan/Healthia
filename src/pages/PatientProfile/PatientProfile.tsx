import { useState } from "react"
import { useNavigate } from "react-router"
import { MessageCircle, PencilLine, ChevronRight } from "lucide-react"
import { usePatients } from "@/store/patientsStore"
import PatientCard from "../../components/ui/patient-profile/PatientCard"
import ActiveGoalsCard from "../../components/ui/patient-profile/ActiveGoalsCard"
import WeightChart from "../../components/ui/patient-profile/WeightChart"
import ActivityLog from "../../components/ui/patient-profile/ActivityLog"
import TabsNav from "../../components/ui/patient-profile/TabsNav"
import CheckupTab from "../../components/ui/patient-profile/CheckupTab"
import NotesTab from "../../components/ui/patient-profile/NotesTab"
import BodyTab from "../../components/ui/patient-profile/BodyTab"

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
              patient.planStatus === "active"    ? "bg-green-100 text-green-700" :
              patient.planStatus === "on-review" ? "bg-yellow-100 text-yellow-700" :
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

      {/* Tabs */}
      <TabsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content */}
      <div className="mt-4">

        {/* ── Overview ── */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-4 lg:grid lg:gap-4" style={{ gridTemplateColumns: "300px 1fr" }}>
            <div className="flex flex-col gap-4">
              <PatientCard name={patient.name} patientId={patient.id.replace("#", "")}
                weight={patient.weight} bmi={patient.bmi} adherence={patient.adherence} avatar={patient.avatar} />
              <ActiveGoalsCard goals={patient.goals.length > 0 ? patient.goals : ["No goals set yet"]} />
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Contact Info</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "Email",    value: patient.email },
                    { label: "Phone",    value: patient.phone || "—" },
                    { label: "Program",  value: patient.period },
                    { label: "Start",    value: patient.startDate || "—" },
                    { label: "Payment",  value: patient.payment ? `$${patient.payment}` : "—" },
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
              <WeightChart />
              <ActivityLog />
            </div>
          </div>
        )}

        {/* ── Check-up ── */}
        {activeTab === "checkup" && (
          <div className="max-w-2xl"><CheckupTab /></div>
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