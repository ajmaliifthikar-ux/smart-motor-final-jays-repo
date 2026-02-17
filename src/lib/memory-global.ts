/**
 * Global Memory Library
 * Manages global knowledge shared across all agents and customers
 */

import { db } from '@/lib/firebase'
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { GlobalMemory, Service, Promotion } from './memory-systems'

const GLOBAL_MEMORY_ID = 'global'
const COLLECTION = 'agent_memories'

/**
 * Get global memory from Firestore
 */
export async function getGlobalMemory(): Promise<GlobalMemory> {
  try {
    const docRef = doc(db, COLLECTION, 'global')
    const snapshot = await getDoc(docRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      return {
        id: data.id || GLOBAL_MEMORY_ID,
        services: data.services || [],
        promotions: data.promotions || [],
        businessRules: data.businessRules || getDefaultBusinessRules(),
        recommendations: data.recommendations || {},
        lastUpdated: data.lastUpdated || Timestamp.now(),
      }
    }

    // Return default if doesn't exist
    return getDefaultGlobalMemory()
  } catch (error) {
    console.error('Error getting global memory:', error)
    return getDefaultGlobalMemory()
  }
}

/**
 * Update global memory
 */
export async function updateGlobalMemory(data: Partial<GlobalMemory>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, 'global')
    await updateDoc(docRef, {
      ...data,
      lastUpdated: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating global memory:', error)
    throw error
  }
}

/**
 * Add or update a service
 */
export async function upsertService(service: Service): Promise<void> {
  try {
    const global = await getGlobalMemory()
    const serviceIndex = global.services.findIndex(s => s.id === service.id)

    if (serviceIndex !== -1) {
      global.services[serviceIndex] = service
    } else {
      global.services.push(service)
    }

    await updateGlobalMemory({ services: global.services })
  } catch (error) {
    console.error('Error upserting service:', error)
    throw error
  }
}

/**
 * Get service by ID
 */
export async function getService(serviceId: string): Promise<Service | null> {
  try {
    const global = await getGlobalMemory()
    return global.services.find(s => s.id === serviceId) || null
  } catch (error) {
    console.error('Error getting service:', error)
    return null
  }
}

/**
 * Get all services in a category
 */
export async function getServicesByCategory(category: string): Promise<Service[]> {
  try {
    const global = await getGlobalMemory()
    return global.services.filter(s => s.category === category)
  } catch (error) {
    console.error('Error getting services by category:', error)
    return []
  }
}

/**
 * Add promotion
 */
export async function addPromotion(promotion: Promotion): Promise<void> {
  try {
    const global = await getGlobalMemory()
    global.promotions.push(promotion)
    await updateGlobalMemory({ promotions: global.promotions })
  } catch (error) {
    console.error('Error adding promotion:', error)
    throw error
  }
}

/**
 * Get active promotions
 */
export async function getActivePromotions(): Promise<Promotion[]> {
  try {
    const global = await getGlobalMemory()
    const now = Timestamp.now()

    return global.promotions.filter(
      p => p.validFrom <= now && p.validTo >= now && (!p.maxUses || p.currentUses < p.maxUses)
    )
  } catch (error) {
    console.error('Error getting active promotions:', error)
    return []
  }
}

/**
 * Get default global memory
 */
export function getDefaultGlobalMemory(): GlobalMemory {
  return {
    id: GLOBAL_MEMORY_ID,
    services: getDefaultServices(),
    promotions: getDefaultPromotions(),
    businessRules: getDefaultBusinessRules(),
    recommendations: getDefaultRecommendations(),
    lastUpdated: Timestamp.now(),
  }
}

/**
 * Get default services
 */
function getDefaultServices(): Service[] {
  return [
    {
      id: 'oil-change',
      name: 'Oil Change',
      description: 'Complete oil and filter replacement',
      duration: 30,
      price: 150,
      category: 'maintenance',
    },
    {
      id: 'tire-rotation',
      name: 'Tire Rotation',
      description: 'Rotate and balance all tires',
      duration: 45,
      price: 120,
      category: 'maintenance',
    },
    {
      id: 'brake-service',
      name: 'Brake Service',
      description: 'Brake pad inspection and replacement',
      duration: 60,
      price: 250,
      category: 'maintenance',
      prerequisites: ['brake-inspection'],
    },
    {
      id: 'brake-inspection',
      name: 'Brake Inspection',
      description: 'Full brake system inspection',
      duration: 30,
      price: 50,
      category: 'inspection',
    },
    {
      id: 'battery-replacement',
      name: 'Battery Replacement',
      description: 'Battery replacement and testing',
      duration: 20,
      price: 180,
      category: 'maintenance',
    },
    {
      id: 'air-filter',
      name: 'Air Filter Replacement',
      description: 'Engine air filter replacement',
      duration: 15,
      price: 60,
      category: 'maintenance',
    },
    {
      id: 'full-inspection',
      name: 'Full Vehicle Inspection',
      description: 'Comprehensive vehicle health check',
      duration: 90,
      price: 200,
      category: 'inspection',
    },
  ]
}

/**
 * Get default promotions
 */
function getDefaultPromotions(): Promotion[] {
  const now = Timestamp.now()
  const oneWeekAway = new Timestamp(now.seconds + 7 * 24 * 60 * 60, now.nanoseconds)
  const twoWeeksAway = new Timestamp(now.seconds + 14 * 24 * 60 * 60, now.nanoseconds)

  return [
    {
      id: 'feb-oil-change',
      title: 'February Oil Change Special',
      description: 'Get 20% off oil changes this February',
      discount: 20,
      code: 'OIL20FEB',
      validFrom: now,
      validTo: oneWeekAway,
      services: ['oil-change'],
      maxUses: 50,
      currentUses: 12,
    },
    {
      id: 'maintenance-package',
      title: 'Maintenance Package Bundle',
      description: '15% off when you book 3 or more services',
      discount: 15,
      validFrom: now,
      validTo: twoWeeksAway,
      services: ['oil-change', 'tire-rotation', 'air-filter', 'brake-inspection'],
      currentUses: 8,
    },
  ]
}

/**
 * Get default business rules
 */
function getDefaultBusinessRules() {
  return {
    operatingHours: {
      open: '08:00',
      close: '18:00',
    },
    holidays: ['2026-02-20', '2026-03-20'], // Example holidays
    minBookingAdvance: 1, // days
    maxBookingAdvance: 30, // days
    defaultServiceDuration: 30, // minutes
  }
}

/**
 * Get default recommendations
 */
function getDefaultRecommendations() {
  return {
    'bmw': ['oil-change', 'tire-rotation', 'brake-inspection', 'full-inspection'],
    'audi': ['oil-change', 'tire-rotation', 'brake-service', 'full-inspection'],
    'mercedes': ['oil-change', 'tire-rotation', 'full-inspection'],
    'toyota': ['oil-change', 'tire-rotation', 'air-filter'],
    'honda': ['oil-change', 'tire-rotation', 'air-filter'],
    'default': ['oil-change', 'tire-rotation', 'brake-inspection'],
  }
}

/**
 * Initialize default global memory in Firestore
 */
export async function initializeGlobalMemory(): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION, 'global')
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      const defaultMemory = getDefaultGlobalMemory()
      await setDoc(docRef, defaultMemory)
      console.log('Global memory initialized')
    }
  } catch (error) {
    console.error('Error initializing global memory:', error)
  }
}
