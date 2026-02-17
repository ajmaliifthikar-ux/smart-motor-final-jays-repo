import { NextRequest, NextResponse } from 'next/server'
import { shortenURL, validateShortCode, ShortenURLRequest } from '@/lib/url-shortener'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const shortenURLSchema = z.object({
  url: z.string().url('Invalid URL'),
  customCode: z.string().optional(),
  campaignName: z.string().optional(),
  description: z.string().optional(),
  expiresIn: z.number().int().positive().optional(),
  utm: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
  }).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate request
    const data = shortenURLSchema.parse(body)

    // Validate custom code if provided
    if (data.customCode) {
      const validation = await validateShortCode(data.customCode)
      if (!validation.available) {
        return NextResponse.json(
          { error: validation.reason || 'Invalid custom code' },
          { status: 400 }
        )
      }
    }

    const shortenRequest: ShortenURLRequest = {
      url: data.url,
      customCode: data.customCode,
      campaignName: data.campaignName,
      description: data.description,
      expiresIn: data.expiresIn,
      utm: data.utm,
    }

    // Shorten URL
    const shortUrl = await shortenURL(shortenRequest)

    return NextResponse.json(
      {
        success: true,
        data: shortUrl,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('URL shorten error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to shorten URL',
      },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to validate if a custom code is available
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json({ error: 'Code parameter required' }, { status: 400 })
    }

    const validation = await validateShortCode(code)

    return NextResponse.json(validation)
  } catch (error) {
    console.error('Validation error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to validate code',
      },
      { status: 500 }
    )
  }
}
