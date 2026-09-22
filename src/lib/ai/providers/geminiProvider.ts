import { GoogleGenAI } from '@google/genai';
import { IVisionProvider, VisionAnalysisRequest } from '../types';
import { StyleAnalysisOutput } from '../schema';
import { AI_VISION_ANALYSIS_PROMPT } from '../prompts';
import { validateAndSanitizeModelOutput } from '../validator';

export class GeminiVisionProvider implements IVisionProvider {
  readonly name = 'Google Gemini 2.5 Flash';
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async analyzePortrait(request: VisionAnalysisRequest): Promise<StyleAnalysisOutput> {
    const { imageBase64, mimeType } = request;

    // Clean base64 data if it contains the data:image/... prefix
    let cleanBase64 = imageBase64;
    let detectedMime = mimeType || 'image/jpeg';

    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      cleanBase64 = parts[1];
      const match = parts[0].match(/:(.*?);/);
      if (match) detectedMime = match[1];
    }

    const response = await this.client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: AI_VISION_ANALYSIS_PROMPT },
            {
              inlineData: {
                mimeType: detectedMime,
                data: cleanBase64,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.25, // Lower temperature for strict schema adherence
      },
    });

    const rawText = response.text || '';
    if (!rawText.trim()) {
      throw new Error('Gemini returned an empty response.');
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawText);
    } catch {
      // Attempt cleanup if wrapped in markdown blocks
      const cleanJsonStr = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedJson = JSON.parse(cleanJsonStr);
    }

    const validation = validateAndSanitizeModelOutput(parsedJson);

    if (!validation.success) {
      throw new Error('Validation failed for Gemini output: ' + (validation.errors?.join(', ') || 'unknown'));
    }

    return validation.data;
  }
}
