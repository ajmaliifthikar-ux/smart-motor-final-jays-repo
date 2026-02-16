import Link from "next/link"
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/session'
import { LayoutDashboard, Users, Settings, LogOut, FileText, Calendar, Zap, Activity } from "lucide-react"
import { SignOutButton } from './sign-out-button'

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
    <div className="min-h-screen bg-[#FAFAF9] flex">
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-[#121212] text-white flex flex-col carbon-fiber border-r border-white/5">
        <div className="p-8">
          <h1 className="text-xl font-black uppercase tracking-widest text-[#E62329] italic">
            Smart <span className="text-white">Admin</span>
          </h1>
          <p className="text-[8px] font-bold text-gray-500 uppercase mt-1 tracking-[0.2em]">High Performance Ops</p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <div className="px-4 py-4">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Intelligence</span>
          </div>
          <NavItem href="/admin/strategy-lab" icon={Zap} label="Strategy Lab" />
          <NavItem href="/admin/diagnostics" icon={Activity} label="Diagnostics" />
          
          <div className="px-4 py-4">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">Management</span>
          </div>
          <NavItem href="/admin/service-config" icon={Calendar} label="Booking Config" />
          <NavItem href="/admin/users" icon={Users} label="Users" />
          <NavItem href="/admin/content" icon={FileText} label="Content" />
          <NavItem href="/admin/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen relative">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E62329]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}

function NavItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
    >
      <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
      {label}
    </Link>
  )
}
