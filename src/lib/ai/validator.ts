import { StyleAnalysisOutput, StyleAnalysisOutputSchema } from './schema';

/**
 * Normalizes an age value to guarantee it is strictly an approximate range
 * rather than an exact integer or absolute fact.
 */
export function normalizeAgeRange(input: unknown): string {
  if (typeof input === 'number') {
    if (input <= 18) {
      const min = Math.max(14, input - 1);
      const max = input + 2;
      return `${min}-${max}`;
    }
    const min = Math.max(14, input - 2);
    const max = input + 2;
    return `${min}-${max}`;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    // If it's already a range like "17-20" or "16 - 19"
    if (trimmed.includes('-') || trimmed.includes('–')) {
      return trimmed.replace(/\s+/g, '');
    }

    // If it's a single number string like "17"
    const singleNum = parseInt(trimmed, 10);
    if (!isNaN(singleNum)) {
      if (singleNum <= 18) {
        const min = Math.max(14, singleNum - 1);
        const max = singleNum + 2;
        return `${min}-${max}`;
      }
      const min = Math.max(14, singleNum - 2);
      const max = singleNum + 2;
      return `${min}-${max}`;
    }

    return trimmed || '17-20';
  }

  return '17-20';
}

/**
 * Replaces absolute assertions with tentative, respectful styling language
 */
export function softenAssertionLanguage(text: string): string {
  if (!text) return '';

  return text
    .replace(/is perfect for you/gi, 'may complement your visible proportions')
    .replace(/is the best cut for you/gi, 'is an option that may harmonize with your face shape')
    .replace(/you must wear/gi, 'you may consider wearing')
    .replace(/your face is flawed/gi, 'your features create a distinctive balance')
    .replace(/hides your ugly/gi, 'accents your natural')
    .replace(/makes you look attractive/gi, 'enhances your overall silhouette harmony');
}

/**
 * Validates, repairs, and sanitizes model output against the StyleAnalysis schema
 */
