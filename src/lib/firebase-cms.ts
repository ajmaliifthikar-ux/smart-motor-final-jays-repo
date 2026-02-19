import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  limit
} from 'firebase/firestore'
import { db } from './firebase'

export interface ContentBlock {
  key: string
  value: string
  valueAr?: string
  type: 'text' | 'image' | 'video' | 'json'
  status: 'PUBLISHED' | 'DRAFT'
  parentKey?: string
  order?: number
  updatedAt: Timestamp
}

export interface ContentHistory {
  id: string
  key: string
  snapshot: string // JSON string of the ContentBlock
  updatedBy: string
  updatedAt: Timestamp
  versionLabel?: string
}

const COLLECTION_BLOCKS = 'contentBlocks'
const COLLECTION_HISTORY = 'contentHistory'

/**
 * Fetches a specific content block by its key.
 */
export async function getContentBlock(key: string): Promise<ContentBlock | null> {
  try {
    const docRef = doc(db, COLLECTION_BLOCKS, key)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as ContentBlock) : null
  } catch (error) {
    console.error(`Error fetching content block ${key}:`, error)
    return null
  }
}

/**
 * Updates a content block and creates a history record.
 */
export async function updateContentBlock(
  key: string, 
  value: string, 
  updatedBy: string,
  extra: Partial<Omit<ContentBlock, 'key' | 'value' | 'updatedAt'>> = {}
): Promise<void> {
  try {
    const now = Timestamp.now()
    const docRef = doc(db, COLLECTION_BLOCKS, key)
    
    // 1. Fetch current state for history before updating
    const currentSnap = await getDoc(docRef)
    if (currentSnap.exists()) {
      const historyRef = doc(collection(db, COLLECTION_HISTORY))
      await setDoc(historyRef, {
        id: historyRef.id,
        key,
        snapshot: JSON.stringify(currentSnap.data()),
        updatedBy,
        updatedAt: now
      })
    }

    // 2. Update the block
    const updateData: Partial<ContentBlock> = {
      ...extra,
      value,
      updatedAt: now
    }
    
    // Use setDoc with merge: true to handle both initial creation and updates
    await setDoc(docRef, { key, ...updateData }, { merge: true })
  } catch (error) {
    console.error(`Error updating content block ${key}:`, error)
    throw error
  }
}

/**
 * Fetches the history of changes for a specific key.
 */
export async function getContentHistory(key: string): Promise<ContentHistory[]> {
  try {
    const q = query(
      collection(db, COLLECTION_HISTORY),
      where('key', '==', key),
      orderBy('updatedAt', 'desc'),
      limit(20)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data() as ContentHistory)
  } catch (error) {
    console.error(`Error fetching content history for ${key}:`, error)
    return []
  }
}

/**
 * Restores a content block from a history snapshot.
 */
export async function restoreContentFromHistory(historyId: string, updatedBy: string): Promise<void> {
  try {
    const historyRef = doc(db, COLLECTION_HISTORY, historyId)
    const historySnap = await getDoc(historyRef)
    
    if (!historySnap.exists()) {
      throw new Error('History record not found')
    }

    const historyData = historySnap.data() as ContentHistory
    const snapshot = JSON.parse(historyData.snapshot) as ContentBlock
    
    // Re-save the snapshot as the current block
    await updateContentBlock(snapshot.key, snapshot.value, updatedBy, {
      type: snapshot.type,
      status: 'PUBLISHED',
      parentKey: snapshot.parentKey,
      order: snapshot.order
    })
  } catch (error) {
    console.error(`Error restoring content from history ${historyId}:`, error)
    throw error
  }
}
