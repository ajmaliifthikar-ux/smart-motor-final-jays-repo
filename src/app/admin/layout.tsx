import Link from "next/link"
import { LayoutDashboard, Users, Settings, LogOut, FileText } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex">
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-[#121212] text-white flex flex-col">
        <div className="p-8">
          <h1 className="text-xl font-black uppercase tracking-widest text-[#E62329]">
            Smart Admin
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/admin/users" icon={Users} label="Users" />
          <NavItem href="/admin/content" icon={FileText} label="Content" />
          <NavItem href="/admin/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group">
            <LogOut className="w-5 h-5 mr-3 text-[#E62329] group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
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
