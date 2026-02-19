import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  signInWithPopup,
  type UserCredential,
  type AuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// ─── OAuth Providers ──────────────────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

const twitterProvider = new TwitterAuthProvider();

const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');
appleProvider.setCustomParameters({ response_mode: 'form_post' });

// ─── signInWithProvider helper ────────────────────────────────────────────────

async function signInWithProvider(provider: AuthProvider): Promise<UserCredential> {
  return signInWithPopup(auth, provider);
}

export { auth, googleProvider, twitterProvider, appleProvider, signInWithProvider };
