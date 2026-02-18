'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// ─── Page-view tracker (inner — needs Suspense boundary) ────────────────────
function GAPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined') return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    window.gtag?.('config', GA_ID, { page_path: url })
  }, [pathname, searchParams])

  return null
}

// ─── Public event helper (call from anywhere) ───────────────────────────────
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

// ─── Main component — inject scripts + track page views ─────────────────────
export function GoogleAnalytics() {
  if (!GA_ID) return null

  return (
    <>
      {/* Load gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* Initialise dataLayer */}
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
      {/* Track route changes */}
      <Suspense fallback={null}>
        <GAPageTracker />
      </Suspense>
    </>
  )
}

// ─── Type augment so window.gtag doesn't error in TS ────────────────────────
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
