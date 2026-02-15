'use client'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useRef } from "react"

export function SearchInput({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleSearch = (term: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams)
            if (term) {
                params.set('query', term)
            } else {
                params.delete('query')
            }
            replace(`${pathname}?${params.toString()}`)
        }, 300)
    }

    return (
        <div className="relative flex-1 md:w-64 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                className="pl-9 bg-white"
                placeholder={placeholder}
                defaultValue={searchParams.get('query')?.toString()}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    )
}
