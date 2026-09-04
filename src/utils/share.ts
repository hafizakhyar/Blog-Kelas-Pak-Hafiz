/**
 * Utility functions for sharing content (Class Notes, Practicum Lab Gallery, Articles, Documents, and Videos) to WhatsApp
 * Generates title-based dedicated links and attaches the real image file whenever supported by Web Share API,
 * allowing WhatsApp to display the photo directly, with clean Open Graph fallback.
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

export const OFFICIAL_WEBSITE_DOMAIN = 'https://www.kelaspakhafiz.my.id';

/**
 * Resolves the appropriate base URL for shareable links.
 * When running inside an internal development sandbox (such as Cloud Run or localhost),
 * it returns the official website domain so links shared to WhatsApp can be opened by anyone on mobile.
 */
export function getBaseAppUrl(preferCurrentOrigin: boolean = false): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const hostname = window.location.hostname;
    if (preferCurrentOrigin) return origin;

    if (
      hostname.includes('run.app') ||
      hostname.includes('localhost') ||
      hostname.includes('127.0.0.1') ||
      hostname.includes('aistudio') ||
      hostname.includes('webcontainer')
    ) {
      return OFFICIAL_WEBSITE_DOMAIN;
    }
    return origin;
  }
  return OFFICIAL_WEBSITE_DOMAIN;
}

export function getDirectArticleUrl(post: { id?: string; title?: string; slug?: string }, preferCurrentOrigin: boolean = false): string {
  const base = getBaseAppUrl(preferCurrentOrigin);
  const titleSlug = post.title ? slugify(post.title) : '';
  const param = titleSlug || (post.slug ? slugify(post.slug) : '') || post.id || '';
  return `${base}/artikel/${encodeURIComponent(param)}`;
}

export function getDirectNoteUrl(note: { id?: string; title?: string; slug?: string }, preferCurrentOrigin: boolean = false): string {
  const base = getBaseAppUrl(preferCurrentOrigin);
  const titleSlug = note.title ? slugify(note.title) : '';
  const param = titleSlug || (note.slug ? slugify(note.slug) : '') || note.id || '';
  return `${base}/catatan/${encodeURIComponent(param)}`;
}

export function getDirectPraktikumUrl(item: { id?: string; title?: string; slug?: string }, preferCurrentOrigin: boolean = false): string {
  const base = getBaseAppUrl(preferCurrentOrigin);
  const titleSlug = item.title ? slugify(item.title) : '';
  const param = titleSlug || (item.slug ? slugify(item.slug) : '') || item.id || '';
  return `${base}/praktikum/${encodeURIComponent(param)}`;
}

export function getDirectDocumentUrl(doc: { id?: string; title?: string; slug?: string }, preferCurrentOrigin: boolean = false): string {
  const base = getBaseAppUrl(preferCurrentOrigin);
  const titleSlug = doc.title ? slugify(doc.title) : '';
  const param = titleSlug || (doc.slug ? slugify(doc.slug) : '') || doc.id || '';
  return `${base}/modul/${encodeURIComponent(param)}`;
}

export function getDirectVideoUrl(video: { id?: string; title?: string; youtubeId?: string }, preferCurrentOrigin: boolean = false): string {
  const base = getBaseAppUrl(preferCurrentOrigin);
  const titleSlug = video.title ? slugify(video.title) : '';
  const param = titleSlug || video.youtubeId || video.id || '';
  return `${base}/video/${encodeURIComponent(param)}`;
}

/**
 * Helper to fetch an image as a Blob, trying direct fetch then fallback to local proxy
 */
async function fetchImageAsBlob(imageUrl: string): Promise<Blob | null> {
  if (!imageUrl) return null;
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (res.ok) {
      return await res.blob();
    }
  } catch (e) {
    // CORS or network error, fallback to proxy
  }

  try {
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      return await res.blob();
    }
  } catch (err) {
    console.warn('Image fetch via proxy failed:', err);
  }
  return null;
}

/**
 * Try copying image blob to system clipboard (for desktop WhatsApp Web users to easily Ctrl+V)
 */
async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.clipboard || typeof ClipboardItem === 'undefined') {
    return false;
  }
  try {
    if (blob.type === 'image/png') {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      return true;
    }
    // Convert jpeg/webp to PNG using canvas so browser clipboard accepts it
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const objectUrl = URL.createObjectURL(blob);
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = objectUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(objectUrl);
      return false;
    }
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(objectUrl);

    const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (pngBlob) {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
      return true;
    }
  } catch (e) {
    // Clipboard permission denied or unsupported
  }
  return false;
}

