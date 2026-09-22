import { z } from 'zod';

export type ConfidenceLevel = 'low' | 'medium' | 'high';

/**
 * OBSERVED TIER: What is directly visible in the image
 */
export const HairObservedSchema = z.object({
  length: z.string().default('Medium'),
  texture: z.string().default('Straight/Wavy'),
  visible_style: z.string().default('Natural flow'),
});

export const FacialHairObservedSchema = z.object({
  present: z.boolean().default(false),
  description: z.string().default('Clean shaven / minimal stubble'),
});

export const GlassesObservedSchema = z.object({
  present: z.boolean().default(false),
  style: z.string().default('None observed'),
});

export const CurrentClothingObservedSchema = z.object({
  category: z.string().default('Casual'),
  dominant_colors: z.array(z.string()).default(['Neutral']),
  style: z.string().default('Contemporary'),
});

export const ObservedFeaturesSchema = z.object({
  hair: HairObservedSchema,
  facial_hair: FacialHairObservedSchema,
  glasses: GlassesObservedSchema,
  current_clothing: CurrentClothingObservedSchema,
  accessories_visible: z.array(z.string()).default([]),
});

/**
 * INFERRED TIER: Reasonable styling inferences based on optical geometry and harmony
 */
export const InferredProportionsSchema = z.object({
  estimated_age_range: z.string().default('22-26'),
  age_confidence: z.enum(['low', 'medium', 'high']).default('medium'),
  age_disclaimer: z.string().default(
    'Approximate AI visual estimate for aesthetic and proportion matching only. Visual age does not define your actual age.'
  ),
  face_shape: z.string().default('Oval'),
  face_proportions_summary: z.string().default('Balanced facial proportions with gentle contour'),
  apparent_undertone: z.enum(['Warm', 'Cool', 'Neutral', 'Olive']).default('Warm'),
  contrast_level: z.string().default('Medium Contrast'),
});

/**
 * RECOMMENDED TIER: Tentative suggestions (never presented as objective truths)
 */
export const BarberInstructionsSchema = z.object({
  sides_and_back: z.string().default('Taper fade blended cleanly'),
  top_length: z.string().default('2.5 inches scissor textured'),
  fade_or_taper_type: z.string().default('Low taper fade'),
  styling_finish: z.string().default('Matte with natural volume'),
});

export const HairstyleRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  suitability_explanation: z.string(), // Phrased tentatively: "This hairstyle may complement..."
  why_it_works: z.string(),
  maintenance_level: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  styling_effort_minutes: z.number().default(5),
  barber_instructions: BarberInstructionsSchema,
  suitable_products: z.array(z.string()).default(['Matte Styling Clay']),
});

export const OutfitPieceSchema = z.object({
  item: z.string(),
  color: z.string(),
  styling_tip: z.string(),
  estimated_budget_inr: z.string().optional(),
});

export const OutfitRecommendationSchema = z.object({
  id: z.string(),
  title: z.string(),
  style_category: z.string(),
  occasion: z.string(),
  pieces: z.array(OutfitPieceSchema),
  total_vibe: z.string(),
  budget_tier: z.string().optional(),
});

export const AccessoryRecommendationSchema = z.object({
  type: z.string(),
  recommendation: z.string(),
  why_it_complements: z.string(),
});

export const RecommendedColorSwatchSchema = z.object({
  name: z.string(),
  hex: z.string(),
  role: z.string().default('neutral'),
  reason: z.string().default('Harmonizes with detected undertone'),
});

/**
 * COMPLETE STRUCTURED STYLE ANALYSIS SCHEMA
 * Directly matches the user's requested specification with top-level fields
 * while clearly delineating Observed vs Inferred vs Recommended.
 */
export const StyleAnalysisOutputSchema = z.object({
  // Inferred optical characteristics
  estimated_age_range: z.string(), // e.g. "18-22", "22-26"
  age_confidence: z.enum(['low', 'medium', 'high']),
  face_shape: z.string(),

  // Observed visible characteristics
  hair: HairObservedSchema,
  facial_hair: FacialHairObservedSchema,
  glasses: GlassesObservedSchema,
  current_clothing: CurrentClothingObservedSchema,

  // Recommendations (tentative phrasing)
  style_direction: z.array(z.string()),
  recommended_colors: z.array(z.string()), // Hex color strings or names
  recommended_color_swatches: z.array(RecommendedColorSwatchSchema).optional(),
  hairstyle_recommendations: z.array(HairstyleRecommendationSchema),
  outfit_recommendations: z.array(OutfitRecommendationSchema),
  accessory_recommendations: z.array(AccessoryRecommendationSchema),

  // Explicit architectural tier breakdown
  meta: z
    .object({
      observed: ObservedFeaturesSchema.optional(),
      inferred: InferredProportionsSchema.optional(),
      provider: z.string().optional(),
      timestamp: z.string().optional(),
    })
    .optional(),
});

export type StyleAnalysisOutput = z.infer<typeof StyleAnalysisOutputSchema>;
