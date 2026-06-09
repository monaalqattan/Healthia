import { useEffect, useState } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { patientService, dailyLogService } from '@/services/api'

const WeightManagement: React.FC = () => {
  const [patient, setPatient] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    Promise.all([
      patientService.getMyProfile(),
      dailyLogService.getMyLogs(),
    ]).then(([pRes, lRes]) => {
      setPatient(pRes.data)
      setLogs(lRes.data)
    }).catch(console.error)
  }, [])

  const currentWeight = logs[0]?.weight || patient?.weight || 0
  const lastWeight = logs[1]?.weight || currentWeight
  const targetWeight = currentWeight - 5
  const startWeight = patient?.weight || currentWeight
  const diff = parseFloat((currentWeight - lastWeight).toFixed(1))
  const percentage = startWeight > targetWeight
    ? Math.min(100, Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100))
    : 0

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const last9 = [...logs].reverse().slice(-9)

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">Weight Management</h3>
          <p className="text-xs text-gray-400 mt-0.5">Target: {targetWeight} kg</p>
        </div>
        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
          {percentage}% COMPLETE
        </span>
      </div>

      <div className="flex items-center gap-6 mb-4">
        <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#065F46" strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            transform="rotate(-90 50 50)" />
          <text x="50" y="52" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 'bold', fill: '#065F46' }}>
            {percentage}%
          </text>
          <text x="50" y="64" textAnchor="middle" style={{ fontSize: '7px', fill: '#9ca3af' }}>
            PROGRESS
          </text>
        </svg>

        <div className="flex flex-col gap-3 flex-1">
          <div className="bg-gray-50 rounded-xl px-4 py-2">
            <div className="text-[10px] text-gray-400 uppercase">Current</div>
            <div className="text-lg font-bold text-gray-800">{currentWeight} kg</div>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-2">
            <div className="text-[10px] text-gray-400 uppercase">Target</div>
            <div className="text-lg font-bold text-gray-800">{targetWeight} kg</div>
          </div>
        </div>

        <div className="text-center shrink-0">
          {diff <= 0
            ? <TrendingDown className="w-5 h-5 text-green-500 mx-auto mb-1" />
            : <TrendingUp className="w-5 h-5 text-red-400 mx-auto mb-1" />
          }
          <div className={`text-sm font-bold ${diff <= 0 ? 'text-green-600' : 'text-red-400'}`}>
            {diff > 0 ? '+' : ''}{diff} kg
          </div>
          <div className="text-[10px] text-gray-400">Since last log</div>
        </div>
      </div>

    </div>
  )
}

export default WeightManagement