import React, { useEffect, useState } from 'react'
import { patientService, appointmentService } from '@/services/api'
import { Users, Calendar, TrendingUp } from 'lucide-react'

interface StatCardProps {
  title:      string
  value:      string | number
  badge?:     string
  badgeClass?: string
  icon:       React.ReactNode
  isLoading?: boolean
  sub?:       string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, badge, badgeClass, icon, isLoading, sub }) => (
  <div className="bg-white rounded-xl px-4 py-4 shadow-sm flex items-start justify-between gap-3">
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
        <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">{title}</span>
        {badge && (
          <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="text-xl md:text-3xl font-bold text-gray-800">
        {isLoading
          ? <span className="text-gray-200 animate-pulse">—</span>
          : value
        }
      </div>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
      {icon}
    </div>
  </div>
)

const StatsRow: React.FC = () => {
  const [totalPatients,    setTotalPatients]    = useState(0)
  const [todayAppts,       setTodayAppts]       = useState(0)
  const [avgCompliance,    setAvgCompliance]    = useState(0)
  const [isLoading,        setIsLoading]        = useState(true)

  useEffect(() => {
    Promise.allSettled([
      patientService.getMyPatients(),
      appointmentService.getMyAppointments(),
    ]).then(([pRes, aRes]) => {
      if (pRes.status === 'fulfilled') {
        const patients = pRes.value.data
        setTotalPatients(patients.length)

        // حساب متوسط الـ compliance من الـ adherence field
        const withAdherence = patients.filter((p: any) => p.adherence > 0)
        if (withAdherence.length > 0) {
          const avg = Math.round(
            withAdherence.reduce((s: number, p: any) => s + p.adherence, 0) / withAdherence.length
          )
          setAvgCompliance(avg)
        }
      }

      if (aRes.status === 'fulfilled') {
        const today = new Date().toDateString()
        const todayCount = aRes.value.data.filter(
          (a: any) => new Date(a.date).toDateString() === today && a.status === 'scheduled'
        ).length
        setTodayAppts(todayCount)
      }
    }).finally(() => setIsLoading(false))
  }, [])

  // compliance color
  const complianceColor = avgCompliance >= 70
    ? 'bg-green-100 text-green-700'
    : avgCompliance >= 40
    ? 'bg-orange-100 text-orange-600'
    : 'bg-red-100 text-red-600'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
      <StatCard
        title="Total Patients"
        value={totalPatients}
        badge="+Active"
        badgeClass="bg-green-100 text-green-700"
        icon={<Users size={18} />}
        isLoading={isLoading}
        sub="All registered patients"
      />
      <StatCard
        title="Today's Appointments"
        value={todayAppts}
        badge="Today"
        badgeClass="bg-orange-100 text-orange-600"
        icon={<Calendar size={18} />}
        isLoading={isLoading}
        sub="Scheduled for today"
      />
    </div>
  )
}

export default StatsRow