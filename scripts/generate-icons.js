import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Circle Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#194B96" />
      <stop offset="50%" stop-color="#144186" />
      <stop offset="100%" stop-color="#0E2F68" />
    </linearGradient>

    <!-- Liquid Gradient -->
    <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="40%" stop-color="#0284C7" />
      <stop offset="100%" stop-color="#1D4ED8" />
    </linearGradient>

    <!-- Book Page Gradient -->
    <linearGradient id="pageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="85%" stop-color="#F1F7FD" />
      <stop offset="100%" stop-color="#D7E8FA" />
    </linearGradient>
  </defs>

  <!-- Main Circular Badge (100% Transparent Outside) -->
  <circle cx="256" cy="256" r="246" fill="url(#bgGrad)" />

  <!-- Twinkling Sparkles / Stars Above Flask -->
  <!-- Top Center Star -->
  <g fill="#FFFFFF">
    <path d="M 256 46 Q 256 68 268 68 Q 256 68 256 90 Q 256 68 244 68 Q 256 68 256 46 Z" />
    <!-- Left Star -->
    <path d="M 196 90 Q 196 106 206 106 Q 196 106 196 122 Q 196 106 186 106 Q 196 106 196 90 Z" />
    <!-- Right Star -->
    <path d="M 316 90 Q 316 106 326 106 Q 316 106 316 122 Q 316 106 306 106 Q 316 106 316 90 Z" />
  </g>

  <!-- OPEN BOOK ILUSTRASI -->
  <!-- Left Page Outer Layer (Thickness effect) -->
  <path d="M 250 148 C 210 138 120 142 84 172 C 78 178 76 190 76 348 C 114 366 210 362 250 376 Z" 
        fill="#93C5FD" opacity="0.9" />
  <!-- Right Page Outer Layer (Thickness effect) -->
  <path d="M 262 148 C 302 138 392 142 428 172 C 434 178 436 190 436 348 C 398 366 302 362 262 376 Z" 
        fill="#93C5FD" opacity="0.9" />

  <!-- Left Main Page White -->
  <path d="M 248 152 C 212 144 130 148 94 176 C 88 181 88 190 88 338 C 122 354 212 350 248 364 Z" 
        fill="url(#pageGrad)" stroke="#11366E" stroke-width="8" stroke-linejoin="round" />
  
  <!-- Right Main Page White -->
  <path d="M 264 152 C 300 144 382 148 418 176 C 424 181 424 190 424 338 C 390 354 300 350 264 364 Z" 
        fill="url(#pageGrad)" stroke="#11366E" stroke-width="8" stroke-linejoin="round" />

  <!-- Book Spine Center Divider -->
  <path d="M 256 160 L 256 372" stroke="#11366E" stroke-width="6" stroke-linecap="round" />

  <!-- CHEMISTRY FLASK (ERLENMEYER) -->
  <!-- Flask Background & Outline Glow -->
  <g>
    <!-- Flask Body Outline & White Base -->
    <path d="M 232 110 L 280 110 L 280 166 L 354 286 C 366 306 352 332 328 332 L 184 332 C 160 332 146 306 158 286 L 232 166 Z" 
          fill="#FFFFFF" stroke="#0E2F68" stroke-width="12" stroke-linejoin="round" />

    <!-- Flask Rim Top -->
    <rect x="222" y="98" width="68" height="16" rx="8" fill="#FFFFFF" stroke="#0E2F68" stroke-width="10" stroke-linejoin="round" />

    <!-- Liquid Inside Flask -->
    <path d="M 214 232 C 234 226 278 244 298 234 L 338 298 C 346 312 336 322 322 322 L 190 322 C 176 322 166 312 174 298 Z" 
          fill="url(#liquidGrad)" />

    <!-- Chemical Bubbles -->
    <circle cx="236" cy="274" r="14" fill="#FFFFFF" opacity="0.9" />
    <circle cx="282" cy="286" r="10" fill="#FFFFFF" opacity="0.9" />
    <circle cx="254" cy="298" r="7" fill="#FFFFFF" opacity="0.9" />
    <circle cx="224" cy="294" r="5" fill="#FFFFFF" opacity="0.8" />

    <!-- Glass Reflection Highlights -->
    <path d="M 188 288 L 234 204" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.6" />
    <path d="M 240 134 L 240 164" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.7" />
  </g>

  <!-- Typography: KELAS PAK HAFIZ -->
  <text x="256" y="434" 
        text-anchor="middle" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Outfit', 'Montserrat', 'Segoe UI', Roboto, sans-serif" 
        font-size="34" 
        font-weight="800" 
        letter-spacing="2.5" 
        fill="#FFFFFF">KELAS PAK HAFIZ</text>
</svg>`;

async function generateIcons() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVG files
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

  const svgBuffer = Buffer.from(svgContent);

  // 2. Generate crisp PNG icons at standard mobile & desktop dimensions
  const targets = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-precomposed.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-maskable-512.png', size: 512, maskable: true },
  ];

  for (const target of targets) {
    let pipeline = sharp(svgBuffer);
    if (target.maskable) {
      // Add comfortable padding for maskable icons
      const paddedSvg = svgContent.replace(
        'viewBox="0 0 512 512"',
        'viewBox="-64 -64 640 640"'
      );
      pipeline = sharp(Buffer.from(paddedSvg));
    }
    await pipeline
      .resize(target.size, target.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(path.join(publicDir, target.name));
    console.log(`Generated: public/${target.name} (${target.size}x${target.size})`);
  }

  // Also copy apple-touch-icon as default favicon.ico fallback if needed
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
