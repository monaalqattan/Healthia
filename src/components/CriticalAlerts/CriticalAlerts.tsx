import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { patientService, appointmentService } from '@/services/api'
import { AlertTriangle, ChevronRight, Scale, Calendar, TrendingDown, ClipboardList, CalendarDays } from 'lucide-react'

interface Alert {
  id:          string
  patientName: string
  patientId:   string
  severity:    'critical' | 'warning' | 'info'
  type:        string
  description: string
  date:        Date        // ← عشان نقدر نفلتر بالتاريخ
  icon:        React.ReactNode
}

type Period = 'today' | 'week' | 'month' | 'all'

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today'        },
  { key: 'week',  label: 'Last 7 days'  },
  { key: 'month', label: 'Last 30 days' },
  { key: 'all',   label: 'All time'     },
]

const CriticalAlerts: React.FC = () => {
  const navigate = useNavigate()
  const [allAlerts, setAllAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod]       = useState<Period>('all')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // إغلاق الـ dropdown لما تضغط بره
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    Promise.allSettled([
      patientService.getMyPatients(),
      appointmentService.getMyAppointments(),
    ]).then(([pRes, aRes]) => {
      const flagged: Alert[] = []
      const patients: any[]     = pRes.status === 'fulfilled' ? pRes.value.data : []
      const appointments: any[] = aRes.status === 'fulfilled' ? aRes.value.data : []
      const now   = new Date()
      const today = new Date(now); today.setHours(0,0,0,0)

      patients.forEach(p => {
        const pDate = new Date(p.updatedAt || p.createdAt || now)

        // 1 — ناقص weight أو height
        if (!p.weight || p.weight === 0 || !p.height || p.height === 0) {
          flagged.push({
            id: p._id, patientName: p.name, patientId: p.patientId,
            severity: 'critical', type: 'missing_measurements', date: pDate,
            description: !p.weight && !p.height
              ? 'Weight & height missing — BMI cannot be calculated.'
              : !p.weight ? 'Weight not recorded — plan targets may be inaccurate.'
              : 'Height not recorded — BMI cannot be calculated.',
            icon: <Scale size={14} />,
          })
        }

        // 2 — compliance أقل من 30%
        const compliance = p.adherence ?? p.compliance ?? 0
        if (compliance > 0 && compliance < 30) {
          flagged.push({
            id: p._id, patientName: p.name, patientId: p.patientId,
            severity: 'critical', type: 'low_compliance', date: pDate,
            description: `Compliance is critically low at ${compliance}% — patient may not be following the plan.`,
            icon: <TrendingDown size={14} />,
          })
        } else if (compliance >= 30 && compliance < 60) {
          flagged.push({
            id: p._id, patientName: p.name, patientId: p.patientId,
            severity: 'warning', type: 'medium_compliance', date: pDate,
            description: `Compliance is at ${compliance}% — consider reaching out to this patient.`,
            icon: <TrendingDown size={14} />,
          })
        }

        // 3 — مفيش نشاط من أكتر من 7 أيام
        const daysSince = Math.floor((today.getTime() - pDate.getTime()) / 86400000)
        if (daysSince >= 7) {
          flagged.push({
            id: p._id, patientName: p.name, patientId: p.patientId,
            severity: 'warning', type: 'inactive', date: pDate,
            description: `No activity recorded for ${daysSince} days.`,
            icon: <ClipboardList size={14} />,
          })
        }
      })

      // 4 — مواعيد scheduled
      const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
      appointments
        .filter((a: any) => {
          const d  = new Date(a.date)
          const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
          return ds === todayStr && a.status === 'scheduled'
        })
        .slice(0, 3)
        .forEach((a: any) => {
          flagged.push({
            id: a.patient?._id || a.patient,
            patientName: a.patient?.name || 'Patient',
            patientId: '', severity: 'info', type: 'appointment_today',
            date: new Date(),
            description: `Appointment today at ${a.time} — ${a.type || 'Follow-up'}`,
            icon: <Calendar size={14} />,
          })
        })

      const order = { critical: 0, warning: 1, info: 2 }
      flagged.sort((a, b) => order[a.severity] - order[b.severity])
      setAllAlerts(flagged)
    })
    .catch(console.error)
    .finally(() => setIsLoading(false))
  }, [])

  // فلتر بالـ period المختار
  const now = new Date()
  const alerts = allAlerts.filter(a => {
    if (period === 'all')   return true
    if (period === 'today') return a.date >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (period === 'week')  return a.date >= new Date(now.getTime() - 7  * 86400000)
    if (period === 'month') return a.date >= new Date(now.getTime() - 30 * 86400000)
    return true
  }).slice(0, 6)

  const goToProfile = (id: string) => {
    if (!id) return
    localStorage.setItem('selectedPatientId', id)
    navigate('/doctor/patientProfile')
  }

  const severityStyle = {
    critical: { border: 'border-red-500',    bg: 'bg-red-50/50',    avatar: 'bg-red-500',    badge: 'bg-red-100 text-red-600'     },
    warning:  { border: 'border-orange-400', bg: 'bg-orange-50/40', avatar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-600' },
    info:     { border: 'border-blue-500',   bg: 'bg-blue-50/60',   avatar: 'bg-blue-500',   badge: 'bg-blue-500 text-white'        },
  }
  const severityLabel = { critical: 'Critical', warning: 'Warning', info: 'Today' }

  const criticalCount = alerts.filter(a => a.severity === 'critical').length
  const warningCount  = alerts.filter(a => a.severity === 'warning').length
  const selectedLabel = PERIOD_OPTIONS.find(p => p.key === period)?.label || 'All time'

  if (isLoading) return (
    <div className="mb-6 rounded-[2.5rem] bg-white p-8 shadow-sm text-center text-gray-400 text-sm animate-pulse">
      Loading alerts...
    </div>
  )

  return (
    <div className="mb-6 rounded-[2.5rem] bg-white p-6 md:p-8 shadow-sm">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <AlertTriangle size={15} className="text-orange-500" />
          Patient Alerts
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {/* badges */}
          {criticalCount > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-semibold text-white">
              {criticalCount} CRITICAL
            </span>
          )}
          {warningCount > 0 && (
            <span className="rounded-full bg-orange-400 px-2.5 py-1 text-[10px] font-semibold text-white">
              {warningCount} WARNING
            </span>
          )}

          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 bg-green-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-green-800 transition-all"
            >
              <CalendarDays size={13} />
              {selectedLabel}
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"
                className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 min-w-[150px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-3 pt-1 pb-1.5">Period</p>
                {PERIOD_OPTIONS.map(opt => (
                  <button key={opt.key}
                    onClick={() => { setPeriod(opt.key); setDropdownOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors ${
                      period === opt.key ? 'text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {period === opt.key ? <span className="text-green-600">✓</span> : <span className="w-3.5"/>}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-sm font-semibold text-green-700">No alerts for this period</p>
          <p className="text-xs text-gray-400">All good — no action required</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {alerts.map((alert, i) => {
            const s = severityStyle[alert.severity]
            return (
              <div key={`${alert.id}-${i}`}
                onClick={() => goToProfile(alert.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border-l-4 cursor-pointer hover:opacity-90 transition-all ${s.border} ${s.bg}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${s.avatar}`}>
                  {alert.patientName[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-gray-800">{alert.patientName}</p>
                    {alert.patientId && (
                      <span className="text-[10px] text-gray-400 font-mono">{alert.patientId}</span>
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
                      {severityLabel[alert.severity]}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 mt-0.5">
                    <span className={`mt-0.5 shrink-0 ${
                      alert.severity === 'critical' ? 'text-red-400'
                      : alert.severity === 'warning' ? 'text-orange-400'
                      : 'text-blue-400'
                    }`}>{alert.icon}</span>
                    <p className="text-xs text-gray-500 leading-relaxed">{alert.description}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 shrink-0 mt-1" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CriticalAlerts