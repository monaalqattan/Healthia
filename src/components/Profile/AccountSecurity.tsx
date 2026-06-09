import { useState } from 'react'
import { Shield, KeyRound, Loader2, Eye, EyeOff, X } from 'lucide-react'
import { doctorService } from '@/services/api'

export default function AccountSecurity() {
  const [showModal, setShowModal]       = useState(false)
  const [showCurrent, setShowCurrent]   = useState(false)
  const [showNew, setShowNew]           = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [isSaving, setIsSaving]         = useState(false)
  const [success, setSuccess]           = useState(false)
  const [error, setError]               = useState('')
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }))

  const handleSave = async () => {
    setError('')
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Please fill in all fields'); return
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match'); return
    }
    const strong = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    if (!strong.test(form.newPassword)) {
      setError('Password must be 8+ characters with letters, numbers and symbols'); return
    }
    setIsSaving(true)
    try {
      await doctorService.changePassword(form.currentPassword, form.newPassword)
      setSuccess(true)
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => { setSuccess(false); setShowModal(false) }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
          <Shield className="w-4 h-4 text-[#065F46]" />
          Account & Security
        </h2>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-between w-full py-3 border-b border-gray-50 hover:bg-gray-50 rounded-lg px-2 transition-colors"
        >
          <div className="flex items-center gap-3">
            <KeyRound className="w-4 h-4 text-gray-400" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-700">Change Password</div>
              <div className="text-xs text-gray-400">Click to update your password</div>
            </div>
          </div>
          <span className="text-xs text-[#065F46] font-semibold">Update →</span>
        </button>
      </div>

      {/* Change Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>

            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
                <p className="text-xs text-gray-400 mt-0.5">Must be 8+ characters with letters, numbers & symbols</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Current Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Current Password</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} value={form.currentPassword}
                    onChange={e => set('currentPassword', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
                  <button onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">New Password</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={form.newPassword}
                    onChange={e => set('newPassword', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
                  <button onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Confirm New Password</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
                  <button onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {error   && <p className="text-xs text-red-500 mt-3">{error}</p>}
            {success && <p className="text-xs text-green-600 mt-3 font-semibold">✓ Password changed successfully!</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-[#065F46] text-white font-semibold rounded-lg hover:bg-[#054d38] disabled:opacity-60">
                {isSaving ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}