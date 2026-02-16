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
    "Abu Dhabi's premier service center for luxury European vehicles. Specialized in Mercedes, BMW, Audi, Porsche, Range Rover & Bentley. 20+ years of excellence.",
  keywords: [
    "car service Abu Dhabi",
    "Mercedes service",
    "BMW service",
    "Audi service",
    "Porsche service",
    "Range Rover service",
    "Bentley service",
    "PPF installation",
    "ceramic coating",
    "window tinting",
    "auto detailing",
    "European car repair",
    "Musaffah",
  ],
  authors: [{ name: "Smart Motor Auto Repair" }],
  creator: "Smart Motor Team",
  publisher: "Smart Motor Auto Repair",
  category: "Automotive Service",
  openGraph: {
    title: "Smart Motor | Premium European Car Service",
    description:
      "Abu Dhabi's premier service center for luxury European vehicles. 20+ years of excellence.",
    url: "https://smartmotor.ae",
    siteName: "Smart Motor",
    images: [
      {
        url: "/images/og-image.jpg", // Create this image later
        width: 1200,
        height: 630,
        alt: "Smart Motor Auto Repair Center",
      },
    ],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Motor | Premium European Car Service",
    description: "Abu Dhabi's premier service center for luxury European vehicles. 20+ years of excellence.",
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
  verification: {
    google: "google-site-verification=YOUR_CODE_HERE", // Add Google verification code later
  },
};

import { LanguageProvider } from "@/lib/language-context";

import { JsonLd } from "@/components/seo/JsonLd";
import { WithContext, AutoRepair } from "schema-dts";

const jsonLd: WithContext<AutoRepair> = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: "Smart Motor Auto Repair",
  image: "https://smartmotor.ae/images/og-image.jpg",
  "@id": "https://smartmotor.ae",
  url: "https://smartmotor.ae",
  telephone: "+97126666789",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Musaffah M13",
    addressLocality: "Abu Dhabi",
    postalCode: "00000",
    addressCountry: "AE"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 24.333333, // Placeholder coordinates, update with real ones if available
    longitude: 54.555555
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      opens: "08:00",
      closes: "19:00"
    }
  ],
  sameAs: [
    "https://www.facebook.com/smartmotoruae",
    "https://www.instagram.com/smartmotoruae"
  ],
  priceRange: "$$"
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
        <LanguageProvider>
          <RecaptchaProvider>
            {children}
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
