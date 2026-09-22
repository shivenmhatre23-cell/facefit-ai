import { GoogleGenAI } from '@google/genai';
import { StyleProfile } from './types';
import { VISION_SYSTEM_PROMPT, buildStylistSystemPrompt } from './prompts';
import { SAMPLE_STYLE_PROFILE } from './mockData';

const apiKey = process.env.GEMINI_API_KEY;

export const hasValidGeminiKey = Boolean(apiKey && apiKey.trim().length > 10);

export const geminiClient = hasValidGeminiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Analyzes a user selfie/portrait using Gemini Multimodal Vision
 */
export async function analyzePortraitImage(base64DataWithPrefix: string): Promise<{ profile: StyleProfile; isMock: boolean }> {
  // Extract pure base64 data and mime type
  let mimeType = 'image/jpeg';
  let base64Data = base64DataWithPrefix;

  if (base64DataWithPrefix.includes(';base64,')) {
    const parts = base64DataWithPrefix.split(';base64,');
    const mimeMatch = parts[0].match(/:(.*?);/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }
    base64Data = parts[1];
  }

  // Fallback to sample profile if no key is configured
  if (!geminiClient || !hasValidGeminiKey) {
    console.warn('[FaceFit AI] GEMINI_API_KEY not configured or invalid. Serving high-fidelity mock profile.');
    return {
      profile: {
        ...SAMPLE_STYLE_PROFILE,
        id: 'profile-' + Date.now(),
        timestamp: new Date().toISOString(),
      },
      isMock: true,
    };
  }

  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: VISION_SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const rawText = response.text || '';
    if (!rawText.trim()) {
      throw new Error('Empty response from Gemini vision model');
    }

    const parsedJson = JSON.parse(rawText) as Partial<StyleProfile>;

    // Ensure essential identifiers and fallback structure
    const fullProfile: StyleProfile = {
      ...SAMPLE_STYLE_PROFILE,
      ...parsedJson,
      id: 'profile-' + Date.now(),
      timestamp: new Date().toISOString(),
      estimatedAge: {
        range: parsedJson.estimatedAge?.range || '22 - 27 years',
        confidence: parsedJson.estimatedAge?.confidence || 'medium',
        disclaimer: 'AI approximation based on visual proportions and aesthetic markers. Visual age is used solely for styling, silhouette balance, and color curation.',
      },
    };

    return { profile: fullProfile, isMock: false };
  } catch (error) {
    console.error('[FaceFit AI] Error during Gemini vision analysis:', error);
    // Graceful fallback so user's experience is seamless
    return {
      profile: {
        ...SAMPLE_STYLE_PROFILE,
        id: 'profile-' + Date.now(),
        timestamp: new Date().toISOString(),
      },
      isMock: true,
    };
  }
}
