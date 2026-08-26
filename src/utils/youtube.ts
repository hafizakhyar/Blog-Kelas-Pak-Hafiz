/**
 * Utility helper to parse and handle YouTube URLs and Video IDs
 */

export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const clean = urlOrId.trim();

  // Direct 11 char ID format
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // Handle standard watch url, shorts, youtu.be, embed, mobile
  const match = clean.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i
  );

  if (match && match[1]) {
    return match[1];
  }

  return null;
}

export function getYouTubeThumbnail(youtubeId: string): string {
  if (!youtubeId) return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80';
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(youtubeId: string, autoPlay: boolean = false): string {
  if (!youtubeId) return '';
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1${autoPlay ? '&autoplay=1' : ''}`;
}

export function getYouTubeWatchUrl(youtubeId: string): string {
  if (!youtubeId) return 'https://www.youtube.com/@KelasPakHafiz';
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}
