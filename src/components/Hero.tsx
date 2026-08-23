import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, ExternalLink, CheckCircle2, Camera, Globe, Upload } from 'lucide-react';
import { PhotoChangerModal } from './Modals/PhotoChangerModal';
import { STORAGE_FOLDERS } from '../lib/firebase';

interface HeroProps {
  onOpenMainPortal: () => void;
  onExploreClick: () => void;
  isAdmin?: boolean;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
}

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi';
const DEFAULT_LOGO = 'https://lh3.googleusercontent.com/d/1Oqck2N6fpJ_lbowm_21Kz4KGGt1Szuge';
const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=85';

export const Hero: React.FC<HeroProps> = ({
  onOpenMainPortal,
  onExploreClick,
  isAdmin = false,
  onAddToast = (_t: string, _d?: string, _ty?: 'success' | 'info') => {}
}) => {
  // Stored in localStorage for instant personalization
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('hero_teacher_avatar') || DEFAULT_AVATAR;
  });
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('hero_teacher_logo') || DEFAULT_LOGO;
  });
  const [bannerUrl, setBannerUrl] = useState<string>(() => {
    return localStorage.getItem('hero_lab_banner') || DEFAULT_BANNER;
  });

  // Modal active states
  const [photoModalState, setPhotoModalState] = useState<{
    isOpen: boolean;
    type: 'avatar' | 'logo' | 'banner';
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

  const handleOpenPhotoModal = (type: 'avatar' | 'logo' | 'banner') => {
    if (type === 'avatar') {
      setPhotoModalState({
        isOpen: true,
        type: 'avatar',
        currentUrl: avatarUrl,
        title: 'Foto Profil Pak Hafiz Akhyar, S.Si.',
        modalTitle: 'Ganti Foto Profil Guru'
      });
    } else if (type === 'logo') {
      setPhotoModalState({
        isOpen: true,
        type: 'logo',
        currentUrl: logoUrl,
        title: 'Logo Resmi Kelas Pak Hafiz',
        modalTitle: 'Ganti Logo Brand'
      });
    } else {
      setPhotoModalState({
        isOpen: true,
        type: 'banner',
        currentUrl: bannerUrl,
        title: 'Banner Latar Laboratorium Sains',
        modalTitle: 'Ganti Gambar Latar Hero'
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
    } else if (photoModalState.type === 'banner') {
      setBannerUrl(newUrl);
      localStorage.setItem('hero_lab_banner', newUrl);
      onAddToast('Latar Laboratorium Diperbarui', 'Banner hero berhasil diganti.', 'success');
    }
    setPhotoModalState((prev) => ({ ...prev, isOpen: false }));
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-semibold shadow-2xs">
                  <img
                    src={avatarUrl}
                    alt="Pak Hafiz Akhyar, S.Si."
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded-full object-cover border border-[#0284C7]/30"
                  />
                  <span>Diasuh oleh Pak Hafiz Akhyar, S.Si.</span>
                </div>
                <span className="text-[#0284C7] font-bold text-xs uppercase tracking-widest hidden sm:inline">
                  • Kimia & Sains SMA
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.18] text-[#0F172A] mb-4 tracking-tight">
                Belajar Sains Lebih <br className="hidden sm:inline" />
                <span className="text-[#0284C7] font-medium">Simpel dan Menarik</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl mb-8">
                Ruang dokumentasi, galeri eksperimen praktikum, dan catatan belajar Kimia SMA yang dibuat simpel, relevan, dan menyenangkan. Menghubungkan rumus konseptual dengan fenomena nyata di sekitarmu.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-8">
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

              {/* Trust & Key Metrics */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-[#E2E8F0] w-full max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-heading text-[#0F172A]">35+</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5 font-medium">Praktikum Selesai</div>
                </div>
                <div className="border-x border-[#E2E8F0] px-3 sm:px-4">
                  <div className="text-xl sm:text-2xl font-bold font-heading text-[#0284C7]">18+</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5 font-medium">Modul & LKPD Bebas</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-heading text-[#0369A1]">100%</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5 font-medium">Aplikasi Nyata</div>
                </div>
              </div>
            </motion.div>

            {/* Visual Column (5 cols) with Educator Profile & Laboratory Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5 relative"
            >
              <div className="relative h-[340px] sm:h-[380px] bg-[#E0F2FE]/50 rounded-[24px] overflow-hidden flex items-center justify-center shadow-inner border border-[#BAE6FD]/60 p-5 group/banner">
                {/* Background Image layer with subtle soft overlay */}
                <img
                  src={bannerUrl}
                  alt="Eksperimen Laboratorium Kimia SMA"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover/banner:scale-105 transition-transform duration-700"
                />
                
                {/* Admin button to change laboratory background */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleOpenPhotoModal('banner')}
                    className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-full bg-white/95 hover:bg-[#0284C7] text-[#0284C7] hover:text-white border border-[#BAE6FD] text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
                    title="Ganti Background Lab Hero via Upload / Google Search"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Ganti Background Lab</span>
                  </button>
                )}

                {/* Geometric color wash */}
                <div className="absolute inset-0 bg-linear-to-tr from-[#0284C7]/20 via-white/40 to-transparent pointer-events-none" />

                {/* Main Profile Card in Hero */}
                <div className="relative z-10 w-full max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/80 flex flex-col items-center text-center">
                  {/* Avatar Container with Official Logo Floating Badge */}
                  <div className="relative mb-3 group/avatar">
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full ring-4 ring-[#BAE6FD] overflow-hidden shadow-md bg-white">
                      <img
                        src={avatarUrl}
                        alt="Pak Hafiz Akhyar, S.Si."
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Teacher Avatar Edit Button */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleOpenPhotoModal('avatar')}
                        className="absolute inset-0 rounded-full bg-black/50 text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-[9px] font-bold cursor-pointer"
                        title="Ganti Foto Profil Guru"
                      >
                        <Camera className="w-4 h-4 mb-0.5" />
                        <span>Ganti Foto</span>
                      </button>
                    )}

                    {/* Official Logo Floating Badge */}
                    <div
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white ring-2 ring-[#0284C7] shadow-sm flex items-center justify-center overflow-hidden p-0.5 group/logo"
                      title={isAdmin ? 'Klik untuk ganti Logo' : 'Logo Resmi Kelas Pak Hafiz'}
                      onClick={isAdmin ? () => handleOpenPhotoModal('logo') : undefined}
                    >
                      <img
                        src={logoUrl}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full cursor-pointer"
                      />
                      {isAdmin && (
                        <div className="absolute inset-0 bg-black/60 text-white opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <Camera className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-heading text-[#0F172A] leading-tight">
                    Pak Hafiz Akhyar, S.Si.
                  </h3>
                  <p className="text-xs text-[#0284C7] font-semibold mt-0.5">
                    Guru Kimia & Edukator Sains SMA
                  </p>
                  
                  <div className="mt-3.5 pt-3 border-t border-[#E2E8F0] w-full flex items-center justify-center gap-4 text-xs text-[#475569]">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Eksperimen Interaktif</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Modul Kurikulum</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Overlay Pill Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/80 flex justify-between items-center shadow-xs z-20">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
                    <span className="text-[11px] font-semibold text-[#0F172A]">Projek: Indikator Alami Nusantara</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider">Aktif</span>
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
