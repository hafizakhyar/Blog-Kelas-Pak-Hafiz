import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ExternalLink, Play, CheckCircle2, ShieldCheck, Trophy, Layers, GraduationCap } from 'lucide-react';

interface LearningPlatformCTAProps {
  onOpenMainPortal: () => void;
}

export const LearningPlatformCTA: React.FC<LearningPlatformCTAProps> = ({ onOpenMainPortal }) => {
  const perks = [
    'Video Pembelajaran Kimia Konseptual HD',
    'Simulasi Interaktif & Bank Soal SNBT / UTBK',
    'Ruang Konsultasi PR & Praktikum Sains',
    'Akses Terintegrasi dari Laptop & Smartphone'
  ];

  return (
    <section className="py-20 bg-[#F4F8FC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="relative rounded-[28px] sm:rounded-[32px] bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0369A1] text-white p-8 sm:p-12 lg:p-16 shadow-[0_4px_24px_rgba(2,132,199,0.18)] border border-[#334155] overflow-hidden">
          
          {/* Subtle decorative geometric glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0284C7]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#38BDF8]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#E0F2FE] text-xs font-semibold backdrop-blur-md mb-4 border border-white/15">
                <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
                <span className="uppercase tracking-widest text-[10px]">Pintu Masuk Ruang Belajar Terpadu</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light font-heading leading-tight tracking-tight mb-4">
                Siap Menjelajah Lebih Jauh di <br />
                <span className="italic font-medium text-[#38BDF8]">Website Pembelajaran Utama?</span>
              </h2>

              <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                Landing page ini adalah etalase dokumentasi dan inspirasi. Untuk mengikuti kelas terstruktur, mengerjakan kuis berkala, dan evaluasi hasil belajar, segera masuk ke portal pembelajaran utama kami.
              </p>

              {/* Perks List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {perks.map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#F1F5F9]">
                    <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenMainPortal}
                  className="px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-[#0284C7]/30 transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Masuk ke Kelas Utama</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#modul"
                  className="px-7 py-3.5 rounded-xl text-sm font-medium text-white hover:bg-white/10 border border-white/25 transition-colors flex items-center gap-2"
                >
                  <span>Lihat Modul Gratis</span>
                </a>
              </div>
            </div>

            {/* Right Visual Badge Display (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="p-6 rounded-[24px] bg-white/10 backdrop-blur-md border border-white/15 shadow-xl space-y-4">
                
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border border-white/30 flex items-center justify-center overflow-hidden shadow-md shadow-[#0284C7]/40 p-0.5">
                      <img
                        src="https://lh3.googleusercontent.com/d/1Oqck2N6fpJ_lbowm_21Kz4KGGt1Szuge"
                        alt="Logo Kelas Pak Hafiz"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight font-heading">Portal Belajar Terpadu</h4>
                      <p className="text-[11px] text-[#94A3B8]">kelaspakhafiz.my.id</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0284C7]/30 text-[#38BDF8] border border-[#38BDF8]/40">
                    ONLINE
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-[#F1F5F9]">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span>Kurikulum Kimia SMA Nasional</span>
                    <span className="font-semibold text-white">Lengkap X, XI, XII</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <span>Akses Modul & Tugas</span>
                    <span className="font-semibold text-white">24/7 Fleksibel</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi"
                        alt="Pak Hafiz Akhyar, S.Si."
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover border border-white/30"
                      />
                      <span>Instruktur Utama</span>
                    </div>
                    <span className="font-semibold text-[#38BDF8]">Pak Hafiz Akhyar, S.Si.</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={onOpenMainPortal}
                    className="w-full py-3 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Buka Portal Pembelajaran</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#38BDF8]" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
