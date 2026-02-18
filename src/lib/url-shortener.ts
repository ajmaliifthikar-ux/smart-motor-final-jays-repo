/**
 * URL Shortener Library
 * Handles URL shortening and custom URL creation with tracking
 */

import { Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase-db'
import { collection, addDoc, query, where, getDocs, getDoc, updateDoc, doc, increment } from 'firebase/firestore'
import { nanoid } from 'nanoid'

export interface ShortURLData {
  id?: string
  shortCode: string // e.g., "leyla-booking" or generated code
  originalUrl: string
  customUrl?: string // Custom branded URL
  createdBy?: string // User who created it
  createdAt: Timestamp
  expiresAt?: Timestamp
  clicks: number
  active: boolean
  metadata: {
    campaignName?: string
    description?: string
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
  }
  analytics: {
    browsers: Record<string, number>
    devices: Record<string, number>
    locations: Record<string, number>
    referrers: Record<string, number>
    times: Array<{ timestamp: Timestamp; count: number }>
  }
}

export interface ShortenURLRequest {
  url: string
  customCode?: string // Custom short code (e.g., "leyla-booking")
  campaignName?: string
  description?: string
  expiresIn?: number // Days until expiration
  utm?: {
    source?: string
    medium?: string
    campaign?: string
  }
}

/**
 * Validate if custom code is available
 */
async function isCustomCodeAvailable(code: string): Promise<boolean> {
  try {
    const q = query(collection(db, 'short_urls'), where('shortCode', '==', code.toLowerCase()))
    const snapshot = await getDocs(q)
    return snapshot.empty
  } catch (error) {
    console.error('Error checking custom code:', error)
    return false
  }
}

/**
 * Shorten a URL and store it in Firestore
 */
export async function shortenURL(request: ShortenURLRequest): Promise<ShortURLData> {
  try {
    const { url, customCode, campaignName, description, expiresIn = 365, utm } = request

    // Validate URL
    try {
      new URL(url)
    } catch {
      throw new Error('Invalid URL provided')
    }

    // Generate or validate custom code
    let shortCode: string
    if (customCode) {
      const available = await isCustomCodeAvailable(customCode)
      if (!available) {
        throw new Error(`Custom code "${customCode}" is already taken`)
      }
      shortCode = customCode.toLowerCase()
    } else {
      // Generate a random short code
      shortCode = nanoid(8)
    }

    // Build short URL with UTM params if provided
    let shortURL = `${process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotor.ae'}/s/${shortCode}`
    if (utm) {
      const params = new URLSearchParams()
      if (utm.source) params.append('utm_source', utm.source)
      if (utm.medium) params.append('utm_medium', utm.medium)
      if (utm.campaign) params.append('utm_campaign', utm.campaign)
      if (params.toString()) {
        shortURL += `?${params.toString()}`
      }
    }

    // Create Firestore document
    const urlData: Omit<ShortURLData, 'id'> = {
      shortCode,
      originalUrl: url,
      customUrl: shortURL,
      createdAt: Timestamp.now(),
      expiresAt: expiresIn
        ? Timestamp.fromDate(new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000))
        : undefined,
      clicks: 0,
      active: true,
      metadata: {
        campaignName,
        description,
        utm_source: utm?.source,
        utm_medium: utm?.medium,
        utm_campaign: utm?.campaign,
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
    const shortURLRef = collection(db, 'short_urls')
    const docRef = await addDoc(shortURLRef, urlData)

    return {
      ...urlData,
      id: docRef.id,
    }
  } catch (error) {
    console.error('Error shortening URL:', error)
    throw new Error(`Failed to shorten URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Track a short URL click
 */
export async function trackURLClick(
  shortCode: string,
  metadata: {
    browser?: string
    device?: string
    location?: string
    referrer?: string
  }
): Promise<string | null> {
  try {
    const q = query(collection(db, 'short_urls'), where('shortCode', '==', shortCode.toLowerCase()))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return null
    }

    const urlDoc = snapshot.docs[0]
    const urlData = urlDoc.data() as ShortURLData

    // Check if expired
    if (urlData.expiresAt && urlData.expiresAt.toDate() < new Date()) {
      await updateDoc(urlDoc.ref, { active: false })
      return null
    }

    // Update click count and analytics
    await updateDoc(urlDoc.ref, {
      clicks: increment(1),
      'analytics.browsers': {
        ...urlData.analytics.browsers,
        [metadata.browser || 'unknown']: (urlData.analytics.browsers[metadata.browser || 'unknown'] || 0) + 1,
      },
      'analytics.devices': {
        ...urlData.analytics.devices,
        [metadata.device || 'unknown']: (urlData.analytics.devices[metadata.device || 'unknown'] || 0) + 1,
      },
      'analytics.locations': {
        ...urlData.analytics.locations,
        [metadata.location || 'unknown']: (urlData.analytics.locations[metadata.location || 'unknown'] || 0) + 1,
      },
      'analytics.referrers': {
        ...urlData.analytics.referrers,
        [metadata.referrer || 'direct']: (urlData.analytics.referrers[metadata.referrer || 'direct'] || 0) + 1,
      },
    })

    return urlData.originalUrl
  } catch (error) {
    console.error('Error tracking URL click:', error)
    return null
  }
}

/**
 * Get short URL details
 */
export async function getShortURL(shortCode: string): Promise<ShortURLData | null> {
  try {
    const q = query(collection(db, 'short_urls'), where('shortCode', '==', shortCode.toLowerCase()))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return {
      ...doc.data(),
      id: doc.id,
    } as ShortURLData
  } catch (error) {
    console.error('Error fetching short URL:', error)
    return null
  }
}

/**
 * Get short URL analytics summary
 */
export async function getURLAnalytics(shortCode: string) {
  try {
    const url = await getShortURL(shortCode)

    if (!url) {
      return null
    }

    return {
      id: url.id,
      shortCode: url.shortCode,
      customUrl: url.customUrl,
      originalUrl: url.originalUrl,
      campaignName: url.metadata.campaignName,
      totalClicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      topBrowser: Object.entries(url.analytics.browsers).sort(([, a], [, b]) => b - a)[0],
      topDevice: Object.entries(url.analytics.devices).sort(([, a], [, b]) => b - a)[0],
      topLocation: Object.entries(url.analytics.locations).sort(([, a], [, b]) => b - a)[0],
      topReferrer: Object.entries(url.analytics.referrers).sort(([, a], [, b]) => b - a)[0],
    }
  } catch (error) {
    console.error('Error getting URL analytics:', error)
    return null
  }
}

/**
 * Validate if URL short code is available
 */
export async function validateShortCode(code: string): Promise<{ available: boolean; reason?: string }> {
  try {
    // Check length
    if (code.length < 2 || code.length > 50) {
      return { available: false, reason: 'Code must be between 2 and 50 characters' }
    }

    // Check pattern (alphanumeric, hyphens, underscores only)
    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      return { available: false, reason: 'Code can only contain letters, numbers, hyphens, and underscores' }
    }

    // Check if available
    const available = await isCustomCodeAvailable(code)
    if (!available) {
      return { available: false, reason: 'Code is already taken' }
    }

    return { available: true }
  } catch (error) {
    console.error('Error validating short code:', error)
    return { available: false, reason: 'Error validating code' }
  }
}
