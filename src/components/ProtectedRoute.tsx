import { Navigate } from "react-router"
import { useAuth } from "@/context/AuthContext"

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: string[]
}) {
  const { user, isLoading } = useAuth()

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    )
  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />

  return <>{children}</>
}
