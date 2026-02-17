import { NextRequest, NextResponse } from 'next/server'
import { trackURLClick } from '@/lib/url-shortener'
import { UAParser } from 'ua-parser-js'

export const dynamic = 'force-dynamic'

/**
 * GET /s/[shortCode] - Redirect to original URL and track click
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ shortCode: string }> }) {
  try {
    const { shortCode } = await params

    if (!shortCode) {
      return NextResponse.json({ error: 'Short code required' }, { status: 400 })
    }

    // Parse user agent for analytics
    const userAgent = req.headers.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    // Track the click and get original URL
    const originalUrl = await trackURLClick(shortCode, {
      browser: result.browser.name || 'unknown',
      device: result.device.type || 'unknown',
      location: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || 'unknown',
      referrer: req.headers.get('referer') || 'direct',
    })

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Short URL not found or expired' },
        { status: 404 }
      )
    }

    // Redirect to original URL with 301 (permanent)
    return NextResponse.redirect(originalUrl, 301)
  } catch (error) {
    console.error('Short URL redirect error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process short URL',
      },
      { status: 500 }
    )
  }
}
