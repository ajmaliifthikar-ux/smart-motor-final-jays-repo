'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser, FirebaseUser } from '@/lib/firebase-db'

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        // Fetch detailed user info (including role) from Firestore
        const data = await getUser(firebaseUser.uid)
        setDbUser(data)
      } else {
        setDbUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, dbUser, loading, isAdmin: dbUser?.role === 'ADMIN' }
}
