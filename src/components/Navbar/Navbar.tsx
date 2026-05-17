import {  UserCircle } from "lucide-react"
import NotificationBell from "../NotificationBell/NotificationBell"


function Navbar() {
    return (
      <div className="w-full bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <h1 className="plus-jakarta shrink-0 text-xl font-bold text-[#065F46] md:text-2xl">
            Healthia
          </h1>

          {/* Right: Notification + Divider + Account */}
          <div className="flex items-center">
            <div className="notification relative">
              {/* <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-700"></span>
              <Bell className="text-[#64748B] cursor-pointer" /> */}
              <NotificationBell />
            </div>
            <span className="mx-4 block h-7 w-0.5 bg-[#E2E8F0]"></span>
            <div className="flex items-center gap-1">
              <UserCircle className="text-[#065F46]" />
              <a href="#" className="hidden text-sm text-[#065F46] sm:block">
                My Account
              </a>
            </div>
          </div>
        </div>
      </div>
    )
}
export default Navbar