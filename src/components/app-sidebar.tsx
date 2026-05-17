// components/AppSidebar.tsx
import { useLocation, Link } from "react-router"
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
import {  type LucideIcon } from "lucide-react"

export type SidebarItem = {
  title: string
  icon: LucideIcon
  path: string
}

type AppSidebarProps = {
  menuItems: SidebarItem[]
  bottomItems?: SidebarItem[]
  title?: string
  subtitle?: string
  userInitials?: string
  userName?: string
  userRole?: string
}

export function AppSidebar({
  menuItems,
  bottomItems = [],
  title = "Healthia",
  subtitle = "CLINICAL MANAGEMENT",
  userInitials = "DA",
  userName = "Dr. Aris Thome",
  userRole = "Cardiologist",
}: AppSidebarProps) {
  const { pathname } = useLocation()

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path)

  const NavItem = ({ item }: { item: SidebarItem }) => {
    const active = isActive(item.path)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className={`h-10 rounded-full transition-all duration-200 ${
            active
              ? "scale-[1.03] bg-emerald-800 text-white shadow-md"
              : "text-emerald-100 hover:bg-emerald-800/50 hover:text-white"
          }`}
        >
          <Link to={item.path} className="flex items-center gap-3">
            <item.icon
              className={`h-5 w-5 transition-transform duration-200 ${active ? "scale-110" : ""}`}
            />
            <span className="text-sm font-medium">{item.title}</span>
            {active && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-300" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar className="overflow-hidden rounded-r-[50px] bg-primary">
      <SidebarHeader className="bg-primary">
        <div className="space-y-1">
          <div className="text-lg font-bold text-white">{title}</div>
          <div className="text-xs font-semibold tracking-widest text-white">
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
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
              {userInitials}
            </div>
            <div className="text-xs">
              <div className="font-semibold text-white">{userName}</div>
              <div className="text-emerald-200">{userRole}</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
