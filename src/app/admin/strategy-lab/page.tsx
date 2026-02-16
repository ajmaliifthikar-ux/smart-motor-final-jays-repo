import { getAdminSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { StrategyLabClient } from "./client"
import { getAllBookings } from "@/lib/firebase-db"

export default async function StrategyLabPage() {
    const session = await getAdminSession()
    if (!session) {
        redirect('/auth')
    }

    // Fetch snapshot of current business data
    const bookings = await getAllBookings()
    
    // Manually aggregate by status
    const statusCount: Record<string, number> = {}
    bookings.forEach(b => {
        const status = b.status || 'UNKNOWN'
        statusCount[status] = (statusCount[status] || 0) + 1
    })
    
    const stats = Object.entries(statusCount).map(([status, count]) => ({
        status,
        _count: count
    }))

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-[#121212] uppercase italic leading-none">
                        Strategy <span className="silver-shine">Lab</span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-500 font-bold uppercase tracking-widest">PhD-Level Business Intelligence Swarm</p>
                </div>
            </div>

            <StrategyLabClient initialStats={stats} />
        </div>
    )
}
