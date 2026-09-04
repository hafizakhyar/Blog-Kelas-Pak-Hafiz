import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import {
  BLOG_POSTS,
  INITIAL_CLASS_NOTES,
  GALLERY_ITEMS,
  DOCUMENT_ITEMS
} from './src/data/mockData';
import { slugify } from './src/utils/share';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const HOST = '0.0.0.0';

interface ShareItemMeta {
  title: string;
  description: string;
  imageUrl: string;
  canonicalUrl: string;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&h=630&q=80';

// Strip Markdown or excessive whitespace for meta description
function cleanSnippet(text: string, maxLen = 160): string {
  if (!text) return '';
  const clean = text
    .replace(/[#*`_~[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return clean.length > maxLen ? `${clean.substring(0, maxLen).trim()}...` : clean;
}

// Find item from static mock datasets
function findStaticItem(
  type: string,
  rawSlug: string
): { title: string; description: string; imageUrl: string } | null {
  const cleanSlug = decodeURIComponent(rawSlug).trim().toLowerCase();

  if (type === 'artikel' || type === 'blog') {
    const post =
      BLOG_POSTS.find((p) => p.slug && p.slug.toLowerCase() === cleanSlug) ||
      BLOG_POSTS.find((p) => slugify(p.title) === cleanSlug) ||
      BLOG_POSTS.find((p) => p.id.toLowerCase() === cleanSlug) ||
      BLOG_POSTS.find((p) => p.id.toLowerCase() === `post-${cleanSlug}`) ||
      BLOG_POSTS.find(
        (p) =>
          slugify(p.title).includes(cleanSlug) ||
          (p.slug && p.slug.toLowerCase().includes(cleanSlug))
      );

    if (post) {
      return {
        title: post.title,
        description: cleanSnippet(post.summary || post.content?.join(' ') || ''),
        imageUrl: post.coverImage || DEFAULT_IMAGE
      };
    }
  }

  if (type === 'catatan') {
    const note =
      INITIAL_CLASS_NOTES.find((n) => n.slug && n.slug.toLowerCase() === cleanSlug) ||
      INITIAL_CLASS_NOTES.find((n) => slugify(n.title) === cleanSlug) ||
      INITIAL_CLASS_NOTES.find((n) => n.id.toLowerCase() === cleanSlug) ||
      INITIAL_CLASS_NOTES.find((n) => n.id.toLowerCase() === `note-${cleanSlug}`) ||
      INITIAL_CLASS_NOTES.find((n) => slugify(n.title).includes(cleanSlug));

    if (note) {
      return {
        title: note.title,
        description: cleanSnippet(note.content || note.keyPoints?.join(' • ') || ''),
        imageUrl: note.imageUrl || DEFAULT_IMAGE
      };
    }
  }

  if (type === 'praktikum' || type === 'galeri') {
    const item =
      GALLERY_ITEMS.find((g) => g.slug && g.slug.toLowerCase() === cleanSlug) ||
      GALLERY_ITEMS.find((g) => slugify(g.title) === cleanSlug) ||
      GALLERY_ITEMS.find((g) => g.id.toLowerCase() === cleanSlug) ||
      GALLERY_ITEMS.find((g) => g.id.toLowerCase() === `gal-${cleanSlug}`) ||
      GALLERY_ITEMS.find((g) => slugify(g.title).includes(cleanSlug));

    if (item) {
      return {
        title: item.title,
        description: cleanSnippet(item.description || item.chemistryConcept || ''),
        imageUrl: item.image || item.images?.[0] || DEFAULT_IMAGE
      };
    }
  }

  if (type === 'modul' || type === 'dokumen' || type === 'file') {
    const doc =
      DOCUMENT_ITEMS.find((d) => d.slug && d.slug.toLowerCase() === cleanSlug) ||
      DOCUMENT_ITEMS.find((d) => slugify(d.title) === cleanSlug) ||
      DOCUMENT_ITEMS.find((d) => d.id.toLowerCase() === cleanSlug) ||
      DOCUMENT_ITEMS.find((d) => d.id.toLowerCase() === `doc-${cleanSlug}`) ||
      DOCUMENT_ITEMS.find((d) => slugify(d.title).includes(cleanSlug));

    if (doc) {
      return {
        title: doc.title,
        description: cleanSnippet(doc.summary || `${doc.category} — ${doc.classGrade}`),
        imageUrl: doc.coverImage || DEFAULT_IMAGE
      };
    }
  }

  return null;
}

// Fallback: Check Firestore REST API if item was newly added to cloud database
async function findFirestoreDoc(
  type: string,
  rawSlug: string
): Promise<{ title: string; description: string; imageUrl: string } | null> {
  try {
    const configPath = path.join(__dirname, 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) return null;

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const { projectId, firestoreDatabaseId, apiKey } = config;
    if (!projectId || !apiKey) return null;

    let collectionName = '';
    if (type === 'artikel' || type === 'blog') collectionName = 'catatan_artikel';
    else if (type === 'catatan') collectionName = 'catatan_kelas';
    else if (type === 'praktikum' || type === 'galeri') collectionName = 'catatan_foto';
    else if (type === 'modul' || type === 'dokumen' || type === 'file') collectionName = 'catatan_dokumen';

    if (!collectionName) return null;

    const dbId = firestoreDatabaseId || '(default)';
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${dbId}/documents/${collectionName}?key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !Array.isArray(data.documents)) return null;

    const cleanSlug = decodeURIComponent(rawSlug).trim().toLowerCase();

    for (const doc of data.documents) {
      const fields = doc.fields || {};
      const title = fields.title?.stringValue || '';
      const slug = fields.slug?.stringValue || '';
      const docId = doc.name ? doc.name.split('/').pop() : '';

      const isMatch =
        (slug && slug.toLowerCase() === cleanSlug) ||
        slugify(title) === cleanSlug ||
        docId?.toLowerCase() === cleanSlug ||
        slugify(title).includes(cleanSlug);

      if (isMatch) {
        const desc =
          fields.summary?.stringValue ||
          fields.content?.stringValue ||
          fields.description?.stringValue ||
          '';
        const img =
          fields.coverImage?.stringValue ||
          fields.imageUrl?.stringValue ||
          fields.image?.stringValue ||
          DEFAULT_IMAGE;

        return {
          title,
          description: cleanSnippet(desc),
          imageUrl: img
        };
      }
    }
  } catch (err) {
    // Gracefully ignore Firestore fetch failures
  }
  return null;
}

function injectMetaTags(html: string, meta: ShareItemMeta): string {
  const { title, description, imageUrl, canonicalUrl } = meta;
  const escapedTitle = title.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedDesc = description.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const pageTitle = `${escapedTitle} — Kelas Pak Hafiz`;

  let result = html;

  // Replace <title>
  result = result.replace(/<title>[\s\S]*?<\/title>/i, `<title>${pageTitle}</title>`);

  // Replace or inject description
  result = result.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${escapedDesc}" />`
  );

  // Replace Open Graph tags
  result = result.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapedTitle}" />`
  );
  result = result.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapedDesc}" />`
  );
  result = result.replace(
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image" content="${imageUrl}" />`
  );
  result = result.replace(
    /<meta\s+property="og:image:secure_url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image:secure_url" content="${imageUrl}" />`
  );

  // Ensure canonical og:url
  if (/<meta\s+property="og:url"/i.test(result)) {
    result = result.replace(
      /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
  } else {
    result = result.replace(
      /<meta\s+property="og:type"/i,
      `<meta property="og:url" content="${canonicalUrl}" />\n    <meta property="og:type"`
    );
  }

  // Replace Twitter Card tags
  result = result.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapedTitle}" />`
  );
  result = result.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapedDesc}" />`
  );
  result = result.replace(
    /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${imageUrl}" />`
  );

  // Replace <link rel="image_src">
  result = result.replace(
    /<link\s+rel="image_src"\s+href="[\s\S]*?"\s*\/?>/i,
    `<link rel="image_src" href="${imageUrl}" />`
  );

  return result;
}

