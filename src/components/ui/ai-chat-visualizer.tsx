'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AIChatVisualizerProps {
  isSpeaking: boolean // AI is speaking
  isListening: boolean // User is speaking/active
  className?: string
}

export function AIChatVisualizer({ isSpeaking, isListening, className }: AIChatVisualizerProps) {
  // We use different colors: Red (#E62329) for AI, White (#FFFFFF) for User
  const color = isSpeaking ? "#E62329" : "#FFFFFF"
  const barCount = 16

  return (
    <div className={cn("flex items-center gap-1.5 h-12 px-4", className)}>
      {[...Array(barCount)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: (isSpeaking || isListening) 
                ? [8, Math.random() * 40 + 10, 8] 
                : [4, Math.random() * 8 + 2, 4],
            backgroundColor: color
          }}
          transition={{
            repeat: Infinity,
            duration: 0.4,
            delay: i * 0.04,
            ease: "easeInOut"
          }}
          className="w-1.5 rounded-full shadow-lg"
          style={{ 
            opacity: (isSpeaking || isListening) ? 1 : 0.2,
            boxShadow: (isSpeaking || isListening) ? `0 0 10px ${color}40` : 'none'
          }}
        />
      ))}
    </div>
  )
}
