import { UserStylePreferences, RecommendationMatch } from './types';
import { CatalogHairstyle, CatalogOutfit, CATALOG_HAIRSTYLES, CATALOG_OUTFITS } from './catalog';
import { FaceGeometry, HairAnalysis } from '../types';

export interface ScoredHairstyle {
  hair: CatalogHairstyle;
  match: RecommendationMatch;
}

export interface ScoredOutfit {
  outfit: CatalogOutfit;
  match: RecommendationMatch;
  finalCostWithOwnedINR: number;
  ownedPiecesUsed: string[];
}

/**
 * Evaluates and scores a Hairstyle based on:
 * - Visible face shape compatibility
 * - User maintenance preference (Low / Medium / High)
 * - Preferred hairstyle categories (Classic, Trendy, Professional, etc.)
 * - Disliked styles (e.g., if user dislikes "High skin fade")
 */
export function scoreHairstyle(
  hair: CatalogHairstyle,
  faceGeometry: FaceGeometry,
  preferences: UserStylePreferences
): ScoredHairstyle {
  let score = 50;
  const reasons: string[] = [];
  const tags: string[] = [];

  // 1. Maintenance Match (Weight: 30 pts)
  if (preferences.hairMaintenance === 'Low maintenance') {
    if (hair.maintenanceLevel === 'Low') {
      score += 30;
      reasons.push(`Selected because you preferred low-maintenance grooming, requiring ~${hair.stylingEffortMinutes} mins daily.`);
      tags.push('Low Maintenance (~3m)');
    } else if (hair.maintenanceLevel === 'Medium') {
      score += 10;
    } else {
      score -= 25; // Heavily penalize high styling when user asked for low maintenance
    }
  } else if (preferences.hairMaintenance === 'High styling') {
    if (hair.maintenanceLevel === 'High' || hair.tags.includes('Professional')) {
      score += 30;
      reasons.push('Matches your preference for structured, elevated styling.');
      tags.push('High Styling Polish');
    } else {
      score += 10;
    }
  } else {
    // Medium maintenance
    if (hair.maintenanceLevel === 'Medium') {
      score += 30;
      reasons.push('Balanced daily maintenance (~5-7 mins) matching your preference.');
      tags.push('Balanced Effort');
    } else {
      score += 15;
    }
  }

  // 2. Visible Face Shape Compatibility (Weight: 25 pts)
  const userShape = faceGeometry?.shape || 'Oval';
  if (hair.suitableFaceShapes.some((s) => s.toLowerCase() === userShape.toLowerCase())) {
    score += 25;
    reasons.push(`May complement the visible proportions of your ${userShape} face shape.`);
    tags.push(`${userShape} Balance`);
  } else {
    score += 10;
  }

  // 3. User Preferred Hair Category Match (Weight: 20 pts)
  const categoryMatch = preferences.hairCategories.some(
    (c) => hair.category === c || hair.tags.includes(c)
  );
  if (categoryMatch) {
    score += 20;
    tags.push(hair.category);
  }

  // 4. Disliked Styles Penalty (Safety / Dislike check)
  for (const disliked of preferences.dislikedStyles) {
    const dLower = disliked.toLowerCase();
    if (
      hair.name.toLowerCase().includes(dLower) ||
      hair.barberInstructions.fadeOrTaperType.toLowerCase().includes(dLower) ||
      hair.tags.some((t) => t.toLowerCase().includes(dLower))
    ) {
      score -= 40;
    }
  }

  // Clamp score between 20 and 99
  const finalScore = Math.min(99, Math.max(25, score));
  const primaryRationale = reasons.length > 0 ? reasons.join(' ') : `Harmonizes with ${userShape} proportions.`;

  return {
    hair,
    match: {
      score: finalScore,
      rationale: primaryRationale,
      matchTags: tags.slice(0, 3),
      breakdown: {
        featuresScore: 25,
        preferencesScore: 30,
        occasionScore: 20,
        budgetScore: 10,
        climateScore: 15,
      },
    },
  };
}

/**
 * Evaluates and scores an Outfit based on:
 * - Style preference (Minimal, Smart casual, Streetwear, etc.)
 * - Occasion (College, Internship, Presentation, etc.)
 * - Budget limit & owned wardrobe piece substitutions
 * - Climate (Hot/Humid, Cold, Rainy)
 * - User dislikes
 */
