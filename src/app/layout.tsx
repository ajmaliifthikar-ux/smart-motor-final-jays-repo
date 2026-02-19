import type { Metadata } from "next";
import { RecaptchaProvider } from "@/components/providers/RecaptchaProvider";
import "./globals.css";

// Removed force-dynamic — individual pages control their rendering strategy
// force-dynamic in root layout conflicts with page-level revalidate and metadata

export const metadata: Metadata = {
  metadataBase: new URL('https://smartmotor.ae'),
  title: {
    default: "Car Service & Repair Abu Dhabi | Smart Motor Auto Repair – Est. 2009",
    template: "%s | Smart Motor Abu Dhabi",
  },
  description:
    "Smart Motor Auto Repair — Abu Dhabi's trusted car service center in Musaffah. Specializing in BMW, Mercedes, Toyota, Nissan & all brands. Engine, AC, electrical, PPF, ceramic coating & detailing. Mon–Sat 8AM–7PM. Call +971 2 555 5443.",
  keywords: [
    "car service Abu Dhabi",
    "car repair Abu Dhabi",
    "auto repair Musaffah",
    "BMW service Abu Dhabi",
    "Mercedes service Abu Dhabi",
    "Toyota repair Abu Dhabi",
    "Nissan repair Abu Dhabi",
    "Audi service Abu Dhabi",
    "Porsche repair Abu Dhabi",
    "Range Rover service Abu Dhabi",
    "PPF installation Abu Dhabi",
    "ceramic coating Abu Dhabi",
    "window tinting Abu Dhabi",
    "car detailing Abu Dhabi",
    "engine repair Abu Dhabi",
    "AC repair Abu Dhabi",
    "Smart Motor Musaffah",
    "workshop Abu Dhabi",
  ],
  authors: [{ name: "Smart Motor Auto Repair" }],
  creator: "Smart Motor Auto Repair",
  publisher: "Smart Motor Auto Repair",
  category: "Automotive Service",
  openGraph: {
    title: "Car Service & Repair Abu Dhabi | Smart Motor Auto Repair",
    description:
      "Abu Dhabi's trusted car repair center in Musaffah. BMW, Mercedes, Toyota, Nissan & all brands. 4.9★ on Google · 127 reviews. Est. 2009.",
    url: "https://smartmotor.ae",
    siteName: "Smart Motor Auto Repair Abu Dhabi",
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
    title: "Car Service & Repair Abu Dhabi | Smart Motor",
    description: "Abu Dhabi's trusted car repair center. BMW, Mercedes, Toyota & all brands. 4.9★ Google rated. Est. 2009.",
    creator: "@smartmotorae",
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
  alternates: {
    canonical: 'https://smartmotor.ae',
    languages: {
      'en': 'https://smartmotor.ae',
      'ar': 'https://smartmotor.ae/ar',
      'x-default': 'https://smartmotor.ae',
    },
  },
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

import Script from "next/script";
import { LanguageProvider } from "@/lib/language-context";
import { SmartAssistantWithAudio } from "@/components/ui/smart-assistant-with-audio";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

// ─── Schema.org — AutoRepair + LocalBusiness (SSOT from src/lib/constants.ts) ─────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "LocalBusiness"],
  "@id": "https://smartmotor.ae/#organization",
  name: "Smart Motor Auto Repair",
  alternateName: "Smart Motor",
  description: "Abu Dhabi's premier automotive service center. Factory-certified technicians for German, Japanese, Chinese, European & American vehicles. Engine, transmission, AC, electrical diagnostics, PPF, ceramic coating & detailing.",
  image: [
    "https://smartmotor.ae/images/og-image.jpg",
    "https://smartmotor.ae/branding/logo.png"
  ],
  logo: "https://smartmotor.ae/branding/logo.png",
  url: "https://smartmotor.ae",
  telephone: "+97125555443",
  email: "service@smartmotor.ae",
  foundingDate: "2009",
  address: {
    "@type": "PostalAddress",
    streetAddress: "M9, Musaffah Industrial Area",
    addressLocality: "Abu Dhabi",
    addressRegion: "Abu Dhabi",
    addressCountry: "AE"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 24.4539,
    longitude: 54.3773
  },
  hasMap: "https://maps.google.com/?q=Smart+Motor+Auto+Repair+Musaffah+Abu+Dhabi",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "127",
    bestRating: "5",
    worstRating: "1"
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "19:00"
    }
  ],
  paymentAccepted: ["Cash", "Credit Card", "Debit Card", "Visa", "Mastercard", "Apple Pay"],
  currenciesAccepted: "AED",
  priceRange: "$$$",
  areaServed: [
    { "@type": "City", name: "Abu Dhabi" },
    { "@type": "City", name: "Musaffah" },
    { "@type": "City", name: "Al Reem Island" },
    { "@type": "City", name: "Khalifa City" }
  ],
  serviceArea: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 24.4539, longitude: 54.3773 },
    geoRadius: "50000"
  },
  knowsAbout: [
    "BMW Repair", "Mercedes Repair", "Audi Repair", "Porsche Repair",
    "Range Rover Repair", "Toyota Repair", "Nissan Repair", "Honda Repair",
    "PPF Installation", "Ceramic Coating", "Window Tinting", "Car Detailing",
    "Engine Diagnostics", "Transmission Repair", "AC Service", "Electrical Repair"
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Automotive Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mechanical Services", description: "Engine repair, transmission, brakes & suspension by certified technicians" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Electrical & Diagnostic Services", description: "Advanced computer diagnostics and full electrical system repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Body Shop", description: "Panel beating, dent removal & accident repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "PPF & Paint Protection", description: "3M & XPEL paint protection film installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ceramic Coating", description: "9H nano ceramic coating for long-lasting paint protection" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Window Tinting", description: "UV-blocking premium window films for all vehicles" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Car Detailing", description: "Interior & exterior detailing packages" } }
    ]
  },
  sameAs: [
    "https://instagram.com/smartmotor_autorepair",
    "https://facebook.com/smartmotorae",
    "https://tiktok.com/@smartmotorae",
    "https://threads.net/@smartmotor_autorepair"
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* Google Analytics 4 — GA_ID: G-MB61CK4J5Z */}
        <GoogleAnalytics />
        <LanguageProvider>
          <RecaptchaProvider>
            {children}
            <SmartAssistantWithAudio />
            <Script id="audio-context-resume" strategy="afterInteractive">{`
              document.addEventListener('click', function() {
                if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                  var ctx = new (window.AudioContext || window.webkitAudioContext)();
                  if (ctx.state === 'suspended') ctx.resume();
                }
              }, { once: true });
            `}</Script>
          </RecaptchaProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
