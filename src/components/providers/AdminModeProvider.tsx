'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useFirebaseAuth } from '@/hooks/use-firebase-auth'

interface AdminModeContextType {
  isAdminMode: boolean
  toggleAdminMode: () => void
  setAdminMode: (value: boolean) => void
  isAdmin: boolean
  loading: boolean
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined)

export function AdminModeProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useFirebaseAuth()
  const [isAdminMode, setIsAdminMode] = useState(false)

  // Auto-disable Edit Mode if user is no longer an admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      setIsAdminMode(false)
    }
  }, [isAdmin, loading])

  // Persist admin mode in session storage for convenience during dev/testing
  useEffect(() => {
    const saved = sessionStorage.getItem('smart-motor-admin-mode')
    if (saved === 'true' && isAdmin) {
      setIsAdminMode(true)
    }
  }, [isAdmin])

  const toggleAdminMode = () => {
    if (!isAdmin) return
    setIsAdminMode((prev) => {
      const next = !prev
      sessionStorage.setItem('smart-motor-admin-mode', String(next))
      return next
    })
  }

  const setAdminMode = (value: boolean) => {
    if (!isAdmin && value) return
    setIsAdminMode(value)
    sessionStorage.setItem('smart-motor-admin-mode', String(value))
  }

  return (
    <AdminModeContext.Provider value={{ isAdminMode, toggleAdminMode, setAdminMode, isAdmin, loading }}>
      {children}
    </AdminModeContext.Provider>
  )
}

export function useAdminMode() {
  const context = useContext(AdminModeContext)
  if (context === undefined) {
    throw new Error('useAdminMode must be used within an AdminModeProvider')
  }
  return context
}
