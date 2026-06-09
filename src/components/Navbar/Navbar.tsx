import { useNavigate } from "react-router"
import NotificationBell from "../NotificationBell/NotificationBell"
import { useAuth } from "@/context/AuthContext"

function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "DR"

  return (
    <div className="w-full bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h1 className="plus-jakarta shrink-0 text-xl font-bold text-[#065F46] md:text-2xl">
          Healthia
        </h1>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <span className="mx-3 block h-7 w-0.5 bg-[#E2E8F0]" />
          <button
            onClick={() => navigate("/doctor/profile-doctor")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
              {initials}
            </div>
            <span className="hidden text-sm font-medium text-[#065F46] sm:block">
              {user?.name || "My Account"}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar