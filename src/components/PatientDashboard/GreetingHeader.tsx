import { useAuth } from "@/context/AuthContext"

const GreetingHeader: React.FC = () => {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-5">
      <div>
        <h1 className="text-3xl font-bold text-[#065F46]">
          {greeting}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Your body is a sanctuary. Today's the perfect day for progress.
        </p>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">{today}</div>
      </div>
    </div>
  )
}

export default GreetingHeader