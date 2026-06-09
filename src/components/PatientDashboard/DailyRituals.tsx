import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { planService } from '@/services/api'

const DailyRituals: React.FC = () => {
  const [plan, setPlan] = useState<any>(null)
  const [rituals, setRituals] = useState<any[]>([])

  useEffect(() => {
    planService.getMyPlans()
      .then(res => {
        const activePlan = res.data[0]
        setPlan(activePlan)
        setRituals(activePlan?.rituals || [])
      })
      .catch(console.error)
  }, [])

  const toggle = async (ritualId: string, current: boolean) => {
    if (!plan) return
    try {
      await planService.updateRitualStatus(plan._id, ritualId, !current)
      setRituals(prev => prev.map(r => r._id === ritualId ? { ...r, completed: !current } : r))
    } catch (err) {
      console.error(err)
    }
  }

  const doneCount = rituals.filter(r => r.completed).length

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-800">Daily Rituals</h3>
        <span className="text-xs font-bold text-gray-400">{doneCount}/{rituals.length} DONE</span>
      </div>

      {rituals.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No rituals in your plan yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {rituals.map(ritual => (
            <button key={ritual._id} onClick={() => toggle(ritual._id, ritual.completed)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                ritual.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
              }`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                ritual.completed ? 'bg-[#065F46] border-[#065F46]' : 'border-gray-300'
              }`}>
                {ritual.completed && <Check className="w-3 h-3 text-white" />}
              </span>
              <span className={`text-sm ${ritual.completed ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                {ritual.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DailyRituals