import { useState, useRef, useEffect } from "react"
import { Bell, X, CheckCheck } from "lucide-react"

const notifications = [
  {
    id: 1,
    title: "New patient registered",
    desc: "Sarah Jenkins joined as a new patient.",
    time: "2 min ago",
    read: false,
    icon: "🧑‍⚕️",
  },
  {
    id: 2,
    title: "Appointment reminder",
    desc: "David Chen has a session at 3:00 PM today.",
    time: "15 min ago",
    read: false,
    icon: "📅",
  },
  {
    id: 3,
    title: "Payment received",
    desc: "Emily Davis paid $120 for her monthly plan.",
    time: "1 hr ago",
    read: true,
    icon: "💳",
  },
  {
    id: 4,
    title: "Plan review needed",
    desc: "Michael Brown's plan is due for review.",
    time: "3 hrs ago",
    read: true,
    icon: "📋",
  },
]

 function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(notifications)
  const ref = useRef<HTMLDivElement>(null)

  const unread = items.filter((n) => !n.read).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  const dismiss = (id: number) =>
    setItems((prev) => prev.filter((n) => n.id !== id))

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-1 transition hover:bg-gray-100"
      >
        {unread > 0 && (
          <span className="absolute top-0 right-0 z-10 block h-2 w-2 rounded-full bg-red-600" />
        )}
        <Bell className="h-5 w-5 text-[#64748B] cursor-pointer" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                Notifications
              </span>
              {unread > 0 && (
                <span className="rounded-full bg-[#065F46] px-2 py-0.5 text-xs font-medium text-white">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[#065F46] transition hover:text-green-800"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 transition hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 divide-y divide-gray-50 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No notifications
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition hover:bg-gray-50 ${
                    !n.read ? "bg-[#F0FDF4]" : ""
                  }`}
                >
                  <span className="mt-0.5 text-lg">{n.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm ${!n.read ? "font-semibold text-gray-800" : "font-medium text-gray-600"}`}
                    >
                      {n.title}
                    </p>
                    <p className="truncate text-xs text-gray-400">{n.desc}</p>
                    <p className="mt-0.5 text-xs text-gray-300">{n.time}</p>
                  </div>
                  <button
                    onClick={() => dismiss(n.id)}
                    className="mt-0.5 shrink-0 text-gray-300 transition hover:text-gray-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5 text-center">
              <button className="text-xs font-medium text-[#065F46] transition hover:text-green-800">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default NotificationBell
