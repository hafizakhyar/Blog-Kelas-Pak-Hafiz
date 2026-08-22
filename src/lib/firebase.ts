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
  writeBatch,
  serverTimestamp,
  Timestamp
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

// User's custom Firestore Database ID
export const FIRESTORE_DATABASE_ID = "ai-studio-kelaspakhafizpor-c1ee3adc-37e9-4c0a-9d18-5defc1a47a83";

// Initialize both Custom Firestore instance and Default Firestore instance for robust auto-fallback
export const customDb = getFirestore(app, FIRESTORE_DATABASE_ID);
export const defaultDb = getFirestore(app);

// Export primary db instance
export const db = customDb;
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

  console.log(`[Firebase Storage] Memulai unggah berkas "${file.name}" (${file.size} bytes) ke: ${storagePath}`);

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
        console.error(`[Firebase Storage ERROR] Gagal mengunggah file ke ${storagePath}:`, error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log(`[Firebase Storage SUCCESS] Foto/Berkas berhasil diunggah! URL: ${downloadUrl}`);
          resolve(downloadUrl);
        } catch (err) {
          console.error('[Firebase Storage ERROR] Gagal mendapatkan URL publik getDownloadURL():', err);
          reject(err);
        }
      }
    );
  });
}

/**
 * Helper to write a document with custom DB first, falling back to default DB if needed
 */
async function writeWithFallback(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    const docRef = doc(customDb, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    console.log(`[Firebase Firestore SUCCESS] Tersimpan di Database Kustom (${collectionName}/${docId})`);
  } catch (err: any) {
    console.warn(`[Firebase Firestore WARN] Custom DB gagal (${err?.message || err}), mencoba Default DB...`);
    try {
      const defaultRef = doc(defaultDb, collectionName, docId);
      await setDoc(defaultRef, data, { merge: true });
      console.log(`[Firebase Firestore SUCCESS] Tersimpan di Database Default (${collectionName}/${docId})`);
    } catch (defaultErr) {
      console.error(`[Firebase Firestore ERROR] Gagal menyimpan dokumen (${collectionName}/${docId}):`, defaultErr);
      throw defaultErr;
    }
  }
}

/**
 * Helper to delete a document with fallback
 */
async function deleteWithFallback(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(customDb, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    const defaultRef = doc(defaultDb, collectionName, docId);
    await deleteDoc(defaultRef);
  }
}

/**
 * Auto-Seed Firestore with initial mock data if empty
 */
