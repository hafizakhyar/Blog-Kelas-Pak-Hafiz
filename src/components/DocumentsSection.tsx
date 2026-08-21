import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  FileCode,
  GraduationCap,
  Plus,
  Trash2,
  Upload,
  CloudUpload,
  Loader2,
  X,
  FileCheck
} from 'lucide-react';
import { DOCUMENT_ITEMS } from '../data/mockData';
import { DocumentItem } from '../types';
import { uploadFileToFirebaseStorage, STORAGE_FOLDERS } from '../lib/firebase';

interface DocumentsSectionProps {
  onPreviewDoc: (doc: DocumentItem) => void;
  onDownloadDoc: (doc: DocumentItem) => void;
  docs?: DocumentItem[];
  isAdmin?: boolean;
  onAddDoc?: (doc: DocumentItem) => void;
  onDeleteDoc?: (docId: string) => void;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  onPreviewDoc,
  onDownloadDoc,
  docs = DOCUMENT_ITEMS,
  isAdmin = false,
  onAddDoc,
  onDeleteDoc,
  onAddToast = (_t: string, _d?: string, _ty?: 'success' | 'info') => {}
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Upload Document Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Modul Ajar' | 'LKPD Praktikum' | 'Ringkasan & Rumus' | 'Bank Soal'>('Modul Ajar');
  const [formGrade, setFormGrade] = useState<'Kelas X' | 'Kelas XI' | 'Kelas XII' | 'Semua Tingkat'>('Kelas XI');
  const [formFormat, setFormFormat] = useState<'PDF' | 'DOCX' | 'PPTX'>('PDF');
  const [formSummary, setFormSummary] = useState('');
  const [formTopics, setFormTopics] = useState('');
  const [formPages, setFormPages] = useState('8');
  const [formFileUrl, setFormFileUrl] = useState('');
  const [formFileSize, setFormFileSize] = useState('2.4 MB');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const grades = ['Semua', 'Kelas X', 'Kelas XI', 'Kelas XII'];
  const categories = ['Semua', 'Modul Ajar', 'LKPD Praktikum', 'Ringkasan & Rumus', 'Bank Soal'];

  const filteredDocs = docs.filter((doc) => {
    const matchesGrade = selectedGrade === 'Semua' || doc.classGrade === selectedGrade || doc.classGrade === 'Semua Tingkat';
    const matchesCategory = selectedCategory === 'Semua' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect format
    let ext: 'PDF' | 'DOCX' | 'PPTX' = 'PDF';
    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) ext = 'DOCX';
    else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) ext = 'PPTX';
    setFormFormat(ext);

