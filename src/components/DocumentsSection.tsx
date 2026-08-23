import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  Eye,
  Search,
  CheckCircle,
  GraduationCap,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Unlock,
  KeyRound,
  ShieldCheck,
  LogOut,
  X,
  Link as LinkIcon,
  HelpCircle,
  CheckCheck
} from 'lucide-react';
import { DOCUMENT_ITEMS } from '../data/mockData';
import { DocumentItem } from '../types';

interface DocumentsSectionProps {
  onPreviewDoc: (doc: DocumentItem) => void;
  onDownloadDoc: (doc: DocumentItem) => void;
  docs?: DocumentItem[];
  isAdmin?: boolean;
  setIsAdmin?: React.Dispatch<React.SetStateAction<boolean>>;
  onAddDoc?: (doc: DocumentItem) => void;
  onUpdateDoc?: (doc: DocumentItem) => void;
  onDeleteDoc?: (docId: string) => void;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
}

const ADMIN_AUTH_KEY = 'kelaspakhafiz_admin_auth_v1';
const PASSCODE_STORAGE_KEY = 'kelaspakhafiz_admin_passcode_custom';
const DEFAULT_ADMIN_PASSCODE = 'hafiz2026';

const DOC_CATEGORIES = [
  'Semua',
  'Modul Ajar',
  'LKPD',
  'Materi Ajar',
  'Perangkat Ajar',
  'Soal'
] as const;

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  onPreviewDoc,
  onDownloadDoc,
  docs = DOCUMENT_ITEMS,
  isAdmin = false,
  setIsAdmin,
  onAddDoc,
  onUpdateDoc,
  onDeleteDoc,
  onAddToast = (_t: string, _d?: string, _ty?: 'success' | 'info') => {}
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Admin Passcode & Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Add / Edit Document Modal State (Judul & Link Download & Jenis Dokumen)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDriveUrl, setFormDriveUrl] = useState('');
  const [formCategory, setFormCategory] = useState<string>('Modul Ajar');
  const [formGrade, setFormGrade] = useState<string>('Kelas XI');
  const [formFormat, setFormFormat] = useState<string>('PDF');
  const [formSummary, setFormSummary] = useState('');

  // Delete Confirmation Modal
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

  // Match category helper
  const matchesCategory = (docCat: string = '', targetCat: string) => {
    if (targetCat === 'Semua') return true;
    const catLower = docCat.toLowerCase();
    const targetLower = targetCat.toLowerCase();

    if (targetCat === 'Modul Ajar') {
      return catLower.includes('modul');
    }
    if (targetCat === 'LKPD') {
      return catLower.includes('lkpd');
    }
    if (targetCat === 'Materi Ajar') {
      return catLower.includes('materi') || catLower.includes('ringkasan') || catLower.includes('rumus');
    }
    if (targetCat === 'Perangkat Ajar') {
      return catLower.includes('perangkat') || catLower.includes('rpp') || catLower.includes('atp');
    }
    if (targetCat === 'Soal') {
      return catLower.includes('soal') || catLower.includes('bank');
    }

    return catLower === targetLower;
  };

  // Filter items by category & search query
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      // 1. Category filter
      const categoryMatch = matchesCategory(doc.category, selectedCategory);
      if (!categoryMatch) return false;

      // 2. Search query filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        doc.title.toLowerCase().includes(q) ||
        (doc.category && doc.category.toLowerCase().includes(q)) ||
        (doc.summary && doc.summary.toLowerCase().includes(q)) ||
        (doc.driveUrl && doc.driveUrl.toLowerCase().includes(q)) ||
        (doc.topics && doc.topics.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [docs, selectedCategory, searchQuery]);

  // Admin login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_ADMIN_PASSCODE;
    if (passcodeInput.trim() === storedPass || passcodeInput.trim() === DEFAULT_ADMIN_PASSCODE) {
      if (setIsAdmin) setIsAdmin(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAuthModalOpen(false);
      setPasscodeInput('');
      setAuthError('');
      onAddToast(
        'Menu Guru Terbuka',
        'Mode Guru aktif. Anda dapat menambah, mengedit judul, mengisi link download, dan menghapus berkas.',
        'success'
      );
    } else {
      setAuthError('Kata sandi salah. Coba lagi atau hubungi Pak Hafiz.');
    }
  };

  const handleAdminLogout = () => {
    if (setIsAdmin) setIsAdmin(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    onAddToast('Mode Guru Ditutup', 'Kembali ke tampilan standar siswa.', 'info');
  };

  // Open modal for Adding new doc
  const handleOpenAddModal = () => {
    if (!isAdmin) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingDocId(null);
    setFormTitle('');
    setFormDriveUrl('');
    setFormCategory('Modul Ajar');
    setFormGrade('Kelas XI');
    setFormFormat('PDF');
    setFormSummary('');
    setIsFormModalOpen(true);
  };

  // Helper to normalize category for edit form
  const getNormalizedCategory = (cat?: string): string => {
    if (!cat) return 'Modul Ajar';
    const c = cat.toLowerCase();
    if (c.includes('lkpd')) return 'LKPD';
    if (c.includes('materi') || c.includes('ringkasan') || c.includes('rumus')) return 'Materi Ajar';
    if (c.includes('perangkat') || c.includes('rpp') || c.includes('atp')) return 'Perangkat Ajar';
    if (c.includes('soal') || c.includes('bank')) return 'Soal';
    return 'Modul Ajar';
  };

  // Open modal for Editing doc (Teacher can edit title, category & download link)
  const handleOpenEditModal = (doc: DocumentItem) => {
    if (!isAdmin) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingDocId(doc.id);
    setFormTitle(doc.title);
    setFormDriveUrl(doc.driveUrl || doc.fileUrl || '');
    setFormCategory(getNormalizedCategory(doc.category));
    setFormGrade(doc.classGrade || 'Kelas XI');
    setFormFormat(doc.fileFormat || 'PDF');
    setFormSummary(doc.summary || '');
    setIsFormModalOpen(true);
  };

  // Save Add / Edit Document
  const handleSaveDocumentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onAddToast('Judul Diperlukan', 'Harap isi nama/judul perangkat ajar.', 'info');
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.getDate()} ${
      ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][now.getMonth()]
    } ${now.getFullYear()}`;

    if (editingDocId) {
      // Edit existing
      const existing = docs.find((d) => d.id === editingDocId);
      const updatedDoc: DocumentItem = {
        id: editingDocId,
        title: formTitle.trim(),
        category: formCategory,
        classGrade: existing ? existing.classGrade : formGrade,
        fileFormat: existing ? existing.fileFormat : formFormat,
        fileSize: existing ? existing.fileSize : '2.4 MB',
        downloads: existing ? existing.downloads : 0,
        updatedDate: dateFormatted,
        summary: formSummary.trim() || (existing ? existing.summary : 'Perangkat ajar kurikulum kimia SMA siap pakai.'),
        topics: existing && existing.topics ? existing.topics : ['Materi Pokok', 'Latihan Mandiri', 'Asesmen'],
        pages: existing ? existing.pages : 10,
        driveUrl: formDriveUrl.trim() || undefined,
        fileUrl: formDriveUrl.trim() || (existing ? existing.fileUrl : undefined)
      };

      if (onUpdateDoc) {
        onUpdateDoc(updatedDoc);
      }
      onAddToast(
        'Dokumen Diperbarui',
        `Perubahan untuk "${updatedDoc.title}" (${formCategory}) berhasil disimpan.`,
        'success'
      );
    } else {
      // Add new
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        classGrade: formGrade,
        fileFormat: formFormat,
        fileSize: '2.5 MB',
        downloads: 0,
        updatedDate: dateFormatted,
        summary: formSummary.trim() || 'Perangkat ajar kurikulum kimia SMA siap pakai.',
        topics: ['Konsep & Teori', 'Lembar Aktivitas', 'Latihan Soal'],
        pages: 10,
        driveUrl: formDriveUrl.trim() || undefined,
        fileUrl: formDriveUrl.trim() || undefined
      };

      if (onAddDoc) {
        onAddDoc(newDoc);
      }
      onAddToast(
        'Dokumen Ditambahkan',
        `"${newDoc.title}" (${formCategory}) berhasil ditambahkan.`,
        'success'
      );
    }

    setIsFormModalOpen(false);
  };

  const handleTriggerDownload = (doc: DocumentItem) => {
    if (doc.driveUrl && doc.driveUrl.trim().length > 0) {
      window.open(doc.driveUrl, '_blank', 'noopener,noreferrer');
      onAddToast('Membuka Link Download', `Membuka berkas "${doc.title}" di tab baru.`, 'info');
    } else {
      onDownloadDoc(doc);
    }
  };

  return (
    <section id="modul" className="py-16 sm:py-20 bg-white border-t border-[#E2E8F0] scroll-mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] text-xs font-bold mb-3 shadow-2xs">
              <GraduationCap className="w-4 h-4 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[11px]">Katalog Resmi & Berkas Ajar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light font-heading text-[#0F172A] tracking-tight">
              Perangkat <span className="font-semibold text-[#007AFF]">Ajar</span>
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-1.5 max-w-xl">
              Daftar berkas ajar resmi kimia dan sains SMA. Klik <strong>View</strong> untuk melihat ringkasan atau <strong>Download</strong> untuk mengunduh berkas.
            </p>
          </div>

          {/* Teacher Access & Actions Toolbar */}
          <div className="flex items-center gap-2.5 shrink-0">
            {isAdmin ? (
              <div className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-emerald-50 border border-emerald-300 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Menu Guru</span>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Tambah Dokumen Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Dokumen</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="p-1.5 rounded-full hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
                  title="Kunci / Keluar dari Menu Guru"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setPasscodeInput('');
                  setAuthError('');
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-full bg-[#F8FAFC] hover:bg-[#E0F2FE] text-[#007AFF] border border-[#CBD5E1] hover:border-[#007AFF] text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer group"
                title="Masuk sebagai Guru untuk mengedit judul dan link download"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#007AFF] group-hover:rotate-12 transition-transform" />
                <span>Menu Guru</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean Document List Container */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
          
          {/* Header Bar with Document Counter & Search */}
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Daftar Berkas Perangkat Ajar</h3>
                <p className="text-[11px] text-[#64748B]">
                  {filteredDocs.length} berkas ditampilkan · Gulir atas-bawah untuk melihat seluruh dokumen
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama dokumen..."
                className="w-full pl-8 pr-8 py-2 text-xs rounded-xl bg-white border border-[#CBD5E1] focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF] text-[#0F172A] placeholder:text-[#94A3B8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="px-4 py-2.5 bg-white border-b border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {DOC_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              // Count matching items
              const count = docs.filter((d) => matchesCategory(d.category, cat)).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#007AFF] text-white shadow-xs'
                      : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Vertically Scrollable List per baris */}
          <div className="max-h-[580px] overflow-y-auto p-3 sm:p-5 space-y-2.5 custom-scrollbar focus:outline-none">
            {filteredDocs.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#F0F9FF] border border-[#E2E8F0] hover:border-[#BAE6FD] transition-all group"
              >
                {/* Sisi Kiri: Icon & Nama Dokumen */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] group-hover:border-[#BAE6FD] group-hover:bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center shrink-0 shadow-2xs transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        onClick={() => onPreviewDoc(doc)}
                        className="text-xs sm:text-sm font-semibold text-[#0F172A] group-hover:text-[#007AFF] cursor-pointer transition-colors leading-snug break-words"
                      >
                        {doc.title}
                      </h4>
                      {doc.category && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#E0F2FE] text-[#0284C7] shrink-0 border border-[#BAE6FD]/60">
                          {doc.category}
                        </span>
                      )}
                    </div>
                    {doc.summary && (
                      <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                        {doc.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sisi Kanan: Action Buttons (View, Download, and Guru Edit if Admin) */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E2E8F0] w-full sm:w-auto justify-end">
                  
                  {/* View Button */}
                  <button
                    type="button"
                    onClick={() => onPreviewDoc(doc)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E0F2FE] text-[#0F172A] hover:text-[#007AFF] border border-[#CBD5E1] hover:border-[#BAE6FD] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                    title="Lihat Pratinjau Dokumen"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#007AFF]" />
                    <span>View</span>
                  </button>

                  {/* Download Button */}
                  <button
                    type="button"
                    onClick={() => handleTriggerDownload(doc)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#007AFF] hover:bg-[#0062cc] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                    title={doc.driveUrl ? 'Download / Buka Berkas via Link' : 'Unduh Berkas'}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  {/* Mode Guru Controls: Edit Judul, Jenis Dokumen & Link Download, Delete */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 pl-2 ml-1 border-l border-[#CBD5E1]">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(doc)}
                        className="p-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-600 border border-amber-300 hover:border-amber-400 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        title="Edit Judul, Jenis & Link Download (Mode Guru)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDocToDelete(doc)}
                        className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 hover:border-rose-400 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        title="Hapus Dokumen (Mode Guru)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredDocs.length === 0 && (
              <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-[#CBD5E1]">
                <FileText className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2" />
                <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">Tidak ada dokumen yang sesuai</h4>
                <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                  {selectedCategory !== 'Semua' 
                    ? `Tidak ada berkas di kategori "${selectedCategory}". Coba pilih filter "Semua" atau kata kunci lain.`
                    : 'Coba ketikkan kata kunci lain pada kolom pencarian di atas.'}
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {selectedCategory !== 'Semua' && (
                    <button
                      onClick={() => setSelectedCategory('Semua')}
                      className="px-3.5 py-1.5 rounded-full bg-[#E0F2FE] text-[#007AFF] text-xs font-bold hover:bg-[#BAE6FD] transition-all cursor-pointer"
                    >
                      Pilih Kategori Semua
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3.5 py-1.5 rounded-full bg-[#007AFF] text-white text-xs font-bold hover:bg-[#0062cc] transition-all cursor-pointer"
                    >
                      Reset Pencarian
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-[#FAFAFA] border-t border-[#E2E8F0] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748B]">
            <span>Menampilkan {filteredDocs.length} dari {docs.length} berkas pembelajaran</span>
            {isAdmin ? (
              <button
                onClick={handleOpenAddModal}
                className="text-xs font-bold text-[#007AFF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Dokumen Baru</span>
              </button>
            ) : (
              <span className="text-[11px] text-[#94A3B8]">
                Masuk ke <strong>Menu Guru</strong> untuk mengedit judul atau memperbarui link unduhan.
              </span>
            )}
          </div>
        </div>

        {/* Quick Instructions & Help Box */}
        <div className="mt-6 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-3 text-xs">
          <div className="w-7 h-7 rounded-full bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <p className="text-[#64748B] text-xs">
            Semua berkas modul dan perangkat ajar dapat diakses bebas untuk keperluan belajar mengajar siswa dan guru kimia SMA.
          </p>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Admin / Teacher Passcode Verification */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Akses Menu Guru</h3>
                    <p className="text-[10px] text-[#64748B]">Kelola Judul & Link Download</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                <p className="text-[#475569] text-xs leading-relaxed">
                  Masukkan kata sandi guru untuk mengaktifkan fitur <strong>Edit Judul</strong>, <strong>Isi Link Download</strong>, dan <strong>Tambah Dokumen</strong>.
                </p>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Kata Sandi Guru
                  </label>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={passcodeInput}
                    onChange={(e) => {
                      setPasscodeInput(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="Masukkan kata sandi..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-sm focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]"
                  />
                  {authError && (
                    <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{authError}</p>
                  )}
                  <p className="text-[10px] text-[#94A3B8] mt-1">
                    Kata sandi default: <code className="font-mono text-[#007AFF]">hafiz2026</code>
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9] font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#007AFF] hover:bg-[#0062cc] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Buka Akses</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: Edit Judul & Link Download (Mode Guru) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#007AFF] flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      {editingDocId ? 'Edit Judul & Link Download' : 'Tambah Dokumen Baru'}
                    </h3>
                    <p className="text-[10px] text-[#64748B]">Menu Guru (Perangkat Ajar)</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveDocumentForm} className="space-y-4 text-xs">
                
                {/* 1. Nama Dokumen / Judul */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Nama / Judul Dokumen <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Modul Ajar & LKPD Titrasi Asam Basa SMA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold text-xs focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]"
                  />
                </div>

                {/* 2. Pilihan Jenis Dokumen */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Jenis Dokumen <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(['Modul Ajar', 'LKPD', 'Materi Ajar', 'Perangkat Ajar', 'Soal'] as const).map((typeOption) => {
                      const isSelected = formCategory === typeOption;
                      return (
                        <button
                          key={typeOption}
                          type="button"
                          onClick={() => setFormCategory(typeOption)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#007AFF] text-white border-[#007AFF] shadow-xs'
                              : 'bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#94A3B8]'}`} />
                          <span>{typeOption}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Link Download / Google Drive URL */}
                <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-2">
                  <label className="text-xs font-bold text-[#0369A1] flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#007AFF]" />
                    <span>Link Download / Google Drive</span>
                  </label>
                  <input
                    type="url"
                    value={formDriveUrl}
                    onChange={(e) => setFormDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#007AFF] focus:ring-1 focus:ring-[#007AFF]"
                  />
                  <p className="text-[10px] text-[#64748B] leading-relaxed">
                    💡 <em>Tempel link Google Drive atau URL berkas download yang dapat diakses publik/siswa.</em>
                  </p>
                </div>

                {/* 4. Deskripsi Singkat (Opsional) */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Keterangan Singkat (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Contoh: Ringkasan teori, latihan soal, dan panduan praktikum lab..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#007AFF]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9] font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#007AFF] hover:bg-[#0062cc] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Simpan Perubahan</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: Delete Confirmation Modal (Teacher Mode) */}
      {/* ========================================================================= */}
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
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 z-10 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#FEE2E2] text-[#EF4444] flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mb-1">Hapus Dokumen?</h3>
              <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
                Dokumen <strong>"{docToDelete.title}"</strong> akan dihapus dari daftar.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDocToDelete(null)}
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-semibold text-[#64748B] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (onDeleteDoc) {
                      onDeleteDoc(docToDelete.id);
                    }
                    onAddToast('Dokumen Dihapus', `Dokumen "${docToDelete.title}" telah dihapus.`, 'info');
                    setDocToDelete(null);
                  }}
                  className="px-4 py-2 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold shadow-xs cursor-pointer"
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
