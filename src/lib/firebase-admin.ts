import admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

if (!admin.apps.length) {
  // Trim trailing newlines — Vercel env vars may have \n appended
  const projectId = (process.env.FIREBASE_PROJECT_ID || '').trim()
  const clientEmail = (process.env.FIREBASE_CLIENT_EMAIL || '').trim()
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim()

  if (!projectId || !clientEmail || !privateKey) {
    console.error('❌ Firebase Admin: Missing required env vars:', {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
    })
  }

  // Only the three required fields — optional fields cause init failures if undefined
  const serviceAccount = {
    type: 'service_account' as const,
    project_id: projectId || '',
    private_key: privateKey,
    client_email: clientEmail || '',
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
        'https://smartmotoruae-default-rtdb.asia-southeast1.firebasedatabase.app',
    })
    console.log('✅ Firebase Admin initialized for project:', projectId)
  } catch (initError) {
    console.error('❌ Firebase Admin initializeApp failed:', initError)
  }
}

export const adminAuth = admin.auth()
// Named Firestore DB: 'smartmotordb' — use firebase-admin/firestore getFirestore with databaseId
export const adminDb = getFirestore(admin.app(), 'smartmotordb')

// ─── Serialization helper — converts Firestore Timestamps to ISO strings ─────
// Required so data can cross the Server→Client component boundary as plain objects
function serializeDoc(data: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && typeof value.toDate === 'function') {
      // Firestore Timestamp — convert to ISO string
      result[key] = value.toDate().toISOString()
    } else if (value && typeof value === 'object' && '_seconds' in value && '_nanoseconds' in value) {
      // Firestore Timestamp plain object form
      result[key] = new Date(value._seconds * 1000).toISOString()
    } else if (Array.isArray(value)) {
      result[key] = value.map(v =>
        v && typeof v === 'object' ? serializeDoc(v) : v
      )
    } else if (value && typeof value === 'object' && value.constructor?.name === 'Object') {
      result[key] = serializeDoc(value)
    } else {
      result[key] = value
    }
  }
  return result
}

// ─── Server-side data fetchers (use these in Server Components) ───────────────

export async function adminGetAllServices() {
  try {
    const snapshot = await adminDb
      .collection('services')
      .where('active', '==', true)
      .get()
    return snapshot.docs.map(doc => serializeDoc({ id: doc.id, ...doc.data() })) as any[]
  } catch (error) {
    console.error('adminGetAllServices error:', error)
    return []
  }
}

export async function adminGetAllBrands() {
  try {
    const snapshot = await adminDb
      .collection('brands')
      .orderBy('name', 'asc')
      .get()
    return snapshot.docs.map(doc => serializeDoc({ id: doc.id, ...doc.data() })) as any[]
  } catch (error) {
    console.error('adminGetAllBrands error:', error)
    return []
  }
}

export async function adminGetAllPublishedContent(type?: string) {
  try {
    let query = adminDb.collection('content').where('published', '==', true)
    if (type) query = (query as any).where('type', '==', type)
    const snapshot = await (query as any).orderBy('createdAt', 'desc').get()
    return snapshot.docs.map((doc: any) => serializeDoc({ id: doc.id, ...doc.data() })) as any[]
  } catch (error) {
    console.error('adminGetAllPublishedContent error:', error)
    return []
  }
}

export async function adminGetContentBlock(key: string) {
  try {
    const doc = await adminDb.collection('contentBlocks').doc(key).get()
    return doc.exists ? serializeDoc(doc.data()!) : null
  } catch (error) {
    console.error(`adminGetContentBlock error for ${key}:`, error)
    return null
  }
}

export async function verifySession(token: string | undefined) {
    if (!token) return null;

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        
        // Fallback: Check for explicit role OR the specific admin email
        // We also check if the email domain is @smartmotor.ae for broader internal access if needed
        const isAdmin = decodedToken.role === 'ADMIN' || 
                        decodedToken.email === 'admin@smartmotor.ae' || 
                        decodedToken.email === 'dev@smartmotor.ae' ||
                        (decodedToken.email?.endsWith('@smartmotor.ae') ?? false);
        
        if (!isAdmin) {
            console.warn('Unauthorized access attempt by non-admin:', decodedToken.email);
            return null;
        }
        return decodedToken;
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}

export default admin
