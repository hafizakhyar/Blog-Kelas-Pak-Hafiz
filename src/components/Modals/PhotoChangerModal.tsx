import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Search,
  Globe,
  Image as ImageIcon,
  Check,
  Sparkles,
  ExternalLink,
  CloudUpload,
  RefreshCw,
  Layers,
  HelpCircle,
  Link as LinkIcon,
  CheckCheck
} from 'lucide-react';
import {
  CURATED_CHEMISTRY_IMAGES,
  POPULAR_IMAGE_SEARCH_TOPICS,
  searchCuratedLabImages,
  getGoogleImagesSearchUrl,
  CuratedLabImage
} from '../../lib/chemistryImageSearch';
import { uploadFileToFirebaseStorage, STORAGE_FOLDERS } from '../../lib/firebase';

interface PhotoChangerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  itemTitle: string;
  onSavePhoto: (newImageUrl: string) => void;
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

type TabType = 'upload' | 'search' | 'url';

export const PhotoChangerModal: React.FC<PhotoChangerModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  itemTitle,
  onSavePhoto,
  onAddToast
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('search');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(currentImageUrl);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedImageUrl(currentImageUrl);
      setCustomUrlInput(currentImageUrl.startsWith('http') ? currentImageUrl : '');
      setSearchQuery('');
      setImageError(false);
    }
  }, [isOpen, currentImageUrl]);

  const searchResults = searchCuratedLabImages(searchQuery || itemTitle);

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
      setSelectedImageUrl(downloadUrl);
      setImageError(false);
      onAddToast('Foto Berhasil Diunggah', 'Tersimpan di Firebase Storage (catatan_foto/galeri).', 'success');
    } catch (err) {
      console.warn('Firebase Storage upload fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const localData = event.target?.result as string;
        setSelectedImageUrl(localData);
        setImageError(false);
        onAddToast('Foto Terpasang', 'Foto disimpan secara lokal.', 'info');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleApplyCustomUrl = (url: string) => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    setSelectedImageUrl(cleanUrl);
    setImageError(false);
    onAddToast('Tautan Gambar Diterapkan', 'Pratinjau foto siap disimpan.', 'info');
  };

  const handleConfirmSave = () => {
    if (!selectedImageUrl) {
      onAddToast('Pilih Foto Terlebih Dahulu', 'Harap unggah atau pilih foto laboratorium.', 'info');
      return;
    }
    onSavePhoto(selectedImageUrl);
    onClose();
  };

  const openGoogleImagesTab = () => {
    const topicToSearch = searchQuery.trim() || itemTitle;
    const url = getGoogleImagesSearchUrl(topicToSearch);
    window.open(url, '_blank', 'noopener,noreferrer');
    onAddToast(
      'Membuka Google Images',
      'Salin alamat gambar (Right Click → Copy Image Address) lalu tempel di tab URL.',
      'info'
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-2xl border border-[#CBD5E1] p-5 sm:p-7 max-h-[92vh] overflow-y-auto z-10 my-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] font-heading">
                Ganti Foto Praktikum
              </h3>
              <p className="text-xs text-[#64748B] line-clamp-1">
                {itemTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F1F5F9] text-[#64748B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'search'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Cari Google & Sampel Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah dari File</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Tempel URL Gambar</span>
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 space-y-4">
          {/* TAB 1: SEARCH GOOGLE & CURATED LAB IMAGES */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              {/* Search Bar + Google Search Helper Button */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#0284C7] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik topik (contoh: titrasi, kunyit, buret, uji nyala)..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={openGoogleImagesTab}
                  className="px-4 py-2.5 rounded-xl bg-[#E0F2FE] hover:bg-[#0284C7] text-[#0369A1] hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer border border-[#BAE6FD] shrink-0"
                  title="Buka Google Images di tab baru dengan kata kunci yang sesuai"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Cari di Google Images</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Popular Chemistry Topics Chips */}
              <div>
                <span className="text-[11px] font-bold text-[#64748B] block mb-1.5 uppercase tracking-wider">
                  ⚡ Saran Topik Praktikum:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {POPULAR_IMAGE_SEARCH_TOPICS.map((topic, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSearchQuery(topic.label)}
                      className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E0F2FE] text-[#334155] hover:text-[#0284C7] text-xs font-medium transition-all whitespace-nowrap cursor-pointer border border-[#E2E8F0]"
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Grid */}
              <div className="border border-[#E2E8F0] rounded-2xl p-3 bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="text-xs font-bold text-[#0F172A]">
                    Pilihan Foto Laboratorium & Eksperimen Kimia ({searchResults.length}):
                  </span>
                  <span className="text-[10px] text-[#64748B]">Klik foto untuk memilih</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
                  {searchResults.map((img) => {
                    const isSelected = selectedImageUrl === img.url;
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => {
                          setSelectedImageUrl(img.url);
                          setImageError(false);
                        }}
                        className={`group relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all cursor-pointer text-left bg-black/5 ${
                          isSelected
                            ? 'border-[#0284C7] ring-2 ring-[#0284C7]/40 scale-[1.02]'
                            : 'border-transparent hover:border-[#38BDF8]'
                        }`}
                      >
                        <img
                          src={img.thumbnail}
                          alt={img.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-2 flex flex-col justify-end">
                          <span className="text-[11px] font-bold text-white leading-tight line-clamp-2">
                            {img.title}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-44 rounded-2xl border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] bg-[#F8FAFC] hover:bg-[#F0F9FF] flex flex-col items-center justify-center gap-2 cursor-pointer p-5 text-center transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#E0F2FE] group-hover:bg-[#0284C7] text-[#0284C7] group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    Klik untuk Memilih Foto dari Perangkat
                  </h4>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Mendukung JPG, PNG, WebP (Maksimal 10MB)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-white border border-[#BAE6FD] text-[#0369A1] text-[10px] font-bold shadow-2xs">
                  📁 Disimpan di Firebase Storage (catatan_foto/galeri)
                </span>
              </div>

              {isUploading && (
                <div className="p-3.5 rounded-xl bg-[#E0F2FE] border border-[#BAE6FD] space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-[#0369A1]">
                    <span>Mengunggah foto ke Cloud...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full bg-[#0284C7] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PASTE DIRECT IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs text-[#0369A1] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Tips Mendapatkan URL Gambar dari Google Images:</span>
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-[#0F172A]/80 leading-relaxed">
                  <li>Buka gambar di Google Images yang kamu sukai.</li>
                  <li>Klik kanan pada gambar & pilih <b>"Salin Alamat Gambar" (Copy Image Address)</b>.</li>
                  <li>Tempel (Paste) tautan pada kolom di bawah ini.</li>
                </ol>
              </div>

              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... atau tautan gambar langsung"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCustomUrl(customUrlInput)}
                  className="px-4 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                >
                  Terapkan URL
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={openGoogleImagesTab}
                  className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Cari referensi di Google Images</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Live Preview Box */}
          <div className="p-3.5 rounded-2xl bg-[#F1F5F9] border border-[#CBD5E1]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Pratinjau Foto Terpilih:</span>
              </span>
              {selectedImageUrl && (
                <span className="text-[10px] text-[#0284C7] font-semibold truncate max-w-xs">
                  {selectedImageUrl.startsWith('data:') ? 'Foto Lokal (Base64)' : selectedImageUrl}
                </span>
              )}
            </div>

            {selectedImageUrl && !imageError ? (
              <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-[#CBD5E1] bg-black/5 shadow-inner">
                <img
                  src={selectedImageUrl}
                  alt="Pratinjau Foto Praktikum"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-black/75 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                  <CheckCheck className="w-3 h-3 text-[#38BDF8]" />
                  <span>Foto Aktif</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-32 rounded-xl border border-dashed border-[#CBD5E1] bg-white flex flex-col items-center justify-center text-center p-3">
                <ImageIcon className="w-6 h-6 text-[#94A3B8] mb-1" />
                <p className="text-xs font-semibold text-[#64748B]">
                  {imageError ? 'Gagal memuat URL gambar. Harap periksa tautan gambar.' : 'Belum ada foto yang dipilih.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleConfirmSave}
            disabled={!selectedImageUrl || isUploading}
            className="px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-2 transition-all cursor-pointer"
          >
            <CloudUpload className="w-4 h-4" />
            <span>Terapkan & Simpan Foto</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
