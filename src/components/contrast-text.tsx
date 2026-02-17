'use client'

import React, { ReactNode } from 'react'
import { isLightColor, getContrastTextColor } from '@/lib/utils'

/**
 * Automatically adjusts text color based on background color for maximum contrast
 * This component ensures readability on any background color
 */
interface ContrastTextProps {
  children: ReactNode
  bgColor?: string
  className?: string
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function ContrastText({
  children,
  bgColor,
  className = '',
  as: Component = 'div'
}: ContrastTextProps) {
  const textColor = bgColor ? getContrastTextColor(bgColor) : 'white'
  const textColorClass = textColor === 'white' ? 'text-white' : 'text-black'

  return (
    <Component className={`${textColorClass} ${className}`}>
      {children}
    </Component>
  )
}

/**
 * Container with automatic contrast-aware text color
 */
interface ContrastContainerProps {
  children: ReactNode
  bgColor?: string
  className?: string
}

export function ContrastContainer({
  children,
  bgColor,
  className = ''
}: ContrastContainerProps) {
  const textColor = bgColor ? getContrastTextColor(bgColor) : 'white'
  const textColorClass = textColor === 'white' ? 'text-white' : 'text-black'

  return (
    <div className={`${textColorClass} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Button with automatic contrast text color
 */
interface ContrastButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  bgColor?: string
  children: ReactNode
}

export function ContrastButton({
  bgColor,
  children,
  className = '',
  ...props
}: ContrastButtonProps) {
  const textColor = bgColor ? getContrastTextColor(bgColor) : 'white'
  const textColorClass = textColor === 'white' ? 'text-white' : 'text-black'

  return (
    <button
      className={`${textColorClass} ${className}`}
      style={{
        ...(props.style || {}),
        backgroundColor: bgColor
      }}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Hook to get contrast text color based on background
 */
export function useContrastColor(bgColor?: string) {
  return bgColor ? getContrastTextColor(bgColor) : 'white'
}
