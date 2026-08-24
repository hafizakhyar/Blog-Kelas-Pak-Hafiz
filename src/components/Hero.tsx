import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, ExternalLink, CheckCircle2, Camera, FlaskConical, FileText, Layers, FolderDown, ArrowUpRight } from 'lucide-react';
import { PhotoChangerModal } from './Modals/PhotoChangerModal';
import { STORAGE_FOLDERS } from '../lib/firebase';

interface HeroProps {
  onOpenMainPortal: () => void;
  onExploreClick: () => void;
  isAdmin?: boolean;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
  praktikumCount?: number;
  notesCount?: number;
  documentsCount?: number;
  articlesCount?: number;
}

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi';
const DEFAULT_LOGO = 'https://lh3.googleusercontent.com/d/1Oqck2N6fpJ_lbowm_21Kz4KGGt1Szuge';

export const Hero: React.FC<HeroProps> = ({
  onOpenMainPortal,
  onExploreClick,
  isAdmin = false,
  onAddToast = (_t: string, _d?: string, _ty?: 'success' | 'info') => {},
  praktikumCount = 0,
  notesCount = 0,
  documentsCount = 0,
  articlesCount = 0,
}) => {
  // Stored in localStorage for instant personalization
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('hero_teacher_avatar') || DEFAULT_AVATAR;
  });
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('hero_teacher_logo') || DEFAULT_LOGO;
  });

  // Modal active states
  const [photoModalState, setPhotoModalState] = useState<{
    isOpen: boolean;
    type: 'avatar' | 'logo';
    currentUrl: string;
    title: string;
    modalTitle: string;
  }>({
    isOpen: false,
    type: 'avatar',
    currentUrl: DEFAULT_AVATAR,
    title: '',
    modalTitle: ''
  });

  const handleOpenPhotoModal = (type: 'avatar' | 'logo') => {
    if (type === 'avatar') {
      setPhotoModalState({
        isOpen: true,
        type: 'avatar',
        currentUrl: avatarUrl,
        title: 'Foto Profil Pak Hafiz Akhyar, S.Si.',
        modalTitle: 'Ganti Foto Profil Guru'
      });
    } else {
      setPhotoModalState({
        isOpen: true,
        type: 'logo',
        currentUrl: logoUrl,
        title: 'Logo Resmi Kelas Pak Hafiz',
        modalTitle: 'Ganti Logo Brand'
      });
    }
  };

  const handleSavePhoto = (newUrl: string) => {
    if (photoModalState.type === 'avatar') {
      setAvatarUrl(newUrl);
      localStorage.setItem('hero_teacher_avatar', newUrl);
      onAddToast('Foto Profil Diperbarui', 'Foto pengajar berhasil diganti.', 'success');
    } else if (photoModalState.type === 'logo') {
      setLogoUrl(newUrl);
      localStorage.setItem('hero_teacher_logo', newUrl);
      onAddToast('Logo Diperbarui', 'Logo brand berhasil diganti.', 'success');
    }
    setPhotoModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="beranda" className="relative pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Geometric Balance Main Hero Card */}
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(2,132,199,0.06)] border border-[#E2E8F0]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Text Content Column (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-7 flex flex-col items-start text-left"
            >
              {/* Eyebrow with Educator Tag */}
              <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                <div className="relative group/avatar inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-semibold shadow-2xs">
                  <img
                    src={avatarUrl}
                    alt="Pak Hafiz Akhyar, S.Si."
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full object-cover border border-[#0284C7]/30"
                  />
                  <span>Diasuh oleh Pak Hafiz Akhyar, S.Si.</span>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenPhotoModal('avatar')}
                      className="ml-1 text-[10px] text-[#0284C7] hover:underline font-bold"
                      title="Ganti Foto Avatar"
                    >
                      (Ubah)
                    </button>
                  )}
                </div>

                <span className="text-[#0284C7] font-bold text-xs uppercase tracking-widest hidden sm:inline">
                  • Kimia & Sains SMA
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.18] text-[#0F172A] mb-4 tracking-tight">
                Selamat datang di <br className="hidden sm:inline" />
                <span className="text-[#0284C7] font-medium">Catatan Kelas Pak Hafiz</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl mb-8">
                Ruang dokumentasi, galeri eksperimen praktikum, modul kurikulum, dan catatan belajar Kimia SMA yang dibuat simpel, relevan, dan menyenangkan. Menghubungkan rumus konseptual dengan fenomena nyata di sekitarmu.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-6">
                <button
                  onClick={onExploreClick}
                  className="w-full sm:w-auto bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-3.5 rounded-xl text-sm font-medium shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Mulai Jelajahi</span>
                  <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
                </button>

                <a
                  href="https://www.kelaspakhafiz.my.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border border-[#0284C7]/50 text-[#0284C7] hover:text-[#0369A1] hover:bg-[#E0F2FE]/50 bg-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-2xs"
                >
                  <BookOpen className="w-4 h-4 text-[#0284C7]" />
                  <span>Portal Pembelajaran</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#0284C7]" />
                </a>
              </div>

              {/* Feature Highlights Pills */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Kurikulum Merdeka</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Praktikum Interaktif</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-lg">
                  <span className="font-semibold text-[#0F172A]">SMA Islam Al-Jannah</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column (5 cols): Real-Time Statistics Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5"
            >
              <div className="bg-[#F8FAFC] rounded-[24px] border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
                
                {/* Header of Statistics Card */}
                <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-[#E2E8F0]">
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                      Statistik Portal & Konten
                    </h2>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Sinkronisasi otomatis dengan isi setiap menu
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    Live
                  </span>
                </div>

                {/* 2x2 Statistics Bento Grid */}
                <div className="grid grid-cols-2 gap-3.5">
                  
                  {/* Card 1: Praktikum */}
                  <button
                    type="button"
                    onClick={() => scrollToSection('galeri')}
                    className="group text-left bg-white p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#BAE6FD] hover:shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0284C7] transition-colors" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-[#0F172A]">
                      {praktikumCount}
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A] mt-1">
                      Praktikum Selesai
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 leading-tight">
                      Galeri & Laporan Eksperimen
                    </div>
                  </button>

                  {/* Card 2: Catatan Kelas */}
                  <button
                    type="button"
                    onClick={() => scrollToSection('catatan')}
                    className="group text-left bg-white p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#BAE6FD] hover:shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0369A1] transition-colors" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-[#0284C7]">
                      {notesCount}
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A] mt-1">
                      Catatan Kelas
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 leading-tight">
                      Materi & Rangkuman Kimia
                    </div>
                  </button>

                  {/* Card 3: Modul & LKPD */}
                  <button
                    type="button"
                    onClick={() => scrollToSection('dokumen')}
                    className="group text-left bg-white p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#BAE6FD] hover:shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <FolderDown className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#16A34A] transition-colors" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-[#0F172A]">
                      {documentsCount}
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A] mt-1">
                      Modul & LKPD
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 leading-tight">
                      Bahan Ajar Bebas Unduh
                    </div>
                  </button>

                  {/* Card 4: Artikel Sains */}
                  <button
                    type="button"
                    onClick={() => scrollToSection('blog')}
                    className="group text-left bg-white p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#BAE6FD] hover:shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF5FF] text-[#9333EA] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#9333EA] transition-colors" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-[#0F172A]">
                      {articlesCount}
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A] mt-1">
                      Artikel Sains
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 leading-tight">
                      Ulasan & Literasi Kimia
                    </div>
                  </button>

                </div>

                {/* Footer Info of Statistics Card */}
                <div className="mt-4 pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Klik pada kartu untuk menuju menu terkait</span>
                  <span className="font-medium text-[#0284C7]">100% Terbuka</span>
                </div>

              </div>
            </motion.div>

          </div>
        </div>

      </div>

      {/* Hero Photo Changer Modal */}
      <PhotoChangerModal
        isOpen={photoModalState.isOpen}
        onClose={() => setPhotoModalState((prev) => ({ ...prev, isOpen: false }))}
        currentImageUrl={photoModalState.currentUrl}
        itemTitle={photoModalState.title}
        modalTitle={photoModalState.modalTitle}
        storageFolder={STORAGE_FOLDERS.NOTES_IMAGES}
        onSavePhoto={handleSavePhoto}
        onAddToast={onAddToast}
      />
    </section>
  );
};


