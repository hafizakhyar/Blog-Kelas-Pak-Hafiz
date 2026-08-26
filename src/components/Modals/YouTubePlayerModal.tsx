import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Share2,
  Check,
  Tag,
  FlaskConical,
  Atom
} from 'lucide-react';
import { PracticalVideoItem } from '../../types';
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from '../../utils/youtube';
import { WhatsAppShareButton } from '../Common/WhatsAppShareButton';

interface YouTubePlayerModalProps {
  video: PracticalVideoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToast?: (title: string, description?: string, type?: 'success' | 'info') => void;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({
  video,
  isOpen,
  onClose,
  onAddToast = (_title: string, _desc?: string, _type?: 'success' | 'info') => {}
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const embedUrl = getYouTubeEmbedUrl(video.youtubeId, true);
  const watchUrl = getYouTubeWatchUrl(video.youtubeId);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(video.youtubeUrl || watchUrl);
      onAddToast('Tautan Video Disalin', 'Link YouTube telah disalin ke clipboard.', 'success');
    } catch {
      onAddToast('Gagal Menyalin', 'Silakan salin tautan secara manual.', 'info');
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Tonton Video Praktikum Kimia: *${video.title}* (${video.category})\nLink: ${video.youtubeUrl || watchUrl}\n\nDari Portal Pembelajaran Kelas Pak Hafiz: https://www.kelaspakhafiz.my.id/`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    onAddToast('Membuka WhatsApp', `Membagikan video "${video.title}" ke WhatsApp.`, 'info');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#E2E8F0] my-auto"
        >
          {/* Header Bar */}
          <div className="bg-[#0F172A] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5 min-w-0 pr-4">
              <span className="w-8 h-8 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Play className="w-4 h-4 fill-white" />
              </span>
              <div className="truncate">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#38BDF8] block">
                  Pemutar Video Praktikum
                </span>
                <h3 className="text-xs sm:text-sm font-semibold truncate text-white">
                  {video.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer hidden sm:flex"
                title="Buka langsung di YouTube"
              >
                <span>Buka di YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#EF4444] text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Player Container */}
          <div className="relative aspect-video w-full bg-black">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/70 p-6 text-center">
                <Play className="w-12 h-12 text-[#EF4444] mb-3" />
                <p className="font-semibold text-sm">Video tidak dapat dimuat</p>
                <p className="text-xs text-white/50 mt-1">ID YouTube tidak valid atau video bersifat privat.</p>
              </div>
            )}
          </div>

          {/* Details & Actions Footer */}
          <div className="p-5 sm:p-6 bg-white space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E0F2FE] text-[#0284C7] border border-[#BAE6FD]">
                  {video.category}
                </span>
                {video.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                    {video.badge}
                  </span>
                )}
                {video.duration && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0]">
                    <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                    <span>{video.duration}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>{video.date}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  title="Bagikan ke WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Salin Link Video"
                >
                  <Check className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Salin Link</span>
                </button>
              </div>
            </div>

            {/* Description */}
            {video.description && (
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>Deskripsi Video</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}

            {/* Chemistry Concept */}
            {video.chemistryConcept && (
              <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#BBF7D0]">
                <h4 className="text-xs font-bold text-[#166534] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Atom className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Konsep & Reaksi Kimia Terkait</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#166534] leading-relaxed">
                  {video.chemistryConcept}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
