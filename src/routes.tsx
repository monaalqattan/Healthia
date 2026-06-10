import { createBrowserRouter, Navigate } from "react-router"
import { ProtectedRoute } from "./components/ProtectedRoute"

import MainLayout from "@/layouts/MainLayout.tsx"
import PatientLayout from "./layouts/PatientLayout"
import AdminLayout from "./layouts/AdminLayout"

import Login from "./pages/Login/Login"
import NewPassword from "./pages/NewPassword/NewPassword"
import ResetPassword from "./pages/ResetPassword/ResetPassword"
import Home from "./pages/LandingPage/Home"
import AppointmentSuccess from "./pages/AppointmentSuccess/AppointmentSuccess"

import DashboardDoctor from "./pages/DashboardDoctor/DashboardDoctor"
import Appointment from "./pages/Appointment/Appointment"
import Analytics from "./pages/Analytics/Analytics"
import ProfileDoctor from "./pages/ProfileDoctor/ProfileDoctor"
import AddPlan from "./pages/AddPlan/AddPlan"
import Patients from "./pages/Patients/Patients"
import DashboardPatients from "./pages/DashboardPatients/DashboardPatients"
import PatientProfile from "./pages/PatientProfile/PatientProfile"
import BookAppointment from "./pages/BookAppointment/BookAppointment"

import PatientDashboard from "./pages/CLIENT-SIDE/PatientDashboard"
import MealPlan from "./pages/CLIENT-SIDE/Meal-Plan"
import Tracking from "./pages/CLIENT-SIDE/Tracking"
import ClientProfile from "./pages/CLIENT-SIDE/Client-Profile"
import PatientBookAppointment from "./pages/CLIENT-SIDE/BookAppointment"

import AdminDashboard from "./pages/Admin/AdminDashboard"
import AdminSupport   from "./pages/Admin/AdminSupport"
import Support        from "./pages/Support/Support"
import AdminDoctors   from "./pages/Admin/AdminDoctors"
import AdminPatients  from "./pages/Admin/AdminPatients"

// ================================
// Protected Route
// ================================
function ProtectedRoute({ children, allowedRoles }: {
  children: React.ReactNode
  allowedRoles: string[]
}) {
  const { user, isLoading } = useAuth()

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center text-gray-400">
      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />

  return <>{children}</>
}

// ================================
// Router
// ================================
export const router = createBrowserRouter([
  // Public Routes
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/new-password", element: <NewPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/home", element: <Home /> },
  { path: "/support", element: <Support /> },
  { path: "/appointment-success", element: <AppointmentSuccess /> },

  // Doctor Routes
  {
    path: "/doctor",
    element: (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardDoctor /> },
      { path: "patients", element: <Patients /> },
      { path: "dashboardPatients", element: <DashboardPatients /> },
      { path: "patientProfile", element: <PatientProfile /> },
      { path: "appointments", element: <Appointment /> },
      { path: "analytics", element: <Analytics /> },
      { path: "profile-doctor", element: <ProfileDoctor /> },
      { path: "add-plan", element: <AddPlan /> },
      { path: "book-appointment", element: <BookAppointment /> },
    ],
  },

  // Patient Routes
  {
    path: "/patient",
    element: (
      <ProtectedRoute allowedRoles={["patient"]}>
        <PatientLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PatientDashboard /> },
      { path: "meal-plan", element: <MealPlan /> },
      { path: "tracking", element: <Tracking /> },
      { path: "patient-profile", element: <ClientProfile /> },
      { path: "book-appointment", element: <PatientBookAppointment /> },
    ],
  },

  // Super Admin Routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["superadmin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "doctors", element: <AdminDoctors /> },
      { path: "patients", element: <AdminPatients /> },
      { path: "support",  element: <AdminSupport />  },
    ],
  },
])
