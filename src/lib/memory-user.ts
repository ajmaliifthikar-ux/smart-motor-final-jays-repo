/**
 * User Memory Library
 * Manages per-user memory and history
 */

import { db } from '@/lib/firebase'
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { UserMemory } from './memory-systems'

const COLLECTION = 'agent_memories'

/**
 * Get user memory
 */
export async function getUserMemory(userId: string): Promise<UserMemory | null> {
  try {
    const docRef = doc(db, COLLECTION, 'users', userId)
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      return snapshot.data() as UserMemory
    }

    return null
  } catch (error) {
    console.error('Error getting user memory:', error)
    return null
  }
}

/**
 * Create or update user memory
 */
export async function upsertUserMemory(
  userId: string,
  data: Partial<UserMemory>
): Promise<UserMemory> {
  try {
    const docRef = doc(db, COLLECTION, 'users', userId)
    const existing = await getUserMemory(userId)

    const now = Timestamp.now()
    const userData: UserMemory = {
      id: userId,
      userId,
      email: data.email || existing?.email || '',
      phone: data.phone || existing?.phone || '',
      name: data.name || existing?.name || '',
      carBrand: data.carBrand || existing?.carBrand || '',
      carModel: data.carModel || existing?.carModel || '',
      carYear: data.carYear || existing?.carYear,
      totalVisits: existing ? existing.totalVisits : 1,
      lastServiceDate: data.lastServiceDate || existing?.lastServiceDate,
      lastServiceType: data.lastServiceType || existing?.lastServiceType,
      preferredServices: data.preferredServices || existing?.preferredServices || [],
      preferredTimeSlot: data.preferredTimeSlot || existing?.preferredTimeSlot,
      promotionsSeen: existing?.promotionsSeen || [],
      bookingHistory: existing?.bookingHistory || [],
      createdAt: existing?.createdAt || now,
      lastUpdated: now,
    }

    await setDoc(docRef, userData)
    return userData
  } catch (error) {
    console.error('Error upserting user memory:', error)
    throw error
  }
}

/**
 * Record a booking in user history
 */
export async function recordBooking(
  userId: string,
  bookingId: string,
  service: string,
  rating?: number,
  notes?: string
): Promise<void> {
  try {
    const user = await getUserMemory(userId)
    if (!user) {
      throw new Error(`User ${userId} not found`)
    }

    const newBooking = {
      bookingId,
      date: Timestamp.now(),
      service,
      rating,
      notes,
    }

    user.bookingHistory.push(newBooking)
    user.lastServiceDate = Timestamp.now()
    user.lastServiceType = service
    user.totalVisits = (user.totalVisits || 0) + 1

    await updateDoc(doc(db, COLLECTION, 'users', userId), {
      bookingHistory: user.bookingHistory,
      lastServiceDate: user.lastServiceDate,
      lastServiceType: user.lastServiceType,
      totalVisits: user.totalVisits,
      lastUpdated: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error recording booking:', error)
    throw error
  }
}

/**
 * Add preferred service
 */
export async function addPreferredService(userId: string, serviceId: string): Promise<void> {
  try {
    const user = await getUserMemory(userId)
    if (!user) throw new Error(`User ${userId} not found`)

    if (!user.preferredServices.includes(serviceId)) {
      user.preferredServices.push(serviceId)
      await updateDoc(doc(db, COLLECTION, 'users', userId), {
        preferredServices: user.preferredServices,
        lastUpdated: Timestamp.now(),
      })
    }
  } catch (error) {
    console.error('Error adding preferred service:', error)
    throw error
  }
}

/**
 * Mark promotion as seen
 */
export async function markPromotionSeen(userId: string, promotionId: string): Promise<void> {
  try {
    const user = await getUserMemory(userId)
    if (!user) throw new Error(`User ${userId} not found`)

    if (!user.promotionsSeen.includes(promotionId)) {
      user.promotionsSeen.push(promotionId)
      await updateDoc(doc(db, COLLECTION, 'users', userId), {
        promotionsSeen: user.promotionsSeen,
        lastUpdated: Timestamp.now(),
      })
    }
  } catch (error) {
    console.error('Error marking promotion seen:', error)
    throw error
  }
}

/**
 * Get user service history
 */
export async function getUserServiceHistory(
  userId: string,
  limit?: number
): Promise<UserMemory['bookingHistory']> {
  try {
    const user = await getUserMemory(userId)
    if (!user) return []

    const history = user.bookingHistory.sort((a, b) => {
      const aDate = a.date instanceof Timestamp ? a.date : new Timestamp(0, 0)
      const bDate = b.date instanceof Timestamp ? b.date : new Timestamp(0, 0)
      return bDate.seconds - aDate.seconds
    })

    return limit ? history.slice(0, limit) : history
  } catch (error) {
    console.error('Error getting user service history:', error)
    return []
  }
}

/**
 * Check if user is returning customer
 */
export async function isReturningCustomer(userId: string): Promise<boolean> {
  try {
    const user = await getUserMemory(userId)
    return user ? user.totalVisits > 0 : false
  } catch (error) {
    console.error('Error checking if returning customer:', error)
    return false
  }
}

/**
 * Get days since last service
 */
export async function daysSinceLastService(userId: string): Promise<number | null> {
  try {
    const user = await getUserMemory(userId)
    if (!user || !user.lastServiceDate) return null

    const lastDate =
      user.lastServiceDate instanceof Timestamp
        ? user.lastServiceDate.toDate()
        : new Date(user.lastServiceDate)

    const now = new Date()
    const days = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    return days
  } catch (error) {
    console.error('Error getting days since last service:', error)
    return null
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: {
    preferredTimeSlot?: 'morning' | 'afternoon' | 'evening'
    preferredServices?: string[]
  }
): Promise<void> {
  try {
    const user = await getUserMemory(userId)
    if (!user) throw new Error(`User ${userId} not found`)

    const updateData: any = {
      lastUpdated: Timestamp.now(),
    }

    if (preferences.preferredTimeSlot) {
      updateData.preferredTimeSlot = preferences.preferredTimeSlot
    }

    if (preferences.preferredServices) {
      updateData.preferredServices = preferences.preferredServices
    }

    await updateDoc(doc(db, COLLECTION, 'users', userId), updateData)
  } catch (error) {
    console.error('Error updating user preferences:', error)
    throw error
  }
}
