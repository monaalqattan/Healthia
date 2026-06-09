import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { dailyLogService, planService } from '@/services/api'

const MacroBar = ({ label, current, target, color }: any) => (
  <div className="flex-1">
    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</div>
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
      <div className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min((current / target) * 100, 100)}%` }} />
    </div>
    <div className="text-[10px] text-gray-500 font-semibold">{current}/{target}g</div>
  </div>
)

const DailyNutrition: React.FC = () => {
  const [log, setLog] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)

  useEffect(() => {
    dailyLogService.getMyLogs()
      .then(res => setLog(res.data[0]))
      .catch(console.error)
    planService.getMyPlans()
      .then(res => setPlan(res.data[0]))
      .catch(console.error)
  }, [])

  const consumed = log?.calories || 0
  const goal = plan?.caloriesTarget || 2000
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (consumed / goal) * circumference

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h3 className="text-base font-bold text-gray-800 mb-4">Daily Nutrition</h3>

      <div className="flex justify-center mb-4">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#065F46" strokeWidth="10"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            transform="rotate(-90 70 70)" />
          <text x="70" y="65" textAnchor="middle" style={{ fontSize: '22px', fontWeight: 'bold', fill: '#1f2937' }}>
            {consumed.toLocaleString()}
          </text>
          <text x="70" y="80" textAnchor="middle" style={{ fontSize: '9px', fill: '#9ca3af' }}>kcal consumed</text>
          <text x="70" y="93" textAnchor="middle" style={{ fontSize: '8px', fill: '#9ca3af' }}>Goal: {goal.toLocaleString()} kcal</text>
        </svg>
      </div>

      <div className="flex gap-4 mb-4">
        <MacroBar label="Protein" current={plan?.protein || 0} target={120} color="bg-blue-400" />
        <MacroBar label="Carbs" current={plan?.carbs || 0} target={250} color="bg-orange-400" />
        <MacroBar label="Fats" current={plan?.fats || 0} target={70} color="bg-yellow-400" />
      </div>

      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50">
        <ClipboardList className="w-4 h-4" /> View Detailed Log
      </button>
    </div>
  )
}

export default DailyNutrition