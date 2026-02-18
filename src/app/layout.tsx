import type { Metadata } from "next";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";
import "./globals.css";

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL('https://smartmotor.ae'),
  title: {
    default: "Smart Motor | Premium European Car Service in Abu Dhabi",
    template: "%s | Smart Motor Abu Dhabi",
  },
  description:
    "Abu Dhabi's premier service center for luxury European vehicles. Specialized in Mercedes, BMW, Audi, Porsche, Range Rover & Bentley. 4.6★ rated on Google. 20+ years of excellence.",
  keywords: [
    "car service Abu Dhabi",
    "European car repair Abu Dhabi",
    "Mercedes service Abu Dhabi",
    "BMW service Abu Dhabi",
    "Audi service Abu Dhabi",
    "Porsche service Abu Dhabi",
    "Range Rover service Abu Dhabi",
    "Bentley service Abu Dhabi",
    "PPF installation Abu Dhabi",
    "ceramic coating Abu Dhabi",
    "window tinting Abu Dhabi",
    "auto detailing Abu Dhabi",
    "Smart Motor Musaffah",
    "luxury car workshop Abu Dhabi",
  ],
  authors: [{ name: "Smart Motor Auto Repair" }],
  creator: "Smart Motor Team",
  publisher: "Smart Motor Auto Repair",
  category: "Automotive Service",
  openGraph: {
    title: "Smart Motor | Premium European Car Service in Abu Dhabi",
    description:
      "Abu Dhabi's premier service center for luxury European vehicles. 4.6★ on Google · 121 reviews. 20+ years of excellence.",
    url: "https://smartmotor.ae",
    siteName: "Smart Motor Abu Dhabi",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Smart Motor Auto Repair – Musaffah, Abu Dhabi",
      },
    ],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Motor | Premium European Car Service",
    description: "Abu Dhabi's premier service center for luxury European vehicles. 4.6★ on Google · 121 reviews.",
    creator: "@smartmotoruae",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', sizes: 'any' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: "/favicons/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Google Search Console verification — add your real tag from GSC here:
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
};

import { LanguageProvider } from "@/lib/language-context";
import { SmartAssistantWithAudio } from "@/components/ui/smart-assistant-with-audio";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { WithContext, AutoRepair } from "schema-dts";

// ─── Real schema.org data — pulled from Google Places API response ─────────
const jsonLd: WithContext<AutoRepair> = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Smart Motor Auto Repair",
  image: "https://smartmotor.ae/images/og-image.jpg",
  "@id": "https://smartmotor.ae",
  url: "https://smartmotor.ae",
  telephone: "+97128005445",  // 800 5445 (verified from Google Places)
  address: {
    "@type": "PostalAddress",
    streetAddress: "As Salami 1 St - Musaffah - M09",
    addressLocality: "Abu Dhabi",
    addressRegion: "Abu Dhabi",
    postalCode: "00000",
    addressCountry: "AE"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 24.3519,   // Musaffah M09, Abu Dhabi (verified)
    longitude: 54.4796
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    reviewCount: "121",
    bestRating: "5",
    worstRating: "1"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "08:00",
      closes: "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday"],
      opens: "08:00",
      closes: "19:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "08:00",
      closes: "19:00"
    }
  ],
  sameAs: [
    "https://www.facebook.com/smartmotoruae",
    "https://www.instagram.com/smartmotoruae",
    "https://www.linkedin.com/company/smartmotorauto",
    "https://www.google.com/maps/place/?q=place_id:ChIJpb7_vuBBXj4RpYogfw-RTLg"
  ],
  priceRange: "$$",
  hasMap: "https://www.google.com/maps/place/?q=place_id:ChIJpb7_vuBBXj4RpYogfw-RTLg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <JsonLd data={jsonLd} />
        {/* Google Analytics 4 — GA_ID: G-MB61CK4J5Z */}
        <GoogleAnalytics />
        <LanguageProvider>
          <RecaptchaProvider>
            {children}
            <SmartAssistantWithAudio />
            <script dangerouslySetInnerHTML={{ __html: `
              document.addEventListener('click', function() {
                if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                  const ctx = new (window.AudioContext || window.webkitAudioContext)();
                  if (ctx.state === 'suspended') ctx.resume();
                }
              }, { once: true });
            `}} />
          </RecaptchaProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
