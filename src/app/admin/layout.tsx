import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/session'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { MobileBottomNav } from '@/components/admin/mobile-bottom-nav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()

  if (!session) {
    redirect('/auth?error=UNAUTHORIZED')
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content — desktop offset by sidebar, mobile with top & bottom spacing */}
      <main className="md:ml-[252px] pt-[64px] md:pt-0 pb-[68px] md:pb-0 p-4 md:p-8 min-h-screen relative">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E62329]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
