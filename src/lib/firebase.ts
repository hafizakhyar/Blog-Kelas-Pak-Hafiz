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
 * Auto-Seed Firestore with initial mock data if empty
 */
let isSeeding = false;
export async function seedFirestoreIfEmpty() {
  if (isSeeding) return;
  isSeeding = true;

  try {
    // 1. Seed & Sync Class Notes (catatan_kelas)
    const notesBatch = writeBatch(db);
    INITIAL_CLASS_NOTES.forEach((note) => {
      const docRef = doc(db, COLLECTIONS.NOTES, note.id);
      notesBatch.set(
        docRef,
        {
          ...note,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    });
    await notesBatch.commit();
    console.log(`[Firebase Firestore] Berhasil menyinkronkan ${INITIAL_CLASS_NOTES.length} catatan kelas ke Firestore.`);

    // 2. Seed & Sync Articles (catatan_artikel)
    const articlesBatch = writeBatch(db);
    BLOG_POSTS.forEach((post) => {
      const docRef = doc(db, COLLECTIONS.ARTICLES, post.id);
      articlesBatch.set(
        docRef,
        {
          ...post,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    });
    await articlesBatch.commit();
    console.log(`[Firebase Firestore] Berhasil menyinkronkan ${BLOG_POSTS.length} artikel ke catatan_artikel.`);

    // 3. Seed Photos/Gallery (catatan_foto)
    const photosSnap = await getDocs(collection(db, COLLECTIONS.PHOTOS));
    if (photosSnap.empty) {
      console.log('[Firebase Firestore] Mengisi data awal galeri ke catatan_foto...');
      const batch = writeBatch(db);
      GALLERY_ITEMS.forEach((item) => {
        const docRef = doc(db, COLLECTIONS.PHOTOS, item.id);
        batch.set(docRef, {
          ...item,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
    }

    // 4. Seed Documents (catatan_dokumen)
    const docsSnap = await getDocs(collection(db, COLLECTIONS.DOCUMENTS));
    if (docsSnap.empty) {
      console.log('[Firebase Firestore] Mengisi data awal dokumen ke catatan_dokumen...');
      const batch = writeBatch(db);
      DOCUMENT_ITEMS.forEach((docItem) => {
        const docRef = doc(db, COLLECTIONS.DOCUMENTS, docItem.id);
        batch.set(docRef, {
          ...docItem,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
    }
  } catch (err) {
    console.warn('[Firebase Firestore] Auto-seeding dilewati atau terjadi kendala jaringan/izin:', err);
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

      // Sort pinned first, then by timestamp or id
      items.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      console.log(`[Firebase Firestore] onSnapshot: Memuat ${items.length} catatan kelas secara real-time.`);
      onData(items);
    },
    (err) => {
      console.error('[Firebase Firestore ERROR] Gagal berlangganan real-time koleksi catatan_kelas:', err);
      if (onError) onError(err);
    }
  );
}

export async function saveClassNoteToFirestore(note: ClassNote): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.NOTES, note.id);
    
    // Clean object without undefined fields for safe Firestore serialization
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

    // If new note or doesn't have createdAt, set server timestamp
    if (!(note as any).createdAt) {
      payload.createdAt = serverTimestamp();
    }

    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firebase Firestore SUCCESS] Dokumen catatan_kelas "${note.title}" (ID: ${note.id}) tersimpan dengan serverTimestamp().`);
  } catch (error) {
    console.error(`[Firebase Firestore ERROR] Gagal menyimpan dokumen catatan_kelas "${note.title}":`, error);
    throw error;
  }
}

export async function deleteClassNoteFromFirestore(noteId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.NOTES, noteId);
    await deleteDoc(docRef);
    console.log(`[Firebase Firestore SUCCESS] Dokumen catatan_kelas ID: ${noteId} berhasil dihapus.`);
  } catch (error) {
    console.error(`[Firebase Firestore ERROR] Gagal menghapus dokumen catatan_kelas ID: ${noteId}:`, error);
    throw error;
  }
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
