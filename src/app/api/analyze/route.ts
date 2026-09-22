import { NextRequest, NextResponse } from 'next/server';
import { visionService } from '@/lib/ai/visionService';
import { validateAndSanitizeBase64Image } from '@/lib/security/imageValidator';
import { rateLimiter, getClientIp } from '@/lib/security/rateLimiter';

export const maxDuration = 60; // 60 seconds timeout for vision processing

// Rate limit: 10 analyze requests per minute per IP
const ANALYZE_LIMIT = 10;
const ANALYZE_WINDOW_MS = 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // 1. Sliding window rate limiting
    const clientIp = getClientIp(req.headers);
    const rateCheck = rateLimiter.check(`analyze:${clientIp}`, ANALYZE_LIMIT, ANALYZE_WINDOW_MS);

    if (!rateCheck.allowed) {
      const retryAfterSec = Math.ceil(rateCheck.resetMs / 1000);
      return NextResponse.json(
        {
          error: `Too many analysis requests. Please wait ${retryAfterSec} seconds before analyzing another portrait.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
          },
        }
      );
    }

    // 2. Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON payload in request body.' },
        { status: 400 }
      );
    }

    const { image, preferences } = body || {};

    // 3. Check presence of image
    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'A valid image (base64 data URL) is required for analysis.' },
        { status: 400 }
      );
    }

    // 4. Validate binary magic bytes, file format (JPEG, PNG, WebP only), and size ceiling (6MB)
    const validation = validateAndSanitizeBase64Image(image);
    if (!validation.isValid) {
      const status = validation.error?.includes('exceeds') ? 413 : 400;
      return NextResponse.json(
        { error: validation.error || 'Invalid or unsupported image file.' },
        { status }
      );
    }

    // 5. Ephemeral processing through vision pipeline (never logs raw image data)
    // Note: sanitizedBase64 contains purified base64 payload without script injections
    const result = await visionService.processPortrait({
      imageBase64: validation.sanitizedBase64 || image,
      mimeType: validation.mimeType || 'image/jpeg',
      userPreferences: preferences,
    });

    return NextResponse.json({
      success: true,
      analysis: result.analysis,
      profile: result.profile,
      provider: result.providerUsed,
      isFallback: result.isFallback,
    });
  } catch (error: unknown) {
    // Log sanitized error message only — NEVER log image payload or PII
    const safeErrorMsg = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('[API /api/analyze] Protected pipeline failure:', safeErrorMsg);

    return NextResponse.json(
      {
        error: 'Unable to complete optical style analysis. Please ensure your photo is a clear, front-facing portrait.',
      },
      { status: 500 }
    );
  }
}
