import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendNewsletterWelcomeEmail } from '@/lib/email'
import admin from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

// Convert email to safe RTDB key (dots and @ not allowed in keys)
function emailToKey(email: string) {
    return email.toLowerCase().replace(/\./g, '_DOT_').replace(/@/g, '_AT_')
}

const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email } = subscribeSchema.parse(body)

        // Use Firebase Realtime Database (provisioned & working)
        const rtdb = admin.database()
        const key = emailToKey(email)
        const ref = rtdb.ref(`subscribers/${key}`)
        const snap = await ref.get()

        if (snap.exists()) {
            const data = snap.val()
            if (data && !data.isActive) {
                // Re-activate lapsed subscriber
                await ref.update({ isActive: true, updatedAt: Date.now() })
                await sendNewsletterWelcomeEmail(email)
                return NextResponse.json({ success: true, message: 'Welcome back! You have been resubscribed.' })
            }
            return NextResponse.json({ success: true, message: 'You are already subscribed to our newsletter.' })
        }

        // Save new subscriber to RTDB
        await ref.set({
            email,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        })

        // Send branded welcome email via SMTP
        const emailResult = await sendNewsletterWelcomeEmail(email)

        if (!emailResult.success) {
            // DB save succeeded — log email failure but don't break response
            console.error('Welcome email failed (subscriber saved OK):', emailResult.error)
        }

        return NextResponse.json({ success: true, message: 'Thank you for subscribing!' })

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
        }
        console.error('Newsletter subscribe error:', error)
        return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
    }
}
