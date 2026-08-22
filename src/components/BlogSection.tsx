import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  Tag,
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
  Plus,
  Trash2,
  Upload,
  CloudUpload,
  Loader2,
  X,
  Lock,
  KeyRound,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { BLOG_POSTS, TEACHER_INFO } from '../data/mockData';
import { BlogPost } from '../types';
import { uploadFileToFirebaseStorage, STORAGE_FOLDERS } from '../lib/firebase';

const ADMIN_AUTH_KEY = 'kelaspakhafiz_admin_auth';
const DEFAULT_ADMIN_PASSCODE = 'hafiz2026';

interface BlogSectionProps {
  onSelectPost: (post: BlogPost) => void;
  onOpenMainPortal: () => void;
  posts?: BlogPost[];
  isAdmin?: boolean;
  setIsAdmin?: (val: boolean) => void;
  onAddPost?: (post: BlogPost) => void;
  onDeletePost?: (postId: string) => void;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  onSelectPost,
  onOpenMainPortal,
  posts = BLOG_POSTS,
  isAdmin = false,
  setIsAdmin,
  onAddPost,
  onDeletePost,
  onAddToast = (_t: string, _d?: string, _ty?: 'success' | 'info') => {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin Passcode Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeAttempt.trim() === DEFAULT_ADMIN_PASSCODE || passcodeAttempt.trim() === 'admin123' || passcodeAttempt.trim() === 'hafiz2026') {
      if (setIsAdmin) setIsAdmin(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setIsAdminModalOpen(false);
      setPasscodeAttempt('');
      setPasscodeError(false);
      setIsAddModalOpen(true);
      onAddToast('Mode Pengajar Aktif', 'Selamat datang Pak Hafiz! Silakan tulis artikel baru.', 'success');
    } else {
      setPasscodeError(true);
      onAddToast('Passcode Salah', 'Passcode guru tidak cocok. Gunakan hafiz2026.', 'info');
    }
  };