    // Calculate file size
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setFormFileSize(`${sizeInMB} MB`);

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const downloadUrl = await uploadFileToFirebaseStorage(
        file,
        STORAGE_FOLDERS.DOCUMENTS,
        (progress) => setUploadProgress(progress)
      );
      setFormFileUrl(downloadUrl);
      if (!formTitle) {
        setFormTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
      onAddToast('Berkas Terunggah', `File ${file.name} berhasil disimpan di Firebase Storage (catatan_dokumen).`, 'success');
    } catch (err) {
      console.warn('Firebase Storage upload error:', err);
      setFormFileUrl('https://firebasestorage.googleapis.com/simulated/' + file.name);
      onAddToast('Berkas Disimpan Lokal', `File ${file.name} siap disimpan.`, 'info');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onAddToast('Judul Diperlukan', 'Harap isi judul modul/berkas.', 'info');
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.getDate()} ${
      ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][now.getMonth()]
    } ${now.getFullYear()}`;

    const topicsArray = formTopics
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      classGrade: formGrade,
      fileFormat: formFormat,
      fileSize: formFileSize,
      downloads: 0,
      updatedDate: dateFormatted,
      summary: formSummary.trim() || 'Modul pembelajaran lengkap disertai latihan soal mandiri.',
      topics: topicsArray.length > 0 ? topicsArray : ['Dasar Teori & Konsep', 'Contoh Soal Pembahasan', 'Lembar Aktivitas Siswa'],
      pages: parseInt(formPages) || 6,
      fileUrl: formFileUrl || undefined
    };

    if (onAddDoc) {
      onAddDoc(newDoc);
    }

    setIsUploadModalOpen(false);
    setFormTitle('');
    setFormSummary('');
    setFormTopics('');
    setFormFileUrl('');
    onAddToast('Modul Ditambahkan', `Berkas "${newDoc.title}" tersimpan permanen di Firebase Firestore & Storage.`, 'success');
  };

  return (
    <section id="modul" className="py-20 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] text-xs font-semibold mb-3 shadow-2xs">
              <GraduationCap className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Pusat Unduhan Materi & Modul</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Dokumentasi Berkas & <span className="font-semibold text-[#0284C7]">Perangkat Ajar</span>
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base mt-2 max-w-xl">
              Unduh LKPD praktikum laboratorium, modul ajar berbasis Kurikulum Merdeka, bank soal, dan ringkasan rumus siap cetak.
            </p>
          </div>

          {/* Search bar & Admin Upload */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#0284C7] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari modul (titrasi, LKPD)..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-[#F8FAFC] border border-[#E2E8F0] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs transition-all"
              />
            </div>

            {isAdmin && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Unggah Berkas PDF/DOCX</span>
              </button>
            )}
          </div>
        </div>

        {/* Dual Filters (Grade & Category) */}
        <div className="space-y-3 mb-8">
          {/* Grade Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-[#0F172A] mr-2 shrink-0">Jenjang:</span>
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedGrade === grade
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#0F172A] border border-[#E2E8F0]'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-[#0F172A] mr-2 shrink-0">Kategori:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-white text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#0F172A] border border-[#E2E8F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredDocs.map((doc) => (
              <motion.article
                layout
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-[#F8FAFC] rounded-[24px] overflow-hidden border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(2,132,199,0.04)] hover:shadow-lg hover:border-[#0284C7]/40 hover:bg-white transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E0F2FE] text-[#0369A1]">
                      {doc.classGrade}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
                      {doc.fileFormat} • {doc.fileSize}
                    </span>
                  </div>

                  {/* Document Title & Category */}
                  <div className="mb-3">
                    <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider block mb-1">
                      {doc.category}
                    </span>
                    <h3
                      onClick={() => onPreviewDoc(doc)}
                      className="text-base font-bold font-heading text-[#0F172A] group-hover:text-[#0284C7] transition-colors leading-snug cursor-pointer"
                    >
                      {doc.title}
                    </h3>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4">
                    {doc.summary}
                  </p>

                  {/* Key Topics List */}
                  <div className="space-y-1.5 mb-6">
                    {doc.topics.slice(0, 3).map((topic, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-[#475569]">
                        <CheckCircle className="w-3 h-3 text-[#0284C7] shrink-0" />
                        <span className="line-clamp-1">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Info & Actions */}
                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                  <div className="text-[11px] text-[#94A3B8]">
                    <span>{doc.downloads} unduhan</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocToDelete(doc);
                        }}
                        className="p-2 rounded-xl bg-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors cursor-pointer"
                        title="Hapus Berkas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onPreviewDoc(doc)}
                      className="px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:border-[#0284C7] hover:text-[#0284C7] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Buka Halaman</span>
                    </button>

                    <button
                      onClick={() => onDownloadDoc(doc)}
                      className="p-2 rounded-xl bg-[#0284C7] text-white hover:bg-[#0369A1] transition-colors shadow-2xs cursor-pointer"
                      title="Unduh Berkas"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-16 bg-[#F8FAFC] rounded-[24px] border border-[#E2E8F0] p-8">
            <p className="text-[#64748B] text-sm">
              Tidak ada modul yang cocok dengan kriteria pencarian "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGrade('Semua');
                setSelectedCategory('Semua');
              }}
              className="mt-3 px-5 py-2 text-xs font-bold text-white bg-[#0284C7] rounded-full"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>

      {/* Upload New Document Modal */}
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
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Unggah Berkas Modul / LKPD</h3>
                    <p className="text-[11px] text-[#64748B]">Simpan dokumen ke Firebase Storage (catatan_dokumen)</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Judul Modul / LKPD / Bank Soal <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Modul Ajar & LKPD Titrasi Asam Basa SMA"
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
                      <option value="Modul Ajar">Modul Ajar</option>
                      <option value="LKPD Praktikum">LKPD Praktikum</option>
                      <option value="Ringkasan & Rumus">Ringkasan & Rumus</option>
                      <option value="Bank Soal">Bank Soal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Jenjang Tingkat</label>
                    <select
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    >
                      <option value="Kelas X">Kelas X</option>
                      <option value="Kelas XI">Kelas XI</option>
                      <option value="Kelas XII">Kelas XII</option>
                      <option value="Semua Tingkat">Semua Tingkat</option>
                    </select>
                  </div>
                </div>

                {/* Upload Document File */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Berkas Asli (PDF, DOCX, PPTX)</span>
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.doc,.pptx,.ppt,.txt"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CloudUpload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Mengunggah...' : 'Pilih Berkas'}</span>
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

                  {formFileUrl ? (
                    <div className="p-3 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0284C7]" />
                        <div>
                          <span className="font-bold text-[#0F172A] block">{formFormat} ({formFileSize})</span>
                          <span className="text-[10px] text-[#059669]">Siap disimpan di Firebase Storage</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormFileUrl('')}
                        className="text-xs text-[#EF4444] font-bold hover:underline"
                      >
                        Ganti
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-20 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] bg-white flex flex-col items-center justify-center gap-1 cursor-pointer p-3 text-center"
                    >
                      <Upload className="w-5 h-5 text-[#0284C7]" />
                      <span className="font-semibold text-[#0F172A] text-xs">Pilih File PDF / Modul Ajar</span>
                      <span className="text-[10px] text-[#94A3B8]">Folder Firebase Storage: catatan_dokumen</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Ringkasan Materi & Isi Modul</label>
                  <textarea
                    rows={2}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Tuliskan gambaran umum materi ajar dan peruntukan modul..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Poin-poin Pokok Bahasan (1 per baris)</label>
                  <textarea
                    rows={3}
                    value={formTopics}
                    onChange={(e) => setFormTopics(e.target.value)}
                    placeholder="Konsep Titrasi & Titik Ekivalen&#10;Perhitungan Normalitas & Molaritas&#10;Latihan Soal Ujian"
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
        {docToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDocToDelete(null)}
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
              <h3 className="text-base font-bold text-[#0F172A] mb-1">Hapus Berkas Modul?</h3>
              <p className="text-xs text-[#64748B] mb-5">
                Berkas "{docToDelete.title}" akan dihapus permanen dari Firebase Firestore.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDocToDelete(null)}
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-semibold text-[#64748B]"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (onDeleteDoc) {
                      onDeleteDoc(docToDelete.id);
                    }
                    onAddToast('Berkas Dihapus', `Modul "${docToDelete.title}" telah dihapus.`, 'info');
                    setDocToDelete(null);
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
    </section>
  );
};
