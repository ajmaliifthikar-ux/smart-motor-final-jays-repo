'use client'

import { Activity } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface RecentActivityProps {
    bookings: {
        id: string
        user: { name: string | null; email: string | null } | null
        guestName: string | null
        service: { name: string }
        status: string
        date: Date
        slot: string
    }[]
}

export function RecentActivity({ bookings }: RecentActivityProps) {
    if (bookings.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/30">
                <div className="p-4 rounded-full bg-white shadow-sm mb-4">
                    <Activity size={32} className="text-gray-200" />
                </div>
                <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">Awaiting Activity Logs</p>
                <p className="text-[10px] text-gray-300 mt-2 font-medium">New bookings will appear here in real-time.</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => {
                        const customerName = booking.user?.name || booking.guestName || 'Guest'

                        return (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-[#121212]">{customerName}</div>
                                    <div className="text-xs text-gray-500">{booking.user?.email || 'No email'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{booking.service.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                                    <div className="text-xs text-gray-500">{booking.slot}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wide
                    ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
