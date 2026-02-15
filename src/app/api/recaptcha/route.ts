import { NextResponse } from 'next/server'
import { verifyRecaptcha } from '@/lib/recaptcha'

export async function POST(request: Request) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json({ success: false, message: 'Missing token' }, { status: 400 })
        }

        const verification = await verifyRecaptcha(token)

        if (verification.success && (verification.score === undefined || verification.score >= 0.5)) {
            return NextResponse.json({ success: true, score: verification.score })
        } else {
            return NextResponse.json({
                success: false,
                message: 'Verification failed',
                score: verification.score
            }, { status: 400 })
        }

    } catch (error) {
        // Log safe error message
        if (error instanceof Error) {
            console.error('reCAPTCHA verification error:', error.message)
        } else {
            console.error('reCAPTCHA verification error: Unknown error occurred')
        }
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
