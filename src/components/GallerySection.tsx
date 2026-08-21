import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Eye, Calendar, Clock, Filter, ArrowUpRight, Search } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';
import { GalleryItem } from '../types';

interface GallerySectionProps {
  onSelectItem: (item: GalleryItem) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Indikator Alami', 'Eksperimen Lab', 'Karya Siswa'];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.chemistryConcept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="galeri" className="py-20 bg-[#F4F8FC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Dokumentasi Praktik & Media</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Galeri Eksperimen & <span className="font-semibold text-[#0284C7]">Laboratorium</span>
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base mt-2 max-w-xl">
              Dokumentasi nyata kegiatan praktikum kimia siswa. Dari uji indikator alami dapur hingga titrasi presisi laboratorium.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#0284C7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari eksperimen (kunyit, titrasi)..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white border border-[#E2E8F0] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
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

        {/* Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.article
                layout
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelectItem(item)}
                className="group relative bg-white rounded-[24px] overflow-hidden border border-[#E2E8F0] shadow-[0_4px_24px_rgba(2,132,199,0.06)] hover:shadow-lg hover:border-[#0284C7]/40 transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-[#E2E8F0]">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0F172A]/75 via-transparent to-transparent opacity-75 group-hover:opacity-85 transition-opacity" />
                  
                  {/* Category Chip */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full bg-white/90 text-[#0F172A] backdrop-blur-xs shadow-xs border border-white/60">
                    {item.category}
                  </span>

                  {/* Badge */}
                  <span className="absolute top-3.5 right-3.5 px-3 py-1 text-[11px] font-medium rounded-full bg-[#0F172A]/80 text-white backdrop-blur-xs">
                    {item.badge}
                  </span>

                  {/* Video Duration if available */}
                  {item.videoDuration && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/60 text-white text-[11px] backdrop-blur-xs font-mono">
                      <Play className="w-3 h-3 fill-white" />
                      <span>{item.videoDuration}</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{item.date}</span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-[#0F172A] leading-snug group-hover:text-[#0284C7] transition-colors mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0284C7] group-hover:underline flex items-center gap-1">
                      Lihat Prosedur & Data
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="p-2 rounded-full bg-[#F4F8FC] text-[#64748B] group-hover:bg-[#E0F2FE] group-hover:text-[#0284C7] transition-colors">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[24px] border border-[#E2E8F0] p-8">
            <p className="text-[#64748B] text-sm">
              Tidak ada dokumentasi yang cocok dengan kata kunci "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="mt-3 px-5 py-2 text-xs font-bold text-white bg-[#0284C7] rounded-full"
            >
              Reset Pencarian
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
