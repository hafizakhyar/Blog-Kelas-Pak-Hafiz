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
  UserCheck,
  Award,
  Camera,
  MessageCircle,
  Globe,
  Phone,
  Link as LinkIcon,
  BookOpen,
  Send,
  Sliders,
  Check,
  ExternalLink,
  FileText
} from 'lucide-react';
import { ProfileExperienceItem, TeacherBioProfile, TeacherBioContact } from '../types';
import { INITIAL_PROFILE_EXPERIENCES, INITIAL_TEACHER_PROFILE } from '../data/mockData';
import {
  subscribeToProfileExperiences,
  saveProfileExperienceToFirestore,
  deleteProfileExperienceFromFirestore,
  subscribeToTeacherBioProfile,
  saveTeacherBioProfileToFirestore,
  STORAGE_FOLDERS
} from '../lib/firebase';
import { PhotoChangerModal } from './Modals/PhotoChangerModal';

const LOCAL_STORAGE_EXP_KEY = 'kelaspakhafiz_experiences_v2';
const LOCAL_STORAGE_BIO_KEY = 'kelaspakhafiz_teacher_bio_v1';

interface ProfileSectionProps {
  isAdmin: boolean;
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

type BioEditTab = 'bio' | 'skills' | 'contacts';

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  isAdmin,
  onAddToast
}) => {
  // State: Teacher Bio & Profile Details
  const [teacherBio, setTeacherBio] = useState<TeacherBioProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BIO_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load teacher bio from localStorage:', e);
    }
    return INITIAL_TEACHER_PROFILE;
  });

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

  // State: Filter & Search for Experiences
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State: Experience Add/Edit Modal
  const [editingExp, setEditingExp] = useState<ProfileExperienceItem | null>(null);
  const [isExpModalOpen, setIsExpModalOpen] = useState<boolean>(false);

  // Form State for Experience
  const [expFormData, setExpFormData] = useState({
    title: '',
    institution: '',
    period: '',
    category: 'Pengalaman'
  });

  // State: Teacher Bio Edit Modal (Deskripsi Profil, Keahlian, Kontak)
  const [isBioModalOpen, setIsBioModalOpen] = useState<boolean>(false);
  const [bioActiveTab, setBioActiveTab] = useState<BioEditTab>('bio');
  const [bioFormData, setBioFormData] = useState<TeacherBioProfile>(teacherBio);
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  // State: Avatar Photo Changer Modal
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);

  const categories = ['Semua', 'Pendidikan', 'Pengalaman'];

  // Subscribe to Firestore Realtime for Experiences
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

  // Subscribe to Firestore Realtime for Teacher Bio Profile
  useEffect(() => {
    const unsubBio = subscribeToTeacherBioProfile(
      (bio) => {
        if (bio && bio.name) {
          setTeacherBio(bio);
          try {
            localStorage.setItem(LOCAL_STORAGE_BIO_KEY, JSON.stringify(bio));
          } catch (e) {
            console.warn('Failed to save teacher bio locally:', e);
          }
        }
      },
      (err) => {
        console.warn('Firestore teacher bio subscription error:', err);
      }
    );

    return () => {
      unsubBio();
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

  // Save to LocalStorage whenever teacherBio changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BIO_KEY, JSON.stringify(teacherBio));
    } catch (e) {
      console.warn('Failed to save teacher bio to localStorage:', e);
    }
  }, [teacherBio]);

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

  // --- Handlers: Teacher Bio Edit Modal ---
  const handleOpenBioModal = (tab: BioEditTab = 'bio') => {
    setBioFormData({
      ...teacherBio,
      skillsAndFocus: [...teacherBio.skillsAndFocus],
      contacts: teacherBio.contacts.map((c) => ({ ...c }))
    });
    setBioActiveTab(tab);
    setNewSkillInput('');
    setIsBioModalOpen(true);
  };

  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bioFormData.name.trim()) {
      onAddToast('Nama Wajib Diisi', 'Mohon masukkan nama pendidik.', 'info');
      return;
    }

    const updatedProfile: TeacherBioProfile = {
      ...bioFormData,
      name: bioFormData.name.trim(),
      title: bioFormData.title.trim(),
      verifiedBadgeText: bioFormData.verifiedBadgeText?.trim() || 'Pendidik Terverifikasi',
      bioDescription: bioFormData.bioDescription.trim(),
      skillsAndFocus: bioFormData.skillsAndFocus.map((s) => s.trim()).filter(Boolean),
      contacts: bioFormData.contacts
        .map((c) => ({
          ...c,
          label: c.label.trim(),
          value: c.value.trim(),
          url: c.url?.trim() || undefined
        }))
        .filter((c) => c.label || c.value)
    };

    setTeacherBio(updatedProfile);
    setIsBioModalOpen(false);

    try {
      await saveTeacherBioProfileToFirestore(updatedProfile);
      onAddToast('Profil Guru Diperbarui', 'Deskripsi, keahlian, dan kontak berhasil disimpan ke database.', 'success');
    } catch (err) {
      console.warn('Failed to save teacher bio to Firestore:', err);
      onAddToast('Disimpan Lokal', 'Profil disimpan di perangkat ini.', 'info');
    }
  };

  // Skill Management in Modal
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (bioFormData.skillsAndFocus.includes(trimmed)) {
      onAddToast('Keahlian Sudah Ada', 'Keahlian tersebut sudah tercantum dalam daftar.', 'info');
      return;
    }
    setBioFormData((prev) => ({
      ...prev,
      skillsAndFocus: [...prev.skillsAndFocus, trimmed]
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillIndex: number) => {
    setBioFormData((prev) => ({
      ...prev,
      skillsAndFocus: prev.skillsAndFocus.filter((_, idx) => idx !== skillIndex)
    }));
  };

  // Contact Management in Modal
  const handleAddContact = () => {
    const newContact: TeacherBioContact = {
      id: `cnt-${Date.now()}`,
      type: 'email',
      label: 'Email Baru',
      value: '',
      url: ''
    };
    setBioFormData((prev) => ({
      ...prev,
      contacts: [...prev.contacts, newContact]
    }));
  };

  const handleRemoveContact = (index: number) => {
    setBioFormData((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((_, idx) => idx !== index)
    }));
  };

  const handleContactChange = (index: number, field: keyof TeacherBioContact, val: string) => {
    const updated = [...bioFormData.contacts];
    updated[index] = {
      ...updated[index],
      [field]: val
    };

    // Auto-generate URL helpers based on type if url is empty or standard
    if (field === 'type' || field === 'value') {
      const type = field === 'type' ? val : updated[index].type;
      const value = field === 'value' ? val : updated[index].value;

      if (type === 'email') {
        updated[index].url = value ? `mailto:${value.replace('mailto:', '')}` : '';
      } else if (type === 'instagram') {
        const cleanHandle = value.replace('@', '').replace('https://www.instagram.com/', '').replace('/', '');
        updated[index].url = cleanHandle ? `https://www.instagram.com/${cleanHandle}/` : '';
      } else if (type === 'youtube') {
        if (!updated[index].url || updated[index].url.includes('youtube.com')) {
          const cleanName = value.replace('https://www.youtube.com/@', '').replace('@', '');
          updated[index].url = cleanName ? `https://www.youtube.com/@${cleanName}` : '';
        }
      } else if (type === 'whatsapp') {
        const cleanPhone = value.replace(/[^0-9]/g, '');
        updated[index].url = cleanPhone ? `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}` : '';
      }
    }

    setBioFormData((prev) => ({ ...prev, contacts: updated }));
  };

  // Avatar Photo Handler
  const handleSaveAvatar = async (newUrl: string) => {
    const updated: TeacherBioProfile = {
      ...teacherBio,
      avatarUrl: newUrl
    };
    setTeacherBio(updated);
    setIsPhotoModalOpen(false);
    try {
      await saveTeacherBioProfileToFirestore(updated);
      onAddToast('Foto Profil Diperbarui', 'Foto avatar guru berhasil diganti.', 'success');
    } catch (err) {
      console.warn('Failed to save avatar photo to Firestore:', err);
    }
  };

  // --- Handlers: Experience Modal ---
  const handleOpenAddExp = () => {
    setEditingExp(null);
    setExpFormData({
      title: '',
      institution: 'SMA IAS Jakarta',
      period: 'Pendidik Aktif',
      category: 'Pengalaman'
    });
    setIsExpModalOpen(true);
  };

  const handleOpenEditExp = (item: ProfileExperienceItem) => {
    setEditingExp(item);
    setExpFormData({
      title: item.title,
      institution: item.institution || '',
      period: item.period || '',
      category: item.category || 'Pengalaman'
    });
    setIsExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expFormData.title.trim()) {
      onAddToast('Judul Wajib Diisi', 'Mohon lengkapi judul posisi atau riwayat.', 'info');
      return;
    }

    if (editingExp) {
      const updated: ProfileExperienceItem = {
        ...editingExp,
        title: expFormData.title.trim(),
        institution: expFormData.institution.trim() || undefined,
        period: expFormData.period.trim() || undefined,
        category: expFormData.category as any,
        description: undefined,
        subItems: undefined
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
        title: expFormData.title.trim(),
        institution: expFormData.institution.trim() || undefined,
        period: expFormData.period.trim() || undefined,
        category: expFormData.category as any
      };

      setExperiences((prev) => [newItem, ...prev]);
      try {
        await saveProfileExperienceToFirestore(newItem);
        onAddToast('Riwayat Ditambahkan', `"${newItem.title}" berhasil ditambahkan.`, 'success');
      } catch (err) {
        console.warn('Firestore save error:', err);
      }
    }

    setIsExpModalOpen(false);
    setEditingExp(null);
  };

  const handleDeleteExp = async (id: string, title: string) => {
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

  const handleDuplicateExp = async (item: ProfileExperienceItem) => {
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

  const handleCopyExp = (item: ProfileExperienceItem) => {
    const lines = [
      `*${item.title}*`,
      item.institution ? `Institusi: ${item.institution}` : '',
      item.period ? `Periode: ${item.period}` : '',
      item.category ? `Kategori: ${item.category}` : ''
    ].filter(Boolean).join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(lines);
      onAddToast('Rincian Disalin', 'Teks riwayat berhasil disalin ke clipboard.', 'info');
    }
  };

  // Helper for Contact Icons
  const renderContactIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5" />;
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5" />;
      case 'tiktok':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5" />;
      case 'email':
      default:
        return <Mail className="w-3.5 h-3.5" />;
    }
  };

  const getContactBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'instagram':
        return 'bg-pink-50 text-[#E1306C] hover:text-[#E1306C] border-pink-200';
      case 'youtube':
        return 'bg-rose-50 text-[#FF0000] hover:text-[#FF0000] border-rose-200';
      case 'whatsapp':
        return 'bg-emerald-50 text-emerald-600 hover:text-emerald-700 border-emerald-200';
      case 'tiktok':
        return 'bg-purple-50 text-purple-600 hover:text-purple-700 border-purple-200';
      case 'website':
        return 'bg-cyan-50 text-cyan-600 hover:text-cyan-700 border-cyan-200';
      case 'email':
      default:
        return 'bg-[#E0F2FE] text-[#007AFF] hover:text-[#007AFF] border-[#BAE6FD]';
    }
  };

  return (
    <section id="profil" className="py-16 sm:py-20 bg-white relative border-t border-[#E2E8F0] scroll-mt-16">
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

          {/* Action Buttons (Mode Guru) */}
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => handleOpenBioModal('bio')}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-[#F0F7FF] text-[#007AFF] border border-[#BAE6FD] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="Edit Biodata, Keahlian, dan Kontak Guru"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#007AFF]" />
                <span>Edit Profil Guru</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddExp}
                className="px-4 py-2 rounded-full bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007AFF]/25 transition-transform transform hover:scale-105 cursor-pointer"
                title="Tambah Riwayat / Pengalaman Baru"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Riwayat</span>
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
            <div className="bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs relative overflow-hidden group">
              
              {/* Subtle top decoration accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#0284C7] via-[#007AFF] to-[#38BDF8]" />

              {/* Top Admin Quick Edit Pill */}
              {isAdmin && (
                <div className="mb-4 flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Mode Edit Guru</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenBioModal('bio')}
                    className="text-[11px] font-bold text-[#007AFF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Profil Lengkap</span>
                  </button>
                </div>
              )}

              {/* Avatar & Name Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-16 h-16 rounded-full bg-linear-to-br from-[#0284C7] via-[#007AFF] to-[#0369A1] p-0.5 shadow-md shadow-[#007AFF]/20 shrink-0">
                  <img
                    src={teacherBio.avatarUrl}
                    alt={teacherBio.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full bg-white"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Pendidik Aktif" />
                  
                  {/* Photo Change trigger in Admin Mode */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[9px] font-bold transition-opacity cursor-pointer"
                      title="Klik untuk ganti foto avatar guru"
                    >
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span>Foto</span>
                    </button>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-base sm:text-lg font-bold font-heading text-[#0F172A] leading-tight truncate">
                      {teacherBio.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#007AFF] font-semibold flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3 text-[#38BDF8] shrink-0" />
                    <span className="truncate">{teacherBio.title}</span>
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    {teacherBio.verifiedBadgeText || 'Pendidik Terverifikasi'}
                  </span>
                </div>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* 1. DESKRIPSI PROFIL GURU                                             */}
              {/* --------------------------------------------------------------------- */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Deskripsi Profil
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenBioModal('bio')}
                      className="text-[11px] font-semibold text-[#007AFF] hover:text-[#0056B3] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Edit Deskripsi Profil"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Deskripsi</span>
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] text-xs text-[#475569] leading-relaxed relative">
                  <p className="italic text-[#334155]">
                    &ldquo;{teacherBio.bioDescription}&rdquo;
                  </p>
                </div>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* 2. KEAHLIAN & FOKUS PEMBELAJARAN                                     */}
              {/* --------------------------------------------------------------------- */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Keahlian & Fokus Pembelajaran:
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenBioModal('skills')}
                      className="text-[11px] font-semibold text-[#007AFF] hover:text-[#0056B3] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Kelola Keahlian & Fokus Pembelajaran"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Keahlian</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {teacherBio.skillsAndFocus.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-medium shadow-2xs hover:border-[#93C5FD] transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                  {teacherBio.skillsAndFocus.length === 0 && (
                    <p className="text-xs text-[#94A3B8] italic">Belum ada daftar keahlian yang ditambahkan.</p>
                  )}
                </div>
              </div>

              {/* --------------------------------------------------------------------- */}
              {/* 3. KONTAK & KANAL EDUKASI                                             */}
              {/* --------------------------------------------------------------------- */}
              <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                    Kontak & Kanal Edukasi:
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenBioModal('contacts')}
                      className="text-[11px] font-semibold text-[#007AFF] hover:text-[#0056B3] hover:underline flex items-center gap-1 cursor-pointer"
                      title="Kelola Kontak & Kanal Edukasi"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Kontak</span>
                    </button>
                  )}
                </div>

                {teacherBio.contacts.map((contact, idx) => {
                  const badgeColor = getContactBadgeColor(contact.type);
                  return (
                    <a
                      key={contact.id || idx}
                      href={contact.url || '#'}
                      target={contact.type === 'email' ? '_self' : '_blank'}
                      rel="noreferrer"
                      className="flex items-center gap-2.5 text-xs text-[#334155] hover:text-[#007AFF] transition-colors p-2 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#93C5FD] shadow-2xs group/contact"
                    >
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${badgeColor}`}>
                        {renderContactIcon(contact.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold block truncate group-hover/contact:text-[#007AFF] transition-colors">
                          {contact.label}
                        </span>
                        {contact.value && contact.value !== contact.label && (
                          <span className="text-[10px] text-[#94A3B8] block truncate">
                            {contact.value}
                          </span>
                        )}
                      </div>
                      <ExternalLink className="w-3 h-3 text-[#CBD5E1] group-hover/contact:text-[#007AFF] transition-colors" />
                    </a>
                  );
                })}

                {teacherBio.contacts.length === 0 && (
                  <p className="text-xs text-[#94A3B8] italic">Belum ada kanal kontak yang ditambahkan.</p>
                )}
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

                    {/* Quick Admin Actions (Mode Guru) */}
                    {isAdmin && (
                      <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between text-xs sm:pl-12">
                        <button
                          type="button"
                          onClick={() => handleCopyExp(exp)}
                          className="text-[#64748B] hover:text-[#007AFF] flex items-center gap-1 text-[11px] font-medium cursor-pointer transition-colors"
                          title="Salin Info Riwayat"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin Info</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDuplicateExp(exp)}
                            className="px-2 py-0.5 rounded-md bg-white hover:bg-[#E0F2FE] text-[#007AFF] border border-[#BAE6FD] text-[10px] font-bold cursor-pointer transition-colors"
                            title="Duplikasi Riwayat Ini"
                          >
                            Duplikasi
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditExp(exp)}
                            className="p-1 rounded-md bg-white hover:bg-amber-50 text-amber-600 border border-amber-200 cursor-pointer transition-colors"
                            title="Edit Riwayat"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteExp(exp.id, exp.title)}
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
                  onClick={handleOpenAddExp}
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
      {/* MODAL 1: EDIT PROFIL GURU (DESKRIPSI, KEAHLIAN, KONTAK)                    */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isBioModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBioModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-7 border border-[#E2E8F0] z-10 max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] font-heading">
                      Edit Profil & Biodata Guru
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Perbarui deskripsi, fokus keahlian, dan saluran kontak edukasi resmi.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBioModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Nav Tabs */}
              <div className="flex items-center gap-1.5 py-3 border-b border-[#E2E8F0] shrink-0 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setBioActiveTab('bio')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    bioActiveTab === 'bio'
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1. Deskripsi Profil</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBioActiveTab('skills')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    bioActiveTab === 'skills'
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>2. Keahlian & Fokus ({bioFormData.skillsAndFocus.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBioActiveTab('contacts')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    bioActiveTab === 'contacts'
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>3. Kontak & Kanal ({bioFormData.contacts.length})</span>
                </button>
              </div>

              {/* Form Content Area */}
              <form onSubmit={handleSaveBio} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar">
                
                {/* ------------------------------------------------------------- */}
                {/* TAB 1: DESKRIPSI & BIODATA PROFIL                             */}
                {/* ------------------------------------------------------------- */}
                {bioActiveTab === 'bio' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-[#F0F7FF] border border-[#BAE6FD] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={bioFormData.avatarUrl}
                          alt="Avatar Guru"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#0F172A]">Foto Avatar Pendidik</p>
                          <p className="text-[11px] text-[#64748B]">Tampil pada kartu profil & header</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPhotoModalOpen(true)}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E0F2FE] text-[#007AFF] border border-[#BAE6FD] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Ganti Foto Avatar</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] mb-1">
                          Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bioFormData.name}
                          onChange={(e) => setBioFormData({ ...bioFormData, name: e.target.value })}
                          placeholder="Contoh: Pak Hafiz Akhyar, S.Si."
                          className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0F172A] mb-1">
                          Sub-Judul / Profesi
                        </label>
                        <input
                          type="text"
                          value={bioFormData.title}
                          onChange={(e) => setBioFormData({ ...bioFormData, title: e.target.value })}
                          placeholder="Contoh: Guru Kimia & Praktisi Lab"
                          className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">
                        Teks Badge Status
                      </label>
                      <input
                        type="text"
                        value={bioFormData.verifiedBadgeText || ''}
                        onChange={(e) => setBioFormData({ ...bioFormData, verifiedBadgeText: e.target.value })}
                        placeholder="Contoh: Pendidik Terverifikasi / Pengajar Aktif"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">
                        Deskripsi Profil / Kutipan Visi Mengajar <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={bioFormData.bioDescription}
                        onChange={(e) => setBioFormData({ ...bioFormData, bioDescription: e.target.value })}
                        placeholder="Tuliskan deskripsi ringkas, visi mengajar kimia, atau filosofi pendidikan Anda..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF] leading-relaxed"
                      />
                      <p className="text-[11px] text-[#64748B] mt-1">
                        * Teks ini akan diformat sebagai kutipan elegan pada kartu profil utama.
                      </p>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 2: KEAHLIAN & FOKUS PEMBELAJARAN                          */}
                {/* ------------------------------------------------------------- */}
                {bioActiveTab === 'skills' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                        Tambah Keahlian / Fokus Baru
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                          placeholder="Ketik topik (contoh: Kurikulum Merdeka Kimia, Analisis Spektroskopi)..."
                          className="flex-1 px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-4 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tambah</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Preset Topics */}
                    <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                        Pilihan Cepat / Rekomendasi:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'S-1 Kimia UIN Jakarta',
                          'Kimia Organik & Analitik',
                          'Instruktur Lab & K3',
                          'Modul LKPD Indikator Alami',
                          'Pembina Olimpiade Sains (OSN)',
                          'Praktikum Kimia Ramah Lingkungan',
                          'Media Belajar Digital Interaktif',
                          'Persiapan UTBK SNBT Kimia'
                        ].map((preset, pIdx) => {
                          const isAlready = bioFormData.skillsAndFocus.includes(preset);
                          return (
                            <button
                              key={pIdx}
                              type="button"
                              disabled={isAlready}
                              onClick={() => {
                                setBioFormData((prev) => ({
                                  ...prev,
                                  skillsAndFocus: [...prev.skillsAndFocus, preset]
                                }));
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                                isAlready
                                  ? 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                                  : 'bg-white hover:bg-[#E0F2FE] text-[#007AFF] border border-[#BAE6FD]'
                              }`}
                            >
                              + {preset}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Current Skills List */}
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block mb-2">
                        Daftar Keahlian Aktif ({bioFormData.skillsAndFocus.length}):
                      </span>
                      <div className="space-y-2">
                        {bioFormData.skillsAndFocus.map((skill, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#93C5FD] shadow-2xs transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#E0F2FE] text-[#007AFF] text-[10px] font-bold flex items-center justify-center">
                                {sIdx + 1}
                              </span>
                              <span className="text-xs font-semibold text-[#0F172A]">{skill}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(sIdx)}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                              title="Hapus keahlian"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {bioFormData.skillsAndFocus.length === 0 && (
                          <div className="py-8 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
                            <Sparkles className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                            <p className="text-xs text-[#64748B]">Belum ada keahlian yang tercantum.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* TAB 3: KONTAK & KANAL EDUKASI                                 */}
                {/* ------------------------------------------------------------- */}
                {bioActiveTab === 'contacts' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-[#0F172A]">Saluran Kontak & Media Sosial</p>
                        <p className="text-[11px] text-[#64748B]">Tautan resmi yang dapat diklik pengunjung</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddContact}
                        className="px-3.5 py-1.5 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Kontak</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {bioFormData.contacts.map((cnt, cIdx) => (
                        <div
                          key={cnt.id || cIdx}
                          className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 relative"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#E0F2FE] text-[#007AFF] text-[10px] font-bold flex items-center justify-center">
                                {cIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-[#0F172A]">Kanal #{cIdx + 1}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveContact(cIdx)}
                              className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                              title="Hapus kanal kontak ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                                Jenis Platform
                              </label>
                              <select
                                value={cnt.type}
                                onChange={(e) => handleContactChange(cIdx, 'type', e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF] bg-white"
                              >
                                <option value="email">Email</option>
                                <option value="instagram">Instagram</option>
                                <option value="youtube">YouTube</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="tiktok">TikTok</option>
                                <option value="website">Website / Portofolio</option>
                                <option value="phone">Nomor Telepon</option>
                                <option value="other">Kanal Lainnya</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                                Label Tampilan
                              </label>
                              <input
                                type="text"
                                value={cnt.label}
                                onChange={(e) => handleContactChange(cIdx, 'label', e.target.value)}
                                placeholder="Contoh: @kelaspakhafiz (Instagram)"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF] bg-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                                Nilai / Handle / Nomor
                              </label>
                              <input
                                type="text"
                                value={cnt.value}
                                onChange={(e) => handleContactChange(cIdx, 'value', e.target.value)}
                                placeholder="Contoh: kelaspakhafiz@gmail.com"
                                className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF] bg-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                              Tautan URL Target (https:// atau mailto:)
                            </label>
                            <input
                              type="text"
                              value={cnt.url || ''}
                              onChange={(e) => handleContactChange(cIdx, 'url', e.target.value)}
                              placeholder="Contoh: https://www.instagram.com/kelaspakhafiz/"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF] bg-white"
                            />
                          </div>
                        </div>
                      ))}

                      {bioFormData.contacts.length === 0 && (
                        <div className="py-8 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
                          <Mail className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                          <p className="text-xs text-[#64748B]">Belum ada kontak yang ditambahkan.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Modal Action Footer */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
                  <span className="text-[11px] text-[#64748B]">
                    Tersinkronisasi otomatis ke database Firestore
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBioModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan Perubahan Profil</span>
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: TAMBAH / EDIT RIWAYAT & PENGALAMAN GURU                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isExpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpModalOpen(false)}
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
                  onClick={() => setIsExpModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveExp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Judul Posisi / Pendidikan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={expFormData.title}
                    onChange={(e) => setExpFormData({ ...expFormData, title: e.target.value })}
                    placeholder="Contoh: Pengajar IPA dan Kimia SMA"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Kategori</label>
                    <select
                      value={expFormData.category}
                      onChange={(e) => setExpFormData({ ...expFormData, category: e.target.value })}
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
                      value={expFormData.period}
                      onChange={(e) => setExpFormData({ ...expFormData, period: e.target.value })}
                      placeholder="Contoh: Pendidik Aktif / 2023 - Sekarang"
                      className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Institusi / Lembaga</label>
                  <input
                    type="text"
                    value={expFormData.institution}
                    onChange={(e) => setExpFormData({ ...expFormData, institution: e.target.value })}
                    placeholder="Contoh: SMA IAS Jakarta / UIN Syarif Hidayatullah"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
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

      {/* ========================================================================= */}
      {/* MODAL 3: GANTI FOTO AVATAR GURU                                           */}
      {/* ========================================================================= */}
      <PhotoChangerModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentImageUrl={teacherBio.avatarUrl}
        itemTitle={teacherBio.name}
        modalTitle="Ganti / Upload Foto Profil Guru"
        storageFolder={STORAGE_FOLDERS.PROFILE_IMAGES}
        onSavePhoto={handleSaveAvatar}
        onAddToast={onAddToast}
      />

    </section>
  );
};
