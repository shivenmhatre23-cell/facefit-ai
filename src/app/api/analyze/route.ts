import { NextRequest, NextResponse } from 'next/server';
import { visionService } from '@/lib/ai/visionService';

export const maxDuration = 60; // 60 seconds timeout for vision processing

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, preferences } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'A valid image (base64 data URL) is required for analysis.' },
        { status: 400 }
      );
    }

    // Payload size guardrail (approx 12MB limit)
    if (image.length > 16 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size exceeds maximum allowed upload size. Please try a smaller photo.' },
        { status: 413 }
      );
    }

    // Process portrait through AI abstraction pipeline
    const result = await visionService.processPortrait({
      imageBase64: image,
      mimeType: 'image/jpeg',
      userPreferences: preferences,
    });

    return NextResponse.json({
      success: true,
      analysis: result.analysis, // Exactly matches requested StyleAnalysis schema
      profile: result.profile,   // Unified frontend StyleProfile
      provider: result.providerUsed,
      isFallback: result.isFallback,
    });
  } catch (error: unknown) {
    // Never expose raw internal or model error details to the client
    console.error('[API /api/analyze] Protected pipeline failure:', error);
    return NextResponse.json(
      {
        error: 'Unable to complete optical style analysis. Please try again with a clear, front-facing portrait.',
      },
      { status: 500 }
    );
  }
}
