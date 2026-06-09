import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Users, Stethoscope, Loader2 } from 'lucide-react'

interface Doctor  { _id: string; name: string; email: string; specialization: string; phone: string; createdAt: string }
interface Patient { _id: string; name: string; email: string; phone: string; patientId: string; category: string; createdAt: string; doctor?: { name: string } }

export default function AdminDashboard() {
  const [doctors,  setDoctors]  = useState<Doctor[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/doctors'), api.get('/patients/all')])
      .then(([dRes, pRes]) => { setDoctors(dRes.data); setPatients(pRes.data) })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return (
    <div className="flex h-full items-center justify-center text-gray-400">
      <Loader2 className="animate-spin mr-2" size={20}/> Loading...
    </div>
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Manage doctors and monitor the system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-[#E8F5EE] p-3 rounded-xl"><Stethoscope size={24} className="text-[#1B7A4B]"/></div>
          <div>
            <p className="text-gray-400 text-sm">Total Doctors</p>
            <p className="text-2xl font-bold text-gray-800">{doctors.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl"><Users size={24} className="text-blue-600"/></div>
          <div>
            <p className="text-gray-400 text-sm">Total Patients</p>
            <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
          </div>
        </div>
      </div>

      {/* Recent */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">Recent Doctors</h2>
          <div className="flex flex-col gap-3">
            {doctors.slice(0,5).map(d => (
              <div key={d._id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1B7A4B] font-bold text-sm shrink-0">
                  {d.name[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.specialization || '—'}</p>
                </div>
              </div>
            ))}
            {doctors.length === 0 && <p className="text-sm text-gray-400">No doctors yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">Recent Patients</h2>
          <div className="flex flex-col gap-3">
            {patients.slice(0,5).map(p => (
              <div key={p._id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {p.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.patientId}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">{p.doctor?.name || '—'}</span>
              </div>
            ))}
            {patients.length === 0 && <p className="text-sm text-gray-400">No patients yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}