import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Pin,
  Tag,
  FlaskConical,
  Clock,
  Layers,
  Wand2,
  Atom,
  Eye,
  Loader2,
  RefreshCw,
  Zap,
  HelpCircle
} from 'lucide-react';
import { PracticalVideoItem } from '../../types';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeWatchUrl } from '../../utils/youtube';
import {
  fetchYouTubeOEmbedMetadata,
  generatePracticalVideoFromLinkOrTitle
} from '../../lib/chemistryAutoGenerator';

interface AddYouTubeVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (video: PracticalVideoItem) => void;
  initialVideo?: PracticalVideoItem | null;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
}

const CATEGORY_OPTIONS = [
  'Indikator Alami',
  'Eksperimen Lab',
  'Titrasi Asam Basa',
  'Larutan Elektrolit',
  'Sistem Koloid',
  'Termokimia',
  'Laju Reaksi',
  'Reaksi Redoks & Elektrokimia',
  'Karya Siswa'
];

const PRESET_VIDEOS = [
  {
    title: 'Praktikum Indikator Alami Asam Basa: Kunyit & Telang',
    url: 'https://www.youtube.com/watch?v=kYdK8N-2b_U',
    category: 'Indikator Alami',
    badge: 'Kelas 11',
    duration: '06:45',
    desc: 'Demonstrasi uji sifat asam basa larutan rumah tangga menggunakan ekstrak kunyit dan bunga telang.'
  },
  {
    title: 'Teknik Titrasi Asam Basa & Penentuan Titik Akhir PP',
    url: 'https://www.youtube.com/watch?v=sFpFCPTDv2w',
    category: 'Titrasi Asam Basa',
    badge: 'Kelas 11',
    duration: '08:20',
    desc: 'Panduan membaca meniskus buret, tetesan titran NaOH, dan deteksi warna merah muda seulas.'
  },
  {
    title: 'Uji Daya Hantar Listrik Larutan Elektrolit & Non-Elektrolit',
    url: 'https://www.youtube.com/watch?v=t_98g0B4yFw',
    category: 'Larutan Elektrolit',
    badge: 'Kelas 10',
    duration: '05:15',
    desc: 'Uji nyala lampu dan gelembung gas pada elektroda larutan garam, gula, dan cuka.'
  },
  {
    title: 'Praktikum Reaksi Redoks & Sel Volta Jeruk Nipis',
    url: 'https://www.youtube.com/watch?v=b4dK9P-3c_V',
    category: 'Reaksi Redoks & Elektrokimia',
    badge: 'Kelas 12',
    duration: '07:10',
    desc: 'Eksperimen pembuktian reaksi redoks spontan menjadi energi listrik DC pada baterai buah.'
  }
];

const GRADE_OPTIONS = [
  'Kelas 10',
  'Kelas 11',
  'Kelas 12',
  'Semua Kelas'
];

