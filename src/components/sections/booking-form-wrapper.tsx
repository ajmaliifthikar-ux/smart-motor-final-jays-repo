'use client'

import dynamic from 'next/dynamic'

const BookingFormBase = dynamic(() => import('@/components/sections/booking-form').then((mod) => mod.BookingForm), { ssr: false })

export function BookingFormWrapper() {
    return <BookingFormBase />
}
