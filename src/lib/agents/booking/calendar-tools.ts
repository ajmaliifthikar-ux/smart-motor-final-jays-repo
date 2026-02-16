import { getServiceSlots } from '@/lib/booking-utils'

export const calendarTools = {
    checkAvailability: async (serviceId: string, dateString: string) => {
        try {
            const date = new Date(dateString)
            if (isNaN(date.getTime())) {
                return { error: "Invalid date format. Please use YYYY-MM-DD." }
            }

            const slots = await getServiceSlots(serviceId, date)
            const available = slots.filter(s => s.available).map(s => s.time)

            if (available.length === 0) {
                return { message: "No slots available for this service on this date." }
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
