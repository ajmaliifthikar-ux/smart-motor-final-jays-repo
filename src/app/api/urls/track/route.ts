import { NextRequest, NextResponse } from 'next/server'
import { trackURLClick, getURLAnalytics } from '@/lib/url-shortener'
import { UAParser } from 'ua-parser-js'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams, pathname } = new URL(req.url)
    
    // Extract short code from pathname: /s/[shortCode]
    const shortCode = pathname.split('/').pop()

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
      location: req.headers.get('x-forwarded-for') || 'unknown',
      referrer: req.headers.get('referer') || 'direct',
    })

    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Short URL not found or expired' },
        { status: 404 }
      )
    }

    // Add source tracking if requested
    const source = searchParams.get('source')
    const finalUrl = new URL(originalUrl)
    if (source) {
      finalUrl.searchParams.append('_source', source)
    }

    // Redirect to original URL
    return NextResponse.redirect(finalUrl.toString(), 301)
  } catch (error) {
    console.error('URL track error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to process short URL',
      },
      { status: 500 }
    )
  }
}

/**
 * GET analytics for a short URL
 */
export async function POST(req: NextRequest) {
  try {
    const { shortCode } = await req.json()

    if (!shortCode) {
      return NextResponse.json({ error: 'Short code required' }, { status: 400 })
    }

    const analytics = await getURLAnalytics(shortCode)

    if (!analytics) {
      return NextResponse.json({ error: 'Short URL not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get analytics',
      },
      { status: 500 }
    )
  }
}
