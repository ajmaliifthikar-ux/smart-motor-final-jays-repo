import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AdminToolbar } from '@/components/layout/admin-toolbar'
import { useAdminMode } from '@/hooks/use-admin-mode'
import React from 'react'

vi.mock('@/hooks/use-admin-mode', () => ({
  useAdminMode: vi.fn(),
}))

vi.mock('@/lib/firebase', () => ({
  auth: {},
}))

vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
}))

describe('AdminToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render if user is not an admin', () => {
    vi.mocked(useAdminMode).mockReturnValue({
      isAdminMode: false,
      toggleAdminMode: vi.fn(),
      setAdminMode: vi.fn(),
      isAdmin: false,
      loading: false,
    })

    const { container } = render(<AdminToolbar />)
    expect(container.firstChild).toBeNull()
  })

  it('should render if user is an admin', () => {
    vi.mocked(useAdminMode).mockReturnValue({
      isAdminMode: false,
      toggleAdminMode: vi.fn(),
      setAdminMode: vi.fn(),
      isAdmin: true,
      loading: false,
    })

    render(<AdminToolbar />)
    expect(screen.getByText(/ADMIN PANEL/i)).toBeDefined()
    expect(screen.getByText(/Edit Mode/i)).toBeDefined()
  })

  it('should call toggleAdminMode when toggle is clicked', () => {
    const toggleAdminMode = vi.fn()
    vi.mocked(useAdminMode).mockReturnValue({
      isAdminMode: false,
      toggleAdminMode,
      setAdminMode: vi.fn(),
      isAdmin: true,
      loading: false,
    })

    render(<AdminToolbar />)
    const toggles = screen.getAllByTestId('admin-mode-toggle')
    toggles.forEach(t => fireEvent.click(t))

    expect(toggleAdminMode).toHaveBeenCalled()
  })
})
