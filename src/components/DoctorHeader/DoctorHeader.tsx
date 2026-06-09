import React, { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import EditProfileModal from '../Profile/EditProfileModal'
import { patientService, planService } from '@/services/api'

interface DoctorHeaderProps {
  doctor: any
  onSave: (updatedData: any) => void
}

const DoctorHeader: React.FC<DoctorHeaderProps> = ({ doctor, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [stats, setStats] = useState({ totalPatients: 0, plansCreated: 0 })

  useEffect(() => {
    Promise.allSettled([
      patientService.getMyPatients(),
    ]).then(([pRes]) => {
      const total = pRes.status === 'fulfilled' ? pRes.value.data.length : 0
      setStats({ totalPatients: total, plansCreated: 0 })
    })
  }, [])

  const initials = doctor?.name
    ? doctor.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "DR"

  return (
    <>
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
          <div className="flex gap-4 items-start">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl bg-emerald-700 flex items-center justify-center text-white text-2xl font-bold">
                {doctor?.profileImage
                  ? <img src={doctor.profileImage} alt={doctor.name} className="w-full h-full object-cover rounded-xl" />
                  : initials
                }
              </div>
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-800">
                  {doctor?.name ? `Dr. ${doctor.name}` : "—"}
                </h1>
                {doctor?.specialization && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    {doctor.specialization}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#065F46] mb-1">{doctor?.role === 'doctor' ? 'Nutritionist & Diet Specialist' : ''}</p>
              <p className="text-xs text-gray-500">{doctor?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shrink-0 self-start"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Total Patients</div>
            <div className="text-2xl font-bold text-gray-800">{stats.totalPatients}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Member Since</div>
            <div className="text-2xl font-bold text-gray-800">
              {doctor?.createdAt ? new Date(doctor.createdAt).getFullYear() : "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Phone</div>
            <div className="text-lg font-bold text-gray-800">{doctor?.phone || "—"}</div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        doctor={doctor}
        onClose={() => setIsModalOpen(false)}
        onSave={(updatedData) => {
          onSave(updatedData)
          setIsModalOpen(false)
        }}
      />
    </>
  )
}

export default DoctorHeader