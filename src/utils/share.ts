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
 * 1. If Web Share API supports file sharing (Mobile phones / tablets), shares real image file + caption directly to WhatsApp.
 * 2. If desktop, opens WhatsApp Web with the clean title & dedicated link, and copies the image to clipboard if possible.
 */
export async function shareToWhatsAppWithMedia(options: {
  title: string;
  url: string;
  imageUrl?: string;
  slug?: string;
}) {
  const { title, url, imageUrl, slug } = options;
  const captionMessage = `*${title.trim()}*\n\n${url}`;

  // 1. If an image is available, attempt to retrieve the blob
  let imageBlob: Blob | null = null;
  if (imageUrl) {
    imageBlob = await fetchImageAsBlob(imageUrl);
  }

  // 2. Try Mobile Web Share API with File (attaches real photo directly in WhatsApp!)
  if (imageBlob && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      const mimeType = imageBlob.type || 'image/jpeg';
      const ext = mimeType.includes('png') ? 'png' : 'jpg';
      const safeSlug = slug ? slugify(slug) : slugify(title) || 'foto-materi';
      const file = new File([imageBlob], `${safeSlug}.${ext}`, { type: mimeType });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: title.trim(),
          text: captionMessage,
          files: [file],
        });
        return { method: 'file-share', success: true };
      }
    } catch (shareErr: any) {
      // If user aborted/cancelled share sheet, do nothing
      if (shareErr?.name === 'AbortError') {
        return { method: 'cancelled', success: false };
      }
      console.warn('Web Share with file failed, falling back to URL:', shareErr);
    }
  }

  // 3. Desktop fallback: Copy image to clipboard so user can press Ctrl+V in WhatsApp Web
  if (imageBlob) {
    copyImageToClipboard(imageBlob).catch(() => {});
  }

  // 4. Open WhatsApp with pre-filled message (Title + Dedicated Link)
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(captionMessage)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  return { method: 'link-share', success: true };
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
