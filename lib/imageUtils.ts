const MAX_DIMENSION = 1024; // Max width or height for API calls

/**
 * Resizes and compresses an image file to a maximum dimension,
 * optimizing it for API uploads.
 * @param file The original image file.
 * @returns A promise that resolves to the processed image file.
 */
export const processImageForApi = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        // Only process if it's a JPEG or PNG
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            return resolve(file);
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            if (!event.target?.result) {
                return reject(new Error('FileReader did not load the file.'));
            }
            const img = new Image();
            img.src = event.target.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }

                let { width, height } = img;

                // If the image is already small enough, no need to process
                if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
                    return resolve(file);
                }
                
                if (width > height) {
                    height = Math.round((height * MAX_DIMENSION) / width);
                    width = MAX_DIMENSION;
                } else {
                    width = Math.round((width * MAX_DIMENSION) / height);
                    height = MAX_DIMENSION;
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const mimeType = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
                const quality = 0.9; // Apply some compression for JPEGs

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            return reject(new Error('Canvas to Blob conversion failed'));
                        }
                        const newFile = new File([blob], file.name, {
                            type: mimeType,
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    },
                    mimeType,
                    quality
                );
            };
            img.onerror = () => reject(new Error('Image failed to load.'));
        };
        reader.onerror = (err) => reject(err);
    });
};
