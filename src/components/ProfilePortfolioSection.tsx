import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Camera,
  CheckCircle2,
  FileCheck,
  Eye,
  X,
  Share2,
  FlaskConical,
  Building,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import { ProfileExperienceItem, PortfolioCertificateItem } from '../types';
import { INITIAL_PROFILE_EXPERIENCES, INITIAL_PORTFOLIO_CERTIFICATES, TEACHER_INFO } from '../data/mockData';
import { PhotoChangerModal } from './Modals/PhotoChangerModal';
import {
  subscribeToProfileExperiences,
  saveProfileExperienceToFirestore,
  deleteProfileExperienceFromFirestore,
  subscribeToPortfolioCertificates,
  savePortfolioCertificateToFirestore,
  deletePortfolioCertificateFromFirestore,
  STORAGE_FOLDERS,
  COLLECTIONS
} from '../lib/firebase';

const STORAGE_KEY_EXPERIENCES = 'kelaspakhafiz_profile_experiences';
const STORAGE_KEY_CERTIFICATES = 'kelaspakhafiz_portfolio_certificates';

interface ProfilePortfolioSectionProps {
  isAdmin?: boolean;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const ProfilePortfolioSection: React.FC<ProfilePortfolioSectionProps> = ({
  isAdmin = false,
  onAddToast = (_t: string, _d?: string, _ty?: 'success' | 'info') => {}
}) => {
  // Experience / Profile Items State
  const [experiences, setExperiences] = useState<ProfileExperienceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPERIENCES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load profile experiences from localStorage:', e);
    }
    return INITIAL_PROFILE_EXPERIENCES;
  });

  // Portfolio / Certificates State
  const [certificates, setCertificates] = useState<PortfolioCertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CERTIFICATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load portfolio certificates from localStorage:', e);
    }
    return INITIAL_PORTFOLIO_CERTIFICATES;
  });

  // Subscribe to real-time changes in Firestore
  useEffect(() => {
    const unsubExperiences = subscribeToProfileExperiences(
      (data) => {
        if (data && data.length > 0) {
          setExperiences(data);
          try {
            localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(data));
          } catch (e) {
            console.warn('Failed to cache experiences to localStorage:', e);
          }
        }
      },
      (err) => {
        console.warn('[Firebase] Profile experiences subscription warning:', err);
      }
    );

    const unsubCertificates = subscribeToPortfolioCertificates(
      (data) => {
        if (data && data.length > 0) {
          setCertificates(data);
          try {
            localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(data));
          } catch (e) {
            console.warn('Failed to cache certificates to localStorage:', e);
          }
        }
      },
      (err) => {
        console.warn('[Firebase] Portfolio certificates subscription warning:', err);
      }
    );

    return () => {
      unsubExperiences();
      unsubCertificates();
    };
  }, []);

  // Save to localStorage when state changes as fallback cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPERIENCES, JSON.stringify(experiences));
    } catch (e) {
      console.warn('Failed to save profile experiences:', e);
    }
  }, [experiences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(certificates));
    } catch (e) {
      console.warn('Failed to save portfolio certificates:', e);
    }
  }, [certificates]);

  // Horizontal Scroll Carousel Ref
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position for arrow buttons
  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [certificates]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  // Modals State: Experience Item
  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ProfileExperienceItem | null>(null);
  const [expFormData, setExpFormData] = useState({
    title: '',
    institution: '',
    period: '',
    category: 'Pengalaman',
    description: '',
    subItemsText: ''
  });

  // Modals State: Certificate / Portfolio Item
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<PortfolioCertificateItem | null>(null);
  const [certFormData, setCertFormData] = useState({
    title: '',
    category: 'Sertifikat',
    issuer: '',
    year: '2025',
    imageUrl: '',
    description: ''
  });

  // Photo Changer for a specific Certificate
  const [certForPhotoChange, setCertForPhotoChange] = useState<PortfolioCertificateItem | null>(null);

  // Lightbox Zoom Preview
  const [previewCert, setPreviewCert] = useState<PortfolioCertificateItem | null>(null);

  // -------------------------------------------------------------
  // HANDLERS: Profile / Experience Points
  // -------------------------------------------------------------
  const handleOpenAddExp = () => {
    setEditingExp(null);
    setExpFormData({
      title: '',
      institution: '',
      period: '',
      category: 'Pengalaman',
      description: '',
      subItemsText: ''
    });
    setIsExpModalOpen(true);
  };

  const handleOpenEditExp = (item: ProfileExperienceItem) => {
    setEditingExp(item);
    setExpFormData({
      title: item.title,
      institution: item.institution || '',
      period: item.period || '',
      category: item.category || 'Pengalaman',
      description: item.description || '',
      subItemsText: item.subItems ? item.subItems.join('\n') : ''
    });
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expFormData.title.trim()) return;

    const subItems = expFormData.subItemsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (editingExp) {
      // Update
      const updated: ProfileExperienceItem = {
        ...editingExp,
        title: expFormData.title.trim(),
        institution: expFormData.institution.trim() || undefined,
        period: expFormData.period.trim() || undefined,
        category: expFormData.category,
        description: expFormData.description.trim() || undefined,
        subItems: subItems.length > 0 ? subItems : undefined
      };
      setExperiences((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setIsExpModalOpen(false);

      try {
        await saveProfileExperienceToFirestore(updated);
        onAddToast(
          'Tersimpan di Firebase!',
          `Poin "${updated.title}" berhasil diperbarui langsung ke Cloud Firestore (${COLLECTIONS.PROFILES}).`,
          'success'
        );
      } catch (err) {
        console.warn('Firebase save error:', err);
        onAddToast('Poin Profil Diperbarui', `Berhasil disimpan ke memori lokal.`, 'success');
      }
    } else {
      // Create new
      const newItem: ProfileExperienceItem = {
        id: `prof-${Date.now()}`,
        title: expFormData.title.trim(),
        institution: expFormData.institution.trim() || undefined,
        period: expFormData.period.trim() || undefined,
        category: expFormData.category,
        description: expFormData.description.trim() || undefined,
        subItems: subItems.length > 0 ? subItems : undefined
      };
      setExperiences((prev) => [newItem, ...prev]);
      setIsExpModalOpen(false);

      try {
        await saveProfileExperienceToFirestore(newItem);
        onAddToast(
          'Tersimpan di Firebase!',
          `Poin baru "${newItem.title}" berhasil ditambahkan langsung ke Cloud Firestore (${COLLECTIONS.PROFILES}).`,
          'success'
        );
      } catch (err) {
        console.warn('Firebase save error:', err);
        onAddToast('Poin Profil Ditambahkan', `Poin "${newItem.title}" tersimpan di memori lokal.`, 'success');
      }
    }
  };

  const handleDeleteExp = async (id: string, title: string) => {
    if (window.confirm(`Hapus poin profil "${title}" dari daftar dan Firebase?`)) {
      setExperiences((prev) => prev.filter((item) => item.id !== id));
      try {
        await deleteProfileExperienceFromFirestore(id);
        onAddToast(
          'Dihapus dari Firebase',
          `Poin "${title}" berhasil dihapus dari Cloud Firestore (${COLLECTIONS.PROFILES}).`,
          'info'
        );
      } catch (err) {
        console.warn('Firebase delete error:', err);
        onAddToast('Poin Profil Dihapus', `Poin "${title}" telah dihapus.`, 'info');
      }
    }
  };

  const handleCopyExp = (item: ProfileExperienceItem) => {
    const textToCopy = `📌 ${item.title}${item.institution ? ` - ${item.institution}` : ''}\n${item.description || ''}${
      item.subItems && item.subItems.length > 0 ? '\n' + item.subItems.map((s) => `• ${s}`).join('\n') : ''
    }`;
    navigator.clipboard.writeText(textToCopy);
    onAddToast('Teks Disalin', 'Poin profil telah disalin ke clipboard.', 'success');
  };

  const handleDuplicateExp = async (item: ProfileExperienceItem) => {
    const duplicated: ProfileExperienceItem = {
      ...item,
      id: `prof-${Date.now()}`,
      title: `${item.title} (Salinan)`
    };
    setExperiences((prev) => [duplicated, ...prev]);
    try {
      await saveProfileExperienceToFirestore(duplicated);
      onAddToast(
        'Tersimpan di Firebase!',
        `Salinan "${duplicated.title}" berhasil disimpan langsung ke Cloud Firestore (${COLLECTIONS.PROFILES}).`,
        'success'
      );
    } catch (err) {
      console.warn('Firebase duplicate error:', err);
      onAddToast('Poin Profil Diduplikasi', `Salinan "${duplicated.title}" berhasil dibuat.`, 'success');
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: Portfolio Certificates & Works
  // -------------------------------------------------------------
  const handleOpenAddCert = () => {
    setEditingCert(null);
    setCertFormData({
      title: '',
      category: 'Sertifikat',
      issuer: 'UIN Syarif Hidayatullah Jakarta',
      year: new Date().getFullYear().toString(),
      imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
      description: ''
    });
    setIsCertModalOpen(true);
  };

  const handleOpenEditCert = (cert: PortfolioCertificateItem) => {
    setEditingCert(cert);
    setCertFormData({
      title: cert.title,
      category: cert.category,
      issuer: cert.issuer,
      year: cert.year,
      imageUrl: cert.imageUrl,
      description: cert.description || ''
    });
    setIsCertModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certFormData.title.trim()) return;

    if (editingCert) {
      // Update
      const updated: PortfolioCertificateItem = {
        ...editingCert,
        title: certFormData.title.trim(),
        category: certFormData.category,
        issuer: certFormData.issuer.trim(),
        year: certFormData.year.trim(),
        imageUrl: certFormData.imageUrl.trim() || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
        description: certFormData.description.trim() || undefined
      };
      setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setIsCertModalOpen(false);

      try {
        await savePortfolioCertificateToFirestore(updated);
        onAddToast(
          'Sertifikat Tersimpan di Firebase!',
          `Data karya "${updated.title}" berhasil diperbarui langsung di Cloud Firestore (${COLLECTIONS.PORTFOLIOS}).`,
          'success'
        );
      } catch (err) {
        console.warn('Firebase save cert error:', err);
        onAddToast('Sertifikat Diperbarui', `Sertifikat "${updated.title}" berhasil diperbarui.`, 'success');
      }
    } else {
      // Create new
      const newCert: PortfolioCertificateItem = {
        id: `cert-${Date.now()}`,
        title: certFormData.title.trim(),
        category: certFormData.category,
        issuer: certFormData.issuer.trim(),
        year: certFormData.year.trim(),
        imageUrl: certFormData.imageUrl.trim() || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80',
        description: certFormData.description.trim() || undefined
      };
      setCertificates((prev) => [newCert, ...prev]);
      setIsCertModalOpen(false);

      try {
        await savePortfolioCertificateToFirestore(newCert);
        onAddToast(
          'Sertifikat Tersimpan di Firebase!',
          `Sertifikat baru "${newCert.title}" berhasil disimpan langsung ke Cloud Firestore (${COLLECTIONS.PORTFOLIOS}).`,
          'success'
        );
      } catch (err) {
        console.warn('Firebase save cert error:', err);
        onAddToast('Sertifikat Ditambahkan', `Sertifikat/Karya "${newCert.title}" berhasil ditambahkan.`, 'success');
      }
    }
  };

  const handleDeleteCert = async (id: string, title: string) => {
    if (window.confirm(`Hapus sertifikat/karya "${title}" dari portofolio dan Firebase?`)) {
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      try {
        await deletePortfolioCertificateFromFirestore(id);
        onAddToast(
          'Dihapus dari Firebase',
          `Sertifikat "${title}" berhasil dihapus dari Cloud Firestore (${COLLECTIONS.PORTFOLIOS}).`,
          'info'
        );
      } catch (err) {
        console.warn('Firebase delete cert error:', err);
        onAddToast('Sertifikat Dihapus', `Sertifikat "${title}" telah dihapus.`, 'info');
      }
    }
  };

  const handleDuplicateCert = async (cert: PortfolioCertificateItem) => {
    const duplicated: PortfolioCertificateItem = {
      ...cert,
      id: `cert-${Date.now()}`,
      title: `${cert.title} (Salinan)`
    };
    setCertificates((prev) => [duplicated, ...prev]);
    try {
      await savePortfolioCertificateToFirestore(duplicated);
      onAddToast(
        'Sertifikat Tersimpan di Firebase!',
        `Salinan "${duplicated.title}" berhasil disimpan langsung ke Cloud Firestore (${COLLECTIONS.PORTFOLIOS}).`,
        'success'
      );
    } catch (err) {
      console.warn('Firebase duplicate cert error:', err);
      onAddToast('Sertifikat Diduplikasi', `Salinan "${duplicated.title}" berhasil ditambahkan.`, 'success');
    }
  };

  const handleCopyCertLink = (cert: PortfolioCertificateItem) => {
    const textToCopy = `🏆 ${cert.title}\nKategori: ${cert.category}\nPenerbit: ${cert.issuer} (${cert.year})\n${cert.description || ''}`;
    navigator.clipboard.writeText(textToCopy);
    onAddToast('Detail Disalin', 'Informasi sertifikat disalin ke clipboard.', 'success');
  };

  return (
    <section id="profil" className="py-16 sm:py-20 bg-[#F4F8FC] relative border-t border-[#E2E8F0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
              <GraduationCap className="w-4 h-4 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Profil & Rekam Jejak</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Profil Pendidik & <span className="font-semibold text-[#0284C7]">Portofolio Karya</span>
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-2 max-w-2xl leading-relaxed">
              Mengenal latar belakang akademis, pengalaman laboratorium kimia, serta dokumentasi sertifikat dan karya riset pembelajaran Pak Hafiz Akhyar, S.Si.
            </p>
          </div>

          {/* Admin Controls Info Badge */}
          {isAdmin && (
            <div className="flex items-center gap-2 bg-[#E0F2FE] border border-[#BAE6FD] px-4 py-2 rounded-xl text-xs text-[#0369A1] font-medium shrink-0">
              <Sparkles className="w-4 h-4 text-[#0284C7]" />
              <span>Mode Guru: Anda dapat menambah, mengedit, menyalin, dan mengganti foto portofolio.</span>
            </div>
          )}
        </div>

        {/* 2-Column Balanced Grid Layout (50:50 on Laptop/Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* ========================================================================= */}
          {/* SISI KIRI: POIN-POIN PROFIL & PENGALAMAN (SIMPEL, ELEGAN & IPHONE BLUE) */}
          {/* ========================================================================= */}
          <div className="flex flex-col h-full min-h-[480px] bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 relative overflow-hidden justify-between">
            
            {/* Top Container Header */}
            <div className="flex-1 flex flex-col min-h-0">
              {/* Teacher Info Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full bg-linear-to-br from-[#0284C7] via-[#007AFF] to-[#0369A1] p-0.5 shadow-md shadow-[#0284C7]/20 shrink-0">
                    <img
                      src={TEACHER_INFO.avatar}
                      alt={TEACHER_INFO.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" title="Pendidik Aktif" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-heading text-[#0F172A] leading-tight">
                      {TEACHER_INFO.name}
                    </h3>
                    <p className="text-xs text-[#007AFF] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                      <span>Guru Kimia & Praktisi Lab</span>
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleOpenAddExp}
                    className="px-3 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#007AFF]/25 transition-transform transform hover:scale-105 cursor-pointer"
                    title="Tambah Poin Profil Baru"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Poin</span>
                  </button>
                )}
              </div>

              {/* Sub-header & Counter */}
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-3">
                <span className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#007AFF]" />
                  <span>Riwayat Pendidikan & Pengalaman ({experiences.length})</span>
                </span>
                <span className="text-[11px] text-[#007AFF] font-medium bg-[#F0F7FF] px-2 py-0.5 rounded-md border border-[#BAE6FD]">
                  Gulir vertikal
                </span>
              </div>

              {/* Simplified & Sleek Vertical Scrollable List */}
              <div className="flex-1 min-h-[300px] max-h-[380px] sm:max-h-[400px] overflow-y-auto pr-1.5 space-y-2.5 custom-scrollbar focus:outline-none">
                {experiences.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F0F7FF] border border-[#E2E8F0] hover:border-[#93C5FD] border-l-[4px] border-l-[#007AFF] transition-all group relative shadow-2xs hover:shadow-xs"
                  >
                    {/* Top Row: Title, Institution, and Category Pill */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          {exp.category === 'Pendidikan' ? (
                            <GraduationCap className="w-4 h-4" />
                          ) : exp.institution?.toLowerCase().includes('lab') || exp.title.toLowerCase().includes('lab') ? (
                            <FlaskConical className="w-4 h-4" />
                          ) : (
                            <Briefcase className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          {/* Nama Pekerjaan / Jabatan */}
                          <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug group-hover:text-[#007AFF] transition-colors truncate">
                            {exp.title}
                          </h4>
                          {/* Tempat / Institusi */}
                          {exp.institution && (
                            <p className="text-xs font-semibold text-[#475569] mt-0.5 flex items-center gap-1 truncate">
                              <Building className="w-3 h-3 text-[#007AFF] shrink-0" />
                              <span className="truncate">{exp.institution}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Kategori Badge & Periode */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#007AFF]">
                          {exp.category}
                        </span>
                        {exp.period && (
                          <span className="text-[10px] text-[#94A3B8] font-mono">
                            {exp.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Admin Actions & Copy Button (Only on Admin / Mode Guru) */}
                    {isAdmin && (
                      <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => handleCopyExp(exp)}
                          className="text-[#64748B] hover:text-[#007AFF] flex items-center gap-1 text-[11px] font-medium cursor-pointer transition-colors"
                          title="Salin Poin ke Clipboard"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicateExp(exp)}
                            className="px-2 py-0.5 rounded-md bg-white hover:bg-[#E0F2FE] text-[#007AFF] border border-[#BAE6FD] text-[10px] font-bold cursor-pointer transition-colors"
                            title="Duplikasi Poin Ini"
                          >
                            Duplikasi
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditExp(exp)}
                            className="p-1 rounded-md bg-white hover:bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer transition-colors"
                            title="Edit Poin Profil"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExp(exp.id, exp.title)}
                            className="p-1 rounded-md bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
                            title="Hapus Poin Profil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Add Poin Bar (Admin) or Subtle Hint */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleOpenAddExp}
                  className="w-full py-2.5 rounded-xl bg-[#F0F7FF] hover:bg-[#E0F2FE] border border-[#BAE6FD] text-[#007AFF] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Poin Profil Baru</span>
                </button>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />
                    <span>Rekam jejak pendidik & instruktur sains terverifikasi</span>
                  </span>
                  <span className="text-[#007AFF] font-medium font-mono">{experiences.length} Posisi</span>
                </div>
              )}
            </div>

          </div>

          {/* ========================================================================= */}
          {/* SISI KANAN: PORTOFOLIO SERTIFIKAT & KARYA (HORIZONTAL SCROLLABLE) */}
          {/* ========================================================================= */}
          <div className="flex flex-col h-full min-h-[480px] bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 relative overflow-hidden justify-between">
            
            {/* Header & Carousel Nav Controls */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold font-heading text-[#0F172A]">
                      Sertifikat & Karya Guru
                    </h3>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Dokumentasi sertifikasi kompetensi & riset sains
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleOpenAddCert}
                      className="px-3 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#007AFF]/25 transition-transform transform hover:scale-105 cursor-pointer mr-1"
                      title="Tambah Sertifikat / Karya Baru"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Karya</span>
                    </button>
                  )}

                  {/* Left/Right Carousel Arrows */}
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    disabled={!canScrollLeft}
                    className={`p-2 rounded-full border transition-all cursor-pointer ${
                      canScrollLeft
                        ? 'bg-white hover:bg-[#E0F2FE] border-[#CBD5E1] text-[#0F172A] shadow-xs'
                        : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed opacity-60'
                    }`}
                    title="Gulir ke Kiri"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    disabled={!canScrollRight}
                    className={`p-2 rounded-full border transition-all cursor-pointer ${
                      canScrollRight
                        ? 'bg-white hover:bg-[#E0F2FE] border-[#CBD5E1] text-[#0F172A] shadow-xs'
                        : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#CBD5E1] cursor-not-allowed opacity-60'
                    }`}
                    title="Gulir ke Kanan"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Carousel Container */}
              <div
                ref={carouselRef}
                onScroll={checkScroll}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 pt-1 focus:outline-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="min-w-[250px] sm:min-w-[270px] max-w-[290px] snap-start bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] hover:border-[#93C5FD] border-t-[3px] border-t-[#007AFF] shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group/card relative"
                  >
                    {/* Image Container with Hover Overlay */}
                    <div className="relative aspect-4/3 w-full bg-[#0F172A] overflow-hidden">
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 cursor-pointer"
                        onClick={() => setPreviewCert(cert)}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover/card:opacity-90 transition-opacity" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#007AFF] backdrop-blur-xs shadow-xs">
                          {cert.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0F172A]/80 text-white backdrop-blur-xs">
                          {cert.year}
                        </span>
                      </div>

                      {/* Quick View Button on Image */}
                      <button
                        type="button"
                        onClick={() => setPreviewCert(cert)}
                        className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black/90 text-white text-[10px] font-medium backdrop-blur-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title="Lihat Pratinjau Penuh"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Perbesar</span>
                      </button>

                      {/* Admin: Quick Photo Changer Button */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCertForPhotoChange(cert);
                          }}
                          className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 hover:bg-[#007AFF] text-[#007AFF] hover:text-white border border-[#BAE6FD] text-[10px] font-bold shadow-md flex items-center gap-1 cursor-pointer transition-all transform hover:scale-105"
                          title="Ganti / Cari Foto via Google atau Unggah"
                        >
                          <Camera className="w-3 h-3" />
                          <span>Ganti Foto</span>
                        </button>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-snug line-clamp-2">
                          {cert.title}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#007AFF] mt-1 flex items-center gap-1">
                          <Building className="w-3 h-3 text-[#38BDF8]" />
                          <span className="truncate">{cert.issuer}</span>
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                        {isAdmin ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopyCertLink(cert)}
                              className="text-[#64748B] hover:text-[#007AFF] flex items-center gap-1 text-[11px] font-medium cursor-pointer transition-colors"
                              title="Salin Rincian Sertifikat"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </button>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleDuplicateCert(cert)}
                                className="px-2 py-0.5 rounded-md bg-white hover:bg-[#E0F2FE] text-[#007AFF] border border-[#BAE6FD] text-[10px] font-bold cursor-pointer transition-colors"
                                title="Duplikasi Sertifikat Ini"
                              >
                                Duplikasi
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditCert(cert)}
                                className="p-1 rounded-md bg-white hover:bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer transition-colors"
                                title="Edit Data Sertifikat"
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
                          </>
                        ) : (
                          <div className="w-full flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => setPreviewCert(cert)}
                              className="text-[#007AFF] hover:text-[#0369A1] font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Lihat Rincian</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Horizontal Scroll Hint Indicator */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1.5 text-[11px] text-[#475569]">
                <Sparkles className="w-3 h-3 text-[#007AFF]" />
                <span>Geser horizontal untuk melihat {certificates.length} sertifikat & karya</span>
              </span>
              <div className="flex items-center gap-1">
                {certificates.map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]"
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT POIN PROFIL (GURU) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isExpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {editingExp ? 'Edit Poin Profil' : 'Tambah Poin Profil Baru'}
                    </h3>
                    <p className="text-xs text-[#64748B]">Riwayat pendidikan, pengalaman lab, atau pengajaran</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpModalOpen(false)}
                  className="p-1.5 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveExp} className="p-5 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Judul Poin / Posisi *
                  </label>
                  <input
                    type="text"
                    required
                    value={expFormData.title}
                    onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
                    placeholder="Contoh: Asisten Laboratorium Kimia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                      Institusi / Lembaga
                    </label>
                    <input
                      type="text"
                      value={expFormData.institution}
                      onChange={(e) => setExpFormData({ ...expFormData, institution: e.target.value })}
                      placeholder="Contoh: UIN Syarif Hidayatullah Jakarta"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:border-[#0284C7] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                      Kategori Poin
                    </label>
                    <select
                      value={expFormData.category}
                      onChange={(e) => setExpFormData({ ...expFormData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm bg-white focus:border-[#0284C7] focus:outline-none"
                    >
                      <option value="Pengalaman">Pengalaman</option>
                      <option value="Pendidikan">Pendidikan</option>
                      <option value="Keahlian">Keahlian Lab</option>
                      <option value="Sertifikasi">Sertifikasi</option>
                      <option value="Prestasi">Prestasi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Periode / Status (Opsional)
                  </label>
                  <input
                    type="text"
                    value={expFormData.period}
                    onChange={(e) => setExpFormData({ ...expFormData, period: e.target.value })}
                    placeholder="Contoh: 2022 - Sekarang / Asisten Aktif"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Deskripsi Ringkas
                  </label>
                  <textarea
                    rows={2}
                    value={expFormData.description}
                    onChange={(e) => setExpFormData({ ...expFormData, description: e.target.value })}
                    placeholder="Tuliskan gambaran tugas, fokus materi, atau tanggung jawab..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Poin Rincian Tambahan (1 baris per poin)
                  </label>
                  <textarea
                    rows={3}
                    value={expFormData.subItemsText}
                    onChange={(e) => setExpFormData({ ...expFormData, subItemsText: e.target.value })}
                    placeholder="Contoh:&#10;Asisten praktikum kimia organik&#10;Pengelolaan inventaris bahan kimia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-mono focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExpModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-[#0284C7]/20 cursor-pointer transition-all"
                  >
                    {editingExp ? 'Simpan Perubahan' : 'Tambah Poin Profil'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: TAMBAH / EDIT SERTIFIKAT & KARYA (GURU) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCertModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {editingCert ? 'Edit Sertifikat / Karya' : 'Tambah Sertifikat / Karya Baru'}
                    </h3>
                    <p className="text-xs text-[#64748B]">Dokumentasi prestasi, riset, atau sertifikasi keahlian</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="p-1.5 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveCert} className="p-5 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Nama Sertifikat / Judul Karya *
                  </label>
                  <input
                    type="text"
                    required
                    value={certFormData.title}
                    onChange={(e) => setCertFormData({ ...certFormData, title: e.target.value })}
                    placeholder="Contoh: Sertifikat Kompetensi Asisten Laboratorium Kimia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                      Kategori
                    </label>
                    <select
                      value={certFormData.category}
                      onChange={(e) => setCertFormData({ ...certFormData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm bg-white focus:border-[#0284C7] focus:outline-none"
                    >
                      <option value="Sertifikat">Sertifikat</option>
                      <option value="Karya Riset">Karya Riset</option>
                      <option value="Penghargaan">Penghargaan</option>
                      <option value="Pelatihan">Pelatihan</option>
                      <option value="Publikasi">Publikasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                      Tahun / Periode
                    </label>
                    <input
                      type="text"
                      value={certFormData.year}
                      onChange={(e) => setCertFormData({ ...certFormData, year: e.target.value })}
                      placeholder="2025"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:border-[#0284C7] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Penerbit / Penyelenggara *
                  </label>
                  <input
                    type="text"
                    required
                    value={certFormData.issuer}
                    onChange={(e) => setCertFormData({ ...certFormData, issuer: e.target.value })}
                    placeholder="Contoh: UIN Syarif Hidayatullah Jakarta / Kemendikbud"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    URL Foto Sampul / Sertifikat
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={certFormData.imageUrl}
                      onChange={(e) => setCertFormData({ ...certFormData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs focus:border-[#0284C7] focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1">
                    Tip: Anda juga dapat menggunakan tombol 📷 <strong>Ganti Foto</strong> langsung pada kartu untuk mencari via Google atau unggah dari HP/Laptop.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Deskripsi Ringkas (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={certFormData.description}
                    onChange={(e) => setCertFormData({ ...certFormData, description: e.target.value })}
                    placeholder="Keterangan kompetensi, ruang lingkup pengujian, atau dampak karya..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm focus:border-[#0284C7] focus:outline-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCertModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-[#0284C7]/20 cursor-pointer transition-all"
                  >
                    {editingCert ? 'Simpan Perubahan' : 'Tambah Sertifikat'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: QUICK PHOTO CHANGER FOR CERTIFICATES */}
      {/* ========================================================================= */}
      {certForPhotoChange && (
        <PhotoChangerModal
          isOpen={!!certForPhotoChange}
          onClose={() => setCertForPhotoChange(null)}
          currentImageUrl={certForPhotoChange.imageUrl}
          itemTitle={certForPhotoChange.title}
          modalTitle="Ganti Foto Sertifikat / Karya"
          storageFolder={STORAGE_FOLDERS.CERTIFICATE_IMAGES}
          onSavePhoto={async (newUrl) => {
            if (!certForPhotoChange) return;
            const updated: PortfolioCertificateItem = {
              ...certForPhotoChange,
              imageUrl: newUrl
            };
            setCertificates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            setCertForPhotoChange(null);

            try {
              await savePortfolioCertificateToFirestore(updated);
              onAddToast(
                'Foto Sertifikat Tersimpan di Firebase!',
                `Foto untuk "${updated.title}" berhasil disimpan di Firebase (${COLLECTIONS.PORTFOLIOS} & ${STORAGE_FOLDERS.CERTIFICATE_IMAGES}).`,
                'success'
              );
            } catch (err) {
              console.warn('Firebase save cert photo error:', err);
              onAddToast('Foto Sertifikat Diperbarui', `Foto untuk "${updated.title}" berhasil diperbarui.`, 'success');
            }
          }}
          onAddToast={onAddToast}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIGHTBOX DETAIL PREVIEW (SISWA & GURU) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0F172A] text-white rounded-3xl border border-[#334155] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Lightbox Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0284C7] text-white">
                    {previewCert.category}
                  </span>
                  <span className="text-xs text-[#94A3B8] font-mono">
                    Tahun {previewCert.year}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewCert(null)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large Image Preview */}
              <div className="relative aspect-16/10 w-full bg-black overflow-hidden flex items-center justify-center">
                <img
                  src={previewCert.imageUrl}
                  alt={previewCert.title}
                  className="w-full h-full object-contain max-h-[480px]"
                />
              </div>

              {/* Lightbox Body Info */}
              <div className="p-5 sm:p-6 space-y-3 bg-[#1E293B]">
                <h3 className="text-lg sm:text-xl font-bold font-heading text-white">
                  {previewCert.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#38BDF8] flex items-center gap-1.5">
                  <Building className="w-4 h-4" />
                  <span>Penerbit / Penyelenggara: {previewCert.issuer}</span>
                </p>
                {previewCert.description && (
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {previewCert.description}
                  </p>
                )}

                {/* Footer Lightbox Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">
                    Dokumentasi Portofolio Resmi Kelas Pak Hafiz
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCertLink(previewCert)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Info</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
