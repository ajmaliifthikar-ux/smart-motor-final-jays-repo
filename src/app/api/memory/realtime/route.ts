import { NextRequest, NextResponse } from 'next/server'
import {
  getRealtimeMemory,
  getAvailableSlotsForDate,
  bookTimeSlot,
  addActiveBooking,
  updateBookingStatus,
  getQueuePosition,
} from '@/lib/memory-realtime'
import { z } from 'zod'

const realtimeQuerySchema = z.object({
  type: z.enum(['full', 'slots', 'bookings', 'promotions', 'queue']).optional().default('full'),
  date: z.string().optional(),
})

const bookTimeSlotSchema = z.object({
  date: z.string(),
  time: z.string(),
})

const addBookingSchema = z.object({
  bookingId: z.string(),
  customerName: z.string(),
  service: z.string(),
  timeSlot: z.string(),
})

const updateStatusSchema = z.object({
  bookingId: z.string(),
  status: z.enum(['in-progress', 'waiting', 'completed']),
})

/**
 * GET /api/memory/realtime
 * Fetch real-time memory
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const rawQuery = {
      type: searchParams.get('type') || 'full',
      date: searchParams.get('date'),
    }

    const query = realtimeQuerySchema.parse(rawQuery)
    const realtime = await getRealtimeMemory()

    if (query.type === 'slots' && query.date) {
      const slots = await getAvailableSlotsForDate(query.date)
      return NextResponse.json({ availableSlots: slots, date: query.date })
    } else if (query.type === 'bookings') {
      return NextResponse.json({ activeBookings: realtime.activeBookings })
    } else if (query.type === 'promotions') {
      return NextResponse.json({ activePromotions: realtime.activePromotions })
    } else if (query.type === 'queue') {
      return NextResponse.json({ serviceQueue: realtime.serviceQueue })
    }

    // Full realtime memory
    return NextResponse.json(realtime)
  } catch (error) {
    console.error('Realtime memory GET error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch realtime memory' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/memory/realtime
 * Update real-time memory (book slots, add bookings, update status)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.operation === 'book_slot') {
      const slotData = bookTimeSlotSchema.parse(body)
      await bookTimeSlot(slotData.date, slotData.time)

      return NextResponse.json({
        success: true,
        message: `Slot booked: ${slotData.date} at ${slotData.time}`,
      })
    } else if (body.operation === 'add_booking') {
      const bookingData = addBookingSchema.parse(body)
      await addActiveBooking({
        bookingId: bookingData.bookingId,
        customerName: bookingData.customerName,
        service: bookingData.service,
        timeSlot: bookingData.timeSlot,
        status: 'waiting',
      })

      return NextResponse.json({
        success: true,
        message: 'Booking added to active list',
      })
    } else if (body.operation === 'update_status') {
      const statusData = updateStatusSchema.parse(body)
      await updateBookingStatus(statusData.bookingId, statusData.status)

      return NextResponse.json({
        success: true,
        message: `Booking status updated to ${statusData.status}`,
      })
    } else if (body.operation === 'get_queue_position') {
      const position = await getQueuePosition(body.customerName)
      return NextResponse.json({
        customerName: body.customerName,
        position,
      })
    }

    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Realtime memory POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update realtime memory' },
      { status: 500 }
    )
  }
}
