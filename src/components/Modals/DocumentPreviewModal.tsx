import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileText, Download, Calendar, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentPreviewModalProps {
  doc: DocumentItem | null;
  onClose: () => void;
  onDownload: (doc: DocumentItem) => void;
  onOpenMainPortal: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  doc,
  onClose,
  onDownload,
  onOpenMainPortal
}) => {
  return (
    <AnimatePresence>
      {doc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-[28px] shadow-2xl border border-[#E2E8F0] overflow-hidden my-auto z-10"
          >
          {/* Header */}
          <div className="p-6 border-b border-[#E2E8F0] bg-[#F4F8FC] flex items-start justify-between">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-[16px] bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center shrink-0 mt-0.5 border border-[#BAE6FD]">
                <FileText className="w-6 h-6 text-[#0284C7]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                    {doc.category}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white text-[#64748B] border border-[#E2E8F0]">
                    {doc.classGrade}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-[#0F172A] leading-tight">
                  {doc.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 transition-colors cursor-pointer"
              aria-label="Tutup preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Preview */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-3 gap-3 p-4 rounded-[20px] bg-[#F4F8FC] border border-[#E2E8F0] text-center">
              <div>
                <div className="text-xs text-[#64748B]">Format Berkas</div>
                <div className="font-bold text-[#0F172A] text-sm mt-0.5">{doc.fileFormat}</div>
              </div>
              <div className="border-x border-[#E2E8F0]">
                <div className="text-xs text-[#64748B]">Ukuran / Halaman</div>
                <div className="font-bold text-[#0F172A] text-sm mt-0.5">{doc.fileSize} ({doc.pages} Hal)</div>
              </div>
              <div>
                <div className="text-xs text-[#64748B]">Total Unduhan</div>
                <div className="font-bold text-[#0284C7] text-sm mt-0.5">{doc.downloads.toLocaleString('id-ID')}+</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-2">Ringkasan Dokumen</h4>
              <p className="text-[#334155] text-sm leading-relaxed">
                {doc.summary}
              </p>
            </div>

            {/* Topics Included */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-2.5">Materi & Sub-Topik yang Termuat</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {doc.topics.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#334155] bg-[#F4F8FC] p-2.5 rounded-xl border border-[#E2E8F0]">
                    <CheckCircle className="w-4 h-4 text-[#0284C7] shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Callout Notice */}
            <div className="flex items-center gap-3 p-4 rounded-[18px] bg-[#E0F2FE] border border-[#BAE6FD] text-xs text-[#0369A1]">
              <Sparkles className="w-5 h-5 text-[#0284C7] shrink-0" />
              <span>
                Berkas ini berlisensi terbuka untuk keperluan edukasi dan pembelajaran siswa SMA.
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-[#F4F8FC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-[#64748B] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
              Terakhir diperbarui: {doc.updatedDate}
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  onOpenMainPortal();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-[#334155] hover:bg-[#E2E8F0]/60 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#E2E8F0] cursor-pointer"
              >
                <span>Akses Pembahasan Soal</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#0284C7]" />
              </button>
              <button
                onClick={() => {
                  onDownload(doc);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl shadow-md shadow-[#0284C7]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Unduh {doc.fileFormat} Sekarang</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
