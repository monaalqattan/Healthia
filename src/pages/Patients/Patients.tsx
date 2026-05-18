import { useState } from "react"
import { useNavigate } from "react-router"
import { Search, MoreVertical, ChevronLeft, ChevronRight, Pencil, Trash2, RefreshCw } from "lucide-react"
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
  v > 80 ? "bg-green-600" : v > 50 ? "bg-yellow-400" : "bg-red-400"

export default function Patients() {
  const { patients, addPatient, updatePatient, deletePatient, selectPatient } = usePatients()
  const navigate = useNavigate()

  const [search,     setSearch]     = useState("")
  const [page,       setPage]       = useState(1)
  const [showModal,  setShowModal]  = useState(false)
  const [newPatient, setNewPatient] = useState<PatientRecord | null>(null)
  const [menuOpen,   setMenuOpen]   = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<PatientRecord | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered  = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleCreate = (formData: any) => {
    const id       = generatePatientId(patients.length + 1)
    const password = generatePassword(formData.name)
    const bmi      = calcBMI(formData.weight, formData.height)
    const now      = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    const patient: PatientRecord = {
      id, password, ...formData, clientType: formData.clientType,
      lastCheckIn: now, planStatus: "active", compliance: 0,
      bmi, adherence: 0, goals: [], notes: [], appointments: [], checkups: [],
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    }
    addPatient(patient)
    setShowModal(false)
    setNewPatient(patient)
  }

  const handleGoToProfile = (id: string) => {
    selectPatient(id)
    navigate("/patientProfile")
  }

  const cycleStatus = (patient: PatientRecord) => {
    const next: Record<PlanStatus, PlanStatus> = {
      "active": "on-review", "on-review": "lapsed", "lapsed": "active"
    }
    updatePatient(patient.id, { planStatus: next[patient.planStatus] })
    setMenuOpen(null)
  }

  const handleDelete = (id: string) => {
    deletePatient(id)
    setDeleteConfirm(null)
    setMenuOpen(null)
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50" onClick={() => setMenuOpen(null)}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recent Patients</h1>
          <p className="text-sm text-gray-400 mt-0.5">Managing the most recent interactions and record updates.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search patients..."
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white outline-none focus:border-green-400 w-48" />
          </div>
          <button onClick={() => navigate("/patientProfile")}
            className="text-green-700 text-sm font-semibold hover:underline whitespace-nowrap">
            View Complete Directory →
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 font-semibold tracking-wide">PATIENT NAME</th>
                <th className="px-5 py-3 font-semibold tracking-wide">LAST CHECK-IN</th>
                <th className="px-5 py-3 font-semibold tracking-wide">PLAN STATUS</th>
                <th className="px-5 py-3 font-semibold tracking-wide">COMPLIANCE</th>
                <th className="px-5 py-3 font-semibold tracking-wide">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => {
                const s = statusConfig[p.planStatus]
                return (
                  <tr key={p.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                    onClick={() => handleGoToProfile(p.id)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={p.avatar || `https://i.pravatar.cc/150?u=${p.id}`}
                          alt={p.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
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
                        <span className="text-xs text-gray-600 font-medium">{p.compliance}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <div className="relative">
                        <button onClick={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                        {menuOpen === p.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 w-44">
                            <button onClick={() => { handleGoToProfile(p.id); setMenuOpen(null) }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                              <Pencil size={13} /> View Profile
                            </button>
                            <button onClick={() => { setEditTarget(p); setMenuOpen(null) }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                              <Pencil size={13} /> Edit Patient
                            </button>
                            <button onClick={() => cycleStatus(p)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                              <RefreshCw size={13} /> Update Status
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button onClick={() => setDeleteConfirm(p.id)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                              <Trash2 size={13} /> Delete Patient
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400 text-sm">No patients found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Showing <strong className="text-gray-700">{paginated.length}</strong> of <strong className="text-gray-700">{filtered.length}</strong> patients
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Page {page} of {totalPages || 1}</span>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={14} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button onClick={() => setShowModal(true)}
          className="bg-green-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-green-800 transition-colors">
          + Add New Patient
        </button>
      </div>

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-gray-800 mb-2">Delete Patient?</h3>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
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