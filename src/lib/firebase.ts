import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  updateDoc,
  increment,
  serverTimestamp,
  type Unsubscribe
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  ClassNote,
  GalleryItem,
  DocumentItem,
  BlogPost,
  ProfileExperienceItem,
  PortfolioCertificateItem,
  TeacherBioProfile,
  PracticalVideoItem
} from '../types';
import {
  INITIAL_CLASS_NOTES,
  GALLERY_ITEMS,
  DOCUMENT_ITEMS,
  BLOG_POSTS,
  INITIAL_PROFILE_EXPERIENCES,
  INITIAL_PORTFOLIO_CERTIFICATES,
  INITIAL_TEACHER_PROFILE,
  INITIAL_PRACTICAL_VIDEOS
} from '../data/mockData';

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with resilient auto-detect long polling and databaseId
let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch (e) {
  firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}
export const db = firestoreDb;
export const auth = getAuth(app);
export const storage = getStorage(app);

// Firestore Collection Names
export const COLLECTIONS = {
  NOTES: 'catatan_kelas',
  ARTICLES: 'catatan_artikel',
  PHOTOS: 'catatan_foto',
  DOCUMENTS: 'catatan_dokumen',
  PROFILES: 'catatan_profil',
  PORTFOLIOS: 'catatan_portofolio',
  TEACHER_BIO: 'catatan_biodata_guru',
  VIDEOS: 'catatan_video',
} as const;

// Storage Folder Names
export const STORAGE_FOLDERS = {
  NOTES_IMAGES: 'catatan_foto/catatan_kelas',
  GALLERY_IMAGES: 'catatan_foto/galeri',
  ARTICLE_IMAGES: 'catatan_artikel',
  DOCUMENTS: 'catatan_dokumen',
  PROFILE_IMAGES: 'catatan_foto/profil',
  CERTIFICATE_IMAGES: 'catatan_foto/portofolio_sertifikat',
} as const;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMessage = error instanceof Error ? error.message : String(error);
  
  // Gracefully handle offline / connection messages without throwing uncaught UI crashes
  if (
    errMessage.includes('unavailable') ||
    errMessage.includes('offline') ||
    errMessage.includes('Could not reach Cloud Firestore') ||
    errMessage.includes('client is offline') ||
    errMessage.includes('Failed to get document')
  ) {
    console.info(`[Firestore Info] Koneksi Firestore beroperasi dalam mode offline/lokal cache (${path || 'general'}).`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };

  console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
}

// Connection test on boot as requested by Firebase Integration Skill (resilient handler)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline') || error.message.includes('unavailable')) {
        console.info('[Firestore] Client beroperasi dalam mode cache offline / transisi.');
      }
    }
  }
}
testConnection();

/**
 * Upload any File (Image, PDF, DOCX) to Firebase Storage
 * Returns the public Download URL
 */
export async function uploadFileToFirebaseStorage(
  file: File,
  folder: string,
  onProgress?: (progress: number) => void
): Promise<string> {
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
        console.error(`[Firebase Storage ERROR] Gagal mengunggah berkas ke ${storagePath}:`, error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err) {
          console.error('[Firebase Storage ERROR] Gagal mendapatkan download URL:', err);
          reject(err);
        }
      }
    );
  });
}

/**
 * Safe write helper to Firestore with offline queuing
 */
async function safeFirestoreWrite(collectionName: string, docId: string, data: any): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${collectionName}/${docId}`);
  }
}

/**
 * Safe delete helper from Firestore
 */
async function safeFirestoreDelete(collectionName: string, docId: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${collectionName}/${docId}`);
  }
}

// -------------------------------------------------------------
// Realtime Subscriptions & CRUD Operations
// -------------------------------------------------------------

