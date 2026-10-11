export function formatMessageTime(date){
  return new Date(date).toLocaleTimeString("en-US",{
    hour:"2-digit",
    minute:"2-digit",
    hour12:false,
  });
}

/**
 * Optimizes Cloudinary URLs for fast delivery and transforms unsupported
 * formats (such as Apple's HEIC) to browser-compatible auto WebP/JPEG.
 */
export function optimizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    let optimized = url;
    if (!optimized.includes('/upload/f_auto,q_auto/')) {
      optimized = optimized.replace('/upload/', '/upload/f_auto,q_auto/');
    }
    if (optimized.endsWith('.heic') || optimized.endsWith('.HEIC')) {
      optimized = optimized.replace(/\.heic$/i, '.jpg');
    }
    return optimized;
  }
  return url;
}