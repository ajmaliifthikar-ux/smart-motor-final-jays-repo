'use client'

/**
 * LAYER 4 – Dynamic Contrast System (WCAG 2.1 AA)
 * ─────────────────────────────────────────────────
 * Use these components / hook when the background colour comes from a prop,
 * an API response, or a CMS.  They automatically compute the correct text
 * colour at runtime so future content stays readable without manual CSS edits.
 *
 * Usage examples:
 *   <ContrastText bgColor={card.color}>{card.title}</ContrastText>
 *   <ContrastContainer bgColor={brand.heroColor} className="p-8">…</ContrastContainer>
 *   <ContrastButton bgColor={pkg.buttonColor} onClick={…}>Book Now</ContrastButton>
 *   const { textHex, textClass } = useContrastColor(section.bgColor)
 */

import React, { type ReactNode, type CSSProperties } from 'react'
import { getContrastTextColor, getContrastClasses } from '@/lib/utils'

// ─── useContrastColor hook ────────────────────────────────────────────────────
/**
 * Returns both a hex colour (#FFFFFF / #000000) and a Tailwind class
 * (text-white / text-gray-900) for the text that best contrasts `bgColor`.
 */
export function useContrastColor(bgColor?: string) {
  const hex = getContrastTextColor(bgColor ?? '')
  const textClass = getContrastClasses(bgColor)
  return { textHex: hex, textClass }
}

// ─── ContrastText ─────────────────────────────────────────────────────────────
interface ContrastTextProps {
  bgColor?: string
  children: ReactNode
  className?: string
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/**
 * Renders children with the auto-computed contrast text colour applied as an
 * inline style (so it always wins over inherited CSS).
 * Does NOT change the background.
 */
export function ContrastText({
  bgColor,
  children,
  className = '',
  as: Tag = 'span',
}: ContrastTextProps) {
  const style: CSSProperties = { color: getContrastTextColor(bgColor ?? '') }
  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  )
}

// ─── ContrastContainer ────────────────────────────────────────────────────────
interface ContrastContainerProps {
  bgColor?: string
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'main'
}

/**
 * Sets BOTH the background colour and a contrasting text colour.
 * Children that don't override `color` will inherit the correct value.
 */
export function ContrastContainer({
  bgColor,
  children,
  className = '',
  as: Tag = 'div',
}: ContrastContainerProps) {
  const style: CSSProperties = bgColor
    ? { backgroundColor: bgColor, color: getContrastTextColor(bgColor) }
    : {}
  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  )
}

// ─── ContrastButton ───────────────────────────────────────────────────────────
interface ContrastButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  bgColor?: string
  children: ReactNode
}

/**
 * A <button> whose text colour is automatically computed from its background.
 */
export function ContrastButton({
  bgColor,
  children,
  className = '',
  style: externalStyle,
  ...rest
}: ContrastButtonProps) {
  const style: CSSProperties = {
    ...externalStyle,
    ...(bgColor
      ? { backgroundColor: bgColor, color: getContrastTextColor(bgColor) }
      : {}),
  }
  return (
    <button className={className} style={style} {...rest}>
      {children}
    </button>
  )
}
