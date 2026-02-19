import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll 
} from 'firebase/storage'
import { storage } from './firebase'

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param path The destination path in storage (e.g., 'services/icon.png')
 * @param file The file object to upload
 */
export async function uploadFile(path: string, file: File | Blob): Promise<string> {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

/**
 * Deletes a file from Firebase Storage.
 * @param pathOrUrl The full path or download URL of the file to delete
 */
export async function deleteFile(pathOrUrl: string): Promise<void> {
  try {
    // If it's a URL, we need to handle it differently, but for simplicity
    // we assume path for now or use ref(storage, pathOrUrl) if it handles URLs
    const storageRef = ref(storage, pathOrUrl)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

/**
 * Lists all files in a specific directory.
 * @param directory The directory path (e.g., 'assets/icons')
 */
export async function listFiles(directory: string): Promise<string[]> {
  try {
    const listRef = ref(storage, directory)
    const res = await listAll(listRef)
    const urlPromises = res.items.map((item) => getDownloadURL(item))
    return await Promise.all(urlPromises)
  } catch (error) {
    console.error('Error listing files:', error)
    return []
  }
}
