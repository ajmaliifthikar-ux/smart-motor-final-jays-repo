import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-AE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function publicPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  // Ensure path starts with / and remove it if basePath ends with / to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${cleanPath}`
}

/**
 * Calculate luminance of a color to determine if it's light or dark
 * Uses the relative luminance formula from WCAG
 */
export function getColorLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const luminance =
    0.299 * r +
    0.587 * g +
    0.114 * b

  return luminance
}

/**
 * Determine if a color is light or dark
 * Returns true if light, false if dark
 */
export function isLightColor(hexColor: string): boolean {
  return getColorLuminance(hexColor) > 0.5
}

/**
 * Get contrasting text color (white or black) based on background color
 * Automatically switches between white and black text for maximum readability
 */
export function getContrastTextColor(bgColor: string): 'white' | 'black' {
  return isLightColor(bgColor) ? 'black' : 'white'
}

/**
 * Get CSS classes for automatic text color based on background
 * Usage: Apply to elements with dynamic background colors
 */
export function getContrastClasses(bgColor?: string): string {
  if (!bgColor) return 'text-white' // Default to white for dark backgrounds
  return isLightColor(bgColor)
    ? 'text-black'
    : 'text-white'
}
