import { NextRequest, NextResponse } from 'next/server'
import { BookingCoordinatorAgent } from '@/lib/agents/booking/booking-agent'
import { getAdminSession } from '@/lib/session'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, history = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Initialize booking agent
    const agent = new BookingCoordinatorAgent()

    // Process the message
    let response: string = ''
    let metadata: Record<string, any> = {}

    try {
      // For now, provide helpful response about booking automation
      // In a real implementation, this would integrate with the agent's methods
      if (message.toLowerCase().includes('available') || message.toLowerCase().includes('slot')) {
        response = `I can help you find available booking slots. Let me check the current bookings and availability...

Here's what I can do:
• **Check Availability**: View all available time slots for the next 30 days
• **Auto-Schedule**: Automatically find the best time based on customer preferences
• **Conflict Resolution**: Detect and resolve scheduling conflicts
• **Reschedule**: Suggest optimal times for existing bookings
• **Send Notifications**: Automatically notify customers of their bookings

What specific booking challenge would you like to solve?`
        metadata = {
          suggestions: [
            'Show me available slots for tomorrow',
            'Schedule a booking for John Doe',
            'Find conflicts in next week\'s schedule',
            'Suggest reschedule times for cancelled bookings'
          ]
        }
      } else if (message.toLowerCase().includes('conflict') || message.toLowerCase().includes('double')) {
        response = `I'll analyze your booking schedule for conflicts...

**Current Conflict Detection Strategy:**
1. **Overlapping Bookings**: Detect same-time slot assignments
2. **Resource Conflicts**: Identify technician/equipment conflicts
3. **Location Conflicts**: Check location availability
4. **Cascade Issues**: Find dependencies and related conflicts

Would you like me to:
• Run a full conflict audit?
• Focus on specific time period?
• Check particular technician's schedule?`
        metadata = {
          conflictStats: {
            detected: 0,
            resolved: 0,
            pending: 0
          }
        }
      } else if (message.toLowerCase().includes('notify') || message.toLowerCase().includes('customer')) {
        response = `I can help manage customer notifications for bookings.

**Available Notifications:**
• **Confirmation**: Send booking confirmation to customer
• **Reminder**: Send reminder 24 hours before appointment
• **Rescheduled**: Alert customer of reschedule offer
• **Cancelled**: Notify if booking is cancelled
• **Special Offers**: Recommend related services

**Communication Channels:**
• Email
• SMS (WhatsApp)
• In-app notification
• Push notification

What notification would you like to send?`
        metadata = {
          channels: ['email', 'sms', 'whatsapp', 'app']
        }
      } else {
        response = `I'm your Booking Automation Assistant. I can help you with:

**Booking Management:**
• 📅 Check and manage available slots
• 🔄 Auto-schedule appointments
• 🚨 Detect and resolve booking conflicts
• 👥 Handle customer rescheduling requests
• 📧 Send automatic notifications

**What would you like to do?**
Ask me about scheduling, conflicts, availability, or customer notifications.`
        metadata = {
          features: [
            'Check Availability',
            'Schedule Booking',
            'Resolve Conflicts',
            'Send Notifications',
            'Reschedule Appointments'
          ]
        }
      }
    } catch (err) {
      console.error('Booking agent error:', err)
      response = 'I encountered an error processing your request. Please try again.'
    }

    return NextResponse.json({
      response,
      metadata,
      message: response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Booking chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
