import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Share2,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { WhatsAppShareButton } from '../Common/WhatsAppShareButton';
import { sharePraktikumToWhatsApp } from '../../utils/share';

interface GalleryDetailModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onOpenMainPortal: () => void;
  onShare: (title: string) => void;
}

export const GalleryDetailModal: React.FC<GalleryDetailModalProps> = ({
  item,
  onClose,
  onOpenMainPortal,
  onShare
}) => {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Extract all photos from item
  const photos = item
    ? (Array.isArray(item.images) && item.images.length > 0
        ? item.images.filter(Boolean)
        : (item.image ? [item.image] : []))
    : [];

  const totalPhotos = photos.length;

  // Reset index when item changes
  useEffect(() => {
    setCurrentPhotoIdx(0);
  }, [item?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!item || totalPhotos <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentPhotoIdx((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPhotoIdx((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, totalPhotos]);

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (totalPhotos <= 1) return;
    setCurrentPhotoIdx((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (totalPhotos <= 1) return;
    setCurrentPhotoIdx((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || totalPhotos <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> Next
        handleNextPhoto();
      } else {
        // Swipe right -> Prev
        handlePrevPhoto();
      }
    }
    setTouchStartX(null);
  };

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-md backdrop-blur-sm transition-all border border-[#E2E8F0] cursor-pointer"
              aria-label="Tutup modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Header & Carousel Slider */}
            <div
              className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#0F172A] select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Active Image with Slide Animation */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhotoIdx}
                  src={photos[currentPhotoIdx] || item.image}
                  alt={`${item.title} - Foto ${currentPhotoIdx + 1}`}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent pointer-events-none" />

              {/* Slider Left Arrow */}
              {totalPhotos > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#0F172A] shadow-lg backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Foto Sebelumnya (Geser Kiri)"
                  aria-label="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5 text-[#0F172A]" />
                </button>
              )}

              {/* Slider Right Arrow */}
              {totalPhotos > 1 && (
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#0F172A] shadow-lg backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Foto Selanjutnya (Geser Kanan)"
                  aria-label="Foto Selanjutnya"
                >
                  <ChevronRight className="w-5 h-5 text-[#0F172A]" />
                </button>
              )}

              {/* Top/Bottom Overlay Info */}
              <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#0284C7] text-white shadow-xs">
                    {item.category}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {item.badge}
                  </span>

                  {/* Multi-photo indicator badge */}
                  {totalPhotos > 1 && (
                    <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-[#0284C7]/90 text-white backdrop-blur-xs shadow-xs border border-white/25">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{currentPhotoIdx + 1} / {totalPhotos} Foto</span>
                    </span>
                  )}

                  {item.videoDuration && (
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-black/45 text-white backdrop-blur-xs">
                      <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                      {item.videoDuration}
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white leading-tight drop-shadow-xs">
                  {item.title}
                </h2>
              </div>

              {/* Pagination Dots indicator on photo */}
              {totalPhotos > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPhotoIdx(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentPhotoIdx === idx
                          ? 'w-6 bg-[#38BDF8]'
                          : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                      aria-label={`Buka foto ke-${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip (if multiple photos) */}
            {totalPhotos > 1 && (
              <div className="bg-[#F1F5F9] px-6 py-2.5 border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                  <ImageIcon className="w-3 h-3 text-[#0284C7]" />
                  <span>Album ({totalPhotos}):</span>
                </span>
                {photos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPhotoIdx(idx)}
                    className={`relative w-12 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      currentPhotoIdx === idx
                        ? 'border-[#0284C7] ring-2 ring-[#0284C7]/30 scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photoUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 px-1 text-[8px] font-bold bg-black/70 text-white rounded-tl">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[50vh] overflow-y-auto">
              {/* Meta & Description */}
              <div className="flex items-center justify-between text-xs text-[#64748B] border-b border-[#E2E8F0] pb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0284C7]" />
                  {item.date}
                </span>
                <div className="flex items-center gap-2">
                  <WhatsAppShareButton
                    onClick={() => sharePraktikumToWhatsApp(item)}
                    label="WhatsApp"
                    size="sm"
                    title="Bagikan ke WhatsApp"
                  />
                  <button
                    onClick={() => onShare(item.title)}
                    className="flex items-center gap-1 text-[#0F172A] hover:text-[#0284C7] font-semibold transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Salin
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[#334155] text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Chemistry Core Concept */}
              <div className="p-4.5 rounded-[20px] bg-[#E0F2FE] border border-[#BAE6FD]">
                <div className="flex items-center gap-2 mb-2 text-[#0369A1] font-bold text-sm font-heading">
                  <Sparkles className="w-4 h-4 text-[#0284C7]" />
                  Prinsip Sains & Reaksi Kimia
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  {item.chemistryConcept}
                </p>
              </div>

              {/* Materials & Tools */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F172A] mb-3">
                  Alat & Bahan Praktikum
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.materials.map((mat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#64748B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-2 shrink-0" />
                      <span>{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#0F172A] mb-3">
                  Prosedur & Langkah Kerja
                </h3>
                <div className="space-y-2.5">
                  {item.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F4F8FC] border border-[#E2E8F0] text-xs sm:text-sm text-[#334155]">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0284C7] text-white font-bold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observations & Results */}
              <div className="p-4.5 rounded-[20px] bg-amber-50/80 border border-amber-200">
                <div className="flex items-center gap-2 mb-1.5 text-amber-900 font-bold text-sm font-heading">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  Hasil Pengamatan & Kesimpulan
                </div>
                <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
                  {item.results}
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 sm:p-6 bg-[#F4F8FC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#64748B] text-center sm:text-left">
                Ingin latihan soal dan modul interaktif topik ini?
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenMainPortal();
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl shadow-md shadow-[#0284C7]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-white" />
                  <span>Buka di Portal Utama</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
