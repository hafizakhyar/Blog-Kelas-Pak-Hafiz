import React, { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, Sparkles, BookOpen, FlaskConical, Download, Newspaper, MessageSquare, ChevronRight, Instagram, Youtube, ShieldCheck, KeyRound, LogOut, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  onOpenMainPortal: () => void;
  activeSection: string;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMainPortal,
  activeSection,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '#beranda', id: 'beranda' },
    { label: 'Catatan Kelas', href: '#catatan-kelas', id: 'catatan-kelas' },
    { label: 'Galeri Praktikum', href: '#galeri', id: 'galeri' },
    { label: 'Perangkat Ajar', href: '#modul', id: 'modul' },
    { label: 'Artikel Sains', href: '#blog', id: 'blog' },
    { label: 'Portofolio', href: '#portofolio', id: 'portofolio' },
    { label: 'Profil', href: '#profil', id: 'profil' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F4F8FC]/95 backdrop-blur-md shadow-xs border-b border-[#E2E8F0] py-2.5'
          : 'bg-[#F4F8FC]/60 backdrop-blur-xs py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#beranda"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0"
            aria-label="Kelas Pak Hafiz Beranda"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#0284C7] transition-all p-0.5">
              <img
                src="/logo.svg"
                alt="Logo Kelas Pak Hafiz"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.src = '/icon-192.png';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold font-heading text-[#0F172A] tracking-tight uppercase group-hover:text-[#0284C7] transition-colors whitespace-nowrap">
                Kelas Pak Hafiz
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase -mt-0.5 whitespace-nowrap">
                Kimia & IPA SMA
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-white/95 p-1 rounded-full border border-[#E2E8F0] shadow-xs backdrop-blur-xs">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`px-3 xl:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#E0F2FE]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Area: Portal LMS & Mode Control underneath */}
          <div className="hidden md:flex flex-col items-end justify-center shrink-0">
            {/* Top row: Dark Mode Switch + Socials + Portal LMS */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Switch Button */}
              <button
                type="button"
                onClick={onToggleDarkMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 cursor-pointer shadow-2xs group ${
                  isDarkMode
                    ? 'bg-[#1E293B] hover:bg-[#334155] border-[#334155] text-amber-300'
                    : 'bg-white hover:bg-[#E0F2FE] border-[#E2E8F0] text-[#64748B] hover:text-[#0284C7]'
                }`}
                title={isDarkMode ? 'Klik untuk beralih ke Mode Terang (Siang)' : 'Klik untuk beralih ke Mode Gelap (Malam - Nyaman di Mata)'}
                aria-label="Toggle Dark Mode"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  {isDarkMode ? (
                    <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30 transition-transform duration-300 rotate-0" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-500 transition-transform duration-300 hover:rotate-45" />
                  )}
                </div>
                <span className="text-[11px] font-semibold tracking-tight">
                  {isDarkMode ? 'Mode Gelap' : 'Mode Terang'}
                </span>
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isDarkMode ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-slate-300'
                  }`}
                />
              </button>

              {/* Social Links */}
              <div className="flex items-center gap-1">
                <a
                  href="https://www.instagram.com/kelaspakhafiz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-[#64748B] hover:text-[#E1306C] hover:bg-[#E0F2FE] transition-colors"
                  title="Instagram @kelaspakhafiz"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://www.youtube.com/@KelasPakHafiz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-[#64748B] hover:text-[#FF0000] hover:bg-[#E0F2FE] transition-colors"
                  title="YouTube @KelasPakHafiz"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Portal LMS Button */}
              <a
                href="https://www.kelaspakhafiz.my.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-2xs hover:shadow-xs transition-all transform hover:-translate-y-0.2 shrink-0"
              >
                <span>Portal LMS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Bottom Row: Mode Guru / Mode Siswa Button (positioned directly below Portal LMS) */}
            <div className="mt-1 flex items-center justify-end">
              {isAdmin ? (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50/95 border border-emerald-300 text-emerald-800 text-[11px] font-bold shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="whitespace-nowrap">Mode Guru (Edit Aktif)</span>
                  <button
                    type="button"
                    onClick={onLogoutAdmin}
                    className="ml-1 px-1.5 py-0.2 rounded-full bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-all cursor-pointer shadow-2xs hover:scale-105"
                    title="Kembali ke Mode Umum (Tampilan Siswa)"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAdminModal}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 hover:bg-[#E0F2FE] border border-[#E2E8F0] hover:border-[#BAE6FD] text-[#64748B] hover:text-[#0284C7] text-[10.5px] font-semibold transition-all shadow-2xs cursor-pointer group"
                  title="Masuk sebagai Pengajar Pak Hafiz untuk mengaktifkan akses edit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span className="whitespace-nowrap">Mode Siswa</span>
                  <span className="text-[9.5px] bg-[#F1F5F9] group-hover:bg-[#0284C7] text-[#64748B] group-hover:text-white px-1.5 py-0.2 rounded-full font-bold transition-colors">
                    Masuk Guru
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Right Controls: Dark Mode Switch + Mode Badge + Hamburger */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Quick Mobile Theme Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1E293B] border-[#334155] text-amber-300'
                  : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-amber-500'
              }`}
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300/30" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Guru</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminModal}
                className="px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[11px] font-bold text-[#64748B] hover:text-[#0284C7] cursor-pointer"
                title="Masuk Mode Guru"
              >
                Mode Siswa
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-[#0F172A] hover:bg-[#E2E8F0]/60 transition-colors"
              aria-label="Buka menu navigasi"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#F4F8FC]/98 backdrop-blur-md border-b border-[#E2E8F0] shadow-xl px-5 py-5 transition-all max-h-[85vh] overflow-y-auto">
          {/* Dark Mode Switch in Mobile Drawer */}
          <div className="mb-3 p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-amber-400/20 text-amber-300' : 'bg-amber-100 text-amber-600'}`}>
                {isDarkMode ? <Moon className="w-4 h-4 fill-amber-300/30" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-[#0F172A]">
                  {isDarkMode ? 'Mode Gelap (Malam) Aktif' : 'Mode Terang (Siang)'}
                </div>
                <div className="text-[10px] text-[#64748B]">
                  {isDarkMode ? 'Kenyamanan membaca materi di malam hari' : 'Ketuk switch untuk kenyamanan malam hari'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleDarkMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isDarkMode ? 'bg-[#0284C7]' : 'bg-slate-300'
              }`}
              role="switch"
              aria-checked={isDarkMode}
              title="Toggle Dark Mode"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {isDarkMode ? (
                  <Moon className="w-3 h-3 text-[#0284C7]" />
                ) : (
                  <Sun className="w-3 h-3 text-amber-500" />
                )}
              </span>
            </button>
          </div>

          {/* Mode Indicator in Mobile Drawer */}
          <div className="mb-4 p-3 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-[#0F172A]">
                  {isAdmin ? 'Mode Guru Aktif' : 'Mode Umum (Siswa)'}
                </div>
                <div className="text-[10px] text-[#64748B]">
                  {isAdmin ? 'Akses edit & kelola data aktif' : 'Tampilan baca saja untuk siswa'}
                </div>
              </div>
            </div>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  onLogoutAdmin();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-100"
              >
                Keluar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenAdminModal();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-1 rounded-full bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369A1]"
              >
                Masuk Guru
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold text-[#334155] hover:bg-white hover:text-[#0284C7] transition-colors border border-transparent hover:border-[#E2E8F0]"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#0284C7]" />
              </a>
            ))}

            {/* Social Media in Mobile Menu */}
            <div className="flex items-center justify-center gap-4 py-3 border-t border-[#E2E8F0] mt-2">
              <a
                href="https://www.instagram.com/kelaspakhafiz/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#E1306C]"
              >
                <Instagram className="w-4 h-4 text-[#E1306C]" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.youtube.com/@KelasPakHafiz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-[#475569] hover:text-[#FF0000]"
              >
                <Youtube className="w-4 h-4 text-[#FF0000]" />
                <span>YouTube</span>
              </a>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <a
                href="https://www.kelaspakhafiz.my.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Masuk ke Portal Resmi LMS</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