export function scoreOutfit(
  outfit: CatalogOutfit,
  preferences: UserStylePreferences
): ScoredOutfit {
  let score = 40;
  const reasons: string[] = [];
  const tags: string[] = [];
  const ownedUsed: string[] = [];
  let effectiveCost = outfit.estimatedCostINR;

  // 1. Style Preference Match (Weight: 25 pts)
  if (preferences.preferredStyles.includes(outfit.styleCategory)) {
    score += 25;
    reasons.push(`Aligned with your preferred ${outfit.styleCategory} aesthetic.`);
    tags.push(outfit.styleCategory);
  } else if (preferences.preferredStyles.includes('Casual') && outfit.styleCategory === 'Smart casual') {
    score += 15;
  }

  // 2. Occasion Match (Weight: 25 pts)
  if (outfit.primaryOccasion === preferences.primaryOccasion) {
    score += 25;
    reasons.push(`Formulated specifically for ${preferences.primaryOccasion}.`);
    tags.push(`${preferences.primaryOccasion} Ready`);
  } else if (
    (preferences.primaryOccasion === 'College' && outfit.primaryOccasion === 'Everyday') ||
    (preferences.primaryOccasion === 'Interview' && outfit.primaryOccasion === 'Presentation')
  ) {
    score += 15;
  }

  // 3. Climate Compatibility (Weight: 15 pts)
  if (outfit.compatibleClimates.includes(preferences.climate)) {
    score += 15;
    reasons.push(`Selected for ${preferences.climate} climate with appropriate breathability and fabric weights.`);
    tags.push(preferences.climate.split(' ')[0]);
  }

  // 4. Budget & Owned Wardrobe Savings (Weight: 20 pts)
  for (const piece of outfit.pieces) {
    if (piece.canBeSubstitutedByOwned) {
      const isOwned = preferences.ownedWardrobe.some(
        (o) => o.toLowerCase().includes(piece.canBeSubstitutedByOwned!.toLowerCase())
      );
      if (isOwned) {
        ownedUsed.push(piece.canBeSubstitutedByOwned);
        effectiveCost -= 600; // Estimated savings from already owning this piece
      }
    }
  }

  if (effectiveCost <= preferences.maxBudgetINR) {
    score += 20;
    if (ownedUsed.length > 0) {
      reasons.push(`Utilizes your owned ${ownedUsed[0]} to stay well under ₹${preferences.maxBudgetINR}.`);
      tags.push(`Saves ~₹${ownedUsed.length * 600} (Uses Owned Items)`);
    } else {
      reasons.push(`Fits within your designated budget of under ₹${preferences.maxBudgetINR}.`);
      tags.push(outfit.budgetTier);
    }
  } else {
    score -= 15; // Exceeds budget
  }

  // 5. Dislikes Penalty
  for (const disliked of preferences.dislikedStyles) {
    const dLower = disliked.toLowerCase();
    if (
      outfit.title.toLowerCase().includes(dLower) ||
      outfit.styleCategory.toLowerCase().includes(dLower) ||
      outfit.tags.some((t) => t.toLowerCase().includes(dLower))
    ) {
      score -= 50;
    }
  }

  const finalScore = Math.min(99, Math.max(20, score));
  const primaryRationale = reasons.length > 0 ? reasons.join(' ') : 'Curated for optical balance and versatile wear.';

  return {
    outfit,
    match: {
      score: finalScore,
      rationale: primaryRationale,
      matchTags: tags.slice(0, 3),
      breakdown: {
        featuresScore: 20,
        preferencesScore: 25,
        occasionScore: 25,
        budgetScore: 20,
        climateScore: 10,
      },
    },
    finalCostWithOwnedINR: Math.max(0, effectiveCost),
    ownedPiecesUsed: ownedUsed,
  };
}

/**
 * Retrieves and ranks catalog hairstyles based on visible face features and user preferences
 */
export function getRankedHairstyles(
  faceGeometry: FaceGeometry,
  preferences: UserStylePreferences
): ScoredHairstyle[] {
  const scored = CATALOG_HAIRSTYLES.map((hair) => scoreHairstyle(hair, faceGeometry, preferences));
  return scored.sort((a, b) => b.match.score - a.match.score);
}

/**
 * Retrieves and ranks catalog outfits based on user preferences, occasions, climate, and owned wardrobe
 */
export function getRankedOutfits(
  preferences: UserStylePreferences
): ScoredOutfit[] {
  const scored = CATALOG_OUTFITS.map((outfit) => scoreOutfit(outfit, preferences));
  return scored.sort((a, b) => b.match.score - a.match.score);
}
