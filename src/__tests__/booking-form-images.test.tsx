import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BookingForm } from '@/components/sections/booking-form'
import { getBrandsWithModels, getServices } from '@/app/actions'
import React from 'react'

vi.mock('@/app/actions', () => ({
  getBrandsWithModels: vi.fn(),
  getServices: vi.fn(),
  getAvailableSlots: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

describe('BookingForm Images', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should use google-logo.svg as fallback when brand logo fails to load', async () => {
    const mockBrands = [
      { id: '1', name: 'Ferrari', logoFile: 'ferrari.png', models: ['F8'] }
    ]
    vi.mocked(getBrandsWithModels).mockResolvedValue(mockBrands)
    vi.mocked(getServices).mockResolvedValue([])

    render(<BookingForm />)

    // Wait for data to load and step to be visible
    await screen.findByText(/Phase 1: Details/i)

    // Fill step 1 fields
    const nameInput = screen.getByLabelText(/Owner Name/i)
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    const emailInput = screen.getByLabelText(/Secure Email/i)
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    const phoneInput = screen.getByLabelText(/Phone Contact/i)
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })

    const advanceBtn = screen.getByText(/Advance/i)
    fireEvent.click(advanceBtn)

    // Now in Step 2, find the brand image
    const img = await screen.findByAltText('Ferrari') as HTMLImageElement
    
    // Simulate error
    fireEvent.error(img)

    // Check if fallback is correct
    expect(img.src).toContain('/google-logo.svg')
  })
})
