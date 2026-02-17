import { getAllUsers, getAllBookings } from '@/lib/firebase-db'
import { RecentActivity } from '@/components/admin/recent-activity'
import { formatPrice } from '@/lib/utils'
import { getHeatmapData, getTrafficTrends } from '@/lib/analytics'
import { UAEHeatmap } from '@/components/admin/analytics/uae-heatmap'
import { GoogleBusinessWidget } from '@/components/admin/analytics/google-business-widget'

export default async function AdminDashboard() {
    // 1. Fetch Stats in parallel
    let userCount = 0
    let activeBookingsCount = 0
    let revenueRaw: any[] = []
    let recentBookings: any[] = []
    let heatmapData: any[] = []
    let trafficTrends: any[] = []

    try {
        const [allUsers, allBookings, hmd, tt] = await Promise.all([
            getAllUsers(),
            getAllBookings(),
            getHeatmapData(),
            getTrafficTrends()
        ])
        
        // Count customers only
        userCount = allUsers.filter(u => u.role === 'CUSTOMER').length
        
        // Count active bookings
        activeBookingsCount = allBookings.filter(b => 
            ['PENDING', 'CONFIRMED', 'LOCKED'].includes(b.status)
        ).length
        
        // Calculate revenue from completed bookings
        revenueRaw = allBookings.filter(b => b.status === 'COMPLETED')
        
        // Get recent 5 bookings
        recentBookings = allBookings
            .sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime())
            .slice(0, 5)
        
        heatmapData = hmd
        trafficTrends = tt
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
    }

    // Calculate generic revenue
    const totalRevenue = revenueRaw.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#121212]">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500">Overview of your platform's performance.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Users"
                    value={userCount.toLocaleString()}
                    trend="+12%"
                    trendUp
                />
                <StatCard
                    label="Active Bookings"
                    value={activeBookingsCount.toLocaleString()}
                    trend="+5%"
                    trendUp
                />
                <StatCard
                    label="Revenue (Est.)"
                    value={formatPrice(totalRevenue)}
                    trend="+23%"
                    trendUp
                />
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic chart + heatmap — take 2 cols */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-xl p-8 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#121212] mb-4">Traffic Projection</h2>
                        <div className="h-64 flex items-end gap-3 px-4 pb-8">
                            {trafficTrends.map((trend) => (
                                <div key={trend.date} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-[#121212] rounded-t-lg transition-all duration-500 group-hover:bg-[#E62329]"
                                        style={{ height: `${(trend.count / Math.max(...trafficTrends.map((t: { count: number }) => t.count), 1)) * 100}%` }}
                                    />
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{trend.date.split('-')[2]}</span>
                                </div>
                            ))}
                            {trafficTrends.length === 0 && (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium italic text-sm">
                                    Initializing Tracking Data...
                                </div>
                            )}
                        </div>
                    </div>
                    <UAEHeatmap data={heatmapData} />
                </div>

                {/* Google Business Widget — right column */}
                <div className="lg:col-span-1">
                    <GoogleBusinessWidget />
                </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-xl p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-[#121212] mb-4">Recent Activity</h2>
                <RecentActivity bookings={recentBookings} />
            </div>
        </div>
    )
}

function StatCard({ label, value, trend, trendUp }: { label: string; value: string; trend: string; trendUp?: boolean }) {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <div className="mt-2 flex items-baseline justify-between">
                <p className="text-3xl font-bold tracking-tight text-[#121212]">{value}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                    }`}>
                    {trend}
                </span>
            </div>
        </div>
    )
}
