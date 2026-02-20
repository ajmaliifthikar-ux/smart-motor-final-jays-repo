import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, type = 'general' } = await req.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    let response = ''
    let metadata: Record<string, any> = {}

    if (type === 'whatsapp' || message.toLowerCase().includes('whatsapp')) {
      response = `WhatsApp Bot Setup Guide:

**Message Templates:**
✓ Booking Confirmation: "Hi [Name]! Your service is confirmed for [Date] at [Time]."
✓ Reminder (24h): "Reminder: Service tomorrow at [Time]. See you! 🚗"
✓ Service Complete: "Done! Ready for pickup at [Time]. Thank you! ✅"
✓ Promotion: "Special this week: [Service] at [Discount]% off!"

**Automation Features:**
• Auto-confirm bookings
• 24h appointment reminders (40% fewer no-shows)
• Service status updates
• Request feedback after service
• Send invoices via WhatsApp

**Response Time Goals:**
→ Immediate for automated replies
→ <5 min for team responses
→ Business hours: 9 AM - 6 PM UAE

**Pro Tips:**
✓ Personalize with customer names
✓ Use emojis sparingly
✓ Keep messages under 160 chars
✓ Include clear call-to-action
✓ Enable read receipts

Ready to activate WhatsApp automation?`
      metadata = {
        type: 'whatsapp',
        features: ['confirmations', 'reminders', 'updates', 'feedback']
      }
    } else if (message.toLowerCase().includes('lead') || type === 'lead') {
      response = `Lead Capture & Nurture Automation:

**Lead Capture Points:**
1. Website "Request Quote" form
2. WhatsApp direct inquiries
3. Phone calls logged
4. Social media DMs
5. Email inquiries

**Automatic Follow-up Sequence:**
Day 0: "Thanks! Here are our services + pricing"
Day 1: "Popular: Oil Change - [Price]"
Day 2: "Today only: [Discount]% off first service"
Day 3: "See why 500+ customers trust us"
Day 4: "Last chance: [Offer expires today]"

**Scoring System:**
🟢 Hot: Asked specific questions (respond within 2 hours)
🟡 Warm: Viewed pricing, browsed site (respond within 4 hours)
🔴 Cold: No engagement in 5 days (re-engage with offer)

**Conversion Boosters:**
• Fast response (first 5 min = 80% higher conversion)
• Offer discount (limited-time urgency)
• Show social proof (ratings, testimonials)
• Easy booking link
• Multiple contact options

Enable lead automation now?`
      metadata = {
        type: 'lead-capture',
        conversionRate: '+35%',
        features: ['capture', 'scoring', 'follow-up', 'nurturing']
      }
    } else if (message.toLowerCase().includes('reminder') || message.toLowerCase().includes('appointment')) {
      response = `Appointment Reminder Automation:

**Reminder Schedule:**
📅 7 days before: "Your appointment is coming up!"
📅 2 days before: "Reminder: [Date] at [Time]"
📅 24 hours: "Tomorrow at [Time]. Confirm or reschedule?"
📅 2 hours: "See you in 2 hours! Drive safely 🚗"

**Impact:**
• No-show reduction: 30-40%
• Customer satisfaction: +25%
• Team efficiency: +15%
• Revenue protected: Reduce cancellations

**Automated Responses:**
→ "Thanks for confirming. See you [Date]!"
→ "Rescheduled to [New Date]. Confirmed!"
→ "Couldn't reach you. Please confirm by [Deadline]"

**Multi-Channel:**
• SMS for critical (24h, 2h before)
• WhatsApp for confirmations
• Email for 7-day advance notice
• App push notifications

Start reducing no-shows?`
      metadata = {
        type: 'reminders',
        noShowReduction: '30-40%',
        channels: ['sms', 'whatsapp', 'email', 'push']
      }
    } else {
      response = `Automation Setup Assistant:

**Popular Automations:**
🤖 **WhatsApp Bot** - Auto-responses, bookings, updates
📝 **Lead Capture** - Forms, scoring, follow-ups
🔔 **Appointment Reminders** - SMS, WhatsApp, email
📧 **Email Sequences** - Welcome, promotional, feedback
📱 **SMS Campaigns** - Direct messaging, offers
📅 **Scheduling** - Auto-confirm, reschedule
⭐ **Reviews** - Auto-request, collect feedback

**ROI Summary:**
• 30-40% fewer no-shows
• 35% more lead conversions
• 20 hours/month time saved
• Better customer satisfaction

What would you like to automate?`
      metadata = {
        ready: true,
        automations: 7
      }
    }

    return NextResponse.json({
      response,
      metadata,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Automation API error:', error)
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
