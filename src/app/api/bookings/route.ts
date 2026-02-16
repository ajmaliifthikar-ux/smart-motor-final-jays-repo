import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServiceSlots } from '@/lib/booking-utils'
import { z } from 'zod'
import { traceIntegration } from '@/lib/diagnostics'

export const dynamic = 'force-dynamic'

const bookingSchema = z.object({
    serviceId: z.string(),
    date: z.string(), // YYYY-MM-DD
    time: z.string(), // HH:MM
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    brand: z.string().optional(),
    model: z.string().optional(),
    notes: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Basic validation
        const data = bookingSchema.parse(body)
        const bookingDate = new Date(data.date)

        // 1. Check Availability using the NEW logic
        const slots = await getServiceSlots(data.serviceId, bookingDate)
        const selectedSlot = slots.find(s => s.time === data.time)

        if (!selectedSlot) {
             return NextResponse.json({ success: false, error: 'Invalid time slot selected.' }, { status: 400 })
        }

        if (!selectedSlot.available) {
            return NextResponse.json({
                success: false,
                error: 'Slot fully booked.',
                message: 'This time slot has reached maximum capacity. Please choose another time.'
            }, { status: 409 })
        }

        // 2. Proceed with Booking (Optimistic Locking not strictly needed due to high capacity, but good practice)
        // We'll trust the check above for now, or we could double-check inside a transaction count.

        let userId: string | null = null

        // Try to link to existing user
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
        if (existingUser) {
            userId = existingUser.id
        }

        const booking = await traceIntegration(
            { service: 'Prisma', operation: 'create_booking', metadata: { email: data.email, car: `${data.brand} ${data.model}` } },
            () => prisma.booking.create({
                data: {
                    serviceId: data.serviceId,
                    date: bookingDate,
                    slot: data.time,
                    userId: userId,
                    guestName: data.fullName,
                    guestEmail: data.email,
                    guestPhone: data.phone,
                    vehicleBrand: data.brand,
                    vehicleModel: data.model,
                    notes: data.notes,
                    status: 'PENDING'
                }
            })
        )

        return NextResponse.json({ success: true, bookingId: booking.id })

    } catch (error: any) {
        console.error('Booking Error:', error)
        if (error instanceof z.ZodError) {
             return NextResponse.json({ success: false, error: 'Validation failed', details: error.flatten() }, { status: 400 })
        }
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
