import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClassNotesSection } from './components/ClassNotesSection';
import { GallerySection } from './components/GallerySection';
import { DocumentsSection } from './components/DocumentsSection';
import { BlogSection } from './components/BlogSection';
import { LearningPlatformCTA } from './components/LearningPlatformCTA';
import { PortfolioSection } from './components/PortfolioSection';
import { ProfileSection } from './components/ProfileSection';
import { Footer } from './components/Footer';
import { GalleryDetailModal } from './components/Modals/GalleryDetailModal';
import { MainPlatformModal } from './components/Modals/MainPlatformModal';
import { AdminAuthModal } from './components/Modals/AdminAuthModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ClassNoteDetailPage } from './components/Pages/ClassNoteDetailPage';
import { PraktikumDetailPage } from './components/Pages/PraktikumDetailPage';
import { DocumentDetailPage } from './components/Pages/DocumentDetailPage';
import { ArticleDetailPage } from './components/Pages/ArticleDetailPage';
import { GalleryItem, BlogPost, DocumentItem, ClassNote, PracticalVideoItem } from './types';
import { INITIAL_CLASS_NOTES, DOCUMENT_ITEMS, BLOG_POSTS, GALLERY_ITEMS, INITIAL_PRACTICAL_VIDEOS } from './data/mockData';
import { createCircularFavicon } from './utils/favicon';
import {
  subscribeToClassNotes,
  subscribeToDocuments,
  subscribeToArticles,
  subscribeToGalleryPhotos,
  subscribeToPracticalVideos,
  saveClassNoteToFirestore,
  deleteClassNoteFromFirestore,
  saveDocumentToFirestore,
  deleteDocumentFromFirestore,
  incrementDocumentDownloads,
  saveArticleToFirestore,
  deleteArticleFromFirestore,
  incrementArticleReactions,
  saveGalleryItemToFirestore,
  deleteGalleryItemFromFirestore,
  savePracticalVideoToFirestore,
  deletePracticalVideoFromFirestore
} from './lib/firebase';

const NOTES_STORAGE_KEY = 'kelaspakhafiz_class_notes_v2';
const ADMIN_AUTH_KEY = 'kelaspakhafiz_admin_auth_v1';
const DARK_MODE_STORAGE_KEY = 'kelaspakhafiz_dark_mode_v1';

type RouteView = 'main' | 'praktikum-detail' | 'catatan-detail' | 'document-detail' | 'article-detail';

