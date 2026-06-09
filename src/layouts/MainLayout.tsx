import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  LayoutGrid, Users, Calendar, BarChart3, User,
} from "lucide-react"

const menuItems = [
  { title: "Overview",    icon: LayoutGrid, path: "/doctor" },
  { title: "Patients",    icon: Users,      path: "/doctor/patients" },
  { title: "Appointment", icon: Calendar,   path: "/doctor/appointments" },
  { title: "Analytics",   icon: BarChart3,  path: "/doctor/analytics" },
  { title: "Profile",     icon: User,       path: "/doctor/profile-doctor" },
]

export default function MainLayout() {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar menuItems={menuItems} bottomItems={[]} />
      <main className="flex flex-1 flex-col overflow-auto">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}