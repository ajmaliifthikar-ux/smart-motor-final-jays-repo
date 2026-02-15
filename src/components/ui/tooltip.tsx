'use client'

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  delay?: number
}

export function Tooltip({ content, children, position = 'top', className, delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [actualPosition, setActualPosition] = useState(position)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Auto-position to avoid going off-screen
  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !triggerRef.current) return

    const tooltip = tooltipRef.current.getBoundingClientRect()
    const trigger = triggerRef.current.getBoundingClientRect()
    const padding = 8

    let newPos = position
    if (position === 'top' && trigger.top - tooltip.height - padding < 0) newPos = 'bottom'
    if (position === 'bottom' && trigger.bottom + tooltip.height + padding > window.innerHeight) newPos = 'top'
    if (position === 'left' && trigger.left - tooltip.width - padding < 0) newPos = 'right'
    if (position === 'right' && trigger.right + tooltip.width + padding > window.innerWidth) newPos = 'left'

    setActualPosition(newPos)
  }, [isVisible, position])

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }, [])

  const handleTap = useCallback(() => {
    if (!isTouchDevice) return
    setIsVisible(prev => !prev)
  }, [isTouchDevice])

  // Dismiss on tap outside (mobile)
  useEffect(() => {
    if (!isVisible || !isTouchDevice) return

    const handleOutside = (e: TouchEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setIsVisible(false)
      }
    }

    document.addEventListener('touchstart', handleOutside)
    return () => document.removeEventListener('touchstart', handleOutside)
  }, [isVisible, isTouchDevice])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#121212] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#121212] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#121212] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#121212] border-y-transparent border-l-transparent',
  }

  return (
    <div
      ref={triggerRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={!isTouchDevice ? show : undefined}
      onMouseLeave={!isTouchDevice ? hide : undefined}
      onTouchStart={isTouchDevice ? handleTap : undefined}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            'absolute z-[200] pointer-events-none',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            positionClasses[actualPosition]
          )}
          role="tooltip"
        >
          <div className="bg-[#121212] text-white text-[11px] font-medium leading-snug px-3 py-2 rounded-lg shadow-xl max-w-xs whitespace-nowrap">
            {content}
          </div>
          <div className={cn('absolute w-0 h-0 border-[5px]', arrowClasses[actualPosition])} />
        </div>
      )}
    </div>
  )
}