export default function App() {
  // Navigation & View Route State
  const [currentRoute, setCurrentRoute] = useState<RouteView>('main');
  const [activeSection, setActiveSection] = useState<string>('beranda');

  // Dark Mode State with LocalStorage Persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY);
      if (saved !== null) {
        return saved === 'true';
      }
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (e) {
      console.error('Failed to load dark mode setting', e);
    }
    return false;
  });

  // Sync dark class on root html
  useEffect(() => {
    try {
      localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Failed to sync dark mode class', e);
    }
  }, [isDarkMode]);

  // Active items for dedicated detail pages
  const [activeGalleryItem, setActiveGalleryItem] = useState<GalleryItem | null>(null);
  const [activeNote, setActiveNote] = useState<ClassNote | null>(null);
  const [activeDocument, setActiveDocument] = useState<DocumentItem | null>(null);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);

  // Gallery modal & Main portal modal
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [isMainPortalModalOpen, setIsMainPortalModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Main Data States with Firestore Realtime Sync
  const [notes, setNotes] = useState<ClassNote[]>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      if (saved) {
        const parsed: ClassNote[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((n) => n.id));
        const missing = INITIAL_CLASS_NOTES.filter((n) => !existingIds.has(n.id));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load local notes', e);
    }
    return INITIAL_CLASS_NOTES;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(DOCUMENT_ITEMS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [practicalVideos, setPracticalVideos] = useState<PracticalVideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('kelaspakhafiz_practical_videos_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load local practical videos', e);
    }
    return INITIAL_PRACTICAL_VIDEOS;
  });

  // Admin Auth State & Modal
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  const handleOpenAdminModal = useCallback(() => {
    setIsAdminAuthModalOpen(true);
  }, []);

  const handleAdminLoginSuccess = useCallback(() => {
    setIsAdmin(true);
    try {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } catch (e) {
      console.warn('Failed to save admin state to localStorage', e);
    }
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: 'Mode Guru Aktif (Pak Hafiz)',
        description: 'Semua fitur kelola, edit, tambah, dan hapus berkas & materi telah diaktifkan.',
        type: 'success',
      },
    ]);
  }, []);

  const handleAdminLogout = useCallback(() => {
    setIsAdmin(false);
    try {
      localStorage.setItem(ADMIN_AUTH_KEY, 'false');
    } catch (e) {
      console.warn('Failed to clear admin state from localStorage', e);
    }
    setToasts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: 'Mode Umum / Siswa Aktif',
        description: 'Tampilan kembali ke mode baca & unduh untuk siswa.',
        type: 'info',
      },
    ]);
  }, []);

  // Subscribe to Firebase Firestore Realtime collections
  useEffect(() => {
    // 1. Catatan Kelas (catatan_kelas)
    const unsubNotes = subscribeToClassNotes((cloudNotes) => {
      if (cloudNotes && cloudNotes.length > 0) {
        setNotes(cloudNotes);
        // If an active note is open, sync it with real-time data
        setActiveNote((prev) => {
          if (!prev) return null;
          const found = cloudNotes.find((n) => n.id === prev.id);
          return found || prev;
        });
      }
    });

    // 2. Dokumen Modul (catatan_dokumen)
    const unsubDocs = subscribeToDocuments((cloudDocs) => {
      if (cloudDocs && cloudDocs.length > 0) {
        setDocuments(cloudDocs);
        setActiveDocument((prev) => {
          if (!prev) return null;
          const found = cloudDocs.find((d) => d.id === prev.id);
          return found || prev;
        });
      }
    });

    // 3. Artikel Blog (catatan_artikel)
    const unsubArticles = subscribeToArticles((cloudArticles) => {
      if (cloudArticles && cloudArticles.length > 0) {
        setBlogPosts(cloudArticles);
        setActiveBlogPost((prev) => {
          if (!prev) return null;
          const found = cloudArticles.find((p) => p.id === prev.id);
          return found || prev;
        });
      }
    });

    // 4. Galeri Foto Lab (catatan_foto)
    const unsubPhotos = subscribeToGalleryPhotos((cloudPhotos) => {
      if (cloudPhotos && cloudPhotos.length > 0) {
        setGalleryItems(cloudPhotos);
        setActiveGalleryItem((prev) => {
          if (!prev) return null;
          const found = cloudPhotos.find((p) => p.id === prev.id);
          return found || prev;
        });
      }
    });

    // 5. Video Praktikum YouTube (catatan_video)
    const unsubVideos = subscribeToPracticalVideos((cloudVideos) => {
      if (cloudVideos && cloudVideos.length > 0) {
        setPracticalVideos(cloudVideos);
      }
    });

    return () => {
      unsubNotes();
      unsubDocs();
      unsubArticles();
      unsubPhotos();
      unsubVideos();
    };
  }, []);

  // Save practical videos locally for instant loading
  useEffect(() => {
    try {
      localStorage.setItem('kelaspakhafiz_practical_videos_v1', JSON.stringify(practicalVideos));
    } catch (e) {
      console.error('Failed to save practical videos locally', e);
    }
  }, [practicalVideos]);

  // Save notes locally for offline backup
  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes locally', e);
    }
  }, [notes]);

  // Ensure favicon matches the official Kelas Pak Hafiz logo with transparent circular shape
  useEffect(() => {
    const customLogo = localStorage.getItem('hero_teacher_logo');
    if (customLogo) {
      createCircularFavicon(customLogo, 192).then((circularFavicon) => {
        const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (link) {
          link.href = circularFavicon;
        }
        const appleIcon: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
        if (appleIcon) {
          appleIcon.href = circularFavicon;
        }
      });
    }
  }, []);

  // Toast Helper
  const addToast = (title: string, description?: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Dark Mode Handler
  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      addToast(
        next ? 'Mode Gelap (Malam) Aktif' : 'Mode Terang (Siang) Aktif',
        next
          ? 'Kenyamanan membaca di malam hari kini terjaga dengan tampilan visual yang ramah mata.'
          : 'Tampilan kembali ke tema terang standar.',
        'info'
      );
      return next;
    });
  }, []);

  // Helper to resolve route from URL hash
  const parseHashRoute = useCallback(() => {
    const hash = window.location.hash.trim();
    if (!hash || hash === '#' || hash === '#beranda') {
      setCurrentRoute('main');
      setActiveSection('beranda');
      return;
    }

    // 1. Check Praktikum detail: #praktikum-... or #galeri-... (excluding #galeri and #praktikum)
    if (
      (hash.startsWith('#praktikum-') || hash.startsWith('#galeri-')) &&
      hash !== '#galeri' &&
      hash !== '#praktikum'
    ) {
      const rawParam = hash.replace(/^#(praktikum|galeri)-/, '').toLowerCase();
      // First: exact ID match
      let matchedItem = galleryItems.find((g) => g.id.toLowerCase() === rawParam);

      // Second: exact ID match with prefix normalization
      if (!matchedItem) {
        matchedItem = galleryItems.find(
          (g) =>
            g.id.toLowerCase() === `gal-${rawParam}` ||
            (rawParam.startsWith('gal-') && g.id.toLowerCase() === rawParam.replace(/^gal-/, ''))
        );
      }

      // Third: slug match
      if (!matchedItem) {
        matchedItem = galleryItems.find((g) => g.slug && g.slug.toLowerCase() === rawParam);
      }

      // Fourth: slugified title exact match
      if (!matchedItem) {
        matchedItem = galleryItems.find(
          (g) => g.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === rawParam
        );
      }

      if (matchedItem) {
        setActiveGalleryItem(matchedItem);
        setCurrentRoute('praktikum-detail');
        setActiveSection('galeri');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 2. Check Catatan Kelas detail: #catatan-... (excluding #catatan-kelas)
    if (hash.startsWith('#catatan-') && hash !== '#catatan-kelas') {
      const rawParam = hash.replace('#catatan-', '').toLowerCase();
      let matchedNote = notes.find((n) => n.id.toLowerCase() === rawParam);

      if (!matchedNote) {
        matchedNote = notes.find(
          (n) =>
            n.id.toLowerCase() === `note-${rawParam}` ||
            (rawParam.startsWith('note-') && n.id.toLowerCase() === rawParam.replace(/^note-/, ''))
        );
      }

      if (!matchedNote) {
        matchedNote = notes.find((n) => n.slug && n.slug.toLowerCase() === rawParam);
      }

      if (!matchedNote) {
        matchedNote = notes.find(
          (n) => n.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === rawParam
        );
      }

      if (matchedNote) {
        setActiveNote(matchedNote);
        setCurrentRoute('catatan-detail');
        setActiveSection('catatan-kelas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 3. Check Document detail: #file-... or #modul-... (excluding #modul and #dokumentasi-file)
    if (
      (hash.startsWith('#file-') || hash.startsWith('#dokumentasi-') || hash.startsWith('#modul-')) &&
      hash !== '#modul' &&
      hash !== '#dokumentasi-file'
    ) {
      const rawParam = hash.replace(/^#(file|dokumentasi|modul)-/, '').toLowerCase();
      let matchedDoc = documents.find((d) => d.id.toLowerCase() === rawParam);

      if (!matchedDoc) {
        matchedDoc = documents.find(
          (d) =>
            d.id.toLowerCase() === `doc-${rawParam}` ||
            (rawParam.startsWith('doc-') && d.id.toLowerCase() === rawParam.replace(/^doc-/, ''))
        );
      }

      if (!matchedDoc) {
        matchedDoc = documents.find((d) => d.slug && d.slug.toLowerCase() === rawParam);
      }

      if (!matchedDoc) {
        matchedDoc = documents.find(
          (d) => d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === rawParam
        );
      }

      if (matchedDoc) {
        setActiveDocument(matchedDoc);
        setCurrentRoute('document-detail');
        setActiveSection('modul');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 4. Check Blog Post detail: #blog-... or #artikel-... (excluding #blog and #artikel)
    if ((hash.startsWith('#blog-') || hash.startsWith('#artikel-')) && hash !== '#blog' && hash !== '#artikel') {
      const rawParam = hash.replace(/^#(blog|artikel)-/, '').toLowerCase();
      let matchedPost = blogPosts.find((p) => p.id.toLowerCase() === rawParam);

      if (!matchedPost) {
        matchedPost = blogPosts.find(
          (p) =>
            p.id.toLowerCase() === `post-${rawParam}` ||
            (rawParam.startsWith('post-') && p.id.toLowerCase() === rawParam.replace(/^post-/, ''))
        );
      }

      if (!matchedPost) {
        matchedPost = blogPosts.find((p) => p.slug && p.slug.toLowerCase() === rawParam);
      }

      if (!matchedPost) {
        matchedPost = blogPosts.find(
          (p) => p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === rawParam
        );
      }

      if (matchedPost) {
        setActiveBlogPost(matchedPost);
        setCurrentRoute('article-detail');
        setActiveSection('blog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 5. Fallback: Main Landing Page Section
    setCurrentRoute('main');
    const cleanSection = hash.replace('#', '');
    setActiveSection(cleanSection || 'beranda');

    // Scroll to section element
    setTimeout(() => {
      const el = document.getElementById(cleanSection);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  }, [notes, documents, blogPosts, galleryItems]);

  // Listen to Hash Changes
  useEffect(() => {
    parseHashRoute();
    window.addEventListener('hashchange', parseHashRoute);
    return () => window.removeEventListener('hashchange', parseHashRoute);
  }, [parseHashRoute]);

  // Scroll section spy (only active when on main landing route)
  useEffect(() => {
    if (currentRoute !== 'main') return;

    const sections = ['beranda', 'catatan-kelas', 'galeri', 'modul', 'blog', 'portofolio', 'profil', 'kontak'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  // Navigation handlers to dedicated full pages
  const handleSelectGalleryItem = (item: GalleryItem) => {
    setActiveGalleryItem(item);
    setCurrentRoute('praktikum-detail');
    window.location.hash = `#praktikum-${item.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNote = (note: ClassNote) => {
    setActiveNote(note);
    setCurrentRoute('catatan-detail');
    window.location.hash = `#catatan-${note.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDocument = (doc: DocumentItem) => {
    setActiveDocument(doc);
    setCurrentRoute('document-detail');
    window.location.hash = `#file-${doc.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlogPost = (post: BlogPost) => {
    setActiveBlogPost(post);
    setCurrentRoute('article-detail');
    window.location.hash = `#blog-${post.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSection = (sectionId: string) => {
    setCurrentRoute('main');
    window.location.hash = `#${sectionId}`;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // --- CRUD Firestore Actions: Catatan Kelas ---
  const handleUpdateNote = async (updatedNote: ClassNote) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    if (activeNote && activeNote.id === updatedNote.id) {
      setActiveNote(updatedNote);
    }
    try {
      await saveClassNoteToFirestore(updatedNote);
    } catch (e) {
      console.warn('Failed to sync updated note to Firestore:', e);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    handleBackToSection('catatan-kelas');
    try {
      await deleteClassNoteFromFirestore(noteId);
      addToast('Catatan Dihapus dari Cloud', 'Catatan berhasil dihapus dari Firebase.', 'info');
    } catch (e) {
      console.warn('Failed to delete note from Firestore:', e);
    }
  };

  // --- CRUD Firestore Actions: Dokumen & Modul ---
  const handleAddDocument = async (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    try {
      await saveDocumentToFirestore(newDoc);
    } catch (e) {
      console.warn('Failed to sync new document to Firestore:', e);
    }
  };

  const handleUpdateDocument = async (updatedDoc: DocumentItem) => {
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
    if (activeDocument && activeDocument.id === updatedDoc.id) {
      setActiveDocument(updatedDoc);
    }
    try {
      await saveDocumentToFirestore(updatedDoc);
    } catch (e) {
      console.warn('Failed to sync updated document to Firestore:', e);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    if (activeDocument && activeDocument.id === docId) {
      handleBackToSection('modul');
    }
    try {
      await deleteDocumentFromFirestore(docId);
    } catch (e) {
      console.warn('Failed to delete doc from Firestore:', e);
    }
  };

  const handleDownloadDocument = (doc: DocumentItem) => {
    // Increment download counter locally & in Firestore
    doc.downloads = (doc.downloads || 0) + 1;
    incrementDocumentDownloads(doc.id);

    // If file is stored in Firebase Storage or external URL, open/download directly
    if (doc.fileUrl && doc.fileUrl.startsWith('http')) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `${doc.title.replace(/[/\\?%*:|"<>]/g, '-')}.${doc.fileFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast(
        `Mengunduh Berkas Cloud: ${doc.title}`,
        `File ${doc.fileFormat} (${doc.fileSize}) sedang diunduh dari Firebase Storage.`,
        'success'
      );
      return;
    }

    // Default module syllabus package generator
    const dummyContent = `=====================================================
KELAS PAK HAFIZ — PEMBELAJARAN KIMIA & IPA SMA
Judul Berkas: ${doc.title}
Jenjang: ${doc.classGrade} | Format: ${doc.fileFormat} (${doc.fileSize})
Tanggal Rilis: ${doc.updatedDate}
Kategori: ${doc.category}
=====================================================

Ringkasan:
${doc.summary}

Materi yang Termuat:
${doc.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Catatan Pengajar (Pak Hafiz Akhyar, S.Si.):
Gunakan modul ini sebagai panduan belajar mandiri maupun praktikum di sekolah.
Untuk pembahasan video lengkap dan bank soal interaktif, kunjungi Website Pembelajaran Utama:
https://www.kelaspakhafiz.my.id/

© Kelas Pak Hafiz — Sains Dalam Sudut Pandang yang Lebih Segar.
`;

    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/[/\\?%*:|"<>]/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast(
      `Berhasil Mengunduh: ${doc.title}`,
      `File ${doc.fileFormat} (${doc.fileSize}) telah siap disimpan di perangkatmu.`,
      'success'
    );
  };

  // --- CRUD Firestore Actions: Artikel Blog ---
  const handleAddArticle = async (newPost: BlogPost) => {
    setBlogPosts((prev) => [newPost, ...prev]);
    try {
      await saveArticleToFirestore(newPost);
    } catch (e) {
      console.warn('Failed to sync new article to Firestore:', e);
    }
  };

  const handleUpdateArticle = async (updatedPost: BlogPost) => {
    setBlogPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    if (activeBlogPost && activeBlogPost.id === updatedPost.id) {
      setActiveBlogPost(updatedPost);
    }
    try {
      await saveArticleToFirestore(updatedPost);
    } catch (e) {
      console.warn('Failed to sync updated article to Firestore:', e);
    }
  };

  const handleDeleteArticle = async (postId: string) => {
    setBlogPosts((prev) => prev.filter((p) => p.id !== postId));
    if (activeBlogPost && activeBlogPost.id === postId) {
      handleBackToSection('blog');
    }
    try {
      await deleteArticleFromFirestore(postId);
    } catch (e) {
      console.warn('Failed to delete article from Firestore:', e);
    }
  };

  const handleLikeArticle = (postId: string) => {
    incrementArticleReactions(postId);
  };

  // --- CRUD Firestore Actions: Galeri Foto ---
  const handleAddGalleryItem = async (newItem: GalleryItem) => {
    setGalleryItems((prev) => [newItem, ...prev]);
    try {
      await saveGalleryItemToFirestore(newItem);
    } catch (e) {
      console.warn('Failed to sync new gallery item to Firestore:', e);
    }
  };

  const handleUpdateGalleryItem = async (updatedItem: GalleryItem) => {
    setGalleryItems((prev) => prev.map((g) => (g.id === updatedItem.id ? updatedItem : g)));
    if (activeGalleryItem && activeGalleryItem.id === updatedItem.id) {
      setActiveGalleryItem(updatedItem);
    }
    try {
      await saveGalleryItemToFirestore(updatedItem);
    } catch (e) {
      console.warn('Failed to sync updated gallery item to Firestore:', e);
    }
  };

  const handleDeleteGalleryItem = async (itemId: string) => {
    setGalleryItems((prev) => prev.filter((i) => i.id !== itemId));
    if (activeGalleryItem && activeGalleryItem.id === itemId) {
      handleBackToSection('galeri');
    }
    try {
      await deleteGalleryItemFromFirestore(itemId);
      addToast('Dokumentasi Dihapus', 'Dokumentasi praktikum berhasil dihapus.', 'info');
    } catch (e) {
      console.warn('Failed to delete gallery item from Firestore:', e);
    }
  };

  // --- CRUD Firestore Actions: Video Praktikum YouTube ---
  const handleAddPracticalVideo = async (newVideo: PracticalVideoItem) => {
    setPracticalVideos((prev) => [newVideo, ...prev]);
    try {
      await savePracticalVideoToFirestore(newVideo);
    } catch (e) {
      console.warn('Failed to sync new video to Firestore:', e);
    }
  };

  const handleUpdatePracticalVideo = async (updatedVideo: PracticalVideoItem) => {
    setPracticalVideos((prev) => prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)));
    try {
      await savePracticalVideoToFirestore(updatedVideo);
    } catch (e) {
      console.warn('Failed to sync updated video to Firestore:', e);
    }
  };

  const handleDeletePracticalVideo = async (videoId: string) => {
    setPracticalVideos((prev) => prev.filter((v) => v.id !== videoId));
    try {
      await deletePracticalVideoFromFirestore(videoId);
      addToast('Video Dihapus', 'Video praktikum YouTube telah dihapus.', 'info');
    } catch (e) {
      console.warn('Failed to delete video from Firestore:', e);
    }
  };

  const handleOpenMainPortal = () => {
    setIsMainPortalModalOpen(true);
  };

  const handleConfirmRedirect = () => {
    window.open('https://www.kelaspakhafiz.my.id/', '_blank', 'noopener,noreferrer');
    addToast(
      'Membuka Portal Pembelajaran',
      'Mengarahkan ke https://www.kelaspakhafiz.my.id/',
      'info'
    );
  };

  const handleShare = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast(
        'Tautan Disalin ke Clipboard',
        `Tautan untuk "${title}" siap dibagikan ke teman atau grup kelasmu.`,
        'info'
      );
    } else {
      addToast('Tautan Siap Dibagikan', window.location.href, 'info');
    }
  };

  const handleContactSubmitSuccess = (name: string) => {
    addToast(
      'Pesan Terkirim!',
      `Terima kasih ${name}, Pak Hafiz akan membalas pertanyaanmu segera.`,
      'success'
    );
  };

  const handleExploreClick = () => {
    const nextEl = document.getElementById('catatan-kelas') || document.getElementById('galeri');
    if (nextEl) {
      const navOffset = 80;
      const elementPosition = nextEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#334155] flex flex-col font-sans selection:bg-[#0284C7]/20 selection:text-[#0F172A]">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Sticky Navigation */}
      <Navbar
        onOpenMainPortal={handleOpenMainPortal}
        activeSection={activeSection}
        isAdmin={isAdmin}
        onOpenAdminModal={handleOpenAdminModal}
        onLogoutAdmin={handleAdminLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Route-driven Content Rendering */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentRoute === 'praktikum-detail' && activeGalleryItem ? (
            /* Dedicated Full-Page View: Galeri Praktikum */
            <motion.div
              key={`praktikum-${activeGalleryItem.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <PraktikumDetailPage
                item={activeGalleryItem}
                allItems={galleryItems}
                onSelectItem={handleSelectGalleryItem}
                onBack={() => handleBackToSection('galeri')}
                onAddToast={addToast}
                onOpenMainPortal={handleOpenMainPortal}
                isAdmin={isAdmin}
                onUpdateItem={handleUpdateGalleryItem}
                onDeleteItem={handleDeleteGalleryItem}
              />
            </motion.div>
          ) : currentRoute === 'catatan-detail' && activeNote ? (
            /* Dedicated Full-Page View: Catatan Kelas */
            <motion.div
              key={`note-${activeNote.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ClassNoteDetailPage
                note={activeNote}
                allNotes={notes}
                onSelectNote={handleSelectNote}
                onBack={() => handleBackToSection('catatan-kelas')}
                onAddToast={addToast}
                onOpenMainPortal={handleOpenMainPortal}
                isAdmin={isAdmin}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
              />
            </motion.div>
          ) : currentRoute === 'document-detail' && activeDocument ? (
            /* Dedicated Full-Page View: Dokumentasi File */
            <motion.div
              key={`doc-${activeDocument.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <DocumentDetailPage
                doc={activeDocument}
                allDocs={documents}
                onSelectDoc={handleSelectDocument}
                onBack={() => handleBackToSection('modul')}
                onDownload={handleDownloadDocument}
                onOpenMainPortal={handleOpenMainPortal}
                onAddToast={addToast}
              />
            </motion.div>
          ) : currentRoute === 'article-detail' && activeBlogPost ? (
            /* Dedicated Full-Page View: Artikel & Blog */
            <motion.div
              key={`article-${activeBlogPost.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ArticleDetailPage
                post={activeBlogPost}
                allPosts={blogPosts}
                onSelectPost={handleSelectBlogPost}
                onBack={() => handleBackToSection('blog')}
                onOpenMainPortal={handleOpenMainPortal}
                onAddToast={addToast}
                onLikePost={handleLikeArticle}
                isAdmin={isAdmin}
                onDeletePost={handleDeleteArticle}
                onUpdatePost={handleUpdateArticle}
              />
            </motion.div>
          ) : (
            /* Main Landing Page Layout with All Sections */
            <motion.div
              key="main-landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <Hero
                onOpenMainPortal={handleOpenMainPortal}
                onExploreClick={handleExploreClick}
                isAdmin={isAdmin}
                onAddToast={addToast}
                praktikumCount={galleryItems.length}
                notesCount={notes.length}
                documentsCount={documents.length}
                articlesCount={blogPosts.length}
              />

              <ClassNotesSection
                onAddToast={addToast}
                onSelectNote={handleSelectNote}
                notes={notes}
                setNotes={setNotes}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
              />

              <GallerySection
                onSelectItem={handleSelectGalleryItem}
                items={galleryItems}
                videos={practicalVideos}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                onAddItem={handleAddGalleryItem}
                onDeleteItem={handleDeleteGalleryItem}
                onUpdateItem={handleUpdateGalleryItem}
                onAddVideo={handleAddPracticalVideo}
                onUpdateVideo={handleUpdatePracticalVideo}
                onDeleteVideo={handleDeletePracticalVideo}
                onAddToast={addToast}
              />

              <DocumentsSection
                onPreviewDoc={handleSelectDocument}
                onDownloadDoc={handleDownloadDocument}
                docs={documents}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                onAddDoc={handleAddDocument}
                onUpdateDoc={handleUpdateDocument}
                onDeleteDoc={handleDeleteDocument}
                onAddToast={addToast}
              />

              <BlogSection
                onSelectPost={handleSelectBlogPost}
                onOpenMainPortal={handleOpenMainPortal}
                posts={blogPosts}
                isAdmin={isAdmin}
                setIsAdmin={setIsAdmin}
                onAddPost={handleAddArticle}
                onDeletePost={handleDeleteArticle}
                onUpdatePost={handleUpdateArticle}
                onAddToast={addToast}
              />

              <LearningPlatformCTA
                onOpenMainPortal={handleOpenMainPortal}
              />

              <PortfolioSection
                isAdmin={isAdmin}
                onAddToast={addToast}
              />

              <ProfileSection
                isAdmin={isAdmin}
                onAddToast={addToast}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onOpenMainPortal={handleOpenMainPortal}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Interactive Modals (Gallery Detail Lightbox & Portal Confirmation) */}
      <GalleryDetailModal
        item={selectedGalleryItem}
        onClose={() => setSelectedGalleryItem(null)}
        onOpenMainPortal={handleOpenMainPortal}
        onShare={handleShare}
      />

      <MainPlatformModal
        isOpen={isMainPortalModalOpen}
        onClose={() => setIsMainPortalModalOpen(false)}
        onConfirmRedirect={handleConfirmRedirect}
      />

      {/* Admin Auth Modal (Mode Guru Login) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
