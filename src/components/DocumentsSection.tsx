import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, Eye, Calendar, Sparkles, Filter, CheckCircle2, ArrowDownToLine, Search } from 'lucide-react';
import { DOCUMENT_ITEMS } from '../data/mockData';
import { DocumentItem } from '../types';

interface DocumentsSectionProps {
  onPreviewDoc: (doc: DocumentItem) => void;
  onDownloadDoc: (doc: DocumentItem) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  onPreviewDoc,
  onDownloadDoc
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const grades = ['Semua', 'Kelas X', 'Kelas XI', 'Kelas XII'];
  const types = ['Semua', 'Modul Ajar', 'LKPD Praktikum', 'Ringkasan & Rumus', 'Bank Soal'];

  const filteredDocs = DOCUMENT_ITEMS.filter((doc) => {
    const matchesGrade = selectedGrade === 'Semua' || doc.classGrade === selectedGrade || doc.classGrade === 'Semua Tingkat';
    const matchesType = selectedType === 'Semua' || doc.category === selectedType;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesType && matchesSearch;
  });

  return (
    <section id="modul" className="py-20 bg-[#F4F8FC] relative border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
              <ArrowDownToLine className="w-3.5 h-3.5 text-[#0284C7]" />
              <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Dokumentasi Berkas & Materi Unduhan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
              Pusat Modul & <span className="font-semibold text-[#0284C7]">Berkas Pembelajaran</span>
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base mt-2 max-w-xl">
              Unduh LKPD praktikum, modul ajar kurikulum kimia SMA terbaru, dan cheat sheet rumus ringkas bebas biaya.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#0284C7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul (misal: asam basa, stoikiometri)..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white border border-[#E2E8F0] focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] placeholder:text-[#94A3B8] shadow-2xs transition-all"
            />
          </div>
        </div>

        {/* Grade & Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-[20px] border border-[#E2E8F0] shadow-2xs">
          
          {/* Grade tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-[#64748B] mr-1 hidden sm:inline">Jenjang:</span>
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  selectedGrade === grade
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#0F172A]'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Type tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-[#64748B] mr-1 hidden sm:inline">Kategori:</span>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  selectedType === type
                    ? 'bg-[#0F172A] text-white shadow-2xs'
                    : 'text-[#64748B] hover:bg-[#E0F2FE] hover:text-[#0F172A]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Document Cards Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredDocs.map((doc) => (
              <motion.div
                layout
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-[0_4px_24px_rgba(2,132,199,0.05)] hover:shadow-lg hover:border-[#0284C7]/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle top decoration bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0284C7] opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Category & Grade chips */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                      {doc.category}
                    </span>
                    <span className="text-xs font-semibold text-[#64748B]">
                      {doc.classGrade}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold font-heading text-[#0F172A] leading-snug group-hover:text-[#0284C7] transition-colors mb-2.5">
                    {doc.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 mb-4">
                    {doc.summary}
                  </p>

                  {/* Topics Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {doc.topics.slice(0, 3).map((topic, i) => (
                      <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#F4F8FC] border border-[#E2E8F0] text-[#64748B] font-medium">
                        {topic}
                      </span>
                    ))}
                    {doc.topics.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#F4F8FC] border border-[#E2E8F0] text-[#64748B]">
                        +{doc.topics.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Metadata & Actions */}
                <div className="pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-3">
                    <span className="font-mono">{doc.fileFormat} • {doc.fileSize} ({doc.pages} Hal)</span>
                    <span className="font-semibold text-[#0F172A]">{doc.downloads.toLocaleString('id-ID')} unduhan</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onPreviewDoc(doc)}
                      className="w-full py-2.5 px-3 rounded-xl border border-[#E2E8F0] bg-[#F4F8FC] hover:bg-[#E0F2FE] hover:text-[#0284C7] text-xs font-semibold text-[#334155] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => onDownloadDoc(doc)}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-xs transition-all"
                    >
                      <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Unduh</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[24px] border border-[#E2E8F0] p-8">
            <p className="text-[#64748B] text-sm">
              Tidak ada modul atau LKPD yang sesuai dengan filter yang dipilih.
            </p>
            <button
              onClick={() => {
                setSelectedGrade('Semua');
                setSelectedType('Semua');
                setSearchQuery('');
              }}
              className="mt-3 px-5 py-2 text-xs font-bold text-white bg-[#0284C7] rounded-full"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
