import React from 'react';
import { FlaskConical, ExternalLink, ArrowUp, Heart, BookOpen, Download, Mail, Youtube, Instagram, Send } from 'lucide-react';

interface FooterProps {
  onOpenMainPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMainPortal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B132B] text-[#F1F5F9] pt-16 pb-12 border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1E293B]">
          
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white border border-white/20 flex items-center justify-center overflow-hidden shrink-0 p-0.5 shadow-md shadow-[#0284C7]/20">
                <img
                  src="https://lh3.googleusercontent.com/d/1Oqck2N6fpJ_lbowm_21Kz4KGGt1Szuge"
                  alt="Logo Kelas Pak Hafiz"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.classList.add('bg-[#0284C7]');
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Kelas Pak Hafiz
                </h3>
                <p className="text-xs text-[#38BDF8]">Pak Hafiz Akhyar, S.Si. • Kimia & IPA SMA</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Hub dokumentasi, galeri eksperimen sains, modul ajar mandiri, dan artikel pembelajaran kimia SMA yang diasuh oleh Pak Hafiz Akhyar, S.Si.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/kelaspakhafiz/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1E293B] hover:bg-[#E1306C] text-[#F1F5F9] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Instagram Kelas Pak Hafiz"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@KelasPakHafiz"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1E293B] hover:bg-[#FF0000] text-[#F1F5F9] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="YouTube Channel Kelas Pak Hafiz"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="mailto:kelaspakhafiz@gmail.com"
                className="w-9 h-9 rounded-full bg-[#1E293B] hover:bg-[#0284C7] text-[#F1F5F9] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Email Resmi"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#38BDF8]">
              Eksplorasi Hub
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#94A3B8]">
              <li>
                <a href="#beranda" className="hover:text-white transition-colors">
                  Beranda & Filosofi
                </a>
              </li>
              <li>
                <a href="#galeri" className="hover:text-white transition-colors">
                  Galeri Praktikum & Eksperimen
                </a>
              </li>
              <li>
                <a href="#catatan-kelas" className="hover:text-white transition-colors">
                  Papan Catatan & Rumus Kelas
                </a>
              </li>
              <li>
                <a href="#modul" className="hover:text-white transition-colors">
                  Perangkat Ajar & Modul Belajar
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">
                  Artikel Sains
                </a>
              </li>
              <li>
                <a href="#profil" className="hover:text-white transition-colors">
                  Profil & Portofolio Guru
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-white transition-colors">
                  Tanya Jawab & Hubungi
                </a>
              </li>
            </ul>
          </div>

          {/* Portal Gateway (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-[24px] bg-[#1E293B]/80 border border-[#334155] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
                Portal Pembelajaran
              </span>
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
            </div>
            
            <h4 className="text-base font-bold text-white font-heading">
              Website Pembelajaran Utama Kelas Pak Hafiz
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Akses ruang kelas interaktif, presensi daring, bank latihan soal UTBK, dan video pembelajaran kurikulum lengkap di <span className="text-[#38BDF8] font-mono">kelaspakhafiz.my.id</span>.
            </p>

            <button
              onClick={onOpenMainPortal}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0284C7]/30 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Masuk ke Portal Pembelajaran</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom copyright & quote */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="text-center sm:text-left">
            <p className="italic text-[#94A3B8] mb-1">
              "Kimia bukan tentang menghafal rumus, melainkan memahami cara semesta bekerja."
            </p>
            <p>© {new Date().getFullYear()} Kelas Pak Hafiz (www.kelaspakhafiz.my.id). Hak cipta dilindungi undang-undang.</p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-white hover:bg-[#334155] transition-colors border border-[#334155] cursor-pointer"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#38BDF8]" />
          </button>
        </div>

      </div>
    </footer>
  );
};
