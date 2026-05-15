import { createBrowserRouter } from "react-router"
import MainLayout from "@/layouts/MainLayout.tsx"
import DashboardDoctor from "./pages/DashboardDoctor/DashboardDoctor"
import DashboardPatients from "./pages/DashboardPatients/DashboardPatients"
import PatientProfile from "./pages/PatientProfile/PatientProfile"
import Appointment from "./pages/Appointment/Appointment"
import Analytics from "./pages/Analytics/Analytics"
import ProfileDoctor from "./pages/ProfileDoctor/ProfileDoctor"
import AddPlan from "./pages/Addplan/AddPlan"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardDoctor />,
      },
      {
        path: "patients",
        element: <DashboardPatients />,
      },
      {
        path: "patientProfile",
        element: <PatientProfile />,
      },
      {
        path: "appointments",
        element: <Appointment />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "profile-doctor",
        element: <ProfileDoctor />,
      },
<<<<<<< HEAD
       {
        path: "add-plan",
        element: <AddPlan />,
=======
      {
        path: "profile-doctor",
        element: <ProfileDoctor />,
>>>>>>> 9b8787869423aa2145de3e0a7f0b19ca6b7731e6
      },
    ],
  },
])
