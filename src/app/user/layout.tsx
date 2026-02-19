import { redirect } from 'next/navigation'
import { getUserSession } from '@/lib/user-session'
import { UserSidebar } from '@/components/user/user-sidebar'

export const dynamic = 'force-dynamic'

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getUserSession()

  if (!session) {
    redirect('/user/login')
  }

  const displayName = session.name ?? session.email?.split('@')[0] ?? 'User'
  const email = session.email ?? null

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Sidebar */}
      <UserSidebar displayName={displayName} email={email} />

      {/* Main content — offset by sidebar width on md+ */}
      <main className="md:ml-64 pt-16 md:pt-0 min-h-screen relative">
        {/* Ambient red glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E62329]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
