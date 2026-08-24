import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  FlaskConical,
  Building,
  Calendar,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  Mail,
  Instagram,
  Youtube,
  Search,
  X,
  PlusCircle,
  MinusCircle,
  FileText,
  UserCheck,
  Award,
  Check
} from 'lucide-react';
import { ProfileExperienceItem } from '../types';
import { INITIAL_PROFILE_EXPERIENCES } from '../data/mockData';
import {
  subscribeToProfileExperiences,
  saveProfileExperienceToFirestore,
  deleteProfileExperienceFromFirestore
} from '../lib/firebase';

const LOCAL_STORAGE_EXP_KEY = 'kelaspakhafiz_experiences_v2';

interface ProfileSectionProps {
  isAdmin: boolean;
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  isAdmin,
  onAddToast
}) => {
  // State: Experiences
  const [experiences, setExperiences] = useState<ProfileExperienceItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_EXP_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load experiences from localStorage:', e);
    }
    return INITIAL_PROFILE_EXPERIENCES;
  });

  // State: Filter & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State: Admin Add/Edit Modal
  const [editingExp, setEditingExp] = useState<ProfileExperienceItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    period: '',
    category: 'Pengalaman',
    description: '',
    subItems: ['']
  });

  const categories = ['Semua', 'Pendidikan', 'Pengalaman'];

  // Subscribe to Firestore Realtime
  useEffect(() => {
    const unsubExp = subscribeToProfileExperiences(
      (items) => {
        if (items && items.length > 0) {
          setExperiences(items);
          try {
            localStorage.setItem(LOCAL_STORAGE_EXP_KEY, JSON.stringify(items));
          } catch (e) {
            console.warn('Failed to save experiences locally:', e);
          }
        }
      },
      (err) => {
        console.warn('Firestore profile experiences subscription error:', err);
      }
    );

    return () => {
      unsubExp();
    };
  }, []);

  // Save to LocalStorage whenever experiences change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_EXP_KEY, JSON.stringify(experiences));
    } catch (e) {
      console.warn('Failed to save experiences to localStorage:', e);
    }
  }, [experiences]);

  // Filtered Experiences
  const filteredExperiences = useMemo(() => {
    return experiences.filter((exp) => {
      const matchCat =
        selectedCategory === 'Semua' ||
        exp.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.institution && exp.institution.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exp.description && exp.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exp.period && exp.period.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [experiences, selectedCategory, searchQuery]);

  // --- Handlers: Modal Open ---
  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData({
      title: '',
      institution: 'SMA IAS Jakarta',
      period: 'Pendidik Aktif',
      category: 'Pengalaman',
      description: '',
      subItems: ['']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ProfileExperienceItem) => {
    setEditingExp(item);
    setFormData({
      title: item.title,
      institution: item.institution || '',
      period: item.period || '',
      category: item.category || 'Pengalaman',
      description: item.description || '',
      subItems: item.subItems && item.subItems.length > 0 ? [...item.subItems] : ['']
    });
    setIsModalOpen(true);
  };

  // Sub-items array dynamic management
  const handleAddSubItem = () => {
    setFormData((prev) => ({
      ...prev,
      subItems: [...prev.subItems, '']
    }));
  };

  const handleRemoveSubItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      subItems: prev.subItems.filter((_, i) => i !== index)
    }));
  };

  const handleSubItemChange = (index: number, val: string) => {
    const updated = [...formData.subItems];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, subItems: updated }));
  };

  // Save Item (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      onAddToast('Judul Wajib Diisi', 'Mohon lengkapi judul posisi atau riwayat.', 'info');
      return;
    }

    const cleanedSubItems = formData.subItems.map((s) => s.trim()).filter(Boolean);

    if (editingExp) {
      const updated: ProfileExperienceItem = {
        ...editingExp,
        title: formData.title.trim(),
        institution: formData.institution.trim() || undefined,
        period: formData.period.trim() || undefined,
        category: formData.category as any,
        description: formData.description.trim() || undefined,
        subItems: cleanedSubItems.length > 0 ? cleanedSubItems : undefined
      };

      setExperiences((prev) => prev.map((exp) => (exp.id === updated.id ? updated : exp)));
      try {
        await saveProfileExperienceToFirestore(updated);
        onAddToast('Riwayat Diperbarui', `"${updated.title}" berhasil diperbarui.`, 'success');
      } catch (err) {
        console.warn('Firestore update error:', err);
      }
    } else {
      const newItem: ProfileExperienceItem = {
        id: `prof-${Date.now()}`,
        title: formData.title.trim(),
        institution: formData.institution.trim() || undefined,
        period: formData.period.trim() || undefined,
        category: formData.category as any,
        description: formData.description.trim() || undefined,
        subItems: cleanedSubItems.length > 0 ? cleanedSubItems : undefined
      };

      setExperiences((prev) => [newItem, ...prev]);
      try {
        await saveProfileExperienceToFirestore(newItem);
        onAddToast('Riwayat Ditambahkan', `"${newItem.title}" berhasil ditambahkan.`, 'success');
      } catch (err) {
        console.warn('Firestore save error:', err);
      }
    }

    setIsModalOpen(false);
    setEditingExp(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      try {
        await deleteProfileExperienceFromFirestore(id);
        onAddToast('Riwayat Dihapus', `"${title}" berhasil dihapus.`, 'info');
      } catch (err) {
        console.warn('Firestore delete error:', err);
      }
    }
  };

  const handleDuplicate = async (item: ProfileExperienceItem) => {
    const duplicated: ProfileExperienceItem = {
      ...item,
      id: `prof-${Date.now()}`,
      title: `${item.title} (Salinan)`
    };
    setExperiences((prev) => [duplicated, ...prev]);
    try {
      await saveProfileExperienceToFirestore(duplicated);
      onAddToast('Riwayat Diduplikasi', `Salinan "${item.title}" berhasil dibuat.`, 'success');
    } catch (err) {
      console.warn('Firestore duplicate error:', err);
    }
  };

  const handleCopy = (item: ProfileExperienceItem) => {
    const lines = [
      `*${item.title}*`,
      item.institution ? `Institusi: ${item.institution}` : '',
      item.period ? `Periode: ${item.period}` : '',
      item.category ? `Kategori: ${item.category}` : '',
      item.description ? `Deskripsi: ${item.description}` : '',
      item.subItems && item.subItems.length > 0 ? `Poin: \n- ${item.subItems.join('\n- ')}` : ''
    ].filter(Boolean).join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(lines);
      onAddToast('Rincian Disalin', 'Teks riwayat berhasil disalin ke clipboard.', 'info');
    }
  };

  return (
    <section id="profil" className="py-16 sm:py-20 bg-white relative border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F0F7FF] border border-[#BAE6FD] text-[#007AFF] text-xs font-semibold mb-3 shadow-2xs">
              <UserCheck className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest text-[10px] font-bold">Profil Pendidik & Rekam Jejak</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Profil & <span className="font-semibold text-[#007AFF]">Riwayat Pengalaman Guru</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
              Latar belakang akademis, pengalaman instruktur laboratorium kimia murni, asistensi riset sains, dan dedikasi pengajaran IPA SMA.
            </p>
          </div>

          {/* Admin Action Button */}
          {isAdmin && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-full bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007AFF]/25 transition-transform transform hover:scale-105 cursor-pointer"
                title="Tambah Riwayat / Pengalaman Baru"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Riwayat Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Responsive Layout: Profile Bio Card & Experience List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* KOLOM KIRI: KARTU BIODATA & PROFIL GURU (4 COLS)                           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Teacher Card */}
            <div className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs relative overflow-hidden">
              
              {/* Subtle top decoration accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#0284C7] via-[#007AFF] to-[#38BDF8]" />

              {/* Avatar & Badges */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-[#0284C7] via-[#007AFF] to-[#0369A1] p-0.5 shadow-md shadow-[#007AFF]/20 shrink-0">
                  <img
                    src="https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi"
                    alt="Pak Hafiz Akhyar, S.Si."
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Pendidik Aktif" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-[#0F172A] leading-tight">
                    Pak Hafiz Akhyar, S.Si.
                  </h3>
                  <p className="text-xs text-[#007AFF] font-semibold flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                    <span>Guru Kimia & Praktisi Lab</span>
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    Pendidik Terverifikasi
                  </span>
                </div>
              </div>

              {/* Short Bio Statement */}
              <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] mb-5 text-xs text-[#475569] leading-relaxed">
                <p className="italic text-[#334155]">
                  &ldquo;Mendedikasikan pembelajaran sains kimia secara kontekstual, berbasis laboratorium ramah lingkungan, serta menumbuhkan nalar kritis siswa menuju prestasi olimpiade dan perguruan tinggi.&rdquo;
                </p>
              </div>

              {/* Key Competency Pills */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Keahlian & Fokus Pembelajaran:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-2xs">
                    S-1 Kimia UIN Jakarta
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-2xs">
                    Kimia Organik & Analitik
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-2xs">
                    Instruktur Lab & K3
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-2xs">
                    Modul LKPD Indikator Alami
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-2xs">
                    Pembina Olimpiade Sains (OSN)
                  </span>
                </div>
              </div>

              {/* Direct Official Contact / Social Channels */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                  Kontak & Kanal Edukasi:
                </span>
                
                <a
                  href="mailto:kelaspakhafiz@gmail.com"
                  className="flex items-center gap-2.5 text-xs text-[#334155] hover:text-[#007AFF] transition-colors p-2 rounded-xl bg-white border border-[#E2E8F0]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold truncate">kelaspakhafiz@gmail.com</span>
                </a>

                <a
                  href="https://www.instagram.com/kelaspakhafiz/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-xs text-[#334155] hover:text-[#E1306C] transition-colors p-2 rounded-xl bg-white border border-[#E2E8F0]"
                >
                  <div className="w-7 h-7 rounded-lg bg-pink-50 text-[#E1306C] flex items-center justify-center shrink-0">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold truncate">@kelaspakhafiz (Instagram)</span>
                </a>

                <a
                  href="https://www.youtube.com/@KelasPakHafiz"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 text-xs text-[#334155] hover:text-[#FF0000] transition-colors p-2 rounded-xl bg-white border border-[#E2E8F0]"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#FF0000] flex items-center justify-center shrink-0">
                    <Youtube className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold truncate">Kelas Pak Hafiz (YouTube)</span>
                </a>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* KOLOM KANAN: DAFTAR RIWAYAT PENDIDIKAN & PENGALAMAN (8 COLS)              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Filter Bar & Search */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
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
                          : 'bg-white text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#007AFF] border border-[#E2E8F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari riwayat / instansi..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#E2E8F0] bg-white focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] focus:outline-none transition-all"
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

            {/* Experiences Timeline / Card List */}
            {filteredExperiences.length === 0 ? (
              <div className="py-16 text-center bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0]">
                <Briefcase className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#0F172A]">Riwayat Tidak Ditemukan</p>
                <p className="text-xs text-[#64748B] mt-1">Coba kata kunci lain atau pilih kategori Semua.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredExperiences.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-[#F0F7FF]/50 border border-[#E2E8F0] hover:border-[#93C5FD] border-l-[4px] border-l-[#007AFF] shadow-xs transition-all group relative"
                  >
                    {/* Header Row: Icon, Title, Institution, and Category Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                          {exp.category === 'Pendidikan' ? (
                            <GraduationCap className="w-5 h-5" />
                          ) : exp.institution?.toLowerCase().includes('lab') || exp.title.toLowerCase().includes('lab') ? (
                            <FlaskConical className="w-5 h-5" />
                          ) : (
                            <Briefcase className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#007AFF] transition-colors">
                            {exp.title}
                          </h4>
                          
                          {exp.institution && (
                            <p className="text-xs font-semibold text-[#475569] mt-0.5 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-[#007AFF] shrink-0" />
                              <span>{exp.institution}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Tags (Category & Period) */}
                      <div className="flex items-center sm:flex-col sm:items-end gap-1.5 shrink-0 pl-12 sm:pl-0">
                        <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-[#E0F2FE] border border-[#BAE6FD] text-[#007AFF]">
                          {exp.category}
                        </span>
                        {exp.period && (
                          <span className="text-[10px] text-[#64748B] font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#94A3B8]" />
                            <span>{exp.period}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <p className="mt-3 text-xs sm:text-sm text-[#475569] leading-relaxed pl-0 sm:pl-12">
                        {exp.description}
                      </p>
                    )}

                    {/* Key Sub-items / Bullet Points */}
                    {Array.isArray(exp.subItems) && exp.subItems.length > 0 && (
                      <div className="mt-3 pl-0 sm:pl-12 space-y-1.5">
                        {exp.subItems.map((sub, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-xs text-[#334155]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#007AFF] shrink-0 mt-0.5" />
                            <span className="leading-snug">{sub}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Admin Actions (Mode Guru) */}
                    {isAdmin && (
                      <div className="mt-3.5 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs sm:pl-12">
                        <button
                          type="button"
                          onClick={() => handleCopy(exp)}
                          className="text-[#64748B] hover:text-[#007AFF] flex items-center gap-1 text-[11px] font-medium cursor-pointer transition-colors"
                          title="Salin Poin Riwayat"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin Poin</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicate(exp)}
                            className="px-2 py-0.5 rounded-md bg-white hover:bg-[#E0F2FE] text-[#007AFF] border border-[#BAE6FD] text-[10px] font-bold cursor-pointer transition-colors"
                            title="Duplikasi Poin Ini"
                          >
                            Duplikasi
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(exp)}
                            className="p-1 rounded-md bg-white hover:bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer transition-colors"
                            title="Edit Riwayat"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(exp.id, exp.title)}
                            className="p-1 rounded-md bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
                            title="Hapus Riwayat"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Add Poin Bar (Admin) or Total Counter */}
            <div className="pt-2">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="w-full py-3 rounded-2xl bg-[#F0F7FF] hover:bg-[#E0F2FE] border border-[#BAE6FD] text-[#007AFF] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Riwayat & Pengalaman Baru</span>
                </button>
              ) : (
                <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />
                    <span>Rekam jejak pendidik & instruktur sains terverifikasi</span>
                  </span>
                  <span className="text-[#007AFF] font-bold font-mono">{experiences.length} Riwayat</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL ADMIN: TAMBAH / EDIT RIWAYAT & PENGALAMAN                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 border border-[#E2E8F0] z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] font-heading">
                      {editingExp ? 'Edit Riwayat / Pengalaman' : 'Tambah Riwayat Baru'}
                    </h3>
                    <p className="text-xs text-[#64748B]">Mode Guru • Pak Hafiz Akhyar</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Judul Posisi / Pendidikan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Pengajar IPA dan Kimia SMA"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Kategori</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF] bg-white"
                    >
                      <option value="Pendidikan">Pendidikan</option>
                      <option value="Pengalaman">Pengalaman</option>
                      <option value="Keahlian">Keahlian</option>
                      <option value="Sertifikasi">Sertifikasi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Periode / Waktu</label>
                    <input
                      type="text"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="Contoh: Pendidik Aktif / 2023 - Sekarang"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Institusi / Lembaga</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Contoh: SMA IAS Jakarta / UIN Syarif Hidayatullah"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Deskripsi Ringkas</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Deskripsikan peran, tanggung jawab, atau fokus studi..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                {/* Sub Items / Poin Capaian */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#0F172A]">
                      Poin Capaian / Tanggung Jawab
                    </label>
                    <button
                      type="button"
                      onClick={handleAddSubItem}
                      className="text-[11px] font-bold text-[#007AFF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Tambah Poin</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.subItems.map((sub, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={sub}
                          onChange={(e) => handleSubItemChange(sIdx, e.target.value)}
                          placeholder={`Poin capaian ${sIdx + 1}...`}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                        />
                        {formData.subItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSubItem(sIdx)}
                            className="p-1 text-rose-500 hover:text-rose-700"
                            title="Hapus poin"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Simpan Riwayat
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