async function startServer() {
  const app = express();
  const isProd = process.env.NODE_ENV === 'production';

  let vite: ViteDevServer | null = null;
  if (!isProd) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
  }

  // Health API
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Dedicated share routes: Intercept post-specific paths to deliver dynamic OpenGraph meta tags
  app.get(
    [
      '/artikel/:slug',
      '/blog/:slug',
      '/catatan/:slug',
      '/praktikum/:slug',
      '/galeri/:slug',
      '/modul/:slug',
      '/file/:slug',
      '/dokumen/:slug',
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const pathSegments = req.path.split('/').filter(Boolean);
        const type = pathSegments[0] || '';
        const rawSlug = req.params.slug || pathSegments[1] || '';

        // 1. Look up item
        let item = findStaticItem(type, rawSlug);
        if (!item) {
          item = await findFirestoreDoc(type, rawSlug);
        }

        if (!item) {
          return next();
        }

        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const host = req.get('host') || 'localhost:3000';
        const canonicalUrl = `${protocol}://${host}${req.originalUrl}`;

        const meta: ShareItemMeta = {
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          canonicalUrl,
        };

        // 2. Read index.html template
        let templatePath = '';
        if (isProd) {
          templatePath = path.join(process.cwd(), 'dist', 'index.html');
        } else {
          templatePath = path.join(process.cwd(), 'index.html');
        }

        if (!fs.existsSync(templatePath)) {
          return next();
        }

        let html = fs.readFileSync(templatePath, 'utf8');

        // 3. In dev mode, apply Vite HTML transformations
        if (vite) {
          html = await vite.transformIndexHtml(req.originalUrl, html);
        }

        // 4. Inject dynamic post metadata for WhatsApp / social preview scrapers
        const finalHtml = injectMetaTags(html, meta);

        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(finalHtml);
      } catch (error) {
        console.error('Error serving share preview:', error);
        next();
      }
    }
  );

  // Vite development middleware or production static files
  if (vite) {
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Kelas Pak Hafiz Server running at http://${HOST}:${PORT} (mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer();
