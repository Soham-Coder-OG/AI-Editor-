
export const addWatermark = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const mainImage = new Image();
    mainImage.crossOrigin = 'anonymous'; // Important for canvas with external images
    mainImage.src = imageUrl;

    mainImage.onload = () => {
      // Create the logo image from SVG string
      const logoImage = new Image();
      // SVG matches IconLogo.tsx but with colors set to white for watermark visibility
      // and React-specific attributes converted to standard SVG attributes (e.g. strokeWidth -> stroke-width)
      const logoSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" width="24" height="24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          <path stroke-linecap="round" stroke-linejoin="round" fill="white" d="M12 10.5l.6 2.25 2.25.6-2.25.6-.6 2.25-.6-2.25-2.25-.6 2.25-.6.6-2.25Z" />
        </svg>
      `;
      // Use standard base64 encoding for the data URL
      logoImage.src = `data:image/svg+xml;base64,${btoa(logoSvg)}`;

      logoImage.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }

        canvas.width = mainImage.width;
        canvas.height = mainImage.height;
        
        // 1. Draw the original image
        ctx.drawImage(mainImage, 0, 0);

        // 2. Calculate dimensions relative to image size
        const minDim = Math.min(mainImage.width, mainImage.height);
        const fontSize = Math.max(16, minDim * 0.03); // ~3% of minimum dimension
        const logoSize = fontSize * 1.5; // Logo is slightly larger than text cap height
        const padding = Math.max(20, minDim * 0.02);
        const gap = fontSize * 0.5;

        // 3. Configure Text Style
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // 4. Configure Shadow (Visibility on light/dark backgrounds)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        const text = "AI Editor";
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        
        // 5. Calculate Layout Positions (Bottom Right)
        const totalWidth = logoSize + gap + textWidth;
        const x = canvas.width - totalWidth - padding;
        const y = canvas.height - padding - (logoSize / 2); // Center vertically around this Y point relative to padding

        // 6. Draw Logo
        // Adjust logo Y to center it with the text
        ctx.drawImage(logoImage, x, y - (logoSize / 2), logoSize, logoSize);

        // 7. Draw Text
        // Text Y is centered due to textBaseline='middle'
        ctx.fillText(text, x + logoSize + gap, y);
        
        resolve(canvas.toDataURL('image/png'));
      };

      logoImage.onerror = () => {
        // Fallback to text-only if SVG fails for some reason
        console.warn('Watermark logo failed to load, falling back to text.');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Could not get canvas context'));
        
        canvas.width = mainImage.width;
        canvas.height = mainImage.height;
        ctx.drawImage(mainImage, 0, 0);
        
        const fontSize = Math.max(16, mainImage.width * 0.03);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('✨ AI Editor', canvas.width - 20, canvas.height - 20);
        
        resolve(canvas.toDataURL('image/png'));
      };
    };

    mainImage.onerror = () => {
      reject(new Error('Failed to load image for watermarking.'));
    };
  });
};
