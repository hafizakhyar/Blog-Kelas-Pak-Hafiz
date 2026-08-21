import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClassNotesSection } from './components/ClassNotesSection';
import { GallerySection } from './components/GallerySection';
import { DocumentsSection } from './components/DocumentsSection';
import { BlogSection } from './components/BlogSection';
import { LearningPlatformCTA } from './components/LearningPlatformCTA';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GalleryDetailModal } from './components/Modals/GalleryDetailModal';
import { MainPlatformModal } from './components/Modals/MainPlatformModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ClassNoteDetailPage } from './components/Pages/ClassNoteDetailPage';
import { DocumentDetailPage } from './components/Pages/DocumentDetailPage';
import { ArticleDetailPage } from './components/Pages/ArticleDetailPage';
import { GalleryItem, BlogPost, DocumentItem, ClassNote } from './types';
import { INITIAL_CLASS_NOTES, DOCUMENT_ITEMS, BLOG_POSTS, GALLERY_ITEMS } from './data/mockData';
import {
  subscribeToClassNotes,
  subscribeToDocuments,
  subscribeToArticles,
  subscribeToGalleryPhotos,
  saveClassNoteToFirestore,
  deleteClassNoteFromFirestore,
  saveDocumentToFirestore,
  deleteDocumentFromFirestore,
  incrementDocumentDownloads,
  saveArticleToFirestore,
  deleteArticleFromFirestore,
  incrementArticleReactions,
  saveGalleryItemToFirestore,
  deleteGalleryItemFromFirestore
} from './lib/firebase';

const NOTES_STORAGE_KEY = 'kelaspakhafiz_class_notes_v2';
const ADMIN_AUTH_KEY = 'kelaspakhafiz_admin_auth_v1';

type RouteView = 'main' | 'catatan-detail' | 'document-detail' | 'article-detail';

