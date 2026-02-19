import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AdminModeProvider } from '@/components/providers/AdminModeProvider'
import { useAdminMode } from '@/hooks/use-admin-mode'
import React from 'react'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AdminModeProvider>{children}</AdminModeProvider>
)

describe('useAdminMode', () => {
  it('should initialize with isAdminMode as false', () => {
    const { result } = renderHook(() => useAdminMode(), { wrapper })
    expect(result.current.isAdminMode).toBe(false)
  })

  it('should toggle isAdminMode when toggleAdminMode is called', () => {
    const { result } = renderHook(() => useAdminMode(), { wrapper })
    
    act(() => {
      result.current.toggleAdminMode()
    })
    expect(result.current.isAdminMode).toBe(true)

    act(() => {
      result.current.toggleAdminMode()
    })
    expect(result.current.isAdminMode).toBe(false)
  })

  it('should set isAdminMode specifically when setAdminMode is called', () => {
    const { result } = renderHook(() => useAdminMode(), { wrapper })
    
    act(() => {
      result.current.setAdminMode(true)
    })
    expect(result.current.isAdminMode).toBe(true)

    act(() => {
      result.current.setAdminMode(true) // already true
    })
    expect(result.current.isAdminMode).toBe(true)

    act(() => {
      result.current.setAdminMode(false)
    })
    expect(result.current.isAdminMode).toBe(false)
  })
})
