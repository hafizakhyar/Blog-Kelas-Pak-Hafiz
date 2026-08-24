import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Calendar, Heart, Share2, BookmarkCheck, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { BlogPost } from '../../types';
import { WhatsAppShareButton } from '../Common/WhatsAppShareButton';
import { shareArticleToWhatsApp } from '../../utils/share';

interface ArticleReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onOpenMainPortal: () => void;
  onShare: (title: string) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({
  post,
  onClose,
  onOpenMainPortal,
  onShare
}) => {
  const [likes, setLikes] = useState<number>(post?.reactions || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  if (!post) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    } else {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-[#0F172A]/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Top Bar with actions */}
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F4F8FC] shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                {post.readTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <WhatsAppShareButton
                onClick={() => shareArticleToWhatsApp(post)}
                label="WhatsApp"
                size="sm"
                title="Bagikan Artikel ke WhatsApp"
              />
              <button
                onClick={() => onShare(post.title)}
                className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 rounded-full transition-colors cursor-pointer"
                title="Salin Judul Artikel"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 rounded-full transition-colors cursor-pointer"
                aria-label="Tutup artikel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Reader Content */}
          <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
            {/* Header Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-light font-heading text-[#0F172A] leading-tight mb-4">
                {post.title}
              </h1>

              {/* Author and Date Meta */}
              <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">{post.author.name}</h4>
                    <p className="text-xs text-[#64748B]">{post.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{post.date}</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative rounded-[20px] overflow-hidden aspect-video bg-[#E2E8F0]">
              <img
                src={post.coverImage}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Key Takeaways summary banner */}
            <div className="p-5 rounded-[20px] bg-[#E0F2FE] border border-[#BAE6FD] space-y-2">
              <div className="flex items-center gap-2 text-[#0369A1] font-bold text-sm font-heading">
                <Sparkles className="w-4 h-4 text-[#0284C7]" />
                Poin Kunci & Intisari Pembelajaran:
              </div>
              <ul className="space-y-1.5 pl-2">
                {post.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#334155]">
                    <BookmarkCheck className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Body Paragraphs */}
            <div className="prose prose-slate max-w-none space-y-4 text-[#334155] leading-relaxed text-sm sm:text-base">
              {post.content.map((paragraph, idx) => (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Topik Terkait:</span>
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs rounded-full bg-[#F4F8FC] text-[#0369A1] border border-[#E2E8F0] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Reader Footer Action */}
          <div className="p-4 sm:p-5 bg-[#F4F8FC] border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                hasLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white text-[#334155] border border-[#E2E8F0] hover:bg-[#E0F2FE]'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likes} Apresiasi</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenMainPortal();
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl shadow-md shadow-[#0284C7]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span>Lanjut Belajar di Portal Utama</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
