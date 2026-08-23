import React, { useState, useEffect } from 'react';
import { Menu, X, ExternalLink, Sparkles, BookOpen, FlaskConical, Download, Newspaper, MessageSquare, ChevronRight, Instagram, Youtube } from 'lucide-react';

interface NavbarProps {
  onOpenMainPortal: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMainPortal, activeSection }) => {
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
    { label: 'Galeri Praktikum', href: '#galeri', id: 'galeri' },
    { label: 'Catatan Kelas', href: '#catatan-kelas', id: 'catatan-kelas' },
    { label: 'Perangkat Ajar', href: '#modul', id: 'modul' },
    { label: 'Artikel Sains', href: '#blog', id: 'blog' },
    { label: 'Profil', href: '#profil', id: 'profil' },
    { label: 'Hubungi', href: '#kontak', id: 'kontak' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F4F8FC]/92 backdrop-blur-md shadow-xs border-b border-[#E2E8F0] py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#beranda"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Kelas Pak Hafiz Beranda"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#0284C7] transition-all p-0.5">
              <img
                src="https://lh3.googleusercontent.com/d/1Oqck2N6fpJ_lbowm_21Kz4KGGt1Szuge"
                alt="Logo Kelas Pak Hafiz"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback to letter icon if drive image preview fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.classList.add('bg-[#0284C7]', 'text-white', 'font-bold', 'text-sm');
                    target.parentElement.innerText = 'H';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold font-heading text-[#0F172A] tracking-tight uppercase group-hover:text-[#0284C7] transition-colors">
                Kelas Pak Hafiz
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase -mt-0.5">
                Kimia & IPA SMA
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/90 p-1.5 rounded-full border border-[#E2E8F0] shadow-xs backdrop-blur-xs">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
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

          {/* Social Links & CTA Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              href="https://www.instagram.com/kelaspakhafiz/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-[#64748B] hover:text-[#E1306C] hover:bg-[#E0F2FE] transition-colors"
              title="Instagram @kelaspakhafiz"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@KelasPakHafiz"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-[#64748B] hover:text-[#FF0000] hover:bg-[#E0F2FE] transition-colors"
              title="YouTube @KelasPakHafiz"
            >
              <Youtube className="w-4 h-4" />
            </a>

            <a
              href="https://www.kelaspakhafiz.my.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <span>Portal Pembelajaran</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="https://www.kelaspakhafiz.my.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden px-3.5 py-1.5 text-xs font-bold text-white bg-[#0284C7] rounded-full flex items-center gap-1"
            >
              <span>Portal LMS</span>
              <ExternalLink className="w-3 h-3" />
            </a>
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
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#F4F8FC]/98 backdrop-blur-md border-b border-[#E2E8F0] shadow-xl px-6 py-6 transition-all">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#334155] hover:bg-white hover:text-[#0284C7] transition-colors border border-transparent hover:border-[#E2E8F0]"
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
