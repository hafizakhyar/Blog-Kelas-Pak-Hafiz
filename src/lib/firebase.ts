import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  updateDoc,
  increment,
  writeBatch
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import { ClassNote, GalleryItem, DocumentItem, BlogPost } from '../types';
import { INITIAL_CLASS_NOTES, GALLERY_ITEMS, DOCUMENT_ITEMS, BLOG_POSTS } from '../data/mockData';

// User's exact Firebase Project Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDuT_cyN06P-1CwFm9PQ0_rrR3blrMSAwg",
  authDomain: "empirical-philosophy-7q6d2.firebaseapp.com",
  projectId: "empirical-philosophy-7q6d2",
  storageBucket: "empirical-philosophy-7q6d2.firebasestorage.app",
  messagingSenderId: "623768425354",
  appId: "1:623768425354:web:0e4718851ad29f2c9aae73"
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firestore & Storage instances
export const db = getFirestore(app);
export const storage = getStorage(app);

// Firestore Collection Names prefixed with "catatan_"
export const COLLECTIONS = {
  NOTES: 'catatan_kelas',
  ARTICLES: 'catatan_artikel',
  PHOTOS: 'catatan_foto',
  DOCUMENTS: 'catatan_dokumen',
} as const;

// Storage Folder Names prefixed with "catatan_"
export const STORAGE_FOLDERS = {
  NOTES_IMAGES: 'catatan_foto/catatan_kelas',
  GALLERY_IMAGES: 'catatan_foto/galeri',
  ARTICLE_IMAGES: 'catatan_artikel',
  DOCUMENTS: 'catatan_dokumen',
} as const;

/**
 * Upload any File (Image, PDF, DOCX) to Firebase Storage
 * Returns the public Download URL
 */
