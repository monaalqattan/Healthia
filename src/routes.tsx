import { createBrowserRouter } from "react-router"
import MainLayout from "@/layouts/MainLayout.tsx"
import DashboardDoctor from "./pages/DashboardDoctor/DashboardDoctor"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
         index: true,
        element: <DashboardDoctor />,
      },
    ],
  },
])
