import { useEffect, useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js"
import { Line } from "react-chartjs-2"
import { dailyLogService } from "@/services/api"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

interface Props {
  patientId:     string
  patientWeight?: number  // الوزن الأساسي من الـ profile
}

// جمّع الـ logs في أسابيع — كل أسبوع ياخد آخر وزن مسجّل فيه
function groupByWeek(logs: any[]): { label: string; weight: number | null; week: number }[] {
  if (logs.length === 0) return []

  // رتّب من الأقدم للأحدث
  const sorted = [...logs].sort((a, b) =>
    new Date(a.date || a.createdAt).getTime() - new Date(b.date || b.createdAt).getTime()
  )

  const weeks: { label: string; weight: number | null; week: number }[] = []
  const seen = new Map<number, any>()

  sorted.forEach(log => {
    const d   = new Date(log.date || log.createdAt)
    // رقم الأسبوع من بداية السنة
    const jan1 = new Date(d.getFullYear(), 0, 1)
    const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
    // خد آخر log في الأسبوع ده
    seen.set(weekNum, log)
  })

  // خد آخر 8 أسابيع بس
  const weekEntries = Array.from(seen.entries())
    .sort((a, b) => a[0] - b[0])
    .slice(-8)

  weekEntries.forEach(([weekNum, log]) => {
    const d = new Date(log.date || log.createdAt)
    weeks.push({
      week: weekNum,
      label: `W${weekNum}\n${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
      weight: log.weight && log.weight > 0 ? log.weight : null,
    })
  })

  return weeks
}

export default function WeightChart({ patientId, patientWeight = 0 }: Props) {
  const [logs,      setLogs]      = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    dailyLogService.getPatientLogs(patientId)
      .then(res => setLogs(res.data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [patientId])

  const weeks = groupByWeek(logs)

  // فلتر الأسابيع اللي عندها وزن بس
  const weeksWithWeight = weeks.filter(w => w.weight !== null)

  // حساب التغيير في الوزن
  const firstW = weeksWithWeight.length > 0 ? weeksWithWeight[0].weight! : patientWeight
  const lastW  = weeksWithWeight.length > 0 ? weeksWithWeight[weeksWithWeight.length - 1].weight! : patientWeight
  const diff   = weeksWithWeight.length >= 2 ? +(lastW - firstW).toFixed(1) : 0

  const labels  = weeksWithWeight.map(w => w.label)
  const weights = weeksWithWeight.map(w => w.weight)

  const data = {
    labels: labels.length > 0 ? labels : ["W1","W2","W3","W4","W5","W6","W7","W8"],
    datasets: [
      {
        label: "Weight (kg)",
        data: weights.length > 0 ? weights : [0,0,0,0,0,0,0,0],
        borderColor:     "#065F46",
        backgroundColor: "rgba(6, 95, 70, 0.08)",
        pointBackgroundColor: "#065F46",
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.35,
        fill: true,
        borderWidth: 2.5,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.raw} kg`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { callback: (v: any) => `${v} kg`, font: { size: 11 } },
        grid: { color: "#f3f4f6" },
      },
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    },
  }

  const TrendIcon = diff < 0 ? TrendingDown : diff > 0 ? TrendingUp : Minus
  const trendColor = diff < 0 ? "text-green-600" : diff > 0 ? "text-orange-500" : "text-gray-400"

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm w-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm md:text-base">Weight Trend</h3>
          <p className="text-xs text-gray-400 mt-0.5">Weekly progress — last recorded weight per week</p>
        </div>
        {weeksWithWeight.length >= 2 && (
          <div className={`flex items-center gap-1 text-sm font-bold ${trendColor}`}>
            <TrendIcon size={16}/>
            {diff > 0 ? "+" : ""}{diff} kg
          </div>
        )}
        {isLoading && <span className="text-xs text-gray-400">Loading...</span>}
      </div>

      <div className="h-48 md:h-64">
        <Line data={data} options={options as any} />
      </div>

      {!isLoading && weeksWithWeight.length === 0 && (
        <p className="text-xs text-gray-400 text-center mt-2">
          No weight data recorded yet — add weight in Check-up tab
        </p>
      )}

      {/* current weight summary */}
      {weeksWithWeight.length > 0 && (
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-400">Start</p>
            <p className="text-sm font-bold text-gray-700">{firstW} kg</p>
          </div>
          <div className="flex-1 h-px bg-gray-100"/>
          <div className="text-center">
            <p className="text-xs text-gray-400">Current</p>
            <p className={`text-sm font-bold ${trendColor}`}>{lastW} kg</p>
          </div>
        </div>
      )}
    </div>
  )
}