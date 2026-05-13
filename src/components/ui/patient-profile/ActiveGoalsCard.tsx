interface ActiveGoalsCardProps {
  goals: string[]
}

const goalConfig = [
  { bg: "bg-green-100",   text: "text-green-700",   icon: "💧" },
  { bg: "bg-emerald-100", text: "text-emerald-700", icon: "⚡" },
  { bg: "bg-gray-100",    text: "text-gray-500",    icon: "🍬" },
]

export default function ActiveGoalsCard({ goals }: ActiveGoalsCardProps) {
  return (
    // ✅ w-full بدل w-110
    <div className="bg-white rounded-2xl w-full p-6 shadow-sm">
      <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
        Active Goals
      </p>
      <div className="flex flex-col gap-3">
        {goals.map((goal, index) => {
          const config = goalConfig[index % goalConfig.length]
          return (
            <div key={index} className={`flex items-center gap-3 px-4 py-2.5 rounded-full ${config.bg}`}>
              {/* <span className="text-sm">{config.icon}</span> */}
              <span className={`text-xs font-semibold ${config.text}`}>{goal}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}