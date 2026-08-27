import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  Share2,
  Copy,
  Check,
  Tag,
  Maximize2,
  Image as ImageIcon,
  Edit3,
  Trash2,
  ExternalLink,
  Info,
  ChevronRight,
  ChevronLeft,
  Download,
  X,
  Plus,
  ShieldCheck,
  Play,
  FlaskConical,
  Flame,
  CheckSquare,
  Square,
  AlertTriangle,
  FileText,
  Upload,
  Globe,
  Search,
  Wand2,
  BookOpen,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { TEACHER_INFO } from '../../data/mockData';
import { PhotoChangerModal } from '../Modals/PhotoChangerModal';
import { generateLabExperimentFromTitle, QUICK_LAB_EXPERIMENT_PRESETS } from '../../lib/chemistryAutoGenerator';
import { WhatsAppIcon } from '../Common/WhatsAppShareButton';
import { sharePraktikumToWhatsApp } from '../../utils/share';
import { uploadFileToFirebaseStorage, STORAGE_FOLDERS } from '../../lib/firebase';

interface PraktikumDetailPageProps {
  item: GalleryItem;
  allItems: GalleryItem[];
  onSelectItem: (item: GalleryItem) => void;
  onBack: () => void;
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
  onOpenMainPortal: () => void;
  isAdmin: boolean;
  onUpdateItem?: (updatedItem: GalleryItem) => void;
  onDeleteItem?: (itemId: string) => void;
}

