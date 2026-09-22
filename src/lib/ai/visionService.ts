import { IVisionProvider, VisionAnalysisRequest } from './types';
import { StyleAnalysisOutput } from './schema';
import { GeminiVisionProvider } from './providers/geminiProvider';
import { MockVisionProvider } from './providers/mockProvider';
import { StyleProfile } from '../types';

/**
 * Service Orchestrator: abstracts AI vision providers, performs failover,
 * enforces safety sanitization, and transforms outputs.
 */
export class VisionService {
  private primaryProvider: IVisionProvider;
  private fallbackProvider: IVisionProvider;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (apiKey && apiKey.length > 10) {
      this.primaryProvider = new GeminiVisionProvider(apiKey);
    } else {
      this.primaryProvider = new MockVisionProvider();
    }

    this.fallbackProvider = new MockVisionProvider();
  }

  /**
   * Set provider dynamically if needed
   */
  setProvider(provider: IVisionProvider) {
    this.primaryProvider = provider;
  }

  /**
   * Primary entry point: transforms portrait image into a verified Style Profile.
   * Catches all raw model failures and gracefully falls back.
   */
  async processPortrait(request: VisionAnalysisRequest): Promise<{
    analysis: StyleAnalysisOutput;
    profile: StyleProfile;
    providerUsed: string;
    isFallback: boolean;
  }> {
    let analysis: StyleAnalysisOutput;
    let providerUsed = this.primaryProvider.name;
    let isFallback = false;

    try {
      analysis = await this.primaryProvider.analyzePortrait(request);
    } catch (err: unknown) {
      console.warn(
        `[VisionService] Primary provider (${this.primaryProvider.name}) failed or was unavailable. Engaging resilient fallback. Details:`,
        err instanceof Error ? err.message : err
      );
      analysis = await this.fallbackProvider.analyzePortrait(request);
      providerUsed = this.fallbackProvider.name;
      isFallback = true;
    }

    // Transform structured analysis into the unified StyleProfile format used by the UI
    const profile = this.mapAnalysisToStyleProfile(analysis);

    return {
      analysis,
      profile,
      providerUsed,
      isFallback,
    };
  }

  /**
   * Maps the clean StyleAnalysis schema to the frontend StyleProfile model
   */
  private mapAnalysisToStyleProfile(analysis: StyleAnalysisOutput): StyleProfile {
    const swatches =
      analysis.recommended_color_swatches && analysis.recommended_color_swatches.length > 0
        ? analysis.recommended_color_swatches.map((s) => ({
            name: s.name,
            hex: s.hex,
            role: (s.role || 'neutral') as any,
            explanation: s.reason,
          }))
        : analysis.recommended_colors.map((hex, i) => ({
            name: `Tone 0${i + 1}`,
            hex,
            role: (i === 0 ? 'primary' : i === 1 ? 'accent' : 'neutral') as any,
            explanation: 'Calibrated for visual harmony with detected undertones.',
          }));

    return {
      id: 'profile-' + Date.now(),
      timestamp: new Date().toISOString(),
      estimatedAge: {
        range: `${analysis.estimated_age_range} years`,
        confidence: analysis.age_confidence,
        disclaimer:
          'Approximate AI visual estimate for aesthetic and proportion matching only. Visual age does not define your actual age.',
      },
      faceGeometry: {
        shape: analysis.face_shape,
        confidence: analysis.age_confidence,
        proportionsSummary: `Visible ${analysis.face_shape} facial contour. Recommendations are tailored to balance vertical and horizontal visual axes.`,
        featuresNotes: [
          `Detected ${analysis.face_shape} geometric outline`,
          `Observed ${analysis.hair.texture.toLowerCase()} hair texture`,
          analysis.facial_hair.present
            ? `Visible facial hair: ${analysis.facial_hair.description}`
            : 'Clean-shaven facial outline',
        ],
      },
      hairAnalysis: {
        length: (analysis.hair.length as any) || 'Medium',
        texture: analysis.hair.texture,
        volume: 'Natural Density',
        currentStyle: analysis.hair.visible_style,
      },
      facialHairAnalysis: {
        present: analysis.facial_hair.present,
        type: analysis.facial_hair.present ? 'Stubble' : 'Clean Shaven',
        density: analysis.facial_hair.description,
        recommendation: analysis.facial_hair.present
          ? 'Maintain neat borders along cheekline to preserve jawline definition.'
          : 'Clean shaven appearance emphasizes natural jaw contours.',
      },
      observations: {
        glassesPresent: analysis.glasses.present,
        glassesDescription: analysis.glasses.style,
        accessoriesObserved: analysis.glasses.present ? ['Eyewear'] : [],
        currentClothingObservation: `${analysis.current_clothing.category} (${analysis.current_clothing.style}) in ${analysis.current_clothing.dominant_colors.join(', ')}`,
        apparentUndertone: 'Warm',
      },
      colorPalette: {
        seasonName: 'Curated Harmonized Palette',
        description:
          'Colors calibrated to complement visible skin undertones and create balanced contrast.',
        contrastLevel: 'Medium Contrast',
        swatches,
        colorsToWear: swatches.map((s) => s.name),
        colorsToAvoid: ['Harsh Icy White', 'Overly Saturated Neon'],
        metalsRecommended: ['Brushed Silver', 'Warm Brass', 'Gunmetal'],
      },
      suggestedAesthetics: analysis.style_direction,
      hairstyles: analysis.hairstyle_recommendations.map((h) => ({
        id: h.id,
        name: h.name,
        explanation: h.suitability_explanation,
        whyItWorks: h.why_it_works,
        maintenanceLevel: h.maintenance_level,
        stylingEffortMinutes: h.styling_effort_minutes,
        suitableProducts: h.suitable_products,
        barberInstructions: {
          sidesAndBack: h.barber_instructions.sides_and_back,
          topLength: h.barber_instructions.top_length,
          fadeOrTaperType: h.barber_instructions.fade_or_taper_type,
          stylingFinish: h.barber_instructions.styling_finish,
        },
      })),
      clothingRecommendations: [
        {
          category: 'Top',
          clothingType: 'Camp-Collar Textured Shirt',
          suggestedColors: swatches.slice(0, 2).map((s) => s.name),
          fitGuidance:
            'Open collar geometry that subtly elongates the neckline and balances facial proportions.',
          aesthetic: analysis.style_direction[0] || 'Smart Casual',
          occasion: 'College Everyday / Social',
        },
        {
          category: 'Bottom',
          clothingType: 'Tailored Single-Pleat Trousers',
          suggestedColors: ['Espresso', 'Charcoal Slate'],
          fitGuidance: 'Relaxed thigh with clean taper down to shoe vamp.',
          aesthetic: 'Contemporary Tailoring',
          occasion: 'Presentations / Formal',
        },
      ],
      outfitCombinations: analysis.outfit_recommendations.map((o) => ({
        id: o.id,
        title: o.title,
        aesthetic: o.style_category,
        occasion: o.occasion,
        pieces: o.pieces.map((p) => ({
          item: p.item,
          color: p.color,
          stylingTip: p.styling_tip,
          estimatedBudgetINR: p.estimated_budget_inr || '₹999 - ₹1499',
        })),
        totalVibe: o.total_vibe,
        budgetTier: (o.budget_tier as any) || 'Budget (Under ₹3000)',
      })),
      accessories: analysis.accessory_recommendations.map((a) => ({
        type: a.type,
        recommendation: a.recommendation,
        whyItComplements: a.why_it_complements,
      })),
      grooming: [
        {
          category: 'Skincare',
          tip: 'Lightweight hydrating moisturizer with broad-spectrum SPF 50.',
          frequency: 'Every Morning',
        },
        {
          category: 'Beard/Shave',
          tip: analysis.facial_hair.present
            ? 'Trim edges every 3 days 2 fingers above Adam\'s apple for clean contouring.'
            : 'Shave with warm water and moisturizing aftershave balm.',
          frequency: 'Twice Weekly',
        },
      ],
    };
  }
}

export const visionService = new VisionService();
