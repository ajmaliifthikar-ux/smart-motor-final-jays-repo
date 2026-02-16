import admin from 'firebase-admin'

if (!admin.apps.length) {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  })
}

export const adminAuth = admin.auth()
export const adminDb = admin.firestore()

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
