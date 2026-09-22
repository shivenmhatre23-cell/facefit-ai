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
   * Catches all raw model failures, timeouts, and malformed outputs and gracefully falls back.
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
      const errMessage = err instanceof Error ? err.message : String(err);
      console.warn(
        `[VisionService] Primary provider (${this.primaryProvider.name}) was unavailable. Engaging resilient fallback. Details: ${errMessage}`
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
   * Maps the clean StyleAnalysis schema to the frontend StyleProfile model with complete null safety
   */
  private mapAnalysisToStyleProfile(analysis: StyleAnalysisOutput): StyleProfile {
    const defaultColors = ['#3B2F2F', '#C2593F', '#4A5B43', '#D7CEBE', '#CF8A2C', '#263445'];
    const colorsList = Array.isArray(analysis?.recommended_colors) && analysis.recommended_colors.length > 0
      ? analysis.recommended_colors
      : defaultColors;

    const swatches =
      Array.isArray(analysis?.recommended_color_swatches) && analysis.recommended_color_swatches.length > 0
        ? analysis.recommended_color_swatches.map((s) => ({
            name: s.name || 'Tone',
            hex: s.hex || '#333333',
            role: (s.role || 'neutral') as any,
            explanation: s.reason || 'Harmonizes with detected undertone.',
          }))
        : colorsList.map((hex, i) => ({
            name: `Tone 0${i + 1}`,
            hex,
            role: (i === 0 ? 'primary' : i === 1 ? 'accent' : 'neutral') as any,
            explanation: 'Calibrated for visual harmony with detected undertones.',
          }));

    const faceShape = analysis?.face_shape || 'Oval';
    const ageRange = analysis?.estimated_age_range || '17-20';
    const ageConfidence = analysis?.age_confidence || 'medium';
    const hairTexture = analysis?.hair?.texture || 'Natural';
    const hairLength = (analysis?.hair?.length as any) || 'Medium';
    const hairVisibleStyle = analysis?.hair?.visible_style || 'Natural style';
    const facialHairPresent = Boolean(analysis?.facial_hair?.present);
    const facialHairDesc = analysis?.facial_hair?.description || (facialHairPresent ? 'Visible trim' : 'Clean-shaven');
    const glassesPresent = Boolean(analysis?.glasses?.present);
    const glassesStyle = analysis?.glasses?.style || 'None observed';
    const currentClothingCategory = analysis?.current_clothing?.category || 'Casual';
    const currentClothingStyle = analysis?.current_clothing?.style || 'Contemporary';
    const currentClothingColors = Array.isArray(analysis?.current_clothing?.dominant_colors)
      ? analysis.current_clothing.dominant_colors.join(', ')
      : 'Neutral';

    const hairstyles = Array.isArray(analysis?.hairstyle_recommendations) && analysis.hairstyle_recommendations.length > 0
      ? analysis.hairstyle_recommendations.map((h, i) => ({
          id: h.id || `hair-${i + 1}`,
          name: h.name || 'Textured Crop',
          explanation: h.suitability_explanation || 'Tailored to frame your facial contour.',
          whyItWorks: h.why_it_works || 'Preserves natural visual balance.',
          maintenanceLevel: h.maintenance_level || 'Medium',
          stylingEffortMinutes: typeof h.styling_effort_minutes === 'number' ? h.styling_effort_minutes : 5,
          suitableProducts: Array.isArray(h.suitable_products) && h.suitable_products.length > 0 ? h.suitable_products : ['Matte Clay'],
          barberInstructions: {
            sidesAndBack: h.barber_instructions?.sides_and_back || 'Low taper fade on sides',
            topLength: h.barber_instructions?.top_length || '2 to 2.5 inches scissor cut',
            fadeOrTaperType: h.barber_instructions?.fade_or_taper_type || 'Low Taper Fade',
            stylingFinish: h.barber_instructions?.styling_finish || 'Matte natural finish',
          },
        }))
      : [
          {
            id: 'hair-1',
            name: 'Textured Modern Crop',
            explanation: 'Creates clean vertical balance and frames jawline.',
            whyItWorks: 'Preserves natural proportions.',
            maintenanceLevel: 'Low' as const,
            stylingEffortMinutes: 4,
            suitableProducts: ['Matte Styling Clay'],
            barberInstructions: {
              sidesAndBack: 'Low skin taper fade',
              topLength: '2 inches textured point-cut',
              fadeOrTaperType: 'Low Taper',
              stylingFinish: 'Natural matte forward',
            },
          },
        ];

    const outfitCombinations = Array.isArray(analysis?.outfit_recommendations) && analysis.outfit_recommendations.length > 0
      ? analysis.outfit_recommendations.map((o, idx) => ({
          id: o.id || `outfit-${idx + 1}`,
          title: o.title || 'Curated Contemporary Ensemble',
          aesthetic: o.style_category || 'Smart Casual',
          occasion: o.occasion || 'Everyday',
          pieces: Array.isArray(o.pieces)
            ? o.pieces.map((p) => ({
                item: p.item || 'Cotton Top',
                color: p.color || 'Neutral',
                stylingTip: p.styling_tip || 'Clean relaxed fit.',
                estimatedBudgetINR: p.estimated_budget_inr || '₹999 - ₹1,499',
              }))
            : [{ item: 'Boxy Cotton Tee', color: 'Oatmeal', stylingTip: 'Drop shoulder', estimatedBudgetINR: '₹799' }],
          totalVibe: o.total_vibe || 'Approachable, clean silhouette.',
          budgetTier: (o.budget_tier as any) || 'Budget (Under ₹3000)',
        }))
      : [
          {
            id: 'outfit-1',
            title: 'Collegiate Smart Casual',
            aesthetic: 'Smart Casual',
            occasion: 'College Everyday',
            pieces: [
              { item: 'Relaxed Boxy Cotton Tee', color: 'Oatmeal Sand', stylingTip: 'Drop shoulder frame', estimatedBudgetINR: '₹699' },
              { item: 'Straight Chinos', color: 'Olive', stylingTip: 'Single cuff break', estimatedBudgetINR: '₹1,299' },
            ],
            totalVibe: 'Effortless and balanced.',
            budgetTier: 'Budget (Under ₹3000)' as const,
          },
        ];

    const accessories = Array.isArray(analysis?.accessory_recommendations) && analysis.accessory_recommendations.length > 0
      ? analysis.accessory_recommendations.map((a) => ({
          type: a.type || 'Eyewear',
          recommendation: a.recommendation || 'Geometric subtle frames',
          whyItComplements: a.why_it_complements || 'Accents facial structure.',
        }))
      : [
          {
            type: 'Eyewear',
            recommendation: 'Subtle rectangular or square metal frames',
            whyItComplements: 'Complements facial contour.',
          },
        ];

    return {
      id: 'profile-' + Date.now(),
      timestamp: new Date().toISOString(),
      estimatedAge: {
        range: `${ageRange} years`,
        confidence: ageConfidence,
        disclaimer:
          'Approximate AI visual estimate for aesthetic and proportion matching only. Visual age does not define your actual age.',
      },
      faceGeometry: {
        shape: faceShape,
        confidence: ageConfidence,
        proportionsSummary: `Visible ${faceShape} facial contour. Recommendations are tailored to balance vertical and horizontal visual axes.`,
        featuresNotes: [
          `Detected ${faceShape} geometric outline`,
          `Observed ${hairTexture.toLowerCase()} hair texture`,
          facialHairPresent ? `Visible facial hair: ${facialHairDesc}` : 'Clean-shaven facial outline',
        ],
      },
      hairAnalysis: {
        length: hairLength,
        texture: hairTexture,
        volume: 'Natural Density',
        currentStyle: hairVisibleStyle,
      },
      facialHairAnalysis: {
        present: facialHairPresent,
        type: facialHairPresent ? 'Stubble' : 'Clean Shaven',
        density: facialHairDesc,
        recommendation: facialHairPresent
          ? 'Maintain neat borders along cheekline to preserve jawline definition.'
          : 'Clean shaven appearance emphasizes natural jaw contours.',
      },
      observations: {
        glassesPresent,
        glassesDescription: glassesStyle,
        accessoriesObserved: glassesPresent ? ['Eyewear'] : [],
        currentClothingObservation: `${currentClothingCategory} (${currentClothingStyle}) in ${currentClothingColors}`,
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
      suggestedAesthetics: Array.isArray(analysis?.style_direction) && analysis.style_direction.length > 0
        ? analysis.style_direction
        : ['Contemporary Classic', 'Casual Tailoring'],
      hairstyles,
      clothingRecommendations: [
        {
          category: 'Top',
          clothingType: 'Camp-Collar Textured Shirt',
          suggestedColors: swatches.slice(0, 2).map((s) => s.name),
          fitGuidance:
            'Open collar geometry that subtly elongates the neckline and balances facial proportions.',
          aesthetic: (analysis?.style_direction?.[0] as string) || 'Smart Casual',
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
      outfitCombinations,
      accessories,
      grooming: [
        {
          category: 'Skincare',
          tip: 'Lightweight hydrating moisturizer with broad-spectrum SPF 50.',
          frequency: 'Every Morning',
        },
        {
          category: 'Beard/Shave',
          tip: facialHairPresent
            ? 'Trim edges every 3 days 2 fingers above Adam\'s apple for clean contouring.'
            : 'Shave with warm water and moisturizing aftershave balm.',
          frequency: 'Twice Weekly',
        },
      ],
    };
  }
}

export const visionService = new VisionService();
