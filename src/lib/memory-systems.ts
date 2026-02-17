/**
 * Memory Systems Core Interface
 * Three-layer memory architecture for agent context
 */

import { Timestamp } from 'firebase/firestore'

// ═══ TYPES ═══

export interface Service {
  id: string
  name: string
  description: string
  duration: number // minutes
  price: number // AED
  category: string // 'maintenance' | 'repair' | 'inspection'
  prerequisites?: string[] // Other services that should be done first
}

export interface Promotion {
  id: string
  title: string
  description: string
  discount: number // percentage (0-100)
  code?: string // Promotional code
  validFrom: Timestamp
  validTo: Timestamp
  services: string[] // IDs of applicable services
  maxUses?: number
  currentUses: number
}

export interface GlobalMemory {
  id: string
  services: Service[]
  promotions: Promotion[]
  businessRules: {
    operatingHours: {
      open: string // "08:00"
      close: string // "18:00"
    }
    holidays: string[] // Date strings
    minBookingAdvance: number // days
    maxBookingAdvance: number // days
    defaultServiceDuration: number // minutes
  }
  recommendations: {
    [carModel: string]: string[] // Recommended services for each car model
  }
  lastUpdated: Timestamp
}

export interface UserMemory {
  id: string
  userId: string
  email: string
  phone: string
  name: string
  carBrand: string
  carModel: string
  carYear?: number
  
  // History
  totalVisits: number
  lastServiceDate?: Timestamp
  lastServiceType?: string
  
  // Preferences
  preferredServices: string[] // Service IDs
  preferredTimeSlot?: 'morning' | 'afternoon' | 'evening'
  
  // Engagement
  promotionsSeen: string[] // Promotion IDs
  bookingHistory: Array<{
    bookingId: string
    date: Timestamp
    service: string
    rating?: number
    notes?: string
  }>
  
  createdAt: Timestamp
  lastUpdated: Timestamp
}

export interface RealtimeMemory {
  id: string
  
  // Active bookings
  activeBookings: Array<{
    bookingId: string
    customerName: string
    service: string
    timeSlot: string
    status: 'in-progress' | 'waiting' | 'completed'
  }>
  
  // Available slots
  availableSlots: Array<{
    date: string
    time: string
    duration: number
    available: boolean
  }>
  
  // Live promotions
  activePromotions: Array<{
    promotionId: string
    title: string
    discountPercent: number
    endsIn: string // "2 hours"
  }>
  
  // Queue
  serviceQueue: Array<{
    position: number
    customerName: string
    estimatedWaitTime: number // minutes
  }>
  
  lastUpdated: Timestamp
}

// ═══ MEMORY INTERFACES ═══

export interface MemorySystem {
  getGlobalMemory(): Promise<GlobalMemory>
  getUserMemory(userId: string): Promise<UserMemory | null>
  getRealtimeMemory(): Promise<RealtimeMemory>
  
  updateGlobalMemory(data: Partial<GlobalMemory>): Promise<void>
  updateUserMemory(userId: string, data: Partial<UserMemory>): Promise<void>
  updateRealtimeMemory(data: Partial<RealtimeMemory>): Promise<void>
}

export interface MemoryContext {
  global: GlobalMemory
  user?: UserMemory
  realtime: RealtimeMemory
}

// ═══ HELPERS ═══

/**
 * Check if a service is available for a user
 */
export function isServiceRecommended(
  global: GlobalMemory,
  user: UserMemory | null,
  serviceId: string
): boolean {
  if (!user) return true // Available for all if no user context
  
  const carModel = user.carModel.toLowerCase()
  const recommendations = global.recommendations[carModel] || []
  
  return recommendations.includes(serviceId)
}

/**
 * Get applicable promotions for a user
 */
export function getApplicablePromotions(
  global: GlobalMemory,
  user: UserMemory | null,
  selectedServices: string[]
): Promotion[] {
  const now = Timestamp.now()
  
  return global.promotions.filter(promo => {
    // Check if active
    if (promo.validFrom > now || promo.validTo < now) return false
    
    // Check if max uses reached
    if (promo.maxUses && promo.currentUses >= promo.maxUses) return false
    
    // Check if user has already seen this
    if (user && user.promotionsSeen.includes(promo.id)) return false
    
    // Check if applicable to selected services
    return selectedServices.some(service => promo.services.includes(service))
  })
}

/**
 * Get service recommendations for a user
 */
export function getServiceRecommendations(
  global: GlobalMemory,
  user: UserMemory
): Service[] {
  const carModel = user.carModel.toLowerCase()
  const recommendedIds = global.recommendations[carModel] || []
  
  return global.services.filter(service =>
    recommendedIds.includes(service.id) && !user.preferredServices.includes(service.id)
  )
}

/**
 * Check if a user is returning customer
 */
export function isReturningCustomer(user: UserMemory | null): boolean {
  return user ? user.totalVisits > 0 : false
}

/**
 * Get customer greeting based on memory
 */
export function getPersonalizedGreeting(user: UserMemory | null): string {
  if (!user) {
    return "Hi! 👋 I'm Leyla from Smart Motor! What's your name?"
  }
  
  const lastService = user.lastServiceDate?.toDate()
  const daysSinceService = lastService
    ? Math.floor((Date.now() - lastService.getTime()) / (1000 * 60 * 60 * 24))
    : null
  
  if (daysSinceService === 1) {
    return `Welcome back, ${user.name}! 👋 Hope your ${user.lastServiceType} went well! How can I help you today?`
  }
  
  if (daysSinceService && daysSinceService < 90) {
    return `Hi ${user.name}! Great to see you again! What can I help you with today? 🚗`
  }
  
  if (user.totalVisits > 5) {
    return `Welcome back, ${user.name}! It's been a while! Ready for some car care? 🚗`
  }
  
  return `Hi ${user.name}! Back for another visit? How can I help? 🚗`
}
