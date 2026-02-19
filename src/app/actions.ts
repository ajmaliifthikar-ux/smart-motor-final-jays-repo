'use server'

import { getAllBrands, getAllServices, getAllBookings, getAllPublishedContent } from '@/lib/firebase-db'
import { traceIntegration } from '@/lib/diagnostics'

export async function getBrandsWithModels() {
    return await traceIntegration(
        { service: 'Firebase', operation: 'fetch_brands' },
        async () => {
            try {
                const brands = await getAllBrands()
                // If Firebase has brands, use them
                if (brands && brands.length > 0) {
                    return brands.map(b => {
                        // Map brand name to logo file if logoUrl not provided
                        // Normalise logoUrl: strip any leading /brands-carousel/ so we always
                        // store just the bare filename, then re-prefix below
                        const rawLogo = (b.logoUrl || '').replace(/^\/brands-carousel\//, '').replace(/^\/brands\//, '')
                        let logoFile = rawLogo || undefined

                        if (!logoFile) {
                            const nameToFile: Record<string, string> = {
                                'Mercedes-Benz': 'mercedes-logo.png',
                                'BMW': 'bmw-logo.png',
                                'Audi': 'audi-logo-150x150-1.png',
                                'Porsche': 'porsche-logo.png',
                                'Range Rover': 'range-rover-logo.png',
                                'Land Rover': 'land-rover-logo.png',
                                'Bentley': 'bentley-logo-150x150-1.png',
                                'Lamborghini': 'lamborghini-logo.png',
                                'Bugatti': 'Bugatti-logo.png',
                                'Rolls-Royce': 'rolls-royce-logo.png',
                                'Ferrari': 'ferrari-logo.png',
                                'Alfa Romeo': 'alfa-romeo-logo.png',
                                'Aston Martin': 'aston-martin-logo.png',
                                'Maserati': 'maserati-logo.png',
                                'McLaren': 'mclaren-logo.png',
                                'Lotus': 'lotus-logo.png',
                                'Cadillac': 'cadillac.png',
                                'Chevrolet': 'chevrolet.png',
                                'Chrysler': 'chrysler-logo.png',
                                'Dodge': 'dodge-logo.png',
                                'Ford': 'ford-logo.png',
                                'Genesis': 'genesis-logo.png',
                                'GMC': 'gmc-logo.png',
                                'Hummer': 'hummer-logo.png',
                                'Lincoln': 'lincoln-logo.png',
                                'Jeep': 'jeeplogo.png',
                                'Toyota': 'toyota-logo.png',
                                'Lexus': 'lexus-logo.png',
                                'Nissan': 'nissan-logo.png',
                                'Honda': 'honda.png',
                                'Infiniti': 'infiniti-logo.png',
                                'Mitsubishi': 'mitsubishi-logo.png',
                                'Mazda': 'mazda-logo.png',
                                'Hyundai': 'hyundai-logo.png',
                                'Kia': 'kia-logo.png',
                                'Tesla': 'tesla-logo.png',
                                'Volkswagen': 'volkswagen-logo.png',
                                'Peugeot': 'peugeot-logo.png',
                                'Renault': 'renault-logo.png',
                                'Fiat': 'fiat-logo.png',
                                'Mini': 'mini-cooper-logo.png',
                                'MINI': 'mini-cooper-logo.png',
                                'Volvo': 'volvo-logo.png',
                                'Jaguar': 'jaguar-logo.png',
                                'MG': 'mg-logo.png',
                                'SEAT': 'seat-logo.png',
                                'Skoda': 'skuda-logo.png',
                                'Brabus': 'brabus-logo.png',
                                'Camaro': 'camaro-logo.png',
                                'Mustang': 'mustang-logo.png',
                                'Corvette': 'corvette-logopng.png',
                            }
                            logoFile = nameToFile[b.name]
                        }
                        // Ensure slug is always set — fall back to name-derived slug
                        const slug = b.slug || b.id || b.name.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '')
                        return {
                            ...b,
                            slug,
                            logoFile,
                            models: []
                        }
                    })
                }
            } catch (err) {
                console.warn("Firebase brands fetch failed, using local data:", err)
            }

            // Fallback to local v2-data brands
            const { brandCategories } = await import('@/lib/v2-data')
            const allBrands: any[] = []

            brandCategories.forEach(category => {
                category.brands.forEach((brand: any) => {
                    // Fix v2-data logos: they use /brands/ path which doesn't exist;
                    // remap to /brands-carousel/ bare filename
                    const rawLogo = (brand.logo || '').replace(/^\/brands\//, '').replace(/^\/brands-carousel\//, '')
                    allBrands.push({
                        id: brand.id,
                        name: brand.name,
                        logoFile: rawLogo || undefined,
                        description: brand.description,
                        models: brand.models || []
                    })
                })
            })

            return allBrands
        }
    )
}

export async function getServices() {
    return await traceIntegration(
        { service: 'Firebase', operation: 'fetch_services' },
        async () => {
            try {
                const services = await getAllServices()
                if (services && services.length > 0) {
                    return services
                }
            } catch (err) {
                console.warn("Firebase services fetch failed, using local data:", err)
            }

            // Fallback to local v2-data services
            const { brandCategories } = await import('@/lib/v2-data')
            const allServices: any[] = []

            brandCategories.forEach(category => {
                category.brands.forEach((brand: any) => {
                    if (brand.services) {
                        brand.services.forEach((service: string) => {
                            if (!allServices.find(s => s.name === service)) {
                                allServices.push({
                                    id: service.toLowerCase().replace(/\s+/g, '-'),
                                    name: service,
                                    category: category.id
                                })
                            }
                        })
                    }
                })
            })

            return allServices
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
