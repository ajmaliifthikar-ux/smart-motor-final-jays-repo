import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getUser } from '@/lib/firebase-db'
import { db } from '@/lib/firebase-db'
import { getDocs, collection } from 'firebase/firestore'
import redis from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET() {
    const results: any = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        firebase: {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Unknown',
            database: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL?.includes('firebaseio.com') ? 'Configured' : 'Not configured'
        },
        services: []
    }

    const test = async (name: string, fn: () => Promise<any>) => {
        const start = Date.now()
        try {
            const data = await fn()
            return { name, status: 'WORKING', duration: Date.now() - start, info: data }
        } catch (e: any) {
            return { name, status: 'FAILED', duration: Date.now() - start, error: e.message }
        }
    }

    // 1. Test Firebase Firestore
    results.services.push(await test('Firebase Firestore', async () => {
        const snapshot = await getDocs(collection(db, 'users'))
        return `Connected (${snapshot.size} users)`
    }))

    // 2. Test Redis Cloud
    results.services.push(await test('Redis Cloud', async () => {
        await redis.ping()
        return 'PONG'
    }))

    // 3. Test Gemini (Dedicated Key)
    results.services.push(await test('Gemini AI', async () => {
        const key = process.env.GEMINI_API_KEY || 'AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk'
        const genAI = new GoogleGenerativeAI(key)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
        const res = await model.generateContent('ping')
        return res.response.text().slice(0, 10)
    }))

    // 4. Test Firebase Client API (Simple Fetch)
    results.services.push(await test('Firebase API', async () => {
        const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`, {
            method: 'POST',
            body: JSON.stringify({ email: 'test@test.com', password: 'test', returnSecureToken: true })
        })
        const json = await res.json()
        return json.error ? `Key Valid (Firebase replied: ${json.error.message})` : 'OK'
    }))

    return NextResponse.json(results)
}