/**
 * Universal Share to WhatsApp helper
 * Opens the interactive WhatsApp Share Modal displaying the photo preview,
 * with 1-tap options to send directly to WhatsApp, share with photo file, or copy link & text.
 */
export function shareToWhatsAppWithMedia(options: {
  title: string;
  url: string;
  imageUrl?: string;
  slug?: string;
  category?: string;
  description?: string;
}) {
  const { title, url, imageUrl, slug, category, description } = options;

  // 1. Immediately copy link to clipboard for instant backup
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).catch(() => {});
  }

  // 2. Dispatch event to open the WhatsApp Share Modal
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('open-whatsapp-share-modal', {
        detail: {
          title,
          url,
          imageUrl,
          slug,
          category,
          description,
        },
      })
    );
  }

  return { method: 'modal-opened', success: true };
}

/**
 * Share Class Note to WhatsApp
 * Attaches real photo directly on mobile, with clean title & dedicated link preview.
 */
export function shareClassNoteToWhatsApp(note: {
  id?: string;
  title: string;
  slug?: string;
  imageUrl?: string;
  coverImage?: string;
  image?: string;
  category?: string;
  classGrade?: string;
  content?: string;
}) {
  const url = getDirectNoteUrl(note);
  const img = note.imageUrl || note.coverImage || note.image;
  shareToWhatsAppWithMedia({
    title: note.title,
    url,
    imageUrl: img,
    slug: note.slug || slugify(note.title) || note.id,
    category: note.category,
    description: note.content,
  });
}

/**
 * Share Practicum / Lab Gallery Item to WhatsApp
 * Attaches real photo directly on mobile, with clean title & dedicated link preview.
 */
export function sharePraktikumToWhatsApp(item: {
  id?: string;
  title: string;
  slug?: string;
  image?: string;
  images?: string[];
  imageUrl?: string;
  coverImage?: string;
  category?: string;
  description?: string;
}) {
  const url = getDirectPraktikumUrl(item);
  const img = item.image || (item.images && item.images[0]) || item.imageUrl || item.coverImage;
  shareToWhatsAppWithMedia({
    title: item.title,
    url,
    imageUrl: img,
    slug: item.slug || slugify(item.title) || item.id,
    category: item.category,
    description: item.description,
  });
}

/**
 * Share Science Article / Blog Post to WhatsApp
 * Attaches real photo directly on mobile, with clean title & dedicated link preview.
 */
export function shareArticleToWhatsApp(post: {
  id?: string;
  title: string;
  slug?: string;
  coverImage?: string;
  imageUrl?: string;
  image?: string;
  category?: string;
  summary?: string;
}) {
  const url = getDirectArticleUrl(post);
  const img = post.coverImage || post.imageUrl || post.image;
  shareToWhatsAppWithMedia({
    title: post.title,
    url,
    imageUrl: img,
    slug: post.slug || slugify(post.title) || post.id,
    category: post.category,
    description: post.summary,
  });
}

/**
 * Share Document / Module / LKPD to WhatsApp
 * Attaches real photo directly on mobile, with clean title & dedicated link preview.
 */
export function shareDocumentToWhatsApp(doc: {
  id?: string;
  title: string;
  slug?: string;
  coverImage?: string;
  imageUrl?: string;
  image?: string;
  category?: string;
  summary?: string;
}) {
  const url = getDirectDocumentUrl(doc);
  const img = doc.coverImage || doc.imageUrl || doc.image;
  shareToWhatsAppWithMedia({
    title: doc.title,
    url,
    imageUrl: img,
    slug: doc.slug || slugify(doc.title) || doc.id,
    category: doc.category,
    description: doc.summary,
  });
}

/**
 * Share Video Praktikum to WhatsApp
 */
export function shareVideoToWhatsApp(video: {
  id?: string;
  title: string;
  youtubeUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  category?: string;
  description?: string;
}) {
  const thumb =
    video.thumbnailUrl ||
    (video.youtubeId ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` : undefined);
  const url = getDirectVideoUrl(video);
  shareToWhatsAppWithMedia({
    title: video.title,
    url,
    imageUrl: thumb,
    slug: slugify(video.title) || video.youtubeId || video.id,
    category: video.category,
    description: video.description,
  });
}
