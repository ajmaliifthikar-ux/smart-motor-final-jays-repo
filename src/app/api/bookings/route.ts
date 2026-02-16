import { NextResponse } from 'next/server'
import { getUserByEmail, createBooking } from '@/lib/firebase-db'
import { getServiceSlots } from '@/lib/booking-utils'
import { z } from 'zod'
import { traceIntegration } from '@/lib/diagnostics'
import { Timestamp } from 'firebase/firestore'

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

        // 2. Proceed with Booking
        let userId: string | null = null

        // Try to link to existing user via Firebase
        const existingUser = await getUserByEmail(data.email)
        if (existingUser) {
            userId = existingUser.id
        }

        const bookingData = await traceIntegration(
            { service: 'Firebase', operation: 'create_booking', metadata: { email: data.email, car: `${data.brand} ${data.model}` } },
            async () => {
                const bookingId = await createBooking({
                    serviceId: data.serviceId,
                    date: Timestamp.fromDate(bookingDate),
                    slot: data.time,
                    userId: userId || undefined,
                    guestName: data.fullName,
                    guestEmail: data.email,
                    guestPhone: data.phone,
                    vehicleBrand: data.brand,
                    vehicleModel: data.model,
                    notes: data.notes,
                    status: 'PENDING',
                })
                return { id: bookingId }
            }
        )

        return NextResponse.json({ success: true, bookingId: bookingData.id })

    } catch (error: any) {
        console.error('Booking Error:', error)
        if (error instanceof z.ZodError) {
             return NextResponse.json({ success: false, error: 'Validation failed', details: error.flatten() }, { status: 400 })
        }
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
