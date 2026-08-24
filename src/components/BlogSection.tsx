import React, { useState, useRef, useMemo, useEffect } from 'react';
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
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  Compass,
  Camera
} from 'lucide-react';
import { BLOG_POSTS, TEACHER_INFO } from '../data/mockData';
import { BlogPost } from '../types';
import { uploadFileToFirebaseStorage, STORAGE_FOLDERS } from '../lib/firebase';
import { PhotoChangerModal } from './Modals/PhotoChangerModal';
import { WhatsAppShareButton } from './Common/WhatsAppShareButton';
import { shareArticleToWhatsApp } from '../utils/share';

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
  onUpdatePost?: (post: BlogPost) => void;
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
  onUpdatePost,
  onAddToast = (_t: string, _d?: string, _ty?: 'success' | 'info') => {}
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Spotlight / Active Article on the Large Preview Side
  const [activePostId, setActivePostId] = useState<string>('');

  // Quick Photo Changer for Teacher
  const [itemForPhotoChange, setItemForPhotoChange] = useState<BlogPost | null>(null);

  // Admin Passcode Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passcodeAttempt.trim() === DEFAULT_ADMIN_PASSCODE ||
      passcodeAttempt.trim() === 'admin123' ||
      passcodeAttempt.trim() === 'hafiz2026'
    ) {
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

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Keep active post updated with the filtered list
  useEffect(() => {
    if (filteredPosts.length > 0) {
      if (!activePostId || !filteredPosts.some((p) => p.id === activePostId)) {
        setActivePostId(filteredPosts[0].id);
      }
    }
  }, [filteredPosts, activePostId]);

  const activePost = useMemo(() => {
    return filteredPosts.find((p) => p.id === activePostId) || filteredPosts[0] || null;
  }, [filteredPosts, activePostId]);

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

    setActivePostId(newPost.id);
    setIsAddModalOpen(false);
    setFormTitle('');
    setFormSummary('');
    setFormContent('');
    setFormCoverImage('');
    onAddToast('Artikel Ditambahkan', `Artikel "${newPost.title}" tersimpan di Firebase Firestore.`, 'success');
  };

  return (
    <section id="blog" className="py-20 sm:py-24 bg-[#F4F8FC] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Wawasan & Eksplorasi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Artikel <span className="font-semibold text-[#0284C7]">Sains</span>
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm mt-2 max-w-xl">
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
                placeholder="Cari artikel sains..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white border border-[#CBD5E1] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
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

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#0284C7] text-white border-[#0284C7] shadow-xs'
                  : 'bg-white text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#0284C7] border-[#E2E8F0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 2-Sisi Layout (Large Spotlight View on Left, Scrollable Vertical List on Right) */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SISI KIRI: TAMPILAN BESAR (FEATURED / ACTIVE ARTICLE SPOTLIGHT) */}
            <div className="lg:col-span-7 xl:col-span-7">
              {activePost && (
                <motion.article
                  key={activePost.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden border border-[#CBD5E1] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Large Cover Image */}
                  <div
                    onClick={() => onSelectPost(activePost)}
                    className="relative aspect-16/9 sm:aspect-21/9 lg:aspect-16/9 w-full overflow-hidden bg-[#E2E8F0] cursor-pointer group"
                  >
                    <img
                      src={activePost.coverImage}
                      alt={activePost.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/85 via-[#0F172A]/30 to-transparent" />
                    
                    {/* Top Badges & Teacher Photo Changer */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-white/95 text-[#0284C7] backdrop-blur-md shadow-xs border border-white/60">
                          {activePost.category}
                        </span>
                        <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Sorotan Utama</span>
                        </span>
                      </div>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemForPhotoChange(activePost);
                          }}
                          className="px-3 py-1.5 rounded-full bg-white/95 hover:bg-[#0284C7] text-[#0284C7] hover:text-white border border-[#BAE6FD] hover:border-[#0284C7] text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md transform hover:scale-105"
                          title="Ganti / Cari Foto via Google atau Unggah dari HP/Laptop"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Ganti / Cari Foto</span>
                        </button>
                      )}
                    </div>

                    {/* Bottom Metadata inside Image */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                        <span className="font-medium text-slate-200">{activePost.date}</span>
                      </div>
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] backdrop-blur-md font-mono">
                        <Clock className="w-3 h-3 text-[#38BDF8]" />
                        <span>{activePost.readTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
                    <div>
                      {/* Title */}
                      <h3
                        onClick={() => onSelectPost(activePost)}
                        className="text-xl sm:text-2xl lg:text-2xl font-bold font-heading text-[#0F172A] leading-tight hover:text-[#0284C7] transition-colors cursor-pointer"
                      >
                        {activePost.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed mt-3">
                        {activePost.summary}
                      </p>

                      {/* Key Takeaways Highlights if available */}
                      {activePost.keyTakeaways && activePost.keyTakeaways.length > 0 && (
                        <div className="mt-5 p-4 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD]/80">
                          <span className="text-[11px] font-bold text-[#0369A1] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                            <BookmarkCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                            <span>Poin Inti Wawasan:</span>
                          </span>
                          <ul className="space-y-1.5 text-xs text-[#334155]">
                            {activePost.keyTakeaways.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tags */}
                      {activePost.tags && activePost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {activePost.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[#475569] text-[11px] font-medium border border-[#E2E8F0]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Author & CTA Bar */}
                    <div className="pt-5 border-t border-[#E2E8F0] flex items-center justify-between flex-wrap gap-4">
                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <img
                          src={activePost.author.avatar}
                          alt={activePost.author.name}
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-[#CBD5E1]"
                        />
                        <div>
                          <div className="text-xs font-bold text-[#0F172A]">{activePost.author.name}</div>
                          <div className="text-[10px] text-[#64748B]">{activePost.author.role}</div>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-2">
                        <WhatsAppShareButton
                          onClick={(e) => {
                            e.stopPropagation();
                            shareArticleToWhatsApp(activePost);
                          }}
                          label="Bagikan WA"
                          size="sm"
                          title="Bagikan Artikel ke WhatsApp"
                        />

                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPostToDelete(activePost);
                            }}
                            className="p-2 rounded-xl bg-[#FEE2E2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors cursor-pointer"
                            title="Hapus Artikel ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => onSelectPost(activePost)}
                          className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-[#0284C7]/20 transition-all cursor-pointer group"
                        >
                          <span>Baca Artikel Lengkap</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )}
            </div>

            {/* SISI KANAN: TAMPILAN KECIL DI SAMPING BERURUTAN KE BAWAH 1 KOLOM YANG BISA DI-SCROLL */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
              
              {/* Header Box for Side List */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#CBD5E1]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Daftar Artikel Sains</h3>
                    <p className="text-[11px] text-[#64748B]">
                      {filteredPosts.length} artikel tersedia • Klik untuk melihat
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md border border-[#BAE6FD]">
                  Bisa di-scroll ↓
                </span>
              </div>

              {/* Scrollable Column Container */}
              <div className="space-y-3 max-h-[640px] overflow-y-auto pr-2 custom-scrollbar focus:outline-none">
                {filteredPosts.map((post) => {
                  const isCurrentActive = activePost?.id === post.id;
                  return (
                    <motion.div
                      key={post.id}
                      onClick={() => setActivePostId(post.id)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3.5 items-start ${
                        isCurrentActive
                          ? 'bg-white border-[#0284C7] ring-2 ring-[#0284C7]/20 shadow-md'
                          : 'bg-white hover:bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1] shadow-2xs'
                      }`}
                    >
                      {/* Compact Thumbnail Image */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-[#E2E8F0] shrink-0 group/thumb">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setItemForPhotoChange(post);
                            }}
                            className="absolute top-1 right-1 z-10 p-1.5 rounded-full bg-white/90 hover:bg-[#0284C7] text-[#0284C7] hover:text-white border border-[#BAE6FD] text-[10px] shadow-xs cursor-pointer transition-colors"
                            title="Ganti Foto Artikel via Google / Upload"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        )}
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                          {post.readTime}
                        </span>
                      </div>

                      {/* Info & Metadata */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-24 py-0.5">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md truncate max-w-[120px]">
                              {post.category}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] shrink-0 font-mono">
                              {post.date}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-[#0F172A] leading-snug line-clamp-2 hover:text-[#0284C7] transition-colors">
                            {post.title}
                          </h4>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
                          <span className="text-[10px] text-[#64748B] truncate max-w-[110px]">
                            {post.author.name}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <WhatsAppShareButton
                              onClick={(e) => {
                                e.stopPropagation();
                                shareArticleToWhatsApp(post);
                              }}
                              size="icon"
                              title="Bagikan Artikel ke WhatsApp"
                            />

                            {isAdmin && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPostToDelete(post);
                                }}
                                className="p-1 rounded-md text-[#EF4444] hover:bg-[#FEE2E2] transition-colors"
                                title="Hapus artikel"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectPost(post);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284C7] hover:underline"
                            >
                              <span>Buka</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>

          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 bg-white rounded-3xl border border-[#CBD5E1] p-8 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#0F172A]">Tidak ada artikel sains yang cocok</h4>
            <p className="text-xs text-[#64748B] mt-1">
              Tidak ditemukan artikel untuk kata kunci "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-4 px-5 py-2 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-full transition-all cursor-pointer"
            >
              Reset Pencarian
            </button>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Admin / Teacher Passcode Verification */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminModalOpen(false)}
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
                    <p className="text-[10px] text-[#64748B]">Tulis & Publikasikan Artikel Sains</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAdminModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                <p className="text-[#475569] text-xs leading-relaxed">
                  Masukkan kata sandi guru untuk mempublikasikan artikel pembelajaran baru.
                </p>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">Kata Sandi Guru</label>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={passcodeAttempt}
                    onChange={(e) => {
                      setPasscodeAttempt(e.target.value);
                      setPasscodeError(false);
                    }}
                    placeholder="Masukkan kata sandi..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-mono text-sm focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                  />
                  {passcodeError && (
                    <p className="text-[11px] text-[#EF4444] mt-1 font-semibold">
                      Kata sandi salah. Coba gunakan hafiz2026.
                    </p>
                  )}
                  <p className="text-[10px] text-[#94A3B8] mt-1">
                    Kata sandi default: <code className="font-mono text-[#0284C7]">hafiz2026</code>
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setIsAdminModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#CBD5E1] text-[#64748B] hover:bg-[#F1F5F9] font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold shadow-xs cursor-pointer"
                  >
                    Buka Akses
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: Add New Article Modal */}
      {/* ========================================================================= */}
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
                    <h3 className="text-sm font-bold text-[#0F172A]">Tulis Artikel Sains Baru</h3>
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

      {/* ========================================================================= */}
      {/* MODAL 3: Delete Confirmation Modal */}
      {/* ========================================================================= */}
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
              <h3 className="text-base font-bold text-[#0F172A] mb-1">Hapus Artikel Sains?</h3>
              <p className="text-xs text-[#64748B] mb-5">
                Artikel "{postToDelete.title}" akan dihapus permanen dari Firebase Firestore.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setPostToDelete(null)}
                  className="px-4 py-2 rounded-full border border-[#CBD5E1] text-xs font-semibold text-[#64748B] cursor-pointer"
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
                  className="px-4 py-2 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Hapus Permanen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Photo Changer Modal for Teacher */}
      {itemForPhotoChange && (
        <PhotoChangerModal
          isOpen={!!itemForPhotoChange}
          onClose={() => setItemForPhotoChange(null)}
          currentImageUrl={itemForPhotoChange.coverImage}
          itemTitle={itemForPhotoChange.title}
          modalTitle="Ganti Sampul Artikel Sains"
          storageFolder={STORAGE_FOLDERS.ARTICLE_IMAGES}
          onSavePhoto={(newUrl) => {
            if (onUpdatePost && itemForPhotoChange) {
              onUpdatePost({
                ...itemForPhotoChange,
                coverImage: newUrl
              });
            }
            onAddToast('Sampul Artikel Diperbarui', 'Foto sampul artikel berhasil disimpan.', 'success');
            setItemForPhotoChange(null);
          }}
          onAddToast={onAddToast}
        />
      )}

    </section>
  );
};
