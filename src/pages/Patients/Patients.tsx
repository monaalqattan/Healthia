// src/pages/Patients/Patients.tsx
// صفحة المرضى — جدول كامل + Add New Patient modal + success alert

import { useState } from "react"
import { useNavigate } from "react-router"
import { Search, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react"
import { usePatients, generatePatientId, generatePassword, calcBMI } from "@/store/patientsStore"
import type { PatientRecord, PlanStatus, ClientType, Category, Period } from "@/store/patientsStore"
import AddPatientModal from "./AddPatientModal"
import SuccessAlert from "./SuccessAlert"

const ITEMS_PER_PAGE = 5

const statusConfig: Record<PlanStatus, { bg: string; text: string; dot: string; label: string }> = {
  active:      { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "ACTIVE PLAN" },
  "on-review": { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", label: "ON REVIEW"   },
  lapsed:      { bg: "bg-red-50",    text: "text-red-500",    dot: "bg-red-400",    label: "LAPSED"       },
}

const complianceColor = (v: number) =>
  v > 80 ? "bg-green-700" : v > 50 ? "bg-yellow-400" : "bg-red-400"

export default function Patients() {
  const { patients, addPatient, selectPatient } = usePatients()
  const navigate = useNavigate()

  const [search,      setSearch]      = useState("")
  const [page,        setPage]        = useState(1)
  const [showModal,   setShowModal]   = useState(false)
  const [newPatient,  setNewPatient]  = useState<PatientRecord | null>(null)

  // Filter + paginate
  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Handle new patient creation
  const handleCreate = (formData: {
    name: string; phone: string; email: string
    clientType: ClientType; category: Category
    period: Period; startDate: string; payment: number
    weight: number; height: number
  }) => {
    const id       = generatePatientId(patients.length + 1)
    const password = generatePassword(formData.name)
    const bmi      = calcBMI(formData.weight, formData.height)
    const now      = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

    const patient: PatientRecord = {
      id, password,
      name:        formData.name,
      email:       formData.email,
      phone:       formData.phone,
      clientType:  formData.clientType,
      category:    formData.category,
      period:      formData.period,
      startDate:   formData.startDate,
      payment:     formData.payment,
      lastCheckIn: now,
      planStatus:  "active",
      compliance:  0,
      weight:      formData.weight,
      height:      formData.height,
      bmi,
      adherence:   0,
      goals:       [],
      avatar:      `https://i.pravatar.cc/150?u=${Date.now()}`,
    }

    addPatient(patient)
    setShowModal(false)
    setNewPatient(patient)
  }

  const handleGoToProfile = (id: string) => {
    selectPatient(id)
    navigate("/patientProfile")
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recent Patients</h1>
          <p className="text-sm text-gray-400 mt-0.5">Managing the most recent interactions and record updates.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search patients..."
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white outline-none focus:border-green-400 w-48"
            />
          </div>
          <button
            onClick={() => navigate("/patientProfile")}
            className="text-green-700 text-sm font-semibold hover:underline whitespace-nowrap"
          >
            View Complete Directory →
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-120">
            <thead>
              <tr className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 font-medium">PATIENT NAME</th>
                <th className="px-5 py-3 font-medium">LAST CHECK-IN</th>
                <th className="px-5 py-3 font-medium">PLAN STATUS</th>
                <th className="px-5 py-3 font-medium">COMPLIANCE</th>
                <th className="px-5 py-3 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => {
                const s = statusConfig[p.planStatus]
                return (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleGoToProfile(p.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar || `https://i.pravatar.cc/150?u=${p.id}`}
                          alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-gray-800">{p.name}</div>
                          <div className="text-xs text-gray-400">{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{p.lastCheckIn}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${complianceColor(p.compliance)}`}
                            style={{ width: `${p.compliance}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{p.compliance}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Showing <strong>{paginated.length}</strong> of <strong>{filtered.length}</strong> patients
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Page {page} of {totalPages || 1}</span>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Add New Patient Button ── */}
      <div className="mt-5">
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-green-800 transition-colors"
        >
          + Add New Patient
        </button>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <AddPatientModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          patientCount={patients.length}
        />
      )}

      {/* ── Success Alert ── */}
      {newPatient && (
        <SuccessAlert
          patient={newPatient}
          onGoToProfile={() => { handleGoToProfile(newPatient.id); setNewPatient(null) }}
          onBack={() => setNewPatient(null)}
        />
      )}
    </div>
  )
}
