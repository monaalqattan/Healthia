import { Utensils, Activity, ClipboardList } from "lucide-react"

interface ActivityItem {
  id: number
  type: "meal" | "exercise" | "log"
  title: string
  description: string
  tags?: string[]
  time: string
}

const activities: ActivityItem[] = [
  {
    id: 1, type: "meal",
    title: "Meal Log: Protein-Rich Dinner",
    description: "Grilled salmon, quinoa, and steamed broccoli. 580 kcal.",
    tags: ["PROTEIN HIGH", "VERIFIED LOG"],
    time: "2h ago",
  },
  {
    id: 2, type: "exercise",
    title: "Activity: 45min Swim in a 16g",
    description: "Steady pace laps. 320 kcal burned. Avg HR: 135bpm.",
    time: "Today, 8:15 AM",
  },
  {
    id: 3, type: "log",
    title: "Daily Weigh-in",
    description: "Logged 68.4 kg. Down 0.2kg from yesterday.",
    time: "Today, 7:00 AM",
  },
]

const typeConfig = {
  meal:     { icon: Utensils,      color: "bg-green-100 text-green-600"   },
  exercise: { icon: Activity,      color: "bg-orange-100 text-orange-600" },
  log:      { icon: ClipboardList, color: "bg-blue-100 text-blue-600"     },
}

export default function ActivityLog() {
  return (
    // ✅ w-full بدل w-240، وشلنا h-90 الثابت
    <div className="bg-white rounded-2xl w-full p-4 md:p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-sm md:text-base">Activity Log</h3>
        <button className="text-sm text-green-600 hover:underline">View All →</button>
      </div>

      <div className="flex flex-col gap-4">
        {activities.map((activity) => {
          const config = typeConfig[activity.type]
          const Icon = config.icon
          return (
            <div key={activity.id} className="flex items-start gap-3 md:gap-4">

              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>

              {/* min-w-0 مهم عشان النص ميطلعش برا الكارت */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-xs md:text-sm font-medium text-gray-800 leading-tight truncate">
                    {activity.title}
                  </p>
                  <span className="text-[10px] md:text-xs text-gray-400 shrink-0">
                    {activity.time}
                  </span>
                </div>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1">
                  {activity.description}
                </p>
                {activity.tags && (
                  <div className="flex flex-wrap gap-1 md:gap-2 mt-2">
                    {activity.tags.map((tag) => (
                      <span key={tag} className="text-[9px] md:text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}