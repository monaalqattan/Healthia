import { useEffect, useState } from "react"
import { Utensils, Activity, ClipboardList } from "lucide-react"
import { dailyLogService } from "@/services/api"

export default function ActivityLog({ patientId }: { patientId: string }) {
  const [logs, setLogs]         = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    dailyLogService.getPatientLogs(patientId)
      .then(res => setLogs(res.data.slice(0, 5)))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [patientId])

  if (isLoading) return (
    <div className="bg-white rounded-2xl w-full p-6 shadow-sm text-center text-gray-400 text-sm">
      Loading activity...
    </div>
  )

  if (logs.length === 0) return (
    <div className="bg-white rounded-2xl w-full p-6 shadow-sm text-center text-gray-400 text-sm">
      No activity logged yet.
    </div>
  )

  return (
    <div className="bg-white rounded-2xl w-full p-4 md:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base">Activity Log</h3>
      </div>
      <div className="flex flex-col gap-4">
        {logs.map((log: any, i: number) => (
          <div key={i} className="flex items-start gap-3 md:gap-4">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs md:text-sm font-medium text-gray-800 leading-tight">
                  Daily Health Log
                </p>
                <span className="text-[10px] md:text-xs text-gray-400 shrink-0">
                  {new Date(log.date || log.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                💧 {log.water} glasses · 😴 {log.sleep}h sleep · 🔥 {log.calories} kcal
                {log.exercise && " · 🏃 Exercised"}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                  log.mood === "great" ? "bg-green-50 text-green-600" :
                  log.mood === "good"  ? "bg-blue-50 text-blue-600"   :
                  log.mood === "ok"    ? "bg-yellow-50 text-yellow-600":
                                         "bg-red-50 text-red-500"
                }`}>
                  Mood: {log.mood}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}