/**
 * Real-time Memory Library
 * Manages live data: active bookings, available slots, active promotions
 */

import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { RealtimeMemory } from './memory-systems'

const COLLECTION = 'agent_memories'
const REALTIME_ID = 'realtime'

/**
 * Get real-time memory
 */
export async function getRealtimeMemory(): Promise<RealtimeMemory> {
  try {
    const docRef = doc(db, COLLECTION, 'realtime')
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      return {
        id: data.id || REALTIME_ID,
        activeBookings: data.activeBookings || [],
        availableSlots: data.availableSlots || [],
        activePromotions: data.activePromotions || [],
        serviceQueue: data.serviceQueue || [],
        lastUpdated: data.lastUpdated || Timestamp.now(),
      }
    }

    return getDefaultRealtimeMemory()
  } catch (error) {
    console.error('Error getting realtime memory:', error)
    return getDefaultRealtimeMemory()
  }
}

/**
 * Update real-time memory
 */
export async function updateRealtimeMemory(data: Partial<RealtimeMemory>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, 'realtime')
    await updateDoc(docRef, {
      ...data,
      lastUpdated: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating realtime memory:', error)
    throw error
  }
}

/**
 * Add active booking
 */
export async function addActiveBooking(booking: {
  bookingId: string
  customerName: string
  service: string
  timeSlot: string
  status: 'in-progress' | 'waiting' | 'completed'
}): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    realtime.activeBookings.push(booking)
    await updateRealtimeMemory({ activeBookings: realtime.activeBookings })
  } catch (error) {
    console.error('Error adding active booking:', error)
    throw error
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'in-progress' | 'waiting' | 'completed'
): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    const booking = realtime.activeBookings.find(b => b.bookingId === bookingId)

    if (booking) {
      booking.status = status
      await updateRealtimeMemory({ activeBookings: realtime.activeBookings })
    }
  } catch (error) {
    console.error('Error updating booking status:', error)
    throw error
  }
}

/**
 * Remove completed booking
 */
export async function completeBooking(bookingId: string): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    realtime.activeBookings = realtime.activeBookings.filter(b => b.bookingId !== bookingId)
    await updateRealtimeMemory({ activeBookings: realtime.activeBookings })
  } catch (error) {
    console.error('Error completing booking:', error)
    throw error
  }
}

/**
 * Add available time slot
 */
export async function addAvailableSlot(slot: {
  date: string
  time: string
  duration: number
  available: boolean
}): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    realtime.availableSlots.push(slot)
    await updateRealtimeMemory({ availableSlots: realtime.availableSlots })
  } catch (error) {
    console.error('Error adding available slot:', error)
    throw error
  }
}

/**
 * Get available slots for a date
 */
export async function getAvailableSlotsForDate(date: string): Promise<string[]> {
  try {
    const realtime = await getRealtimeMemory()
    return realtime.availableSlots
      .filter(slot => slot.date === date && slot.available)
      .map(slot => slot.time)
  } catch (error) {
    console.error('Error getting available slots:', error)
    return []
  }
}

/**
 * Book a time slot
 */
export async function bookTimeSlot(date: string, time: string): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    const slot = realtime.availableSlots.find(s => s.date === date && s.time === time)

    if (slot) {
      slot.available = false
      await updateRealtimeMemory({ availableSlots: realtime.availableSlots })
    }
  } catch (error) {
    console.error('Error booking time slot:', error)
    throw error
  }
}

/**
 * Add to service queue
 */
export async function addToQueue(customerName: string, estimatedWaitTime: number): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    const position = realtime.serviceQueue.length + 1

    realtime.serviceQueue.push({
      position,
      customerName,
      estimatedWaitTime,
    })

    await updateRealtimeMemory({ serviceQueue: realtime.serviceQueue })
  } catch (error) {
    console.error('Error adding to queue:', error)
    throw error
  }
}

/**
 * Remove from queue
 */
export async function removeFromQueue(customerName: string): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    realtime.serviceQueue = realtime.serviceQueue.filter(q => q.customerName !== customerName)

    // Re-order positions
    realtime.serviceQueue.forEach((q, index) => {
      q.position = index + 1
    })

    await updateRealtimeMemory({ serviceQueue: realtime.serviceQueue })
  } catch (error) {
    console.error('Error removing from queue:', error)
    throw error
  }
}

/**
 * Get current queue position
 */
export async function getQueuePosition(customerName: string): Promise<number | null> {
  try {
    const realtime = await getRealtimeMemory()
    const item = realtime.serviceQueue.find(q => q.customerName === customerName)
    return item ? item.position : null
  } catch (error) {
    console.error('Error getting queue position:', error)
    return null
  }
}

/**
 * Add active promotion
 */
export async function addActivePromotion(promo: {
  promotionId: string
  title: string
  discountPercent: number
  endsIn: string
}): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    realtime.activePromotions.push(promo)
    await updateRealtimeMemory({ activePromotions: realtime.activePromotions })
  } catch (error) {
    console.error('Error adding active promotion:', error)
    throw error
  }
}

/**
 * Remove expired promotion
 */
export async function removeExpiredPromotion(promotionId: string): Promise<void> {
  try {
    const realtime = await getRealtimeMemory()
    realtime.activePromotions = realtime.activePromotions.filter(
      p => p.promotionId !== promotionId
    )
    await updateRealtimeMemory({ activePromotions: realtime.activePromotions })
  } catch (error) {
    console.error('Error removing promotion:', error)
    throw error
  }
}

/**
 * Get default realtime memory
 */
export function getDefaultRealtimeMemory(): RealtimeMemory {
  return {
    id: REALTIME_ID,
    activeBookings: [],
    availableSlots: getDefaultTimeSlots(),
    activePromotions: [],
    serviceQueue: [],
    lastUpdated: Timestamp.now(),
  }
}

/**
 * Generate default time slots for next 30 days
 */
function getDefaultTimeSlots() {
  const slots = []
  const today = new Date()

  for (let day = 0; day < 30; day++) {
    const date = new Date(today)
    date.setDate(date.getDate() + day)
    const dateStr = date.toISOString().split('T')[0]

    // Skip Fridays (5) - day off
    if (date.getDay() === 5) continue

    // Add slots every hour from 8 AM to 6 PM
    for (let hour = 8; hour < 18; hour++) {
      slots.push({
        date: dateStr,
        time: `${hour.toString().padStart(2, '0')}:00`,
        duration: 30,
        available: Math.random() > 0.3, // 70% available by default
      })
    }
  }

  return slots
}

/**
 * Initialize realtime memory in Firestore
 */
export async function initializeRealtimeMemory(): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, 'realtime')
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      const defaultMemory = getDefaultRealtimeMemory()
      await setDoc(docRef, defaultMemory)
      console.log('Realtime memory initialized')
    }
  } catch (error) {
    console.error('Error initializing realtime memory:', error)
  }
}
