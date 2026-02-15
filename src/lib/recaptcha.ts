
interface RecaptchaResponse {
    success: boolean
    score?: number
    action?: string
    challenge_ts?: string
    hostname?: string
    'error-codes'?: string[]
}

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
        console.error('Recaptcha configuration error: RECAPTCHA_SECRET_KEY is missing')
        return { success: false, error: 'Server configuration error' }
    }

    if (!token) {
        return { success: false, error: 'Token is missing' }
    }

    try {
        const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'

        // Use URLSearchParams to send data in the request body (application/x-www-form-urlencoded)
        const formData = new URLSearchParams()
        formData.append('secret', secretKey)
        formData.append('response', token)

        const response = await fetch(verifyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        })

        if (!response.ok) {
            console.error(`Recaptcha verification failed with HTTP status: ${response.status}`)
            return { success: false, error: 'Verification request failed' }
        }

        const data: RecaptchaResponse = await response.json()

        if (!data.success) {
            // Log error codes safely (they are standard strings, not sensitive)
            console.warn('Recaptcha verification failed:', data['error-codes'])
            return { success: false, error: 'Verification failed' }
        }

        return { success: true, score: data.score }

    } catch (error) {
        // Log generic error message, do not log full error object to avoid leaking potential secrets in stack traces or properties
        console.error('Recaptcha verification error: An unexpected error occurred during verification.')
        return { success: false, error: 'Internal verification error' }
    }
}
