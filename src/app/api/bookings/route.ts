import { verifyRecaptcha } from '@/lib/recaptcha'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Validation Schema
const bookingSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    serviceId: z.string(),
    date: z.string(), // YYYY-MM-DD
    time: z.string(), // HH:MM
    brand: z.string().optional(),
    model: z.string().optional(),
    notes: z.string().optional(),
    recaptchaToken: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const data = bookingSchema.parse(body)

        // Verify reCAPTCHA
        const secretKey = process.env.RECAPTCHA_SECRET_KEY
        if (secretKey) {
            if (!data.recaptchaToken) {
                return NextResponse.json({ success: false, error: 'reCAPTCHA token required' }, { status: 400 })
            }

            const verification = await verifyRecaptcha(data.recaptchaToken)

            if (!verification.success || (verification.score !== undefined && verification.score < 0.5)) {
                return NextResponse.json({ success: false, error: 'reCAPTCHA verification failed' }, { status: 400 })
            }
        }

        // ISO Date Object for the booking day
        const bookingDate = new Date(data.date)

        // TRANSACTION: Check Availability -> Book
        const result = await prisma.$transaction(async (tx) => {
            // 1. Check if slot is taken (Race Condition Check)
            const existing = await tx.booking.findFirst({
                where: {
                    date: bookingDate,
                    slot: data.time,
                    status: { not: 'CANCELLED' }
                }
            })

            if (existing) {
                throw new Error('SLOT_TAKEN')
            }

            // 2. Find or Create User (Mock Guest Strategy for MVP)
            // In a real app, we might check session.user first
            let userId = null

            // Check if user exists by email, if so, attach them
            const user = await tx.user.findUnique({ where: { email: data.email } })
            if (user) {
                userId = user.id
            }

            // 3. Create Booking
            const booking = await tx.booking.create({
                data: {
                    date: bookingDate,
                    slot: data.time,
                    serviceId: data.serviceId,
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

            return booking
        })

        return NextResponse.json({ success: true, bookingId: result.id })

    } catch (error: any) {
        // Log safe error message
        if (error instanceof Error) {
            console.error('Booking Error:', error.message)
        } else {
            console.error('Booking Error: Unknown error occurred')
        }

        if (error?.message === 'SLOT_TAKEN') {
            return NextResponse.json({
                success: false,
                error: 'Slot already taken',
                // In a real app, we would return nextAvailableSlots here
                message: 'This slot was just booked by another user. Please select another time.'
            }, { status: 409 })
        }

        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: 'Validation failed', details: (error as any).errors }, { status: 400 })
        }

        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
    }
}
