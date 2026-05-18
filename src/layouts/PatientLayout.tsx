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
  { title: "Overview", icon: LayoutGrid, path: "/patient" },
  { title: "Meal Plans", icon: Users, path: "/patient/meal-plan" },
  { title: "Appointment", icon: Calendar, path: "/patient/book-appointment" },
  { title: "Tracking", icon: BarChart3, path: "/patient/tracking" },
  { title: "Profile", icon: User, path: "/patient/patient-profile" },
]

const bottomItems = [
  { title: "Settings", icon: Settings, path: "/patient/settings" },
  { title: "Support", icon: HelpCircle, path: "/patient/support" },
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
