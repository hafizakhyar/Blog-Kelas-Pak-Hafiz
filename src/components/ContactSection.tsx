import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, MessageSquare, ChevronDown, CheckCircle2, Sparkles, HelpCircle, Phone, MapPin } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';

interface ContactSectionProps {
  onSubmitSuccess: (name: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Siswa',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmitSuccess(formData.name);
      setFormData({
        name: '',
        email: '',
        role: 'Siswa',
        subject: '',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="kontak" className="py-20 bg-[#F4F8FC] relative border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold mb-3 shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="uppercase tracking-widest text-[10px] text-[#0284C7] font-bold">Pertanyaan & Kolaborasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light font-heading text-[#0F172A] tracking-tight">
            Hubungi & <span className="font-semibold text-[#0284C7]">Tanya Jawab Umum</span>
          </h2>
          <p className="text-sm sm:text-base text-[#64748B] mt-2 leading-relaxed">
            Punya pertanyaan seputar materi kimia, eksperimen laboratorium, atau ingin mengundang Pak Hafiz untuk sesi berbagi di sekolahmu?
          </p>
        </div>

        {/* 2 Column Layout: FAQ & Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* FAQ Accordion (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-[#0F172A] font-bold font-heading text-lg">
              <HelpCircle className="w-5 h-5 text-[#0284C7]" />
              <h3>Pertanyaan yang Sering Diajukan (FAQ)</h3>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-[20px] bg-white border border-[#E2E8F0] overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-[#0F172A] hover:text-[#0284C7] transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold font-heading leading-snug">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#0284C7] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#0F172A]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-[#E2E8F0] bg-[#F4F8FC] px-4 sm:px-5 py-4"
                        >
                          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Direct Contact Info Box */}
            <div className="mt-8 p-6 rounded-[24px] bg-white border border-[#E2E8F0] shadow-2xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
                <img
                  src="https://lh3.googleusercontent.com/d/1h5jWX2SAGVVR08dJ9okT7lgLr2mUZXLi"
                  alt="Pak Hafiz Akhyar, S.Si."
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#BAE6FD] shadow-xs"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] font-heading">
                    Pak Hafiz Akhyar, S.Si.
                  </h4>
                  <p className="text-xs text-[#0284C7] font-semibold">
                    Guru Kimia & Edukator Sains SMA
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#334155]">
                <div className="w-8 h-8 rounded-full bg-[#F4F8FC] text-[#0284C7] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B]">Email Resmi</div>
                  <a href="mailto:kelaspakhafiz@gmail.com" className="font-semibold text-[#0F172A] hover:text-[#0284C7]">
                    kelaspakhafiz@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#334155]">
                <div className="w-8 h-8 rounded-full bg-[#F4F8FC] text-[#0284C7] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B]">Lokasi Lab & Pengajaran</div>
                  <div className="font-semibold text-[#0F172A]">Jakarta & Komunitas Daring Seluruh Indonesia</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 border border-[#E2E8F0] shadow-[0_4px_24px_rgba(2,132,199,0.06)]">
            <h3 className="text-xl font-bold font-heading text-[#0F172A] mb-1">
              Kirim Pesan Cepat
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Respon cepat untuk pertanyaan belajar, diskusi praktikum, dan materi modul.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-[20px] bg-[#E0F2FE] border border-[#BAE6FD] text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#0284C7] text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#0F172A] font-heading">
                  Pesan Berhasil Terkirim!
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Terima kasih atas pesanmu. Pak Hafiz akan membalas melalui email secepatnya.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama kamu..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] bg-[#F4F8FC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">
                      Alamat Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@sekolah.sch.id"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] bg-[#F4F8FC]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">
                      Status / Peran
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] bg-white"
                    >
                      <option value="Siswa SMA">Siswa SMA</option>
                      <option value="Guru / Pendidik">Guru / Pendidik</option>
                      <option value="Orang Tua">Orang Tua Siswa</option>
                      <option value="Mahasiswa / Umum">Mahasiswa / Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1">
                      Topik Pertanyaan
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Misal: Tanya Praktikum, Modul"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] bg-[#F4F8FC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1">
                    Isi Pesan / Pertanyaan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan pertanyaanmu seputar materi kimia atau kolaborasi..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs sm:text-sm focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] text-[#0F172A] bg-[#F4F8FC] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-md shadow-[#0284C7]/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? 'Mengirim Pesan...' : 'Kirim Pesan ke Pak Hafiz'}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
