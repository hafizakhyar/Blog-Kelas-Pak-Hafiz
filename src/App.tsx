import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { NaturalIndicatorLab } from './components/NaturalIndicatorLab';
import { GallerySection } from './components/GallerySection';
import { DocumentsSection } from './components/DocumentsSection';
import { BlogSection } from './components/BlogSection';
import { LearningPlatformCTA } from './components/LearningPlatformCTA';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { GalleryDetailModal } from './components/Modals/GalleryDetailModal';
import { ArticleReaderModal } from './components/Modals/ArticleReaderModal';
import { DocumentPreviewModal } from './components/Modals/DocumentPreviewModal';
import { MainPlatformModal } from './components/Modals/MainPlatformModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { GalleryItem, BlogPost, DocumentItem } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isMainPortalModalOpen, setIsMainPortalModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Add toast helper
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

  // Scroll section spy
  useEffect(() => {
    const sections = ['beranda', 'galeri', 'lab-maya', 'modul', 'blog', 'kontak'];
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
  }, []);

  const handleOpenMainPortal = () => {
    setIsMainPortalModalOpen(true);
  };

  const handleConfirmRedirect = () => {
    window.open('https://www.kelaspakhafiz.my.id/', '_blank', 'noopener,noreferrer');
    addToast(
      'Membuka Portal Kelas Utama',
      'Mengarahkan ke https://www.kelaspakhafiz.my.id/',
      'info'
    );
  };

  const handleDownloadDocument = (doc: DocumentItem) => {
    doc.downloads += 1;
    
    // Create a simulated downloadable text/markdown file for instant user download feedback
    const dummyContent = `=====================================================
KELAS PAK HAFIZ — PEMBELAJARAN KIMIA & IPA SMA
Judul Berkas: ${doc.title}
Jenjang: ${doc.classGrade} | Format: ${doc.fileFormat}
Tanggal Rilis: ${doc.updatedDate}
=====================================================

Ringkasan:
${doc.summary}

Materi yang Termuat:
${doc.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Catatan Pengajar:
Gunakan modul ini sebagai panduan belajar mandiri maupun praktikum di sekolah.
Untuk pembahasan video lengkap dan kuis latihan, kunjungi Website Pembelajaran Utama Kelas Pak Hafiz.

© Kelas Pak Hafiz — Sains Dalam Sudut Pandang yang Lebih Segar.
`;

    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/[/\\?%*:|"<>]/g, '-')}.${doc.fileFormat.toLowerCase() === 'pdf' ? 'txt' : 'txt'}`;
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

      {/* Main Navigation */}
      <Navbar
        onOpenMainPortal={handleOpenMainPortal}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero
          onOpenMainPortal={handleOpenMainPortal}
          onExploreClick={handleExploreClick}
        />

        <NaturalIndicatorLab />

        <GallerySection
          onSelectItem={(item) => setSelectedGalleryItem(item)}
        />

        <DocumentsSection
          onPreviewDoc={(doc) => setSelectedDocument(doc)}
          onDownloadDoc={handleDownloadDocument}
        />

        <BlogSection
          onSelectPost={(post) => setSelectedBlogPost(post)}
          onOpenMainPortal={handleOpenMainPortal}
        />

        <LearningPlatformCTA
          onOpenMainPortal={handleOpenMainPortal}
        />

        <ContactSection
          onSubmitSuccess={handleContactSubmitSuccess}
        />
      </main>

      {/* Footer */}
      <Footer onOpenMainPortal={handleOpenMainPortal} />

      {/* Interactive Modals */}
      <GalleryDetailModal
        item={selectedGalleryItem}
        onClose={() => setSelectedGalleryItem(null)}
        onOpenMainPortal={handleOpenMainPortal}
        onShare={handleShare}
      />

      <ArticleReaderModal
        post={selectedBlogPost}
        onClose={() => setSelectedBlogPost(null)}
        onOpenMainPortal={handleOpenMainPortal}
        onShare={handleShare}
      />

      <DocumentPreviewModal
        doc={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onDownload={handleDownloadDocument}
        onOpenMainPortal={handleOpenMainPortal}
      />

      <MainPlatformModal
        isOpen={isMainPortalModalOpen}
        onClose={() => setIsMainPortalModalOpen(false)}
        onConfirmRedirect={handleConfirmRedirect}
      />
    </div>
  );
}
