import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { doctorService } from '@/services/api'

interface Props {
  isOpen:  boolean
  doctor:  any
  onClose: () => void
  onSave:  (updated: any) => void
}

export default function EditProfileModal({ isOpen, doctor, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    name: '', specialization: '', bio: '',
    email: '', phone: '', location: '', languages: '',
    licenseId: '', licenseExpiry: '',
    specialties: '', education: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (doctor) setForm({
      name:           doctor.name           || '',
      specialization: doctor.specialization || '',
      bio:            doctor.bio            || '',
      email:          doctor.email          || '',
      phone:          doctor.phone          || '',
      location:       doctor.location       || '',
      languages:      doctor.languages      || '',
      licenseId:      doctor.licenseId      || '',
      licenseExpiry:  doctor.licenseExpiry  || '',
      specialties:    (doctor.specialties   || []).join(', '),
      education:      doctor.education?.[0]
        ? `${doctor.education[0].school} • ${doctor.education[0].degree} • ${doctor.education[0].years}`
        : '',
    })
  }, [doctor])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    try {
      // نحول الـ specialties و education لـ format مناسب
      const payload = {
        ...form,
        specialties: form.specialties
          ? form.specialties.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        education: form.education
          ? [{ school: form.education, degree: '', years: '' }]
          : [],
      }
      const res = await doctorService.updateMyProfile(payload)
      onSave(res.data.doctor)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update your personal and professional information.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col gap-4">

          {/* Personal Info */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Personal Information</p>
          {[
            { label: 'Full Name',       name: 'name',           type: 'text'  },
            { label: 'Specialty',       name: 'specialization', type: 'text'  },
            { label: 'Email Address',   name: 'email',          type: 'email' },
            { label: 'Phone Number',    name: 'phone',          type: 'tel'   },
            { label: 'Office Location', name: 'location',       type: 'text'  },
            { label: 'Languages',       name: 'languages',      type: 'text'  },
          ].map(f => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{f.label}</label>
              <input type={f.type} name={f.name} value={(form as any)[f.name]} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30 resize-none" />
          </div>

          {/* Professional Details */}
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-2">Professional Details</p>
          {[
            { label: 'License ID',     name: 'licenseId',     type: 'text', placeholder: 'e.g. #MD-884920'     },
            { label: 'License Expiry', name: 'licenseExpiry', type: 'text', placeholder: 'e.g. 12/2026'        },
          ].map(f => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">{f.label}</label>
              <input type={f.type} name={f.name} placeholder={f.placeholder}
                value={(form as any)[f.name]} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
              Specialties <span className="font-normal text-gray-400">(comma separated)</span>
            </label>
            <input type="text" name="specialties" value={form.specialties} onChange={handleChange}
              placeholder="e.g. Nutrition, Weight Loss, Diabetes"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Education</label>
            <input type="text" name="education" value={form.education} onChange={handleChange}
              placeholder="e.g. Cairo University • Bachelor of Nutrition • 2015 - 2019"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          <button onClick={handleSave} disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 text-sm bg-[#065F46] text-white font-semibold rounded-lg hover:bg-[#054d38] disabled:opacity-60">
            {isSaving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}