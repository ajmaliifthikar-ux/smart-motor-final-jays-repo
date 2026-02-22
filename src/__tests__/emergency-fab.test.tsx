
import { render, screen, cleanup } from '@testing-library/react'
import { EmergencyFAB } from '../components/ui/emergency-fab'
import { describe, it, expect, vi, afterEach } from 'vitest'
import React from 'react'

// Mock dependencies
vi.mock('../components/ui/ai-chat-panel', () => ({
  AIChatPanel: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="ai-chat-panel">Chat Panel</div> : null
}))

vi.mock('../components/ui/tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode, content: string }) => <div><div data-testid={`tooltip-${content}`}>{content}</div>{children}</div>
}))

// Mock fetch
global.fetch = vi.fn()
global.window.open = vi.fn()

afterEach(() => {
  cleanup()
})

describe('EmergencyFAB Accessibility', () => {
  it('renders buttons with accessible labels', () => {
    render(<EmergencyFAB />)

    const whatsapp = screen.getAllByRole('button', { name: 'WhatsApp' })
    expect(whatsapp.length).toBe(1)

    const call = screen.getAllByRole('button', { name: 'Call Us' })
    expect(call.length).toBe(1)

    const ai = screen.getAllByRole('button', { name: 'AI Assistant' })
    expect(ai.length).toBe(1)
  })

  it('buttons have type="button"', () => {
    render(<EmergencyFAB />)

    const whatsapp = screen.getAllByRole('button', { name: 'WhatsApp' })
    expect(whatsapp.length).toBe(1)
    expect(whatsapp[0].getAttribute('type')).toBe('button')

    const call = screen.getAllByRole('button', { name: 'Call Us' })
    expect(call.length).toBe(1)
    expect(call[0].getAttribute('type')).toBe('button')

    const ai = screen.getAllByRole('button', { name: 'AI Assistant' })
    expect(ai.length).toBe(1)
    expect(ai[0].getAttribute('type')).toBe('button')
  })
})
