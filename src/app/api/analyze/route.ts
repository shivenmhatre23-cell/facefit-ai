import { NextRequest, NextResponse } from 'next/server';
import { analyzePortraitImage } from '@/lib/gemini';

export const maxDuration = 60; // 60 seconds timeout for vision processing

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'A valid image (base64 data URL) is required for analysis.' },
        { status: 400 }
      );
    }

    // Safety check on payload size (approx max 10MB)
    if (image.length > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image file size exceeds maximum permitted limit.' },
        { status: 413 }
      );
    }

    const { profile, isMock } = await analyzePortraitImage(image);

    return NextResponse.json({
      success: true,
      profile,
      isMock,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown internal error';
    console.error('[API /api/analyze] Handler error:', message);
    return NextResponse.json(
      { error: 'Failed to analyze portrait: ' + message },
      { status: 500 }
    );
  }
}
