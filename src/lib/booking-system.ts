// Service Booking Configuration
export interface ServiceSlotConfig {
  serviceId: string
  daysOfWeek: number[] // 0-6 (Sun-Sat)
  slotsPerDay: number // e.g., 8 (9 AM - 5 PM with 1-hour slots)
  slotDuration: number // minutes, e.g., 60
  startTime: string // "09:00" 
  endTime: string // "17:00"
  capacity: number // bookings per slot, e.g., 1
  maxAdvanceBooking: number // days in advance
}

export interface TimeSlot {
  id: string
  serviceId: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  available: number // remaining slots
  capacity: number
}

export interface Booking {
  id: string
  serviceId: string
  userId: string
  slotId: string
  date: string
  time: string
  status: 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: Date
}

// Helper to generate available slots for a service
export function generateSlotsForDate(
  config: ServiceSlotConfig,
  date: Date
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const dayOfWeek = date.getDay()

  // Check if service operates on this day
  if (!config.daysOfWeek.includes(dayOfWeek)) {
    return slots
  }

  const [startHour, startMin] = config.startTime.split(':').map(Number)
  const [endHour, endMin] = config.endTime.split(':').map(Number)

  let currentTime = new Date()
  currentTime.setHours(startHour, startMin, 0, 0)

  const endTime = new Date()
  endTime.setHours(endHour, endMin, 0, 0)

  const dateStr = date.toISOString().split('T')[0]
  let slotIndex = 0

  while (currentTime < endTime) {
    const timeStr = currentTime.toTimeString().slice(0, 5)

    slots.push({
      id: `${config.serviceId}-${dateStr}-${slotIndex}`,
      serviceId: config.serviceId,
      date: dateStr,
      time: timeStr,
      available: config.capacity,
      capacity: config.capacity,
    })

    currentTime.setMinutes(currentTime.getMinutes() + config.slotDuration)
    slotIndex++
  }

  return slots
}

// Generate slots for multiple days
export function generateSlotsForRange(
  config: ServiceSlotConfig,
  startDate: Date,
  daysCount: number
): TimeSlot[] {
  const allSlots: TimeSlot[] = []

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    allSlots.push(...generateSlotsForDate(config, date))
  }

  return allSlots
}
