import { IVisionProvider, VisionAnalysisRequest } from '../types';
import { StyleAnalysisOutput } from '../schema';
import { normalizeAgeRange } from '../validator';

export class MockVisionProvider implements IVisionProvider {
  readonly name = 'FaceFit Optical Simulator (Offline/Mock)';

  async analyzePortrait(_request: VisionAnalysisRequest): Promise<StyleAnalysisOutput> {
    // Simulate brief processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const ageHint = _request.userPreferences?.ageHint;
    const estimatedAgeRange = ageHint ? normalizeAgeRange(ageHint) : '17-20';

    return {
      estimated_age_range: estimatedAgeRange,
      age_confidence: 'high',
      face_shape: 'Oval',
      hair: {
        length: 'Short',
        texture: 'Wavy',
        visible_style: 'Natural textured wave with temple density',
      },
      facial_hair: {
        present: true,
        description: 'Short 2-3mm clean stubble along the jawline',
      },
      glasses: {
        present: false,
        style: 'None observed',
      },
      current_clothing: {
        category: 'Casual',
        dominant_colors: ['Heather Grey', 'Charcoal'],
        style: 'Modern Crewneck',
      },
      style_direction: [
        'Contemporary Smart Casual',
        'Minimalist Earth Tones',
        'Modern Campus Tailoring',
      ],
      recommended_colors: [
        '#3B2F2F',
        '#C2593F',
        '#4A5B43',
        '#D7CEBE',
        '#CF8A2C',
        '#263445',
      ],
      recommended_color_swatches: [
        {
          name: 'Espresso Bronze',
          hex: '#3B2F2F',
          role: 'neutral',
          reason: 'Grounded dark neutral alternative to harsh solid black',
        },
        {
          name: 'Warm Terracotta',
          hex: '#C2593F',
          role: 'accent',
          reason: 'Adds vibrant natural warmth without overwhelming skin tone',
        },
        {
          name: 'Olive Forest',
          hex: '#4A5B43',
          role: 'primary',
          reason: 'Compliments warm undertones for effortless overshirts and jackets',
        },
        {
          name: 'Oatmeal Sand',
          hex: '#D7CEBE',
          role: 'neutral',
          reason: 'Clean soft neutral for linen tees and knitwear',
        },
        {
          name: 'Deep Mustard Amber',
          hex: '#CF8A2C',
          role: 'accent',
          reason: 'Striking accent tone for accessories and layered accents',
        },
        {
          name: 'Rich Navy Slate',
          hex: '#263445',
          role: 'primary',
          reason: 'Refined structured base for trousers and blazers',
        },
      ],
      hairstyle_recommendations: [
        {
          id: 'hair-1',
          name: 'Textured Crop with Low Taper',
          suitability_explanation:
            'This textured crop may complement the visible proportions of an oval face shape by introducing controlled top texture without exaggerating width.',
          why_it_works:
            'Preserves vertical balance while sharpening jawline definition.',
          maintenance_level: 'Low',
          styling_effort_minutes: 4,
          barber_instructions: {
            sides_and_back:
              'Low taper fade starting from #0.5 at baseline, blending into a #2 guard at the parietal ridge.',
            top_length:
              'Scissor cut to 2 to 2.5 inches with deep point-cutting for irregular texture.',
            fade_or_taper_type: 'Low Taper Fade with natural neck taper',
            styling_finish: 'Matte, finger-styled forward with slight fringe lift',
          },
          suitable_products: ['Matte Styling Clay', 'Sea Salt Texture Spray'],
        },
        {
          id: 'hair-2',
          name: 'Soft Side-Part Modern Quiff',
          suitability_explanation:
            'This soft side-part may enhance presence for collegiate presentations and formal events while respecting natural wave flow.',
          why_it_works:
            'Adds structured height that complements balanced cheekbone geometry.',
          maintenance_level: 'Medium',
          styling_effort_minutes: 8,
          barber_instructions: {
            sides_and_back:
              '#3 guard blended into scissor-over-comb near the crown; preserve clean corners.',
            top_length:
              '3.5 to 4 inches at the front fringe, tapering down to 3 inches at vertex.',
            fade_or_taper_type: 'Subtle scissor taper with clean temple line',
            styling_finish: 'Natural low-shine finish with soft sweep',
          },
          suitable_products: ['Lightweight Styling Cream', 'Vented Brush'],
        },
        {
          id: 'hair-3',
          name: 'Relaxed Wavy Fringe (Effortless Flow)',
          suitability_explanation:
            'This relaxed fringe may soften facial angles by leaning directly into your natural wave pattern.',
          why_it_works:
            'Requires minimal daily heat intervention while offering versatile casual styling.',
          maintenance_level: 'Low',
          styling_effort_minutes: 3,
          barber_instructions: {
            sides_and_back:
              'Scissor cut only; preserve natural wave contour without clipping too tight.',
            top_length: '3 inches, layered to remove bulk without thinning ends.',
            fade_or_taper_type: 'Natural Scissor Taper',
            styling_finish: 'Air-dry with curl enhancer',
          },
          suitable_products: ['Leave-in Curl Conditioner', 'Argan Oil Drops'],
        },
      ],
      outfit_recommendations: [
        {
          id: 'outfit-college-budget',
          title: 'Smart College Everyday (Budget-Optimized)',
          style_category: 'Contemporary Campus',
          occasion: 'Everyday College / Social',
          budget_tier: 'Budget (Under ₹3000)',
          total_vibe:
            'Effortless, approachable, and tailored without looking overly formal.',
          pieces: [
            {
              item: 'Relaxed Boxy Cotton Tee (Thick collar band)',
              color: 'Oatmeal / Chalk Sand',
              styling_tip: 'Tuck loosely in front or wear straight hemmed.',
              estimated_budget_inr: '₹499 - ₹799',
            },
            {
              item: 'Straight-Fit Chino or Dark Denim',
              color: 'Olive Green or Raw Indigo',
              styling_tip: 'Single pinroll cuff if wearing low retro sneakers.',
              estimated_budget_inr: '₹999 - ₹1299',
            },
            {
              item: 'Layer: Light Cotton Utility Overshirt (Open)',
              color: 'Deep Espresso or Slate',
              styling_tip: 'Roll sleeves to forearm to reveal wrist accents.',
              estimated_budget_inr: '₹899 - ₹1199',
            },
          ],
        },
        {
          id: 'outfit-presentation',
          title: 'Executive Campus Presentation',
          style_category: 'Smart Formal Tailoring',
          occasion: 'Project Presentation / Formal Placement',
          budget_tier: 'Mid-range (₹3000-₹6000)',
          total_vibe: 'Authoritative, sharp, structured, and confident.',
          pieces: [
            {
              item: 'Tailored Knit Polo or Oxford Shirt',
              color: 'Crisp Cream / Slate Navy',
              styling_tip: 'Structured collar neatly frames the jawline.',
              estimated_budget_inr: '₹1199 - ₹1699',
            },
            {
              item: 'Single-Pleat Tailored Ankle Trousers',
              color: 'Charcoal / Espresso Bronze',
              styling_tip: 'Ensure hem sits cleanly above shoes without break.',
              estimated_budget_inr: '₹1499 - ₹2199',
            },
          ],
        },
      ],
      accessory_recommendations: [
        {
          type: 'Eyewear / Sunglasses',
          recommendation:
            'Angular Wayfarer or Subtle Geometric Frames in Havana Tortoise',
          why_it_complements:
            'May provide gentle structure against curved cheekbone contours.',
        },
        {
          type: 'Wristwear / Watch',
          recommendation:
            '38–40mm Minimalist Dial with Tan Leather or Canvas Strap',
          why_it_complements:
            'Proportionate case diameter that complements daily casual wear.',
        },
      ],
    };
  }
}
