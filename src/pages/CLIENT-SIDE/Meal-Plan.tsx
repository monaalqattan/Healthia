import { useState, useEffect } from 'react'
import { planService } from '@/services/api'
import { markDayCompleted } from '@/lib/api'
import { Utensils, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'

// الأيام بنفس ترتيب الـ backend
const DAYS_ORDER = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const DAYS_LABELS: Record<string, string> = {
  Sun: 'SUN', Mon: 'MON', Tue: 'TUE', Wed: 'WED', Thu: 'THU', Fri: 'FRI', Sat: 'SAT'
}

// احسب تاريخ كل يوم من بداية الخطة
function getWeekDates(startDate?: string): Record<string, { date: Date; label: string }> {
  const result: Record<string, { date: Date; label: string }> = {}
  if (!startDate) {
    // لو مفيش startDate، ابدأ من أول الأسبوع الحالي (الأحد)
    const now = new Date()
    now.setHours(0,0,0,0)
    now.setDate(now.getDate() - now.getDay())
    DAYS_ORDER.forEach((day, i) => {
      const d = new Date(now); d.setDate(d.getDate() + i)
      result[day] = { date: d, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) }
    })
    return result
  }
  const [y, m, dd] = startDate.split('-').map(Number)
  const start = new Date(y, m-1, dd)
  // خليها تبدأ من الأحد اللي قبلها أو نفسها
  const startDay = start.getDay() // 0=Sun
  DAYS_ORDER.forEach((day, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() - startDay + i)
    result[day] = { date: d, label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) }
  })
  return result
}

const mealTypeColor: Record<string, string> = {
  BREAKFAST: 'text-green-600 bg-green-50 border-green-200',
  LUNCH:     'text-blue-600 bg-blue-50 border-blue-200',
  DINNER:    'text-orange-600 bg-orange-50 border-orange-200',
  SNACKS:    'text-purple-600 bg-purple-50 border-purple-200',
}

