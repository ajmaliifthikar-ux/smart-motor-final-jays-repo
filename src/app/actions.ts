'use server'

import { prisma } from '@/lib/prisma'

export async function getBrandsWithModels() {
    return await prisma.brand.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function getServices() {
    return await prisma.service.findMany({
        where: { isEnabled: true },
        orderBy: { name: 'asc' }
    })
}

export async function getAvailableSlots(dateString: string) {
    const date = new Date(dateString)

    // Get all potential slots (we could also fetch these from a config table)
    const allSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ]

    // Fetch existing bookings for this date
    const bookedSlots = await prisma.booking.findMany({
        where: {
            date: date,
            status: { not: 'CANCELLED' }
        },
        select: { slot: true }
    })

    const bookedSlotTimes = bookedSlots.map(b => b.slot)

    // Filter out booked slots
    return allSlots.filter(slot => !bookedSlotTimes.includes(slot))
}

export async function getFAQs() {
    return await prisma.fAQ.findMany({
        orderBy: { createdAt: 'asc' }
    })
}
