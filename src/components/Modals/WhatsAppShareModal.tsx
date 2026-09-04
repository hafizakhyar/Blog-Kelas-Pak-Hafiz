import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Copy, Download, Image as ImageIcon, Sparkles, ExternalLink, Share2, Info } from 'lucide-react';
import { WhatsAppIcon } from '../Common/WhatsAppShareButton';

export interface WhatsAppShareData {
  title: string;
  url: string;
  imageUrl?: string;
  slug?: string;
  category?: string;
  description?: string;
}

interface WhatsAppShareModalProps {
  data: WhatsAppShareData | null;
  onClose: () => void;
  onAddToast?: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  data,
  onClose,
  onAddToast,
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharingFile, setIsSharingFile] = useState(false);

  useEffect(() => {
    setCopiedText(false);
    setCopiedLink(false);
  }, [data]);

  if (!data) return null;

  const cleanTitle = data.title.trim();
  const rawUrl = data.url.trim();
  const cleanImage = data.imageUrl || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&h=630&q=80';

  // WhatsApp optimized message: Link is placed first to guarantee WhatsApp crawler preview detection and avoid truncation
  const fullShareMessage = `${rawUrl}\n\n*${cleanTitle}*\n\n_Kelas Pak Hafiz — Sains Dalam Sudut Pandang yang Lebih Segar_`;
  const encodedMessage = encodeURIComponent(fullShareMessage);
  const whatsappWebOrAppUrl = `https://wa.me/?text=${encodedMessage}`;

  // 1. Handle direct WhatsApp open
  const handleOpenWhatsApp = () => {
    // Copy link to clipboard for backup convenience
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(fullShareMessage).catch(() => {});
    }

    const newWindow = window.open(whatsappWebOrAppUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = whatsappWebOrAppUrl;
    }

    if (onAddToast) {
      onAddToast('Membuka WhatsApp', 'Mengarahkan ke WhatsApp dengan teks dan tautan.', 'info');
    }
  };

  // 2. Handle Copy Full Message
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(fullShareMessage);
      setCopiedText(true);
      if (onAddToast) {
        onAddToast('Pesan Tersalin', 'Tautan dan judul postingan berhasil disalin ke papan klip.', 'success');
      }
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      // Fallback
    }
  };

  // 3. Handle Copy Link Only
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(rawUrl);
      setCopiedLink(true);
      if (onAddToast) {
        onAddToast('Tautan Tersalin', 'Tautan langsung artikel berhasil disalin.', 'success');
      }
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  // 4. Download cover image helper
  const handleDownloadImage = async () => {
    if (!cleanImage) return;
    setIsDownloading(true);
    try {
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(cleanImage)}`;
      const res = await fetch(proxyUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      const safeSlug = (data.slug || cleanTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      a.download = `foto-${safeSlug || 'materi'}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      if (onAddToast) {
        onAddToast('Foto Tersimpan', 'Foto sampul berhasil diunduh. Anda dapat langsung melampirkannya di WhatsApp!', 'success');
      }
    } catch (err) {
      console.warn('Image download failed:', err);
      // Fallback: direct window open
      window.open(cleanImage, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  // 5. Share with Image & Caption via Web Share API or Download + Copy
  const handleShareWithPhoto = async () => {
    setIsSharingFile(true);

    // First, copy caption to clipboard so user can paste it anywhere
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(fullShareMessage).catch(() => {});
    }

    try {
      // Fetch blob via proxy
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(cleanImage)}`;
      const res = await fetch(proxyUrl);
      const blob = await res.blob();
      const mimeType = blob.type || 'image/jpeg';
      const ext = mimeType.includes('png') ? 'png' : 'jpg';
      const file = new File([blob], `foto-${(data.slug || 'materi')}.${ext}`, { type: mimeType });

      // If Web Share API supports file sharing
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: cleanTitle,
          text: fullShareMessage,
          files: [file],
        });
        setIsSharingFile(false);
        return;
      }
    } catch (shareErr: any) {
      if (shareErr?.name === 'AbortError') {
        setIsSharingFile(false);
        return;
      }
    }

    // Fallback: Download the image and prompt user
    await handleDownloadImage();
    setIsSharingFile(false);

    if (onAddToast) {
      onAddToast(
        'Foto & Teks Siap!',
        'Foto sampul telah diunduh dan teks/tautan tersalin. Kirim foto di WhatsApp dan tempel keterangannya.',
        'success'
      );
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100 dark:bg-slate-900 dark:border-slate-800"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <WhatsAppIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-wide leading-tight">Bagikan ke WhatsApp</h3>
                <p className="text-xs text-white/80">Kirim tautan & foto sampul resmi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              title="Tutup dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Pratinjau Kartu Pesan */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs dark:bg-slate-800/60 dark:border-slate-700">
              <div className="relative aspect-[16/9] w-full bg-slate-200 overflow-hidden dark:bg-slate-700">
                <img
                  src={cleanImage}
                  alt={cleanTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {data.category && (
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-900/75 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                    {data.category}
                  </span>
                )}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#25D366]" />
                  <span>Foto Sampul HD</span>
                </div>
              </div>

              <div className="p-3.5 space-y-1.5">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                  {cleanTitle}
                </p>
                <p className="text-[11px] font-mono text-[#0284C7] dark:text-[#38BDF8] break-all line-clamp-1">
                  {rawUrl}
                </p>
              </div>
            </div>

            {/* Tombol Aksi Utama */}
            <div className="space-y-2.5 pt-1">
              {/* Action 1: Direct WhatsApp Launch */}
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <WhatsAppIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>Kirim Tautan ke WhatsApp</span>
                <ExternalLink className="w-4 h-4 text-white/80 ml-auto" />
              </button>

              {/* Action 2: Share with Photo */}
              <button
                type="button"
                onClick={handleShareWithPhoto}
                disabled={isSharingFile}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#128C7E]" />
                <span>
                  {isSharingFile ? 'Menyiapkan Foto...' : 'Bagikan dengan Foto Sampul (+ Teks)'}
                </span>
              </button>

              {/* Action 3 & 4: Quick Copy Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="py-2 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-750"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Salin Pesan</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="py-2 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-750"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isDownloading ? 'Mengunduh...' : 'Unduh Foto'}</span>
                </button>
              </div>
            </div>

            {/* Petunjuk Penggunaan Agar Gambar Muncul */}
            <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs text-amber-900 flex items-start gap-2.5 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-200">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-950 dark:text-amber-100">
                  Tips Agar Foto Muncul di Obrolan WhatsApp:
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  Setelah WhatsApp terbuka dan Anda memilih grup, <strong>tunggu 1–2 detik</strong> agar kotak pratinjau foto dan judul kartu dimuat oleh WhatsApp sebelum menekan tombol Kirim. Atau gunakan tombol <strong>"Bagikan dengan Foto Sampul"</strong> untuk melampirkan foto secara langsung.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