let isSeeding = false;
export async function seedFirestoreIfEmpty() {
  if (isSeeding) return;
  isSeeding = true;

  try {
    // 1. Seed & Sync Class Notes (catatan_kelas)
    for (const note of INITIAL_CLASS_NOTES) {
      await writeWithFallback(COLLECTIONS.NOTES, note.id, {
        ...note,
        updatedAt: serverTimestamp()
      });
    }

    // 2. Seed & Sync Articles (catatan_artikel)
    for (const post of BLOG_POSTS) {
      await writeWithFallback(COLLECTIONS.ARTICLES, post.id, {
        ...post,
        updatedAt: serverTimestamp()
      });
    }

    // 3. Seed Photos/Gallery (catatan_foto)
    for (const item of GALLERY_ITEMS) {
      await writeWithFallback(COLLECTIONS.PHOTOS, item.id, {
        ...item,
        createdAt: serverTimestamp()
      });
    }

    // 4. Seed Documents (catatan_dokumen)
    for (const docItem of DOCUMENT_ITEMS) {
      await writeWithFallback(COLLECTIONS.DOCUMENTS, docItem.id, {
        ...docItem,
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('[Firebase Firestore] Auto-seeding selesai atau ada pembatasan jaringan:', err);
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
  const parseSnapshot = (snapshot: any) => {
    if (snapshot.empty) {
      seedFirestoreIfEmpty();
      onData(INITIAL_CLASS_NOTES);
      return;
    }
    const items: ClassNote[] = [];
    snapshot.forEach((docSnap: any) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        category: data.category || 'Materi Kimia',
        classGrade: data.classGrade || 'Semua Tingkat',
        content: data.content || '',
        keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
        imageUrl: data.imageUrl || undefined,
        date: data.date || '',
        authorName: data.authorName || 'Pak Hafiz, S.Pd., M.Si.',
        isPinned: !!data.isPinned,
        likes: typeof data.likes === 'number' ? data.likes : 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as ClassNote);
    });

    items.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    console.log(`[Firebase Firestore] onSnapshot: Memuat ${items.length} catatan kelas.`);
    onData(items);
  };

  let unsubDefault: (() => void) | null = null;

  const unsubCustom = onSnapshot(
    collection(customDb, COLLECTIONS.NOTES),
    parseSnapshot,
    (err) => {
      console.warn('[Firebase Firestore WARN] Langganan customDb catatan_kelas gagal, beralih ke defaultDb:', err.message);
      unsubDefault = onSnapshot(
        collection(defaultDb, COLLECTIONS.NOTES),
        parseSnapshot,
        (defaultErr) => {
          console.error('[Firebase Firestore ERROR] Langganan defaultDb catatan_kelas error:', defaultErr);
          if (onError) onError(defaultErr);
        }
      );
    }
  );

  return () => {
    unsubCustom();
    if (unsubDefault) unsubDefault();
  };
}

export async function saveClassNoteToFirestore(note: ClassNote): Promise<void> {
  const payload: Record<string, any> = {
    id: note.id,
    title: note.title || '',
    category: note.category || 'Materi Kimia',
    classGrade: note.classGrade || 'Semua Tingkat',
    content: note.content || '',
    keyPoints: Array.isArray(note.keyPoints) ? note.keyPoints : [],
    imageUrl: note.imageUrl || '',
    date: note.date || '',
    authorName: note.authorName || 'Pak Hafiz, S.Pd., M.Si.',
    isPinned: !!note.isPinned,
    likes: typeof note.likes === 'number' ? note.likes : 0,
    tags: Array.isArray(note.tags) ? note.tags : [],
    updatedAt: serverTimestamp()
  };

  if (!(note as any).createdAt) {
    payload.createdAt = serverTimestamp();
  }

  await writeWithFallback(COLLECTIONS.NOTES, note.id, payload);
}

export async function deleteClassNoteFromFirestore(noteId: string): Promise<void> {
  await deleteWithFallback(COLLECTIONS.NOTES, noteId);
}

// --- Artikel & Catatan Belajar ---
export function subscribeToArticles(
  onData: (articles: BlogPost[]) => void,
  onError?: (err: Error) => void
) {
  const parseSnapshot = (snapshot: any) => {
    if (snapshot.empty) {
      seedFirestoreIfEmpty();
      onData(BLOG_POSTS);
      return;
    }
    const items: BlogPost[] = [];
    snapshot.forEach((docSnap: any) => {
      items.push(docSnap.data() as BlogPost);
    });
    onData(items);
  };

  let unsubDefault: (() => void) | null = null;
  const unsubCustom = onSnapshot(
    collection(customDb, COLLECTIONS.ARTICLES),
    parseSnapshot,
    (err) => {
      console.warn('[Firebase Firestore WARN] Langganan customDb catatan_artikel gagal, beralih ke defaultDb:', err.message);
      unsubDefault = onSnapshot(
        collection(defaultDb, COLLECTIONS.ARTICLES),
        parseSnapshot,
        (defaultErr) => {
          if (onError) onError(defaultErr);
        }
      );
    }
  );

  return () => {
    unsubCustom();
    if (unsubDefault) unsubDefault();
  };
}

export async function saveArticleToFirestore(article: BlogPost): Promise<void> {
  await writeWithFallback(COLLECTIONS.ARTICLES, article.id, article);
}

export async function deleteArticleFromFirestore(articleId: string): Promise<void> {
  await deleteWithFallback(COLLECTIONS.ARTICLES, articleId);
}

export async function incrementArticleReactions(articleId: string): Promise<void> {
  try {
    const docRef = doc(customDb, COLLECTIONS.ARTICLES, articleId);
    await updateDoc(docRef, { reactions: increment(1) });
  } catch (e) {
    try {
      const docRef = doc(defaultDb, COLLECTIONS.ARTICLES, articleId);
      await updateDoc(docRef, { reactions: increment(1) });
    } catch (err) {
      console.error('Error updating reaction:', err);
    }
  }
}

// --- Galeri Eksperimen & Foto Lab ---
export function subscribeToGalleryPhotos(
  onData: (items: GalleryItem[]) => void,
  onError?: (err: Error) => void
) {
  const parseSnapshot = (snapshot: any) => {
    if (snapshot.empty) {
      seedFirestoreIfEmpty();
      onData(GALLERY_ITEMS);
      return;
    }
    const items: GalleryItem[] = [];
    snapshot.forEach((docSnap: any) => {
      items.push(docSnap.data() as GalleryItem);
    });
    onData(items);
  };

  let unsubDefault: (() => void) | null = null;
  const unsubCustom = onSnapshot(
    collection(customDb, COLLECTIONS.PHOTOS),
    parseSnapshot,
    (err) => {
      console.warn('[Firebase Firestore WARN] Langganan customDb catatan_foto gagal, beralih ke defaultDb:', err.message);
      unsubDefault = onSnapshot(
        collection(defaultDb, COLLECTIONS.PHOTOS),
        parseSnapshot,
        (defaultErr) => {
          if (onError) onError(defaultErr);
        }
      );
    }
  );

  return () => {
    unsubCustom();
    if (unsubDefault) unsubDefault();
  };
}

export async function saveGalleryItemToFirestore(item: GalleryItem): Promise<void> {
  await writeWithFallback(COLLECTIONS.PHOTOS, item.id, item);
}

export async function deleteGalleryItemFromFirestore(itemId: string): Promise<void> {
  await deleteWithFallback(COLLECTIONS.PHOTOS, itemId);
}

// --- Modul & Dokumen File ---
export function subscribeToDocuments(
  onData: (docs: DocumentItem[]) => void,
  onError?: (err: Error) => void
) {
  const parseSnapshot = (snapshot: any) => {
    if (snapshot.empty) {
      seedFirestoreIfEmpty();
      onData(DOCUMENT_ITEMS);
      return;
    }
    const items: DocumentItem[] = [];
    snapshot.forEach((docSnap: any) => {
      items.push(docSnap.data() as DocumentItem);
    });
    onData(items);
  };

  let unsubDefault: (() => void) | null = null;
  const unsubCustom = onSnapshot(
    collection(customDb, COLLECTIONS.DOCUMENTS),
    parseSnapshot,
    (err) => {
      console.warn('[Firebase Firestore WARN] Langganan customDb catatan_dokumen gagal, beralih ke defaultDb:', err.message);
      unsubDefault = onSnapshot(
        collection(defaultDb, COLLECTIONS.DOCUMENTS),
        parseSnapshot,
        (defaultErr) => {
          if (onError) onError(defaultErr);
        }
      );
    }
  );

  return () => {
    unsubCustom();
    if (unsubDefault) unsubDefault();
  };
}

export async function saveDocumentToFirestore(item: DocumentItem): Promise<void> {
  await writeWithFallback(COLLECTIONS.DOCUMENTS, item.id, item);
}

export async function deleteDocumentFromFirestore(docId: string): Promise<void> {
  await deleteWithFallback(COLLECTIONS.DOCUMENTS, docId);
}

export async function incrementDocumentDownloads(docId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
    await updateDoc(docRef, { downloads: increment(1) });
  } catch (e) {
    console.error('Error incrementing downloads in Firestore:', e);
  }
}
