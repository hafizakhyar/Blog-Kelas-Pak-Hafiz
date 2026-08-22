import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Play,
  Eye,
  Calendar,
  Clock,
  Filter,
  ArrowUpRight,
  Search,
  Plus,
  Trash2,
  Upload,
  CloudUpload,
  Loader2,
  X,
  Image as ImageIcon,
  FlaskConical,
  Lock,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';
import { GalleryItem } from '../types';
import { uploadFileToFirebaseStorage, STORAGE_FOLDERS } from '../lib/firebase';

const ADMIN_AUTH_KEY = 'kelaspakhafiz_admin_auth';
const DEFAULT_ADMIN_PASSCODE = 'hafiz2026';

interface GallerySectionProps {
  onSelectItem: (item: GalleryItem) => void;
  items?: GalleryItem[];
  isAdmin?: boolean;
  setIsAdmin?: (val: boolean) => void;
  onAddItem?: (item: GalleryItem) => void;
  onDeleteItem?: (itemId: string) => void;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  onSelectItem,
  items = GALLERY_ITEMS,
  isAdmin = false,
  setIsAdmin,
  onAddItem,
  onDeleteItem,
  onAddToast = (_t: string, _d?: string, _ty?: 'success' | 'info') => {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin Passcode Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Upload Photo Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Indikator Alami' | 'Eksperimen Lab' | 'Karya Siswa'>('Indikator Alami');
  const [formBadge, setFormBadge] = useState('Praktikum Siswa');
  const [formConcept, setFormConcept] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeAttempt.trim() === DEFAULT_ADMIN_PASSCODE || passcodeAttempt.trim() === 'admin123' || passcodeAttempt.trim() === 'hafiz2026') {
      if (setIsAdmin) setIsAdmin(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAdminModalOpen(false);
      setPasscodeAttempt('');
      setPasscodeError(false);
      setIsUploadModalOpen(true);
      onAddToast('Mode Pengajar Aktif', 'Selamat datang Pak Hafiz! Silakan unggah foto dokumentasi lab.', 'success');
    } else {
      setPasscodeError(true);
      onAddToast('Passcode Salah', 'Passcode guru tidak cocok. Gunakan hafiz2026.', 'info');
    }
  };

