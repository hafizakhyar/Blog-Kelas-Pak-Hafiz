import React, { useState, useRef, useMemo } from 'react';
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
  Copy,
  Check,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  LogOut,
  X,
  FileCheck,
  FileCode,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  ArrowUpDown,
  Table,
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
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'index' | 'title' | 'category' | 'downloads'>('index');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Copy Link State
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Admin Passcode & Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Add / Edit Document Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<string>('Modul Ajar');
  const [formGrade, setFormGrade] = useState<string>('Kelas XI');
  const [formFormat, setFormFormat] = useState<string>('PDF');
  const [formSummary, setFormSummary] = useState('');
  const [formTopics, setFormTopics] = useState('');
  const [formPages, setFormPages] = useState('12');
  const [formDriveUrl, setFormDriveUrl] = useState('');
  const [formFileSize, setFormFileSize] = useState('2.4 MB');

  // Quick Drive Link Editor Modal
  const [quickDriveDoc, setQuickDriveDoc] = useState<DocumentItem | null>(null);
  const [quickDriveUrl, setQuickDriveUrl] = useState('');

  // Delete Confirmation Modal
  const [docToDelete, setDocToDelete] = useState<DocumentItem | null>(null);

  const grades = ['Semua', 'Kelas X', 'Kelas XI', 'Kelas XII', 'Semua Tingkat'];
  const categories = [
    'Semua',
    'Modul Ajar',
    'LKPD Praktikum',
    'RPP & ATP',
    'Ringkasan & Rumus',
    'Bank Soal',
    'Silabus'
  ];

  // Filter and sort items
  const filteredAndSortedDocs = useMemo(() => {
    const result = docs.filter((doc) => {
      const matchesGrade =
        selectedGrade === 'Semua' ||
        doc.classGrade === selectedGrade ||
        doc.classGrade === 'Semua Tingkat';
      const matchesCategory =
        selectedCategory === 'Semua' || doc.category === selectedCategory;
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.driveUrl && doc.driveUrl.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesGrade && matchesCategory && matchesSearch;
    });

    return result.sort((a, b) => {
      if (sortBy === 'title') {
        const cmp = a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      if (sortBy === 'category') {
        const cmp = a.category.localeCompare(b.category);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      if (sortBy === 'downloads') {
        const cmp = (a.downloads || 0) - (b.downloads || 0);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }, [docs, selectedGrade, selectedCategory, searchQuery, sortBy, sortOrder]);

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
      onAddToast('Menu Guru Terbuka', 'Mode Guru aktif. Anda dapat menambah, mengedit, mengisi link Google Drive, dan menghapus berkas perangkat ajar.', 'success');
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
    setFormCategory('Modul Ajar');
    setFormGrade('Kelas XI');
    setFormFormat('PDF');
    setFormSummary('');
    setFormTopics('Dasar Teori & Konsep\nContoh Soal Pembahasan\nLembar Aktivitas Siswa');
    setFormPages('10');
    setFormDriveUrl('');
    setFormFileSize('2.5 MB');
    setIsFormModalOpen(true);
  };

  // Open modal for Editing doc
  const handleOpenEditModal = (doc: DocumentItem) => {
    if (!isAdmin) {
      setIsAuthModalOpen(true);
      return;
    }
    setEditingDocId(doc.id);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormGrade(doc.classGrade);
    setFormFormat(doc.fileFormat);
    setFormSummary(doc.summary);
    setFormTopics(doc.topics.join('\n'));
    setFormPages(doc.pages ? String(doc.pages) : '8');
    setFormDriveUrl(doc.driveUrl || doc.fileUrl || '');
    setFormFileSize(doc.fileSize || '2.0 MB');
    setIsFormModalOpen(true);
  };

  // Quick Open Drive Link Editor
  const handleOpenQuickDriveEditor = (doc: DocumentItem) => {
    if (!isAdmin) {
      setIsAuthModalOpen(true);
      return;
    }
    setQuickDriveDoc(doc);
    setQuickDriveUrl(doc.driveUrl || doc.fileUrl || '');
  };

  const handleSaveQuickDriveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDriveDoc) return;

    const updatedDoc: DocumentItem = {
      ...quickDriveDoc,
      driveUrl: quickDriveUrl.trim()
    };

    if (onUpdateDoc) {
      onUpdateDoc(updatedDoc);
    }
    setQuickDriveDoc(null);
    onAddToast('Tautan Google Drive Diperbarui', `Link Google Drive untuk "${updatedDoc.title}" berhasil disimpan.`, 'success');
  };

  // Save Add / Edit Document
  const handleSaveDocumentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onAddToast('Judul Diperlukan', 'Harap isi judul perangkat ajar.', 'info');
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

    if (editingDocId) {
      // Edit existing
      const existing = docs.find((d) => d.id === editingDocId);
      const updatedDoc: DocumentItem = {
        id: editingDocId,
        title: formTitle.trim(),
        category: formCategory,
        classGrade: formGrade,
        fileFormat: formFormat,
        fileSize: formFileSize.trim() || '2.0 MB',
        downloads: existing ? existing.downloads : 0,
        updatedDate: dateFormatted,
        summary: formSummary.trim() || 'Perangkat ajar kurikulum kimia SMA siap pakai.',
        topics: topicsArray.length > 0 ? topicsArray : ['Materi Pokok', 'Latihan Mandiri', 'Asesmen'],
        pages: parseInt(formPages) || 8,
        driveUrl: formDriveUrl.trim() || undefined,
        fileUrl: formDriveUrl.trim() || (existing ? existing.fileUrl : undefined)
      };

      if (onUpdateDoc) {
        onUpdateDoc(updatedDoc);
      }
      onAddToast('Perangkat Ajar Diperbarui', `Perubahan pada "${updatedDoc.title}" tersimpan di Google Drive & Cloud.`, 'success');
    } else {
      // Add new
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        classGrade: formGrade,
        fileFormat: formFormat,
        fileSize: formFileSize.trim() || '2.5 MB',
        downloads: 0,
        updatedDate: dateFormatted,
        summary: formSummary.trim() || 'Perangkat ajar kurikulum merdeka kimia SMA lengkap.',
        topics: topicsArray.length > 0 ? topicsArray : ['Konsep & Teori', 'Lembar Aktivitas', 'Latihan Soal'],
        pages: parseInt(formPages) || 10,
        driveUrl: formDriveUrl.trim() || undefined,
        fileUrl: formDriveUrl.trim() || undefined
      };

      if (onAddDoc) {
        onAddDoc(newDoc);
      }
      onAddToast('Perangkat Ajar Ditambahkan', `Baris baru "${newDoc.title}" berhasil dimasukkan ke tabel.`, 'success');
    }

    setIsFormModalOpen(false);
  };

  // Copy Google Drive Link
  const handleCopyDriveLink = (doc: DocumentItem) => {
    const urlToCopy = doc.driveUrl || doc.fileUrl || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(urlToCopy);
      setCopiedDocId(doc.id);
      setTimeout(() => setCopiedDocId(null), 3000);
      onAddToast(
        'Tautan Disalin!',
        doc.driveUrl ? 'Link Google Drive siap dibagikan ke siswa/grup.' : 'Tautan halaman dokumen disalin.',
        'info'
      );
    }
  };

  // Format Badge Helper
  const getFormatBadge = (format: string) => {
    const f = format.toUpperCase();
    if (f.includes('PDF')) {
      return { bg: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]', icon: 'PDF' };
    }
    if (f.includes('DOC') || f.includes('WORD')) {
      return { bg: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]', icon: 'DOCX' };
    }
    if (f.includes('XLS') || f.includes('SHEET')) {
      return { bg: 'bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]', icon: 'XLSX' };
    }
    if (f.includes('PPT')) {
      return { bg: 'bg-[#FFEDD5] text-[#EA580C] border-[#FED7AA]', icon: 'PPTX' };
    }
    return { bg: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]', icon: f || 'FILE' };
  };

  return (
    <section id="modul" className="py-20 sm:py-24 bg-white border-t border-[#E2E8F0] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] text-xs font-bold mb-3 shadow-2xs">
              <GraduationCap className="w-4 h-4 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[11px]">Katalog Resmi & Berkas Ajar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Perangkat <span className="font-semibold text-[#0284C7]">Ajar</span>
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm sm:leading-relaxed mt-2 max-w-2xl">
              Tabel data perangkat ajar lengkap (Modul Ajar Kurikulum Merdeka, LKPD Praktikum Laboratorium, RPP, Silabus & ATP, Ringkasan Rumus, serta Bank Soal). Unduh langsung via link Google Drive resmi.
            </p>
          </div>

          {/* Teacher Access & Actions Toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Teacher Mode Button / Badge */}
            {isAdmin ? (
              <div className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-emerald-50 border border-emerald-300 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Menu Guru Aktif</span>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  title="Tambah Baris Perangkat Ajar Baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris</span>
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
                className="px-4 py-2 rounded-full bg-[#F8FAFC] hover:bg-[#E0F2FE] text-[#0284C7] border border-[#CBD5E1] hover:border-[#0284C7] text-xs font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer group"
                title="Masuk sebagai Guru untuk menambah, edit, hapus, dan mengisi link Google Drive"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#0284C7] group-hover:rotate-12 transition-transform" />
                <span>Menu Guru (Kelola & Isi Link)</span>
              </button>
            )}
          </div>
        </div>

        {/* Excel Spreadsheet Container */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#CBD5E1] shadow-md overflow-hidden">
          
          {/* Excel Title Bar & Formula/Filter Bar */}
          <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Sheet Title & Excel Sheet Icon */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs font-bold text-xs shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#0F172A]">Sheet: Perangkat_Ajar_Kimia.xlsx</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                    {filteredAndSortedDocs.length} Baris Data
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  {isAdmin
                    ? 'Mode Guru: Anda dapat mengedit baris, memasukkan link Google Drive, dan menambah/menghapus berkas.'
                    : 'Mode Siswa: Klik tautan Google Drive untuk membuka/mengunduh modul pembelajaran.'}
                </p>
              </div>
            </div>

            {/* Quick Search & Grade Filter */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Search in Sheet */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#0284C7] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, topik, materi..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-[#CBD5E1] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Grade Filter Select */}
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-semibold focus:outline-none focus:border-[#0284C7] shadow-2xs cursor-pointer"
              >
                {grades.map((g) => (
                  <option key={g} value={g}>
                    {g === 'Semua' ? 'Semua Jenjang' : g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Excel Category Tabs (Sheet Tabs at Top/Bottom) */}
          <div className="bg-[#F1F5F9] border-b border-[#E2E8F0] px-4 py-2 flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none]">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1">
              <Table className="w-3 h-3 text-[#0284C7]" />
              <span>Kategori:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-white text-[#0284C7] border-[#CBD5E1] shadow-2xs font-bold'
                    : 'bg-transparent text-[#64748B] hover:bg-white/60 border-transparent hover:border-[#E2E8F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Excel Table Structure */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              
              {/* Spreadsheet Column Headers */}
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#475569] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3.5 border-r border-[#E2E8F0] w-14 text-center">
                    # No
                  </th>
                  <th
                    onClick={() => {
                      if (sortBy === 'title') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('title');
                        setSortOrder('asc');
                      }
                    }}
                    className="py-3 px-4 border-r border-[#E2E8F0] min-w-[280px] cursor-pointer hover:bg-[#E0F2FE]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>Nama Dokumen & Materi Pokok</span>
                      <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortBy === 'category') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('category');
                        setSortOrder('asc');
                      }
                    }}
                    className="py-3 px-3.5 border-r border-[#E2E8F0] w-36 cursor-pointer hover:bg-[#E0F2FE]/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>Kategori</span>
                      <ArrowUpDown className="w-3 h-3 text-[#94A3B8]" />
                    </div>
                  </th>
                  <th className="py-3 px-3.5 border-r border-[#E2E8F0] w-28 text-center">
                    Jenjang
                  </th>
                  <th className="py-3 px-3.5 border-r border-[#E2E8F0] w-32 text-center">
                    Format & Size
                  </th>
                  <th className="py-3 px-4 border-r border-[#E2E8F0] min-w-[220px]">
                    <div className="flex items-center gap-1.5 text-[#0369A1]">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                        <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.45z" fill="#00ac47"/>
                        <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H60l7.15 12.4z" fill="#ea4335"/>
                        <path d="M43.65 25h27.45c0-1.55-.4-3.1-1.2-4.5l-8.85-15.3c-.8-1.4-1.95-2.5-3.3-3.3z" fill="#00832d"/>
                        <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2z" fill="#2684fc"/>
                        <path d="m73.4 26.5-13.6-23.5c-1.35-.8-2.9-1.2-4.5-1.2H32.1c-1.6 0-3.15.4-4.5 1.2L41.35 26.5z" fill="#ffba00"/>
                      </svg>
                      <span>Tautan Google Drive</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 w-44 text-center">
                    Aksi & Kontrol
                  </th>
                </tr>
              </thead>

              {/* Spreadsheet Body Rows */}
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredAndSortedDocs.map((doc, index) => {
                  const badge = getFormatBadge(doc.fileFormat);
                  const isCopied = copiedDocId === doc.id;
                  const hasDriveUrl = Boolean(doc.driveUrl && doc.driveUrl.trim().length > 0);

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-[#F0F9FF]/70 transition-colors group/row"
                    >
                      {/* Col 1: Row Index (Excel Line Number) */}
                      <td className="py-3 px-3 border-r border-[#E2E8F0] text-center font-mono font-bold text-[#64748B] bg-[#FAFAFA] group-hover/row:bg-[#E0F2FE]/40">
                        {index + 1}
                      </td>

                      {/* Col 2: Document Title, Summary & Topics */}
                      <td className="py-3 px-4 border-r border-[#E2E8F0]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() => onPreviewDoc(doc)}
                              className="font-bold text-[#0F172A] hover:text-[#0284C7] text-xs sm:text-sm cursor-pointer transition-colors leading-snug"
                            >
                              {doc.title}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-[#64748B] line-clamp-1 leading-normal">
                            {doc.summary}
                          </p>

                          {/* Topic Tags */}
                          {doc.topics && doc.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {doc.topics.slice(0, 3).map((topic, i) => (
                                <span
                                  key={i}
                                  className="px-1.5 py-0.5 rounded-sm bg-[#F1F5F9] text-[#475569] text-[9px] font-medium"
                                >
                                  • {topic}
                                </span>
                              ))}
                              {doc.topics.length > 3 && (
                                <span className="text-[9px] text-[#0284C7] font-semibold">
                                  +{doc.topics.length - 3} lainnya
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Col 3: Category */}
                      <td className="py-3 px-3.5 border-r border-[#E2E8F0]">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] whitespace-nowrap">
                          {doc.category}
                        </span>
                      </td>

                      {/* Col 4: Grade */}
                      <td className="py-3 px-3.5 border-r border-[#E2E8F0] text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] whitespace-nowrap">
                          {doc.classGrade}
                        </span>
                      </td>

                      {/* Col 5: Format & Size */}
                      <td className="py-3 px-3.5 border-r border-[#E2E8F0] text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${badge.bg}`}>
                            {badge.icon}
                          </span>
                          <span className="text-[10px] text-[#94A3B8] font-mono">
                            {doc.fileSize}
                          </span>
                        </div>
                      </td>

                      {/* Col 6: Google Drive Link Column */}
                      <td className="py-3 px-4 border-r border-[#E2E8F0]">
                        {hasDriveUrl ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={doc.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E0F2FE] hover:bg-[#0284C7] text-[#0369A1] hover:text-white border border-[#BAE6FD] text-[11px] font-bold transition-all shadow-2xs cursor-pointer group/drive"
                              title="Buka file langsung di Google Drive"
                            >
                              <ExternalLink className="w-3 h-3 text-[#0284C7] group-hover/drive:text-white" />
                              <span className="truncate max-w-[130px]">Buka di Drive</span>
                            </a>

                            {/* Copy Drive Link Button */}
                            <button
                              onClick={() => handleCopyDriveLink(doc)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isCopied
                                  ? 'bg-emerald-500 text-white border-emerald-500'
                                  : 'bg-white hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] border-[#CBD5E1]'
                              }`}
                              title="Salin Link Google Drive"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ) : (
                          /* No drive link yet */
                          <div>
                            {isAdmin ? (
                              <button
                                onClick={() => handleOpenQuickDriveEditor(doc)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold transition-colors cursor-pointer"
                                title="Masukkan link Google Drive untuk dokumen ini"
                              >
                                <Plus className="w-3 h-3 text-amber-600" />
                                <span>➕ Isi Link Drive</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-[#94A3B8] italic">
                                Belum ada link drive
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Col 7: Actions & Controls */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* Preview Page Button (Everyone) */}
                          <button
                            onClick={() => onPreviewDoc(doc)}
                            className="p-1.5 rounded-lg bg-white hover:bg-[#E0F2FE] text-[#64748B] hover:text-[#0284C7] border border-[#CBD5E1] transition-colors cursor-pointer"
                            title="Lihat Halaman Rinci"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Download / Open File Button (Everyone) */}
                          <button
                            onClick={() => {
                              if (doc.driveUrl) {
                                window.open(doc.driveUrl, '_blank', 'noopener,noreferrer');
                              } else {
                                onDownloadDoc(doc);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white transition-colors shadow-2xs cursor-pointer"
                            title={doc.driveUrl ? 'Buka / Unduh via Google Drive' : 'Unduh Berkas'}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* TEACHER ONLY: Quick Edit Drive Link */}
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenQuickDriveEditor(doc)}
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 transition-colors cursor-pointer"
                              title="Menu Guru: Ganti / Isi Link Drive"
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* TEACHER ONLY: Full Edit Button */}
                          {isAdmin && (
                            <button
                              onClick={() => handleOpenEditModal(doc)}
                              className="p-1.5 rounded-lg bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] border border-[#BAE6FD] transition-colors cursor-pointer"
                              title="Menu Guru: Edit Informasi & Berkas"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* TEACHER ONLY: Delete Button */}
                          {isAdmin && (
                            <button
                              onClick={() => setDocToDelete(doc)}
                              className="p-1.5 rounded-lg bg-[#FEE2E2] hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#FECACA] transition-colors cursor-pointer"
                              title="Menu Guru: Hapus Baris Dokumen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredAndSortedDocs.length === 0 && (
            <div className="text-center py-16 px-4 bg-white">
              <FileSpreadsheet className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
              <h4 className="text-sm font-bold text-[#0F172A]">Tidak ada data perangkat ajar yang cocok</h4>
              <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau ubah filter jenjang dan kategori.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('Semua');
                  setSelectedCategory('Semua');
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369A1] transition-all cursor-pointer"
              >
                Reset Filter Tabel
              </button>
            </div>
          )}

          {/* Excel Spreadsheet Footer / Status Bar */}
          <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#64748B]">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#0F172A]">
                Menampilkan {filteredAndSortedDocs.length} dari {docs.length} perangkat ajar
              </span>
              <span>•</span>
              <span>Format: PDF, Word DOCX, Excel XLSX, PPT</span>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <button
                  onClick={handleOpenAddModal}
                  className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris Baru</span>
                </button>
              ) : (
                <span className="text-[11px] text-[#64748B]">
                  Untuk mengubah link atau menambah data, silakan masuk ke <strong className="text-[#0284C7]">Menu Guru</strong>.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Instructions & Help Box */}
        <div className="mt-8 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-[#0F172A]">Panduan Akses & Unduhan Perangkat Ajar</h4>
              <p className="text-[#64748B] text-[11px] mt-0.5">
                Semua dokumen dapat dibuka langsung di Google Drive atau diunduh ke perangkat. Jika link memerlukan izin akses, pastikan telah login ke akun Google belajar.id / Gmail Anda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (filteredAndSortedDocs.length > 0) {
                  onPreviewDoc(filteredAndSortedDocs[0]);
                }
              }}
              className="px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0284C7] text-[#0F172A] font-semibold shadow-2xs hover:text-[#0284C7] transition-all cursor-pointer text-xs"
            >
              Lihat Preview Dokumen Utama
            </button>
          </div>
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
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Akses Menu Guru</h3>
                    <p className="text-[10px] text-[#64748B]">Kelola Perangkat Ajar & Link Drive</p>
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
                  Masukkan kata sandi guru untuk mengaktifkan fitur <strong>Tambah</strong>, <strong>Edit</strong>, <strong>Hapus</strong>, dan <strong>Isi Link Google Drive</strong>.
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-sm focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                  />
                  {authError && (
                    <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">{authError}</p>
                  )}
                  <p className="text-[10px] text-[#94A3B8] mt-1">
                    Kata sandi default: <code className="font-mono text-[#0284C7]">hafiz2026</code>
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
                    className="px-5 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
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
      {/* MODAL 2: Quick Google Drive Link Editor */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {quickDriveDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickDriveDoc(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Isi / Ubah Link Google Drive</h3>
                    <p className="text-[10px] text-[#64748B]">Menu Guru (Perangkat Ajar)</p>
                  </div>
                </div>
                <button
                  onClick={() => setQuickDriveDoc(null)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveQuickDriveUrl} className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Dokumen:
                  </span>
                  <h4 className="text-xs font-bold text-[#0F172A] mt-0.5">
                    {quickDriveDoc.title}
                  </h4>
                  <span className="text-[10px] text-[#0284C7] font-semibold">
                    {quickDriveDoc.category} • {quickDriveDoc.classGrade}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Tautan Link Google Drive (URL Shareable) <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    autoFocus
                    value={quickDriveUrl}
                    onChange={(e) => setQuickDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-mono focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                  />
                  <div className="mt-2 p-3 rounded-xl bg-[#F0FDF4] border border-emerald-200 text-emerald-800 text-[11px] leading-relaxed">
                    💡 <strong>Tips Guru:</strong> Pastikan link file di Google Drive disetel ke <em>"Siapa saja yang memiliki link dapat melihat"</em> (Anyone with the link can view) agar siswa dapat langsung mengunduh/membuka file.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setQuickDriveDoc(null)}
                    className="px-4 py-2 rounded-full border border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9] font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Simpan Tautan Drive</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: Full Add / Edit Document Form (Teacher Mode) */}
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
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#CBD5E1] p-6 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      {editingDocId ? 'Edit Baris Perangkat Ajar' : 'Tambah Baris Perangkat Ajar Baru'}
                    </h3>
                    <p className="text-[10px] text-[#64748B]">Menu Guru (Penyimpanan Google Drive & Cloud)</p>
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
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Nama Perangkat Ajar / Judul Modul <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Modul Ajar & LKPD Titrasi Asam Basa SMA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold focus:outline-none focus:border-[#0284C7]"
                  />
                </div>

                {/* Category, Grade & Format Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Kategori</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold"
                    >
                      <option value="Modul Ajar">Modul Ajar</option>
                      <option value="LKPD Praktikum">LKPD Praktikum</option>
                      <option value="RPP & ATP">RPP & ATP</option>
                      <option value="Ringkasan & Rumus">Ringkasan & Rumus</option>
                      <option value="Bank Soal">Bank Soal</option>
                      <option value="Silabus">Silabus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Jenjang Kelas</label>
                    <select
                      value={formGrade}
                      onChange={(e) => setFormGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold"
                    >
                      <option value="Kelas X">Kelas X</option>
                      <option value="Kelas XI">Kelas XI</option>
                      <option value="Kelas XII">Kelas XII</option>
                      <option value="Semua Tingkat">Semua Tingkat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Format File</label>
                    <select
                      value={formFormat}
                      onChange={(e) => setFormFormat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-semibold"
                    >
                      <option value="PDF">PDF</option>
                      <option value="DOCX">DOCX (Word)</option>
                      <option value="XLSX">XLSX (Excel)</option>
                      <option value="PPTX">PPTX (Slide)</option>
                    </select>
                  </div>
                </div>

                {/* Google Drive Link Input (Core requirement) */}
                <div className="p-3.5 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] space-y-2">
                  <label className="text-xs font-bold text-[#0369A1] flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>Link Download Google Drive (Tautan Berkas)</span>
                  </label>
                  <input
                    type="url"
                    value={formDriveUrl}
                    onChange={(e) => setFormDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#0284C7]"
                  />
                  <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                    <span>Tempel link Google Drive atau Google Docs/Sheet Anda di sini.</span>
                    <span className="font-mono text-[#0284C7]">Google Drive Enabled</span>
                  </div>
                </div>

                {/* File Size & Page Count */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Ukuran Berkas</label>
                    <input
                      type="text"
                      value={formFileSize}
                      onChange={(e) => setFormFileSize(e.target.value)}
                      placeholder="Contoh: 3.2 MB"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Jumlah Halaman</label>
                    <input
                      type="number"
                      value={formPages}
                      onChange={(e) => setFormPages(e.target.value)}
                      placeholder="Contoh: 24"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Deskripsi / Ringkasan Isi</label>
                  <textarea
                    rows={2}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Tuliskan gambaran umum materi dan panduan perangkat ajar ini..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  />
                </div>

                {/* Topics / Pokok Bahasan */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Topik & Pokok Bahasan (1 per baris)</label>
                  <textarea
                    rows={3}
                    value={formTopics}
                    onChange={(e) => setFormTopics(e.target.value)}
                    placeholder="Teori & Reaksi Kimia&#10;Contoh Perhitungan & Rumus&#10;Lembar Aktivitas Siswa"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
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
                    className="px-5 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{editingDocId ? 'Simpan Perubahan' : 'Tambah ke Tabel'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 4: Delete Confirmation Modal (Teacher Mode) */}
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
              <h3 className="text-base font-bold text-[#0F172A] mb-1">Hapus Baris Perangkat Ajar?</h3>
              <p className="text-xs text-[#64748B] mb-5 leading-relaxed">
                Dokumen <strong>"{docToDelete.title}"</strong> akan dihapus dari tabel dan data cloud.
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
                    onAddToast('Baris Dihapus', `Perangkat ajar "${docToDelete.title}" telah dihapus.`, 'info');
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
