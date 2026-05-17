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
  { title: "Meal Plans", icon: Users, path: "/meal-plans" },
  { title: "Appointment", icon: Calendar, path: "/appointments" },
  { title: "Tracking", icon: BarChart3, path: "/tracking" },
  { title: "Profile", icon: User, path: "/profile-patient" },
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