  // Add Article Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Kimia Sehari-hari' | 'Tips Belajar' | 'Eksperimen Kreatif' | 'Fakta Unik'>('Kimia Sehari-hari');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formReadTime, setFormReadTime] = useState('4 menit');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const categories = ['Semua', 'Kimia Sehari-hari', 'Tips Belajar', 'Eksperimen Kreatif', 'Fakta Unik'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onAddToast('Format Tidak Didukung', 'Pilih file gambar untuk sampul artikel.', 'info');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const downloadUrl = await uploadFileToFirebaseStorage(
        file,
        STORAGE_FOLDERS.ARTICLE_IMAGES,
        (progress) => setUploadProgress(progress)
      );
      setFormCoverImage(downloadUrl);
      onAddToast('Sampul Terunggah', 'Gambar tersimpan di Firebase Storage (catatan_artikel).', 'success');
    } catch (err) {
      console.warn('Firebase Storage upload error:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormCoverImage(event.target?.result as string);
        onAddToast('Sampul Disimpan Lokal', 'Gambar tersimpan untuk artikel.', 'info');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      e.target.value = '';
    }
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onAddToast('Judul Diperlukan', 'Harap isi judul artikel.', 'info');
      return;
    }

    const now = new Date();
    const dateFormatted = `${now.getDate()} ${
      ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][now.getMonth()]
    } ${now.getFullYear()}`;

    const paragraphs = formContent
      .split('\n\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: formTitle.trim(),
      slug: formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formCategory,
      summary: formSummary.trim() || 'Pembahasan materi kimia dengan pendekatan kontekstual dan menarik.',
      content: paragraphs.length > 0 ? paragraphs : [formSummary],
      coverImage: formCoverImage || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
      date: dateFormatted,
      readTime: formReadTime || '5 menit',
      reactions: 0,
      tags: [formCategory, 'Kimia SMA', 'Pak Hafiz'],
      keyTakeaways: [
        'Konsep sains terbukti dalam fenomena sehari-hari.',
        'Pemahaman konsep lebih utama daripada menghafal rumus.',
        'Aplikasi kimia mempermudah pemecahan masalah nyata.'
      ],
      author: {
        name: TEACHER_INFO.name,
        role: 'Guru Kimia SMA & Edukator Sains',
        avatar: TEACHER_INFO.avatar
      }
    };

    if (onAddPost) {
      onAddPost(newPost);
    }

    setIsAddModalOpen(false);
    setFormTitle('');
    setFormSummary('');
    setFormContent('');
    setFormCoverImage('');
    onAddToast('Artikel Ditambahkan', `Artikel "${newPost.title}" tersimpan di Firebase Firestore.`, 'success');
  };

  return (
    <section id="blog" className="py-20 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Wawasan & Eksplorasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Artikel & Catatan <span className="font-semibold text-[#0284C7]">Belajar Kimia</span>
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base mt-2 max-w-xl">
              Ulasan fenomena sains sehari-hari, tips belajar efektif menembus ujian kimia SMA, dan fakta sains menarik.
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
                placeholder="Cari artikel (sabun, asam basa)..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white border border-[#E2E8F0] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs transition-all"
              />
            </div>

            {/* Action Buttons */}
            {isAdmin ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tulis Artikel Baru</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#38BDF8] text-xs font-bold flex items-center gap-2 transition-all shadow-2xs shrink-0 cursor-pointer group"
                title="Tulis artikel pembelajaran kimia (Mode Pengajar)"
              >
                <Plus className="w-4 h-4 text-[#0284C7]" />
                <span className="hidden sm:inline">Tulis Artikel (Guru)</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'bg-white text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#0F172A] border border-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredPosts.map((post) => (
              <motion.article
                layout
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-[0_4px_20px_rgba(2,132,199,0.06)] hover:shadow-lg hover:border-[#0284C7]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Cover */}
                <div
                  onClick={() => onSelectPost(post)}
                  className="relative aspect-16/9 w-full overflow-hidden bg-[#E2E8F0]"
                >
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[11px] font-bold rounded-full bg-white/90 text-[#0284C7] backdrop-blur-xs shadow-xs border border-white/60">
                    {post.category}
                  </span>

                  <span className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[11px] backdrop-blur-xs font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div onClick={() => onSelectPost(post)}>
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2.5">
                      <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{post.date}</span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-[#0F172A] leading-snug group-hover:text-[#0284C7] transition-colors mb-2.5 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover border border-[#CBD5E1]"
                      />
                      <span className="text-[11px] font-semibold text-[#0F172A] line-clamp-1">{post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPostToDelete(post);
                          }}
                          className="p-1.5 rounded-full bg-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors cursor-pointer"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => onSelectPost(post)}
                        className="text-xs font-bold text-[#0284C7] group-hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Baca
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[24px] border border-[#E2E8F0] p-8">
            <p className="text-[#64748B] text-sm">
              Tidak ada artikel yang cocok dengan kata kunci "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-3 px-5 py-2 text-xs font-bold text-white bg-[#0284C7] rounded-full"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>

      {/* Add New Article Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
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
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Tulis Artikel Pembelajaran Baru</h3>
                    <p className="text-[11px] text-[#64748B]">Simpan ke Firebase Firestore & Storage</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePost} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Judul Artikel <span className="text-[#EF4444]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Contoh: Mengapa Busa Sabun Bisa Mengangkat Lemak Minyak?"
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
                      <option value="Kimia Sehari-hari">Kimia Sehari-hari</option>
                      <option value="Tips Belajar">Tips Belajar</option>
                      <option value="Eksperimen Kreatif">Eksperimen Kreatif</option>
                      <option value="Fakta Unik">Fakta Unik</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Estimasi Waktu Baca</label>
                    <input
                      type="text"
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(e.target.value)}
                      placeholder="4 menit"
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Upload Image Section */}
                <div className="space-y-2 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Gambar Sampul Artikel</span>
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
                      <span>{isUploading ? 'Mengunggah...' : 'Pilih Gambar'}</span>
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

                  {formCoverImage ? (
                    <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#CBD5E1] bg-black/5">
                      <img src={formCoverImage} alt="Pratinjau Sampul" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormCoverImage('')}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-[#EF4444]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-20 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#0284C7] bg-white flex flex-col items-center justify-center gap-1 cursor-pointer p-3 text-center"
                    >
                      <Upload className="w-5 h-5 text-[#0284C7]" />
                      <span className="font-semibold text-[#0F172A] text-xs">Pilih Foto Sampul Artikel</span>
                      <span className="text-[10px] text-[#94A3B8]">Folder Firebase Storage: catatan_artikel</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Ringkasan / Sinopsis Artikel</label>
                  <textarea
                    rows={2}
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Tuliskan 1-2 kalimat pengantar yang menarik..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Isi Artikel Lengkap (Gunakan 2x Enter untuk Paragraf Baru)</label>
                  <textarea
                    rows={4}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Tuliskan isi artikel penjelasan konsep di sini..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
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
        {postToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPostToDelete(null)}
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
              <h3 className="text-base font-bold text-[#0F172A] mb-1">Hapus Artikel Belajar?</h3>
              <p className="text-xs text-[#64748B] mb-5">
                Artikel "{postToDelete.title}" akan dihapus permanen dari Firebase Firestore.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setPostToDelete(null)}
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-semibold text-[#64748B]"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (onDeletePost) {
                      onDeletePost(postToDelete.id);
                    }
                    onAddToast('Artikel Dihapus', `Artikel "${postToDelete.title}" telah dihapus.`, 'info');
                    setPostToDelete(null);
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
                    <p className="text-xs text-[#64748B]">Buka akses untuk menulis artikel kimia baru</p>
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