// --- Catatan Kelas ---
export function subscribeToClassNotes(
  onData: (notes: ClassNote[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.NOTES),
    (snapshot) => {
      if (snapshot.empty) {
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

      const existingIds = new Set(items.map((i) => i.id));
      const missingNotes = INITIAL_CLASS_NOTES.filter((n) => !existingIds.has(n.id));
      if (missingNotes.length > 0) {
        items.push(...missingNotes);
      }

      items.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      onData(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, COLLECTIONS.NOTES);
      onData(INITIAL_CLASS_NOTES);
      if (onError) onError(err);
    }
  );
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

  await safeFirestoreWrite(COLLECTIONS.NOTES, note.id, payload);
}

export async function deleteClassNoteFromFirestore(noteId: string): Promise<void> {
  await safeFirestoreDelete(COLLECTIONS.NOTES, noteId);
}

// --- Artikel & Catatan Belajar ---
export function subscribeToArticles(
  onData: (articles: BlogPost[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.ARTICLES),
    (snapshot) => {
      if (snapshot.empty) {
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
      handleFirestoreError(err, OperationType.LIST, COLLECTIONS.ARTICLES);
      onData(BLOG_POSTS);
      if (onError) onError(err);
    }
  );
}

export async function saveArticleToFirestore(article: BlogPost): Promise<void> {
  await safeFirestoreWrite(COLLECTIONS.ARTICLES, article.id, article);
}

export async function deleteArticleFromFirestore(articleId: string): Promise<void> {
  await safeFirestoreDelete(COLLECTIONS.ARTICLES, articleId);
}

export async function incrementArticleReactions(articleId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, articleId);
    await updateDoc(docRef, { reactions: increment(1) });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.ARTICLES}/${articleId}`);
  }
}

// --- Galeri Eksperimen & Foto Lab ---
export function subscribeToGalleryPhotos(
  onData: (items: GalleryItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.PHOTOS),
    (snapshot) => {
      if (snapshot.empty) {
        onData(GALLERY_ITEMS);
        return;
      }
      const items: GalleryItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as GalleryItem;
        const imagesList = Array.isArray(data.images) && data.images.length > 0
          ? data.images.filter(Boolean)
          : (data.image ? [data.image] : []);

        items.push({
          ...data,
          id: docSnap.id,
          image: data.image || imagesList[0] || '',
          images: imagesList
        });
      });
      onData(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, COLLECTIONS.PHOTOS);
      onData(GALLERY_ITEMS);
      if (onError) onError(err);
    }
  );
}

export async function saveGalleryItemToFirestore(item: GalleryItem): Promise<void> {
  const imagesList = Array.isArray(item.images) && item.images.length > 0
    ? item.images.filter(Boolean)
    : (item.image ? [item.image] : []);
  
  const payload: GalleryItem = {
    ...item,
    image: item.image || imagesList[0] || '',
    images: imagesList
  };

  await safeFirestoreWrite(COLLECTIONS.PHOTOS, item.id, payload);
}

export async function deleteGalleryItemFromFirestore(itemId: string): Promise<void> {
  await safeFirestoreDelete(COLLECTIONS.PHOTOS, itemId);
}

// --- Modul & Dokumen File ---
export function subscribeToDocuments(
  onData: (docs: DocumentItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.DOCUMENTS),
    (snapshot) => {
      if (snapshot.empty) {
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
      handleFirestoreError(err, OperationType.LIST, COLLECTIONS.DOCUMENTS);
      onData(DOCUMENT_ITEMS);
      if (onError) onError(err);
    }
  );
}

export async function saveDocumentToFirestore(item: DocumentItem): Promise<void> {
  await safeFirestoreWrite(COLLECTIONS.DOCUMENTS, item.id, item);
}

export async function deleteDocumentFromFirestore(docId: string): Promise<void> {
  await safeFirestoreDelete(COLLECTIONS.DOCUMENTS, docId);
}

export async function incrementDocumentDownloads(docId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
    await updateDoc(docRef, { downloads: increment(1) });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTIONS.DOCUMENTS}/${docId}`);
  }
}

// --- Profil & Riwayat Pengalaman Guru (catatan_profil) ---
export function subscribeToProfileExperiences(
  onData: (items: ProfileExperienceItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.PROFILES),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_PROFILE_EXPERIENCES);
        return;
      }
      const items: ProfileExperienceItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          institution: data.institution || undefined,
          period: data.period || undefined,
          category: data.category || 'Pengalaman',
          description: data.description || undefined,
          subItems: Array.isArray(data.subItems) ? data.subItems : undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as ProfileExperienceItem);
      });
      onData(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, COLLECTIONS.PROFILES);
      onData(INITIAL_PROFILE_EXPERIENCES);
      if (onError) onError(err);
    }
  );
}

export async function saveProfileExperienceToFirestore(item: ProfileExperienceItem): Promise<void> {
  const payload: Record<string, any> = {
    id: item.id,
    title: item.title || '',
    category: item.category || 'Pengalaman',
    updatedAt: serverTimestamp()
  };

  if (item.institution) payload.institution = item.institution;
  if (item.period) payload.period = item.period;
  if (item.description) payload.description = item.description;
  if (Array.isArray(item.subItems) && item.subItems.length > 0) payload.subItems = item.subItems;

  if (!(item as any).createdAt) {
    payload.createdAt = serverTimestamp();
  }

  await safeFirestoreWrite(COLLECTIONS.PROFILES, item.id, payload);
}

export async function deleteProfileExperienceFromFirestore(itemId: string): Promise<void> {
  await safeFirestoreDelete(COLLECTIONS.PROFILES, itemId);
}

// --- Portofolio & Sertifikat Guru (catatan_portofolio) ---
export function subscribeToPortfolioCertificates(
  onData: (certs: PortfolioCertificateItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.PORTFOLIOS),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_PORTFOLIO_CERTIFICATES);
        return;
      }
      const items: PortfolioCertificateItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          category: data.category || 'Sertifikat',
          issuer: data.issuer || 'UIN Syarif Hidayatullah Jakarta',
          year: data.year || '2025',
          imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
          description: data.description || undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as PortfolioCertificateItem);
      });
      onData(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, COLLECTIONS.PORTFOLIOS);
      onData(INITIAL_PORTFOLIO_CERTIFICATES);
      if (onError) onError(err);
    }
  );
}