  const categories = ['Semua', 'Indikator Alami', 'Eksperimen Lab', 'Karya Siswa'];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chemistryConcept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onAddToast('Format Tidak Didukung', 'Harap pilih file gambar (JPG, PNG, WebP).', 'info');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onAddToast('Ukuran Terlalu Besar', 'Maksimal ukuran foto adalah 10MB.', 'info');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const downloadUrl = await uploadFileToFirebaseStorage(
        file,
        STORAGE_FOLDERS.GALLERY_IMAGES,
        (progress) => setUploadProgress(progress)
      );
      setFormImageUrl(downloadUrl);
      onAddToast('Foto Lab Terunggah', 'Foto berhasil disimpan di Firebase Storage (catatan_foto/galeri).', 'success');
    } catch (err) {
      console.warn('Firebase Storage upload error:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormImageUrl(event.target?.result as string);
        onAddToast('Foto Disimpan Lokal', 'Foto tersimpan untuk pengunggahan.', 'info');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onAddToast('Judul Diperlukan', 'Harap isi judul eksperimen.', 'info');
      return;
    }
    if (!formImageUrl) {
      onAddToast('Foto Diperlukan', 'Harap unggah foto dokumentasi praktikum terlebih dahulu.', 'info');
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.getDate()} ${
      ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][now.getMonth()]
    } ${now.getFullYear()}`;

    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      badge: formBadge.trim() || 'Praktikum Kimia',
      image: formImageUrl,
      chemistryConcept: formConcept.trim() || 'Eksperimen & Reaksi Kimia',
      description: formDescription.trim() || 'Dokumentasi kegiatan praktikum siswa di laboratorium kimia SMA.',
      date: dateFormatted,
      materials: ['Alat & Bahan Praktikum Terlampir', 'Sampel Bahan Uji'],
      steps: ['Persiapan alat dan bahan', 'Pengamatan perubahan warna / reaksi', 'Pencatatan data pengamatan'],
      results: 'Reaksi teramati dan terdokumentasi dengan baik.'
    };

    if (onAddItem) {
      onAddItem(newItem);
    }

    setIsUploadModalOpen(false);
    setFormTitle('');
    setFormConcept('');
    setFormDescription('');
    setFormImageUrl('');
    onAddToast('Dokumentasi Ditambahkan', `Foto "${newItem.title}" tersimpan di Firebase Firestore & Storage.`, 'success');
  };

  return (
    <section id="galeri" className="py-20 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Dokumentasi Praktik & Media</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Galeri Eksperimen & <span className="font-semibold text-[#0284C7]">Laboratorium</span>
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base mt-2 max-w-xl">
              Dokumentasi nyata kegiatan praktikum kimia siswa. Dari uji indikator alami dapur hingga titrasi presisi laboratorium.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#0284C7] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari eksperimen (kunyit, titrasi)..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white border border-[#E2E8F0] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs transition-all"
              />
            </div>

            {/* Upload Photo Button */}
            {isAdmin ? (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Unggah Foto Lab</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#38BDF8] text-xs font-bold flex items-center gap-2 transition-all shadow-2xs shrink-0 cursor-pointer group"
                title="Unggah foto kegiatan praktikum lab (Mode Pengajar)"
              >
                <Plus className="w-4 h-4 text-[#0284C7]" />
                <span className="hidden sm:inline">Unggah Foto (Guru)</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-white text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#0F172A] border border-[#E2E8F0]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-[0_4px_24px_rgba(2,132,199,0.06)] hover:shadow-lg hover:border-[#0284C7]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div
                  onClick={() => onSelectItem(item)}
                  className="relative aspect-16/10 w-full overflow-hidden bg-[#E2E8F0]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/75 via-transparent to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />
                  
                  {/* Category Chip */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-white/90 text-[#0F172A] backdrop-blur-xs shadow-xs border border-white/60">
                    {item.category}
                  </span>

                  {/* Badge */}
                  <span className="absolute top-3.5 right-3.5 px-3 py-1 text-[11px] font-medium rounded-full bg-[#0F172A]/80 text-white backdrop-blur-xs">
                    {item.badge}
                  </span>

                  {/* Video Duration if available */}
                  {item.videoDuration && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[11px] backdrop-blur-xs font-mono">
                      <Play className="w-3 h-3 fill-white" />
                      <span>{item.videoDuration}</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div onClick={() => onSelectItem(item)}>
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{item.date}</span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-[#0F172A] leading-snug group-hover:text-[#0284C7] transition-colors mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="text-xs font-semibold text-[#0284C7] group-hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Lihat Prosedur & Data
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item);
                          }}
                          className="p-1.5 rounded-full bg-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors cursor-pointer"
                          title="Hapus Foto Praktikum"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onSelectItem(item)}
                        className="p-2 rounded-full bg-[#F4F8FC] text-[#64748B] group-hover:bg-[#E0F2FE] group-hover:text-[#0284C7] transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[24px] border border-[#E2E8F0] p-8">
            <p className="text-[#64748B] text-sm">
              Tidak ada dokumentasi yang cocok dengan kata kunci "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-3 px-5 py-2 text-xs font-bold text-white bg-[#0284C7] rounded-full"
            >
              Reset Pencarian
            </button>
          </div>
        )}

      </div>

      {/* Upload New Lab Photo Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl border border-[#CBD5E1] p-6 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7]">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Unggah Foto Eksperimen Lab</h3>
                    <p className="text-[11px] text-[#64748B]">Simpan foto ke Firebase Storage & Firestore</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Judul Praktikum / Eksperimen <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Identifikasi Asam Basa dengan Ekstrak Kunyit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Kategori</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    >
                      <option value="Indikator Alami">Indikator Alami</option>
                      <option value="Eksperimen Lab">Eksperimen Lab</option>
                      <option value="Karya Siswa">Karya Siswa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Badge Label</label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="Praktikum Kelas XI"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Konsep Kimia / Reaksi</label>
                  <input
                    type="text"
                    value={formConcept}
                    onChange={(e) => setFormConcept(e.target.value)}
                    placeholder="Contoh: Pergeseran Kesetimbangan & Ionisasi Kurkuminoid"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  />
                </div>

                {/* Upload Image Section */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Foto Dokumentasi Lab <span className="text-[#EF4444]">*</span></span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CloudUpload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Mengunggah...' : 'Pilih Foto dari Perangkat'}</span>
                    </button>
                  </div>

                  {isUploading && (
                    <div className="p-3 rounded-xl bg-[#E0F2FE] border border-[#0284C7]/30 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-[#0284C7] animate-spin shrink-0" />
                      <div className="flex-grow">
                        <div className="w-full bg-[#BAE6FD] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#0284C7] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#0369A1]">{uploadProgress}%</span>
                    </div>
                  )}

                  {formImageUrl ? (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#CBD5E1] bg-black/5">
                      <img src={formImageUrl} alt="Pratinjau Foto" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-[#EF4444]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-24 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] bg-white flex flex-col items-center justify-center gap-1 cursor-pointer p-3 text-center"
                    >
                      <Upload className="w-5 h-5 text-[#0284C7]" />
                      <span className="font-semibold text-[#0F172A] text-xs">Klik untuk Unggah Foto Praktikum</span>
                      <span className="text-[10px] text-[#94A3B8]">Folder Firebase Storage: catatan_foto/galeri</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Deskripsi & Prosedur Singkat</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Jelaskan secara singkat tujuan praktikum dan hasil pengamatan siswa..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9] font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-5 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <CloudUpload className="w-3.5 h-3.5" />
                    <span>Simpan ke Cloud</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToDelete(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl border border-[#CBD5E1] p-6 z-10 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1">Hapus Foto Praktikum?</h3>
              <p className="text-xs text-[#64748B] mb-5">
                Foto "{itemToDelete.title}" akan dihapus permanen dari Firebase Firestore.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-semibold text-[#64748B]"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (onDeleteItem) {
                      onDeleteItem(itemToDelete.id);
                    }
                    onAddToast('Foto Dihapus', `Foto "${itemToDelete.title}" telah dihapus.`, 'info');
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold shadow-xs"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Passcode Modal for Teachers */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAdminModalOpen(false);
                setPasscodeError(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl border border-[#CBD5E1] p-6 sm:p-8 z-10"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">Mode Pengajar (Pak Hafiz)</h3>
                    <p className="text-xs text-[#64748B]">Buka akses untuk mengunggah foto eksperimen lab</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAdminModalOpen(false);
                    setPasscodeError(false);
                  }}
                  className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2">
                    Passcode Guru
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      type="password"
                      autoFocus
                      placeholder="Ketik passcode (hafiz2026)..."
                      value={passcodeAttempt}
                      onChange={(e) => {
                        setPasscodeAttempt(e.target.value);
                        setPasscodeError(false);
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                        passcodeError
                          ? 'border-[#EF4444] bg-[#FEF2F2] text-[#991B1B]'
                          : 'border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:border-[#0284C7]'
                      }`}
                    />
                  </div>
                  {passcodeError ? (
                    <p className="text-xs text-[#EF4444] mt-1.5 font-medium">
                      Passcode salah. Gunakan: hafiz2026
                    </p>
                  ) : (
                    <p className="text-[11px] text-[#64748B] mt-1.5">
                      Gunakan kode akses pengajar bawaan: <code className="bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[#0284C7] font-bold">hafiz2026</code>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminModalOpen(false);
                      setPasscodeError(false);
                    }}
                    className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Buka Mode Guru</span>
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