export const PraktikumDetailPage: React.FC<PraktikumDetailPageProps> = ({
  item,
  allItems,
  onSelectItem,
  onBack,
  onAddToast,
  onOpenMainPortal,
  isAdmin,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);
  const [isPhotoChangerOpen, setIsPhotoChangerOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);
  const [checkedMaterials, setCheckedMaterials] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Extract all photos from item
  const photos = (Array.isArray(item.images) && item.images.length > 0
    ? item.images.filter(Boolean)
    : (item.image ? [item.image] : []));
  const totalPhotos = photos.length;

  // Admin Edit Form States
  const [editTitle, setEditTitle] = useState(item.title);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editBadge, setEditBadge] = useState(item.badge);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editConcept, setEditConcept] = useState(item.chemistryConcept);
  const [editMaterials, setEditMaterials] = useState<string[]>(item.materials || []);
  const [editSteps, setEditSteps] = useState<string[]>(item.steps || []);
  const [editResults, setEditResults] = useState(item.results || '');
  const [editImages, setEditImages] = useState<string[]>(photos);
  const [newPhotoUrlInput, setNewPhotoUrlInput] = useState<string>('');
  const [isUploadingEditPhoto, setIsUploadingEditPhoto] = useState<boolean>(false);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state when active item changes
  useEffect(() => {
    setActivePhotoIdx(0);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditBadge(item.badge);
    setEditDescription(item.description);
    setEditConcept(item.chemistryConcept);
    setEditMaterials(item.materials ? [...item.materials] : []);
    setEditSteps(item.steps ? [...item.steps] : []);
    setEditResults(item.results || '');
    const currentPhotos = (Array.isArray(item.images) && item.images.length > 0
      ? item.images.filter(Boolean)
      : (item.image ? [item.image] : []));
    setEditImages(currentPhotos);
    setCheckedMaterials({});
    setCompletedSteps({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [item.id]);

  // Keyboard navigation for hero slider
  useEffect(() => {
    if (totalPhotos <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          setLightboxIdx((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
        } else if (e.key === 'ArrowRight') {
          setLightboxIdx((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
        } else if (e.key === 'Escape') {
          setIsLightboxOpen(false);
        }
      } else if (!isEditModalOpen && !isPhotoChangerOpen && !isDeleteModalOpen) {
        if (e.key === 'ArrowLeft') {
          setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
        } else if (e.key === 'ArrowRight') {
          setActivePhotoIdx((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPhotos, isLightboxOpen, isEditModalOpen, isPhotoChangerOpen, isDeleteModalOpen]);

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (totalPhotos <= 1) return;
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (totalPhotos <= 1) return;
    setActivePhotoIdx((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || totalPhotos <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextPhoto();
      } else {
        handlePrevPhoto();
      }
    }
    setTouchStartX(null);
  };

  // Toggle material check
  const toggleMaterial = (index: number) => {
    setCheckedMaterials((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Toggle step completion
  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Save new photo from PhotoChangerModal (adds or replaces cover)
  const handleSaveNewPhoto = (newUrl: string) => {
    const updatedImages = [newUrl, ...photos.filter((p) => p !== newUrl)];
    const updated: GalleryItem = {
      ...item,
      image: newUrl,
      images: updatedImages
    };
    if (onUpdateItem) {
      onUpdateItem(updated);
    }
    onAddToast(
      'Foto Praktikum Diperbarui',
      'Foto baru berhasil ditambahkan sebagai foto utama praktikum.',
      'success'
    );
  };

  // Upload photo directly inside edit modal
  const handleUploadEditPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingEditPhoto(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      try {
        const downloadUrl = await uploadFileToFirebaseStorage(
          file,
          STORAGE_FOLDERS.GALLERY_IMAGES
        );
        newUrls.push(downloadUrl);
      } catch (err) {
        console.warn('Fallback data URL for edit photo:', err);
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = (ev) => {
            if (ev.target?.result) {
              newUrls.push(ev.target.result as string);
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    if (newUrls.length > 0) {
      setEditImages((prev) => [...prev, ...newUrls]);
      onAddToast('Foto Berhasil Ditambahkan', `${newUrls.length} foto siap disimpan ke postingan.`, 'success');
    }

    setIsUploadingEditPhoto(false);
    e.target.value = '';
  };

  const handleAddPhotoByUrl = () => {
    if (!newPhotoUrlInput.trim()) return;
    setEditImages((prev) => [...prev, newPhotoUrlInput.trim()]);
    setNewPhotoUrlInput('');
    onAddToast('Foto Ditambahkan', 'Tautan foto dimasukkan ke daftar album.', 'info');
  };

  const handleRemoveEditPhoto = (index: number) => {
    setEditImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSetCoverPhoto = (index: number) => {
    setEditImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [target, ...rest];
    });
    onAddToast('Cover Diubah', 'Foto ini sekarang menjadi foto sampul utama.', 'info');
  };

  // Copy full lab report
  const handleCopyFullReport = () => {
    const reportText = `🔬 [LAPORAN PRAKTIKUM KIMIA — KELAS PAK HAFIZ]
📌 Judul: ${item.title}
🏷️ Kategori: ${item.category} (${item.badge})
📅 Tanggal: ${item.date}
👨‍🏫 Pengajar: ${TEACHER_INFO.name}

1. TUJUAN & DESKRIPSI:
${item.description}

2. PRINSIP / KONSEP KIMIA & REAKSI:
${item.chemistryConcept}

3. ALAT & BAHAN:
${item.materials ? item.materials.map((m, i) => `  ${i + 1}. ${m}`).join('\n') : '-'}

4. PROSEDUR KERJA & LANGKAH:
${item.steps ? item.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n') : '-'}

5. HASIL PENGAMATAN & KESIMPULAN:
${item.results}

🔗 Akses dokumentasi lengkap di: ${window.location.href}
© Kelas Pak Hafiz — Sains Dalam Sudut Pandang yang Lebih Segar.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 3000);
      onAddToast('Laporan Praktikum Disalin!', 'Teks laporan praktikum siap ditempel ke dokumen tugasmu.', 'success');
    }
  };

  // Copy chemical concept & formula only
  const handleCopyFormulaOnly = () => {
    if (!item.chemistryConcept) return;
    const formulaText = `🧪 [PERSAMAAN REAKSI & KONSEP KIMIA — ${item.title}]\n${item.chemistryConcept}\n\nSumber: Kelas Pak Hafiz (${window.location.href})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formulaText);
      setCopiedFormula(true);
      setTimeout(() => setCopiedFormula(false), 3000);
      onAddToast('Konsep & Reaksi Disalin!', 'Persamaan reaksi siap digunakan.', 'success');
    }
  };

  // Share link
  const handleShareWhatsApp = () => {
    sharePraktikumToWhatsApp(item);
    onAddToast(
      'Membuka WhatsApp',
      `Membagikan dokumentasi praktikum "${item.title}" ke WhatsApp.`,
      'info'
    );
  };

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onAddToast(
        'Tautan Praktikum Disalin!',
        `Tautan untuk "${item.title}" siap dibagikan ke teman kelas.`,
        'info'
      );
    }
  };

  // Auto generate for admin edit modal
  const handleAutoGenerateInEdit = () => {
    if (!editTitle.trim()) {
      onAddToast('Ketik Judul Dulu', 'Masukkan judul eksperimen untuk membuat prosedur otomatis.', 'info');
      return;
    }
    const res = generateLabExperimentFromTitle(editTitle, editCategory, editBadge);
    setEditDescription(res.description);
    setEditConcept(res.chemistryConcept);
    setEditMaterials(res.materials);
    setEditSteps(res.steps);
    setEditResults(res.results);
    if (res.category) setEditCategory(res.category);
    if (res.badge) setEditBadge(res.badge);
    onAddToast('Prosedur & Reaksi Terisi Otomatis', 'Data telah diselaraskan dengan judul praktikum.', 'success');
  };

  // Save changes from Edit Modal
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editConcept.trim()) {
      onAddToast('Formulir Belum Lengkap', 'Judul dan konsep reaksi tidak boleh kosong.', 'info');
      return;
    }

    const cleanImages = editImages.filter(Boolean);
    const primaryImg = cleanImages[0] || item.image;

    const updated: GalleryItem = {
      ...item,
      title: editTitle.trim(),
      category: editCategory,
      badge: editBadge.trim() || 'Praktikum Kimia',
      description: editDescription.trim(),
      chemistryConcept: editConcept.trim(),
      materials: editMaterials.filter((m) => m.trim().length > 0),
      steps: editSteps.filter((s) => s.trim().length > 0),
      results: editResults.trim(),
      image: primaryImg,
      images: cleanImages.length > 0 ? cleanImages : [primaryImg]
    };

    if (onUpdateItem) {
      onUpdateItem(updated);
    }
    setIsEditModalOpen(false);
    onAddToast('Praktikum Diperbarui', `Perubahan pada "${updated.title}" tersimpan di Cloud (${cleanImages.length} foto).`, 'success');
  };

  // Related items (exclude current item)
  const relatedItems = allItems.filter((g) => g.id !== item.id).slice(0, 4);

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-[#F4F8FC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumbs & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#64748B]">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 font-bold text-[#0284C7] hover:text-[#0369A1] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Galeri Praktikum</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[11px] font-bold text-[#0F172A]">
              {item.category}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] hidden sm:inline" />
            <span className="text-[#0F172A] font-medium truncate max-w-[200px] sm:max-w-sm hidden sm:inline">
              {item.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] hover:border-[#0284C7] text-[#0F172A] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title="Edit konten & kelola foto praktikum ini"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Edit Data & Foto</span>
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-1.5 rounded-full bg-[#FEE2E2] hover:bg-[#EF4444] text-[#EF4444] hover:text-white transition-colors cursor-pointer"
                  title="Hapus dokumentasi dari Firestore"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-1.5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/30 hover:border-[#25D366] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Bagikan ke WhatsApp Siswa / Grup"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan WhatsApp</span>
            </button>
            <button
              onClick={handleShareLink}
              className="px-3 py-1.5 rounded-full bg-white border border-[#CBD5E1] hover:bg-[#E0F2FE] text-[#0284C7] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Bagikan tautan halaman ini"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salin Link</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero Image Card & Carousel Slider */}
            <div className="bg-white rounded-[28px] overflow-hidden border border-[#E2E8F0] shadow-sm relative group">
              <div
                className="relative aspect-16/10 w-full overflow-hidden bg-[#0F172A] select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Active Image with Slide Animation */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePhotoIdx}
                    src={photos[activePhotoIdx] || item.image}
                    alt={`${item.title} - Foto ${activePhotoIdx + 1}`}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Slider Left Arrow */}
                {totalPhotos > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 hover:bg-white text-[#0F172A] shadow-xl backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title="Foto Sebelumnya (Geser Kiri)"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6 text-[#0F172A]" />
                  </button>
                )}

                {/* Slider Right Arrow */}
                {totalPhotos > 1 && (
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 hover:bg-white text-[#0F172A] shadow-xl backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title="Foto Selanjutnya (Geser Kanan)"
                    aria-label="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-6 h-6 text-[#0F172A]" />
                  </button>
                )}

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                  <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-xs">
                    {item.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 text-[#0F172A] text-xs font-semibold backdrop-blur-xs shadow-xs border border-white/80">
                    {item.badge}
                  </span>

                  {/* Multi-photo indicator pill */}
                  {totalPhotos > 1 && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-md shadow-xs border border-white/20">
                      <ImageIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{activePhotoIdx + 1} / {totalPhotos} Foto</span>
                    </span>
                  )}
                </div>

                {/* Overlay Action Buttons */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                  {isAdmin && (
                    <button
                      onClick={() => setIsPhotoChangerOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-[#0F172A] hover:text-[#0284C7] text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-xs"
                      title="Ganti / Tambah foto dari Google Images atau unggah berkas"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Kelola Foto</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setLightboxIdx(activePhotoIdx);
                      setIsLightboxOpen(true);
                    }}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer"
                    title="Buka foto layar penuh"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Left Title Overlay */}
                <div className="absolute bottom-4 left-4 right-44 text-white z-10">
                  <div className="flex items-center gap-2 text-xs text-white/80 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{item.date}</span>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold font-heading text-white leading-tight drop-shadow-xs line-clamp-2">
                    {item.title}
                  </h1>
                </div>

                {/* Pagination Dots indicator on photo */}
                {totalPhotos > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                    {photos.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activePhotoIdx === idx
                            ? 'w-6 bg-[#38BDF8]'
                            : 'w-2 bg-white/60 hover:bg-white'
                        }`}
                        aria-label={`Lihat foto ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Multi-Photo Thumbnail Bar */}
              {totalPhotos > 1 && (
                <div className="bg-[#F8FAFC] px-5 py-3 border-t border-[#E2E8F0] flex items-center gap-2.5 overflow-x-auto">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider shrink-0 mr-1">
                    <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Album Foto ({totalPhotos}):</span>
                  </div>
                  {photos.map((photoUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activePhotoIdx === idx
                          ? 'border-[#0284C7] ring-2 ring-[#0284C7]/30 scale-105 shadow-xs'
                          : 'border-transparent opacity-60 hover:opacity-100 hover:border-[#CBD5E1]'
                      }`}
                    >
                      <img
                        src={photoUrl}
                        alt={`Dokumentasi foto ke-${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 px-1 text-[8px] font-bold bg-black/75 text-white rounded-tl">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Photo Change Banner Action (Teacher / Admin Mode Only) */}
              {isAdmin && (
                <div className="p-3 bg-[#F0F9FF] border-t border-[#BAE6FD] flex flex-wrap items-center justify-between gap-2 px-6">
                  <div className="flex items-center gap-2 text-xs text-[#0369A1]">
                    <Sparkles className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span className="font-semibold">
                      Dokumentasi ini memiliki {totalPhotos} foto. Anda dapat menambah foto baru kapan saja.
                    </span>
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah / Atur Foto</span>
                  </button>
                </div>
              )}
            </div>

            {/* 1. Tujuan & Ringkasan Eksperimen */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#0F172A]">
                <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-heading">
                    Tujuan & Ringkasan Praktikum
                  </h2>
                  <p className="text-xs text-[#64748B]">Latar belakang fenomena dan observasi awal</p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-sans pt-1">
                {item.description}
              </p>
            </div>

            {/* 2. Konsep Kimia & Persamaan Reaksi Setara */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#0F172A]">
                  <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-heading">
                      Prinsip Kimia & Persamaan Reaksi
                    </h2>
                    <p className="text-xs text-[#64748B]">Konsep sains, transfer elektron, dan kesetimbangan molekuler</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyFormulaOnly}
                  className="px-3 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#E0F2FE] text-[#0284C7] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Salin persamaan reaksi ke clipboard"
                >
                  {copiedFormula ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFormula ? 'Tersalin' : 'Salin Reaksi'}</span>
                </button>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-[#0F172A] text-[#F8FAFC] font-mono text-xs sm:text-sm leading-relaxed border border-[#334155] shadow-inner">
                <div className="flex items-center gap-2 text-[#38BDF8] text-[11px] font-sans font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Persamaan Reaksi & Mekanisme Molekuler:</span>
                </div>
                <div className="whitespace-pre-line text-white">
                  {item.chemistryConcept}
                </div>
              </div>
            </div>

            {/* 3. Alat & Bahan Laboratorium (Interactive Checkbox) */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#0F172A]">
                  <div className="w-9 h-9 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-heading">
                      Alat & Bahan Praktikum
                    </h2>
                    <p className="text-xs text-[#64748B]">Centang alat & bahan saat persiapan lab</p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#64748B]">
                  {Object.values(checkedMaterials).filter(Boolean).length} / {item.materials?.length || 0} Siap
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {item.materials?.map((mat, idx) => {
                  const isChecked = !!checkedMaterials[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleMaterial(idx)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#E0F2FE]/40 border-[#38BDF8] text-[#0369A1]'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:border-[#CBD5E1]'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
                      )}
                      <span className={isChecked ? 'line-through text-[#64748B]' : 'font-medium'}>
                        {mat}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Prosedur & Langkah Kerja (Interactive Progress Checklist) */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#0F172A]">
                  <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-heading">
                      Prosedur & Langkah Kerja
                    </h2>
                    <p className="text-xs text-[#64748B]">Ikuti prosedur langkah demi langkah dengan tertib</p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#64748B]">
                  {Object.values(completedSteps).filter(Boolean).length} / {item.steps?.length || 0} Selesai
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {item.steps?.map((step, idx) => {
                  const isDone = !!completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isDone
                          ? 'bg-[#F0FDF4] border-[#86EFAC] shadow-2xs'
                          : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isDone
                            ? 'bg-[#16A34A] text-white'
                            : 'bg-[#0284C7] text-white'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'text-[#166534] line-through font-normal' : 'text-[#1E293B] font-medium'}`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Hasil Pengamatan & Kesimpulan */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 text-[#0F172A]">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-heading">
                    Hasil Pengamatan & Kesimpulan
                  </h2>
                  <p className="text-xs text-[#64748B]">Verifikasi data hasil percobaan dan konklusi kimia</p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950 leading-relaxed">
                {item.results}
              </div>
            </div>

          </div>

          {/* Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-2xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                Aksi Cepat Siswa
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={handleCopyFullReport}
                  className="w-full py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  {copiedReport ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedReport ? 'Laporan Lengkap Tersalin!' : 'Salin Format Laporan Lengkap'}</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Bagikan ke WhatsApp</span>
                </button>

                <button
                  onClick={onOpenMainPortal}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#E0F2FE] text-[#0284C7] border border-[#CBD5E1] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Buka di Portal Siswa</span>
                </button>
              </div>
            </div>

            {/* Teacher Info Card */}
            <div className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={TEACHER_INFO.avatar}
                  alt={TEACHER_INFO.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#0284C7]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">{TEACHER_INFO.name}</h4>
                  <p className="text-[11px] text-[#64748B]">{TEACHER_INFO.title}</p>
                </div>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Dokumentasi praktikum resmi untuk mendukung pembelajaran berbasis inkuiri, praktikum laboratorium, dan kontekstual sains.
              </p>
            </div>

            {/* Related Experiments */}
            {relatedItems.length > 0 && (
              <div className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                    Praktikum Terkait
                  </h3>
                  <span className="text-[11px] text-[#64748B]">{relatedItems.length} lainnya</span>
                </div>

                <div className="space-y-3">
                  {relatedItems.map((rel) => {
                    const relPhotos = (Array.isArray(rel.images) && rel.images.length > 0
                      ? rel.images.filter(Boolean)
                      : (rel.image ? [rel.image] : []));
                    return (
                      <div
                        key={rel.id}
                        onClick={() => onSelectItem(rel)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F1F5F9] transition-all cursor-pointer group"
                      >
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-[#E2E8F0]">
                          <img
                            src={rel.image}
                            alt={rel.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {relPhotos.length > 1 && (
                            <span className="absolute bottom-0 right-0 px-1 text-[8px] font-bold bg-black/70 text-white rounded-tl">
                              {relPhotos.length}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-[#0F172A] group-hover:text-[#0284C7] truncate transition-colors">
                            {rel.title}
                          </h5>
                          <p className="text-[11px] text-[#64748B] truncate">{rel.category}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* LIGHTBOX MODAL WITH FULLSCREEN SLIDER */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[90vh] z-10 flex flex-col items-center justify-center select-none"
            >
              {/* Lightbox Image */}
              <div className="relative max-w-full max-h-[75vh] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={lightboxIdx}
                    src={photos[lightboxIdx] || item.image}
                    alt={`${item.title} - Foto ${lightboxIdx + 1}`}
                    referrerPolicy="no-referrer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-full max-h-[75vh] rounded-2xl object-contain shadow-2xl border border-white/20"
                  />
                </AnimatePresence>

                {/* Left Arrow */}
                {totalPhotos > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
                    }}
                    className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                    title="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Right Arrow */}
                {totalPhotos > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
                    }}
                    className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                    title="Foto Selanjutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Lightbox Footer & Thumbnail Strip */}
              <div className="mt-4 text-center text-white space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold">{item.title}</h4>
                  {totalPhotos > 1 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#0284C7] text-white">
                      Foto {lightboxIdx + 1} dari {totalPhotos}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/70">{item.category} • {item.badge}</p>

                {/* Lightbox Mini Thumbnails */}
                {totalPhotos > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {photos.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLightboxIdx(idx)}
                        className={`w-10 h-7 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                          lightboxIdx === idx ? 'border-[#38BDF8] scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={p} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-0 right-0 sm:-top-8 sm:-right-8 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                title="Tutup layar penuh"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PHOTO CHANGER MODAL */}
      <PhotoChangerModal
        isOpen={isPhotoChangerOpen}
        onClose={() => setIsPhotoChangerOpen(false)}
        currentImageUrl={item.image}
        itemTitle={item.title}
        modalTitle="Ganti / Tambah Foto Praktikum"
        onSavePhoto={handleSaveNewPhoto}
        onAddToast={onAddToast}
      />

      {/* ADMIN EDIT MODAL WITH MULTI-IMAGE MANAGEMENT */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-[#CBD5E1] p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto my-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#0F172A] font-heading">
                      Edit Data & Kelola Foto Praktikum
                    </h3>
                    <p className="text-xs text-[#64748B]">Bisa memuat beberapa foto sekaligus dalam satu postingan</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-full text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Auto Generate Button */}
                <div className="flex items-center justify-between bg-[#F0F9FF] p-3 rounded-xl border border-[#BAE6FD]">
                  <span className="text-xs font-bold text-[#0369A1]">
                    ✨ Sinkronisasi Otomatis dari Judul
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoGenerateInEdit}
                    className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Buat Otomatis</span>
                  </button>
                </div>

                {/* Multi-Photo Manager Section */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#0284C7]" />
                      <span>Daftar Foto Postingan ({editImages.length} Foto)</span>
                    </label>
                    <span className="text-[11px] text-[#64748B]">Foto #1 otomatis jadi sampul utama</span>
                  </div>

                  {/* Thumbnail List */}
                  {editImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {editImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative group rounded-xl overflow-hidden border-2 bg-white ${
                            idx === 0 ? 'border-[#0284C7] ring-2 ring-[#0284C7]/20' : 'border-[#E2E8F0]'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Foto ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-24 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverPhoto(idx)}
                                className="p-1.5 rounded-full bg-white text-[#0284C7] hover:bg-[#0284C7] hover:text-white transition-colors cursor-pointer"
                                title="Jadikan foto utama (cover)"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveEditPhoto(idx)}
                              className="p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                              title="Hapus foto ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className={`absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-bold rounded ${
                            idx === 0 ? 'bg-[#0284C7] text-white' : 'bg-black/70 text-white'
                          }`}>
                            {idx === 0 ? '★ Cover' : `#${idx + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#94A3B8] italic">Belum ada foto. Unggah atau tambahkan tautan foto di bawah.</p>
                  )}

                  {/* Add Photo Controls */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E2E8F0]">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={handleUploadEditPhoto}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingEditPhoto}
                      onClick={() => editFileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0284C7] text-[#0F172A] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{isUploadingEditPhoto ? 'Mengunggah...' : '+ Unggah Foto Baru (Bisa Multi)'}</span>
                    </button>

                    <div className="flex-1 flex items-center gap-1.5">
                      <input
                        type="url"
                        placeholder="Atau tempel URL gambar..."
                        value={newPhotoUrlInput}
                        onChange={(e) => setNewPhotoUrlInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoByUrl}
                        className="px-3 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369A1] transition-colors cursor-pointer"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Judul Praktikum
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                      Kategori
                    </label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                      Badge / Tag
                    </label>
                    <input
                      type="text"
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Tujuan & Deskripsi
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Konsep Kimia & Persamaan Reaksi
                  </label>
                  <textarea
                    rows={3}
                    value={editConcept}
                    onChange={(e) => setEditConcept(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] font-mono focus:outline-none focus:border-[#0284C7]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Hasil Pengamatan & Kesimpulan
                  </label>
                  <textarea
                    rows={2}
                    value={editResults}
                    onChange={(e) => setEditResults(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-full border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-[24px] p-6 shadow-2xl border border-[#CBD5E1] z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">Hapus Dokumentasi Praktikum?</h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Apakah Anda yakin ingin menghapus "{item.title}" dari Firebase Firestore? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (onDeleteItem) {
                      onDeleteItem(item.id);
                    }
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-5 py-2 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
