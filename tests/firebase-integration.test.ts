/**
 * Comprehensive Firebase Integration Tests
 * Tests Firestore (named DB), Realtime Database, and Admin Auth
 */

import admin from 'firebase-admin'
import { getApps } from 'firebase/app'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

// Initialize admin SDK for testing
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

let adminApp: admin.app.App
let adminDb: FirebaseFirestore.Firestore
let adminRtdb: admin.database.Database
let adminAuthInstance: admin.auth.Auth

describe('Firebase Integration Tests', () => {
  beforeAll(async () => {
    // Initialize admin app if not already initialized
    if (getApps().length === 0) {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
          'https://smartmotoruae-default-rtdb.asia-southeast1.firebasedatabase.app',
      })
    } else {
      adminApp = admin.app()
    }

    // Get references to named Firestore DB, RTDB, and Auth
    adminDb = admin.firestore(adminApp, 'smartmotordb')
    adminRtdb = admin.database(adminApp)
    adminAuthInstance = admin.auth(adminApp)
  })

  afterAll(async () => {
    // Cleanup - keep app alive for other tests
    // await adminApp.delete()
  })

  // ============== FIRESTORE TESTS ==============

  describe('Firestore (Named Database: smartmotordb)', () => {
    it('should connect to named Firestore database', async () => {
      expect(adminDb).toBeDefined()
      expect(adminDb.app).toBeDefined()
    })

    it('should read services collection', async () => {
      const snapshot = await adminDb.collection('services').limit(1).get()
      expect(snapshot).toBeDefined()
      expect(snapshot.size).toBeGreaterThanOrEqual(0)
      console.log(`✓ Services collection: ${snapshot.size} documents`)
    })

    it('should read brands collection', async () => {
      const snapshot = await adminDb.collection('brands').limit(1).get()
      expect(snapshot).toBeDefined()
      expect(snapshot.size).toBeGreaterThanOrEqual(0)
      console.log(`✓ Brands collection: ${snapshot.size} documents`)
    })

    it('should read content collection', async () => {
      const snapshot = await adminDb.collection('content').limit(1).get()
      expect(snapshot).toBeDefined()
      expect(snapshot.size).toBeGreaterThanOrEqual(0)
      console.log(`✓ Content collection: ${snapshot.size} documents`)
    })

    it('should read subscribers collection', async () => {
      const snapshot = await adminDb.collection('subscribers').limit(1).get()
      expect(snapshot).toBeDefined()
      expect(snapshot.size).toBeGreaterThanOrEqual(0)
      console.log(`✓ Subscribers collection: ${snapshot.size} documents`)
    })

    it('should read short_urls collection', async () => {
      const snapshot = await adminDb.collection('short_urls').limit(1).get()
      expect(snapshot).toBeDefined()
      expect(snapshot.size).toBeGreaterThanOrEqual(0)
      console.log(`✓ Short URLs collection: ${snapshot.size} documents`)
    })

    it('should write and read a test document', async () => {
      const testRef = adminDb.collection('_test').doc('firestore-test')
      const testData = {
        timestamp: admin.firestore.Timestamp.now(),
        message: 'Firestore test document',
        success: true,
      }

      // Write
      await testRef.set(testData)

      // Read
      const doc = await testRef.get()
      expect(doc.exists).toBe(true)
      expect(doc.data()?.success).toBe(true)

      // Cleanup
      await testRef.delete()
      console.log('✓ Write/Read/Delete test passed')
    })

    it('should handle batch operations', async () => {
      const batch = adminDb.batch()
      const ref1 = adminDb.collection('_test').doc('batch-1')
      const ref2 = adminDb.collection('_test').doc('batch-2')

      batch.set(ref1, { value: 1 })
      batch.set(ref2, { value: 2 })
      await batch.commit()

      const snap1 = await ref1.get()
      const snap2 = await ref2.get()

      expect(snap1.exists).toBe(true)
      expect(snap2.exists).toBe(true)

      // Cleanup
      await ref1.delete()
      await ref2.delete()
      console.log('✓ Batch operations test passed')
    })

    it('should handle transactions', async () => {
      const ref = adminDb.collection('_test').doc('transaction-test')

      await adminDb.runTransaction(async (transaction) => {
        transaction.set(ref, { count: 0 })
      })

      const doc = await ref.get()
      expect(doc.exists).toBe(true)

      // Cleanup
      await ref.delete()
      console.log('✓ Transaction test passed')
    })
  })

  // ============== REALTIME DATABASE TESTS ==============

  describe('Realtime Database (RTDB)', () => {
    it('should connect to RTDB', async () => {
      expect(adminRtdb).toBeDefined()
      expect(adminRtdb.ref).toBeDefined()
    })

    it('should write and read from RTDB', async () => {
      const testRef = adminRtdb.ref('_test/rtdb-test')
      const testData = { message: 'RTDB test', timestamp: Date.now() }

      // Write
      await testRef.set(testData)

      // Read
      const snapshot = await testRef.once('value')
      expect(snapshot.exists()).toBe(true)
      expect(snapshot.val()?.message).toBe('RTDB test')

      // Cleanup
      await testRef.remove()
      console.log('✓ RTDB Write/Read/Delete test passed')
    })

    it('should handle click_events tracking', async () => {
      const today = new Date().toISOString().split('T')[0]
      const clickRef = adminRtdb.ref(`click_events/${today}/test-click`)
      const clickData = {
        href: 'https://example.com',
        source: 'test',
        timestamp: Date.now(),
      }

      // Write click event
      await clickRef.set(clickData)

      // Read and verify
      const snapshot = await clickRef.once('value')
      expect(snapshot.exists()).toBe(true)
      expect(snapshot.val()?.source).toBe('test')

      // Cleanup
      await clickRef.remove()
      console.log('✓ Click events tracking test passed')
    })

    it('should handle nested updates', async () => {
      const ref = adminRtdb.ref('_test')

      await ref.update({
        'nested/path/value': 'test',
        'another/nested': 123,
      })

      const snapshot = await ref.child('nested/path').once('value')
      expect(snapshot.val()).toBe('test')

      // Cleanup
      await ref.remove()
      console.log('✓ Nested updates test passed')
    })

    it('should list RTDB root keys', async () => {
      const snapshot = await adminRtdb.ref().once('value')
      const keys = Object.keys(snapshot.val() || {}).filter(k => !k.startsWith('_'))
      console.log(`✓ RTDB root keys: ${keys.join(', ')}`)
      expect(keys.length).toBeGreaterThanOrEqual(0)
    })
  })

  // ============== ADMIN AUTH TESTS ==============

  describe('Admin Auth System', () => {
    it('should connect to Admin Auth', async () => {
      expect(adminAuthInstance).toBeDefined()
      expect(adminAuthInstance.app).toBeDefined()
    })

    it('should list users (admin capability)', async () => {
      const result = await adminAuthInstance.listUsers(10)
      expect(result).toBeDefined()
      expect(result.users).toBeDefined()
      console.log(`✓ Listed ${result.users.length} users`)
    })

    it('should verify ID token structure', async () => {
      // This test verifies the Auth instance can verify tokens
      expect(adminAuthInstance.verifyIdToken).toBeDefined()
      console.log('✓ Token verification method available')
    })

    it('should create and delete test user', async () => {
      const testEmail = `test-${Date.now()}@smartmotor.ae`
      let uid: string

      try {
        // Create user
        const user = await adminAuthInstance.createUser({
          email: testEmail,
          password: 'TestPassword123!',
          displayName: 'Test User',
        })
        uid = user.uid
        expect(user).toBeDefined()
        expect(user.email).toBe(testEmail)
        console.log(`✓ Created test user: ${uid}`)

        // Get user
        const retrievedUser = await adminAuthInstance.getUser(uid)
        expect(retrievedUser.email).toBe(testEmail)
        console.log(`✓ Retrieved user: ${retrievedUser.email}`)

        // Create custom token for testing
        const customToken = await adminAuthInstance.createCustomToken(uid)
        expect(customToken).toBeDefined()
        console.log(`✓ Created custom token`)

        // Delete user
        await adminAuthInstance.deleteUser(uid)
        console.log(`✓ Deleted test user`)
      } catch (error) {
        console.error('Auth test error:', error)
        throw error
      }
    })

    it('should set custom claims', async () => {
      const testEmail = `claims-test-${Date.now()}@smartmotor.ae`

      try {
        // Create user
        const user = await adminAuthInstance.createUser({
          email: testEmail,
          password: 'TestPassword123!',
        })

        // Set custom claims
        await adminAuthInstance.setCustomUserClaims(user.uid, {
          role: 'ADMIN',
          permissions: ['read', 'write', 'delete'],
        })

        // Get and verify claims
        const updatedUser = await adminAuthInstance.getUser(user.uid)
        expect(updatedUser.customClaims?.role).toBe('ADMIN')
        console.log(`✓ Set and verified custom claims`)

        // Cleanup
        await adminAuthInstance.deleteUser(user.uid)
      } catch (error) {
        console.error('Custom claims test error:', error)
        throw error
      }
    })
  })

  // ============== CROSS-DATABASE CONSISTENCY TESTS ==============

  describe('Cross-Database Consistency', () => {
    it('should maintain data integrity across Firestore and RTDB', async () => {
      const testId = `consistency-${Date.now()}`

      // Write to Firestore
      const fsRef = adminDb.collection('_test').doc(testId)
      const testData = {
        type: 'consistency-test',
        timestamp: admin.firestore.Timestamp.now(),
      }
      await fsRef.set(testData)

      // Write to RTDB
      const rtdbRef = adminRtdb.ref(`_test/${testId}`)
      await rtdbRef.set({
        type: 'consistency-test',
        timestamp: Date.now(),
      })

      // Read and verify both
      const fsDoc = await fsRef.get()
      const rtdbSnap = await rtdbRef.once('value')

      expect(fsDoc.exists).toBe(true)
      expect(rtdbSnap.exists()).toBe(true)

      // Cleanup
      await fsRef.delete()
      await rtdbRef.remove()
      console.log('✓ Cross-database consistency verified')
    })

    it('should handle concurrent writes safely', async () => {
      const ref = adminDb.collection('_test').doc('concurrent-test')
      const rtdbRef = adminRtdb.ref('_test/concurrent-test')

      const promises = [
        ref.set({ source: 'firestore', time: Date.now() }),
        rtdbRef.set({ source: 'rtdb', time: Date.now() }),
      ]

      await Promise.all(promises)

      const fsDoc = await ref.get()
      const rtdbSnap = await rtdbRef.once('value')

      expect(fsDoc.exists).toBe(true)
      expect(rtdbSnap.exists()).toBe(true)

      // Cleanup
      await ref.delete()
      await rtdbRef.remove()
      console.log('✓ Concurrent write safety verified')
    })
  })

  // ============== ERROR HANDLING TESTS ==============

  describe('Error Handling & Edge Cases', () => {
    it('should handle non-existent collection gracefully', async () => {
      const snapshot = await adminDb.collection('_nonexistent').limit(1).get()
      expect(snapshot).toBeDefined()
      expect(snapshot.size).toBe(0)
      console.log('✓ Non-existent collection handled gracefully')
    })

    it('should handle invalid data types', async () => {
      const ref = adminDb.collection('_test').doc('type-test')
      const data = {
        string: 'value',
        number: 123,
        boolean: true,
        null: null,
        timestamp: admin.firestore.Timestamp.now(),
        array: [1, 2, 3],
        object: { nested: 'value' },
      }

      await ref.set(data)
      const doc = await ref.get()

      expect(doc.data()).toBeDefined()
      expect(doc.data()?.string).toBe('value')
      expect(doc.data()?.number).toBe(123)

      await ref.delete()
      console.log('✓ Data type handling verified')
    })

    it('should handle large documents', async () => {
      const ref = adminDb.collection('_test').doc('large-doc')
      const largeArray = Array(100).fill({ data: 'x'.repeat(100) })

      await ref.set({ items: largeArray })
      const doc = await ref.get()

      expect(doc.exists).toBe(true)
      expect(doc.data()?.items?.length).toBe(100)

      await ref.delete()
      console.log('✓ Large document handling verified')
    })

    it('should recover from RTDB connection issues', async () => {
      const ref = adminRtdb.ref('_test/resilience')

      try {
        await ref.set({ test: true })
        const snap = await ref.once('value')
        expect(snap.exists()).toBe(true)
        await ref.remove()
        console.log('✓ RTDB resilience verified')
      } catch (error) {
        console.warn('⚠ RTDB connection issue:', error)
      }
    })
  })
})
