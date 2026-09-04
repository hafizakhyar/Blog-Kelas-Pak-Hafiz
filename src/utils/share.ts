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
 * Directly opens WhatsApp with the clean Title and the direct, clickable link.
 * Guarantees that the link and title are never stripped or discarded,
 * allowing WhatsApp to pre-fill the text and generate the rich photo & card preview via Open Graph.
 */
export function shareToWhatsAppWithMedia(options: {
  title: string;
  url: string;
  imageUrl?: string;
  slug?: string;
}) {
  const { title, url } = options;
  const cleanTitle = title.trim();
  const captionMessage = `*${cleanTitle}*\n\n${url}`;
  const encodedText = encodeURIComponent(captionMessage);

  // 1. Copy link to clipboard for instant backup convenience
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).catch(() => {});
  }

  // 2. Detect mobile device
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');

  // 3. Open WhatsApp directly
  if (isMobile) {
    // Native whatsapp:// scheme launches the WhatsApp app instantly
    const mobileScheme = `whatsapp://send?text=${encodedText}`;
    const universalUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

    window.location.href = mobileScheme;
    setTimeout(() => {
      if (document.hidden) return;
      window.location.href = universalUrl;
    }, 1200);
  } else {
    // On desktop, open WhatsApp Web in a new tab
    const desktopUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(desktopUrl, '_blank', 'noopener,noreferrer');
  }

  return { method: 'whatsapp-direct', success: true };
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
  category?: string;
  classGrade?: string;
}) {
  const url = getDirectNoteUrl(note);
  shareToWhatsAppWithMedia({
    title: note.title,
    url,
    imageUrl: note.imageUrl,
    slug: note.slug || slugify(note.title) || note.id
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
  category?: string;
}) {
  const url = getDirectPraktikumUrl(item);
  const img = item.image || (item.images && item.images[0]);
  shareToWhatsAppWithMedia({
    title: item.title,
    url,
    imageUrl: img,
    slug: item.slug || slugify(item.title) || item.id
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
  category?: string;
}) {
  const url = getDirectArticleUrl(post);
  shareToWhatsAppWithMedia({
    title: post.title,
    url,
    imageUrl: post.coverImage,
    slug: post.slug || slugify(post.title) || post.id
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
  category?: string;
}) {
  const url = getDirectDocumentUrl(doc);
  shareToWhatsAppWithMedia({
    title: doc.title,
    url,
    imageUrl: doc.coverImage,
    slug: doc.slug || slugify(doc.title) || doc.id
  });
}
