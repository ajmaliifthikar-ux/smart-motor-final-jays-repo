'use client'

/**
 * TrackedLink
 *
 * Drop-in replacement for <a> that logs clicks to GA4 + our internal analytics.
 *
 * Usage:
 *   <TrackedLink href="https://instagram.com/..." source="footer" medium="social" campaign="instagram-bio">
 *     Follow Us
 *   </TrackedLink>
 *
 * This does NOT require a short URL — it just fires a GA4 event + our analytics API.
 * For full URL shortener tracking, create a /s/<code> link and use that as href instead.
 */

import { trackEvent } from '@/components/analytics/GoogleAnalytics'
import { type AnchorHTMLAttributes } from 'react'

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  source?: string     // utm_source equivalent
  medium?: string     // utm_medium equivalent
  campaign?: string   // utm_campaign equivalent
  label?: string      // GA4 event label (defaults to href domain)
  children: React.ReactNode
}

export function TrackedLink({
  href,
  source,
  medium,
  campaign,
  label,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      // Extract domain for label if not provided
      const eventLabel = label || (() => {
        try { return new URL(href).hostname } catch { return href }
      })()

      // Fire GA4 event
      trackEvent('cta_click', source || 'direct', eventLabel, undefined)

      // Also fire to our internal analytics endpoint (non-blocking)
      const fullLabel = [source, medium, campaign].filter(Boolean).join(' / ') || eventLabel
      fetch('/api/analytics/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ href, source, medium, campaign, label: fullLabel }),
        keepalive: true, // continues even if page navigates
      }).catch(() => {})
    } catch {}

    // Call original onClick if provided
    onClick?.(e)
  }

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
