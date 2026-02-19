import { getAllUsers, getAllBookings } from '@/lib/firebase-db'
import { RecentActivity } from '@/components/admin/recent-activity'
import { formatPrice } from '@/lib/utils'
import { getHeatmapData, getTrafficTrends } from '@/lib/analytics'
import { UAEHeatmap } from '@/components/admin/analytics/uae-heatmap'
import { GoogleBusinessWidget } from '@/components/admin/analytics/google-business-widget'
import { DashboardWidget } from '@/components/admin/dashboard/dashboard-widget'
import { StatCard } from '@/components/admin/dashboard/stat-card'

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
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[#121212] uppercase italic">
                        Command <span className="text-[#E62329]">Center</span>
                    </h1>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                        Real-time Platform Intelligence
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Total Users"
                    value={userCount.toLocaleString()}
                    trend="+12%"
                    trendUp
                    delay={0.1}
                />
                <StatCard
                    label="Active Bookings"
                    value={activeBookingsCount.toLocaleString()}
                    trend="+5%"
                    trendUp
                    delay={0.2}
                />
                <StatCard
                    label="Revenue (Est.)"
                    value={formatPrice(totalRevenue)}
                    trend="+23%"
                    trendUp
                    delay={0.3}
                />
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Traffic chart — take 8 cols */}
                <div className="lg:col-span-8 space-y-8">
                    <DashboardWidget 
                        title="Traffic Projection" 
                        subtitle="User Engagement Trends"
                        delay={0.4}
                    >
                        <div className="h-64 flex items-end gap-3 px-4 pb-4">
                            {trafficTrends.map((trend, i) => (
                                <div key={trend.date} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-[#121212] rounded-t-xl transition-all duration-700 group-hover:bg-[#E62329] group-hover:scale-y-[1.02] origin-bottom shadow-sm"
                                        style={{ 
                                            height: `${(trend.count / Math.max(...trafficTrends.map((t: { count: number }) => t.count), 1)) * 100}%`,
                                            transitionDelay: `${i * 50}ms`
                                        }}
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
                    </DashboardWidget>

                    <DashboardWidget 
                        title="Live Operations" 
                        subtitle="Geographic Distribution"
                        delay={0.5}
                        className="p-0"
                    >
                        <UAEHeatmap data={heatmapData} />
                    </DashboardWidget>
                </div>

                {/* Google Business Widget — 4 columns */}
                <div className="lg:col-span-4">
                    <GoogleBusinessWidget />
                </div>
            </div>

            <DashboardWidget 
                title="Recent Activity" 
                subtitle="Latest platform transitions"
                delay={0.6}
            >
                <RecentActivity bookings={recentBookings} />
            </DashboardWidget>
        </div>
    )
}
