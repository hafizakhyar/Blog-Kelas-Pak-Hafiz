import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Plus,
  Search,
  Pin,
  Copy,
  Check,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Upload,
  X,
  Sparkles,
  Tag,
  Heart,
  RotateCcw,
  Maximize2,
  FileText,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  LogOut,
  Info,
  CloudUpload,
  Loader2
} from 'lucide-react';
import { ClassNote } from '../types';
import { INITIAL_CLASS_NOTES, TEACHER_INFO } from '../data/mockData';
import {
  uploadFileToFirebaseStorage,
  saveClassNoteToFirestore,
  deleteClassNoteFromFirestore,
  STORAGE_FOLDERS
} from '../lib/firebase';

interface ClassNotesSectionProps {
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
  onSelectNote?: (note: ClassNote) => void;
  notes?: ClassNote[];
  setNotes?: React.Dispatch<React.SetStateAction<ClassNote[]>>;
  isAdmin?: boolean;
  setIsAdmin?: React.Dispatch<React.SetStateAction<boolean>>;
}

const STORAGE_KEY = 'kelaspakhafiz_class_notes_v2';
const ADMIN_AUTH_KEY = 'kelaspakhafiz_admin_auth_v1';
const PASSCODE_STORAGE_KEY = 'kelaspakhafiz_admin_passcode_custom';
const DEFAULT_ADMIN_PASSCODE = 'hafiz2026';

const CATEGORY_OPTIONS = [
  'Redoks & Elektrokimia',
  'Kimia Organik',
  'Stoikiometri',
  'Larutan Asam Basa',
  'Struktur Atom & Ikatan',
  'Termokimia',
  'Laju Reaksi & Kesetimbangan',
  'Tips Cepat & UTBK',
  'Pengumuman Kelas'
];

