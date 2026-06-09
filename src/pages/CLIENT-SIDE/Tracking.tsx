import { useState, useEffect, useMemo } from "react"
import { dailyLogService, patientService, planService } from "@/services/api"
import {
  Scale, Target, Flame, Droplets, Moon,
  Dumbbell, TrendingDown, TrendingUp, Minus,
  ClipboardCheck, Plus, Check, Loader2, Trophy,
  Activity, Zap, X
} from "lucide-react"
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts"

type Range = "week" | "month" | "3m"
type Tab   = "overview" | "weight" | "nutrition" | "sleep" | "goals"

const MOODS = [
  { value: "great", emoji: "😄", label: "Great" },
  { value: "good",  emoji: "🙂", label: "Good"  },
  { value: "ok",    emoji: "😐", label: "OK"    },
  { value: "bad",   emoji: "😔", label: "Bad"   },
]

function WeightTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-zinc-500 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value?.toFixed(1)} kg
        </p>
      ))}
    </div>
  )
}

function Ring({ pct, size = 80, stroke = 8, color = "#16a34a", children }: any) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - Math.min(pct,100)/100)}
          strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

export default function Tracking() {
  const [tab,       setTab]       = useState<Tab>("overview")
  const [range,     setRange]     = useState<Range>("week")
  const [logs,      setLogs]      = useState<any[]>([])
  const [patient,   setPatient]   = useState<any>(null)
  const [plan,      setPlan]      = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [form, setForm] = useState({
    water: 0, sleep: 0, mood: "good",
    exercise: false, weight: 0, calories: 0, notes: ""
  })

  const fetchData = async () => {
    try {
      const [logsRes, profileRes, plansRes] = await Promise.all([
        dailyLogService.getMyLogs(),
        patientService.getMyProfile(),
        planService.getMyPlans(),
      ])
      const logsData    = logsRes.data    || []
      const patientData = profileRes.data
      const plans       = plansRes.data   || []
      const activePlan  = plans.find((p: any) => p.status === "active") || plans[0]

      setLogs(logsData)
      setPatient(patientData)
      setPlan(activePlan)
      setForm(prev => ({
        ...prev,
        weight:   patientData?.weight   || 0,
        calories: activePlan?.caloriesTarget || 0,
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await dailyLogService.addLog(form)
      setSuccess(true)
      setShowForm(false)
      fetchData()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  // ── Derived Data ──────────────────────────────────────
  const todayLog = logs[0] &&
    new Date(logs[0].date).toDateString() === new Date().toDateString() ? logs[0] : null

  const filteredLogs = useMemo(() => {
    const now = new Date()
    const filterDate = new Date(now)
    if (range === "week")  filterDate.setDate(now.getDate() - 7)
    if (range === "month") filterDate.setDate(now.getDate() - 30)
    if (range === "3m")    filterDate.setDate(now.getDate() - 90)
    return [...logs].filter(l => new Date(l.date) >= filterDate).reverse()
  }, [logs, range])

  const dateLabel = (dateStr: string) => {
    const d = new Date(dateStr)
    if (range === "week")  return d.toLocaleDateString("en-US", { weekday: "short" })
    if (range === "month") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    return d.toLocaleDateString("en-US", { month: "short" })
  }

  // للـ 3m نعمل group بالشهر — نظهر نقطة واحدة لكل شهر
  const groupByMonth = (data: any[]) => {
    const map: Record<string, any[]> = {}
    data.forEach(d => {
      const key = new Date(d.date || d.label).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      if (!map[key]) map[key] = []
      map[key].push(d)
    })
    return Object.entries(map).map(([month, items]) => ({
      label:  month.split(" ")[0], // "Jun" بس
      actual: +(items.reduce((s, i) => s + (i.weight || 0), 0) / items.filter(i => i.weight > 0).length || 0).toFixed(1),
      target: items[0]?.target,
      sleep:  +(items.reduce((s, i) => s + (i.sleep || 0), 0) / items.filter(i => i.sleep > 0).length || 0).toFixed(1),
    }))
  }

  // Weight
  const weightLogs    = filteredLogs.filter(l => l.weight > 0)
  const targetWeight  = patient?.targetWeight || 0
  const latestWeight  = weightLogs[weightLogs.length - 1]?.weight || patient?.weight || 0
  const startWeight   = weightLogs[0]?.weight || patient?.weight || 0
  const weightDiff    = latestWeight && startWeight ? +(latestWeight - startWeight).toFixed(1) : 0
  const distToTarget  = targetWeight && latestWeight ? +(latestWeight - targetWeight).toFixed(1) : 0
  const goalPct       = targetWeight && startWeight && startWeight !== targetWeight
    ? Math.min(100, Math.max(0, Math.round(
        (1 - Math.abs(latestWeight - targetWeight) / Math.abs(startWeight - targetWeight)) * 100
      )))
    : latestWeight === targetWeight ? 100 : 0

  const weightChartData = range === "3m"
    ? groupByMonth(weightLogs.map(l => ({ date: l.date, label: dateLabel(l.date), actual: l.weight, target: targetWeight || undefined })))
    : weightLogs.map(l => ({ label: dateLabel(l.date), actual: l.weight, target: targetWeight || undefined }))

  // Sleep
  const sleepLogs      = filteredLogs.filter(l => l.sleep > 0)
  const avgSleep       = sleepLogs.length ? +(sleepLogs.reduce((s, l) => s + l.sleep, 0) / sleepLogs.length).toFixed(1) : 0
  const sleepChartData = range === "3m"
    ? groupByMonth(filteredLogs.map(l => ({ date: l.date, label: dateLabel(l.date), sleep: l.sleep || 0 })))
    : filteredLogs.map(l => ({ label: dateLabel(l.date), sleep: l.sleep || 0 }))

  // Water
  const waterLogs  = filteredLogs.filter(l => l.water > 0)
  const avgWater   = waterLogs.length ? +(waterLogs.reduce((s, l) => s + l.water, 0) / waterLogs.length).toFixed(1) : 0
  const waterGoal  = 8
  const todayWater = todayLog?.water || 0
  const waterPct   = Math.min(100, Math.round((todayWater / waterGoal) * 100))

  // Calories from plan
  const planCal    = plan?.caloriesTarget || 0
  const planPro    = plan?.protein || 0
  const planCarb   = plan?.carbs   || 0
  const planFat    = plan?.fats    || 0

  // Exercise streak
  const exerciseDays = filteredLogs.filter(l => l.exercise).length
  const streak = (() => {
    let s = 0
    for (const l of [...logs].reverse()) {
      if (l.exercise) s++
      else break
    }
    return s
  })()

  // Goals / achievements
  const goals = patient?.goals || []

  const bmi      = patient?.bmi || 0
  const bmiLabel = bmi < 18.5 ? { label: "Underweight", color: "#3b82f6" }
    : bmi < 25 ? { label: "Normal",      color: "#16a34a" }
    : bmi < 30 ? { label: "Overweight",  color: "#ca8a04" }
    :            { label: "Obese",        color: "#ef4444" }

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview",   label: "Overview"   },
    { key: "weight",     label: "Weight"     },
    { key: "nutrition",  label: "Nutrition"  },
    { key: "sleep",      label: "Sleep"      },
    { key: "goals",      label: "Goals"      },
  ]

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-emerald-600" size={32}/>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Patient</p>
            <h1 className="text-xl font-bold text-gray-900">{patient?.name || "—"}
              <span className="ml-2 text-xs font-normal text-gray-400">{patient?.patientId}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {success && (
              <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                <Check size={12}/> Saved!
              </span>
            )}
            <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full">Active</span>
            {!todayLog && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-emerald-800">
                <Plus size={14}/> Log Today
              </button>
            )}
            {todayLog && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl text-sm font-semibold">
                <ClipboardCheck size={14}/> Today ✓
              </button>
            )}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { icon: <Scale size={16}/>,    label: "Current Weight", value: latestWeight ? `${latestWeight} kg`  : "—",   color: "text-gray-600 bg-gray-50"    },
            { icon: <Target size={16}/>,   label: "Goal Weight",    value: targetWeight ? `${targetWeight} kg`  : "—",   color: "text-emerald-700 bg-emerald-50" },
            { icon: <Activity size={16}/>, label: "BMI",            value: bmi ? `${bmi}` : "—",                         color: `bg-opacity-10 bg-gray-50`, extra: bmiLabel.label },
            { icon: <Flame size={16}/>,    label: "Calories Target",value: planCal ? `${planCal} kcal`          : "—",   color: "text-orange-600 bg-orange-50" },
            { icon: <Droplets size={16}/>, label: "Water Intake",   value: todayWater ? `${todayWater} L`       : "—",   color: "text-blue-600 bg-blue-50"    },
            { icon: <Dumbbell size={16}/>, label: "Streak",         value: `${streak} days`,                              color: "text-purple-600 bg-purple-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm text-center">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5 ${s.color}`}>{s.icon}</div>
              <p className="text-[9px] text-gray-400 uppercase font-semibold leading-tight mb-0.5">{s.label}</p>
              <p className="text-sm font-bold text-gray-800">{s.value}</p>
              {s.extra && <p className="text-[9px] font-semibold mt-0.5" style={{ color: bmiLabel.color }}>{s.extra}</p>}
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm w-fit">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                tab === t.key ? "bg-emerald-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Range Toggle (for weight/sleep) ── */}
        {(tab === "weight" || tab === "sleep") && (
          <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm w-fit">
            {(["week","month","3m"] as Range[]).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  range === r ? "bg-emerald-600 text-white" : "text-gray-500 hover:text-gray-700"
                }`}>
                {r === "3m" ? "3M" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* ══════════════ OVERVIEW ══════════════ */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Weight mini */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-gray-800">Weight Progress</h2>
                {weightDiff !== 0 && (
                  <span className={`text-xs font-semibold flex items-center gap-1 ${weightDiff < 0 ? "text-emerald-600" : "text-orange-500"}`}>
                    {weightDiff < 0 ? <TrendingDown size={13}/> : <TrendingUp size={13}/>}
                    {weightDiff > 0 ? "+" : ""}{weightDiff} kg
                  </span>
                )}
              </div>
              {weightChartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={weightChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false}/>
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} interval={range === "week" ? 0 : range === "month" ? 4 : 0}/>
                    <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} domain={["auto","auto"]}/>
                    <Tooltip content={<WeightTooltip/>}/>
                    <Line type="monotone" dataKey="actual" name="Actual" stroke="#16a34a" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
                    {targetWeight > 0 && <Line type="monotone" dataKey="target" name="Target" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="4 3" dot={false}/>}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-36 flex items-center justify-center text-gray-300 text-xs">Log weight daily to see progress</div>
              )}
            </div>

            {/* Goal Ring */}
            <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center gap-3">
              <h2 className="text-sm font-bold text-gray-800 self-start">Weight Goal</h2>
              <Ring pct={goalPct} size={100} stroke={10} color="#16a34a">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-800">{goalPct}%</p>
                  <p className="text-[9px] text-gray-400">complete</p>
                </div>
              </Ring>
              {targetWeight > 0 && latestWeight > 0 ? (
                <p className="text-xs text-gray-500 text-center">
                  {distToTarget === 0 ? "🎉 Goal reached!" :
                   distToTarget > 0 ? `${distToTarget} kg away from target of ${targetWeight} kg` :
                   `${Math.abs(distToTarget)} kg to gain to reach ${targetWeight} kg`}
                </p>
              ) : (
                <p className="text-xs text-gray-400 text-center">No target weight set</p>
              )}
            </div>

            {/* Water & Nutrition */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-3">Water & Nutrition</h2>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Droplets size={13} className="text-blue-500"/>
                  <span className="text-xs text-gray-600">Water</span>
                </div>
                <span className="text-xs font-bold text-gray-700">{todayWater} / {waterGoal} gl</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${waterPct}%` }}/>
              </div>
              {planCal > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {[
                    { label: "Protein", value: planPro, total: planPro, color: "#16a34a" },
                    { label: "Carbs",   value: planCarb, total: planCarb, color: "#ca8a04" },
                    { label: "Fat",     value: planFat,  total: planFat,  color: "#7c3aed" },
                  ].map(n => (
                    <div key={n.label} className="flex flex-col items-center gap-1">
                      <Ring pct={100} size={56} stroke={5} color={n.color}>
                        <span className="text-[9px] font-bold text-gray-700">{n.value}g</span>
                      </Ring>
                      <span className="text-[10px] text-gray-500">{n.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between mt-3 text-[10px] text-gray-400 border-t pt-2">
                <span>Target: <span className="font-bold text-gray-600">{planCal} kcal</span></span>
              </div>
            </div>

            {/* Sleep */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold text-gray-800">Sleep Tracking</h2>
                {avgSleep > 0 && <span className="text-xs font-bold text-purple-600">{avgSleep} hrs avg</span>}
              </div>
              {sleepChartData.some(d => d.sleep > 0) ? (
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={sleepChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false}/>
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} interval={range === "week" ? 0 : range === "month" ? 4 : 0}/>
                    <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} axisLine={false} tickLine={false} domain={[0, 12]}/>
                    <Tooltip formatter={(v: any) => [`${v}h`, "Sleep"]}/>
                    <Bar dataKey="sleep" radius={[4,4,0,0]}>
                      {sleepChartData.map((_, i) => (
                        <Cell key={i} fill={_ .sleep >= 7 ? "#a78bfa" : "#ddd6fe"}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-36 flex items-center justify-center text-gray-300 text-xs">No sleep data yet</div>
              )}
            </div>

            {/* Goals & Achievements */}
            <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Goals & Achievements</h2>
              {goals.length > 0 || exerciseDays > 0 || streak > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {goals.slice(0, 2).map((g: string, i: number) => (
                    <div key={i} className="bg-emerald-50 rounded-xl p-3">
                      <Trophy size={16} className="text-emerald-600 mb-2"/>
                      <p className="text-xs font-bold text-gray-800">{g}</p>
                      <div className="mt-2 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${goalPct}%` }}/>
                      </div>
                    </div>
                  ))}
                  {exerciseDays > 0 && (
                    <div className="bg-blue-50 rounded-xl p-3">
                      <Dumbbell size={16} className="text-blue-600 mb-2"/>
                      <p className="text-xs font-bold text-gray-800">{exerciseDays} Workouts</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">This period</p>
                      <div className="mt-2 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(100, exerciseDays * 10)}%` }}/>
                      </div>
                    </div>
                  )}
                  {streak > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-3">
                      <Zap size={16} className="text-yellow-500 mb-2"/>
                      <p className="text-xs font-bold text-gray-800">{streak}-Day Streak</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Logging every day</p>
                      <div className="flex gap-0.5 mt-2">
                        {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-sm bg-yellow-400"/>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">Start logging to see your achievements!</p>
              )}
            </div>
          </div>
        )}

        {/* ══════════════ WEIGHT TAB ══════════════ */}
        {tab === "weight" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Current",  value: `${latestWeight} kg`, color: "text-gray-800"    },
                { label: "Target",   value: targetWeight ? `${targetWeight} kg` : "—", color: "text-emerald-700" },
                { label: "Change",   value: `${weightDiff > 0 ? "+" : ""}${weightDiff} kg`,
                  color: weightDiff < 0 ? "text-emerald-600" : weightDiff > 0 ? "text-orange-500" : "text-gray-400" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Weight Progress</h2>
              {weightChartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weightChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false}/>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} interval={range === "week" ? 0 : range === "month" ? 4 : 0}/>
                    <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false}
                      tickFormatter={v => `${v}kg`} domain={["auto","auto"]}/>
                    <Tooltip content={<WeightTooltip/>}/>
                    <Line type="monotone" dataKey="actual" name="Actual" stroke="#16a34a" strokeWidth={2.5}
                      dot={{ r: 3, fill: "#16a34a", strokeWidth: 0 }} activeDot={{ r: 5 }}/>
                    {targetWeight > 0 && (
                      <Line type="monotone" dataKey="target" name="Target" stroke="#60a5fa"
                        strokeWidth={1.5} strokeDasharray="5 4" dot={false}/>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-300 text-sm">Log weight daily to see chart</div>
              )}
            </div>

            {targetWeight > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-6">
                <Ring pct={goalPct} size={90} stroke={9} color="#16a34a">
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-800">{goalPct}%</p>
                  </div>
                </Ring>
                <div>
                  <h2 className="text-sm font-bold text-gray-800 mb-1">Weight Goal</h2>
                  <p className="text-xs text-gray-500">
                    {distToTarget === 0 ? "🎉 Goal reached!" :
                     distToTarget > 0 ? `${distToTarget} kg to lose` :
                     `${Math.abs(distToTarget)} kg to gain`}
                  </p>
                  <div className="mt-2 w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${goalPct}%` }}/>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ NUTRITION TAB ══════════════ */}
        {tab === "nutrition" && (
          <div className="flex flex-col gap-4">
            {planCal > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Calories",  value: `${planCal}`,  unit: "kcal", color: "#f97316", pct: 100 },
                    { label: "Protein",   value: `${planPro}`,  unit: "g",    color: "#16a34a", pct: 100 },
                    { label: "Carbs",     value: `${planCarb}`, unit: "g",    color: "#ca8a04", pct: 100 },
                    { label: "Fat",       value: `${planFat}`,  unit: "g",    color: "#7c3aed", pct: 100 },
                  ].map((n, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2">
                      <Ring pct={n.pct} size={72} stroke={7} color={n.color}>
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-800">{n.value}</p>
                          <p className="text-[8px] text-gray-400">{n.unit}</p>
                        </div>
                      </Ring>
                      <p className="text-xs font-semibold text-gray-600">{n.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h2 className="text-sm font-bold text-gray-800 mb-3">Water Intake Today</h2>
                  <div className="flex items-center gap-4">
                    <Ring pct={waterPct} size={80} stroke={8} color="#3b82f6">
                      <div className="text-center">
                        <p className="text-sm font-bold text-blue-600">{todayWater}</p>
                        <p className="text-[8px] text-gray-400">/ {waterGoal}</p>
                      </div>
                    </Ring>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{todayWater} glasses</p>
                      <p className="text-xs text-gray-400">Goal: {waterGoal} glasses ({waterGoal * 0.25}L)</p>
                      <p className="text-xs text-gray-400 mt-1">7-day avg: {avgWater} gl/day</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-10 shadow-sm text-center text-gray-300">
                <Flame size={32} className="mx-auto mb-2"/>
                <p className="text-sm">No active diet plan found</p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ SLEEP TAB ══════════════ */}
        {tab === "sleep" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Avg Sleep",  value: `${avgSleep}h`,    color: "text-purple-700" },
                { label: "Last Night", value: todayLog?.sleep ? `${todayLog.sleep}h` : "—", color: "text-gray-800" },
                { label: "Nights Logged", value: `${sleepLogs.length}`, color: "text-gray-800" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">{s.label}</p>
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Sleep History</h2>
              {sleepChartData.some(d => d.sleep > 0) ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={sleepChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false}/>
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} interval={range === "week" ? 0 : range === "month" ? 4 : 0}/>
                    <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} axisLine={false} tickLine={false} domain={[0, 12]}
                      tickFormatter={v => `${v}h`}/>
                    <Tooltip formatter={(v: any) => [`${v}h`, "Sleep"]}/>
                    <Bar dataKey="sleep" radius={[6,6,0,0]}>
                      {sleepChartData.map((d, i) => (
                        <Cell key={i} fill={d.sleep >= 7 ? "#a78bfa" : "#ddd6fe"}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-gray-300 text-sm">No sleep data yet</div>
              )}
              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-400 inline-block"/>≥ 7h (Good)</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-200 inline-block"/>{"< 7h"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ GOALS TAB ══════════════ */}
        {tab === "goals" && (
          <div className="flex flex-col gap-4">
            {goals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {goals.map((g: string, i: number) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <Trophy size={16} className="text-emerald-600"/>
                      </div>
                      <p className="text-sm font-bold text-gray-800">{g}</p>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${goalPct}%` }}/>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1.5">{goalPct}% complete</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-10 shadow-sm text-center text-gray-300">
                <Target size={32} className="mx-auto mb-2"/>
                <p className="text-sm">No goals set yet</p>
                <p className="text-xs mt-1">Doctor can set goals from the Body tab</p>
              </div>
            )}

            {/* Exercise Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Exercise Summary</h2>
              <div className="flex items-center gap-6">
                <Ring pct={Math.min(100, exerciseDays * 10)} size={80} stroke={8} color="#16a34a">
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-800">{exerciseDays}</p>
                    <p className="text-[8px] text-gray-400">days</p>
                  </div>
                </Ring>
                <div>
                  <p className="text-sm font-bold text-gray-800">{exerciseDays} workout days</p>
                  <p className="text-xs text-gray-400 mt-0.5">in the selected period</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">{streak > 0 ? `🔥 ${streak}-day streak!` : "Start your streak today!"}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Log Modal ── */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <ClipboardCheck size={20} className="text-emerald-700"/>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">Daily Check-up</h3>
                    <p className="text-xs text-gray-400">
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Auto-filled info */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Scale size={12} className="text-gray-400"/>
                      <span>Weight: <span className="font-bold text-gray-700">{form.weight > 0 ? `${form.weight} kg` : "—"}</span></span>
                    </div>
                    <span className="text-gray-300">·</span>
                    <div className="flex items-center gap-1.5">
                      <Flame size={12} className="text-orange-400"/>
                      <span>Target Cal: <span className="font-bold text-gray-700">{form.calories > 0 ? `${form.calories} kcal` : "—"}</span></span>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-full">auto</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Water (glasses)", key: "water" },
                    { label: "Sleep (hours)",   key: "sleep" },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">{label}</label>
                      <input type="number" value={(form as any)[key]}
                        onChange={e => setForm({ ...form, [key]: parseFloat(e.target.value) || 0 })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"/>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-2">How are you feeling?</label>
                  <div className="grid grid-cols-4 gap-2">
                    {MOODS.map(m => (
                      <button key={m.value} onClick={() => setForm({ ...form, mood: m.value })}
                        className={`flex flex-col items-center py-2 rounded-xl border text-xs font-semibold transition-all ${
                          form.mood === m.value ? "bg-emerald-700 text-white border-emerald-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}>
                        <span className="text-lg mb-0.5">{m.emoji}</span>{m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setForm({ ...form, exercise: !form.exercise })}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    form.exercise ? "bg-green-50 border-green-300 text-green-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}>
                  <Dumbbell size={16}/>
                  <span className="text-sm font-semibold">{form.exercise ? "✓ Exercised today" : "Did you exercise today?"}</span>
                </button>

                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Notes (Optional)</label>
                  <input type="text" placeholder="How did you feel today?" value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500"/>
                </div>

                <div className="flex gap-3 mt-1">
                  <button onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleSubmit} disabled={saving}
                    className="flex-1 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-semibold hover:bg-emerald-800 disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <><Loader2 size={14} className="animate-spin"/>Saving...</> : "Save Check-up"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}