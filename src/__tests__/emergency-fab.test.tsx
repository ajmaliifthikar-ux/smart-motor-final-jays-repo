import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { EmergencyFAB } from '@/components/ui/emergency-fab'
import { vi, describe, it, expect, afterEach } from 'vitest'

// Manually clean up after each test to avoid multiple elements found error
afterEach(() => {
  cleanup()
})

// Mock the AIChatPanel component to avoid complex dependencies
vi.mock('@/components/ui/ai-chat-panel', () => ({
  AIChatPanel: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mock-chat-panel" data-is-open={isOpen ? "true" : "false"}>
      Mock Chat Panel
    </div>
  ),
}))

// Mock Tooltip to just render children
vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Phone: () => <svg data-testid="icon-phone" />,
  MessageCircle: () => <svg data-testid="icon-whatsapp" />,
  Sparkles: () => <svg data-testid="icon-ai" />,
  X: () => <svg data-testid="icon-close" />,
  MessageSquare: () => <svg />,
  Truck: () => <svg />,
  Navigation: () => <svg />,
  MapPin: () => <svg />,
  Clock: () => <svg />,
}))

describe('EmergencyFAB', () => {
  it('renders all FAB buttons with correct aria-labels', () => {
    render(<EmergencyFAB />)

    expect(screen.getByLabelText('WhatsApp')).toBeDefined()
    expect(screen.getByLabelText('Call Us')).toBeDefined()
    expect(screen.getByLabelText('AI Assistant')).toBeDefined()
  })

  it('AI Assistant button has correct aria-expanded state', () => {
    render(<EmergencyFAB />)

    const aiButton = screen.getByLabelText('AI Assistant')
    expect(aiButton.getAttribute('aria-expanded')).toBe('false')
    expect(aiButton.getAttribute('aria-haspopup')).toBe('dialog')

    // Click to open
    fireEvent.click(aiButton)

    // In the real component, state update triggers re-render
    // We check if the button (which might be re-rendered) has the new state
    const aiButtonAfterClick = screen.getByLabelText('AI Assistant')
    expect(aiButtonAfterClick.getAttribute('aria-expanded')).toBe('true')
  })

  it('toggles chat panel visibility', () => {
    render(<EmergencyFAB />)

    const aiButton = screen.getByLabelText('AI Assistant')
    fireEvent.click(aiButton)

    const chatPanel = screen.getByTestId('mock-chat-panel')
    expect(chatPanel.getAttribute('data-is-open')).toBe('true')
  })
})