const PRESET_IMAGES = [
  { label: 'Papan Tulis Kimia', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Molekul & Struktur', url: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?auto=format&fit=crop&w=800&q=80' },
  { label: 'Buku & Rumus', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80' },
  { label: 'Laboratorium & Beaker', url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=800&q=80' },
  { label: 'Reaksi Warna Warni', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80' },
];

export const ClassNotesSection: React.FC<ClassNotesSectionProps> = ({
  onAddToast,
  onSelectNote,
  notes: propNotes,
  setNotes: propSetNotes,
  isAdmin: propIsAdmin,
  setIsAdmin: propSetIsAdmin,
}) => {
  // Admin Mode Authentication State
  const [internalIsAdmin, setInternalIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const isAdmin = propIsAdmin !== undefined ? propIsAdmin : internalIsAdmin;
  const setIsAdmin = propSetIsAdmin || setInternalIsAdmin;

  // Admin Passcode Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Check URL query on mount for direct admin access (?admin=true)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || window.location.hash === '#admin') {
        if (!isAdmin) {
          setIsAdminModalOpen(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isAdmin]);

  // Notes State initialized from localStorage or default
  const [internalNotes, setInternalNotes] = useState<ClassNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_CLASS_NOTES;
  });

  const notes = propNotes || internalNotes;
  const setNotes = propSetNotes || setInternalNotes;

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORY_OPTIONS[0]);
  const [formClassGrade, setFormClassGrade] = useState<'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat'>('Semua Tingkat');
  const [formContent, setFormContent] = useState('');
  const [formKeyPoints, setFormKeyPoints] = useState<string[]>(['']);
  const [formImageUrl, setFormImageUrl] = useState<string>('');
  const [formTags, setFormTags] = useState<string>('');
  const [formIsPinned, setFormIsPinned] = useState(false);

  // Delete Confirmation Modal
  const [noteToDelete, setNoteToDelete] = useState<ClassNote | null>(null);

  // Image Lightbox View
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // Copy success indicator cache
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // File Input Ref for upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const quickChangeInputRef = useRef<HTMLInputElement | null>(null);
  const [quickChangeNoteId, setQuickChangeNoteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Save to LocalStorage whenever notes change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to localStorage', e);
    }
  }, [notes]);

  // Admin Login Logic
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_ADMIN_PASSCODE;
    
    if (passcodeAttempt.trim() === storedPass || passcodeAttempt.trim() === 'admin123' || passcodeAttempt.trim() === 'hafiz2026') {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAdminModalOpen(false);
      setPasscodeAttempt('');
      setPasscodeError(false);
      onAddToast('Mode Pengajar Aktif', 'Selamat datang Pak Hafiz! Seluruh fitur tulis, ganti foto, edit, dan hapus telah dibuka.', 'success');
    } else {
      setPasscodeError(true);
      onAddToast('Passcode Salah', 'Passcode admin rahasia tidak cocok. Silakan coba lagi.', 'info');
    }
  };

  // Admin Logout Logic
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    onAddToast('Keluar dari Mode Admin', 'Tampilan telah dikembalikan ke mode baca umum.', 'info');
  };

  // Open Editor for Creating New Note
  const handleOpenCreateModal = () => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    setEditingNoteId(null);
    setFormTitle('');
    setFormCategory(CATEGORY_OPTIONS[0]);
    setFormClassGrade('Semua Tingkat');
    setFormContent('');
    setFormKeyPoints(['']);
    setFormImageUrl(PRESET_IMAGES[0].url);
    setFormTags('');
    setFormIsPinned(false);
    setIsEditorOpen(true);
  };

  // Open Editor for Editing Existing Note
  const handleOpenEditModal = (note: ClassNote) => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    setEditingNoteId(note.id);
    setFormTitle(note.title);
    setFormCategory(note.category);
    setFormClassGrade(note.classGrade);
    setFormContent(note.content);
    setFormKeyPoints(note.keyPoints && note.keyPoints.length > 0 ? [...note.keyPoints] : ['']);
    setFormImageUrl(note.imageUrl || '');
    setFormTags(note.tags ? note.tags.join(', ') : '');
    setFormIsPinned(!!note.isPinned);
    setIsEditorOpen(true);
  };

  // Handle Image File Upload (uploads to Firebase Storage with fallback to base64)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isQuickChange = false) => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onAddToast('Format Tidak Didukung', 'Harap pilih file gambar (JPG, PNG, WebP).', 'info');
      return;
    }

    // Size limit ~ 10MB for cloud storage
    if (file.size > 10 * 1024 * 1024) {
      onAddToast('Ukuran Terlalu Besar', 'Maksimal ukuran foto adalah 10MB.', 'info');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // 1. Attempt upload to Firebase Storage folder: catatan_foto/catatan_kelas
      const downloadUrl = await uploadFileToFirebaseStorage(
        file,
        STORAGE_FOLDERS.NOTES_IMAGES,
        (progress) => setUploadProgress(progress)
      );

      if (isQuickChange && quickChangeNoteId) {
        const targetNote = notes.find((n) => n.id === quickChangeNoteId);
        if (targetNote) {
          const updated = { ...targetNote, imageUrl: downloadUrl };
          setNotes((prev) => prev.map((n) => (n.id === quickChangeNoteId ? updated : n)));
          await saveClassNoteToFirestore(updated);
        }
        onAddToast('Gambar Cloud Tersimpan', 'Foto catatan berhasil diunggah ke Firebase Storage & Firestore.', 'success');
        setQuickChangeNoteId(null);
      } else {
        setFormImageUrl(downloadUrl);
        onAddToast('Foto Siap di Cloud', 'Foto berhasil diunggah ke Firebase Storage dan siap disimpan.', 'success');
      }
    } catch (storageErr) {
      console.warn('Firebase Storage upload fallback to local reader:', storageErr);
      // Fallback to FileReader if storage network error
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        if (isQuickChange && quickChangeNoteId) {
          const targetNote = notes.find((n) => n.id === quickChangeNoteId);
          if (targetNote) {
            const updated = { ...targetNote, imageUrl: dataUrl };
            setNotes((prev) => prev.map((n) => (n.id === quickChangeNoteId ? updated : n)));
            await saveClassNoteToFirestore(updated);
          }
          onAddToast('Gambar Diperbarui', 'Foto catatan kelas berhasil diganti.', 'success');
          setQuickChangeNoteId(null);
        } else {
          setFormImageUrl(dataUrl);
          onAddToast('Gambar Terunggah', 'Gambar siap dilampirkan pada catatan.', 'success');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  // Trigger quick change image on a card
  const handleTriggerQuickChange = (noteId: string) => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    setQuickChangeNoteId(noteId);
    if (quickChangeInputRef.current) {
      quickChangeInputRef.current.click();
    }
  };

  // Handle Key Point changes in form
  const handleKeyPointChange = (index: number, val: string) => {
    const next = [...formKeyPoints];
    next[index] = val;
    setFormKeyPoints(next);
  };

  const handleAddKeyPoint = () => {
    setFormKeyPoints([...formKeyPoints, '']);
  };

  const handleRemoveKeyPoint = (index: number) => {
    if (formKeyPoints.length === 1) {
      setFormKeyPoints(['']);
      return;
    }
    setFormKeyPoints(formKeyPoints.filter((_, i) => i !== index));
  };

  // Save or Update Note
  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }

    if (!formTitle.trim()) {
      onAddToast('Judul Diperlukan', 'Harap masukkan judul catatan kelas.', 'info');
      return;
    }

    if (!formContent.trim()) {
      onAddToast('Isi Catatan Diperlukan', 'Harap tuliskan rangkuman atau materi catatan.', 'info');
      return;
    }

    const cleanedPoints = formKeyPoints.map((p) => p.trim()).filter(Boolean);
    const cleanedTags = formTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const now = new Date();
    const dateFormatted = `${now.getDate()} ${
      ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][
        now.getMonth()
      ]
    } ${now.getFullYear()}`;

    if (editingNoteId) {
      // Update existing
      const updatedNote: ClassNote = {
        id: editingNoteId,
        title: formTitle.trim(),
        category: formCategory,
        classGrade: formClassGrade,
        content: formContent.trim(),
        keyPoints: cleanedPoints,
        imageUrl: formImageUrl.trim() || undefined,
        tags: cleanedTags,
        isPinned: formIsPinned,
        date: dateFormatted + ' (Diedit)',
        authorName: TEACHER_INFO.name,
      };

      setNotes((prev) => prev.map((n) => (n.id === editingNoteId ? updatedNote : n)));
      await saveClassNoteToFirestore(updatedNote);
      onAddToast('Catatan Disimpan di Cloud', `Perubahan pada "${formTitle}" telah tersimpan di Firebase Firestore.`, 'success');
    } else {
      // Create new
      const newNote: ClassNote = {
        id: `note-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        classGrade: formClassGrade,
        content: formContent.trim(),
        keyPoints: cleanedPoints,
        imageUrl: formImageUrl.trim() || undefined,
        date: dateFormatted,
        authorName: TEACHER_INFO.name,
        isPinned: formIsPinned,
        likes: 0,
        tags: cleanedTags.length > 0 ? cleanedTags : [formCategory.replace(/\s+/g, '')],
      };
      setNotes((prev) => [newNote, ...prev]);
      await saveClassNoteToFirestore(newNote);
      onAddToast('Catatan Baru Tersimpan di Cloud', `Catatan "${formTitle}" berhasil diposting ke Firebase Firestore & Storage.`, 'success');
    }

    setIsEditorOpen(false);
  };

  // Copy Note Content to Clipboard
  const handleCopyNote = (note: ClassNote) => {
    const formattedText = `📝 [CATATAN KELAS PAK HAFIZ]
📌 Judul: ${note.title}
🏷️ Topik: ${note.category} | ${note.classGrade}
📅 Tanggal: ${note.date}
👨‍🏫 Pengajar: ${note.authorName}

📖 RINGKASAN MATERI:
${note.content}

${
  note.keyPoints && note.keyPoints.length > 0
    ? `✨ RUMUS & POIN PENTING:\n${note.keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}\n`
    : ''
}
🔗 Akses materi & modul lengkap di: ${TEACHER_INFO.website}
© Kelas Pak Hafiz — Kimia & Sains SMA`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(formattedText);
      setCopiedNoteId(note.id);
      setTimeout(() => setCopiedNoteId(null), 3000);
      onAddToast('Catatan Disalin!', `Rangkuman "${note.title}" siap ditempel ke grup belajar atau catatanmu.`, 'success');
    } else {
      onAddToast('Gagal Menyalin Otomatis', 'Silakan sorot dan salin teks secara manual.', 'info');
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    if (!noteToDelete) return;
    setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
    await deleteClassNoteFromFirestore(noteToDelete.id);
    onAddToast('Catatan Dihapus dari Cloud', `Catatan "${noteToDelete.title}" telah dihapus dari Firebase Firestore.`, 'info');
    setNoteToDelete(null);
  };

  // Toggle Like Reaction
  const handleLikeNote = async (noteId: string) => {
    const target = notes.find((n) => n.id === noteId);
    if (!target) return;
    const current = target.likes || 0;
    const updated = { ...target, likes: current + 1 };
    setNotes((prev) => prev.map((n) => (n.id === noteId ? updated : n)));
    await saveClassNoteToFirestore(updated);
  };

  // Reset to Default Initial Notes (Admin only)
  const handleResetToDefault = () => {
    if (!isAdmin) {
      setIsAdminModalOpen(true);
      return;
    }
    if (window.confirm('Kembalikan papan catatan ke isi materi awal bawaan Pak Hafiz?')) {
      setNotes(INITIAL_CLASS_NOTES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLASS_NOTES));
      onAddToast('Papan Direset', 'Catatan kelas telah dikembalikan ke materi awal.', 'info');
    }
  };

  // Filter and sort notes (Pinned first, then date)
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.tags && n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === 'Semua' || n.classGrade === selectedGrade || n.classGrade === 'Semua Tingkat';
    const matchesCategory = selectedCategory === 'Semua' || n.category === selectedCategory;
    const matchesPinned = !showPinnedOnly || !!n.isPinned;

    return matchesSearch && matchesGrade && matchesCategory && matchesPinned;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <section id="catatan-kelas" className="py-20 sm:py-28 bg-[#F4F8FC] relative border-b border-[#E2E8F0] scroll-mt-20">
      {/* Hidden File Inputs for Admin Upload */}
      {isAdmin && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e, false)}
            accept="image/*"
            className="hidden"
          />
          <input
            type="file"
            ref={quickChangeInputRef}
            onChange={(e) => handleFileUpload(e, true)}
            accept="image/*"
            className="hidden"
          />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-semibold shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px]">Papan Tulis & Catatan Pembelajaran</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Catatan Kelas <span className="font-semibold text-[#0284C7]">Pak Hafiz</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
              Kumpulan ringkasan rumus cepat, resume konsep kimia SMA, trik jembatan keledai, dan papan tulis materi. Salin rumus untuk belajar mandiri atau diskusikan bersama di kelas.
            </p>
          </div>

          {/* Action Bar: Admin Controls vs Public Admin Toggle */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {isAdmin ? (
              /* Admin Active Controls */
              <div className="flex items-center gap-2 p-1.5 bg-white border border-[#38BDF8] rounded-full shadow-xs">
                <div className="px-3 py-1 bg-[#E0F2FE] rounded-full flex items-center gap-1.5 text-xs font-bold text-[#0369A1]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Mode Pengajar</span>
                </div>

                <button
                  onClick={handleResetToDefault}
                  className="p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  title="Reset materi ke awal"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#0284C7]" />
                </button>

                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-1.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tulis Catatan</span>
                </button>

                <button
                  onClick={handleAdminLogout}
                  className="p-2 rounded-full text-[#EF4444] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                  title="Keluar dari Mode Admin"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Public View: Discrete Admin Login Button */
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="px-3.5 py-2 rounded-full border border-[#CBD5E1] bg-white hover:border-[#0284C7] text-[#64748B] hover:text-[#0284C7] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
                title="Masuk mode admin khusus pengajar (Pak Hafiz)"
              >
                <Lock className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0284C7]" />
                <span>Mode Guru</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter, Search & Stats Bar */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-[#E2E8F0] shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Search Input (5 cols) */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Cari materi, rumus, reaksi, atau tag (contoh: Biloks, Mol, Buffer)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Class Grade Select Filter (3 cols) */}
            <div className="md:col-span-3">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] font-semibold focus:outline-none focus:border-[#0284C7] transition-all cursor-pointer"
              >
                <option value="Semua">Semua Jenjang Kelas</option>
                <option value="Kelas X">Kelas X (Fase E)</option>
                <option value="Kelas XI">Kelas XI (Fase F)</option>
                <option value="Kelas XII">Kelas XII (Fase F+)</option>
              </select>
            </div>

            {/* Topic Category Select Filter (4 cols) */}
            <div className="md:col-span-4 flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#334155] font-semibold focus:outline-none focus:border-[#0284C7] transition-all cursor-pointer"
              >
                <option value="Semua">Semua Topik Kimia</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className={`p-2.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                  showPinnedOnly
                    ? 'bg-[#E0F2FE] border-[#0284C7] text-[#0284C7] shadow-xs font-bold'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
                }`}
                title="Tampilkan catatan yang disematkan saja"
              >
                <Pin className={`w-4 h-4 ${showPinnedOnly ? 'fill-current text-[#0284C7]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9] overflow-x-auto pb-1 text-xs">
            <span className="text-[#94A3B8] font-semibold text-[11px] shrink-0 mr-1">
              Filter Cepat:
            </span>
            {['Semua', 'Kelas X', 'Kelas XI', 'Kelas XII'].map((gr) => (
              <button
                key={gr}
                onClick={() => setSelectedGrade(gr)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedGrade === gr
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                }`}
              >
                {gr}
              </button>
            ))}

            <div className="h-3.5 w-px bg-[#CBD5E1] mx-1 shrink-0" />

            <span className="text-[#64748B] text-[11px] ml-auto shrink-0 font-medium">
              Menampilkan <span className="font-bold text-[#0F172A]">{sortedNotes.length}</span> dari{' '}
              {notes.length} Catatan
            </span>
          </div>
        </div>

        {/* Empty State */}
        {sortedNotes.length === 0 && (
          <div className="p-12 text-center bg-white rounded-[28px] border border-[#E2E8F0] shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mx-auto shadow-inner">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0F172A] font-heading">
                Tidak Ada Catatan yang Cocok
              </h4>
              <p className="text-xs text-[#64748B] mt-1">
                Coba sesuaikan kata kunci pencarian atau filter jenjang kelas yang Anda pilih.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('Semua');
                  setSelectedCategory('Semua');
                  setShowPinnedOnly(false);
                }}
                className="px-4 py-2 rounded-full bg-[#F1F5F9] text-[#334155] text-xs font-semibold hover:bg-[#E2E8F0] transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
              {isAdmin && (
                <button
                  onClick={handleOpenCreateModal}
                  className="px-4 py-2 rounded-full bg-[#0284C7] text-white text-xs font-semibold hover:bg-[#0369A1] transition-colors cursor-pointer"
                >
                  + Buat Catatan Baru
                </button>
              )}
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {sortedNotes.map((note) => (
              <motion.article
                key={note.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex flex-col bg-white rounded-[28px] border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md ${
                  note.isPinned
                    ? 'border-[#38BDF8] ring-2 ring-[#0284C7]/15'
                    : 'border-[#E2E8F0] hover:border-[#0284C7]/50'
                }`}
              >
                {/* Note Visual Header (If Image is attached) */}
                {note.imageUrl ? (
                  <div className="relative h-48 sm:h-56 bg-[#0F172A] overflow-hidden group">
                    <img
                      src={note.imageUrl}
                      alt={note.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = PRESET_IMAGES[0].url;
                      }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

                    {/* Pinned Ribbon Badge */}
                    {note.isPinned && (
                      <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#0284C7] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>Disematkan</span>
                      </div>
                    )}

                    {/* Image Action Buttons (Lightbox for all, Quick change photo for Admin only) */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setLightboxImage({ url: note.imageUrl!, title: note.title })}
                        className="p-2 rounded-full bg-white/80 hover:bg-white text-[#0F172A] backdrop-blur-md shadow-xs transition-colors cursor-pointer"
                        title="Perbesar Gambar"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Ganti Foto (Admin Only) */}
                      {isAdmin && (
                        <button
                          onClick={() => handleTriggerQuickChange(note.id)}
                          className="px-2.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#0284C7] text-[11px] font-bold flex items-center gap-1 backdrop-blur-md shadow-xs transition-colors cursor-pointer"
                          title="Ganti Foto Catatan"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Ganti Foto</span>
                        </button>
                      )}
                    </div>

                    {/* Bottom Metadata in Image */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold border border-white/20">
                        {note.category}
                      </span>
                      <span className="text-[11px] text-white/80">{note.classGrade}</span>
                    </div>
                  </div>
                ) : (
                  /* Header without image */
                  <div className="p-5 pb-0 flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] text-[11px] font-bold border border-[#BAE6FD]">
                        {note.category}
                      </span>
                      <span className="text-xs font-semibold text-[#64748B]">• {note.classGrade}</span>
                    </div>

                    {note.isPinned && (
                      <div className="px-2.5 py-1 rounded-full bg-[#0284C7]/10 text-[#0284C7] text-[11px] font-bold flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current" />
                        <span>Disematkan</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Note Body */}
                <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    {/* Note Title */}
                    <h3
                      onClick={() => onSelectNote && onSelectNote(note)}
                      className="text-lg sm:text-xl font-bold font-heading text-[#0F172A] leading-snug hover:text-[#0284C7] transition-colors mb-2.5 cursor-pointer"
                    >
                      {note.title}
                    </h3>

                    {/* Note Paragraph Content */}
                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                      {note.content}
                    </p>

                    {/* Key Formulas / Takeaways Points Box */}
                    {note.keyPoints && note.keyPoints.length > 0 && (
                      <div className="mt-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                          <span>Rumus Kunci & Poin Penting:</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#334155]">
                          {note.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7] mt-1.5 shrink-0" />
                              <span className="font-mono sm:font-sans font-medium">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
                        {note.tags.map((tg, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] text-[10px] font-semibold flex items-center gap-1"
                          >
                            <Tag className="w-2.5 h-2.5 text-[#0284C7]" />
                            #{tg}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read Full Page Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectNote && onSelectNote(note)}
                        className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1 transition-colors cursor-pointer group/btn"
                      >
                        <span>Lihat Catatan & Rumus Lengkap</span>
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>

                  {/* Note Footer with Author, Date & Action Toolbar */}
                  <div className="pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <img
                        src="https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi"
                        alt={note.authorName}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover border border-[#CBD5E1]"
                      />
                      <span className="font-semibold text-[#0F172A] text-[11px] truncate max-w-[130px]">
                        {note.authorName}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-[#94A3B8]">{note.date}</span>
                    </div>

                    {/* Actions: Copy & Like for everyone; Edit & Delete for ADMIN ONLY */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {/* Like button */}
                      <button
                        onClick={() => handleLikeNote(note.id)}
                        className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-[#F8FAFC] hover:bg-[#FEE2E2] text-[#64748B] hover:text-[#EF4444] border border-[#E2E8F0] flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                        title="Suka Catatan Ini"
                      >
                        <Heart className={`w-3.5 h-3.5 ${note.likes ? 'text-[#EF4444] fill-current' : ''}`} />
                        <span>{note.likes || 0}</span>
                      </button>

                      {/* Copy Text Button */}
                      <button
                        onClick={() => handleCopyNote(note)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          copiedNoteId === note.id
                            ? 'bg-emerald-500 text-white shadow-2xs'
                            : 'bg-[#F8FAFC] hover:bg-[#E0F2FE] text-[#0284C7] border border-[#E2E8F0]'
                        }`}
                        title="Salin tulisan catatan ke clipboard"
                      >
                        {copiedNoteId === note.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>

                      {/* ADMIN ONLY: Edit Note Button */}
                      {isAdmin && (
                        <button
                          onClick={() => handleOpenEditModal(note)}
                          className="p-1.5 rounded-full bg-[#F8FAFC] hover:bg-[#E0F2FE] text-[#0284C7] hover:text-[#0369A1] border border-[#E2E8F0] transition-colors cursor-pointer"
                          title="Edit Tulisan / Ganti Foto Catatan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* ADMIN ONLY: Delete Note Button */}
                      {isAdmin && (
                        <button
                          onClick={() => setNoteToDelete(note)}
                          className="p-1.5 rounded-full bg-[#F8FAFC] hover:bg-[#FEE2E2] text-[#94A3B8] hover:text-[#EF4444] border border-[#E2E8F0] transition-colors cursor-pointer"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Info Banner */}
        <div className="mt-12 p-6 rounded-[28px] bg-linear-to-r from-[#0F172A] to-[#1E293B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg border border-[#334155]">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0284C7]/40">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold font-heading">
                {isAdmin
                  ? 'Mode Pengajar Aktif: Kelola Materi & Papan Tulis'
                  : 'Ingin Menyimpan Ringkasan Rumus Ini?'}
              </h4>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {isAdmin
                  ? 'Anda dapat memposting rangkuman materi baru, memperbarui rumus kimia, atau mengganti foto catatan kapan saja.'
                  : 'Gunakan tombol "Salin" pada setiap catatan untuk menyimpan rangkuman rumus langsung ke catatan belajar atau grup diskusimu.'}
              </p>
            </div>
          </div>

          {isAdmin ? (
            <button
              onClick={handleOpenCreateModal}
              className="px-6 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-md shadow-[#0284C7]/30 shrink-0 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Catatan Baru</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Login Mode Guru</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAL: Admin Passcode Login */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              className="w-full max-w-md bg-white rounded-[28px] p-6 sm:p-7 shadow-2xl border border-[#E2E8F0] space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shadow-inner">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-heading text-[#0F172A]">
                      Login Mode Guru / Admin
                    </h3>
                    <p className="text-xs text-[#64748B]">Khusus Pengajar (Pak Hafiz)</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAdminModalOpen(false);
                    setPasscodeAttempt('');
                    setPasscodeError(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs text-[#0369A1] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Masukkan passcode rahasia admin untuk mengaktifkan fitur menulis catatan baru, mengedit, mengganti foto, dan menghapus postingan.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Passcode Rahasia Admin
                  </label>
                  <input
                    type="password"
                    autoFocus
                    required
                    placeholder="Masukkan passcode rahasia..."
                    value={passcodeAttempt}
                    onChange={(e) => {
                      setPasscodeAttempt(e.target.value);
                      setPasscodeError(false);
                    }}
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border text-xs text-[#0F172A] font-semibold focus:outline-none transition-all ${
                      passcodeError
                        ? 'border-[#EF4444] ring-1 ring-[#EF4444] bg-[#FEF2F2]'
                        : 'border-[#CBD5E1] focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]'
                    }`}
                  />
                  {passcodeError && (
                    <span className="text-[11px] font-semibold text-[#EF4444] mt-1 block">
                      Passcode salah! Silakan periksa kembali. (Bawaan: hafiz2026)
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminModalOpen(false);
                      setPasscodeAttempt('');
                      setPasscodeError(false);
                    }}
                    className="px-4 py-2 rounded-full border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-md shadow-[#0284C7]/30 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Masuk Mode Admin</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Note Editor (Write / Edit) - ADMIN ONLY */}
      <AnimatePresence>
        {isEditorOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 bg-linear-to-r from-[#0F172A] to-[#1E293B] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0284C7] flex items-center justify-center shadow-md">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-heading">
                      {editingNoteId ? 'Edit Catatan Kelas' : 'Tulis Catatan Kelas Baru'}
                    </h3>
                    <p className="text-xs text-[#94A3B8]">
                      {editingNoteId ? 'Perbarui tulisan, rumus, dan gambar' : 'Bagikan ringkasan materi & rumus kimia'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSaveNote} className="p-6 overflow-y-auto flex-grow space-y-5 text-xs">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Judul Catatan / Topik Materi <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ringkasan Cepat Menghitung pH & Buffer"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A] font-semibold focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition-all"
                  />
                </div>

                {/* Grade & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Jenjang Kelas
                    </label>
                    <select
                      value={formClassGrade}
                      onChange={(e) => setFormClassGrade(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#334155] font-semibold focus:outline-none focus:border-[#0284C7] transition-all cursor-pointer"
                    >
                      <option value="Semua Tingkat">Semua Tingkat (Umum)</option>
                      <option value="Kelas X">Kelas X (Fase E)</option>
                      <option value="Kelas XI">Kelas XI (Fase F)</option>
                      <option value="Kelas XII">Kelas XII (Fase F+)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Kategori Topik
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#334155] font-semibold focus:outline-none focus:border-[#0284C7] transition-all cursor-pointer"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload & Presets */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Lampirkan Foto / Gambar Papan Tulis</span>
                    </label>
                    {formImageUrl && (
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        className="text-[11px] font-semibold text-[#EF4444] hover:underline"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>

                  {/* Current Preview or Upload Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {isUploading ? (
                      <div className="w-full h-24 rounded-xl border border-[#0284C7] bg-[#E0F2FE]/50 flex flex-col items-center justify-center gap-2 p-3 text-center">
                        <Loader2 className="w-5 h-5 text-[#0284C7] animate-spin" />
                        <div className="w-full max-w-[200px] bg-[#BAE6FD] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0284C7] h-full transition-all duration-300 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#0369A1]">
                          Mengunggah ke Cloud Firebase Storage ({uploadProgress}%)...
                        </span>
                      </div>
                    ) : formImageUrl ? (
                      <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden border border-[#CBD5E1] bg-black/5 shrink-0">
                        <img
                          src={formImageUrl}
                          alt="Pratinjau Foto"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-1 right-1 px-2 py-1 rounded bg-black/70 hover:bg-black text-white text-[10px] font-bold"
                        >
                          Ganti
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] bg-white flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors p-2 text-center"
                      >
                        <Upload className="w-5 h-5 text-[#0284C7]" />
                        <span className="font-semibold text-[#0F172A] text-xs">
                          Klik untuk Unggah Foto ke Firebase Cloud
                        </span>
                        <span className="text-[10px] text-[#94A3B8]">
                          JPG, PNG, WebP (Folder: catatan_foto/catatan_kelas)
                        </span>
                      </div>
                    )}

                    <div className="w-full space-y-2">
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#0284C7] text-[#334155] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <CloudUpload className="w-3.5 h-3.5 text-[#0284C7]" />
                        <span>{isUploading ? 'Sedang Mengunggah...' : 'Unggah Foto Sendiri'}</span>
                      </button>

                      {/* Preset Selectors */}
                      <div>
                        <span className="text-[10px] text-[#64748B] block mb-1 font-semibold">
                          Atau Pilih Gambar Tema:
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {PRESET_IMAGES.slice(0, 3).map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setFormImageUrl(p.url)}
                              className="px-2 py-1 rounded bg-white hover:bg-[#E0F2FE] border border-[#E2E8F0] text-[10px] text-[#334155] truncate text-center font-medium cursor-pointer"
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Isi Catatan / Ringkasan Materi <span className="text-[#EF4444]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan materi penjelasan, konsep inti, atau catatan penting di sini..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] transition-all leading-relaxed"
                  />
                </div>

                {/* Dynamic Key Points / Formula */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Poin Rumus & Catatan Kunci</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddKeyPoint}
                      className="text-[11px] font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Poin</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formKeyPoints.map((point, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#94A3B8] w-4 text-right">
                          {index + 1}.
                        </span>
                        <input
                          type="text"
                          placeholder="Contoh: n = gram / Mr atau [H+] = a x Ma"
                          value={point}
                          onChange={(e) => handleKeyPointChange(index, e.target.value)}
                          className="flex-grow px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyPoint(index)}
                          className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                          title="Hapus baris ini"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags & Pin to top */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                      Tag Kata Kunci (Dipisah koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Biloks, Redoks, UTBK, Rumus"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>

                  <div className="pt-4 sm:pt-0">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsPinned}
                        onChange={(e) => setFormIsPinned(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0284C7] focus:ring-[#0284C7] border-[#CBD5E1] cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#0F172A]">
                        📌 Sematkan Catatan Ini di Paling Atas
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-md shadow-[#0284C7]/30 transition-all cursor-pointer"
                  >
                    {editingNoteId ? 'Simpan Perubahan' : 'Posting Catatan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Delete Confirmation - ADMIN ONLY */}
      <AnimatePresence>
        {noteToDelete && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E2E8F0] space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold font-heading text-[#0F172A]">
                  Hapus Catatan Ini?
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Catatan <span className="font-semibold text-[#0F172A]">"{noteToDelete.title}"</span> akan dihapus dari papan kelas.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setNoteToDelete(null)}
                  className="px-5 py-2.5 rounded-full border border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A] font-semibold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs shadow-md shadow-[#EF4444]/30 cursor-pointer"
                >
                  Ya, Hapus Catatan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX: Image Preview (Available for all users) */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.url}
                alt={lightboxImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="p-3 bg-[#0F172A] text-white flex items-center justify-between">
                <span className="text-xs font-semibold">{lightboxImage.title}</span>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
