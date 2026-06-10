import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { DataTable } from "@/components/PatientData/data-table"
import { createColumns } from "@/components/PatientData/columns"
import AddPatientModal from "./AddPatientModal"
import SuccessAlert from "./SuccessAlert"
import { patientService } from "@/services/api"
import Navbar from "@/components/Navbar/Navbar"

// ✅ Type للـ Patient
type Patient = {
  _id: string
  name: string
  email?: string
  phone?: string
  patientId?: string
  weight?: number
  height?: number
  [key: string]: unknown
}

// ✅ Type للـ form data
type PatientFormData = {
  name: string
  email: string
  phone?: string
  [key: string]: unknown
}

export default function Patients() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newPatient, setNewPatient] = useState<Patient | null>(null)
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

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleGoToProfile = (id: string) => {
    localStorage.setItem("selectedPatientId", id)
    navigate("/doctor/patientProfile")
  }

  const handleCreate = async (
    formData: PatientFormData
  ): Promise<{ error?: string }> => {
    try {
      const res = await patientService.add(formData)
      setShowModal(false)
      setNewPatient(res.data.patient)
      fetchPatients()
      return {}
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message
      return { error: message || "Failed to create patient. Please try again." }
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
    (id: string) => handleGoToProfile(id),
    (id: string) => setDeleteConfirm(id)
  )

  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center text-gray-400">
        Loading...
      </div>
    )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            All your registered patients.
          </p>
        </div>

        <DataTable
          data={patients}
          columns={columns}
          onRowClick={(p: Patient) => handleGoToProfile(p._id)}
          pageSize={10}
          showSearch={true}
          onAddPatient={() => setShowModal(true)}
        />

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-2 text-base font-bold text-gray-800">
                Delete Patient?
              </h3>
              <p className="mb-5 text-sm text-gray-400">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm!)}
                  className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
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
            onGoToProfile={() => {
              handleGoToProfile(newPatient._id)
              setNewPatient(null)
            }}
            onBack={() => setNewPatient(null)}
          />
        )}
      </div>
    </>
  )
}
