'use server'

import { createBooking, getAllBookings } from '@/lib/firebase-db'
import { Timestamp } from 'firebase/firestore'
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
        // Check if slot is already taken
        const allBookings = await getAllBookings()
        const slotTaken = allBookings.some(b => {
            const bDate = b.date instanceof Date ? b.date : b.date?.toDate?.()
            return bDate && bDate.toDateString() === bookingDate.toDateString() && 
                   b.slot === data.slot && 
                   b.status !== 'CANCELLED'
        })

        if (slotTaken) {
            return { success: false, message: 'This slot has already been taken.' }
        }

        await createBooking({
            serviceId: data.serviceId,
            date: Timestamp.fromDate(bookingDate),
            slot: data.slot,
            userId: data.userId || undefined,
            guestName: data.guestName,
            guestEmail: data.guestEmail,
            guestPhone: data.guestPhone,
            status: 'PENDING',
        })

        revalidatePath('/admin')
        return { success: true, message: 'Slot reserved successfully!' }

    } catch (error: any) {
        console.error('Booking error:', error)
        return { success: false, message: 'System error. Please try again.' }
    }
}
