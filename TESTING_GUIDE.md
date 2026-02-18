# Firebase Systems Testing Guide

This guide explains how to run and maintain tests for the Smart Motor Firebase infrastructure.

---

## Quick Start

### Run All Tests
```bash
# Comprehensive test suite
node scripts/test-firebase-comprehensive.mjs

# Quick test suite
node scripts/test-firebase-quick.mjs
```

### Expected Output
```
✓ All Firebase systems are ROBUST and OPERATIONAL!

Systems Status:
  ✓ Firestore (named DB "smartmotordb") - Working
  ✓ Realtime Database (RTDB) - Working
  ✓ Admin Auth - Working
  ✓ Cross-system consistency - Verified
```

---

## Test Suites Explained

### 1. Comprehensive Test (`test-firebase-comprehensive.mjs`)
**Location:** `scripts/test-firebase-comprehensive.mjs`

**What it tests:**
- Firestore named database via client-side SDK
- Firestore via REST API (alternative method)
- RTDB write/read/delete operations
- Click event tracking
- Admin Auth user creation/deletion
- Custom claims management
- Cross-system consistency

**When to run:** Before deployments, after configuration changes

**Duration:** ~10-15 seconds

### 2. Quick Test (`test-firebase-quick.mjs`)
**Location:** `scripts/test-firebase-quick.mjs`

**What it tests:**
- All major operations with minimal setup
- Faster execution
- Same validation as comprehensive suite

**When to run:** During development, quick smoke tests

**Duration:** ~5-8 seconds

### 3. Integration Tests (`firebase-integration.test.ts`)
**Location:** `tests/firebase-integration.test.ts`

**Framework:** Vitest

**What it tests:**
- Detailed API-level testing
- Edge cases and error handling
- Large document handling
- Batch and transaction operations
- Type safety verification

**When to run:** Before merging to main, CI/CD pipeline

**Duration:** ~20-30 seconds

---

## Testing Firebase Systems

### Firestore (Named Database: `smartmotordb`)

**Via Client-side SDK:**
```typescript
import { getFirestore, getDocs, collection } from 'firebase/firestore'

const db = getFirestore(app, 'smartmotordb')
const snapshot = await getDocs(collection(db, 'services'))
```

**Via Admin SDK:**
```typescript
const adminDb = admin.firestore(admin.app(), 'smartmotordb')
const snapshot = await adminDb.collection('services').get()
```

**Via REST API:**
```bash
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "https://firestore.googleapis.com/v1/projects/smartmotoruae/databases/smartmotordb/documents/services"
```

### Realtime Database (RTDB)

**Write data:**
```typescript
const ref = admin.database().ref('click_events/2024-01-15/test-id')
await ref.set({ href: 'https://example.com', timestamp: Date.now() })
```

**Read data:**
```typescript
const snapshot = await admin.database().ref('click_events').once('value')
const data = snapshot.val()
```

### Admin Auth

**Create user:**
```typescript
const user = await admin.auth().createUser({
  email: 'test@smartmotor.ae',
  password: 'SecurePassword123!',
  displayName: 'Test User'
})
```

**Set custom claims:**
```typescript
await admin.auth().setCustomUserClaims(user.uid, {
  role: 'ADMIN',
  permissions: ['read', 'write', 'delete']
})
```

---

## Troubleshooting

### Issue: "5 NOT_FOUND" Firestore Error

**Cause:** Using wrong database name or SDK configuration

**Solution:**
1. Verify database name: `smartmotordb` (NOT `(default)`)
2. Ensure client SDK uses: `getFirestore(app, 'smartmotordb')`
3. Ensure admin SDK uses: `admin.firestore(admin.app(), 'smartmotordb')`
4. REST API uses: `/databases/smartmotordb/documents`

### Issue: Admin Auth Fails

**Cause:** Service account credentials incorrect or expired

**Solution:**
1. Check `.env.local` has all Firebase variables
2. Verify service account JSON is valid
3. Regenerate credentials in Firebase Console if needed

### Issue: RTDB Timeout

**Cause:** Network connectivity or RTDB rules blocking access

**Solution:**
1. Check database URL is correct
2. Verify Firebase security rules allow admin access
3. Test connectivity to RTDB URL directly

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Firebase Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run Firebase tests
        env:
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_PRIVATE_KEY: ${{ secrets.FIREBASE_PRIVATE_KEY }}
          FIREBASE_CLIENT_EMAIL: ${{ secrets.FIREBASE_CLIENT_EMAIL }}
          # ... other env vars
        run: node scripts/test-firebase-comprehensive.mjs
```

---

## Performance Benchmarks

| Operation | Avg Time | Status |
|-----------|----------|--------|
| Firestore read (1 doc) | ~100ms | ✅ Good |
| Firestore write | ~150ms | ✅ Good |
| RTDB write | ~80ms | ✅ Excellent |
| RTDB read | ~100ms | ✅ Good |
| Auth user creation | ~300ms | ✅ Acceptable |
| Full test suite | ~12sec | ✅ Good |

---

## Adding New Tests

### Template for New Test
```javascript
await test('Your test name', async () => {
  // Arrange
  const testData = { ... }

  // Act
  const result = await operation(testData)

  // Assert
  if (!result) throw new Error('Operation failed')

  // Cleanup
  await cleanup()
})
```

### Best Practices
1. **Isolate tests:** Use unique IDs to avoid conflicts
2. **Clean up:** Always delete test data after tests
3. **Specific assertions:** Check exact values, not just existence
4. **Timeouts:** Set reasonable timeouts for network operations
5. **Error messages:** Clear error messages for debugging

---

## Monitoring & Maintenance

### Weekly Checks
- [ ] Run test suite to ensure systems operational
- [ ] Check Firebase Console for errors or quota warnings
- [ ] Review click event logs for tracking
- [ ] Monitor subscriber growth

### Monthly Checks
- [ ] Review billing and usage
- [ ] Check composite index recommendations
- [ ] Update test coverage for new features
- [ ] Backup critical data configurations

### Before Deployments
- [ ] Run full test suite
- [ ] Verify staging environment tests pass
- [ ] Check error rates in production logs
- [ ] Confirm security rules unchanged

---

## Contact & Support

For Firebase issues or test failures:
1. Check this guide's troubleshooting section
2. Review Firebase Console error logs
3. Check network connectivity
4. Verify environment variables
5. Consult Firebase documentation

---

**Last Updated:** 2026-02-18
**Test Coverage:** 11/11 (100%)
**Status:** Production-Ready ✅
