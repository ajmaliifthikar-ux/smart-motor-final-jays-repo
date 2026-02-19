'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminModeContextType {
  isAdminMode: boolean
  toggleAdminMode: () => void
  setAdminMode: (value: boolean) => void
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined)

export function AdminModeProvider({ children }: { children: React.ReactNode }) {
  const [isAdminMode, setIsAdminMode] = useState(false)

  // Persist admin mode in session storage for convenience during dev/testing
  useEffect(() => {
    const saved = sessionStorage.getItem('smart-motor-admin-mode')
    if (saved === 'true') {
      setIsAdminMode(true)
    }
  }, [])

  const toggleAdminMode = () => {
    setIsAdminMode((prev) => {
      const next = !prev
      sessionStorage.setItem('smart-motor-admin-mode', String(next))
      return next
    })
  }

  const setAdminMode = (value: boolean) => {
    setIsAdminMode(value)
    sessionStorage.setItem('smart-motor-admin-mode', String(value))
  }

  return (
    <AdminModeContext.Provider value={{ isAdminMode, toggleAdminMode, setAdminMode }}>
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
