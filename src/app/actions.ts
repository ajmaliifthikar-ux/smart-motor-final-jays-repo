'use server'

import { prisma } from '@/lib/prisma'
import { traceIntegration } from '@/lib/diagnostics'

export async function getBrandsWithModels() {
    return await traceIntegration(
        { service: 'Prisma', operation: 'fetch_brands' },
        async () => {
            const brands = await prisma.brand.findMany({
                orderBy: { name: 'asc' }
            })
            return brands.map(b => ({
                ...b,
                models: b.models ? b.models.split(',') : []
            }))
        }
    )
}

export async function getServices() {
    return await traceIntegration(
        { service: 'Prisma', operation: 'fetch_services' },
        async () => {
            return await prisma.service.findMany({
                where: { isEnabled: true },
                orderBy: { name: 'asc' }
            })
        }
    )
}

export async function getAvailableSlots(dateString: string) {
    const date = new Date(dateString)

    // Get all potential slots
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

export async function getContentHistory() {
    const [audit, snapshots] = await Promise.all([
        prisma.contentAudit.findMany({
            orderBy: { timestamp: 'desc' },
            take: 50
        }),
        prisma.contentHistory.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        })
    ])
    return { audit, snapshots }
}

export async function searchCustomer(query: string) {
    if (!query || query.length < 3) return null

    try {
        const customers = await prisma.booking.findMany({
            where: {
                OR: [
                    { guestEmail: { contains: query } },
                    { guestPhone: { contains: query } },
                    { guestName: { contains: query } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: { service: true },
            take: 5
        })

        if (customers.length === 0) return null

        return customers.map(c => ({
            name: c.guestName,
            email: c.guestEmail,
            phone: c.guestPhone,
            car: `${c.vehicleBrand} ${c.vehicleModel}`,
            lastService: c.service.name,
            lastVisit: c.date.toISOString(),
            status: c.status
        }))
    } catch (error) {
        console.error('searchCustomer Error:', error)
        return null // Fallback silently
    }
}
