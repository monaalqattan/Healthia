// src/pages/Patients/SuccessAlert.tsx
// Alert نجاح إضافة المريض مع الـ credentials

import { useState } from "react"
import { Check, Copy, Lock, Mail } from "lucide-react"
import type { PatientRecord } from "@/store/patientsStore"

interface Props {
  patient: PatientRecord
  onGoToProfile: () => void
  onBack: () => void
}

export default function SuccessAlert({ patient, onGoToProfile, onBack }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`Email: ${patient.email}\nPassword: ${patient.password}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center">

        {/* Check icon */}
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center">
            <Check size={20} className="text-white" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">Patient Successfully Added</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          The health records for the new member have been initialized and are ready for use.
        </p>

        {/* Credentials Box */}
        <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Credentials</span>
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Temporary Access</span>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="text-[10px] text-gray-400 uppercase tracking-wide">Username / Email</label>
            <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <Mail size={13} className="text-gray-400" />
              <span className="text-sm text-gray-700">{patient.email}</span>
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-[10px] text-gray-400 uppercase tracking-wide">Temporary Password</label>
            <div className="mt-1 flex items-center justify-between gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white">
              <div className="flex items-center gap-2">
                <Lock size={13} className="text-gray-400" />
                <span className="text-sm text-gray-700 font-mono">{patient.password}</span>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1 text-green-700 text-xs font-semibold hover:text-green-800">
                <Copy size={12} />
                {copied ? "Copied!" : "COPY CREDENTIALS"}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2">
            <span className="text-blue-400 text-xs mt-0.5">ℹ</span>
            <p className="text-[11px] text-blue-600 leading-relaxed">
              For security, this temporary password will expire in 24 hours. The patient will be prompted to change it upon their first login.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <button onClick={onGoToProfile}
          className="w-full py-3 bg-green-700 text-white font-semibold text-sm rounded-2xl hover:bg-green-800 transition-colors mb-3 flex items-center justify-center gap-2">
          Go to Patient Profile →
        </button>
        <button onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Back to Directory
        </button>

      </div>
    </div>
  )
}