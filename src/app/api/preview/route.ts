import { NextRequest, NextResponse } from 'next/server';
import { lookPreviewService } from '@/lib/ai/preview/previewService';
import { rateLimiter, getClientIp } from '@/lib/security/rateLimiter';
import { LookPreviewRequest } from '@/lib/types';

export const maxDuration = 30;

const PREVIEW_LIMIT = 20;
const PREVIEW_WINDOW_MS = 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const clientIp = getClientIp(req.headers);
    const rateCheck = rateLimiter.check(`preview:${clientIp}`, PREVIEW_LIMIT, PREVIEW_WINDOW_MS);

    if (!rateCheck.allowed) {
      const retryAfterSec = Math.ceil(rateCheck.resetMs / 1000);
      return NextResponse.json(
        {
          error: `Preview generation limit reached. Please wait ${retryAfterSec} seconds before generating another look.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfterSec) },
        }
      );
    }

    // 2. Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload.' }, { status: 400 });
    }

    const { type, targetName, targetDetails, baseImage } = (body || {}) as LookPreviewRequest;

    if (!targetName || !type) {
      return NextResponse.json(
        { error: 'Both "type" and "targetName" are required to generate a look preview.' },
        { status: 400 }
      );
    }

    // 3. Generate Look Preview
    const result = await lookPreviewService.generateLookPreview({
      type,
      targetName,
      targetDetails: targetDetails || {},
      baseImage,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown generation failure';
    console.error('[API /api/preview] Error:', msg);
    return NextResponse.json(
      { error: 'Failed to synthesize look preview. Please try again.' },
      { status: 500 }
    );
  }
}
