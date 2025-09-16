import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const ProtectedRoute = ({ adminOnly = false }) => {
  const { isLoggedIn, userProfile } = useAuth()
  const isAuthenticated = !!localStorage.getItem('authToken')

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check admin access if required
  if (adminOnly) {
    // For now, we'll check if user has admin privileges
    // You can modify this logic based on your admin identification system
    const isAdmin = userProfile?.role === 'ADMIN'

    if (!isAdmin) {
      return <Navigate to="/" replace />
    }
  }

  return <Outlet />
}

export default ProtectedRoute