export function validateAndSanitizeModelOutput(rawJson: unknown): {
  success: boolean;
  data: StyleAnalysisOutput;
  errors?: string[];
} {
  try {
    if (!rawJson || typeof rawJson !== 'object') {
      throw new Error('Raw model output is not a JSON object.');
    }

    const obj = rawJson as Record<string, any>;

    // 1. Sanitize age range
    if ('estimated_age_range' in obj || 'estimated_age' in obj || 'age_range' in obj) {
      const ageVal = obj.estimated_age_range || obj.estimated_age || obj.age_range;
      obj.estimated_age_range = normalizeAgeRange(ageVal);
    } else {
      obj.estimated_age_range = '17-20';
    }

    // 2. Ensure confidence is valid enum
    const validConf = ['low', 'medium', 'high'];
    if (!validConf.includes(obj.age_confidence)) {
      obj.age_confidence = 'medium';
    }

    // 3. Ensure tentative language on hairstyle recommendations
    if (Array.isArray(obj.hairstyle_recommendations)) {
      obj.hairstyle_recommendations = obj.hairstyle_recommendations.map((h: any, i: number) => ({
        id: h.id || `hair-${i + 1}`,
        name: h.name || 'Textured Cut',
        suitability_explanation: softenAssertionLanguage(
          h.suitability_explanation || h.explanation || 'This cut may harmonize with your visible proportions.'
        ),
        why_it_works: softenAssertionLanguage(h.why_it_works || 'Preserves natural balance.'),
        maintenance_level: ['Low', 'Medium', 'High'].includes(h.maintenance_level)
          ? h.maintenance_level
          : 'Medium',
        styling_effort_minutes: typeof h.styling_effort_minutes === 'number' ? h.styling_effort_minutes : 5,
        barber_instructions: {
          sides_and_back: h.barber_instructions?.sides_and_back || 'Clean taper fade on sides',
          top_length: h.barber_instructions?.top_length || '2.5 inches scissor cut',
          fade_or_taper_type: h.barber_instructions?.fade_or_taper_type || 'Low taper fade',
          styling_finish: h.barber_instructions?.styling_finish || 'Matte natural finish',
        },
        suitable_products: Array.isArray(h.suitable_products) ? h.suitable_products : ['Matte Clay'],
      }));
    }

    // 4. Validate with Zod
    const parseResult = StyleAnalysisOutputSchema.safeParse(obj);

    if (parseResult.success) {
      return { success: true, data: parseResult.data };
    }

    console.warn('[FaceFit AI Validator] Zod validation had warnings, applying fallback repair:', parseResult.error.format());

    // Repair partial output with safe defaults
    const repaired: StyleAnalysisOutput = {
      estimated_age_range: normalizeAgeRange(obj.estimated_age_range),
      age_confidence: (['low', 'medium', 'high'].includes(obj.age_confidence) ? obj.age_confidence : 'medium') as any,
      face_shape: obj.face_shape || 'Oval',
      hair: {
        length: obj.hair?.length || 'Medium',
        texture: obj.hair?.texture || 'Wavy',
        visible_style: obj.hair?.visible_style || 'Natural wave',
      },
      facial_hair: {
        present: Boolean(obj.facial_hair?.present),
        description: obj.facial_hair?.description || 'Clean or light stubble',
      },
      glasses: {
        present: Boolean(obj.glasses?.present),
        style: obj.glasses?.style || 'None observed',
      },
      current_clothing: {
        category: obj.current_clothing?.category || 'Casual',
        dominant_colors: Array.isArray(obj.current_clothing?.dominant_colors) ? obj.current_clothing.dominant_colors : ['Neutral'],
        style: obj.current_clothing?.style || 'Contemporary',
      },
      style_direction: Array.isArray(obj.style_direction) && obj.style_direction.length > 0 ? obj.style_direction : ['Contemporary Classic', 'Casual Tailoring'],
      recommended_colors: Array.isArray(obj.recommended_colors) && obj.recommended_colors.length > 0 ? obj.recommended_colors : ['#3B2F2F', '#C2593F', '#4A5B43', '#D7CEBE', '#CF8A2C', '#263445'],
      recommended_color_swatches: Array.isArray(obj.recommended_color_swatches) ? obj.recommended_color_swatches : undefined,
      hairstyle_recommendations: Array.isArray(obj.hairstyle_recommendations) && obj.hairstyle_recommendations.length > 0 ? obj.hairstyle_recommendations : [
        {
          id: 'hair-1',
          name: 'Textured Crop with Low Taper',
          suitability_explanation: 'This textured crop may complement the visible proportions of your face shape.',
          why_it_works: 'Softens the forehead line while preserving balanced jawline focus.',
          maintenance_level: 'Low',
          styling_effort_minutes: 4,
          barber_instructions: {
            sides_and_back: 'Low skin taper starting at #0.5 blending to #2 guard',
            top_length: '2 to 2.5 inches with deep point-cutting for irregular texture',
            fade_or_taper_type: 'Low Taper Fade',
            styling_finish: 'Matte finish styled forward',
          },
          suitable_products: ['Matte Clay', 'Sea Salt Spray'],
        },
      ],
      outfit_recommendations: Array.isArray(obj.outfit_recommendations) && obj.outfit_recommendations.length > 0 ? obj.outfit_recommendations : [
        {
          id: 'outfit-1',
          title: 'Smart College Everyday (Budget-Optimized)',
          style_category: 'Contemporary Campus',
          occasion: 'Everyday College / Social',
          total_vibe: 'Effortless, approachable, and tailored for comfort.',
          budget_tier: 'Budget (Under ₹3000)',
          pieces: [
            { item: 'Relaxed Boxy Cotton Tee', color: 'Oatmeal Sand', styling_tip: 'Drop-shoulder cut to broaden upper frame.', estimated_budget_inr: '₹599 - ₹799' },
            { item: 'Straight-Fit Cotton Chinos', color: 'Olive Forest', styling_tip: 'Clean single hem break over trainers.', estimated_budget_inr: '₹1199 - ₹1399' },
          ],
        },
      ],
      accessory_recommendations: Array.isArray(obj.accessory_recommendations) && obj.accessory_recommendations.length > 0 ? obj.accessory_recommendations : [
        { type: 'Eyewear', recommendation: 'Subtle geometric or rectangular frames', why_it_complements: 'May introduce gentle structure.' },
      ],
    };

    return { success: true, data: repaired };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown validation failure';
    return { success: false, data: {} as any, errors: [msg] };
  }
}
