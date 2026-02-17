/**
 * QR Code Generator Library
 * Handles QR code creation, storage, and tracking
 */

import QRCode from 'qrcode'
import { Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDoc, updateDoc, doc, increment } from 'firebase/firestore'

export interface QRCodeData {
  id?: string
  code: string // Base64 encoded QR code image
  url: string // URL to encode in QR
  shortCode?: string // Link to short URL if applicable
  createdAt: Timestamp
  expiresAt?: Timestamp
  scans: number
  metadata: {
    campaignName?: string
    description?: string
    source?: string
    medium?: string
  }
  analytics: {
    browsers: Record<string, number>
    devices: Record<string, number>
    locations: Record<string, number>
    referrers: Record<string, number>
    times: Array<{ timestamp: Timestamp; count: number }>
  }
}

export interface QRCodeRequest {
  url: string
  campaignName?: string
  description?: string
  expiresIn?: number // Days until expiration
  size?: number // QR code size
}

/**
 * Generate a QR code and store it in Firestore
 */
export async function generateQRCode(request: QRCodeRequest): Promise<QRCodeData> {
  try {
    const { url, campaignName, description, expiresIn = 365, size = 300 } = request

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })

    // Create Firestore document
    const qrData: Omit<QRCodeData, 'id'> = {
      code: qrCodeDataUrl,
      url,
      createdAt: Timestamp.now(),
      expiresAt: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
        ? Timestamp.fromDate(new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000))
        : undefined,
      scans: 0,
      metadata: {
        campaignName,
        description,
        source: 'smart-motor',
      },
      analytics: {
        browsers: {},
        devices: {},
        locations: {},
        referrers: {},
        times: [],
      },
    }

    // Store in Firestore
    const qrCodeRef = collection(db, 'qr_codes')
    const docRef = await addDoc(qrCodeRef, qrData)

    return {
      ...qrData,
      id: docRef.id,
    }
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Track a QR code scan
 */
export async function trackQRCodeScan(
  qrCodeId: string,
  metadata: {
    browser?: string
    device?: string
    location?: string
    referrer?: string
  }
): Promise<void> {
  try {
    const qrCodeRef = doc(db, 'qr_codes', qrCodeId)
    const qrCodeDoc = await getDoc(qrCodeRef)

    if (!qrCodeDoc.exists()) {
      throw new Error('QR code not found')
    }

    const qrCodeData = qrCodeDoc.data() as QRCodeData

    // Update scan count
    await updateDoc(qrCodeRef, {
      scans: increment(1),
      'analytics.browsers': {
        ...qrCodeData.analytics.browsers,
        [metadata.browser || 'unknown']: (qrCodeData.analytics.browsers[metadata.browser || 'unknown'] || 0) + 1,
      },
      'analytics.devices': {
        ...qrCodeData.analytics.devices,
        [metadata.device || 'unknown']: (qrCodeData.analytics.devices[metadata.device || 'unknown'] || 0) + 1,
      },
      'analytics.locations': {
        ...qrCodeData.analytics.locations,
        [metadata.location || 'unknown']: (qrCodeData.analytics.locations[metadata.location || 'unknown'] || 0) + 1,
      },
      'analytics.referrers': {
        ...qrCodeData.analytics.referrers,
        [metadata.referrer || 'direct']: (qrCodeData.analytics.referrers[metadata.referrer || 'direct'] || 0) + 1,
      },
    })
  } catch (error) {
    console.error('Error tracking QR code scan:', error)
    throw new Error(`Failed to track QR code scan: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get QR code details
 */
export async function getQRCode(qrCodeId: string): Promise<QRCodeData | null> {
  try {
    const qrCodeRef = doc(db, 'qr_codes', qrCodeId)
    const qrCodeDoc = await getDoc(qrCodeRef)

    if (!qrCodeDoc.exists()) {
      return null
    }

    return {
      ...qrCodeDoc.data(),
      id: qrCodeDoc.id,
    } as QRCodeData
  } catch (error) {
    console.error('Error fetching QR code:', error)
    return null
  }
}

/**
 * Get QR code analytics summary
 */
export async function getQRCodeAnalytics(qrCodeId: string) {
  try {
    const qrCode = await getQRCode(qrCodeId)

    if (!qrCode) {
      return null
    }

    return {
      id: qrCode.id,
      campaignName: qrCode.metadata.campaignName,
      totalScans: qrCode.scans,
      createdAt: qrCode.createdAt,
      expiresAt: qrCode.expiresAt,
      topBrowser: Object.entries(qrCode.analytics.browsers).sort(([, a], [, b]) => b - a)[0],
      topDevice: Object.entries(qrCode.analytics.devices).sort(([, a], [, b]) => b - a)[0],
      topLocation: Object.entries(qrCode.analytics.locations).sort(([, a], [, b]) => b - a)[0],
      topReferrer: Object.entries(qrCode.analytics.referrers).sort(([, a], [, b]) => b - a)[0],
    }
  } catch (error) {
    console.error('Error getting QR code analytics:', error)
    return null
  }
}
