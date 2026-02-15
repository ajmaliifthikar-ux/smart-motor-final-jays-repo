import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/auth'

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
            const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${data.recaptchaToken}`
            const verifyRes = await fetch(verifyUrl, { method: 'POST' })
            const verifyData = await verifyRes.json()

            if (!verifyData.success || (verifyData.score !== undefined && verifyData.score < 0.5)) {
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

            // 2. Identify User via Session
            // We use the authenticated session to link the booking to a user.
            // This prevents unauthorized users from attaching bookings to others' accounts.
            const session = await auth()
            const userId = session?.user?.id || null

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
        console.error('Booking Error:', error)

        if (error.message === 'SLOT_TAKEN') {
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