export async function uploadFileToFirebaseStorage(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Clean file name to prevent collision
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${folder}/${timestamp}_${sanitizedName}`;
  const storageReference = ref(storage, storagePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (snapshot.totalBytes > 0 && onProgress) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Auto-Seed Firestore with initial mock data if empty
 */
let isSeeding = false;
export async function seedFirestoreIfEmpty() {
  if (isSeeding) return;
  isSeeding = true;

  try {
    // 1. Seed Class Notes (catatan_kelas)
    const notesSnap = await getDocs(collection(db, COLLECTIONS.NOTES));
    if (notesSnap.empty) {
      console.log('Seeding initial Catatan Kelas to Firestore...');
      const batch = writeBatch(db);
      INITIAL_CLASS_NOTES.forEach((note) => {
        const docRef = doc(db, COLLECTIONS.NOTES, note.id);
        batch.set(docRef, note);
      });
      await batch.commit();
    }

    // 2. Seed Articles (catatan_artikel)
    const articlesSnap = await getDocs(collection(db, COLLECTIONS.ARTICLES));
    if (articlesSnap.empty) {
      console.log('Seeding initial Artikel to Firestore...');
      const batch = writeBatch(db);
      BLOG_POSTS.forEach((post) => {
        const docRef = doc(db, COLLECTIONS.ARTICLES, post.id);
        batch.set(docRef, post);
      });
      await batch.commit();
    }

    // 3. Seed Photos/Gallery (catatan_foto)
    const photosSnap = await getDocs(collection(db, COLLECTIONS.PHOTOS));
    if (photosSnap.empty) {
      console.log('Seeding initial Galeri Foto to Firestore...');
      const batch = writeBatch(db);
      GALLERY_ITEMS.forEach((item) => {
        const docRef = doc(db, COLLECTIONS.PHOTOS, item.id);
        batch.set(docRef, item);
      });
      await batch.commit();
    }

    // 4. Seed Documents (catatan_dokumen)
    const docsSnap = await getDocs(collection(db, COLLECTIONS.DOCUMENTS));
    if (docsSnap.empty) {
      console.log('Seeding initial Dokumen to Firestore...');
      const batch = writeBatch(db);
      DOCUMENT_ITEMS.forEach((docItem) => {
        const docRef = doc(db, COLLECTIONS.DOCUMENTS, docItem.id);
        batch.set(docRef, docItem);
      });
      await batch.commit();
    }
  } catch (err) {
    console.warn('Firestore initial seeding skipped or failed (offline/permission):', err);
  } finally {
    isSeeding = false;
  }
}

// -------------------------------------------------------------
// Realtime Subscriptions & CRUD Operations
// -------------------------------------------------------------

// --- Catatan Kelas ---
export function subscribeToClassNotes(
  onData: (notes: ClassNote[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.NOTES),
    (snapshot) => {
      if (snapshot.empty) {
        // Trigger seed if empty
        seedFirestoreIfEmpty();
        onData(INITIAL_CLASS_NOTES);
        return;
      }
      const items: ClassNote[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as ClassNote);
      });
      // Sort pinned first, then by date/id
      items.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
      onData(items);
    },
    (err) => {
      console.error('Error subscribing to catatan_kelas:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveClassNoteToFirestore(note: ClassNote): Promise<void> {
  const docRef = doc(db, COLLECTIONS.NOTES, note.id);
  await setDoc(docRef, note, { merge: true });
}

export async function deleteClassNoteFromFirestore(noteId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.NOTES, noteId);
  await deleteDoc(docRef);
}

// --- Artikel & Catatan Belajar ---
export function subscribeToArticles(
  onData: (articles: BlogPost[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.ARTICLES),
    (snapshot) => {
      if (snapshot.empty) {
        seedFirestoreIfEmpty();
        onData(BLOG_POSTS);
        return;
      }
      const items: BlogPost[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as BlogPost);
      });
      onData(items);
    },
    (err) => {
      console.error('Error subscribing to catatan_artikel:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveArticleToFirestore(article: BlogPost): Promise<void> {
  const docRef = doc(db, COLLECTIONS.ARTICLES, article.id);
  await setDoc(docRef, article, { merge: true });
}

export async function deleteArticleFromFirestore(articleId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
  await deleteDoc(docRef);
}

export async function incrementArticleReactions(articleId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
    await updateDoc(docRef, { reactions: increment(1) });
  } catch (e) {
    console.error('Error updating reaction:', e);
  }
}

// --- Galeri Eksperimen & Foto Lab ---
export function subscribeToGalleryPhotos(
  onData: (items: GalleryItem[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.PHOTOS),
    (snapshot) => {
      if (snapshot.empty) {
        seedFirestoreIfEmpty();
        onData(GALLERY_ITEMS);
        return;
      }
      const items: GalleryItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as GalleryItem);
      });
      onData(items);
    },
    (err) => {
      console.error('Error subscribing to catatan_foto:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveGalleryItemToFirestore(item: GalleryItem): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PHOTOS, item.id);
  await setDoc(docRef, item, { merge: true });
}

export async function deleteGalleryItemFromFirestore(itemId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PHOTOS, itemId);
  await deleteDoc(docRef);
}

// --- Modul & Dokumen File ---
export function subscribeToDocuments(
  onData: (docs: DocumentItem[]) => void,
  onError?: (err: Error) => void
) {
  return onSnapshot(
    collection(db, COLLECTIONS.DOCUMENTS),
    (snapshot) => {
      if (snapshot.empty) {
        seedFirestoreIfEmpty();
        onData(DOCUMENT_ITEMS);
        return;
      }
      const items: DocumentItem[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as DocumentItem);
      });
      onData(items);
    },
    (err) => {
      console.error('Error subscribing to catatan_dokumen:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveDocumentToFirestore(item: DocumentItem): Promise<void> {
  const docRef = doc(db, COLLECTIONS.DOCUMENTS, item.id);
  await setDoc(docRef, item, { merge: true });
}

export async function deleteDocumentFromFirestore(docId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
  await deleteDoc(docRef);
}

export async function incrementDocumentDownloads(docId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
    await updateDoc(docRef, { downloads: increment(1) });
  } catch (e) {
    console.error('Error incrementing downloads in Firestore:', e);
  }
}
