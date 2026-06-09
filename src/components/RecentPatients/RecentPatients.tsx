import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { DataTable } from "@/components/PatientData/data-table"
import { createColumns } from "@/components/PatientData/columns"
import AddPatientModal from "@/pages/Patients/AddPatientModal"
import SuccessAlert from "@/pages/Patients/SuccessAlert"
import { patientService } from "@/services/api"

export default function RecentPatients() {
  const navigate = useNavigate()
  const [patients, setPatients]           = useState<any[]>([])
  const [isLoading, setIsLoading]         = useState(true)
  const [showModal, setShowModal]         = useState(false)
  const [newPatient, setNewPatient]       = useState<any | null>(null)
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
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.message || "Failed to create patient")
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
    <div className="mt-4 bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
      Loading patients...
    </div>
  )

  return (
    <div className="mt-4 md:mt-6">
      <DataTable
        data={patients.slice(0, 5)}
        columns={columns}
        onRowClick={(p) => handleGoToProfile(p._id)}
        pageSize={5}
        showSearch={false}
        showHeader={true}
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
          patientCount={patients.length}
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