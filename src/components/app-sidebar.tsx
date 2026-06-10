import { NavLink } from "react-router"
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
import logo from "@/assets/logoRemovebgg.png"
import { type LucideIcon, LogOut } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export type SidebarItem = {
  title: string
  icon: LucideIcon
  path: string
}

type AppSidebarProps = {
  menuItems: SidebarItem[]
  bottomItems?: SidebarItem[]
  subtitle?: string
}

export function AppSidebar({
  menuItems,
  bottomItems = [],
  subtitle = "CLINICAL MANAGEMENT",
}: AppSidebarProps) {
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?"

  const roleLabel =
    user?.role === "patient"
      ? "Patient"
      : user?.role === "doctor"
        ? "Doctor"
        : "Admin"

  const NavItem = ({ item }: { item: SidebarItem }) => (
    <SidebarMenuItem>
      <NavLink
        end={
          item.path === "/patient" ||
          item.path === "/doctor" ||
          item.path === "/admin"
        }
        to={item.path}
        className="flex items-center"
      >
        {({ isActive }) => (
          <SidebarMenuButton
            className={`flex h-10 w-full items-center gap-3 rounded-full transition-all duration-200 ${
              isActive
                ? "bg-white/20 font-semibold text-white"
                : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <item.icon
              className={`h-5 w-5 shrink-0 ${isActive ? "scale-110" : ""}`}
            />
            <span className="text-sm font-medium">{item.title}</span>
          </SidebarMenuButton>
        )}
      </NavLink>
    </SidebarMenuItem>
  )

  return (
    <Sidebar className="overflow-hidden rounded-r-[50px] bg-primary">
      <SidebarHeader className="bg-primary">
        <div className="space-y-1">
          <img
            src={logo}
            alt="Logo"
            className="h-10 object-contain m-3"
          />
          <div className="text-xs font-semibold tracking-widest text-emerald-200">
            {subtitle}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarMenu className="space-y-2">
            {menuItems.map((item) => (
              <NavItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-4 border-t border-emerald-700 bg-primary">
        {bottomItems.length > 0 && (
          <SidebarGroup>
            <SidebarMenu className="space-y-2">
              {bottomItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        <div className="border-t border-emerald-700 pt-2">
          <div className="flex items-center gap-3 p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <div className="truncate font-semibold text-white">
                {user?.name || "—"}
              </div>
              <div className="text-emerald-200 capitalize">{roleLabel}</div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="shrink-0 rounded-lg p-1.5 text-emerald-300 transition-colors hover:bg-emerald-800/50 hover:text-white"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