export async function savePortfolioCertificateToFirestore(cert: PortfolioCertificateItem): Promise<void> {
  const payload: Record<string, any> = {
    id: cert.id,
    title: cert.title || '',
    category: cert.category || 'Sertifikat',
    issuer: cert.issuer || '',
    year: cert.year || '',
    imageUrl: cert.imageUrl || '',
    updatedAt: serverTimestamp()
  };

  if (cert.description) payload.description = cert.description;
  if (!(cert as any).createdAt) {
    payload.createdAt = serverTimestamp();
  }

  await safeFirestoreWrite(COLLECTIONS.PORTFOLIOS, cert.id, payload);
}

export async function deletePortfolioCertificateFromFirestore(certId: string): Promise<void> {
  await safeFirestoreDelete(COLLECTIONS.PORTFOLIOS, certId);
}

// --- Biodata Profil & Keahlian Guru (catatan_biodata_guru) ---
export function subscribeToTeacherBioProfile(
  onData: (profile: TeacherBioProfile) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const docId = 'main-teacher-profile';

  return onSnapshot(
    doc(db, COLLECTIONS.TEACHER_BIO, docId),
    (docSnap) => {
      if (!docSnap.exists()) {
        onData(INITIAL_TEACHER_PROFILE);
        return;
      }
      const data = docSnap.data();
      const profile: TeacherBioProfile = {
        id: docSnap.id,
        name: data.name || INITIAL_TEACHER_PROFILE.name,
        title: data.title || INITIAL_TEACHER_PROFILE.title,
        verifiedBadgeText: data.verifiedBadgeText || INITIAL_TEACHER_PROFILE.verifiedBadgeText,
        avatarUrl: data.avatarUrl || INITIAL_TEACHER_PROFILE.avatarUrl,
        bioDescription: data.bioDescription || INITIAL_TEACHER_PROFILE.bioDescription,
        skillsAndFocus: Array.isArray(data.skillsAndFocus) ? data.skillsAndFocus : INITIAL_TEACHER_PROFILE.skillsAndFocus,
        contacts: Array.isArray(data.contacts) ? data.contacts : INITIAL_TEACHER_PROFILE.contacts,
        updatedAt: data.updatedAt
      };
      onData(profile);
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, `${COLLECTIONS.TEACHER_BIO}/${docId}`);
      onData(INITIAL_TEACHER_PROFILE);
      if (onError) onError(err);
    }
  );
}

export async function saveTeacherBioProfileToFirestore(profile: TeacherBioProfile): Promise<void> {
  const docId = profile.id || 'main-teacher-profile';
  const payload: Record<string, any> = {
    id: docId,
    name: profile.name || '',
    title: profile.title || '',
    verifiedBadgeText: profile.verifiedBadgeText || 'Pendidik Terverifikasi',
    avatarUrl: profile.avatarUrl || '',
    bioDescription: profile.bioDescription || '',
    skillsAndFocus: profile.skillsAndFocus || [],
    contacts: profile.contacts || [],
    updatedAt: serverTimestamp()
  };

  await safeFirestoreWrite(COLLECTIONS.TEACHER_BIO, docId, payload);
}

// --- Video Praktikum YouTube (catatan_video) ---
export function subscribeToPracticalVideos(
  onData: (videos: PracticalVideoItem[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, COLLECTIONS.VIDEOS),
    (snapshot) => {
      if (snapshot.empty) {
        onData(INITIAL_PRACTICAL_VIDEOS);
        return;
      }
      const items: PracticalVideoItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          youtubeUrl: data.youtubeUrl || '',
          youtubeId: data.youtubeId || '',
          thumbnailUrl: data.thumbnailUrl || (data.youtubeId ? `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg` : ''),
          category: data.category || 'Eksperimen Lab',
          badge: data.badge || 'Video Pembelajaran',
          duration: data.duration || undefined,
          date: data.date || '',
          description: data.description || '',
          chemistryConcept: data.chemistryConcept || undefined,
          isPinned: data.isPinned || false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        } as PracticalVideoItem);
      });

      // Sort: pinned first, then by date/id
      items.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      onData(items);
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, COLLECTIONS.VIDEOS);
      onData(INITIAL_PRACTICAL_VIDEOS);
      if (onError) onError(err);
    }
  );
}

export async function savePracticalVideoToFirestore(video: PracticalVideoItem): Promise<void> {
  const payload: Record<string, any> = {
    id: video.id,
    title: video.title || '',
    youtubeUrl: video.youtubeUrl || '',
    youtubeId: video.youtubeId || '',
    thumbnailUrl: video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
    category: video.category || 'Eksperimen Lab',
    badge: video.badge || 'Video Praktikum',
    date: video.date || '',
    description: video.description || '',
    isPinned: !!video.isPinned,
    updatedAt: serverTimestamp()
  };

  if (video.duration) payload.duration = video.duration;
  if (video.chemistryConcept) payload.chemistryConcept = video.chemistryConcept;
  if (!(video as any).createdAt) {
    payload.createdAt = serverTimestamp();
  }

  await safeFirestoreWrite(COLLECTIONS.VIDEOS, video.id, payload);
}

export async function deletePracticalVideoFromFirestore(videoId: string): Promise<void> {
  await safeFirestoreDelete(COLLECTIONS.VIDEOS, videoId);
}



