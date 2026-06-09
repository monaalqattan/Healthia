import { useState, useEffect, useRef } from "react"
import { dailyLogService } from "@/services/api"
import { Droplets, Moon, Dumbbell, CalendarDays, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react"

const MOODS = [
  { value: "great", label: "Great 😄", color: "bg-green-100 text-green-700 border-green-300" },
  { value: "good",  label: "Good 🙂",  color: "bg-blue-100 text-blue-700 border-blue-300"   },
  { value: "ok",    label: "OK 😐",    color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "bad",   label: "Bad 😔",   color: "bg-red-100 text-red-500 border-red-300"      },
] as const

type Period = "daily" | "weekly" | "monthly"

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function avg(arr: number[]) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0
}

function moodScore(m: string) {
  return m === "great" ? 4 : m === "good" ? 3 : m === "ok" ? 2 : 1
}

function moodLabel(score: number) {
  return score >= 3.5 ? "Great 😄" : score >= 2.5 ? "Good 🙂" : score >= 1.5 ? "OK 😐" : "Bad 😔"
}

// ── Weekly Summary ────────────────────────────────────────────
function WeeklySummary({ logs }: { logs: any[] }) {
  const today = new Date(); today.setHours(23,59,59,999)
  const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - 6); weekStart.setHours(0,0,0,0)

  const weekLogs = logs.filter(l => {
    const d = new Date(l.date || l.createdAt)
    return d >= weekStart && d <= today
  })

  const uniqueDays = new Set(weekLogs.map(l => localDateStr(new Date(l.date || l.createdAt)))).size
  const compliance = Math.round((uniqueDays / 7) * 100)
  const avgWater   = avg(weekLogs.map(l => l.water || 0))
  const avgSleep   = avg(weekLogs.map(l => l.sleep || 0))
  const exerciseDays = weekLogs.filter(l => l.exercise).length
  const avgMood    = avg(weekLogs.map(l => moodScore(l.mood || "ok")))

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart); d.setDate(d.getDate() + i)
    const ds = localDateStr(d)
    const hasLog = weekLogs.some(l => localDateStr(new Date(l.date || l.createdAt)) === ds)
    return { label: d.toLocaleDateString("en-US", { weekday: "short" }), hasLog, isToday: localDateStr(d) === localDateStr(new Date()) }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h4 className="text-sm font-bold text-gray-800 mb-3">This Week — Check-in Streak</h4>
        <div className="flex gap-2 justify-between">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                d.hasLog    ? "bg-green-600 border-green-600 text-white"
                : d.isToday ? "border-green-400 text-green-500 bg-green-50"
                : "border-gray-100 text-gray-300 bg-gray-50"
              }`}>
                {d.hasLog ? "✓" : d.isToday ? "•" : "–"}
              </div>
              <span className={`text-[10px] font-medium ${d.isToday ? "text-green-600" : "text-gray-400"}`}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Weekly Compliance", value: `${compliance}%`, sub: `${uniqueDays}/7 days logged`, color: compliance >= 70 ? "text-green-600" : compliance >= 40 ? "text-orange-500" : "text-red-500", icon: <BarChart3 size={16}/> },
          { label: "Avg. Water",        value: `${avgWater} gl`, sub: "glasses per day",              color: "text-blue-500",   icon: <Droplets size={16}/> },
          { label: "Avg. Sleep",        value: `${avgSleep}h`,   sub: "hours per night",              color: "text-indigo-500", icon: <Moon size={16}/> },
          { label: "Exercise Days",     value: `${exerciseDays}`, sub: "out of 7 days",               color: "text-green-600",  icon: <Dumbbell size={16}/> },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-400">{s.icon}<span className="text-xs font-semibold text-gray-500">{s.label}</span></div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {weekLogs.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">No logs recorded this week yet.</p>
      )}
      {weekLogs.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Average Mood This Week</p>
          <p className="text-lg font-bold text-gray-800">{moodLabel(avgMood)}</p>
        </div>
      )}
    </div>
  )
}

// ── Monthly Summary ───────────────────────────────────────────
function MonthlySummary({ logs, patientWeight }: { logs: any[], patientWeight: number }) {
  const today = new Date(); today.setHours(23,59,59,999)
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

  const monthLogs = logs.filter(l => new Date(l.date || l.createdAt) >= monthStart)
  const daysPassed  = today.getDate()
  const uniqueDays  = new Set(monthLogs.map(l => localDateStr(new Date(l.date || l.createdAt)))).size
  const compliance  = Math.round((uniqueDays / daysPassed) * 100)

  const weights = monthLogs.filter(l => l.weight && l.weight > 0).map(l => l.weight)
  const firstW  = weights.length > 0 ? weights[weights.length - 1] : patientWeight
  const lastW   = weights.length > 0 ? weights[0] : patientWeight
  const weightDiff = lastW && firstW ? +(lastW - firstW).toFixed(1) : 0

  const exerciseDays = new Set(
    monthLogs.filter(l => l.exercise).map(l => localDateStr(new Date(l.date || l.createdAt)))
  ).size

  const avgWater = avg(monthLogs.map(l => l.water || 0))
  const avgSleep = avg(monthLogs.map(l => l.sleep || 0))

  const weeks = [0,1,2,3].map(w => {
    const ws = new Date(monthStart); ws.setDate(1 + w * 7)
    const we = new Date(ws); we.setDate(we.getDate() + 6)
    const wLogs = monthLogs.filter(l => {
      const d = new Date(l.date || l.createdAt)
      return d >= ws && d <= we
    })
    const days = new Set(wLogs.map(l => localDateStr(new Date(l.date || l.createdAt)))).size
    return { label: `Week ${w+1}`, days, pct: Math.round((days / 7) * 100) }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-gray-800">{new Date().toLocaleDateString("en-US",{month:"long", year:"numeric"})}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{uniqueDays} check-in days out of {daysPassed} days passed</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${compliance >= 70 ? "text-green-600" : compliance >= 40 ? "text-orange-500" : "text-red-500"}`}>{compliance}%</p>
            <p className="text-[10px] text-gray-400">compliance</p>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${compliance >= 70 ? "bg-green-500" : compliance >= 40 ? "bg-orange-400" : "bg-red-400"}`}
            style={{ width: `${compliance}%` }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h4 className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Weekly Breakdown</h4>
        <div className="flex flex-col gap-2.5">
          {weeks.map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-14 shrink-0">{w.label}</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${w.pct >= 70 ? "bg-green-500" : w.pct >= 40 ? "bg-orange-400" : w.pct > 0 ? "bg-red-400" : "bg-gray-200"}`}
                  style={{ width: `${w.pct}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-600 w-8 text-right">{w.days}d</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Weight Change</p>
          <div className="flex items-center gap-1">
            {weightDiff < 0 ? <TrendingDown size={16} className="text-green-500"/> : weightDiff > 0 ? <TrendingUp size={16} className="text-orange-400"/> : <Minus size={16} className="text-gray-400"/>}
            <p className={`text-xl font-bold ${weightDiff < 0 ? "text-green-600" : weightDiff > 0 ? "text-orange-500" : "text-gray-400"}`}>
              {weightDiff > 0 ? "+" : ""}{weightDiff} kg
            </p>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">this month</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Exercise Days</p>
          <p className="text-xl font-bold text-green-600">{exerciseDays}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">out of {daysPassed} days</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Avg. Water / day</p>
          <p className="text-xl font-bold text-blue-500">{avgWater} gl</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Avg. Sleep / night</p>
          <p className="text-xl font-bold text-indigo-500">{avgSleep}h</p>
        </div>
      </div>

      {monthLogs.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">No logs recorded this month yet.</p>
      )}
    </div>
  )
}

// ── Daily Read-Only View ──────────────────────────────────────
function DailyReadOnly({ logs }: { logs: any[] }) {
  const todayStr = localDateStr(new Date())
  const todayLog = logs.find(l => localDateStr(new Date(l.date || l.createdAt)) === todayStr)

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-gray-800">Today's Check-up</h3>
          <span className="text-xs text-gray-400">
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
          </span>
        </div>

        {!todayLog ? (
          <div className="flex flex-col items-center py-10 gap-3 text-center">
            <span className="text-4xl">📋</span>
            <p className="text-sm font-semibold text-gray-600">No check-up recorded today</p>
            <p className="text-xs text-gray-400">The patient hasn't submitted today's check-up yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">

            {/* Water */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Droplets size={15} className="text-blue-500"/>
                <span className="text-sm font-semibold text-gray-700">Water Intake</span>
                <span className="ml-auto text-sm font-bold text-blue-600">{todayLog.water} glasses</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full transition-all"
                  style={{ width: `${Math.min((todayLog.water / 15) * 100, 100)}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-300 mt-1"><span>0</span><span>8 (goal)</span><span>15</span></div>
            </div>

            {/* Sleep */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Moon size={15} className="text-indigo-500"/>
                <span className="text-sm font-semibold text-gray-700">Sleep Hours</span>
                <span className="ml-auto text-sm font-bold text-indigo-600">{todayLog.sleep}h</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full transition-all"
                  style={{ width: `${Math.min((todayLog.sleep / 12) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Mood */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">😊</span>
                <span className="text-sm font-semibold text-gray-700">How is the patient feeling?</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOODS.map(m => (
                  <div key={m.value}
                    className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      todayLog.mood === m.value
                        ? m.color + " ring-2 ring-offset-1"
                        : "border-gray-100 text-gray-300 bg-gray-50"
                    }`}>
                    {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell size={15} className="text-green-600"/>
                <span className="text-sm font-semibold text-gray-700">Exercised today?</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative ${todayLog.exercise ? "bg-green-600" : "bg-gray-200"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${todayLog.exercise ? "left-6" : "left-0.5"}`}/>
              </div>
            </div>

            {/* Weight */}
            {todayLog.weight > 0 && (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚖️</span>
                  <span className="text-sm font-semibold text-gray-700">Today's Weight</span>
                </div>
                <span className="text-sm font-bold text-green-700">{todayLog.weight} kg</span>
              </div>
            )}

            {/* Notes */}
            {todayLog.notes && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Notes / Observations</p>
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 leading-relaxed">
                  {todayLog.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent logs */}
      {logs.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Recent Check-ups</h3>
          <div className="flex flex-col gap-2">
            {logs.slice(0, 5).map((log: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(log.date || log.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric"})}
                  </p>
                  <p className="text-xs text-gray-400">
                    💧{log.water}gl &nbsp;🌙{log.sleep}h &nbsp;{log.exercise ? "🏃" : "🛋️"}
                    {log.weight > 0 && ` &nbsp;⚖️${log.weight}kg`}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  log.mood === "great" ? "bg-green-100 text-green-700"
                  : log.mood === "good" ? "bg-blue-100 text-blue-700"
                  : log.mood === "ok" ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-500"
                }`}>{log.mood}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export default function CheckupTab({ patientId, patientWeight = 0 }: { patientId: string; patientWeight?: number }) {
  const [period, setPeriod]       = useState<Period>("daily")
  const [logs, setLogs]           = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dailyLogService.getPatientLogs(patientId)
      .then(res => setLogs(res.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [patientId])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const periodOptions: { key: Period; label: string }[] = [
    { key: "daily",   label: "Today"        },
    { key: "weekly",  label: "Last 7 days"  },
    { key: "monthly", label: "Last 30 days" },
  ]
  const selectedLabel = periodOptions.find(p => p.key === period)?.label || "Today"

  return (
    <div className="flex flex-col gap-4">
      {/* Period Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(v => !v)}
          className="flex items-center gap-2 bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-800 transition-all"
        >
          <CalendarDays size={14}/>
          {selectedLabel}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 min-w-[160px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-3 pt-1 pb-1.5">Period</p>
            {periodOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => { setPeriod(opt.key); setDropdownOpen(false) }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${
                  period === opt.key ? "text-green-700 font-semibold" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {period === opt.key && <span className="text-green-600">✓</span>}
                {period !== opt.key && <span className="w-3.5"/>}
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-400 text-sm animate-pulse">Loading...</div>
      ) : period === "daily" ? (
        <DailyReadOnly logs={logs} />
      ) : period === "weekly" ? (
        <WeeklySummary logs={logs}/>
      ) : (
        <MonthlySummary logs={logs} patientWeight={patientWeight}/>
      )}
    </div>
  )
}