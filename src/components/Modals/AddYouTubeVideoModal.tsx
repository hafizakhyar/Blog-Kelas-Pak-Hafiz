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
  Eye
} from 'lucide-react';
import { PracticalVideoItem } from '../../types';
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeWatchUrl } from '../../utils/youtube';

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
    badge: 'Video Utama Kelas XI',
    duration: '06:45',
    desc: 'Demonstrasi uji sifat asam basa larutan rumah tangga menggunakan ekstrak kunyit dan bunga telang.'
  },
  {
    title: 'Teknik Titrasi Asam Basa & Penentuan Titik Akhir PP',
    url: 'https://www.youtube.com/watch?v=sFpFCPTDv2w',
    category: 'Eksperimen Lab',
    badge: 'Keterampilan Lab',
    duration: '08:20',
    desc: 'Panduan membaca meniskus buret, tetesan titran NaOH, dan deteksi warna merah muda seulas.'
  },
  {
    title: 'Uji Daya Hantar Listrik Larutan Elektrolit & Non-Elektrolit',
    url: 'https://www.youtube.com/watch?v=t_98g0B4yFw',
    category: 'Larutan Elektrolit',
    badge: 'Eksperimen Kelas X',
    duration: '05:15',
    desc: 'Uji nyala lampu dan gelembung gas pada elektroda larutan garam, gula, dan cuka.'
  }
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
  const [badge, setBadge] = useState('Video Praktikum');
  const [duration, setDuration] = useState('06:00');
  const [description, setDescription] = useState('');
  const [chemistryConcept, setChemistryConcept] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialVideo) {
        setYoutubeUrl(initialVideo.youtubeUrl || getYouTubeWatchUrl(initialVideo.youtubeId));
        setExtractedId(initialVideo.youtubeId);
        setTitle(initialVideo.title);
        setCategory(initialVideo.category);
        setBadge(initialVideo.badge || 'Video Praktikum');
        setDuration(initialVideo.duration || '06:00');
        setDescription(initialVideo.description);
        setChemistryConcept(initialVideo.chemistryConcept || '');
        setIsPinned(!!initialVideo.isPinned);
      } else {
        setYoutubeUrl('');
        setExtractedId(null);
        setTitle('');
        setCategory('Indikator Alami');
        setCustomCategory('');
        setBadge('Video Praktikum Siswa');
        setDuration('06:00');
        setDescription('');
        setChemistryConcept('');
        setIsPinned(false);
      }
    }
  }, [isOpen, initialVideo]);

  // Handle URL change with auto-detection of ID & auto title suggestion
  const handleUrlChange = (value: string) => {
    setYoutubeUrl(value);
    const id = extractYouTubeId(value);
    setExtractedId(id);

    if (id && !title && !isEditing) {
      // Auto suggest default title if empty
      setTitle('Praktikum Kimia Laboratorium (YouTube)');
      if (!description) {
        setDescription('Video panduan dan dokumentasi eksperimen kimia praktikum siswa di laboratorium SMA.');
      }
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_VIDEOS[0]) => {
    setYoutubeUrl(preset.url);
    const id = extractYouTubeId(preset.url);
    setExtractedId(id);
    setTitle(preset.title);
    setCategory(preset.category);
    setBadge(preset.badge);
    setDuration(preset.duration);
    setDescription(preset.desc);
    onAddToast('Contoh Video Dimuat', `Tautan dan judul ${preset.title} diterapkan.`, 'info');
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
      badge: badge.trim() || 'Video Praktikum',
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
              <div className="w-10 h-10 rounded-xl bg-[#EF4444] text-white flex items-center justify-center shadow-md">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#38BDF8] block">
                  {isEditing ? 'Perbarui Video' : 'Akun Guru · Input Link'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isEditing ? 'Edit Video Praktikum YouTube' : 'Tambah Video Praktikum YouTube'}
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
            
            {/* Quick Helper Notice */}
            <div className="p-3.5 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs text-[#0369A1] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-[#0284C7]">Cukup Tempelkan Link Video YouTube</strong>
                Sistem akan otomatis mendeteksi ID video dan thumbnail. Anda juga dapat menyesuaikan judul, kategori, durasi, dan penjelasan reaksi kimianya.
              </div>
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
              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs sm:text-sm text-[#0F172A] transition-all bg-white"
              />
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A] block">
                    ✓ Video YouTube Siap Ditampilkan
                  </span>
                  <p className="text-xs font-semibold text-[#0F172A] truncate mt-0.5">
                    {title || 'Judul Video'}
                  </p>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Thumbnail otomatis diambil dari server resmi YouTube.
                  </p>
                </div>
              </div>
            )}

            {/* Quick Presets for Teacher convenience */}
            {!isEditing && (
              <div>
                <span className="text-[11px] font-semibold text-[#64748B] block mb-1.5">
                  Atau gunakan contoh video praktikum kimia cepat:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_VIDEOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E0F2FE] hover:text-[#0284C7] text-[#475569] text-[11px] font-medium border border-[#E2E8F0] transition-colors cursor-pointer text-left"
                    >
                      {preset.category}: {preset.title.slice(0, 24)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input 2: Title */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Judul Video Praktikum <span className="text-[#EF4444]">*</span></span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Praktikum Titrasi Asam Basa & Penentuan Titik Akhir..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs sm:text-sm text-[#0F172A] transition-all bg-white"
              />
            </div>

            {/* Row: Category, Badge, Duration */}
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
                  <span>Label / Badge</span>
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Video Utama Kelas XI"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs text-[#0F172A] transition-all bg-white"
                />
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
                  placeholder="06:30"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs text-[#0F172A] transition-all bg-white"
                />
              </div>
            </div>

            {/* Input 3: Description */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <FlaskConical className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Deskripsi & Panduan Praktikum</span>
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jelaskan ringkasan prosedur, langkah pengamatan, atau tujuan praktikum..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 text-xs sm:text-sm text-[#0F172A] transition-all bg-white resize-none"
              />
            </div>

            {/* Input 4: Chemistry Concept (Optional) */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Atom className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Konsep / Reaksi Kimia (Opsional)</span>
              </label>
              <input
                type="text"
                value={chemistryConcept}
                onChange={(e) => setChemistryConcept(e.target.value)}
                placeholder="Contoh: Kurva titrasi asam lemah - basa kuat dan reaksi netralisasi..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 text-xs sm:text-sm text-[#0F172A] transition-all bg-white"
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
