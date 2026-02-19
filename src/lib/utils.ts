import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PRICE_FORMATTER = new Intl.NumberFormat('en-AE', {
  style: 'currency',
  currency: 'AED',
  minimumFractionDigits: 0,
})

export function formatPrice(price: number): string {
  return PRICE_FORMATTER.format(price)
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-AE', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export function formatDate(date: Date | string): string {
  return DATE_FORMATTER.format(new Date(date))
}

export function publicPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  // Ensure path starts with / and remove it if basePath ends with / to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${basePath}${cleanPath}`
}

// ─────────────────────────────────────────────────────────────
// AUTO CONTRAST SYSTEM (WCAG 2.1 AA compliant)
// ─────────────────────────────────────────────────────────────

const TW_HEX_REGEX = /\[#([0-9a-fA-F]{3,8})\]/
const HEX_3_REGEX = /^[0-9a-fA-F]{3}$/
const HEX_6_8_REGEX = /^[0-9a-fA-F]{6,8}$/
const RGB_REGEX = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/

const NAMED_COLORS: Record<string, [number, number, number]> = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  transparent: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
}

/**
 * Parse any CSS color string into [r, g, b] 0-255 values.
 * Supports: #RGB, #RRGGBB, #RRGGBBAA, rgb(...), rgba(...),
 * named colors (black/white/transparent), and Tailwind-style
 * inline hex values like bg-[#121212].
 * Returns null when parsing fails (treat as dark → white text).
 */
export function parseColorToRGB(color: string): [number, number, number] | null {
  if (!color) return null
  const c = color.trim()

  // Extract bare hex from Tailwind-style bg-[#xxx]
  const twMatch = c.match(TW_HEX_REGEX)
  const hex = twMatch ? twMatch[1] : c.replace(/^#/, '')

  // 3-digit hex (#RGB)
  if (HEX_3_REGEX.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    return [r, g, b]
  }

  // 6 or 8-digit hex (#RRGGBB / #RRGGBBAA)
  if (HEX_6_8_REGEX.test(hex)) {
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return [r, g, b]
  }

  // rgb / rgba
  const rgbMatch = c.match(RGB_REGEX)
  if (rgbMatch) {
    return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])]
  }

  // Named colors
  const lowerC = c.toLowerCase()
  if (NAMED_COLORS[lowerC]) return NAMED_COLORS[lowerC]

  return null
}

/**
 * Calculate WCAG relative luminance from linear RGB channels.
 * Formula: 0.2126 R + 0.7152 G + 0.0722 B  (proper WCAG 2.1)
 * Each channel is first linearised via the sRGB gamma curve.
 */
export function getColorLuminance(color: string): number {
  const rgb = parseColorToRGB(color)
  if (!rgb) return 0 // assume dark when unknown

  const [R8, G8, B8] = rgb
  const linearise = (v: number) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }

  return 0.2126 * linearise(R8) + 0.7152 * linearise(G8) + 0.0722 * linearise(B8)
}

/**
 * Return true when the color is perceptually "light" (luminance ≥ 0.179).
 * Threshold chosen so that mid-gray (#767676) is treated as dark, matching
 * the WCAG AA 4.5:1 boundary against white.
 */
export function isLightColor(color: string): boolean {
  return getColorLuminance(color) >= 0.179
}

/**
 * Core utility — given any background color, return the text color
 * ('#FFFFFF' or '#000000') that achieves the best WCAG contrast.
 *
 * Accepts:
 *   getContrastTextColor('#121212')          → '#FFFFFF'
 *   getContrastTextColor('rgb(255,255,255)') → '#000000'
 *   getContrastTextColor('bg-[#E62329]')     → '#FFFFFF'
 *
 * When the color cannot be parsed, returns '#FFFFFF' (safe default
 * for the app's predominantly dark palette).
 */
export function getContrastTextColor(bgColor: string): '#FFFFFF' | '#000000' {
  if (!bgColor) return '#FFFFFF'
  return isLightColor(bgColor) ? '#000000' : '#FFFFFF'
}

/**
 * Same logic, but returns Tailwind utility classes instead of hex.
 *   getContrastClasses('#121212') → 'text-white'
 *   getContrastClasses('#FFFFFF') → 'text-gray-900'
 */
export function getContrastClasses(bgColor?: string): string {
  if (!bgColor) return 'text-white'
  return isLightColor(bgColor) ? 'text-gray-900' : 'text-white'
}

/**
 * Returns both text-color and a safe placeholder-color class string,
 * useful for form inputs where you also need ::placeholder styled.
 */
export function getContrastInputClasses(bgColor?: string): { text: string; placeholder: string } {
  const isDark = !bgColor || !isLightColor(bgColor)
  return {
    text: isDark ? 'text-white' : 'text-gray-900',
    placeholder: isDark ? 'placeholder:text-white/50' : 'placeholder:text-gray-400',
  }
}

/**
 * Inline-style version — returns a React CSSProperties object.
 * Use when Tailwind classes cannot be used (e.g., dynamic inline styles).
 */
export function getContrastStyle(bgColor?: string): React.CSSProperties {
  return { color: getContrastTextColor(bgColor ?? '') }
}
