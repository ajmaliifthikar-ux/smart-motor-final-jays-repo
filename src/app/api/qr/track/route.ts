import { NextRequest, NextResponse } from 'next/server'
import { trackQRCodeScan, getQRCode } from '@/lib/qr-code-generator'
import { UAParser } from 'ua-parser-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { qrId } = await req.json()

    if (!qrId) {
      return NextResponse.json({ error: 'QR ID required' }, { status: 400 })
    }

    // Parse user agent
    const userAgent = req.headers.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    // Track the scan
    await trackQRCodeScan(qrId, {
      browser: result.browser.name || 'unknown',
      device: result.device.type || 'unknown',
      location: req.headers.get('x-forwarded-for') || 'unknown',
      referrer: req.headers.get('referer') || 'direct',
    })

    // Get updated QR code data
    const qrCode = await getQRCode(qrId)

    return NextResponse.json({
      success: true,
      scans: qrCode?.scans || 0,
    })
  } catch (error) {
    console.error('QR track error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to track QR code scan',
      },
      { status: 500 }
    )
  }
}
