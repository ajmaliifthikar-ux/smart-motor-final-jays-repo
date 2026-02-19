import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionEditor } from '@/components/admin/cms/section-editor'
import { useAdminMode } from '@/hooks/use-admin-mode'
import React from 'react'

vi.mock('@/hooks/use-admin-mode', () => ({
  useAdminMode: vi.fn(),
}))

describe('SectionEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders children without controls when isAdminMode is false', () => {
    vi.mocked(useAdminMode).mockReturnValue({
      isAdminMode: false,
      toggleAdminMode: vi.fn(),
      setAdminMode: vi.fn(),
      isAdmin: false,
      loading: false,
    })

    render(
      <SectionEditor sectionId="hero" sectionName="Hero">
        <div data-testid="child-content">Content</div>
      </SectionEditor>
    )

    expect(screen.getByTestId('child-content')).toBeDefined()
    expect(screen.queryByText(/Hero/i)).toBeNull()
  })

  it('renders controls when isAdminMode is true', () => {
    vi.mocked(useAdminMode).mockReturnValue({
      isAdminMode: true,
      toggleAdminMode: vi.fn(),
      setAdminMode: vi.fn(),
      isAdmin: true,
      loading: false,
    })

    render(
      <SectionEditor sectionId="hero" sectionName="Hero">
        <div data-testid="child-content">Content</div>
      </SectionEditor>
    )

    expect(screen.getByText(/Hero/i)).toBeDefined()
    expect(screen.getByTitle(/Edit Content/i)).toBeDefined()
    expect(screen.getByTitle(/Browse History/i)).toBeDefined()
  })
})
