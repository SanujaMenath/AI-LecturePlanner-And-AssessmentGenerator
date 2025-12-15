import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  role?: "admin" | "lecturer" | "student"
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { user, token } = useAuth()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
