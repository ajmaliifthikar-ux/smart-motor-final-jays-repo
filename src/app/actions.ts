'use server'

import { getAllBrands, getAllServices, getAllBookings, getAllPublishedContent } from '@/lib/firebase-db'
import { traceIntegration } from '@/lib/diagnostics'

export async function getBrandsWithModels() {
    return await traceIntegration(
        { service: 'Firebase', operation: 'fetch_brands' },
        async () => {
            try {
                const brands = await getAllBrands()
                if (!brands || brands.length === 0) return []

                return brands.map(b => {
                    // Normalise logo: priority logoFile > logoUrl
                    const logoFile = b.logoFile || (b.logoUrl || '').replace(/^\/brands-carousel\//, '').replace(/^\/brands\//, '')
                    
                    // Process models: string to array
                    const modelsArray = b.models 
                        ? b.models.split(',').map(m => m.trim()).filter(Boolean)
                        : []

                    return {
                        ...b,
                        logoFile: logoFile || undefined,
                        models: modelsArray
                    }
                })
            } catch (err) {
                console.error("Firebase brands fetch failed:", err)
                return []
            }
        }
    )
}

export async function getServices() {
    return await traceIntegration(
        { service: 'Firebase', operation: 'fetch_services' },
        async () => {
            try {
                const services = await getAllServices()
                return services || []
            } catch (err) {
                console.error("Firebase services fetch failed:", err)
                return []
            }
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
    const allBookings = await getAllBookings()
    const bookedSlots = allBookings
        .filter(b => {
            const bookingDate = b.date instanceof Date ? b.date : b.date?.toDate?.()
            return bookingDate && bookingDate.toDateString() === date.toDateString() && b.status !== 'CANCELLED'
        })
        .map(b => b.slot)

    // Filter out booked slots
    return allSlots.filter(slot => !bookedSlots.includes(slot))
}

export async function getFAQs() {
    return await getAllPublishedContent('FAQ')
}

export async function getContentHistory() {
    // Content history not yet implemented in Firebase
    return { audit: [], snapshots: [] }
}

export async function searchCustomer(query: string) {
    if (!query || query.length < 3) return null

    try {
        const allBookings = await getAllBookings()
        const customers = allBookings
            .filter(b => 
                b.guestEmail?.toLowerCase().includes(query.toLowerCase()) ||
                b.guestPhone?.includes(query) ||
                b.guestName?.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)

        if (customers.length === 0) return null

        return customers.map(c => ({
            name: c.guestName,
            email: c.guestEmail,
            phone: c.guestPhone,
            car: `${c.vehicleBrand} ${c.vehicleModel}`,
            lastService: c.serviceId,
            lastVisit: c.date instanceof Date ? c.date.toISOString() : c.date?.toDate?.().toISOString(),
            status: c.status
        }))
    } catch (error) {
        console.error('searchCustomer Error:', error)
        return null // Fallback silently
    }
}
