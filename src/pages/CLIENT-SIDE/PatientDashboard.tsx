import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '@/context/AuthContext'
import {
  patientService, planService,
  dailyLogService, appointmentService,
} from '@/services/api'
import { CheckUpModal, type CheckUpData } from '@/components/PatientDashboard/CheckUpModal'
import {
  Calendar, Clock, TrendingDown, TrendingUp,
  Utensils, Check, RefreshCw, ClipboardList,
  ChevronRight, Loader2, ClipboardCheck,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// Helper: Circular Progress SVG
// ─────────────────────────────────────────────────────────
function CircleProgress({
  value, max, size = 120, stroke = 10, color = '#065F46', label, sub,
}: {
  value: number; max: number; size?: number; stroke?: number
  color?: string; label: string; sub?: string
}) {
  const r   = (size - stroke) / 2
  const c   = 2 * Math.PI * r
  const pct = Math.min(value / (max || 1), 1)
  const off = c - pct * c
  const cx  = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${cx} ${cx})`} />
      <text x={cx} y={cx - 6} textAnchor="middle"
        style={{ fontSize: size * 0.17, fontWeight: 'bold', fill: '#1f2937' }}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={cx + 10} textAnchor="middle"
          style={{ fontSize: size * 0.075, fill: '#9ca3af' }}>
          {sub}
        </text>
      )}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// Macro Bar
// ─────────────────────────────────────────────────────────
function MacroBar({ label, current, target, color }: {
  label: string; current: number; target: number; color: string
}) {
  const pct = Math.min((current / (target || 1)) * 100, 100)
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</span>
        <span className="text-[10px] font-bold text-gray-600">{current}g</span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[10px] text-gray-300 mt-0.5">/ {target}g</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Meal Type Colors
// ─────────────────────────────────────────────────────────
const MEAL_COLOR: Record<string, string> = {
  BREAKFAST: 'text-green-600 bg-green-50',
  LUNCH:     'text-blue-600 bg-blue-50',
  DINNER:    'text-orange-600 bg-orange-50',
  SNACKS:    'text-purple-600 bg-purple-50',
}

// ─────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────
export default function PatientDashboard() {
  const { user }    = useAuth()
  const navigate    = useNavigate()

  const [patient,      setPatient]      = useState<any>(null)
  const [plan,         setPlan]         = useState<any>(null)
  const [logs,         setLogs]         = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [meals,        setMeals]        = useState<any[]>([])
  const [isLoading,    setIsLoading]    = useState(true)
  const [checkUpOpen,  setCheckUpOpen]  = useState(false)

  // ── Greeting ──────────────────────────────────────────
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  // ── Fetch All ─────────────────────────────────────────
  useEffect(() => {
    Promise.allSettled([
      patientService.getMyProfile(),
      planService.getMyPlans(),
      dailyLogService.getMyLogs(),
      appointmentService.getMyAppointments_Patient(),
    ]).then(([pRes, plRes, lRes, aRes]) => {
      if (pRes.status  === 'fulfilled') setPatient(pRes.value.data)
      if (plRes.status === 'fulfilled') {
        const p = plRes.value.data[0] || null
        setPlan(p)
        setMeals(p?.meals   || [])
      }
      if (lRes.status  === 'fulfilled') setLogs(lRes.value.data)
      if (aRes.status  === 'fulfilled') setAppointments(aRes.value.data)
    }).finally(() => setIsLoading(false))
  }, [])

  // ── Derived values ────────────────────────────────────
  const todayLog = logs[0] &&
    new Date(logs[0].date).toDateString() === new Date().toDateString()
    ? logs[0] : null

  const upcomingAppt = appointments
    .filter(a => a.status === 'scheduled' && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]

  // Weight
  const currentWeight  = logs[0]?.weight || patient?.weight || 0
  const lastWeight     = logs[1]?.weight || currentWeight
  const targetWeight   = Math.max(0, currentWeight - 5)
  const startWeight    = patient?.weight || currentWeight
  const weightDiff     = parseFloat((currentWeight - lastWeight).toFixed(1))
  const weightPct      = startWeight > targetWeight
    ? Math.min(100, Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100))
    : 0

  // Calories
  const consumed   = todayLog?.calories || 0
  const calorieGoal = plan?.caloriesTarget || 2000

  // Rituals removed

  // ── Handlers ──────────────────────────────────────────
  const handleCheckUpSubmit = async (data: CheckUpData) => {
    try {
      await dailyLogService.addLog({
        water:    data.waterIntake,
        sleep:    data.sleepHours,
        mood:     data.feeling,
        exercise: data.exercised,
        notes:    data.notes,
        calories: 0,
        weight:   0,
      })
      const res = await dailyLogService.getMyLogs()
      setLogs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const toggleMeal = async (mealId: string, current: boolean) => {
    if (!plan) return
    try {
      await planService.updateMealStatus(plan._id, mealId, !current)
      setMeals(prev => prev.map(m => m._id === mealId ? { ...m, completed: !current } : m))
    } catch (err) { console.error(err) }
  }


  // ── Loading ───────────────────────────────────────────
  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
    </div>
  )

  // ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* ── Greeting ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#065F46]">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Your body is a sanctuary. Today's the perfect day for progress.
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">{today}</div>
          {todayLog ? (
            <div className="text-xs text-emerald-600 font-semibold mt-0.5">✓ Check-up logged</div>
          ) : (
            <button
              onClick={() => setCheckUpOpen(true)}
              className="mt-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-full transition-colors"
            >
              + Today's Check-up
            </button>
          )}
        </div>
      </div>

      {/* ── Appointment Banner ── */}
      {upcomingAppt ? (
        <div
          onClick={() => navigate('/patient/book-appointment')}
          className="bg-[#065F46] text-white rounded-2xl p-4 mb-5 flex items-center gap-4 cursor-pointer hover:bg-[#054d38] transition-colors"
        >
          <div className="bg-white/20 p-3 rounded-xl shrink-0">
            <Calendar size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs opacity-70">Next Appointment</p>
            <p className="font-bold truncate">
              {new Date(upcomingAppt.date).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric',
              })}
              {' · '}{upcomingAppt.time}
            </p>
            {upcomingAppt.doctor && (
              <p className="text-xs opacity-60 mt-0.5">Dr. {upcomingAppt.doctor.name}</p>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full capitalize shrink-0">
            <Clock size={12} /> {upcomingAppt.type}
          </div>
        </div>
      ) : (
        <div
          onClick={() => navigate('/patient/book-appointment')}
          className="bg-white border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl p-4 mb-5 flex items-center gap-3 cursor-pointer hover:border-emerald-300 hover:text-emerald-600 transition-colors"
        >
          <Calendar size={18} className="shrink-0" />
          <span className="text-sm">No upcoming appointments · Book one now →</span>
        </div>
      )}

      {/* ── Row 1: Weight + Nutrition ── */}
      <div className="grid grid-cols-1 gap-4 mb-4">

        {/* Daily Nutrition */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 mb-4">Daily Nutrition</h3>
          <div className="flex justify-center mb-4">
            <CircleProgress
              value={consumed} max={calorieGoal} size={140} stroke={11}
              label={consumed.toLocaleString()}
              sub={`/ ${calorieGoal.toLocaleString()} kcal`}
            />
          </div>
          <div className="flex gap-4 mb-4">
            <MacroBar label="Protein" current={plan?.protein || 0} target={120} color="bg-blue-400"   />
            <MacroBar label="Carbs"   current={plan?.carbs   || 0} target={250} color="bg-orange-400" />
            <MacroBar label="Fats"    current={plan?.fats    || 0} target={70}  color="bg-yellow-400" />
          </div>
          <button
            onClick={() => navigate('/patient/meal-plan')}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ClipboardList className="w-4 h-4" /> View Full Meal Plan
          </button>
        </div>
      </div>

      {/* ── Row 2: Today's Nourishment full width ── */}
      <div className="grid grid-cols-1 gap-4">

        {/* Today's Nourishment */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-800">Today's Nourishment</h3>
            <button
              onClick={() => navigate('/patient/meal-plan')}
              className="text-[#065F46] text-xs font-semibold hover:underline flex items-center gap-1"
            >
              Full Plan <ChevronRight size={12} />
            </button>
          </div>

          {meals.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-300">
              <Utensils size={32} className="mb-2" />
              <p className="text-sm">No meal plan assigned yet</p>
              <p className="text-xs mt-1">Your doctor will add one soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {meals.slice(0, 4).map(meal => (
                <div key={meal._id}
                  className={`border rounded-2xl overflow-hidden transition-all ${
                    meal.completed ? 'border-green-200 bg-green-50/30' : 'border-gray-100'
                  }`}>
                  <div className="h-24 bg-gray-100 relative flex items-center justify-center">
                    <Utensils className="w-7 h-7 text-gray-300" />
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      MEAL_COLOR[meal.type] || 'text-gray-600 bg-gray-50'
                    }`}>
                      {meal.type}
                    </span>
                    {meal.completed && (
                      <div className="absolute inset-0 bg-green-600/10 flex items-center justify-center">
                        <div className="bg-green-600 rounded-full p-1.5">
                          <Check size={14} className="text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-semibold text-gray-800 truncate">{meal.name}</div>
                      <div className="text-xs text-gray-400 shrink-0 ml-1">{meal.calories} kcal</div>
                    </div>
                    {meal.completed ? (
                      <div className="flex items-center justify-center gap-1 bg-green-50 text-green-600 text-xs font-semibold py-1.5 rounded-lg border border-green-200">
                        ✓ Logged
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleMeal(meal._id, meal.completed)}
                          className="flex-1 bg-[#065F46] text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-[#054d38] transition-colors"
                        >
                          Mark Done
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">
                          <RefreshCw className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Check-up Modal ── */}
      <CheckUpModal
        open={checkUpOpen}
        onOpenChange={setCheckUpOpen}
        onSubmit={handleCheckUpSubmit}
      />
    </div>
  )
}