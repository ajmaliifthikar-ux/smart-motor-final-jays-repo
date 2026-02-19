'use client'

import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUser, FirebaseUser } from '@/lib/firebase-db'
import { useSession } from 'next-auth/react'

export function useFirebaseAuth() {
  const { data: session, status: sessionStatus } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        const data = await getUser(firebaseUser.uid)
        setDbUser(data)
      } else {
        setDbUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const nextAuthAdmin = session?.user?.role === 'ADMIN'
  const firebaseAdmin = dbUser?.role === 'ADMIN'
  const isLoading = loading && sessionStatus === 'loading'

  return { 
    user, 
    dbUser, 
    loading: isLoading, 
    isAdmin: nextAuthAdmin || firebaseAdmin 
  }
}
