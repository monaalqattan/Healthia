import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
  LayoutGrid,
  UtensilsCrossed,
  Calendar,
  Activity,
  User,
} from "lucide-react"

const menuItems = [
  { title: "Dashboard",   icon: LayoutGrid,      path: "/patient" },
  { title: "Meal Plan",   icon: UtensilsCrossed, path: "/patient/meal-plan" },
  { title: "Appointment", icon: Calendar,        path: "/patient/book-appointment" },
  { title: "Tracking",    icon: Activity,        path: "/patient/tracking" },
  { title: "My Profile",  icon: User,            path: "/patient/patient-profile" },
]

export default function PatientLayout() {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar menuItems={menuItems} bottomItems={[]} subtitle="PATIENT PORTAL" />
      <main className="flex flex-1 flex-col overflow-auto">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}