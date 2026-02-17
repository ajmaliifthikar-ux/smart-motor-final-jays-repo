import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  getUserMemory,
  upsertUserMemory,
  recordBooking,
  getUserServiceHistory,
  daysSinceLastService,
} from '@/lib/memory-user'
import { z } from 'zod'

const userMemoryQuerySchema = z.object({
  userId: z.string(),
  type: z.enum(['full', 'history', 'preferences']).optional().default('full'),
})

const upsertUserSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
  carBrand: z.string().optional(),
  carModel: z.string().optional(),
  carYear: z.number().optional(),
  preferredTimeSlot: z.enum(['morning', 'afternoon', 'evening']).optional(),
  preferredServices: z.array(z.string()).optional(),
})

const bookingSchema = z.object({
  userId: z.string(),
  bookingId: z.string(),
  service: z.string(),
  rating: z.number().optional(),
  notes: z.string().optional(),
})

/**
 * GET /api/memory/user?userId=xxx&type=full
 * Fetch user memory
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const rawQuery = {
      userId: searchParams.get('userId'),
      type: searchParams.get('type') || 'full',
    }

    const query = userMemoryQuerySchema.parse(rawQuery)
    const user = await getUserMemory(query.userId)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (query.type === 'history') {
      const history = await getUserServiceHistory(query.userId, 10)
      const daysSince = await daysSinceLastService(query.userId)
      return NextResponse.json({
        history,
        daysSinceLastService: daysSince,
        lastServiceType: user.lastServiceType,
        totalVisits: user.totalVisits,
      })
    } else if (query.type === 'preferences') {
      return NextResponse.json({
        preferredTimeSlot: user.preferredTimeSlot,
        preferredServices: user.preferredServices,
        carBrand: user.carBrand,
        carModel: user.carModel,
      })
    }

    // Full user memory
    return NextResponse.json(user)
  } catch (error) {
    console.error('User memory GET error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch user memory' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/memory/user
 * Create or update user memory
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check operation type
    if (body.operation === 'upsert') {
      const { userId, ...userData } = body
      const validData = upsertUserSchema.parse(userData)

      const updatedUser = await upsertUserMemory(userId, validData)

      return NextResponse.json({
        success: true,
        user: updatedUser,
      })
    } else if (body.operation === 'record_booking') {
      const bookingData = bookingSchema.parse(body)

      await recordBooking(
        bookingData.userId,
        bookingData.bookingId,
        bookingData.service,
        bookingData.rating,
        bookingData.notes
      )

      return NextResponse.json({
        success: true,
        message: 'Booking recorded',
      })
    }

    return NextResponse.json(
      { error: 'Invalid operation' },
      { status: 400 }
    )
  } catch (error) {
    console.error('User memory POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update user memory' },
      { status: 500 }
    )
  }
}
