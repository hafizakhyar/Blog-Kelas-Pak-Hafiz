import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Copy,
  Check,
  FileText,
  Calendar,
  CheckCircle,
  Sparkles,
  ExternalLink,
  BookOpen,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  Layers,
  GraduationCap,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { DocumentItem } from '../../types';
import { TEACHER_INFO, DOCUMENT_ITEMS } from '../../data/mockData';

interface DocumentDetailPageProps {
  doc: DocumentItem;
  allDocs: DocumentItem[];
  onSelectDoc: (doc: DocumentItem) => void;
  onBack: () => void;
  onDownload: (doc: DocumentItem) => void;
  onOpenMainPortal: () => void;
  onAddToast: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const DocumentDetailPage: React.FC<DocumentDetailPageProps> = ({
  doc,
  allDocs,
  onSelectDoc,
  onBack,
  onDownload,
  onOpenMainPortal,
  onAddToast,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    setCurrentPage(1);
    setZoomLevel(100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [doc.id]);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      onAddToast('Tautan Disalin!', 'Link modul siap dibagikan ke siswa atau grup belajar.', 'info');
    }
  };

  const handleShareWhatsApp = () => {
    const shareText = encodeURIComponent(
      `📑 *Modul & Berkas Kimia: ${doc.title}*\nJenjang: ${doc.classGrade} | Kategori: ${doc.category}\nFormat: ${doc.fileFormat} (${doc.fileSize})\n\nUnduh dan lihat preview berkasnya di sini:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank', 'noopener,noreferrer');
  };

  const handlePrint = () => {
    window.print();
    onAddToast('Menyiapkan Cetak', 'Dialog cetak dokumen PDF sedang dibuka.', 'info');
  };

  // Related documents
  const relatedDocs = allDocs
    .filter((d) => d.id !== doc.id && (d.category === doc.category || d.classGrade === doc.classGrade))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F4F8FC] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] hover:text-[#0284C7] hover:border-[#0284C7] text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 text-[#64748B] group-hover:text-[#0284C7] group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali ke Pusat Modul</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Bagikan via WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-full bg-white hover:bg-[#E0F2FE] text-[#0284C7] border border-[#CBD5E1] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
            </button>
          </div>
        </div>

        {/* Main Document Details Card */}
        <article className="bg-white rounded-[32px] border border-[#E2E8F0] shadow-sm overflow-hidden mb-12">
          
          {/* Header Metadata */}
          <div className="p-6 sm:p-10 border-b border-[#F1F5F9] bg-linear-to-b from-[#F8FAFC] to-white">
            <div className="flex items-center gap-2.5 flex-wrap mb-4">
              <span className="px-3.5 py-1 rounded-full bg-[#0284C7] text-white text-xs font-bold shadow-2xs">
                {doc.category}
              </span>
              <span className="px-3.5 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] text-xs font-semibold border border-[#BAE6FD]">
                {doc.classGrade}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Format Resmi {doc.fileFormat}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-light font-heading text-[#0F172A] leading-tight tracking-tight mb-6">
              {doc.title}
            </h1>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD]">
              <div className="p-2 text-center">
                <div className="text-[11px] font-bold text-[#0369A1] uppercase tracking-wider">Format Berkas</div>
                <div className="text-base font-bold text-[#0F172A] mt-0.5">{doc.fileFormat}</div>
              </div>
              <div className="p-2 text-center border-l sm:border-x border-[#BAE6FD]">
                <div className="text-[11px] font-bold text-[#0369A1] uppercase tracking-wider">Ukuran File</div>
                <div className="text-base font-bold text-[#0F172A] mt-0.5">{doc.fileSize}</div>
              </div>
              <div className="p-2 text-center border-t sm:border-t-0 border-[#BAE6FD]">
                <div className="text-[11px] font-bold text-[#0369A1] uppercase tracking-wider">Jumlah Halaman</div>
                <div className="text-base font-bold text-[#0F172A] mt-0.5">{doc.pages} Halaman</div>
              </div>
              <div className="p-2 text-center border-t sm:border-t-0 border-l border-[#BAE6FD]">
                <div className="text-[11px] font-bold text-[#0369A1] uppercase tracking-wider">Total Unduhan</div>
                <div className="text-base font-bold text-[#0284C7] mt-0.5">{doc.downloads.toLocaleString('id-ID')}+ Siswa</div>
              </div>
            </div>

            {/* Primary Action Buttons Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 mt-6 pt-6 border-t border-[#E2E8F0]">
              <div className="flex items-center gap-3 flex-wrap">
                {doc.driveUrl ? (
                  <a
                    href={doc.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-[#0284C7]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Buka / Unduh di Google Drive</span>
                  </a>
                ) : (
                  <button
                    onClick={() => onDownload(doc)}
                    className="px-6 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-[#0284C7]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh File Sekarang</span>
                  </button>
                )}

                <button
                  onClick={handlePrint}
                  className="px-5 py-3 rounded-full bg-white hover:bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  title="Cetak Berkas Ini"
                >
                  <Printer className="w-4 h-4 text-[#64748B]" />
                  <span>Cetak / Print</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <Calendar className="w-4 h-4 text-[#0284C7]" />
                <span>Diperbarui: {doc.updatedDate}</span>
              </div>
            </div>
          </div>

          {/* Interactive Document Previewer Simulation */}
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                <Eye className="w-4 h-4 text-[#0284C7]" />
                <span>Pratinjau Dokumen Digital (PDF Previewer)</span>
              </div>

              {/* Viewer Controls */}
              <div className="flex items-center gap-2 bg-[#F1F5F9] p-1.5 rounded-full border border-[#E2E8F0] text-xs">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded-full hover:bg-white text-[#0F172A] disabled:opacity-30 cursor-pointer"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-2 font-semibold text-[#334155] text-xs">
                  Hal {currentPage} / {Math.min(doc.pages, 4)}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(Math.min(doc.pages, 4), p + 1))}
                  disabled={currentPage >= Math.min(doc.pages, 4)}
                  className="p-1 rounded-full hover:bg-white text-[#0F172A] disabled:opacity-30 cursor-pointer"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="h-3.5 w-px bg-[#CBD5E1] mx-1" />

                <button
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                  className="p-1 rounded-full hover:bg-white text-[#0F172A] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] font-mono text-[#64748B] w-9 text-center">
                  {zoomLevel}%
                </span>

                <button
                  onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                  className="p-1 rounded-full hover:bg-white text-[#0F172A] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Preview Canvas Page */}
            <div className="bg-[#475569] p-4 sm:p-8 rounded-[24px] overflow-x-auto flex justify-center shadow-inner border border-[#334155]">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-2xl bg-white rounded-lg shadow-2xl p-8 sm:p-12 text-[#0F172A] space-y-6 transition-transform duration-200 border border-[#E2E8F0] relative min-h-[640px]"
              >
                {/* Official Paper Header */}
                <div className="border-b-2 border-[#0F172A] pb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0284C7] text-white font-bold flex items-center justify-center text-base shadow-sm">
                      H
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                        KELAS PAK HAFIZ • KIMIA SMA
                      </h4>
                      <p className="text-[10px] text-[#64748B]">
                        Kurikulum Merdeka Sains • Modul Mandiri & Praktikum
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                      {doc.classGrade}
                    </span>
                    <p className="text-[9px] text-[#94A3B8] mt-0.5">Dokumen #{doc.id.toUpperCase()}</p>
                  </div>
                </div>

                {/* Page Content Simulator */}
                {currentPage === 1 && (
                  <div className="space-y-4">
                    <div className="text-center py-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                      <h2 className="text-base sm:text-lg font-bold font-heading text-[#0F172A]">
                        {doc.title}
                      </h2>
                      <p className="text-xs text-[#0284C7] font-semibold mt-0.5">
                        Penyusun: {TEACHER_INFO.name} ({TEACHER_INFO.title})
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-[#334155] leading-relaxed">
                      <h5 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                        A. Capaian & Tujuan Pembelajaran
                      </h5>
                      <p className="italic bg-[#F1F5F9] p-3 rounded-lg border-l-4 border-[#0284C7]">
                        "{doc.summary}"
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-[#334155]">
                      <h5 className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                        B. Peta Konsep & Materi Inti
                      </h5>
                      <div className="grid grid-cols-2 gap-2">
                        {doc.topics.map((t, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-[#0284C7] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-[11px] text-[#1E293B]">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {currentPage === 2 && (
                  <div className="space-y-4 text-xs text-[#334155]">
                    <div className="border-b border-[#E2E8F0] pb-2">
                      <h3 className="font-bold text-[#0F172A] text-sm">
                        C. Rangkuman Teori & Turunan Rumus Kimia
                      </h3>
                      <p className="text-[11px] text-[#64748B]">Halaman 2 — Analisis Konseptual Berjenjang</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] font-mono text-[11px] space-y-1.5">
                      <div className="font-bold text-[#0369A1] font-sans">Formula Kunci:</div>
                      <div>• [H⁺] = √(Ka × Ma) atau α × Ma</div>
                      <div>• pH = -log [H⁺] ; pOH = -log [OH⁻]</div>
                      <div>• Mol (n) = Gram / Mr = V_gas / 22.4 (STP)</div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-bold text-[#0F172A] text-[11px]">D. Contoh Soal Aplikasi Praktik:</h5>
                      <p className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] leading-relaxed">
                        Sebuah larutan asam asetat CH₃COOH 0.1 M memiliki Ka = 10⁻⁵. Tentukan derajat ionisasi (α) dan pH larutan tersebut!
                        <br />
                        <span className="font-bold text-[#0284C7] mt-1 block">
                          Pembahasan Lengkap: [H⁺] = √(10⁻⁵ × 0.1) = 10⁻³ M =&gt; pH = 3.
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {currentPage >= 3 && (
                  <div className="space-y-4 text-xs text-[#334155]">
                    <div className="border-b border-[#E2E8F0] pb-2">
                      <h3 className="font-bold text-[#0F172A] text-sm">
                        E. Lembar Kerja Praktik / Latihan Mandiri
                      </h3>
                      <p className="text-[11px] text-[#64748B]">Halaman {currentPage} — Evaluasi & Diskusi Siswa</p>
                    </div>

                    <table className="w-full text-left text-[11px] border-collapse border border-[#CBD5E1]">
                      <thead>
                        <tr className="bg-[#F1F5F9] font-bold text-[#0F172A]">
                          <th className="border border-[#CBD5E1] p-2">No</th>
                          <th className="border border-[#CBD5E1] p-2">Sampel Uji</th>
                          <th className="border border-[#CBD5E1] p-2">Warna Indikator</th>
                          <th className="border border-[#CBD5E1] p-2">Sifat Larutan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-[#CBD5E1] p-2">1</td>
                          <td className="border border-[#CBD5E1] p-2">Air Jeruk Lemon</td>
                          <td className="border border-[#CBD5E1] p-2">Merah Muda</td>
                          <td className="border border-[#CBD5E1] p-2">Asam (pH &lt; 7)</td>
                        </tr>
                        <tr>
                          <td className="border border-[#CBD5E1] p-2">2</td>
                          <td className="border border-[#CBD5E1] p-2">Air Sabun Mandi</td>
                          <td className="border border-[#CBD5E1] p-2">Hijau / Merah Bata</td>
                          <td className="border border-[#CBD5E1] p-2">Basa (pH &gt; 7)</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="p-3 bg-[#FEF3C7] rounded-lg border border-[#FCD34D] text-[#92400E] text-[11px]">
                      💡 <strong>Catatan Pengajar:</strong> Kumpulkan lembar kerja ini pada sesi praktikum berikutnya atau unggah melalui portal daring.
                    </div>
                  </div>
                )}

                {/* Watermark Footer */}
                <div className="pt-8 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#94A3B8]">
                  <span>Kelas Pak Hafiz • {TEACHER_INFO.website}</span>
                  <span>Halaman {currentPage} dari {doc.pages}</span>
                </div>
              </div>
            </div>

            {/* Description & Topics Detail */}
            <div className="space-y-6 pt-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-2">
                  Deskripsi & Manfaat Modul
                </h3>
                <p className="text-sm sm:text-base text-[#334155] leading-relaxed">
                  {doc.summary}
                </p>
              </div>

              {/* Topics Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#64748B] mb-3">
                  Sub-Topik Pembelajaran yang Termuat
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doc.topics.map((topic, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2.5 text-xs sm:text-sm text-[#0F172A]"
                    >
                      <CheckCircle className="w-4 h-4 text-[#0284C7] shrink-0" />
                      <span className="font-semibold">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Guide Box */}
              <div className="p-6 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex flex-col sm:flex-row items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0284C7] text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Petunjuk Penggunaan Bagi Siswa & Guru
                  </h4>
                  <p className="text-xs text-[#0369A1] mt-1 leading-relaxed">
                    Dokumen ini bebas digandakan, dicetak, dan dijadikan rujukan belajar mandiri maupun tugas kelompok di sekolah. Untuk video pembahasan soal langkah demi langkah, Anda dapat mengakses portal pembelajaran resmi.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Download Card */}
            <div className="p-6 rounded-2xl bg-linear-to-r from-[#0F172A] to-[#1E293B] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold font-heading">Siap Menggunakan Berkas Ini?</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Unduh file berformat {doc.fileFormat} ({doc.fileSize}) langsung ke perangkat Anda.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onDownload(doc)}
                  className="px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Sekarang</span>
                </button>

                <button
                  onClick={onOpenMainPortal}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Portal Kelas</span>
                  <ExternalLink className="w-3 h-3 text-[#38BDF8]" />
                </button>
              </div>
            </div>

          </div>
        </article>

        {/* Related Documents Recommendation */}
        {relatedDocs.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-[#0F172A]">
                  Modul & LKPD Terkait Lainnya
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Materi pelengkap di jenjang {doc.classGrade} dan kategori {doc.category}
                </p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-bold text-[#0284C7] hover:text-[#0369A1] flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Semua Berkas</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedDocs.map((relDoc) => (
                <div
                  key={relDoc.id}
                  onClick={() => onSelectDoc(relDoc)}
                  className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:border-[#0284C7] hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold">
                        {relDoc.category}
                      </span>
                      <span className="text-[#94A3B8]">{relDoc.classGrade}</span>
                    </div>

                    <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors leading-snug">
                      {relDoc.title}
                    </h4>

                    <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {relDoc.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#0284C7] font-semibold">
                    <span>Lihat & Unduh PDF</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
