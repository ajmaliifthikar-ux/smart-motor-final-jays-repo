'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
            <div className="rounded-full bg-red-50 p-6">
                <AlertTriangle className="w-12 h-12 text-[#E62329]" />
            </div>

            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold tracking-tight text-[#121212]">
                    Something went wrong!
                </h2>
                <p className="text-gray-500">
                    We couldn't load the dashboard data. This might be a temporary connection issue.
                </p>
            </div>

            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    className="bg-[#121212] hover:bg-black text-white rounded-full px-6"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            </div>
        </div>
    )
}
