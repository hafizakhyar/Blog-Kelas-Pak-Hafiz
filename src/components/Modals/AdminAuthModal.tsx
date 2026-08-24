import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, KeyRound, X, Lock, AlertCircle, ArrowRight } from 'lucide-react';

const VALID_PASSCODES = ['hafiz2026', 'hafiz123', 'admin123', '123456'];

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError(true);
      setErrorMessage('Silakan masukkan kata sandi Guru.');
      return;
    }

    if (VALID_PASSCODES.includes(passcode.trim().toLowerCase())) {
      setError(false);
      setPasscode('');
      onSuccess();
      onClose();
    } else {
      setError(true);
      setErrorMessage('Kata sandi salah. Silakan coba lagi.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0F172A]/60 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#E2E8F0] z-10"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon & Title */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 border border-[#BAE6FD] shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-[#0F172A]">
                Masuk Mode Guru (Pak Hafiz)
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Akses penuh untuk edit, tambah, dan hapus materi & berkas
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-2">
                Kata Sandi / PIN Pengajar
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="password"
                  autoFocus
                  placeholder="Masukkan kata sandi guru..."
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] border text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none transition-all ${
                    error
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/20'
                      : 'border-[#CBD5E1] focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]'
                  }`}
                />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] text-xs text-[#64748B] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
                <KeyRound className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Informasi Mode Guru</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Dalam Mode Guru, tombol tambah, ubah teks, ganti foto, dan hapus akan muncul di semua menu. Siswa/pengunjung umum hanya dapat membaca dan mengunduh.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Aktifkan Mode Guru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
