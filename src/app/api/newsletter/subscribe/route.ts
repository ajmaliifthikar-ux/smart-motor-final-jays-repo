import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        })

        if (existing) {
            if (!existing.isActive) {
                // Reactivate
                await prisma.subscriber.update({
                    where: { email },
                    data: { isActive: true },
                })
                return NextResponse.json({ success: true, message: 'Welcome back! You have been resubscribed.' })
            }
            return NextResponse.json({ success: true, message: 'You are already subscribed to our newsletter.' })
        }

        // Create new subscriber
        await prisma.subscriber.create({
            data: { email },
        })

        // Send welcome email
        try {
            await sendNewsletterWelcomeEmail(email)
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
            // Continue execution - subscription was successful
        }

        return NextResponse.json({ success: true, message: 'Thank you for subscribing!' })

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
        }
        console.error('Newsletter Error:', error)
        return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
    }
}
