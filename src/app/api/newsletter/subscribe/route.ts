import { NextResponse } from 'next/server'
import { getSubscriber, createSubscriber, updateSubscriber } from '@/lib/firebase-db'
import { z } from 'zod'
import { sendNewsletterWelcomeEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email } = subscribeSchema.parse(body)

        // Check if already subscribed
        const existing = await getSubscriber(email)

        if (existing) {
            if (!existing.isActive) {
                // Reactivate
                await updateSubscriber(email, { isActive: true })
                return NextResponse.json({ success: true, message: 'Welcome back! You have been resubscribed.' })
            }
            return NextResponse.json({ success: true, message: 'You are already subscribed to our newsletter.' })
        }

        // Create new subscriber
        await createSubscriber(email)

        // Send welcome email via Resend/Nodemailer (Phase 3)
        await sendNewsletterWelcomeEmail(email)

        return NextResponse.json({ success: true, message: 'Thank you for subscribing!' })

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
        }
        console.error('Newsletter Error:', error)
        return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
    }
}
