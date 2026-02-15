'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema for input validation
const bookingSchema = z.object({
    serviceId: z.string(),
    date: z.string(), // ISO string
    slot: z.string(), // "09:00"
    userId: z.string().optional(),
    guestName: z.string().optional(),
    guestEmail: z.string().email().optional(),
    guestPhone: z.string().optional(),
})

export type BookingState = {
    message: string
    success: boolean
}

export async function bookSlot(prevState: BookingState, formData: FormData): Promise<BookingState> {
    const rawData = {
        serviceId: formData.get('serviceId'),
        date: formData.get('date'),
        slot: formData.get('slot'),
        userId: formData.get('userId'),
        guestName: formData.get('guestName'),
        guestEmail: formData.get('guestEmail'),
        guestPhone: formData.get('guestPhone'),
    }

    const result = bookingSchema.safeParse(rawData)

    if (!result.success) {
        return { success: false, message: 'Invalid data provided' }
    }

    const data = result.data
    const bookingDate = new Date(data.date)

    try {
        // 🔒 TRANSACTION: Robust Race Condition Handling
        // logic: We rely on the @@unique([date, slot]) constraint in the DB.
        // If a booking exists, create() will throw a P2002 error.

        await prisma.booking.create({
            data: {
                serviceId: data.serviceId,
                date: bookingDate,
                slot: data.slot,
                userId: data.userId || null,
                guestName: data.guestName,
                guestEmail: data.guestEmail,
                guestPhone: data.guestPhone,
                status: 'LOCKED', // Initial status is LOCKED until confirmed? Or PENDING based on MVP. 
                // Using LOCKED as per recent schema update to signify it's held.
            }
        })

        revalidatePath('/admin')
        return { success: true, message: 'Slot reserved successfully!' }

    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, message: 'This slot has already been taken.' }
        }
        console.error('Booking error:', error)
        return { success: false, message: 'System error. Please try again.' }
    }
}
