import React, { useState, useEffect } from 'react';
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
  BookOpen
} from 'lucide-react';
import { GalleryItem } from '../../types';
import { TEACHER_INFO } from '../../data/mockData';
import { PhotoChangerModal } from '../Modals/PhotoChangerModal';
import { generateLabExperimentFromTitle, QUICK_LAB_EXPERIMENT_PRESETS } from '../../lib/chemistryAutoGenerator';
import { WhatsAppIcon } from '../Common/WhatsAppShareButton';
import { sharePraktikumToWhatsApp } from '../../utils/share';

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
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isPhotoChangerOpen, setIsPhotoChangerOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [copiedFormula, setCopiedFormula] = useState<boolean>(false);
  const [checkedMaterials, setCheckedMaterials] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Admin Edit Form States
  const [editTitle, setEditTitle] = useState(item.title);
  const [editCategory, setEditCategory] = useState(item.category);
  const [editBadge, setEditBadge] = useState(item.badge);
  const [editDescription, setEditDescription] = useState(item.description);
  const [editConcept, setEditConcept] = useState(item.chemistryConcept);
  const [editMaterials, setEditMaterials] = useState<string[]>(item.materials || []);
  const [editSteps, setEditSteps] = useState<string[]>(item.steps || []);
  const [editResults, setEditResults] = useState(item.results || '');
  const [editImageUrl, setEditImageUrl] = useState(item.image);

  // Sync state when active item changes
  useEffect(() => {
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditBadge(item.badge);
    setEditDescription(item.description);
    setEditConcept(item.chemistryConcept);
    setEditMaterials(item.materials ? [...item.materials] : []);
    setEditSteps(item.steps ? [...item.steps] : []);
    setEditResults(item.results || '');
    setEditImageUrl(item.image);
    setCheckedMaterials({});
    setCompletedSteps({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [item.id]);

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

  // Save new photo from PhotoChangerModal
  const handleSaveNewPhoto = (newUrl: string) => {
    const updated: GalleryItem = {
      ...item,
      image: newUrl
    };
    if (onUpdateItem) {
      onUpdateItem(updated);
    }
    onAddToast(
      'Foto Praktikum Diperbarui',
      'Foto baru berhasil disimpan di database & siap digunakan.',
      'success'
    );
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
      image: editImageUrl
    };

    if (onUpdateItem) {
      onUpdateItem(updated);
    }
    setIsEditModalOpen(false);
    onAddToast('Praktikum Diperbarui', `Perubahan pada "${updated.title}" tersimpan di Cloud.`, 'success');
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
                  title="Edit konten praktikum ini"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Edit Data</span>
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
            
            {/* Hero Image Card */}
            <div className="bg-white rounded-[28px] overflow-hidden border border-[#E2E8F0] shadow-sm relative group">
              <div className="relative aspect-16/10 w-full overflow-hidden bg-[#0F172A]">
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#0284C7] text-white text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-xs">
                    {item.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/90 text-[#0F172A] text-xs font-semibold backdrop-blur-xs shadow-xs border border-white/80">
                    {item.badge}
                  </span>
                </div>

                {/* Overlay Action Buttons */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setIsPhotoChangerOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-white/95 hover:bg-white text-[#0F172A] hover:text-[#0284C7] text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-xs"
                    title="Ganti foto ini dengan mengunggah berkas baru atau mencari di Google"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Ganti Foto</span>
                  </button>

                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer"
                    title="Buka foto layar penuh"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Left Title Overlay */}
                <div className="absolute bottom-4 left-4 right-36 text-white">
                  <div className="flex items-center gap-2 text-xs text-white/80 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{item.date}</span>
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold font-heading text-white leading-tight drop-shadow-xs line-clamp-2">
                    {item.title}
                  </h1>
                </div>
              </div>

              {/* Photo Change Banner Action */}
              <div className="p-3 bg-[#F0F9FF] border-t border-[#BAE6FD] flex flex-wrap items-center justify-between gap-2 px-6">
                <div className="flex items-center gap-2 text-xs text-[#0369A1]">
                  <Sparkles className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span className="font-semibold">
                    Foto dapat diganti kapan saja via unggah file atau pencarian Google Images.
                  </span>
                </div>
                <button
                  onClick={() => setIsPhotoChangerOpen(true)}
                  className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Cari Google / Unggah Baru</span>
                </button>
              </div>
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
                  <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-heading">
                      Alat & Bahan Praktikum
                    </h2>
                    <p className="text-xs text-[#64748B]">Centang alat & reagen yang telah siap di meja lab</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-full">
                  {Object.values(checkedMaterials).filter(Boolean).length} / {item.materials?.length || 0} Siap
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {item.materials && item.materials.length > 0 ? (
                  item.materials.map((mat, idx) => {
                    const isChecked = !!checkedMaterials[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleMaterial(idx)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:border-[#0284C7]'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0 text-[#0284C7]">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#16A34A]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#94A3B8]" />
                          )}
                        </div>
                        <span className={`text-xs sm:text-sm font-medium ${isChecked ? 'line-through text-[#166534]/70' : ''}`}>
                          {mat}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#94A3B8]">Daftar alat dan bahan belum dicantumkan.</p>
                )}
              </div>
            </div>

            {/* 4. Prosedur Kerja & Langkah Eksperimen */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#0F172A]">
                  <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold font-heading">
                      Prosedur Kerja Langkah demi Langkah
                    </h2>
                    <p className="text-xs text-[#64748B]">Ikuti urutan teknis keselamatan dan pencampuran zat</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-full">
                  {Object.values(completedSteps).filter(Boolean).length} / {item.steps?.length || 0} Selesai
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {item.steps && item.steps.length > 0 ? (
                  item.steps.map((step, idx) => {
                    const isDone = !!completedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isDone
                            ? 'bg-[#F0FDF4] border-[#86EFAC]'
                            : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#38BDF8]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isDone
                              ? 'bg-[#16A34A] text-white'
                              : 'bg-[#E0F2FE] text-[#0284C7]'
                          }`}
                        >
                          {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDone ? 'text-[#166534]' : 'text-[#0F172A]'}`}>
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#94A3B8]">Langkah kerja belum dicantumkan.</p>
                )}
              </div>
            </div>

            {/* 5. Hasil Pengamatan & Kesimpulan */}
            <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5 text-[#0F172A]">
                <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-heading">
                    Hasil Pengamatan & Kesimpulan
                  </h2>
                  <p className="text-xs text-[#64748B]">Data observasi kualitatif/kuantitatif hasil eksperimen</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs sm:text-sm text-[#334155] leading-relaxed">
                {item.results || 'Data hasil observasi praktikum telah diverifikasi oleh pengajar.'}
              </div>
            </div>

            {/* 6. Pedoman Keselamatan Kerja Lab (K3) */}
            <div className="bg-[#FFFBEB] rounded-[24px] p-6 border border-[#FDE68A] flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#92400E]">
                  Pedoman Keselamatan Kerja Laboratorium Kimia (K3)
                </h3>
                <p className="text-xs text-[#B45309] leading-relaxed">
                  Selalu gunakan jas laboratorium, kacamata pengaman (goggle), dan sarung tangan saat memegang reagen asam pekat/basa kuat. Jika terjadi percikan bahan kimia, segera bilas dengan air mengalir selama 15 menit dan laporkan ke Pak Hafiz.
                </p>
              </div>
            </div>

          </div>

          {/* Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Action Toolbar Card */}
            <div className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-sm space-y-3.5 sticky top-28">
              <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider text-[11px] text-[#64748B]">
                Aksi Cepat Siswa & Guru
              </h3>

              {/* Photo Changer Button */}
              <button
                onClick={() => setIsPhotoChangerOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Ganti Foto (Upload / Google)</span>
              </button>

              {/* Copy Full Report Button */}
              <button
                onClick={handleCopyFullReport}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#E0F2FE] border border-[#CBD5E1] text-[#0284C7] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                {copiedReport ? <Check className="w-4 h-4 text-[#16A34A]" /> : <FileText className="w-4 h-4" />}
                <span>{copiedReport ? 'Laporan Disalin!' : 'Salin Laporan Praktikum'}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={handleShareLink}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#0284C7]" />
                <span>Bagikan Tautan Praktikum</span>
              </button>

              {/* Open Portal Link */}
              <a
                href="https://www.kelaspakhafiz.my.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#38BDF8]" />
                <span>Portal Pembelajaran Utama</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Teacher Info in Sidebar */}
              <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center gap-3">
                <img
                  src={TEACHER_INFO.avatar}
                  alt={TEACHER_INFO.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-[#0284C7]/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A]">{TEACHER_INFO.name}</h4>
                  <p className="text-[11px] text-[#64748B]">Guru Kimia & Sains SMA</p>
                </div>
              </div>
            </div>

            {/* Related Experiments List */}
            <div className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider text-[11px] text-[#64748B]">
                  Praktikum Lainnya
                </h3>
                <button
                  onClick={onBack}
                  className="text-xs font-bold text-[#0284C7] hover:underline cursor-pointer"
                >
                  Lihat Semua
                </button>
              </div>

              <div className="space-y-3">
                {relatedItems.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectItem(rel)}
                    className="p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#0284C7] bg-[#F8FAFC] hover:bg-white flex items-center gap-3 cursor-pointer transition-all group"
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#E2E8F0]">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#0284C7] uppercase block">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors truncate">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-[#64748B] block mt-0.5">
                        {rel.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* PHOTO CHANGER MODAL */}
      <PhotoChangerModal
        isOpen={isPhotoChangerOpen}
        onClose={() => setIsPhotoChangerOpen(false)}
        currentImageUrl={item.image}
        itemTitle={item.title}
        onSavePhoto={handleSaveNewPhoto}
        onAddToast={onAddToast}
      />

      {/* FULLSCREEN LIGHTBOX MODAL */}
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
              className="relative max-w-5xl max-h-[90vh] z-10 flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/20"
              />
              <div className="mt-4 text-center text-white">
                <h4 className="text-base font-bold">{item.title}</h4>
                <p className="text-xs text-white/70">{item.category} • {item.badge}</p>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN EDIT MODAL */}
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
                      Edit Data Praktikum
                    </h3>
                    <p className="text-xs text-[#64748B]">Perbarui rincian langkah kerja, reaksi, dan konsep</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-full text-[#64748B] hover:bg-[#F1F5F9]"
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
                    className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-2xs flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Buat Otomatis</span>
                  </button>
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
                    className="px-4 py-2.5 rounded-full border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs"
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
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9]"
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
                  className="px-5 py-2 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold shadow-xs"
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
