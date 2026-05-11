import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutGrid,
  Users,
  Calendar,
  BarChart3,
  User,
  Settings,
  HelpCircle,
} from "lucide-react"
import { Link } from "react-router"
// import path from "path"

const menuItems = [
  { title: "Overview", icon: LayoutGrid, active: true, path: "/" },
  { title: "Patients", icon: Users, path: "/patients" },
  { title: "Appointment", icon: Calendar, path: "/appointments" },
  { title: "Analytics", icon: BarChart3, path: "/analytics" },
  { title: "Profile", icon: User, path: "/profile-doctor" },
]

const bottomItems = [
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Support", icon: HelpCircle, path: "/support" },
]

export function AppSidebar() {
  return (
    <Sidebar className="rounded-r-[50px] bg-primary overflow-hidden">
      <SidebarHeader className="bg-primary">
        <div className="space-y-1">
          <div className="text-lg font-bold text-white">Healthia</div>
          <div className="text-xs font-semibold tracking-widest text-white">
            CLINICAL MANAGEMENT
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`h-10 rounded-full ${
                    item.active
                      ? "bg-emerald-800 text-white"
                      : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
                  }`}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-4 border-t border-emerald-700 bg-primary">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className="h-10 text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <div className="border-t border-emerald-700 pt-2">
          <div className="flex items-center gap-3 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              DA
            </div>
            <div className="text-xs">
              <div className="font-semibold text-white">Dr. Aris Thome</div>
              <div className="text-emerald-200">Cardiologist</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
