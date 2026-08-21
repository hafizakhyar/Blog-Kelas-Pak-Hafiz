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
import { INITIAL_CLASS_NOTES, DOCUMENT_ITEMS, BLOG_POSTS } from './data/mockData';

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

  // Notes state with persistence
  const [notes, setNotes] = useState<ClassNote[]>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
    return INITIAL_CLASS_NOTES;
  });

  // Admin Auth State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Save notes whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes', e);
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
      const matchedDoc = DOCUMENT_ITEMS.find(
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
      const matchedPost = BLOG_POSTS.find(
        (p) =>
          p.id.toLowerCase() === rawParam ||
          p.id.toLowerCase() === `post-${rawParam}` ||
          p.slug.toLowerCase() === rawParam ||
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
  }, [notes]);

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

  // Note updates & deletion (from admin mode in full detail page or section)
  const handleUpdateNote = (updatedNote: ClassNote) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    if (activeNote && activeNote.id === updatedNote.id) {
      setActiveNote(updatedNote);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    handleBackToSection('catatan-kelas');
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

  const handleDownloadDocument = (doc: DocumentItem) => {
    doc.downloads += 1;
    
    // Create simulated downloadable file
    const dummyContent = `=====================================================
KELAS PAK HAFIZ — PEMBELAJARAN KIMIA & IPA SMA
Judul Berkas: ${doc.title}
Jenjang: ${doc.classGrade} | Format: ${doc.fileFormat}
Tanggal Rilis: ${doc.updatedDate}
Kategori: ${doc.category}
=====================================================

Ringkasan:
${doc.summary}

Materi yang Termuat:
${doc.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Catatan Pengajar:
Gunakan modul ini sebagai panduan belajar mandiri maupun praktikum di sekolah.
Untuk pembahasan video lengkap dan kuis latihan, kunjungi Website Pembelajaran Utama Kelas Pak Hafiz:
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
            allDocs={DOCUMENT_ITEMS}
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
            allPosts={BLOG_POSTS}
            onSelectPost={handleSelectBlogPost}
            onBack={() => handleBackToSection('blog')}
            onOpenMainPortal={handleOpenMainPortal}
            onAddToast={addToast}
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
            />

            <DocumentsSection
              onPreviewDoc={handleSelectDocument}
              onDownloadDoc={handleDownloadDocument}
            />

            <BlogSection
              onSelectPost={handleSelectBlogPost}
              onOpenMainPortal={handleOpenMainPortal}
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
