import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Trash2, Eye, X, Search, Loader2 } from 'lucide-react'

interface Patient { _id: string; name: string; email: string; phone: string; patientId: string; category: string; createdAt: string; doctor?: { name: string; specialization: string } }

export default function AdminPatients() {
  const [patients,  setPatients]  = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search,    setSearch]    = useState('')
  const [viewPatient, setViewPatient] = useState<Patient | null>(null)

  useEffect(() => {
    api.get('/patients/all')
      .then(res => setPatients(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.patientId?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this patient? This cannot be undone.')) return
    try {
      await api.delete(`/patients/${id}`)
      setPatients(prev => prev.filter(p => p._id !== id))
    } catch (err) { console.error(err) }
  }

  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={24}/></div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <p className="text-gray-400 text-sm mt-1">{patients.length} registered patients</p>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input placeholder="Search by name, email or patient ID..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B7A4B]"/>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Patient ID</th>
              <th className="px-6 py-4">Doctor</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(patient => (
              <tr key={patient._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                      {patient.name[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{patient.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{patient.email}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{patient.patientId || '—'}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{patient.doctor?.name || '—'}</td>
                <td className="px-6 py-4">
                  {patient.category
                    ? <span className="text-xs bg-[#E8F5EE] text-[#1B7A4B] px-2 py-1 rounded-full font-medium">{patient.category}</span>
                    : '—'}
                </td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(patient.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewPatient(patient)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={15}/></button>
                    <button onClick={() => handleDelete(patient._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">No patients found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {viewPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Patient Details</h3>
              <button onClick={() => setViewPatient(null)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                {viewPatient.name[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-800">{viewPatient.name}</p>
                <p className="text-xs text-gray-400">{viewPatient.patientId}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label:'Email',    value: viewPatient.email            },
                { label:'Phone',    value: viewPatient.phone || '—'     },
                { label:'Doctor',   value: viewPatient.doctor?.name || '—' },
                { label:'Category', value: viewPatient.category || '—'  },
                { label:'Joined',   value: new Date(viewPatient.createdAt).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }) },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-xs text-gray-400 uppercase font-semibold">{item.label}</span>
                  <span className="text-sm text-gray-700 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setViewPatient(null)} className="mt-5 w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}
    </div>
  )
}