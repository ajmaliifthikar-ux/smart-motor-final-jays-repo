import { prisma } from '@/lib/prisma'
import { Service, Booking } from '@prisma/client'

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

export async function getServiceSlots(serviceId: string, date: Date): Promise<TimeSlot[]> {
    const service = await prisma.service.findUnique({
        where: { id: serviceId },
    })

    if (!service || !(service as any).availability) {
        return []
    }

    const config: AvailabilityConfig = JSON.parse((service as any).availability as string)
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

    // 3. Fetch existing bookings for this service and date
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const bookings = await prisma.booking.findMany({
        where: {
            serviceId: serviceId,
            date: {
                gte: startOfDay,
                lte: endOfDay
            },
            status: { not: 'CANCELLED' }
        },
        select: { slot: true }
    })

    // 4. Calculate availability based on concurrency
    const bookingCounts = bookings.reduce((acc: any, booking) => {
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
