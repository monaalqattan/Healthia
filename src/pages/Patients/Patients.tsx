import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { DataTable } from "@/components/PatientData/data-table"
import { createColumns } from "@/components/PatientData/columns"
import AddPatientModal from "./AddPatientModal"
import SuccessAlert from "./SuccessAlert"
import { patientService } from "@/services/api"

export default function Patients() {
  const navigate = useNavigate()
  const [patients, setPatients]         = useState<any[]>([])
  const [isLoading, setIsLoading]       = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [newPatient, setNewPatient]     = useState<any | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchPatients = async () => {
    try {
      const res = await patientService.getMyPatients()
      setPatients(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  const handleGoToProfile = (id: string) => {
    localStorage.setItem("selectedPatientId", id)
    navigate("/doctor/patientProfile")
  }

  const handleCreate = async (formData: any) => {
    try {
      const res = await patientService.add(formData)
      setShowModal(false)
      setNewPatient(res.data.patient)
      fetchPatients()
      return {}
    } catch (err: any) {
      return { error: err.response?.data?.message || "Failed to create patient. Please try again." }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await patientService.delete(id)
      setDeleteConfirm(null)
      fetchPatients()
    } catch (err) {
      console.error(err)
    }
  }

  const columns = createColumns(
    (id) => handleGoToProfile(id),
    (id) => setDeleteConfirm(id),
  )

  if (isLoading) return (
    <div className="flex h-full items-center justify-center text-gray-400">Loading...</div>
  )

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <p className="text-sm text-gray-400 mt-0.5">All your registered patients.</p>
      </div>

      <DataTable
        data={patients}
        columns={columns}
        onRowClick={(p) => handleGoToProfile(p._id)}
        pageSize={10}
        showSearch={true}
        onAddPatient={() => setShowModal(true)}
      />

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
              <button onClick={() => handleDelete(deleteConfirm!)}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
      {newPatient && (
        <SuccessAlert
          patient={newPatient}
          onGoToProfile={() => { handleGoToProfile(newPatient._id); setNewPatient(null) }}
          onBack={() => setNewPatient(null)}
        />
      )}
    </div>
  )
}