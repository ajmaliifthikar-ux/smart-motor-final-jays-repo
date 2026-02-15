
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { token } = await request.json()
        const secretKey = process.env.RECAPTCHA_SECRET_KEY

        if (!token) {
            return NextResponse.json({ success: false, message: 'Missing token' }, { status: 400 })
        }

        if (!secretKey) {
            console.error('RECAPTCHA_SECRET_KEY is not defined')
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 })
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`

        const response = await fetch(verifyUrl, { method: 'POST' })
        const data = await response.json()

        if (data.success && data.score >= 0.5) {
            return NextResponse.json({ success: true, score: data.score })
        } else {
            return NextResponse.json({ success: false, message: 'Verification failed', score: data.score }, { status: 400 })
        }

    } catch (error) {
        console.error('reCAPTCHA verification error:', error)
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
    }
}
