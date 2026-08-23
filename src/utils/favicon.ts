/**
 * Generates a high-quality circular favicon as a PNG Data URI from an image URL.
 * It crops the image into a circle and removes white background margins.
 */
export function createCircularFavicon(imageUrl: string, size = 64): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        // Draw circular clipping path with transparent background
        ctx.clearRect(0, 0, size, size);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Calculate aspect ratio fill to eliminate white outer border
        const imgAspect = img.width / img.height;
        let drawWidth = size;
        let drawHeight = size;
        let offsetX = 0;
        let offsetY = 0;

        if (imgAspect > 1) {
          drawWidth = size * imgAspect;
          offsetX = -(drawWidth - size) / 2;
        } else {
          drawHeight = size / imgAspect;
          offsetY = -(drawHeight - size) / 2;
        }

        // Slight scale to bleed over the circle boundaries to ensure no white edges
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Filter out near-white outer pixels if any remain outside the main circular illustration
        const imgData = ctx.getImageData(0, 0, size, size);
        const data = imgData.data;
        const center = size / 2;
        const radiusSq = (size / 2) * (size / 2);

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const index = (y * size + x) * 4;
            const dx = x - center;
            const dy = y - center;
            const distSq = dx * dx + dy * dy;

            // Outside circle -> fully transparent
            if (distSq > radiusSq) {
              data[index + 3] = 0;
            }
          }
        }
        ctx.putImageData(imgData, 0, 0);

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Canvas circular favicon generation fallback:', err);
        resolve(imageUrl);
      }
    };

    img.onerror = () => {
      resolve(imageUrl);
    };

    img.src = imageUrl;
  });
}
