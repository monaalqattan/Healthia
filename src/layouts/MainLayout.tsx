import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  LayoutGrid,
  Users,
  Calendar,
  BarChart3,
  User,
  Settings,
  HelpCircle,
} from "lucide-react"

const menuItems = [
  { title: "Overview", icon: LayoutGrid, path: "/" },
  { title: "Patients", icon: Users, path: "/patients" },
  { title: "Appointment", icon: Calendar, path: "/appointments" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Profile", icon: User, path: "/profile-doctor" },
]

const bottomItems = [
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Support", icon: HelpCircle, path: "/support" },
]

export default function MainLayout() {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar menuItems={menuItems} bottomItems={bottomItems} />
      <main className="flex flex-1 flex-col overflow-auto">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
