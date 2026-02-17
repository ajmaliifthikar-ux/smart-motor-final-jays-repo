import { NextRequest, NextResponse } from 'next/server'
import { generateQRCode, QRCodeRequest } from '@/lib/qr-code-generator'
import { getAdminSession } from '@/lib/session'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const qrGenerateSchema = z.object({
  url: z.string().url('Invalid URL'),
  campaignName: z.string().optional(),
  description: z.string().optional(),
  expiresIn: z.number().int().positive().optional(),
  size: z.number().int().min(100).max(1000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    // Check admin permission
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Validate request
    const data = qrGenerateSchema.parse(body)

    const qrCodeRequest: QRCodeRequest = {
      url: data.url,
      campaignName: data.campaignName,
      description: data.description,
      expiresIn: data.expiresIn,
      size: data.size,
    }

    // Generate QR code
    const qrCode = await generateQRCode(qrCodeRequest)

    return NextResponse.json(
      {
        success: true,
        data: qrCode,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('QR generate error:', error)

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
        error: error instanceof Error ? error.message : 'Failed to generate QR code',
      },
      { status: 500 }
    )
  }
}
