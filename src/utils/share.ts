/**
 * Utility functions for sharing content (Class Notes, Practicum Lab Gallery, and Articles) to WhatsApp
 */

export function getDirectNoteUrl(noteId: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#catatan-${encodeURIComponent(noteId)}`;
}

export function getDirectPraktikumUrl(itemId: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#praktikum-${encodeURIComponent(itemId)}`;
}

export function getDirectArticleUrl(postId: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}#artikel-${encodeURIComponent(postId)}`;
}

/**
 * Share Class Note to WhatsApp
 */
export function shareClassNoteToWhatsApp(note: {
  id?: string;
  title: string;
  category: string;
  classGrade: string;
  authorName?: string;
  content: string;
  keyPoints?: string[];
}) {
  const url = note.id ? getDirectNoteUrl(note.id) : window.location.href;
  const keyPointsText =
    note.keyPoints && note.keyPoints.length > 0
      ? `\n\n✨ *Rumus & Poin Kunci:*\n${note.keyPoints.slice(0, 3).map((p, i) => `• ${p}`).join('\n')}`
      : '';

  const cleanContent = note.content.length > 200 ? `${note.content.substring(0, 200)}...` : note.content;

  const message = `📝 *Catatan Kimia: ${note.title}*
🏷️ Topik: ${note.category} (${note.classGrade})
👨‍🏫 Pengajar: ${note.authorName || 'Pak Hafiz Akhyar, S.Si.'}

📖 *Ringkasan Materi:*
${cleanContent}${keyPointsText}

🔗 *Pelajari materi lengkap di Kelas Pak Hafiz:*
${url}`;

  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Share Practicum / Lab Gallery Item to WhatsApp
 */
export function sharePraktikumToWhatsApp(item: {
  id?: string;
  title: string;
  category: string;
  badge?: string;
  description: string;
  chemistryConcept?: string;
}) {
  const url = item.id ? getDirectPraktikumUrl(item.id) : window.location.href;
  const conceptText = item.chemistryConcept
    ? `\n\n🧪 *Konsep & Reaksi Sains:*\n${item.chemistryConcept.length > 180 ? `${item.chemistryConcept.substring(0, 180)}...` : item.chemistryConcept}`
    : '';

  const cleanDesc = item.description.length > 200 ? `${item.description.substring(0, 200)}...` : item.description;

  const message = `🔬 *Dokumentasi Praktikum: ${item.title}*
🏷️ Kategori: ${item.category} ${item.badge ? `(${item.badge})` : ''}

📌 *Deskripsi Eksperimen:*
${cleanDesc}${conceptText}

🔗 *Lihat foto, alat bahan & prosedur lengkap:*
${url}`;

  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Share Science Article / Blog Post to WhatsApp
 */
export function shareArticleToWhatsApp(post: {
  id?: string;
  title: string;
  category: string;
  summary: string;
  readTime?: string;
  author?: { name: string };
}) {
  const url = post.id ? getDirectArticleUrl(post.id) : window.location.href;
  const authorName = post.author?.name || 'Pak Hafiz';

  const message = `📖 *Artikel Sains & Kimia: ${post.title}*
🏷️ Kategori: ${post.category} ${post.readTime ? `• Waktu Baca: ${post.readTime}` : ''}
✍️ Penulis: ${authorName}

💡 *Intisari Artikel:*
${post.summary}

🔗 *Baca artikel selengkapnya di Kelas Pak Hafiz:*
${url}`;

  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}
