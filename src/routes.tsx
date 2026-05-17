import { createBrowserRouter } from "react-router"
import MainLayout from "@/layouts/MainLayout.tsx"
import DashboardDoctor from "./pages/DashboardDoctor/DashboardDoctor"
// import PatientProfile from "./pages/PatientProfile/PatientProfile"
import Appointment from "./pages/Appointment/Appointment"
import Analytics from "./pages/Analytics/Analytics"
import ProfileDoctor from "./pages/ProfileDoctor/ProfileDoctor"
// import PatientProfileTable from "./pages/Patients/Patients"
import AddPlan from "./pages/AddPlan/AddPlan"
import Login from "./pages/Login/Login"
import NewPassword from "./pages/NewPassword/NewPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword"
import PatientLayout from "./layouts/PatientLayout"

import Patients from "./pages/Patients/Patients"
import DashboardPatients from "./pages/DashboardPatients/DashboardPatients"
import PatientProfile from "./pages/PatientProfile/PatientProfile"
import BookAppointment from "./pages/BookAppointment/BookAppointment"
import AppointmentSuccess from "./pages/AppointmentSuccess/AppointmentSuccess"


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/new-password",
    element: <NewPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardDoctor />,
      },
      // {
      //   path: "patients",
      //   element: <PatientProfileTable />,
      // },
      // {
      //   path: "patientProfile",
      //   element: <PatientProfile />,
      // },
      { path: "patients",               element: <Patients />          },
      { path: "dashboardPatients",      element: <DashboardPatients /> },
      { path: "patientProfile",         element: <PatientProfile />    },
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
      {
        path: "add-plan",
        element: <AddPlan />,
      },
      { path: "book-appointment", 
        element: <BookAppointment />   },
        {
    path: "/appointment-success",
    element: <AppointmentSuccess />,
  }
    ],
  },
  {
    path: "patient",
    element: <PatientLayout />,
    children: [
      {
        index: true,
        element: <PatientProfile />,
      },
    ],
  },
])
