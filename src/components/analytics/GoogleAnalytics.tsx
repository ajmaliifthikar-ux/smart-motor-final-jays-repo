'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// ─── Hardcoded as confirmed GA4 Measurement ID for smartmotorweb stream ──────
// Stream: smartmotorweb · Stream ID: 13613893423 · Measurement ID: G-MB61CK4J5Z
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-MB61CK4J5Z'

// ─── Page-view tracker — fires on every SPA route change ─────────────────────
function GAPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    window.gtag('config', GA_ID, { page_path: url })
  }, [pathname, searchParams])

  return null
}

// ─── Public event helper — call from anywhere in the app ─────────────────────
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

// ─── Main GA4 component — exactly matches Google's recommended tag format ─────
export function GoogleAnalytics() {
  return (
    <>
      {/* Google tag (gtag.js) — async loader */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      {/* Initialise dataLayer — mirrors Google's exact recommended snippet */}
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>

      {/* SPA route-change tracker */}
      <Suspense fallback={null}>
        <GAPageTracker />
      </Suspense>
    </>
  )
}

// ─── TS type augment ──────────────────────────────────────────────────────────
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}
