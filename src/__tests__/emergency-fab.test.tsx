import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { EmergencyFAB } from '@/components/ui/emergency-fab'
import { vi, describe, it, expect, afterEach } from 'vitest'
import React from 'react'

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.ComponentProps<'div'> & { children: React.ReactNode }) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock AIChatPanel to avoid complex dependencies
vi.mock('@/components/ui/ai-chat-panel', () => ({
  AIChatPanel: () => <div data-testid="ai-chat-panel">AI Chat Panel</div>,
}))

// Mock Tooltip to just render children, so we focus on the button
// We also render the tooltip content in a data attribute to verify it updates
vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: string }) => (
    <div data-tooltip={content}>{children}</div>
  ),
}))

// Mock fetch
global.fetch = vi.fn(() => Promise.resolve({
  json: () => Promise.resolve({}),
} as Response))

// Mock window.open
global.open = vi.fn()

afterEach(() => {
  cleanup()
})

describe('EmergencyFAB', () => {
  it('renders accessible buttons', () => {
    render(<EmergencyFAB />)

    // Check initial state
    expect(screen.getByLabelText('WhatsApp')).toBeTruthy()
    expect(screen.getByLabelText('Call Us')).toBeTruthy()
    const aiButton = screen.getByLabelText('AI Assistant')
    expect(aiButton).toBeTruthy()

    // Check tooltip content via mock
    expect(aiButton.closest('[data-tooltip]')?.getAttribute('data-tooltip')).toBe('AI Assistant')
  })

  it('toggles AI Assistant label when clicked', () => {
    render(<EmergencyFAB />)

    const aiButton = screen.getByLabelText('AI Assistant')

    // Click to open
    fireEvent.click(aiButton)

    // Now the label should change to "Close AI Assistant"
    // We search for the new label
    const closeButton = screen.getByLabelText('Close AI Assistant')
    expect(closeButton).toBeTruthy()

    // Check tooltip content updated
    expect(closeButton.closest('[data-tooltip]')?.getAttribute('data-tooltip')).toBe('Close AI Assistant')

    // Click to close
    fireEvent.click(closeButton)

    // Should be back to "AI Assistant"
    expect(screen.getByLabelText('AI Assistant')).toBeTruthy()
  })
})
