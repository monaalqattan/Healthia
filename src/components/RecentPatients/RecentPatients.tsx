import { useState } from "react"
import { useNavigate } from "react-router"
import { usePatients, generatePatientId, generatePassword, calcBMI } from "@/store/patientsStore"
import type { PatientRecord } from "@/store/patientsStore"
import { DataTable } from "@/components/PatientData/data-table"
import { createColumns } from "@/components/PatientData/columns"
import AddPatientModal from "@/pages/Patients/AddPatientModal"
import SuccessAlert from "@/pages/Patients/SuccessAlert"

export default function RecentPatients() {
  const { patients, addPatient, deletePatient, selectPatient } = usePatients()
  const navigate = useNavigate()

  const [showModal,     setShowModal]     = useState(false)
  const [newPatient,    setNewPatient]    = useState<PatientRecord | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleGoToProfile = (id: string) => {
    selectPatient(id)
    navigate("/patientProfile")
  }

  const handleCreate = (formData: any) => {
    const id       = generatePatientId(patients.length + 1)
    const password = generatePassword(formData.name)
    const bmi      = calcBMI(formData.weight, formData.height)
    const now      = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    const patient: PatientRecord = {
      id, password, ...formData,
      lastCheckIn: now, planStatus: "active", compliance: 0,
      bmi, adherence: 0, goals: [], notes: [], appointments: [], checkups: [],
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    }
    addPatient(patient)
    setShowModal(false)
    setNewPatient(patient)
  }

  const columns = createColumns(
    (id) => handleGoToProfile(id),
    (id) => setDeleteConfirm(id),
  )

  return (
    <div className="mt-4 md:mt-6">
      <DataTable
        data={patients.slice(0, 5)}   // بيعرض آخر 5 بس في الـ dashboard
        columns={columns}
        onRowClick={(p) => handleGoToProfile(p.id)}
        pageSize={5}
        showSearch={false}            // مفيش search في الـ dashboard
        showHeader={true}             // بيعرض عنوان Recent Patients
        onAddPatient={() => setShowModal(true)}
      />

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-gray-800 mb-2">Delete Patient?</h3>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => { deletePatient(deleteConfirm); setDeleteConfirm(null) }}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AddPatientModal onClose={() => setShowModal(false)} onCreate={handleCreate} patientCount={patients.length} />
      )}
      {newPatient && (
        <SuccessAlert patient={newPatient}
          onGoToProfile={() => { handleGoToProfile(newPatient.id); setNewPatient(null) }}
          onBack={() => setNewPatient(null)} />
      )}
    </div>
  )
}