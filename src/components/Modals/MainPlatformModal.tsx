import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, PlayCircle, Users, Trophy, ExternalLink } from 'lucide-react';

interface MainPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRedirect: () => void;
}

export const MainPlatformModal: React.FC<MainPlatformModalProps> = ({
  isOpen,
  onClose,
  onConfirmRedirect
}) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: <PlayCircle className="w-5 h-5 text-[#0284C7]" />,
      title: '120+ Video Eksperimen & Materi Full HD',
      desc: 'Penjelasan konsep kimia step-by-step dari dasar hingga soal bertaraf olimpiade.'
    },
    {
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      title: 'Kuis Gamifikasi & Bank Soal SNBT / UTBK',
      desc: 'Latihan soal berwaktu dengan pembahasan interaktif instan dan ranking kelas.'
    },
    {
      icon: <Users className="w-5 h-5 text-[#0284C7]" />,
      title: 'Forum Diskusi Tanya PR Kimia 24/7',
      desc: 'Tanyakan soal kimia yang sulit langsung dibimbing oleh Pak Hafiz dan mentor alumni.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: 'Sertifikat & Tracker Progres Belajar',
      desc: 'Pantau peningkatan pemahaman materi secara visual dan raih lencana pencapaian.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto"
        >
          {/* Accent Header Banner */}
          <div className="relative p-6 sm:p-8 bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0369A1] text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md mb-3 text-[#E0F2FE] border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="uppercase tracking-widest text-[10px]">Portal Pembelajaran</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-light font-heading leading-tight">
              Website Pembelajaran Utama <br className="hidden sm:inline" />
              <span className="font-semibold text-[#38BDF8]">Kelas Pak Hafiz</span>
            </h2>
            <p className="text-[#94A3B8] text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
              Kamu akan diarahkan langsung ke <span className="text-[#38BDF8] font-semibold">https://www.kelaspakhafiz.my.id/</span> untuk mengakses ruang kelas virtual, presensi daring, kuis, dan materi lengkap.
            </p>
          </div>

          {/* Features Grid */}
          <div className="p-6 sm:p-8 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Fasilitas yang kamu dapatkan di Kelas Utama:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[18px] bg-[#F4F8FC] border border-[#E2E8F0] flex items-start gap-3 hover:border-[#0284C7]/50 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug">
                      {feat.title}
                    </h5>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] flex items-center gap-2.5 text-xs text-[#0369A1]">
              <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
              <span className="font-medium">
                Gratis untuk siswa SMA & terbuka untuk seluruh pelajar IPA di Indonesia.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 sm:p-6 bg-[#F4F8FC] border-t border-[#E2E8F0] flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#0F172A] rounded-xl transition-colors cursor-pointer"
            >
              Tetap di Landing Page
            </button>
            <button
              onClick={() => {
                onConfirmRedirect();
                onClose();
              }}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl shadow-md shadow-[#0284C7]/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Buka kelaspakhafiz.my.id</span>
              <ExternalLink className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
