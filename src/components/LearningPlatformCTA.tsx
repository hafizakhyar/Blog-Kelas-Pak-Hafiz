import React from 'react';
import { ArrowRight, ExternalLink, CheckCircle2, GraduationCap } from 'lucide-react';

interface LearningPlatformCTAProps {
  onOpenMainPortal: () => void;
}

export const LearningPlatformCTA: React.FC<LearningPlatformCTAProps> = ({ onOpenMainPortal }) => {
  const perks = [
    'Materi Pembelajaran yang Simpel dan Menarik',
    'Gamifikasi dan Leaderboard Siswa',
    'Ruang Interaktif dan Latihan Soal',
    'Akses materi dan download file pdf'
  ];

  return (
    <section className="py-8 sm:py-10 bg-[#F4F8FC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Streamlined Main Banner Card */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#0369A1] text-white p-6 sm:p-8 lg:p-9 shadow-lg shadow-[#0284C7]/10 border border-[#334155] overflow-hidden">
          
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0284C7]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#38BDF8]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
            
            {/* Left/Main Content */}
            <div className="flex-1 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E0F2FE] text-xs font-semibold backdrop-blur-md mb-3 border border-white/15">
                <GraduationCap className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="uppercase tracking-widest text-[10px]">Pintu Masuk Ruang Belajar Terpadu</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-heading leading-tight tracking-tight mb-4">
                Siap Menjelajah Lebih Jauh di <br className="hidden sm:inline" />
                <span className="font-medium text-[#38BDF8]">Portal Pembelajaran ?</span>
              </h2>

              {/* 4 Custom Perks List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {perks.map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#F1F5F9]">
                    <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto lg:w-64 shrink-0">
              <button
                onClick={onOpenMainPortal}
                className="w-full px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-[#0284C7]/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Buka Portal Pembelajaran</span>
                <ExternalLink className="w-4 h-4 text-[#38BDF8]" />
              </button>

              <a
                href="https://www.kelaspakhafiz.my.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-2.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-white/10 border border-white/15 transition-colors flex items-center justify-center gap-1.5 text-center"
              >
                <span>kelaspakhafiz.my.id</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

