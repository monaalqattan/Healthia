import { useState, useRef, useEffect, useCallback } from "react"
import { Bell, X, CheckCheck } from "lucide-react"
import { notificationService } from "@/services/api"

interface Notif {
  _id:       string
  title:     string
  message:   string
  icon:      string
  read:      boolean
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return "Just now"
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function NotificationBell() {
  const [open,  setOpen]  = useState(false)
  const [items, setItems] = useState<Notif[]>([])
  const ref = useRef<HTMLDivElement>(null)

  const fetchNotifs = useCallback(() => {
    notificationService.getAll()
      .then(res => setItems(res.data || []))
      .catch(() => {})
  }, [])

  // جيب الـ notifications أول ما يفتح الـ bell
  useEffect(() => {
    fetchNotifs()
    // refresh كل دقيقة تلقائياً
    const interval = setInterval(fetchNotifs, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifs])

  // لما يفتح الـ dropdown يعمل refresh
  useEffect(() => {
    if (open) fetchNotifs()
  }, [open, fetchNotifs])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const unread = items.filter(n => !n.read).length

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead()
      setItems(prev => prev.map(n => ({ ...n, read: true })))
    } catch {}
  }

  const dismiss = async (id: string) => {
    try {
      await notificationService.delete(id)
      setItems(prev => prev.filter(n => n._id !== id))
    } catch {}
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative rounded-full p-1 transition hover:bg-gray-100"
      >
        {unread > 0 && (
          <span className="absolute top-0 right-0 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
        <Bell className="h-5 w-5 text-[#64748B] cursor-pointer" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">Notifications</span>
              {unread > 0 && (
                <span className="rounded-full bg-[#065F46] px-2 py-0.5 text-xs font-medium text-white">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} title="Mark all as read"
                  className="text-[#065F46] transition hover:text-green-800">
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-72 divide-y divide-gray-50 overflow-y-auto">
            {items.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No notifications yet
              </div>
            ) : (
              items.map(n => (
                <div key={n._id}
                  className={`flex items-start gap-3 px-4 py-3 transition hover:bg-gray-50 ${!n.read ? "bg-[#F0FDF4]" : ""}`}
                >
                  <span className="mt-0.5 text-lg">{n.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${!n.read ? "font-semibold text-gray-800" : "font-medium text-gray-600"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="mt-1 text-xs text-gray-300">{timeAgo(n.createdAt)}</p>
                  </div>
                  {/* X يحذف الـ notification */}
                  <button onClick={() => dismiss(n._id)}
                    className="mt-0.5 shrink-0 text-gray-300 hover:text-red-400 transition-colors p-0.5 rounded">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5 text-center">
              <button
                onClick={() => { setItems([]); notificationService.markAllRead().catch(()=>{}) }}
                className="text-xs font-medium text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}