export const AddYouTubeVideoModal: React.FC<AddYouTubeVideoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialVideo = null,
  onAddToast = (_title: string, _desc?: string, _type?: 'success' | 'info') => {}
}) => {
  const isEditing = !!initialVideo;

  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [extractedId, setExtractedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Indikator Alami');
  const [customCategory, setCustomCategory] = useState('');
  const [badge, setBadge] = useState('Kelas 11');
  const [duration, setDuration] = useState('06:00');
  const [description, setDescription] = useState('');
  const [chemistryConcept, setChemistryConcept] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Generation States
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialVideo) {
        setYoutubeUrl(initialVideo.youtubeUrl || getYouTubeWatchUrl(initialVideo.youtubeId));
        setExtractedId(initialVideo.youtubeId);
        setTitle(initialVideo.title);
        setCategory(initialVideo.category);
        setBadge(initialVideo.badge || 'Kelas 11');
        setDuration(initialVideo.duration || '06:00');
        setDescription(initialVideo.description);
        setChemistryConcept(initialVideo.chemistryConcept || '');
        setIsPinned(!!initialVideo.isPinned);
        setAiGeneratedSuccess(false);
      } else {
        setYoutubeUrl('');
        setExtractedId(null);
        setTitle('');
        setCategory('Indikator Alami');
        setCustomCategory('');
        setBadge('Kelas 11');
        setDuration('06:00');
        setDescription('');
        setChemistryConcept('');
        setIsPinned(false);
        setAiGeneratedSuccess(false);
      }
    }
  }, [isOpen, initialVideo]);

  // Execute AI auto-generator based on URL/ID and video metadata
  const handleAutoGenerateWithAI = async (urlOverride?: string, quiet = false) => {
    const targetUrl = (urlOverride || youtubeUrl).trim();
    const id = extractYouTubeId(targetUrl);

    if (!targetUrl) {
      onAddToast('Tautan Diperlukan', 'Harap masukkan link video YouTube terlebih dahulu untuk dibuatkan otomatis oleh AI.', 'info');
      return;
    }

    if (!id) {
      onAddToast('Link YouTube Belum Valid', 'Format link YouTube belum dikenali. Pastikan memasukkan tautan YouTube yang benar.', 'info');
      return;
    }

    setIsAIGenerating(true);
    setAiStatusMessage('Menganalisis tautan YouTube & mengambil data video...');

    try {
      // 1. Try to fetch real YouTube metadata via public oEmbed endpoint
      let oembedTitle = '';
      try {
        const metadata = await fetchYouTubeOEmbedMetadata(targetUrl);
        if (metadata?.title) {
          oembedTitle = metadata.title;
        }
      } catch (err) {
        console.warn('oEmbed fetch skipped, continuing with intelligent keyword AI analysis', err);
      }

      setAiStatusMessage('Mengekstrak konsep reaksi kimia & menyusun panduan lab...');
      // Small delay for smooth AI effect
      await new Promise((r) => setTimeout(r, 450));

      // 2. Generate chemistry video data using our AI engine
      const queryContext = oembedTitle || title || targetUrl;
      const aiData = generatePracticalVideoFromLinkOrTitle(queryContext, category, badge);

      // 3. Apply generated fields
      setTitle(aiData.title);
      setCategory(aiData.category);
      setBadge(aiData.badge);
      setDuration(aiData.duration);
      setDescription(aiData.description);
      setChemistryConcept(aiData.chemistryConcept);

      setAiGeneratedSuccess(true);

      if (!quiet) {
        onAddToast(
          '✨ Berhasil Dibuat Otomatis dengan AI!',
          `Judul, kategori (${aiData.category}), deskripsi praktikum, dan konsep reaksi kimia telah disesuaikan otomatis.`,
          'success'
        );
      }
    } catch (error) {
      console.error('Error during AI auto generation:', error);
      onAddToast('Gagal Menganalisis dengan AI', 'Terjadi kendala saat menganalisis video. Anda dapat mengisi form secara manual.', 'info');
    } finally {
      setIsAIGenerating(false);
      setAiStatusMessage('');
    }
  };

  // Handle URL change with auto-detection of ID & optional AI trigger
  const handleUrlChange = (value: string) => {
    setYoutubeUrl(value);
    const id = extractYouTubeId(value);
    setExtractedId(id);

    // If a complete new valid YouTube link is pasted on empty form, automatically trigger AI!
    if (id && !title && !description && !isEditing && value.length > 15) {
      handleAutoGenerateWithAI(value, false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_VIDEOS[0]) => {
    setYoutubeUrl(preset.url);
    const id = extractYouTubeId(preset.url);
    setExtractedId(id);
    handleAutoGenerateWithAI(preset.url, false);
  };

  // Quick single-field AI regenerators
  const handleRegenerateDescriptionAI = () => {
    const context = title || youtubeUrl || 'Praktikum Kimia';
    const aiData = generatePracticalVideoFromLinkOrTitle(context, category, badge);
    setDescription(aiData.description);
    onAddToast('Deskripsi Diperbarui AI', 'Deskripsi dan tahapan praktikum telah digenerate ulang.', 'success');
  };

  const handleRegenerateConceptAI = () => {
    const context = title || youtubeUrl || 'Praktikum Kimia';
    const aiData = generatePracticalVideoFromLinkOrTitle(context, category, badge);
    setChemistryConcept(aiData.chemistryConcept);
    onAddToast('Konsep Kimia Diperbarui AI', 'Prinsip reaksi kimia telah diekstrak dan diperbarui.', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = extractYouTubeId(youtubeUrl);
    if (!id) {
      onAddToast('Tautan YouTube Tidak Valid', 'Harap masukkan link video YouTube yang valid (contoh: https://www.youtube.com/watch?v=... atau https://youtu.be/...)', 'info');
      return;
    }

    if (!title.trim()) {
      onAddToast('Judul Video Diperlukan', 'Harap masukkan judul video praktikum.', 'info');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const dateFormatted = `${now.getDate()} ${
      ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][now.getMonth()]
    } ${now.getFullYear()}`;

    const finalCategory = category === 'Lainnya' && customCategory.trim() ? customCategory.trim() : category;

    const videoItem: PracticalVideoItem = {
      id: initialVideo?.id || `vid-${Date.now()}`,
      title: title.trim(),
      youtubeUrl: youtubeUrl.trim(),
      youtubeId: id,
      thumbnailUrl: getYouTubeThumbnail(id),
      category: finalCategory,
      badge: badge.trim() || 'Video Praktikum Siswa',
      duration: duration.trim() || undefined,
      date: initialVideo?.date || dateFormatted,
      description: description.trim() || 'Dokumentasi video praktikum kimia siswa.',
      chemistryConcept: chemistryConcept.trim() || undefined,
      isPinned: isPinned
    };

    onSave(videoItem);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const previewThumbnail = extractedId ? getYouTubeThumbnail(extractedId) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#E2E8F0] my-auto"
        >
          {/* Header */}
          <div className="bg-linear-to-r from-[#0F172A] via-[#1E293B] to-[#0284C7] text-white p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#EF4444] to-[#F97316] text-white flex items-center justify-center shadow-md">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#38BDF8] block">
                    {isEditing ? 'Perbarui Video' : 'Akun Guru · Otomatisasi AI'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0284C7]/30 border border-[#38BDF8]/40 text-[#BAE6FD] text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#38BDF8]" />
                    <span>AI Enabled</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isEditing ? 'Edit Video Praktikum YouTube' : 'Tambah Video Praktikum Otomatis (AI)'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto custom-scrollbar">
            
            {/* AI Banner: Auto Generate Feature */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-[#F0F9FF] via-[#E0F2FE] to-[#EFF6FF] border border-[#BAE6FD] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-linear-to-tr from-[#0284C7] to-[#0EA5E9] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="font-bold text-xs sm:text-sm text-[#0369A1] flex items-center gap-1.5">
                      <span>Buat Otomatis dengan AI dari Link Video</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#0284C7] text-white font-bold">Smart AI</span>
                    </strong>
                    <p className="text-[11px] text-[#0284C7]/80 mt-0.5 leading-relaxed">
                      Tempelkan tautan YouTube di bawah, lalu klik tombol AI untuk otomatis membuat <strong>Judul Standar, Deskripsi Langkah Lab, Kategori,</strong> dan <strong>Konsep Reaksi Kimia</strong>!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAutoGenerateWithAI()}
                  disabled={isAIGenerating || !youtubeUrl}
                  className="px-3.5 py-2 rounded-xl bg-linear-to-r from-[#0284C7] to-[#2563EB] hover:from-[#0369A1] hover:to-[#1D4ED8] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {isAIGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>✨ Buat Otomatis AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Message when generating */}
              {isAIGenerating && (
                <div className="mt-3 pt-2.5 border-t border-[#BAE6FD]/70 flex items-center gap-2 text-xs font-medium text-[#0284C7] animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0284C7]" />
                  <span>{aiStatusMessage || 'Sedang memproses video...'}</span>
                </div>
              )}

              {/* AI Success notice */}
              {aiGeneratedSuccess && !isAIGenerating && (
                <div className="mt-3 pt-2.5 border-t border-[#BAE6FD]/70 flex items-center justify-between text-xs text-[#059669]">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Data video, deskripsi & konsep kimia berhasil digenerate otomatis!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAutoGenerateWithAI(undefined, false)}
                    className="text-[11px] text-[#0284C7] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
              )}
            </div>

            {/* Input 1: YouTube Link */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#EF4444]" />
                  <span>Tautan / Link Video YouTube <span className="text-[#EF4444]">*</span></span>
                </span>
                {extractedId && (
                  <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1 normal-case">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ID: {extractedId}</span>
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="Tempel link: https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className="w-full px-4 py-2.5 pr-28 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs sm:text-sm text-[#0F172A] transition-all bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAutoGenerateWithAI()}
                  disabled={!youtubeUrl || isAIGenerating}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Isi</span>
                </button>
              </div>
            </div>

            {/* Live Video / Thumbnail Preview if detected */}
            {previewThumbnail && (
              <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] flex items-center gap-4">
                <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-black shrink-0 shadow-xs border border-black/10">
                  <img
                    src={previewThumbnail}
                    alt="Preview Thumbnail"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#EF4444] text-white flex items-center justify-center shadow-xs">
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A] block">
                      ✓ Thumbnail & Video Terhubung
                    </span>
                    {aiGeneratedSuccess && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#ECFDF5] text-[#059669] text-[9px] font-bold border border-[#A7F3D0]">
                        AI Synced
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#0F172A] truncate mt-0.5">
                    {title || 'Menunggu Analisis AI / Judul Video'}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Thumbnail resolusi tinggi otomatis tersambung dari server YouTube.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Presets for Teacher convenience */}
            {!isEditing && (
              <div>
                <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1 mb-1.5">
                  <Zap className="w-3 h-3 text-[#F59E0B]" />
                  <span>Contoh link video praktikum kimia (1-Klik Uji Coba AI):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_VIDEOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E0F2FE] hover:text-[#0284C7] hover:border-[#BAE6FD] text-[#475569] text-[11px] font-medium border border-[#E2E8F0] transition-all cursor-pointer text-left flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#0284C7]" />
                      <span>{preset.category}: {preset.title.slice(0, 22)}...</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input 2: Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Judul Video Praktikum <span className="text-[#EF4444]">*</span></span>
                </label>
                {title && (
                  <button
                    type="button"
                    onClick={() => {
                      const aiData = generatePracticalVideoFromLinkOrTitle(title || youtubeUrl, category, badge);
                      setTitle(aiData.title);
                      onAddToast('Judul Disempurnakan AI', 'Judul praktikum telah distandarisasi.', 'info');
                    }}
                    className="text-[10px] text-[#0284C7] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Wand2 className="w-2.5 h-2.5" />
                    <span>Rapikan Judul dengan AI</span>
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Praktikum Titrasi Asam Basa: Standarisasi Larutan HCl dengan Indikator PP"
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs sm:text-sm text-[#0F172A] transition-all bg-white"
              />
            </div>

            {/* Row: Category, Pilihan Kelas, Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Kategori Topik</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs text-[#0F172A] transition-all bg-white"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Lainnya">+ Kategori Kustom</option>
                </select>
                {category === 'Lainnya' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Ketik kategori baru..."
                    className="w-full mt-1.5 px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A]"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Pilihan Kelas</span>
                </label>
                <div className="space-y-1.5">
                  {/* Suggestion pills for Kelas 10, 11, 12 */}
                  <div className="flex items-center gap-1">
                    {GRADE_OPTIONS.map((grade) => {
                      const isSelected = badge.trim().toLowerCase() === grade.toLowerCase();
                      return (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setBadge(grade)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                              : 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0] hover:bg-[#E0F2FE] hover:text-[#0284C7] hover:border-[#BAE6FD]'
                          }`}
                        >
                          {grade}
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Contoh: Kelas 10, Kelas 11, Kelas 12"
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs text-[#0F172A] transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Durasi Video</span>
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="06:45"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs text-[#0F172A] transition-all bg-white font-mono"
                />
              </div>
            </div>

            {/* Input 3: Description with AI button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Deskripsi Video</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateDescriptionAI}
                  className="text-[10px] text-[#0284C7] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 className="w-2.5 h-2.5" />
                  <span>Generate Deskripsi AI</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan deskripsi video praktikum, ringkasan prosedur, atau langkah pengamatan..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs sm:text-sm text-[#0F172A] transition-all bg-white resize-none leading-relaxed"
              />
            </div>

            {/* Input 4: Chemistry Concept with AI button */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Konsep & Persamaan Reaksi Kimia (AI Generated)</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateConceptAI}
                  className="text-[10px] text-[#16A34A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Generate Konsep AI</span>
                </button>
              </div>
              <textarea
                rows={2}
                value={chemistryConcept}
                onChange={(e) => setChemistryConcept(e.target.value)}
                placeholder="Penjelasan reaksi ilmiah: misal Reaksi netralisasi stoikiometris H⁺ + OH⁻ → H₂O..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 text-xs sm:text-sm text-[#0F172A] transition-all bg-white resize-none leading-relaxed"
              />
            </div>

            {/* Input 5: Pin Toggle */}
            <div className="p-3 bg-[#FEF3C7] rounded-xl border border-[#FDE68A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Pin className="w-4 h-4 text-[#D97706] shrink-0" />
                <div>
                  <span className="text-xs font-bold text-[#92400E] block">Sematkan di Depan Baris Video</span>
                  <span className="text-[11px] text-[#B45309]">Video ini akan selalu berada di urutan terdepan.</span>
                </div>
              </div>
              <input
                type="checkbox"
                id="pinToggle"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-[#D97706] focus:ring-[#D97706] cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !youtubeUrl}
                className="px-6 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isEditing ? 'Simpan Perubahan' : 'Simpan Video Praktikum'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
