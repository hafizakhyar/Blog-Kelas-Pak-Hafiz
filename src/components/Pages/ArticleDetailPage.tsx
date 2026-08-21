import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Heart,
  Share2,
  Copy,
  Check,
  Sparkles,
  Tag,
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
  Quote,
  MessageCircle
} from 'lucide-react';
import { BlogPost } from '../../types';
import { TEACHER_INFO } from '../../data/mockData';

interface ArticleDetailPageProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onBack: () => void;
  onOpenMainPortal: () => void;
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  post,
  allPosts,
  onSelectPost,
  onBack,
  onOpenMainPortal,
  onAddToast,
}) => {
  const [likes, setLikes] = useState<number>(post.reactions || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    setLikes(post.reactions || 0);
    setHasLiked(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      post.reactions = (post.reactions || 0) + 1;
      onAddToast('Terima Kasih!', 'Apresiasi Anda telah tercatat.', 'success');
    } else {
      setLikes((prev) => Math.max(0, prev - 1));
      setHasLiked(false);
      post.reactions = Math.max(0, (post.reactions || 0) - 1);
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      onAddToast('Tautan Disalin!', 'Link artikel siap dibagikan ke teman atau grup kelas.', 'info');
    }
  };

  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(
      `📖 *Artikel Sains & Kimia: ${post.title}*\nOleh: ${post.author.name}\n\nBaca artikel ulasan selengkapnya di sini:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank', 'noopener,noreferrer');
  };

  // Related articles in same category or others
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F4F8FC] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] hover:text-[#0284C7] hover:border-[#0284C7] text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B] group-hover:text-[#0284C7] group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Daftar Artikel</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Bagikan ke WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#CBD5E1] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin Tautan Artikel"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
            </button>
          </div>
        </div>

        {/* Main Article Container */}
        <article className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden mb-12">
          
          {/* Header Metadata Section */}
          <div className="p-6 sm:p-12 pb-6 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#0284C7] text-white shadow-2xs">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#64748B] font-semibold bg-[#F1F5F9] px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-4.5xl font-light font-heading text-[#0F172A] leading-tight tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Author Profile and Published Date */}
            <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-3.5">
                <img
                  src={post.author.avatar || TEACHER_INFO.avatar}
                  alt={post.author.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#38BDF8] shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#0F172A]">{post.author.name}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#E0F2FE] text-[#0284C7] font-semibold">
                      Penulis
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B]">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0284C7]" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-[#EF4444]">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{likes} Apresiasi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Large Main Header Image */}
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-[#0F172A] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 text-white text-xs font-medium backdrop-blur-sm bg-black/40 px-3 py-1.5 rounded-lg border border-white/15">
              🔬 Dokumentasi & Ilustrasi Sains Kelas Pak Hafiz
            </div>
          </div>

          {/* Article Full Body */}
          <div className="p-6 sm:p-12 space-y-8">
            
            {/* Lead Summary Paragraph */}
            <div className="text-lg sm:text-xl text-[#0F172A] font-medium leading-relaxed bg-[#F0F9FF] p-6 rounded-2xl border-l-4 border-[#0284C7]">
              {post.summary}
            </div>

            {/* Structured Content Paragraphs */}
            <div className="space-y-6 text-base sm:text-lg text-[#334155] leading-relaxed">
              {post.content.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Highlighted Key Takeaways Box */}
            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="p-6 sm:p-8 rounded-[24px] bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                <div className="flex items-center gap-2.5 text-[#0F172A] font-bold text-base">
                  <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3>Poin Inti Pembelajaran (Key Takeaways)</h3>
                    <p className="text-xs text-[#64748B] font-normal">
                      Kesimpulan konsep penting yang dapat diaplikasikan
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  {post.keyTakeaways.map((takeaway, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex items-start gap-3 text-xs sm:text-sm text-[#0F172A] shadow-2xs"
                    >
                      <BookmarkCheck className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chemistry Teacher Quote / Advice */}
            <div className="p-6 rounded-2xl bg-linear-to-r from-[#0284C7] to-[#0369A1] text-white space-y-2 relative overflow-hidden">
              <Quote className="w-16 h-16 text-white/10 absolute -top-2 right-2 pointer-events-none" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-sky-200">
                Pesan & Refleksi Pak Hafiz
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed font-light text-white/90">
                "Memahami kimia bukan sekadar mengingat lambang unsur atau rumus hitungan, melainkan melihat keindahan keteraturan alam semesta yang bekerja di sekitar kita setiap detiknya."
              </p>
            </div>

            {/* Tags List */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#64748B] flex items-center gap-1 mr-1">
                  <Tag className="w-3.5 h-3.5 text-[#0284C7]" />
                  Topik Bahasan:
                </span>
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-xs font-medium transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Engagement & Action Bar */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    hasLiked
                      ? 'bg-[#EF4444] text-white shadow-xs'
                      : 'bg-white hover:bg-[#FEE2E2] text-[#64748B] hover:text-[#EF4444] border border-[#CBD5E1]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{hasLiked ? 'Artikel Disukai' : 'Suka Artikel'} ({likes})</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-full bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#CBD5E1] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenMainPortal}
                  className="px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Eksplorasi Portal Pembelajaran</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0F172A]">
                  Artikel Pembelajaran Terkait Lainnya
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Jelajahi tulisan edukatif dan trik sains menarik lainnya
                </p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua Artikel</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((relPost) => (
                <div
                  key={relPost.id}
                  onClick={() => onSelectPost(relPost)}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#0284C7] hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-[#E2E8F0]">
                    <img
                      src={relPost.coverImage}
                      alt={relPost.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[#0F172A] text-[10px] font-bold shadow-2xs">
                        {relPost.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                        <Clock className="w-3 h-3 text-[#0284C7]" />
                        <span>{relPost.readTime}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors leading-snug">
                        {relPost.title}
                      </h4>
                      <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                        {relPost.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#0284C7] font-semibold">
                      <span>Baca Selengkapnya</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
