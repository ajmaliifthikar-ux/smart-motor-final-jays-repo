'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsProps {
    tabs: {
        id: string
        label: string
        content: React.ReactNode
    }[]
    defaultTab?: string
    className?: string
}

export function Tabs({ tabs, defaultTab, className }: TabsProps) {
    const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].id)

    return (
        <div className={cn("w-full space-y-6", className)}>
            <div className="flex space-x-1 rounded-xl bg-gray-100/50 p-1 backdrop-blur-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "relative flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2",
                            activeTab === tab.id
                                ? "text-[#121212]"
                                : "text-gray-500 hover:text-gray-900"
                        )}
                        style={{
                            WebkitTapHighlightColor: "transparent",
                        }}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="active-pill"
                                className="absolute inset-0 bg-white shadow-sm rounded-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="relative">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={cn(
                            "transition-all duration-300 ease-in-out",
                            activeTab === tab.id ? "opacity-100 relative" : "opacity-0 absolute top-0 left-0 w-full pointer-events-none h-0 overflow-hidden"
                        )}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    )
}
