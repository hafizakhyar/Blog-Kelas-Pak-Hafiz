import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Sparkles,
  Share2,
  Copy,
  Check,
  Heart,
  Pin,
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
  RotateCcw,
  CloudUpload,
  Loader2,
  Wand2,
  Zap
} from 'lucide-react';
import { ClassNote } from '../../types';
import { TEACHER_INFO } from '../../data/mockData';
import { uploadFileToFirebaseStorage, STORAGE_FOLDERS } from '../../lib/firebase';
import { generateChemistryContentFromTitle } from '../../lib/chemistryAutoGenerator';

interface ClassNoteDetailPageProps {
  note: ClassNote;
  allNotes: ClassNote[];
  onSelectNote: (note: ClassNote) => void;
  onBack: () => void;
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
  onOpenMainPortal: () => void;
  isAdmin: boolean;
  onUpdateNote?: (updatedNote: ClassNote) => void;
  onDeleteNote?: (noteId: string) => void;
  onTriggerAdminLogin?: () => void;
}

export const ClassNoteDetailPage: React.FC<ClassNoteDetailPageProps> = ({
  note,
  allNotes,
  onSelectNote,
  onBack,
  onAddToast,
  onOpenMainPortal,
  isAdmin,
  onUpdateNote,
  onDeleteNote,
  onTriggerAdminLogin,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFormulas, setCopiedFormulas] = useState(false);
  const [likes, setLikes] = useState<number>(note.likes || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Admin edit form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editCategory, setEditCategory] = useState(note.category);
  const [editGrade, setEditGrade] = useState(note.classGrade);
  const [editContent, setEditContent] = useState(note.content);
  const [editKeyPoints, setEditKeyPoints] = useState<string[]>(note.keyPoints || ['']);
  const [editImageUrl, setEditImageUrl] = useState(note.imageUrl || '');
  const [editTags, setEditTags] = useState(note.tags ? note.tags.join(', ') : '');
  const [editIsPinned, setEditIsPinned] = useState(!!note.isPinned);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state if note prop changes
  useEffect(() => {
    setLikes(note.likes || 0);
    setHasLiked(false);
    setEditTitle(note.title);
    setEditCategory(note.category);
    setEditGrade(note.classGrade);
    setEditContent(note.content);
    setEditKeyPoints(note.keyPoints && note.keyPoints.length > 0 ? [...note.keyPoints] : ['']);
    setEditImageUrl(note.imageUrl || '');
    setEditTags(note.tags ? note.tags.join(', ') : '');
    setEditIsPinned(!!note.isPinned);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [note.id]);

  const handleAutoGenerateInEdit = () => {
    if (!editTitle.trim()) {
      onAddToast('Ketik Judul Dulu', 'Masukkan judul materi untuk membuat deskripsi & rumus otomatis.', 'info');
      return;
    }
    const res = generateChemistryContentFromTitle(editTitle, editCategory, editGrade);
    setEditContent(res.content);
    setEditKeyPoints(res.keyPoints);
    setEditTags(res.tags.join(', '));
    if (res.category) setEditCategory(res.category);
    if (res.classGrade) setEditGrade(res.classGrade);
    onAddToast('Deskripsi & Rumus Terisi Otomatis', 'Konten telah disesuaikan dengan topik judul.', 'success');
  };

  const handleLike = () => {
    if (!hasLiked) {
      const next = likes + 1;
      setLikes(next);
      setHasLiked(true);
      if (onUpdateNote) {
        onUpdateNote({ ...note, likes: next });
      }
    } else {
      const next = Math.max(0, likes - 1);
      setLikes(next);
      setHasLiked(false);
      if (onUpdateNote) {
        onUpdateNote({ ...note, likes: next });
      }
    }
  };

  const handleCopySummary = () => {
    const formatted = `📝 [CATATAN KELAS PAK HAFIZ]
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
🔗 Akses materi & modul lengkap di: ${window.location.href}
© Kelas Pak Hafiz — Kimia & Sains SMA`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(formatted);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
      onAddToast('Ringkasan Disalin!', 'Materi catatan siap ditempel ke buku catatan atau grup belajarmu.', 'success');
    }
  };

  const handleCopyFormulasOnly = () => {
    if (!note.keyPoints || note.keyPoints.length === 0) return;
    const formulaText = `✨ [RUMUS & POIN KUNCI - ${note.title}]\n${note.keyPoints
      .map((p, i) => `${i + 1}. ${p}`)
      .join('\n')}\n\nSumber: Kelas Pak Hafiz (${window.location.href})`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(formulaText);
      setCopiedFormulas(true);
      setTimeout(() => setCopiedFormulas(false), 3000);
      onAddToast('Rumus Disalin!', 'Daftar rumus kunci berhasil disalin ke clipboard.', 'success');
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      onAddToast('Tautan Disalin!', 'Link materi siap dibagikan ke siswa atau rekan guru.', 'info');
    }
  };

  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(
      `📚 *Catatan Kimia: ${note.title}*\nJenjang: ${note.classGrade} | Topik: ${note.category}\nPengajar: ${note.authorName}\n\nPelajari rangkuman dan rumus lengkapnya di sini:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank', 'noopener,noreferrer');
  };

  const handleUploadEditImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        STORAGE_FOLDERS.NOTES_IMAGES,
        (progress) => setUploadProgress(progress)
      );
      setEditImageUrl(downloadUrl);
      onAddToast('Foto Berhasil Diunggah', 'Foto baru tersimpan di Firebase Storage.', 'success');
    } catch (err) {
      console.warn('Firebase Storage upload fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditImageUrl(event.target?.result as string);
        onAddToast('Foto Terlampir', 'Foto berhasil dilampirkan.', 'info');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  // Admin Save Changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      onAddToast('Judul Diperlukan', 'Harap isi judul catatan.', 'info');
      return;
    }
    const updated: ClassNote = {
      ...note,
      title: editTitle.trim(),
      category: editCategory,
      classGrade: editGrade,
      content: editContent.trim(),
      keyPoints: editKeyPoints.map((p) => p.trim()).filter(Boolean),
      imageUrl: editImageUrl.trim() || undefined,
      tags: editTags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean),
      isPinned: editIsPinned,
    };
    if (onUpdateNote) {
      onUpdateNote(updated);
    }
    setIsEditModalOpen(false);
    onAddToast('Perubahan Disimpan', `Catatan "${updated.title}" berhasil diperbarui.`, 'success');
  };

  // Admin Delete
  const handleConfirmDelete = () => {
    if (onDeleteNote) {
      onDeleteNote(note.id);
    }
    setIsDeleteModalOpen(false);
    onBack();
  };

  // Related Notes (same category or grade, excluding current)
  const relatedNotes = allNotes
    .filter((n) => n.id !== note.id && (n.category === note.category || n.classGrade === note.classGrade))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F4F8FC] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] hover:text-[#0284C7] hover:border-[#0284C7] text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B] group-hover:text-[#0284C7] group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Catatan Kelas</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Share WhatsApp Button */}
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Bagikan ke WhatsApp Siswa"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan WhatsApp</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#CBD5E1] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin Tautan Halaman Ini"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tautan Disalin!' : 'Salin Link'}</span>
            </button>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-[#CBD5E1]">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  title="Edit Catatan Ini"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit Catatan</span>
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 rounded-full bg-white hover:bg-[#FEE2E2] text-[#EF4444] border border-[#CBD5E1] transition-colors cursor-pointer"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Note Card Container */}
        <article className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden mb-12">
          
          {/* Header Metadata Section */}
          <div className="p-6 sm:p-10 border-b border-[#F1F5F9] bg-linear-to-b from-[#F8FAFC] to-white">
            <div className="flex items-center gap-2.5 flex-wrap mb-4">
              <span className="px-3.5 py-1 rounded-full bg-[#0284C7] text-white text-xs font-bold shadow-2xs">
                {note.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold border border-[#BAE6FD]">
                {note.classGrade}
              </span>
              {note.isPinned && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 border border-amber-200">
                  <Pin className="w-3 h-3 fill-current" />
                  <span>Catatan Utama</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-light font-heading text-[#0F172A] leading-tight tracking-tight mb-6">
              {note.title}
            </h1>

            {/* Author and Date Meta Card */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-3.5">
                <img
                  src={TEACHER_INFO.avatar}
                  alt={note.authorName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#38BDF8] shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#0F172A]">{note.authorName}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#E0F2FE] text-[#0284C7] font-semibold">
                      Pengajar
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B]">{TEACHER_INFO.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0284C7]" />
                  <span>Diterbitkan: {note.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#EF4444] fill-current" />
                  <span>{likes} Apresiasi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attached Image / Blackboard Banner (If any) */}
          {note.imageUrl && (
            <div className="relative bg-[#0F172A] border-b border-[#E2E8F0] group overflow-hidden">
              <img
                src={note.imageUrl}
                alt={note.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[460px] object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Lightbox Trigger Button */}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Perbesar Gambar</span>
              </button>

              <div className="absolute bottom-4 left-6 text-white text-xs font-medium backdrop-blur-sm bg-black/40 px-3 py-1.5 rounded-lg border border-white/15">
                📸 Dokumentasi Papan Tulis / Visual Materi Pembelajaran Kimia
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Main Explanation Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0284C7]">
                <BookOpen className="w-4 h-4" />
                <span>Ringkasan Konsep Materi</span>
              </div>
              <div className="text-base sm:text-lg text-[#334155] leading-relaxed whitespace-pre-line font-normal">
                {note.content}
              </div>
            </div>

            {/* Prominent Formula & Key Takeaways Board */}
            {note.keyPoints && note.keyPoints.length > 0 && (
              <div className="p-6 sm:p-8 rounded-[24px] bg-[#F0F9FF] border border-[#BAE6FD] shadow-xs space-y-4 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#BAE6FD] pb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
                        Rumus Kunci & Poin Penting
                      </h3>
                      <p className="text-xs text-[#0369A1]">
                        Hafalkan poin-poin esensial berikut untuk mempermudah pengerjaan soal
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyFormulasOnly}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
                  >
                    {copiedFormulas ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormulas ? 'Poin Tersalin!' : 'Salin Poin Rumus'}</span>
                  </button>
                </div>

                <ul className="space-y-3 pt-1">
                  {note.keyPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E0F2FE] text-xs sm:text-sm text-[#0F172A] shadow-2xs"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#0284C7] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed font-mono sm:font-sans font-medium text-[#1E293B]">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tag Cloud */}
            {note.tags && note.tags.length > 0 && (
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#64748B] flex items-center gap-1 mr-1">
                  <Tag className="w-3.5 h-3.5 text-[#0284C7]" />
                  Tagar Terkait:
                </span>
                {note.tags.map((tg, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-xs font-medium transition-colors"
                  >
                    #{tg}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Interaction & Action Bar */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-[#EF4444] text-white shadow-xs'
                      : 'bg-white hover:bg-[#FEE2E2] text-[#64748B] hover:text-[#EF4444] border border-[#CBD5E1]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{hasLiked ? 'Disukai' : 'Suka Catatan'} ({likes})</span>
                </button>

                <button
                  onClick={handleCopySummary}
                  className="px-4 py-2 rounded-full bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#CBD5E1] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSummary ? 'Ringkasan Disalin!' : 'Salin Lengkap Materi'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenMainPortal}
                  className="px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Buka di Portal Pembelajaran</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </article>

        {/* Related Notes Recommendation Section */}
        {relatedNotes.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0F172A]">
                  Catatan Kimia Terkait Lainnya
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Lanjutkan eksplorasi materi di jenjang {note.classGrade} dan topik {note.category}
                </p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua Catatan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedNotes.map((relNote) => (
                <div
                  key={relNote.id}
                  onClick={() => onSelectNote(relNote)}
                  className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:border-[#0284C7] hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold">
                        {relNote.category}
                      </span>
                      <span className="text-[#94A3B8]">{relNote.classGrade}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors leading-snug">
                      {relNote.title}
                    </h4>

                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {relNote.content}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#0284C7] font-semibold">
                    <span>Baca Catatan Lengkap</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* LIGHTBOX MODAL FOR IMAGE */}
      <AnimatePresence>
        {isLightboxOpen && note.imageUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={note.imageUrl}
                alt={note.title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/20"
              />
              <p className="text-white text-xs sm:text-sm mt-3 text-center font-medium bg-black/50 px-4 py-1.5 rounded-full">
                {note.title} — Papan Tulis Kelas Pak Hafiz
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN EDIT MODAL */}
      <AnimatePresence>
        {isEditModalOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] my-auto max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">Edit Catatan Kelas</h3>
                    <p className="text-xs text-[#64748B]">Mode Guru / Admin Pak Hafiz</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#0F172A]">Judul Catatan</label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateInEdit}
                      className="px-2 py-0.5 rounded-md bg-[#E0F2FE] hover:bg-[#0284C7] text-[#0369A1] hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-[#BAE6FD]"
                      title="Isi otomatis deskripsi, rumus, dan tag dari judul"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>✨ Buat Otomatis dari Judul</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] font-semibold text-[#0F172A] focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Jenjang Kelas</label>
                    <select
                      value={editGrade}
                      onChange={(e) => setEditGrade(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    >
                      <option value="Semua Tingkat">Semua Tingkat</option>
                      <option value="Kelas X">Kelas X</option>
                      <option value="Kelas XI">Kelas XI</option>
                      <option value="Kelas XII">Kelas XII</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Kategori Topik</label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#0F172A]">Foto / Gambar Papan Tulis</label>
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={handleUploadEditImage}
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => editFileInputRef.current?.click()}
                      className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CloudUpload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Mengunggah...' : 'Unggah Foto Baru (Cloud)'}</span>
                    </button>
                  </div>

                  {isUploading && (
                    <div className="p-2.5 rounded-xl bg-[#E0F2FE] border border-[#0284C7]/30 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-[#0284C7] animate-spin shrink-0" />
                      <div className="flex-grow">
                        <div className="w-full bg-[#BAE6FD] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#0284C7] h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#0369A1]">{uploadProgress}%</span>
                    </div>
                  )}

                  <input
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    placeholder="URL Foto atau hasil unggahan cloud (https://...)"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A]"
                  />

                  {editImageUrl && (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-[#CBD5E1] bg-black/5 mt-1">
                      <img src={editImageUrl} alt="Pratinjau" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditImageUrl('')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-[#EF4444] text-[9px]"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Isi Ringkasan Materi</label>
                  <textarea
                    rows={4}
                    required
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] leading-relaxed"
                  />
                </div>

                {/* Key Points */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A]">Poin-poin Rumus</label>
                    <button
                      type="button"
                      onClick={() => setEditKeyPoints([...editKeyPoints, ''])}
                      className="text-[#0284C7] font-bold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Tambah Poin
                    </button>
                  </div>
                  {editKeyPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const copy = [...editKeyPoints];
                          copy[idx] = e.target.value;
                          setEditKeyPoints(copy);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A]"
                      />
                      <button
                        type="button"
                        onClick={() => setEditKeyPoints(editKeyPoints.filter((_, i) => i !== idx))}
                        className="p-1.5 text-[#EF4444] hover:bg-[#FEE2E2] rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="pinEdit"
                    checked={editIsPinned}
                    onChange={(e) => setEditIsPinned(e.target.checked)}
                    className="rounded text-[#0284C7] focus:ring-[#0284C7]"
                  />
                  <label htmlFor="pinEdit" className="text-xs font-semibold text-[#0F172A]">
                    Sematkan di Atas (Pin to top)
                  </label>
                </div>

                <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-semibold text-[#64748B]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#0284C7] text-white text-xs font-bold shadow-xs hover:bg-[#0369A1]"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADMIN DELETE MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && isAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-[#0F172A]">Hapus Catatan Ini?</h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Catatan "{note.title}" akan dihapus secara permanen dari papan kelas.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-semibold text-[#64748B]"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-6 py-2 rounded-full bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626]"
                >
                  Ya, Hapus Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
