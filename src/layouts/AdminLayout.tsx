import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Stethoscope,
  MessageSquare
} from 'lucide-react'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-[#F4F6F4]">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1B4332] text-white flex flex-col transition-all duration-300`}>

        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          {sidebarOpen && (
            <span className="text-xl font-bold tracking-wide">Healthia</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/70 hover:text-white">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`
            }
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/admin/doctors"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`
            }
          >
            <Stethoscope size={20} />
            {sidebarOpen && <span>Doctors</span>}
          </NavLink>

          <NavLink
            to="/admin/patients"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`
            }
          >
            <Users size={20} />
            {sidebarOpen && <span>Patients</span>}
          </NavLink>


          <NavLink
            to="/admin/support"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
              }`
            }
          >
            <MessageSquare size={20} />
            {sidebarOpen && <span>Support</span>}
          </NavLink>
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen && (
            <div className="mb-3 px-2">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-white/50">Super Admin</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors w-full text-white/80 hover:text-white"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

    </div>
  )
}