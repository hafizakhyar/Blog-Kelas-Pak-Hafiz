import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  Sparkles,
  Building,
  Calendar,
  X,
  Check,
  Camera,
  Share2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { PortfolioCertificateItem } from '../types';
import { INITIAL_PORTFOLIO_CERTIFICATES } from '../data/mockData';
import { PhotoChangerModal } from './Modals/PhotoChangerModal';
import { STORAGE_FOLDERS } from '../lib/firebase';
import {
  subscribeToPortfolioCertificates,
  savePortfolioCertificateToFirestore,
  deletePortfolioCertificateFromFirestore
} from '../lib/firebase';

const LOCAL_STORAGE_CERT_KEY = 'kelaspakhafiz_certificates_v2';

interface PortfolioSectionProps {
  isAdmin: boolean;
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  isAdmin,
  onAddToast
}) => {
  // State: Certificates
  const [certificates, setCertificates] = useState<PortfolioCertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CERT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load certificates from localStorage:', e);
    }
    return INITIAL_PORTFOLIO_CERTIFICATES;
  });

  // State: Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State: Large Modal Pop-up (Lightbox)
  const [activeModalCert, setActiveModalCert] = useState<PortfolioCertificateItem | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // State: Admin Editing / Adding Certificate
  const [editingCert, setEditingCert] = useState<PortfolioCertificateItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [certForPhotoChange, setCertForPhotoChange] = useState<PortfolioCertificateItem | null>(null);

  // Form State for Add/Edit Modal
  const [certForm, setCertForm] = useState({
    title: '',
    category: 'Sertifikat',
    issuer: '',
    year: new Date().getFullYear().toString(),
    imageUrl: '',
    credentialUrl: '',
    description: ''
  });

  // Categories list
  const categories = ['Semua', 'Sertifikat', 'Karya Riset', 'Pelatihan', 'Penghargaan'];

  // Subscribe to Firestore Realtime
  useEffect(() => {
    const unsubCerts = subscribeToPortfolioCertificates(
      (items) => {
        if (items && items.length > 0) {
          setCertificates(items);
          try {
            localStorage.setItem(LOCAL_STORAGE_CERT_KEY, JSON.stringify(items));
          } catch (e) {
            console.warn('Failed to save certificates locally:', e);
          }
        }
      },
      (err) => {
        console.warn('Firestore portfolio subscription error:', err);
      }
    );

    return () => {
      unsubCerts();
    };
  }, []);

  // Save to LocalStorage whenever certificates change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CERT_KEY, JSON.stringify(certificates));
    } catch (e) {
      console.warn('Failed to save certificates to localStorage:', e);
    }
  }, [certificates]);

  // Filtered Certificates
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      const matchCat =
        selectedCategory === 'Semua' ||
        cert.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.description && cert.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        cert.year.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [certificates, selectedCategory, searchQuery]);

  // --- Modal Navigation: Previous & Next within Pop-up ---
  const currentModalIndex = useMemo(() => {
    if (!activeModalCert) return -1;
    return filteredCertificates.findIndex((c) => c.id === activeModalCert.id);
  }, [activeModalCert, filteredCertificates]);

  const handlePrevCert = () => {
    if (currentModalIndex > 0) {
      setActiveModalCert(filteredCertificates[currentModalIndex - 1]);
      setIsZoomed(false);
    } else if (filteredCertificates.length > 0) {
      setActiveModalCert(filteredCertificates[filteredCertificates.length - 1]);
      setIsZoomed(false);
    }
  };

  const handleNextCert = () => {
    if (currentModalIndex < filteredCertificates.length - 1) {
      setActiveModalCert(filteredCertificates[currentModalIndex + 1]);
      setIsZoomed(false);
    } else if (filteredCertificates.length > 0) {
      setActiveModalCert(filteredCertificates[0]);
      setIsZoomed(false);
    }
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!activeModalCert) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalCert(null);
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevCert();
      } else if (e.key === 'ArrowRight') {
        handleNextCert();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalCert, currentModalIndex, filteredCertificates]);

  // --- Admin Handlers: Add & Edit Certificate ---
  const handleOpenAddCert = () => {
    setCertForm({
      title: '',
      category: 'Sertifikat',
      issuer: 'UIN Syarif Hidayatullah Jakarta',
      year: new Date().getFullYear().toString(),
      imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
      credentialUrl: '',
      description: ''
    });
    setEditingCert(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditCert = (item: PortfolioCertificateItem) => {
    setEditingCert(item);
    setCertForm({
      title: item.title,
      category: item.category || 'Sertifikat',
      issuer: item.issuer || '',
      year: item.year || new Date().getFullYear().toString(),
      imageUrl: item.imageUrl || '',
      credentialUrl: item.credentialUrl || '',
      description: item.description || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title.trim()) {
      onAddToast('Judul Wajib Diisi', 'Mohon lengkapi judul sertifikat atau karya.', 'info');
      return;
    }

    if (editingCert) {
      const updated: PortfolioCertificateItem = {
        ...editingCert,
        title: certForm.title.trim(),
        category: certForm.category as any,
        issuer: certForm.issuer.trim() || 'Lembaga Terkait',
        year: certForm.year.trim() || '2025',
        imageUrl: certForm.imageUrl.trim() || editingCert.imageUrl,
        credentialUrl: certForm.credentialUrl.trim() || undefined,
        description: certForm.description.trim() || undefined
      };

      setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      try {
        await savePortfolioCertificateToFirestore(updated);
        onAddToast('Sertifikat Diperbarui', `"${updated.title}" berhasil diperbarui.`, 'success');
      } catch (err) {
        console.warn('Firestore update error:', err);
      }
    } else {
      const newItem: PortfolioCertificateItem = {
        id: `cert-${Date.now()}`,
        title: certForm.title.trim(),
        category: certForm.category as any,
        issuer: certForm.issuer.trim() || 'Lembaga Terkait',
        year: certForm.year.trim() || '2025',
        imageUrl: certForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
        credentialUrl: certForm.credentialUrl.trim() || undefined,
        description: certForm.description.trim() || undefined
      };

      setCertificates((prev) => [newItem, ...prev]);
      try {
        await savePortfolioCertificateToFirestore(newItem);
        onAddToast('Sertifikat Ditambahkan', `"${newItem.title}" berhasil ditambahkan ke portofolio.`, 'success');
      } catch (err) {
        console.warn('Firestore add error:', err);
      }
    }

    setIsAddModalOpen(false);
    setEditingCert(null);
  };

  const handleDeleteCert = async (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus sertifikat "${title}"?`)) {
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      if (activeModalCert && activeModalCert.id === id) {
        setActiveModalCert(null);
      }
      try {
        await deletePortfolioCertificateFromFirestore(id);
        onAddToast('Sertifikat Dihapus', `"${title}" berhasil dihapus.`, 'info');
      } catch (err) {
        console.warn('Firestore delete error:', err);
      }
    }
  };

  const handleDuplicateCert = async (item: PortfolioCertificateItem) => {
    const duplicated: PortfolioCertificateItem = {
      ...item,
      id: `cert-${Date.now()}`,
      title: `${item.title} (Salinan)`
    };
    setCertificates((prev) => [duplicated, ...prev]);
    try {
      await savePortfolioCertificateToFirestore(duplicated);
      onAddToast('Sertifikat Diduplikasi', `Salinan "${item.title}" berhasil dibuat.`, 'success');
    } catch (err) {
      console.warn('Firestore duplicate error:', err);
    }
  };

  const handleSavePhotoChanger = async (newUrl: string) => {
    if (!certForPhotoChange) return;
    const updated: PortfolioCertificateItem = {
      ...certForPhotoChange,
      imageUrl: newUrl
    };
    setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (activeModalCert && activeModalCert.id === updated.id) {
      setActiveModalCert(updated);
    }
    try {
      await savePortfolioCertificateToFirestore(updated);
      onAddToast('Foto Sertifikat Diperbarui', 'Gambar sertifikat berhasil diganti.', 'success');
    } catch (e) {
      console.warn('Failed to update cert photo in Firestore:', e);
    }
    setCertForPhotoChange(null);
  };

  const handleShareCert = (cert: PortfolioCertificateItem) => {
    const text = `Sertifikat & Portofolio Guru Kimia: ${cert.title} (${cert.issuer}, ${cert.year}) - Kelas Pak Hafiz\n${window.location.origin}#portofolio`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      onAddToast('Rincian Sertifikat Disalin', 'Teks portofolio berhasil disalin ke clipboard.', 'info');
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <section id="portofolio" className="py-16 sm:py-20 bg-[#F4F8FC] relative border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#007AFF]" />
              <span className="uppercase tracking-widest text-[10px] text-[#007AFF] font-bold">Portofolio & Rekam Jejak</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Portofolio & <span className="font-semibold text-[#007AFF]">Sertifikat Guru</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
              Dokumentasi sertifikasi kompetensi laboratorium, inovasi modul riset pembelajaran sains kimia, dan piagam penghargaan pendidik.
            </p>
          </div>

          {/* Admin Action Button */}
          {isAdmin && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleOpenAddCert}
                className="px-4 py-2 rounded-full bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007AFF]/25 transition-transform transform hover:scale-105 cursor-pointer"
                title="Tambah Sertifikat Baru"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Sertifikat Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#007AFF]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sertifikat / karya..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GALERI SERTIFIKAT VERTIKAL (VERTICAL SCROLLABLE GALLERY)                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-4 sm:p-6 lg:p-7 relative">
          
          {/* Gallery Top Status Bar */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E2E8F0] mb-5 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-[#0F172A]">
                Menampilkan {filteredCertificates.length} Sertifikat & Dokumen Portofolio
              </span>
            </div>
            <span className="text-[11px] text-[#007AFF] bg-[#F0F7FF] px-2.5 py-0.5 rounded-full border border-[#BAE6FD] font-medium hidden sm:inline-block">
              Klik kartu untuk memperbesar
            </span>
          </div>

          {filteredCertificates.length === 0 ? (
            <div className="py-16 text-center">
              <Award className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
              <p className="text-sm font-semibold text-[#0F172A]">Sertifikat Tidak Ditemukan</p>
              <p className="text-xs text-[#64748B] mt-1">Coba kata kunci lain atau pilih kategori Semua.</p>
            </div>
          ) : (
            /* Vertical Scrollable Container with Smooth Inner Scrolling and Rich Grid Layout */
            <div className="max-h-[820px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-[#0B132B] rounded-2xl border border-[#E2E8F0] hover:border-[#38BDF8] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer relative"
                    onClick={() => {
                      setActiveModalCert(cert);
                      setIsZoomed(false);
                    }}
                  >
                    {/* Certificate High-Res Image Container */}
                    <div className="relative w-full h-[220px] sm:h-[230px] bg-[#070D18] overflow-hidden flex items-center justify-center">
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Dark gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#007AFF] text-white shadow-xs">
                            {cert.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 backdrop-blur-xs text-white border border-white/30">
                            {cert.year}
                          </span>
                        </div>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCertForPhotoChange(cert);
                            }}
                            className="px-2.5 py-1 rounded-full bg-white/95 hover:bg-[#007AFF] text-[#007AFF] hover:text-white text-[10px] font-bold shadow-md flex items-center gap-1 cursor-pointer transition-all"
                            title="Ganti Foto via Google / File"
                          >
                            <Camera className="w-3 h-3" />
                            <span>Ganti Foto</span>
                          </button>
                        )}
                      </div>

                      {/* Floating Click to Zoom Pill in the Center (Hover State) */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                        <span className="px-3 py-1.5 rounded-full bg-white/90 text-[#0F172A] text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-xs transform scale-90 group-hover:scale-100 transition-transform">
                          <ZoomIn className="w-3.5 h-3.5 text-[#007AFF]" />
                          <span>Klik untuk Memperbesar</span>
                        </span>
                      </div>

                      {/* Bottom Image Overlay Details */}
                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <h4 className="text-sm sm:text-base font-bold text-white leading-snug drop-shadow-md line-clamp-2 group-hover:text-sky-300 transition-colors">
                          {cert.title}
                        </h4>
                        <p className="text-[11px] text-sky-200 font-semibold mt-1 flex items-center gap-1 truncate drop-shadow-xs">
                          <Building className="w-3 h-3 shrink-0 text-[#38BDF8]" />
                          <span className="truncate">{cert.issuer}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Bottom Description Panel */}
                    <div className="p-4 bg-white flex-1 flex flex-col justify-between border-t border-[#E2E8F0]">
                      <p className="text-xs text-[#475569] leading-relaxed line-clamp-2">
                        {cert.description || `Sertifikasi resmi dari ${cert.issuer} (${cert.year}) untuk kompetensi dan inovasi sains.`}
                      </p>

                      {/* Admin Controls or Student View Prompt */}
                      {isAdmin ? (
                        <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => handleShareCert(cert)}
                            className="text-[#64748B] hover:text-[#007AFF] flex items-center gap-1 text-[11px] font-medium cursor-pointer transition-colors"
                            title="Salin Rincian Sertifikat"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDuplicateCert(cert)}
                              className="px-2 py-0.5 rounded-md bg-white hover:bg-[#E0F2FE] text-[#007AFF] border border-[#BAE6FD] text-[10px] font-bold cursor-pointer transition-colors"
                              title="Duplikasi Sertifikat"
                            >
                              Duplikasi
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditCert(cert)}
                              className="p-1 rounded-md bg-white hover:bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer transition-colors"
                              title="Edit Rincian"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCert(cert.id, cert.title)}
                              className="p-1 rounded-md bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
                              title="Hapus Sertifikat"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                          <span className="text-[11px] font-medium flex items-center gap-1 text-[#0284C7]">
                            <Sparkles className="w-3 h-3" />
                            <span>Dokumen Terverifikasi</span>
                          </span>
                          <span className="text-[#007AFF] font-bold text-[11px] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Buka Pratinjau</span>
                            <ZoomIn className="w-3 h-3" />
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Footer Tip */}
          <div className="mt-5 pt-3.5 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-2">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#007AFF]" />
              <span>Seluruh sertifikat dan karya riset merupakan arsip resmi dokumentasi pengajar.</span>
            </span>
            <span className="text-[#007AFF] font-bold font-mono">
              Total {certificates.length} Arsip
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* POP UP BESAR SERTIFIKAT (LARGE MODAL / LIGHTBOX)                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeModalCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
            
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setActiveModalCert(null);
                setIsZoomed(false);
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden z-10"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Top Bar */}
              <div className="px-5 py-3.5 bg-[#0F172A] text-white flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0 pr-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#007AFF] text-white shrink-0">
                    {activeModalCert.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold font-heading text-white truncate">
                    {activeModalCert.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Zoom Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title={isZoomed ? 'Perkecil' : 'Perbesar Tampilan'}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {/* Close Modal Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalCert(null);
                      setIsZoomed(false);
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                    title="Tutup Pratinjau (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Image & Information */}
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row bg-[#0B1120]">
                
                {/* Large High-Res Image Area */}
                <div className="relative flex-1 min-h-[320px] sm:min-h-[440px] lg:min-h-[520px] flex items-center justify-center p-3 sm:p-6 bg-[#050912] overflow-hidden group/img">
                  <img
                    src={activeModalCert.imageUrl}
                    alt={activeModalCert.title}
                    className={`max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-all duration-300 ${
                      isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />

                  {/* Navigation Arrows (Prev & Next) */}
                  {filteredCertificates.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevCert}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#007AFF] text-white backdrop-blur-xs transition-all shadow-lg cursor-pointer transform hover:scale-110 active:scale-95"
                        title="Sertifikat Sebelumnya (Panah Kiri)"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextCert}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#007AFF] text-white backdrop-blur-xs transition-all shadow-lg cursor-pointer transform hover:scale-110 active:scale-95"
                        title="Sertifikat Berikutnya (Panah Kanan)"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Information Sidebar Panel (Desktop 320px width) */}
                <div className="w-full lg:w-80 bg-white p-5 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E2E8F0] shrink-0">
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF]">
                        {activeModalCert.category} • Tahun {activeModalCert.year}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold font-heading text-[#0F172A] mt-1 leading-snug">
                        {activeModalCert.title}
                      </h4>
                    </div>

                    {/* Metadata Items */}
                    <div className="space-y-2.5 pt-3 border-t border-[#E2E8F0] text-xs">
                      <div className="flex items-start gap-2 text-[#334155]">
                        <Building className="w-4 h-4 text-[#007AFF] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Penerbit / Penyelenggara:</span>
                          <span className="font-semibold">{activeModalCert.issuer}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-[#334155]">
                        <Calendar className="w-4 h-4 text-[#007AFF] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Tahun Penerbitan:</span>
                          <span className="font-semibold">{activeModalCert.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="pt-3 border-t border-[#E2E8F0]">
                      <span className="text-[10px] text-[#64748B] font-bold uppercase block mb-1">
                        Deskripsi & Lingkup Kompetensi:
                      </span>
                      <p className="text-xs text-[#475569] leading-relaxed">
                        {activeModalCert.description || `Sertifikasi dan arsip karya resmi dari ${activeModalCert.issuer} untuk penguatan kapasitas dan inovasi sains.`}
                      </p>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                    <button
                      type="button"
                      onClick={() => handleShareCert(activeModalCert)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Salin / Bagikan Sertifikat</span>
                    </button>

                    <a
                      href={activeModalCert.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#E0F2FE] text-[#007AFF] text-xs font-semibold flex items-center justify-center gap-2 border border-[#BAE6FD] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Gambar Asli di Tab Baru</span>
                    </a>

                    {isAdmin && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCertForPhotoChange(activeModalCert);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-[#F0F7FF] text-[#007AFF] border border-[#BAE6FD] text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Ganti Foto</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const current = activeModalCert;
                            setActiveModalCert(null);
                            handleOpenEditCert(current);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-amber-50 text-amber-600 border border-amber-200 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit Rincian</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL ADMIN: TAMBAH / EDIT SERTIFIKAT                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-[#E2E8F0] z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] font-heading">
                      {editingCert ? 'Edit Sertifikat / Karya' : 'Tambah Sertifikat / Karya'}
                    </h3>
                    <p className="text-xs text-[#64748B]">Mode Guru • Pak Hafiz Akhyar</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCert} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Judul Sertifikat / Karya <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={certForm.title}
                    onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                    placeholder="Contoh: Sertifikat Kompetensi Asisten Laboratorium Kimia"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Kategori</label>
                    <select
                      value={certForm.category}
                      onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF] bg-white"
                    >
                      <option value="Sertifikat">Sertifikat</option>
                      <option value="Karya Riset">Karya Riset</option>
                      <option value="Pelatihan">Pelatihan</option>
                      <option value="Penghargaan">Penghargaan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Tahun</label>
                    <input
                      type="text"
                      value={certForm.year}
                      onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                      placeholder="2025"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Penerbit / Institusi</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    placeholder="Contoh: Laboratorium Terpadu UIN Syarif Hidayatullah Jakarta"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">URL Gambar Sertifikat</label>
                  <input
                    type="url"
                    value={certForm.imageUrl}
                    onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Deskripsi Singkat</label>
                  <textarea
                    rows={2}
                    value={certForm.description}
                    onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                    placeholder="Tuliskan deskripsi singkat kompetensi atau capaian..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Simpan Sertifikat
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Changer Modal */}
      {certForPhotoChange && (
        <PhotoChangerModal
          isOpen={!!certForPhotoChange}
          onClose={() => setCertForPhotoChange(null)}
          currentImageUrl={certForPhotoChange.imageUrl}
          itemTitle={certForPhotoChange.title}
          modalTitle={`Ganti Foto: ${certForPhotoChange.title}`}
          storageFolder={STORAGE_FOLDERS.GALLERY_IMAGES}
          onSavePhoto={handleSavePhotoChanger}
          onAddToast={onAddToast}
        />
      )}
    </section>
  );
};
