import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function MainLayout() {
  return (
    // h-screen: الـ Layout ياخد ارتفاع الشاشة كلها
    <SidebarProvider className="h-screen">
      <AppSidebar />
      {/*
        flex-1: يملا الباقي بعد الـ Sidebar
        overflow-auto: لو المحتوى أكبر من الشاشة يعمل scroll
        flex flex-col: عشان الـ SidebarTrigger والـ Outlet يتوزعوا صح
      */}
      <main className="flex-1 flex flex-col overflow-auto">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}