export default function MealPlanPage() {
  const [plans, setPlans]               = useState<any[]>([])
  const [activePlanIdx, setActivePlanIdx] = useState(0)
  const [activeDay, setActiveDay]       = useState<string>(() => DAYS_ORDER[new Date().getDay()])
  const [isLoading, setIsLoading]       = useState(true)
  const [togglingId, setTogglingId]     = useState<string | null>(null)
  const [markingDay, setMarkingDay]     = useState(false)

  useEffect(() => {
    planService.getMyPlans()
      .then(res => setPlans(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const plan = plans[activePlanIdx] || null

  // احسب تواريخ الأسبوع من startDate
  const weekDates = getWeekDates(plan?.startDate)

  // ✅ نجيب وجبات اليوم من الـ days structure الجديدة
  const getDayData = (dayKey: string) => {
    if (!plan) return null
    // جديد: days array
    if (plan.days && plan.days.length > 0) {
      return plan.days.find((d: any) => d.day === dayKey) || null
    }
    return null
  }

  const dayData     = getDayData(activeDay)
  const todayMeals  = dayData?.meals || []
  const isDayDone   = dayData?.completed || false

  const daysWithMeals = new Set(
    plan?.days?.filter((d: any) => d.meals?.length > 0).map((d: any) => d.day) || []
  )
  const daysCompleted = new Set(
    plan?.days?.filter((d: any) => d.completed).map((d: any) => d.day) || []
  )

  const totalCalories = todayMeals.reduce((s: number, m: any) => s + (m.calories || 0), 0)
  const consumedCals  = todayMeals.filter((m: any) => m.completed).reduce((s: number, m: any) => s + (m.calories || 0), 0)
  const remaining     = (plan?.caloriesTarget || totalCalories) - consumedCals
  const completedCount = todayMeals.filter((m: any) => m.completed).length

  // ✅ المريض يعلّم وجبة معينة
  const toggleMeal = async (mealId: string, current: boolean) => {
    if (!plan) return
    setTogglingId(mealId)
    try {
      await planService.updateMealStatus(plan._id, mealId, !current)
      setPlans(prev => prev.map((p, i) => {
        if (i !== activePlanIdx) return p
        return {
          ...p,
          days: p.days?.map((d: any) => ({
            ...d,
            meals: d.meals.map((m: any) =>
              m._id === mealId ? { ...m, completed: !current } : m
            ),
            // لو كل الوجبات اتعلمت → اليوم completed تلقائي
            completed: d.meals.every((m: any) =>
              m._id === mealId ? !current : m.completed
            ),
          })),
        }
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setTogglingId(null)
    }
  }

  // ✅ المريض يعلّم اليوم كله كـ Done
  const handleMarkDayDone = async () => {
    if (!plan || isDayDone) return
    setMarkingDay(true)
    try {
      await markDayCompleted(plan._id, activeDay, true)
      setPlans(prev => prev.map((p, i) => {
        if (i !== activePlanIdx) return p
        return {
          ...p,
          days: p.days?.map((d: any) =>
            d.day === activeDay
              ? { ...d, completed: true, meals: d.meals.map((m: any) => ({ ...m, completed: true })) }
              : d
          ),
        }
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setMarkingDay(false)
    }
  }

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
    </div>
  )

  if (!plan) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3 p-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <Utensils className="w-7 h-7 text-gray-300" />
      </div>
      <h2 className="text-base font-bold text-gray-700">No Meal Plan Yet</h2>
      <p className="text-sm text-gray-400 text-center max-w-xs">
        Your doctor hasn't assigned a meal plan yet. Check back soon!
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Header */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Meal Plan</p>
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-800">{plan.title}</h1>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            plan.status === 'active'    ? 'bg-green-50 text-green-700 border-green-200' :
            plan.status === 'completed' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                                         'bg-red-50 text-red-500 border-red-200'
          }`}>{plan.status}</span>
        </div>
        {plan.doctor && (
          <p className="text-xs text-gray-400 mt-1">
            By Dr. {plan.doctor.name}
            {plan.doctor.specialization && ` · ${plan.doctor.specialization}`}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {daysCompleted.size} / {daysWithMeals.size} days completed
        </p>
      </div>

      {/* Plan switcher */}
      {plans.length > 1 && (
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setActivePlanIdx(i => Math.max(0, i - 1))}
            disabled={activePlanIdx === 0}
            className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-100">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs text-gray-500 font-semibold">
            Plan {activePlanIdx + 1} of {plans.length}
          </span>
          <button onClick={() => setActivePlanIdx(i => Math.min(plans.length - 1, i + 1))}
            disabled={activePlanIdx === plans.length - 1}
            className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-100">
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Days Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {DAYS_ORDER.map((day) => {
            const has  = daysWithMeals.has(day)
            const dateLabel = weekDates[day]?.label || ""
            const done = daysCompleted.has(day)
            const isAct = activeDay === day
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                disabled={!has}
                className={[
                  'flex-1 min-w-[44px] flex flex-col items-center py-2.5 rounded-xl text-xs font-bold transition-all',
                  isAct  ? 'bg-[#065F46] text-white shadow'
                  : done  ? 'bg-green-50 text-green-700 border border-green-200'
                  : has   ? 'text-gray-400 hover:bg-gray-50'
                  :         'opacity-30 cursor-not-allowed text-gray-200'
                ].join(' ')}
              >
                {DAYS_LABELS[day]}
                {done && <span className={`text-[8px] mt-0.5 ${isAct ? 'text-green-200' : 'text-green-500'}`}>✓</span>}
                {!done && has && <span className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isAct ? 'bg-white' : 'bg-green-400'}`} />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* Meals List */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#065F46]" />
              <h2 className="text-base font-bold text-gray-800">
                {DAYS_LABELS[activeDay]}'s Menu
                {weekDates[activeDay] && (
                  <span className="text-sm font-normal text-gray-400 ml-2">
                    — {weekDates[activeDay].label}
                  </span>
                )}
              </h2>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="text-gray-400">
                REMAINING <span className="font-bold text-[#065F46]">{remaining} kcal</span>
              </span>
              <span className="text-gray-400">
                TOTAL <span className="font-bold text-gray-600">{totalCalories} kcal</span>
              </span>
            </div>
          </div>

          {todayMeals.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
              <Utensils className="w-8 h-8 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No meals planned for {DAYS_LABELS[activeDay]}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todayMeals.map((meal: any) => (
                <div key={meal._id}
                  className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                    meal.completed ? 'border-green-200' : 'border-gray-100'
                  }`}>
                  <div className="flex gap-4 p-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      <Utensils className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mealTypeColor[meal.type] || 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                            {meal.type}
                          </span>
                          <h3 className={`text-sm font-bold mt-1 ${meal.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {meal.name}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0 font-semibold">{meal.calories} kcal</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    {meal.completed ? (
                      <div className="flex items-center justify-center gap-1.5 bg-green-50 text-green-600 text-xs font-semibold py-2 rounded-xl">
                        <Check size={14} /> Done
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleMeal(meal._id, meal.completed)}
                        disabled={!!togglingId || isDayDone}
                        className="w-full bg-[#065F46] text-white text-xs font-semibold py-2 rounded-xl hover:bg-[#054d38] disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {togglingId === meal._id
                          ? <><Loader2 size={12} className="animate-spin" /> Saving...</>
                          : 'Mark as Done'
                        }
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* ✅ زرار "I'm done for today" */}
              {!isDayDone && todayMeals.length > 0 && (
                <button
                  onClick={handleMarkDayDone}
                  disabled={markingDay}
                  className="w-full mt-2 border-2 border-[#065F46] text-[#065F46] text-sm font-bold py-3 rounded-2xl hover:bg-green-50 disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
                >
                  {markingDay
                    ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
                    : <><Check size={16} /> I'm done for today!</>
                  }
                </button>
              )}

              {isDayDone && (
                <div className="w-full mt-2 bg-green-50 border border-green-200 text-green-700 text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2">
                  <Check size={16} /> Great job! Day completed 🎉
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">

          {/* Weekly Progress */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Weekly Progress</h3>
            <div className="flex gap-1.5">
              {DAYS_ORDER.map((day) => {
                const d = plan.days?.find((pd: any) => pd.day === day)
                const total = d?.meals?.length || 0
                const done  = d?.meals?.filter((m: any) => m.completed).length || 0
                const pct   = total > 0 ? (done / total) * 100 : 0
                const isDone = d?.completed || false
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-20 bg-gray-100 rounded-lg overflow-hidden flex items-end">
                      <div
                        className={`w-full rounded-lg transition-all ${
                          isDone ? 'bg-[#065F46]'
                          : day === activeDay ? 'bg-emerald-400'
                          : 'bg-emerald-200'
                        }`}
                        style={{ height: `${Math.max(pct, total > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${day === activeDay ? 'text-[#065F46]' : 'text-gray-300'}`}>
                      {DAYS_LABELS[day]}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 text-xs text-gray-400 text-center">
              {completedCount}/{todayMeals.length} meals done today
            </div>
          </div>

          {/* Calorie Ring */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Calorie Target</h3>
            <div className="flex justify-center mb-3">
              <svg width="120" height="120" viewBox="0 0 120 120">
                {(() => {
                  const r = 46; const c = 2 * Math.PI * r
                  const pct = Math.min(consumedCals / (plan.caloriesTarget || 2000), 1)
                  return (
                    <>
                      <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
                      <circle cx="60" cy="60" r={r} fill="none" stroke="#065F46" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={c} strokeDashoffset={c - pct * c}
                        transform="rotate(-90 60 60)" />
                      <text x="60" y="56" textAnchor="middle" style={{ fontSize: '18px', fontWeight: 'bold', fill: '#1f2937' }}>
                        {consumedCals}
                      </text>
                      <text x="60" y="70" textAnchor="middle" style={{ fontSize: '8px', fill: '#9ca3af' }}>
                        of {plan.caloriesTarget || 2000} kcal
                      </text>
                    </>
                  )
                })()}
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Protein', val: plan.protein || 0, color: 'bg-blue-400' },
                { label: 'Carbs',   val: plan.carbs   || 0, color: 'bg-orange-400' },
                { label: 'Fats',    val: plan.fats    || 0, color: 'bg-yellow-400' },
              ].map(m => (
                <div key={m.label}>
                  <div className={`w-2 h-2 rounded-full ${m.color} mx-auto mb-1`} />
                  <div className="text-xs font-bold text-gray-700">{m.val}g</div>
                  <div className="text-[10px] text-gray-400">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {plan.notes && (
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Doctor's Notes</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{plan.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}