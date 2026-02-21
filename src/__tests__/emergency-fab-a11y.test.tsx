import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { EmergencyFAB } from '../components/ui/emergency-fab'
import { vi, describe, it, expect, afterEach } from 'vitest'

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Phone: () => <div data-testid="icon-phone" />,
  MessageCircle: () => <div data-testid="icon-message-circle" />,
  Sparkles: () => <div data-testid="icon-sparkles" />,
  X: () => <div data-testid="icon-x" />,
  MessageSquare: () => <div data-testid="icon-message-square" />,
  Truck: () => <div data-testid="icon-truck" />,
  Navigation: () => <div data-testid="icon-navigation" />,
  MapPin: () => <div data-testid="icon-map-pin" />,
  Clock: () => <div data-testid="icon-clock" />,
  Bot: () => <div data-testid="icon-bot" />,
  Send: () => <div data-testid="icon-send" />,
  Loader2: () => <div data-testid="icon-loader2" />,
  Headphones: () => <div data-testid="icon-headphones" />,
  Volume2: () => <div data-testid="icon-volume2" />,
  Mic: () => <div data-testid="icon-mic" />,
  Check: () => <div data-testid="icon-check" />,
  ChevronRight: () => <div data-testid="icon-chevron-right" />,
}))

afterEach(() => {
  cleanup()
})

describe('EmergencyFAB Accessibility', () => {
  it('renders FAB buttons with correct aria-labels', () => {
    render(<EmergencyFAB />)

    const whatsappButtons = screen.getAllByRole('button', { name: /whatsapp/i })
    expect(whatsappButtons.length).toBeGreaterThan(0)

    const callButtons = screen.getAllByRole('button', { name: /call us/i })
    expect(callButtons.length).toBeGreaterThan(0)

    const aiButtons = screen.getAllByRole('button', { name: /ai assistant/i })
    expect(aiButtons.length).toBeGreaterThan(0)
  })

  it('opens chat and verifies close button accessibility', async () => {
    render(<EmergencyFAB />)

    const aiButtons = screen.getAllByRole('button', { name: /ai assistant/i })
    const aiButton = aiButtons[0]
    fireEvent.click(aiButton)

    // Wait for chat panel to appear and find the close button
    const closeChatButton = await screen.findByRole('button', { name: /close chat/i })
    expect(closeChatButton).toBeTruthy()

    // Also check for other accessible elements in the chat panel
    const voiceButton = screen.getByRole('button', { name: /start voice mode/i })
    expect(voiceButton).toBeTruthy()

    const sendButton = screen.getByRole('button', { name: /send message/i })
    expect(sendButton).toBeTruthy()

    const chatInput = screen.getByRole('textbox', { name: /chat input/i })
    expect(chatInput).toBeTruthy()
  })
})
