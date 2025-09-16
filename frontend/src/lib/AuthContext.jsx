import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuth = authService.isAuthenticated()
        const currentUser = authService.getCurrentUser()

        setIsAuthenticated(isAuth)
        setUser(currentUser)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    try {
      const result = await authService.verifyOTP(
        credentials.abhaId,
        credentials.otp,
        credentials.userType || 'patient'
      )

      if (result.success) {
        setIsAuthenticated(true)
        setUser(result.user)
        return result
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  const generateOTP = async (abhaId, userType = 'patient') => {
    try {
      const result = await authService.generateOTP(abhaId, userType)
      return result
    } catch (error) {
      console.error('OTP generation error:', error)
      throw error
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    generateOTP,
    setUser,
    setIsAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider')
  }
  return context
}

export default AuthContextProvider
