'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ReactNode } from 'react'

export function RecaptchaProvider({ children }: { children: ReactNode }) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    // If no site key is provided (e.g. dev), we can render children without provider or with a warning.
    // For now, render children directly if key is missing to avoid crashing.
    if (!siteKey) {
        return <>{children}</>
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={siteKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    )
}
