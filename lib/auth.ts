'use client'

import { useState, useEffect } from 'react'

interface User {
  _id: string
  username: string
  email: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      setAuthState({
        user: JSON.parse(user),
        isAuthenticated: true,
        isLoading: false
      })
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }
  }, [])

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
  }

  const getAuthToken = () => {
    return localStorage.getItem('token')
  }

  return {
    ...authState,
    login,
    logout,
    getAuthToken
  }
}

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}
