import { getService, getBookingsByDate } from '@/lib/firebase-db'

export interface TimeSlot {
    time: string
    available: boolean
    bookedCount: number
    maxCapacity: number
}

interface AvailabilityConfig {
    daysOpen: number[]
    startHour: string
    endHour: string
    slotDuration: number
    maxConcurrentBookings: number
}

const DEFAULT_AVAILABILITY: AvailabilityConfig = {
    daysOpen: [1, 2, 3, 4, 5, 6], // Mon-Sat
    startHour: '08:00',
    endHour: '19:00',
    slotDuration: 60,
    maxConcurrentBookings: 2
}

export async function getServiceSlots(serviceId: string, date: Date): Promise<TimeSlot[]> {
    const service = await getService(serviceId)

    if (!service) {
        return []
    }

    // Use specific service config or default
    const config: AvailabilityConfig = (service as any).availability 
        ? (typeof (service as any).availability === 'string' 
            ? JSON.parse((service as any).availability) 
            : (service as any).availability)
        : DEFAULT_AVAILABILITY

    const dayOfWeek = date.getDay()

    // 1. Check if open on this day
    if (!config.daysOpen.includes(dayOfWeek)) {
        return []
    }

    // 2. Generate all possible slots
    const slots: TimeSlot[] = []
    const [startH, startM] = config.startHour.split(':').map(Number)
    const [endH, endM] = config.endHour.split(':').map(Number)

    let currentMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM

    while (currentMinutes + config.slotDuration <= endMinutes) {
        const h = Math.floor(currentMinutes / 60)
        const m = currentMinutes % 60
        const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`

        slots.push({
            time: timeString,
            available: true,
            bookedCount: 0,
            maxCapacity: config.maxConcurrentBookings
        })

        currentMinutes += config.slotDuration
    }

    // 3. Fetch existing bookings for this date from Firestore
    const bookings = await getBookingsByDate(date)
    const activeBookings = bookings.filter(b => b.serviceId === serviceId && b.status !== 'CANCELLED')

    // 4. Calculate availability based on concurrency
    const bookingCounts = activeBookings.reduce((acc: any, booking) => {
        acc[booking.slot] = (acc[booking.slot] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return slots.map(slot => {
        const count = bookingCounts[slot.time] || 0
        return {
            ...slot,
            bookedCount: count,
            available: count < config.maxConcurrentBookings
        }
    })
}
