import { useEffect, useState } from 'react'
import { Utensils, RefreshCw } from 'lucide-react'
import { planService } from '@/services/api'

const mealTypeColor: Record<string, string> = {
  BREAKFAST: 'text-green-600 bg-green-50',
  LUNCH: 'text-blue-600 bg-blue-50',
  DINNER: 'text-orange-600 bg-orange-50',
  SNACKS: 'text-purple-600 bg-purple-50',
}

const TodaysNourishment: React.FC = () => {
  const [plan, setPlan] = useState<any>(null)
  const [meals, setMeals] = useState<any[]>([])

  useEffect(() => {
    planService.getMyPlans()
      .then(res => {
        const activePlan = res.data[0]
        setPlan(activePlan)
        setMeals(activePlan?.meals || [])
      })
      .catch(console.error)
  }, [])

  const toggleMeal = async (mealId: string, current: boolean) => {
    if (!plan) return
    try {
      await planService.updateMealStatus(plan._id, mealId, !current)
      setMeals(prev => prev.map(m => m._id === mealId ? { ...m, completed: !current } : m))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-800">Today's Nourishment</h3>
        <button className="text-[#065F46] text-xs font-semibold hover:underline">
          Full Weekly Plan →
        </button>
      </div>

      {meals.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No meal plan assigned yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {meals.map(meal => (
            <div key={meal._id} className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="h-28 bg-gray-100 relative flex items-center justify-center">
                <Utensils className="w-8 h-8 text-gray-300" />
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${mealTypeColor[meal.type] || 'text-gray-600 bg-gray-50'}`}>
                  {meal.type}
                </span>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-semibold text-gray-800">{meal.name}</div>
                  <div className="text-xs text-gray-400">{meal.calories} kcal</div>
                </div>
                <div className="flex items-center gap-2">
                  {meal.completed ? (
                    <div className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 text-xs font-semibold py-1.5 rounded-lg">
                      ✓ Logged
                    </div>
                  ) : (
                    <button onClick={() => toggleMeal(meal._id, meal.completed)}
                      className="flex-1 bg-[#065F46] text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-[#054d38]">
                      Mark Completed
                    </button>
                  )}
                  <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">
                    <RefreshCw className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TodaysNourishment