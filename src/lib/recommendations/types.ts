export type ClothingStyleCategory =
  | 'Minimal'
  | 'Smart casual'
  | 'Streetwear'
  | 'Formal'
  | 'Casual'
  | 'Sporty'
  | 'Traditional/fusion';

export type HairstyleCategory =
  | 'Low maintenance'
  | 'Medium maintenance'
  | 'High styling'
  | 'Professional'
  | 'Casual'
  | 'Trendy'
  | 'Classic';

export type OccasionType =
  | 'College'
  | 'Internship'
  | 'Interview'
  | 'Presentation'
  | 'Date/social event'
  | 'Wedding/festival'
  | 'Everyday';

export type ClimateType =
  | 'Hot / Humid'
  | 'Mild / Temperate'
  | 'Cold / Winter'
  | 'Monsoon / Rainy';

export type BudgetTier =
  | 'Budget (Under ₹3000)'
  | 'Mid-range (₹3000-₹6000)'
  | 'Premium';

export interface UserStylePreferences {
  preferredStyles: ClothingStyleCategory[];
  preferredColors: string[];
  budgetTier: BudgetTier;
  maxBudgetINR: number;
  hairMaintenance: 'Low maintenance' | 'Medium maintenance' | 'High styling';
  hairCategories: HairstyleCategory[];
  primaryOccasion: OccasionType;
  climate: ClimateType;
  ownedWardrobe: string[]; // e.g., ["Plain white tee", "Dark indigo denim", "White leather sneakers"]
  dislikedStyles: string[]; // e.g., ["Skinny jeans", "Loud graphic prints", "High skin fade"]
}

export interface RecommendationMatch {
  score: number; // 0 to 100
  rationale: string; // "Recommended because you selected low-maintenance styles and this option requires minimal daily styling."
  matchTags: string[]; // ["Low Maintenance", "Matches Budget < ₹3000", "Uses Owned Sneakers"]
  breakdown: {
    featuresScore: number;
    preferencesScore: number;
    occasionScore: number;
    budgetScore: number;
    climateScore: number;
  };
}
