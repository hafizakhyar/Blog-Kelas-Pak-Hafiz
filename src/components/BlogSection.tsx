import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles, Heart, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/mockData';
import { BlogPost } from '../types';

interface BlogSectionProps {
  onSelectPost: (post: BlogPost) => void;
  onOpenMainPortal: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onSelectPost, onOpenMainPortal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Kimia Sehari-hari', 'Tips Belajar', 'Eksperimen Kreatif', 'Fakta Unik'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === 'Semua') return true;
    return post.category === selectedCategory;
  });

  const featuredPost = filteredPosts[0] || BLOG_POSTS[0];
  const secondaryPosts = filteredPosts.slice(1);

  return (
    <section id="blog" className="py-20 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Majalah & Catatan Belajar Digital</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Artikel & Catatan <span className="font-semibold text-[#0284C7]">Pembelajaran Kimia</span>
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base mt-2 max-w-xl">
              Ulasan mendalam dan santai seputar fenomena kimia di kehidupan nyata, strategi taktis menaklukkan soal, dan fakta sains unik.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'bg-white text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#0F172A] border border-[#E2E8F0]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Digital Magazine Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Featured Main Article (7 cols) */}
          {featuredPost && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => onSelectPost(featuredPost)}
              className="lg:col-span-7 bg-white rounded-[28px] sm:rounded-[32px] overflow-hidden border border-[#E2E8F0] shadow-[0_4px_24px_rgba(2,132,199,0.06)] hover:shadow-lg hover:border-[#0284C7]/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative aspect-16/9 w-full overflow-hidden bg-[#E2E8F0]">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/75 via-transparent to-transparent" />
                
                {/* Category & Read Time Pills */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-white/90 backdrop-blur-xs text-[#0F172A] shadow-xs border border-white/60">
                    {featuredPost.category}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-black/50 text-white backdrop-blur-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#38BDF8]" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </div>

              {/* Text Information */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs text-[#64748B] mb-3">
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>Oleh {featuredPost.author.name}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#0F172A] group-hover:text-[#0284C7] transition-colors leading-snug mb-3">
                  {featuredPost.title}
                </h3>

                <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                  {featuredPost.summary}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
                    />
                    <span className="text-xs font-semibold text-[#0F172A]">{featuredPost.author.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0284C7] group-hover:translate-x-1 transition-transform">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Secondary Articles List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {secondaryPosts.map((post) => (
              <motion.article
                layout
                key={post.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelectPost(post)}
                className="p-4 sm:p-5 rounded-[20px] bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#0284C7]/40 transition-all group cursor-pointer flex gap-4 items-center"
              >
                {/* Thumbnail */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-[#E2E8F0]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7]">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-[#64748B]">• {post.readTime}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold font-heading text-[#0F172A] group-hover:text-[#0284C7] transition-colors leading-snug line-clamp-2 mb-1.5">
                    {post.title}
                  </h4>

                  <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </motion.article>
            ))}

            {/* Banner to Classroom Hub */}
            <div className="p-6 rounded-[24px] bg-[#EBF5FF] border border-[#BAE6FD] text-[#0F172A] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-white px-2.5 py-1 rounded-full border border-[#BAE6FD] shadow-2xs">
                  Eksklusif Siswa
                </span>
                <h4 className="text-base font-bold font-heading text-[#0F172A] mt-2.5">
                  Ingin Seri Artikel & Pembahasan Video Lengkap?
                </h4>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                  Gabung di portal kelas daring untuk mengakses puluhan arsip artikel premium dan rangkuman kimia interaktif.
                </p>
              </div>

              <button
                onClick={onOpenMainPortal}
                className="mt-4 px-5 py-2.5 text-xs font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all w-fit cursor-pointer"
              >
                <span>Buka Website Pembelajaran Utama</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#BAE6FD]" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
