/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { EmergencyFAB } from '@/components/ui/emergency-fab'
import { describe, it, expect, vi } from 'vitest'

// Mock dependencies
vi.mock('lucide-react', () => ({
  Phone: () => <span data-testid="icon-phone" />,
  MessageCircle: () => <span data-testid="icon-message" />,
  Sparkles: () => <span data-testid="icon-sparkles" />,
  X: () => <span data-testid="icon-x" />,
  MessageSquare: () => <span data-testid="icon-message-square" />,
  Truck: () => <span data-testid="icon-truck" />,
  Navigation: () => <span data-testid="icon-navigation" />,
  MapPin: () => <span data-testid="icon-map-pin" />,
  Clock: () => <span data-testid="icon-clock" />,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

vi.mock('@/components/ui/ai-chat-panel', () => ({
  AIChatPanel: () => <div data-testid="ai-chat-panel" />,
}))

vi.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
}))

describe('EmergencyFAB Accessibility', () => {
  it('renders FAB buttons with aria-labels', () => {
    render(<EmergencyFAB />)

    // Check for aria-labels
    expect(screen.getByLabelText('WhatsApp')).toBeDefined()
    expect(screen.getByLabelText('Call Us')).toBeDefined()
    expect(screen.getByLabelText('AI Assistant')).toBeDefined()
  })
})
