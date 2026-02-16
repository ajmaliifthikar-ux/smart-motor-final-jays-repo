'use client'

import { auth } from '@/lib/firebase-client'
import { removeSessionCookie } from '@/app/actions/firebase-auth'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
    const router = useRouter()

    const handleSignOut = async () => {
        await auth.signOut()
        await removeSessionCookie()
        router.push('/auth')
        router.refresh()
    }

    return (
        <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
        >
            <LogOut className="w-5 h-5 mr-3 text-[#E62329] group-hover:scale-110 transition-transform" />
            Sign Out
        </button>
    )
}
