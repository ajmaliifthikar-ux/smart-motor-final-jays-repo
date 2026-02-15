import { prisma } from '@/lib/prisma'

export interface TimeSlot {
    time: string
    available: boolean
}

// Helper to get available slots (Mock logic + Real DB check)
// Real implementation would check work hours, breaks, and existing bookings
const WORK_HOURS = { start: 9, end: 18 } // 9 AM to 6 PM

export async function getAvailableSlots(date: Date): Promise<TimeSlot[]> {
    // 1. Generate all possible slots for the day
    const slots: TimeSlot[] = []
    for (let h = WORK_HOURS.start; h < WORK_HOURS.end; h++) {
        // Hourly slots for simplicity
        const timeString = `${h.toString().padStart(2, '0')}:00`
        slots.push({ time: timeString, available: true })
    }

    // 2. Fetch existing bookings for this date
    // We need to define start and end of the day for the query
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const bookings = await prisma.booking.findMany({
        where: {
            date: {
                gte: startOfDay,
                lte: endOfDay
            },
            status: { not: 'CANCELLED' }
        },
        select: { slot: true }
    })

    // 3. Mark taken slots as unavailable
    const bookedTimes = new Set(bookings.map(b => b.slot))
    
    return slots.map(s => ({
        ...s,
        available: !bookedTimes.has(s.time)
    }))
}

// Tool Definition for Agent
export const calendarTools = {
    checkAvailability: async (dateString: string) => {
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) {
                return { error: "Invalid date format. Please use YYYY-MM-DD." }
            }
            
            const slots = await getAvailableSlots(date)
            const available = slots.filter(s => s.available).map(s => s.time)
            
            if (available.length === 0) {
                return { message: "No slots available for this date." }
            }
            
            return { 
                date: dateString,
                availableSlots: available 
            }
        } catch (error) {
            console.error("Calendar Tool Error:", error)
            return { error: "Failed to check availability." }
        }
    }
}
