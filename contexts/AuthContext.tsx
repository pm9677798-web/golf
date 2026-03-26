'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  profileImageUrl?: string
  subscriptionStatus: string
  subscriptionPlan: string
  isAdmin?: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, userData: User) => void
  logout: () => void
  updateUser: (updatedUserData: Partial<User>) => void
  refreshUserData: (token: string) => Promise<User | null>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function to refresh user data
  const refreshUserData = useCallback(async (authToken: string) => {
    try {
      const response = await fetch('/api/user/dashboard', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        const updatedUser: User = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          profileImageUrl: data.user.profileImageUrl,
          subscriptionStatus: data.user.subscriptionStatus,
          subscriptionPlan: data.user.subscriptionPlan,
          isAdmin: data.user.email === 'admin@golfheart.com'
        }
        setUser(updatedUser)
        localStorage.setItem('auth_user', JSON.stringify(updatedUser))
        return updatedUser
      } else {
        // Token is invalid, clear auth
        logout()
        return null
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      return null
    }
  }, [])

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('auth_user')

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(userData)
        
        // Refresh user data to get latest info including profile image
        refreshUserData(storedToken).finally(() => {
          setIsLoading(false)
        })
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback((authToken: string, userData: User) => {
    setToken(authToken)
    setUser(userData)
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }, [])

  // Function to update user data (for profile updates)
  const updateUser = useCallback((updatedUserData: Partial<User>) => {
    setUser(prevUser => {
      if (prevUser) {
        const newUser = { ...prevUser, ...updatedUserData }
        localStorage.setItem('auth_user', JSON.stringify(newUser))
        return newUser
      }
      return prevUser
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, refreshUserData, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}