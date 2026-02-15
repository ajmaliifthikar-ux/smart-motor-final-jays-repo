// Car brands supported
export type CarBrand = 'mercedes' | 'bmw' | 'audi' | 'porsche' | 'range-rover' | 'bentley' | 'lamborghini' | 'bugatti' | 'rollsroyce' | 'ferrari'

export interface Car {
  id: string
  brand: CarBrand
  brandName: string
  modelName: string
  modelPath?: string
  color: string
}

export interface Service {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  category: ServiceCategory
  basePrice?: number // Made optional for MVP (Prices Hidden)
  duration: string
  icon: string
  iconImage?: string // Path to PNG icon for V2
  image?: string
  detailedDescription?: string
  process?: { step: string; title: string; desc: string }[]
  subServices?: {
    title: string
    description: string
    features: string[]
    image?: string
  }[]
  seo?: { title: string; description: string }
}

export type ServiceCategory =
  | 'mechanical'
  | 'bodyshop'
  | 'ppf'
  | 'ceramic'
  | 'tinting'
  | 'detailing'
  | 'towing'

export interface Booking {
  id: string
  userId?: string
  vehicleId?: string
  guestName?: string
  guestPhone?: string
  guestEmail?: string
  serviceIds: string[]
  preferredDate: string
  preferredTime: string
  status: BookingStatus
  notes?: string
  totalAmount?: number
  source: 'web' | 'app' | 'callback' | 'walkin'
  createdAt: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

export interface Testimonial {
  id: string
  name: string
  rating: number
  comment: string
  carBrand: CarBrand
  date: string
  avatar?: string
}

export interface FAQ {
  id: string
  question: string
  questionAr: string
  answer: string
  answerAr: string
  category?: string
}

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  phone?: string
  role: 'customer' | 'admin'
  image?: string
  preferredLanguage?: 'en' | 'ar'
  loyaltyTier?: LoyaltyTier
  loyaltyPoints?: number
  carInfo?: {
    brand: string
    model: string
    plate: string
  }
}

export interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface Vehicle {
  id: string
  userId: string
  make: string
  model: string
  year: number
  plateNumber?: string
  vin?: string
  color?: string
  photoUrl?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Brand {
  id: string
  name: string
  nameAr: string
  color: string
  models: string[]
  heritage: string
  heritageAr: string
}
