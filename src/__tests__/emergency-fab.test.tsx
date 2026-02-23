import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { EmergencyFAB } from '../components/ui/emergency-fab'

// Mock dependencies
vi.mock('../components/ui/ai-chat-panel', () => ({
  AIChatPanel: () => <div data-testid="ai-chat-panel">Mock AI Chat Panel</div>
}))

// Mock framer-motion to render children directly
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    button: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('EmergencyFAB', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the FAB buttons', () => {
    render(<EmergencyFAB />)

    // Check if buttons exist
    // The "WhatsApp" button
    const whatsappButton = screen.queryByRole('button', { name: /WhatsApp/i })
    // The "Call Us" button
    const callUsButton = screen.queryByRole('button', { name: /Call Us/i })
    // The "AI Assistant" button
    const aiButton = screen.queryByRole('button', { name: /AI Assistant/i })

    // These assertions are expected to pass now
    expect(whatsappButton).not.toBeNull()
    expect(callUsButton).not.toBeNull()
    expect(aiButton).not.toBeNull()
  })

  it('renders the AI Assistant button with correct aria attributes', () => {
      render(<EmergencyFAB />)

      const aiButton = screen.getByRole('button', { name: /AI Assistant/i })

      expect(aiButton.getAttribute('aria-haspopup')).toBe('dialog')
      expect(aiButton.getAttribute('aria-expanded')).toBe('false')
  })

  it('toggles aria-expanded on click', () => {
      render(<EmergencyFAB />)
      const aiButton = screen.getByRole('button', { name: /AI Assistant/i })

      expect(aiButton.getAttribute('aria-expanded')).toBe('false')

      fireEvent.click(aiButton)

      // Since it's a state change, we expect re-render.
      // Wait, isChatOpen changes, triggering re-render.
      // We need to re-query or check the same element if it's updated in place (React usually updates the DOM node attributes).

      expect(aiButton.getAttribute('aria-expanded')).toBe('true')
  })
})
