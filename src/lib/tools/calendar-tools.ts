import { getBookingsByDate } from '@/lib/firebase-db'

export interface TimeSlot {
    time: string
    available: boolean
}

const WORK_HOURS = { start: 8, end: 19 } // 8 AM to 7 PM (Matches layout.tsx JSON-LD)

export async function getAvailableSlots(date: Date): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = []
    for (let h = WORK_HOURS.start; h < WORK_HOURS.end; h++) {
        const timeString = `${h.toString().padStart(2, '0')}:00`
        slots.push({ time: timeString, available: true })
    }

    const bookings = await getBookingsByDate(date)
    const activeBookings = bookings.filter(b => b.status !== 'CANCELLED')
    
    const bookedTimes = new Set(activeBookings.map(b => b.slot))
    
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