export default function App() {
  // Navigation & View Route State
  const [currentRoute, setCurrentRoute] = useState<RouteView>('main');
  const [activeSection, setActiveSection] = useState<string>('beranda');

  // Active items for dedicated detail pages
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
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load local notes', e);
    }
    return INITIAL_CLASS_NOTES;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(DOCUMENT_ITEMS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(GALLERY_ITEMS);

  // Admin Auth State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

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
      }
    });

    return () => {
      unsubNotes();
      unsubDocs();
      unsubArticles();
      unsubPhotos();
    };
  }, []);

  // Save notes locally for offline backup
  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes locally', e);
    }
  }, [notes]);

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

  // Helper to resolve route from URL hash
  const parseHashRoute = useCallback(() => {
    const hash = window.location.hash.trim();
    if (!hash || hash === '#' || hash === '#beranda') {
      setCurrentRoute('main');
      setActiveSection('beranda');
      return;
    }

    // 1. Check Catatan Kelas detail: #catatan-... (excluding #catatan-kelas)
    if (hash.startsWith('#catatan-') && hash !== '#catatan-kelas') {
      const rawParam = hash.replace('#catatan-', '').toLowerCase();
      const matchedNote = notes.find(
        (n) =>
          n.id.toLowerCase() === rawParam ||
          n.id.toLowerCase() === `note-${rawParam}` ||
          n.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(rawParam) ||
          rawParam.includes(n.id.toLowerCase())
      );

      if (matchedNote) {
        setActiveNote(matchedNote);
        setCurrentRoute('catatan-detail');
        setActiveSection('catatan-kelas');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 2. Check Document detail: #file-... or #modul-... (excluding #modul)
    if (
      (hash.startsWith('#file-') || hash.startsWith('#dokumentasi-') || hash.startsWith('#modul-')) &&
      hash !== '#modul' &&
      hash !== '#dokumentasi-file'
    ) {
      const rawParam = hash.replace(/^#(file|dokumentasi|modul)-/, '').toLowerCase();
      const matchedDoc = documents.find(
        (d) =>
          d.id.toLowerCase() === rawParam ||
          d.id.toLowerCase() === `doc-${rawParam}` ||
          d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(rawParam) ||
          rawParam.includes(d.id.toLowerCase())
      );

      if (matchedDoc) {
        setActiveDocument(matchedDoc);
        setCurrentRoute('document-detail');
        setActiveSection('modul');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 3. Check Blog Post detail: #blog-... or #artikel-... (excluding #blog)
    if ((hash.startsWith('#blog-') || hash.startsWith('#artikel-')) && hash !== '#blog' && hash !== '#artikel') {
      const rawParam = hash.replace(/^#(blog|artikel)-/, '').toLowerCase();
      const matchedPost = blogPosts.find(
        (p) =>
          p.id.toLowerCase() === rawParam ||
          p.id.toLowerCase() === `post-${rawParam}` ||
          p.slug?.toLowerCase() === rawParam ||
          p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(rawParam) ||
          rawParam.includes(p.id.toLowerCase())
      );

      if (matchedPost) {
        setActiveBlogPost(matchedPost);
        setCurrentRoute('article-detail');
        setActiveSection('blog');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // 4. Fallback: Main Landing Page Section
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
  }, [notes, documents, blogPosts]);

  // Listen to Hash Changes
  useEffect(() => {
    parseHashRoute();
    window.addEventListener('hashchange', parseHashRoute);
    return () => window.removeEventListener('hashchange', parseHashRoute);
  }, [parseHashRoute]);

  // Scroll section spy (only active when on main landing route)
  useEffect(() => {
    if (currentRoute !== 'main') return;

    const sections = ['beranda', 'galeri', 'catatan-kelas', 'modul', 'blog', 'kontak'];
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

  const handleDeleteGalleryItem = async (itemId: string) => {
    setGalleryItems((prev) => prev.filter((i) => i.id !== itemId));
    try {
      await deleteGalleryItemFromFirestore(itemId);
    } catch (e) {
      console.warn('Failed to delete gallery item from Firestore:', e);
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
    const galeriEl = document.getElementById('galeri');
    if (galeriEl) {
      galeriEl.scrollIntoView({ behavior: 'smooth' });
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
      />

      {/* Route-driven Content Rendering */}
      <main className="flex-grow">
        {currentRoute === 'catatan-detail' && activeNote ? (
          /* Dedicated Full-Page View: Catatan Kelas */
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
        ) : currentRoute === 'document-detail' && activeDocument ? (
          /* Dedicated Full-Page View: Dokumentasi File */
          <DocumentDetailPage
            doc={activeDocument}
            allDocs={documents}
            onSelectDoc={handleSelectDocument}
            onBack={() => handleBackToSection('modul')}
            onDownload={handleDownloadDocument}
            onOpenMainPortal={handleOpenMainPortal}
            onAddToast={addToast}
          />
        ) : currentRoute === 'article-detail' && activeBlogPost ? (
          /* Dedicated Full-Page View: Artikel & Blog */
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
          />
        ) : (
          /* Main Landing Page Layout with All Sections */
          <>
            <Hero
              onOpenMainPortal={handleOpenMainPortal}
              onExploreClick={handleExploreClick}
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
              onSelectItem={(item) => setSelectedGalleryItem(item)}
              items={galleryItems}
              isAdmin={isAdmin}
              onAddItem={handleAddGalleryItem}
              onDeleteItem={handleDeleteGalleryItem}
              onAddToast={addToast}
            />

            <DocumentsSection
              onPreviewDoc={handleSelectDocument}
              onDownloadDoc={handleDownloadDocument}
              docs={documents}
              isAdmin={isAdmin}
              onAddDoc={handleAddDocument}
              onDeleteDoc={handleDeleteDocument}
              onAddToast={addToast}
            />

            <BlogSection
              onSelectPost={handleSelectBlogPost}
              onOpenMainPortal={handleOpenMainPortal}
              posts={blogPosts}
              isAdmin={isAdmin}
              onAddPost={handleAddArticle}
              onDeletePost={handleDeleteArticle}
              onAddToast={addToast}
            />

            <LearningPlatformCTA
              onOpenMainPortal={handleOpenMainPortal}
            />

            <ContactSection
              onSubmitSuccess={handleContactSubmitSuccess}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenMainPortal={handleOpenMainPortal} />

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
    </div>
  );
}
