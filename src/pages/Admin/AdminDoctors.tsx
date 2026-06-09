import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Plus, Trash2, Edit2, X, Search, Loader2 } from 'lucide-react'

interface Doctor { _id: string; name: string; email: string; specialization: string; phone: string; createdAt: string }

export default function AdminDoctors() {
  const [doctors,   setDoctors]   = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', phone: '' })
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [search,  setSearch]  = useState('')

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors')
      setDoctors(res.data)
    } catch (err) { console.error(err) }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchDoctors() }, [])

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async () => {
    setError('')
    try {
      if (editDoctor) {
        await api.put(`/doctors/${editDoctor._id}`, form)
        setSuccess('Doctor updated successfully')
      } else {
        await api.post('/doctors', form)
        setSuccess('Doctor added successfully')
      }
      setShowModal(false)
      setEditDoctor(null)
      setForm({ name: '', email: '', password: '', specialization: '', phone: '' })
      fetchDoctors()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this doctor?')) return
    try { await api.delete(`/doctors/${id}`); fetchDoctors() }
    catch (err) { console.error(err) }
  }

  const openEdit = (doctor: Doctor) => {
    setEditDoctor(doctor)
    setForm({ name: doctor.name, email: doctor.email, password: '', specialization: doctor.specialization || '', phone: doctor.phone || '' })
    setShowModal(true)
  }

  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-400" size={24}/></div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Doctors</h1>
          <p className="text-gray-400 text-sm mt-1">{doctors.length} registered doctors</p>
        </div>
        <button onClick={() => { setEditDoctor(null); setForm({ name:'', email:'', password:'', specialization:'', phone:'' }); setShowModal(true) }}
          className="flex items-center gap-2 bg-[#1B7A4B] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#15613c]">
          <Plus size={16}/> Add Doctor
        </button>
      </div>

      {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-xl text-sm">{success}</div>}

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B7A4B]"/>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Specialization</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(doctor => (
              <tr key={doctor._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#1B7A4B] font-bold text-xs shrink-0">
                      {doctor.name[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800 text-sm">{doctor.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{doctor.email}</td>
                <td className="px-6 py-4 text-gray-500 text-sm max-w-[180px] truncate">{doctor.specialization || '—'}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{doctor.phone || '—'}</td>
                <td className="px-6 py-4 text-gray-400 text-xs">
                  {new Date(doctor.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(doctor)} className="p-2 text-gray-400 hover:text-[#1B7A4B] hover:bg-green-50 rounded-lg transition-colors"><Edit2 size={15}/></button>
                    <button onClick={() => handleDelete(doctor._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15}/></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No doctors found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">{editDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label:'Full Name',      key:'name',           type:'text',     placeholder:'Dr. John Doe'            },
                { label:'Email',          key:'email',          type:'email',    placeholder:'doctor@healthia.com'     },
                { label:'Password',       key:'password',       type:'password', placeholder: editDoctor ? 'Leave blank to keep current' : 'Min 8 characters' },
                { label:'Specialization', key:'specialization', type:'text',     placeholder:'e.g. Nutrition & Wellness'},
                { label:'Phone',          key:'phone',          type:'text',     placeholder:'+20 100 000 0000'         },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1B7A4B]"/>
                </div>
              ))}
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSubmit} className="flex-1 py-2.5 bg-[#1B7A4B] text-white rounded-xl text-sm font-semibold hover:bg-[#15613c]">
                  {editDoctor ? 'Update' : 'Add Doctor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}