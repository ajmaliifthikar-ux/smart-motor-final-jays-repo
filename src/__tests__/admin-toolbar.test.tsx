import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AdminToolbar } from '@/components/layout/admin-toolbar'
import { useSession } from 'next-auth/react'
import { useAdminMode } from '@/hooks/use-admin-mode'
import React from 'react'

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}))

vi.mock('@/hooks/use-admin-mode', () => ({
  useAdminMode: vi.fn(),
}))

describe('AdminToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render if user is not an admin', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: 'USER' } },
      status: 'authenticated',
    } as any)
    vi.mocked(useAdminMode).mockReturnValue({
      isAdminMode: false,
      toggleAdminMode: vi.fn(),
      setAdminMode: vi.fn(),
    })

    const { container } = render(<AdminToolbar />)
    expect(container.firstChild).toBeNull()
  })

  it('should render if user is an admin', () => {
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: 'ADMIN' } },
      status: 'authenticated',
    } as any)
    vi.mocked(useAdminMode).mockReturnValue({
      isAdminMode: false,
      toggleAdminMode: vi.fn(),
      setAdminMode: vi.fn(),
    })

    render(<AdminToolbar />)
    expect(screen.getByText(/ADMIN PANEL/i)).toBeDefined()
    expect(screen.getByText(/Edit Mode/i)).toBeDefined()
  })

  it('should call toggleAdminMode when toggle is clicked', () => {
    const toggleAdminMode = vi.fn()
    vi.mocked(useSession).mockReturnValue({
      data: { user: { role: 'ADMIN' } },
      status: 'authenticated',
    } as any)
    vi.mocked(useAdminMode).mockReturnValue({
      isAdminMode: false,
      toggleAdminMode,
      setAdminMode: vi.fn(),
    })

    render(<AdminToolbar />)
    const toggles = screen.getAllByTestId('admin-mode-toggle')
    toggles.forEach(t => fireEvent.click(t))

    expect(toggleAdminMode).toHaveBeenCalled()
  })
})
