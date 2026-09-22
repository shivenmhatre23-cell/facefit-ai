/**
 * Secure image validator for FaceFit AI
 * Validates binary signatures (magic bytes), strictly allows only JPEG, PNG, and WebP.
 * Strictly blocks SVGs, HTML, executable scripts, and oversized payloads.
 */

export interface ImageValidationResult {
  isValid: boolean;
  sanitizedBase64?: string;
  mimeType?: string;
  sizeBytes?: number;
  error?: string;
}

// Magic byte signatures
const JPEG_SIGNATURE = [0xff, 0xd8, 0xff];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47];
const RIFF_HEADER = [0x52, 0x49, 0x46, 0x46]; // 'RIFF'
const WEBP_HEADER = [0x57, 0x45, 0x42, 0x50]; // 'WEBP' at offset 8

// Maximum decoded binary size: 6MB
const MAX_IMAGE_SIZE_BYTES = 6 * 1024 * 1024;

export function validateImageBuffer(buffer: Buffer): { isValid: boolean; mimeType?: string; error?: string } {
  if (buffer.length < 12) {
    return { isValid: false, error: 'File is too small to be a valid image.' };
  }

  if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `Image size exceeds the maximum allowed limit of ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB.`,
    };
  }

  // 1. Check JPEG
  if (
    buffer[0] === JPEG_SIGNATURE[0] &&
    buffer[1] === JPEG_SIGNATURE[1] &&
    buffer[2] === JPEG_SIGNATURE[2]
  ) {
    return { isValid: true, mimeType: 'image/jpeg' };
  }

  // 2. Check PNG
  if (
    buffer[0] === PNG_SIGNATURE[0] &&
    buffer[1] === PNG_SIGNATURE[1] &&
    buffer[2] === PNG_SIGNATURE[2] &&
    buffer[3] === PNG_SIGNATURE[3]
  ) {
    return { isValid: true, mimeType: 'image/png' };
  }

  // 3. Check WebP (RIFF....WEBP)
  if (
    buffer[0] === RIFF_HEADER[0] &&
    buffer[1] === RIFF_HEADER[1] &&
    buffer[2] === RIFF_HEADER[2] &&
    buffer[3] === RIFF_HEADER[3] &&
    buffer[8] === WEBP_HEADER[0] &&
    buffer[9] === WEBP_HEADER[1] &&
    buffer[10] === WEBP_HEADER[2] &&
    buffer[11] === WEBP_HEADER[3]
  ) {
    return { isValid: true, mimeType: 'image/webp' };
  }

  // Explicitly reject SVGs or arbitrary text/script files disguised as images
  const snippet = buffer.subarray(0, 256).toString('utf-8').toLowerCase();
  if (snippet.includes('<svg') || snippet.includes('<?xml') || snippet.includes('<script') || snippet.includes('<html')) {
    return {
      isValid: false,
      error: 'SVG and HTML file formats are strictly prohibited for security reasons.',
    };
  }

  return {
    isValid: false,
    error: 'Unsupported image format. Only authentic JPEG, PNG, and WebP images are permitted.',
  };
}

/**
 * Validates a base64 payload from an API request
 */
export function validateAndSanitizeBase64Image(dataUrlOrBase64: string): ImageValidationResult {
  if (!dataUrlOrBase64 || typeof dataUrlOrBase64 !== 'string') {
    return { isValid: false, error: 'No image data was provided in request.' };
  }

  let base64Data = dataUrlOrBase64.trim();
  let declaredMime = 'image/jpeg';

  if (base64Data.includes(';base64,')) {
    const parts = base64Data.split(';base64,');
    const mimeMatch = parts[0].match(/:(.*?);/);
    if (mimeMatch) {
      declaredMime = mimeMatch[1].toLowerCase();
    }
    base64Data = parts[1];
  }

  // Fast length check on base64 string before allocating buffer (~8MB max base64)
  if (base64Data.length > 8.5 * 1024 * 1024) {
    return { isValid: false, error: 'Payload size exceeds the 6MB binary limit.' };
  }

  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const validation = validateImageBuffer(buffer);

    if (!validation.isValid) {
      return { isValid: false, error: validation.error };
    }

    return {
      isValid: true,
      sanitizedBase64: base64Data,
      mimeType: validation.mimeType || declaredMime,
      sizeBytes: buffer.length,
    };
  } catch {
    return { isValid: false, error: 'Malformed base64 image data.' };
  }
}
