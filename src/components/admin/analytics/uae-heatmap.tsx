'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface EmirateData {
    emirate: string
    count: number
}

interface UAEHeatmapProps {
    data: EmirateData[]
}

const emiratePaths: Record<string, string> = {
    // Simplified paths for demonstration
    "Abu Dhabi": "M 50 150 Q 80 180 150 160 Q 180 140 200 120 Q 220 80 180 50 Q 140 20 80 50 Q 30 80 50 150 Z",
    "Dubai": "M 200 120 Q 220 110 240 100 Q 260 90 250 70 Q 240 50 220 60 Q 200 80 200 120 Z",
    "Sharjah": "M 240 100 Q 250 95 260 90 Q 270 85 265 75 Q 255 65 245 75 Q 240 85 240 100 Z",
    "Ajman": "M 250 85 Q 255 82 260 80 Q 265 78 262 72 Q 257 68 252 72 Q 250 78 250 85 Z",
    "Umm Al Quwain": "M 260 80 Q 265 77 270 75 Q 275 73 272 67 Q 267 63 262 67 Q 260 73 260 80 Z",
    "Ras Al Khaimah": "M 270 75 Q 280 70 290 60 Q 300 50 290 40 Q 280 30 270 45 Q 265 60 270 75 Z",
    "Fujairah": "M 265 90 Q 275 85 285 95 Q 295 105 285 115 Q 275 125 265 110 Q 260 100 265 90 Z"
}

export function UAEHeatmap({ data }: UAEHeatmapProps) {
    const maxCount = Math.max(...data.map(d => d.count), 1)

    const getColor = (count: number) => {
        const opacity = Math.max(count / maxCount, 0.1)
        return `rgba(230, 35, 41, ${opacity})` // Smart Red with varying opacity
    }

    return (
        <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-inner overflow-hidden">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#121212] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E62329] animate-pulse" />
                Regional Distribution
            </h3>

            <svg viewBox="0 0 350 200" className="w-full h-full drop-shadow-2xl">
                {Object.entries(emiratePaths).map(([name, path]) => {
                    const emirateInfo = data.find(d => d.emirate === name)
                    const count = emirateInfo?.count || 0

                    return (
                        <motion.path
                            key={name}
                            d={path}
                            fill={getColor(count)}
                            stroke="#ffffff"
                            strokeWidth="2"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.02, strokeWidth: 3, zIndex: 10 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="cursor-pointer transition-colors duration-300"
                        >
                            <title>{`${name}: ${count} Visitors`}</title>
                        </motion.path>
                    )
                })}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                <span>Low Traffic</span>
                <div className="flex-1 mx-4 h-1.5 rounded-full bg-gradient-to-r from-red-50 to-[#E62329]" />
                <span>High Peak</span>
            </div>

            {/* Dynamic Label */}
            <div className="absolute top-6 right-6 text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Primary Market</p>
                <p className="text-xl font-black text-[#121212] tracking-tighter italic">ABU DHABI</p>
            </div>
        </div>
    )
}
