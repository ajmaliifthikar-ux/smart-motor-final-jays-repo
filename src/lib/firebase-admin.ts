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

// ─── Server-side data fetchers (use these in Server Components) ───────────────

export async function adminGetAllServices() {
  try {
    const snapshot = await adminDb
      .collection('services')
      .where('active', '==', true)
      .get()
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
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
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as any[]
  } catch (error) {
    console.error('adminGetAllPublishedContent error:', error)
    return []
  }
}

export async function verifySession(token: string | undefined) {
    if (!token) return null;

    // --- MOCK AUTHENTICATION BYPASS ---
    // Allow access if the special mock token is present.
    // This enables safe testing of the Admin UI without Firebase restrictions.
    if (token === 'mock-token-secret-123') {
        console.warn('⚠️ MOCK AUTH: Granting Admin Access via Mock Token');
        return {
            uid: 'mock-admin-user',
            email: 'mock@smartmotor.ae',
            email_verified: true,
            role: 'ADMIN',
            name: 'Mock Admin'
        };
    }

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
