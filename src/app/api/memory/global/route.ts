import { NextRequest, NextResponse } from 'next/server'
import { getGlobalMemory, addPromotion, getActivePromotions } from '@/lib/memory-global'
import { z } from 'zod'

const globalMemoryQuerySchema = z.object({
  type: z.enum(['full', 'services', 'promotions', 'rules']).optional().default('full'),
})

const addPromotionSchema = z.object({
  title: z.string(),
  description: z.string(),
  discount: z.number().min(0).max(100),
  code: z.string().optional(),
  services: z.array(z.string()),
  validDays: z.number().optional().default(7),
  maxUses: z.number().optional(),
})

/**
 * GET /api/memory/global
 * Fetch global memory (services, promotions, business rules)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const rawQuery = {
      type: searchParams.get('type') || 'full',
    }

    const query = globalMemoryQuerySchema.parse(rawQuery)
    const global = await getGlobalMemory()

    let response: any = {}

    if (query.type === 'full') {
      response = global
    } else if (query.type === 'services') {
      response = { services: global.services }
    } else if (query.type === 'promotions') {
      const activePromos = await getActivePromotions()
      response = { promotions: activePromos }
    } else if (query.type === 'rules') {
      response = { businessRules: global.businessRules }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Global memory GET error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch global memory' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/memory/global
 * Add or update global memory (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if this is adding a promotion
    if (body.type === 'promotion') {
      const promoData = addPromotionSchema.parse(body)

      const now = new Date()
      const validTo = new Date(now.getTime() + promoData.validDays * 24 * 60 * 60 * 1000)

      // Import Timestamp for dates
      const { Timestamp } = await import('firebase/firestore')

      await addPromotion({
        id: `promo-${Date.now()}`,
        title: promoData.title,
        description: promoData.description,
        discount: promoData.discount,
        code: promoData.code,
        validFrom: Timestamp.fromDate(now),
        validTo: Timestamp.fromDate(validTo),
        services: promoData.services,
        maxUses: promoData.maxUses,
        currentUses: 0,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Promotion added successfully',
        },
        { status: 201 }
      )
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Global memory POST error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update global memory' },
      { status: 500 }
    )
  }
}
