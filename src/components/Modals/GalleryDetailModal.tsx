import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Sparkles, CheckCircle2, Clock, Share2, ArrowRight, BookOpen } from 'lucide-react';
import { GalleryItem } from '../../types';

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
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#0F172A] shadow-md backdrop-blur-sm transition-all border border-[#E2E8F0] cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Header */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#E2E8F0]">
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />
            
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#0284C7] text-white shadow-xs">
                  {item.category}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {item.badge}
                </span>
                {item.videoDuration && (
                  <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-black/45 text-white backdrop-blur-xs">
                    <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                    {item.videoDuration}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white leading-tight">
                {item.title}
              </h2>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Meta & Description */}
            <div className="flex items-center justify-between text-xs text-[#64748B] border-b border-[#E2E8F0] pb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0284C7]" />
                {item.date}
              </span>
              <button
                onClick={() => onShare(item.title)}
                className="flex items-center gap-1 text-[#0F172A] hover:text-[#0284C7] font-semibold transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Bagikan
              </button>
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
    </AnimatePresence>
  );
};
