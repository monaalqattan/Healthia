import PatientCard from "../../components/ui/patient-profile/PatientCard"
import ActiveGoalsCard from "../../components/ui/patient-profile/ActiveGoalsCard"
import WeightChart from "../../components/ui/patient-profile/WeightChart"
import ActivityLog from "../../components/ui/patient-profile/ActivityLog"
import TabsNav from "../../components/ui/patient-profile/TabsNav"
import { MessageCircle, PencilLine } from "lucide-react";
const patientData = {
  name: "Sarah Jenkins",
  patientId: "HJ-9902",
  weight: 68.4,
  bmi: 22.1,
  adherence: 92,
  goals: ["Hydrate 6 Meals", "Active 1 Week", "Sugar-Free (12d)"],
}

export default function PatientProfile() {
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-full w-full">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">Patients › Sarah Jenkins</p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Patient Progress</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
            <MessageCircle size={16} className="text-gray-600" />
            Message
          </button>

          <button className="flex items-center gap-2 bg-green-700 text-white rounded-full px-4 py-2 text-sm hover:bg-green-800 cursor-pointer">
            <PencilLine size={16} />
            Edit Plan
          </button>
        </div>
      </div>

      {/* Tabs */}
      <TabsNav />

      {/*
        Main Layout:
        موبايل  → عمود واحد (flex-col)
        lg+     → عمودين: الأيسر 300px ثابت، الأيمن يملا الباقي
      */}
      <div className="mt-4 flex flex-col gap-4 lg:grid lg:gap-4"
        style={{ gridTemplateColumns: "300px 1fr" }}
      >
        {/* العمود الأيسر */}
        <div className="flex flex-col gap-4">
          <PatientCard
            name={patientData.name}
            patientId={patientData.patientId}
            weight={patientData.weight}
            bmi={patientData.bmi}
            adherence={patientData.adherence}
          />
          <ActiveGoalsCard goals={patientData.goals} />
        </div>

        {/* العمود الأيمن */}
        <div className="flex flex-col gap-4">
          <WeightChart />
          <ActivityLog />
        </div>
      </div>

    </div>
  )
}