import { BadgeCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { patientService, appointmentService } from '@/services/api'

const NetworkVitalityCard: React.FC = () => {
  const [totalPatients, setTotalPatients] = useState(0)
  const [todayAppts, setTodayAppts]       = useState(0)
  const [isLoading, setIsLoading]         = useState(true)

  useEffect(() => {
    Promise.allSettled([
      patientService.getMyPatients(),
      appointmentService.getMyAppointments(),
    ]).then(([pRes, aRes]) => {
      if (pRes.status === 'fulfilled') setTotalPatients(pRes.value.data.length)
      if (aRes.status === 'fulfilled') {
        const today = new Date().toDateString()
        setTodayAppts(aRes.value.data.filter(
          (a: any) => new Date(a.date).toDateString() === today
        ).length)
      }
    }).finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="bg-[#197E46] rounded-2xl p-6 text-white mb-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-2 plus-jakarta">Network Vitality & Compliance</h2>
      <div className="flex justify-between items-center flex-wrap">
        <p className="text-sm text-white/85 mb-5 w-full sm:w-5/6 md:w-4/6 lg:w-3/6">
          You currently have <strong>{isLoading ? '...' : totalPatients}</strong> registered patients
          and <strong>{isLoading ? '...' : todayAppts}</strong> appointments scheduled for today.
        </p>
        <div className="flex gap-3 mb-5">
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center min-w-20">
            <div className="text-xl font-bold text-white">{isLoading ? '—' : totalPatients}</div>
            <div className="text-[10px] text-white/80 mt-1">TOTAL PATIENTS</div>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center min-w-20">
            <div className="text-xl font-bold text-white">{isLoading ? '—' : todayAppts}</div>
            <div className="text-[10px] text-white/80 mt-1">TODAY'S APPTS</div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default NetworkVitalityCard