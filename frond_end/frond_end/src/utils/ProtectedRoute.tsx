import { Navigate } from "react-router-dom"
import type { ReactNode } from "react";

function isTokenExpired(token :string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const expiryTime = payload.exp * 1000

    return Date.now() > expiryTime
  } catch (error) {
    return true
  }
}
interface childrenpref {
  children :ReactNode
}
function ProtectedRoute({ children }: childrenpref) {
  const token = localStorage.getItem("access_token")

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("access_token")
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute