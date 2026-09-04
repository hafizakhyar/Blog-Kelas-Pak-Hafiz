/**
 * Utility functions for sharing content (Class Notes, Practicum Lab Gallery, Articles, Documents, and Videos) to WhatsApp
 * Generates title-based dedicated links and minimal WhatsApp messages containing ONLY the title and dedicated link,
 * enabling WhatsApp to automatically display the post image, title, and link preview card.
 */

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // collapse consecutive hyphens
}

export function getDirectArticleUrl(post: { id?: string; title?: string; slug?: string }): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const titleSlug = post.title ? slugify(post.title) : '';
  const param = titleSlug || post.slug || post.id || '';
  return `${base}/artikel/${encodeURIComponent(param)}`;
}

export function getDirectNoteUrl(note: { id?: string; title?: string; slug?: string }): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const titleSlug = note.title ? slugify(note.title) : '';
  const param = titleSlug || note.slug || note.id || '';
  return `${base}/catatan/${encodeURIComponent(param)}`;
}

export function getDirectPraktikumUrl(item: { id?: string; title?: string; slug?: string }): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const titleSlug = item.title ? slugify(item.title) : '';
  const param = titleSlug || item.slug || item.id || '';
  return `${base}/praktikum/${encodeURIComponent(param)}`;
}

export function getDirectDocumentUrl(doc: { id?: string; title?: string; slug?: string }): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const titleSlug = doc.title ? slugify(doc.title) : '';
  const param = titleSlug || doc.slug || doc.id || '';
  return `${base}/modul/${encodeURIComponent(param)}`;
}

/**
 * Share Class Note to WhatsApp
 * Outputs ONLY post title and dedicated link, allowing WhatsApp preview to show the image, title, and link.
 */
export function shareClassNoteToWhatsApp(note: {
  id?: string;
  title: string;
  slug?: string;
  imageUrl?: string;
  category?: string;
  classGrade?: string;
}) {
  const url = getDirectNoteUrl(note);
  const message = `*${note.title.trim()}*\n\n${url}`;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Share Practicum / Lab Gallery Item to WhatsApp
 * Outputs ONLY post title and dedicated link, allowing WhatsApp preview to show the image, title, and link.
 */
export function sharePraktikumToWhatsApp(item: {
  id?: string;
  title: string;
  slug?: string;
  image?: string;
  category?: string;
}) {
  const url = getDirectPraktikumUrl(item);
  const message = `*${item.title.trim()}*\n\n${url}`;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Share Science Article / Blog Post to WhatsApp
 * Outputs ONLY post title and dedicated link, allowing WhatsApp preview to show the image, title, and link.
 */
export function shareArticleToWhatsApp(post: {
  id?: string;
  title: string;
  slug?: string;
  coverImage?: string;
  category?: string;
}) {
  const url = getDirectArticleUrl(post);
  const message = `*${post.title.trim()}*\n\n${url}`;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Share Document / Module / LKPD to WhatsApp
 * Outputs ONLY post title and dedicated link, allowing WhatsApp preview to show the image, title, and link.
 */
export function shareDocumentToWhatsApp(doc: {
  id?: string;
  title: string;
  slug?: string;
  category?: string;
}) {
  const url = getDirectDocumentUrl(doc);
  const message = `*${doc.title.trim()}*\n\n${url}`;
  const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(shareUrl, '_blank', 'noopener,noreferrer');
}
