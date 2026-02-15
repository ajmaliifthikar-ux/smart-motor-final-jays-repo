'use client'

import Link from 'next/link'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'

export default function NotFound() {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-9xl font-black text-[#E62329] mb-4">404</h1>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-6">Page Not Found</h2>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>
                    <Link
                        href="/new-home"
                        className="bg-[#121212] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#E62329] transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    )
}
