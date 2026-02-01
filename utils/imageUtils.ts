/**
 * Compresses a base64 image string by resizing it to a maximum width
 * and reducing its quality. Useful for staying within localStorage limits
 * and reducing API bandwidth.
 */
export async function compressBase64(base64: string, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Ensure the base64 has the correct prefix
    img.src = base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`;
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64);
          return;
        }

        // Use better image smoothing for the resize
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch (err) {
        console.error("Compression error:", err);
        resolve(base64);
      }
    };
    img.onerror = () => resolve(base64);
  });
}