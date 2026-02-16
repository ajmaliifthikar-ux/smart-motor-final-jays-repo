import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  WriteBatch,
  writeBatch,
  QueryConstraint,
} from 'firebase/firestore'
import { initializeApp, getApps } from 'firebase/app'

// Initialize Firestore
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Avoid re-initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)

// ─── USER MANAGEMENT ───

export interface FirebaseUser {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'CUSTOMER' | 'STAFF'
  image?: string
  phone?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt?: Timestamp | null
}

export async function getUser(userId: string): Promise<FirebaseUser | null> {
  try {
    const docRef = doc(db, 'users', userId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as FirebaseUser) : null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<FirebaseUser | null> {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email))
    const querySnapshot = await getDocs(q)
    return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as FirebaseUser)
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

export async function createUser(
  userId: string,
  userData: Omit<FirebaseUser, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  try {
    const now = Timestamp.now()
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: now,
      updatedAt: now,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function updateUser(userId: string, updates: Partial<FirebaseUser>): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

// ─── BOOKING MANAGEMENT ───

export interface FirebaseBooking {
  id: string
  userId?: string
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  vehicleBrand?: string
  vehicleModel?: string
  serviceId: string
  date: Timestamp
  slot: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export async function getBooking(bookingId: string): Promise<FirebaseBooking | null> {
  try {
    const docRef = doc(db, 'bookings', bookingId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as FirebaseBooking) : null
  } catch (error) {
    console.error('Error fetching booking:', error)
    return null
  }
}

export async function getUserBookings(userId: string): Promise<FirebaseBooking[]> {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as FirebaseBooking)
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return []
  }
}

export async function getBookingsByDate(date: Date): Promise<FirebaseBooking[]> {
  try {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const q = query(
      collection(db, 'bookings'),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('date', 'asc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as FirebaseBooking)
  } catch (error) {
    console.error('Error fetching bookings by date:', error)
    return []
  }
}

export async function createBooking(
  bookingData: Omit<FirebaseBooking, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const newDocRef = doc(collection(db, 'bookings'))
    const now = Timestamp.now()
    await setDoc(newDocRef, {
      ...bookingData,
      createdAt: now,
      updatedAt: now,
    })
    return newDocRef.id
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

export async function updateBooking(bookingId: string, updates: Partial<FirebaseBooking>): Promise<void> {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating booking:', error)
    throw error
  }
}

// ─── SERVICE MANAGEMENT ───

export interface FirebaseService {
  id: string
  slug: string
  name: string
  nameAr: string
  description: string
  descriptionAr?: string
  detailedDescription?: string
  category?: string
  basePrice?: number
  duration: string
  icon?: string
  image?: string
  active: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export async function getService(serviceId: string): Promise<FirebaseService | null> {
  try {
    const docRef = doc(db, 'services', serviceId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as FirebaseService) : null
  } catch (error) {
    console.error('Error fetching service:', error)
    return null
  }
}

export async function getServiceBySlug(slug: string): Promise<FirebaseService | null> {
  try {
    const q = query(collection(db, 'services'), where('slug', '==', slug))
    const querySnapshot = await getDocs(q)
    return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as FirebaseService)
  } catch (error) {
    console.error('Error fetching service by slug:', error)
    return null
  }
}

export async function getAllServices(): Promise<FirebaseService[]> {
  try {
    const q = query(collection(db, 'services'), where('active', '==', true))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as FirebaseService)
  } catch (error) {
    console.error('Error fetching services:', error)
    return []
  }
}

export async function createService(
  serviceData: Omit<FirebaseService, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const newDocRef = doc(collection(db, 'services'))
    const now = Timestamp.now()
    await setDoc(newDocRef, {
      ...serviceData,
      active: true,
      createdAt: now,
      updatedAt: now,
    })
    return newDocRef.id
  } catch (error) {
    console.error('Error creating service:', error)
    throw error
  }
}

export async function updateService(serviceId: string, updates: Partial<FirebaseService>): Promise<void> {
  try {
    await updateDoc(doc(db, 'services', serviceId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating service:', error)
    throw error
  }
}

// ─── ANALYTICS & CONTENT ───

export interface FirebaseContent {
  id: string
  type: 'PAGE' | 'BLOG' | 'FAQ' | 'TESTIMONIAL'
  title: string
  titleAr?: string
  slug: string
  content: string
  contentAr?: string
  author?: string
  published: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export async function getContent(contentId: string): Promise<FirebaseContent | null> {
  try {
    const docRef = doc(db, 'content', contentId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as FirebaseContent) : null
  } catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
}

export async function getContentBySlug(slug: string): Promise<FirebaseContent | null> {
  try {
    const q = query(collection(db, 'content'), where('slug', '==', slug), where('published', '==', true))
    const querySnapshot = await getDocs(q)
    return querySnapshot.empty ? null : (querySnapshot.docs[0].data() as FirebaseContent)
  } catch (error) {
    console.error('Error fetching content by slug:', error)
    return null
  }
}

export async function getAllPublishedContent(type?: string): Promise<FirebaseContent[]> {
  try {
    let q
    if (type) {
      q = query(
        collection(db, 'content'),
        where('published', '==', true),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      )
    } else {
      q = query(
        collection(db, 'content'),
        where('published', '==', true),
        orderBy('createdAt', 'desc')
      )
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as FirebaseContent)
  } catch (error) {
    console.error('Error fetching content:', error)
    return []
  }
}

export async function createContent(
  contentData: Omit<FirebaseContent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const newDocRef = doc(collection(db, 'content'))
    const now = Timestamp.now()
    await setDoc(newDocRef, {
      ...contentData,
      createdAt: now,
      updatedAt: now,
    })
    return newDocRef.id
  } catch (error) {
    console.error('Error creating content:', error)
    throw error
  }
}

export async function updateContent(contentId: string, updates: Partial<FirebaseContent>): Promise<void> {
  try {
    await updateDoc(doc(db, 'content', contentId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating content:', error)
    throw error
  }
}

// ─── BATCH OPERATIONS ───

export async function batchWrite(callback: (batch: WriteBatch) => Promise<void>): Promise<void> {
  const batch = writeBatch(db)
  try {
    await callback(batch)
    await batch.commit()
  } catch (error) {
    console.error('Error in batch write:', error)
    throw error
  }
}

// ─── UTILITY FUNCTIONS ───

export function convertTimestampToDate(timestamp: Timestamp): Date {
  return timestamp.toDate()
}

export function convertDateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}
