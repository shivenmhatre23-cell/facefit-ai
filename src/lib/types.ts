export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface AgeEstimate {
  range: string; // e.g., "22 - 27"
  confidence: ConfidenceLevel;
  disclaimer: string; // e.g., "Approximate AI visual estimate for aesthetic and proportion matching only."
}

export interface FaceGeometry {
  shape: 'Oval' | 'Square' | 'Round' | 'Oblong' | 'Diamond' | 'Heart' | 'Triangle' | string;
  confidence: ConfidenceLevel;
  proportionsSummary: string; // e.g., "Balanced cheekbone-to-jawline ratio with slightly angular jaw definition"
  featuresNotes: string[];
}

export interface HairAnalysis {
  length: 'Buzz / Very Short' | 'Short' | 'Medium' | 'Medium-Long' | 'Long';
  texture: 'Straight' | 'Wavy' | 'Curly' | 'Coily' | string;
  volume: 'Fine' | 'Medium' | 'Dense' | string;
  currentStyle: string;
  hairlineNotes?: string;
}

export interface FacialHairAnalysis {
  present: boolean;
  type: 'Clean Shaven' | 'Stubble' | 'Short Beard' | 'Full Beard' | 'Goatee' | 'Mustache' | 'None';
  density?: string;
  recommendation: string;
}

export interface ObservationData {
  glassesPresent: boolean;
  glassesDescription?: string;
  accessoriesObserved: string[];
  currentClothingObservation: string;
  apparentUndertone: 'Warm' | 'Cool' | 'Neutral' | 'Olive';
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent' | 'neutral';
  explanation: string;
}

export interface ColorPalette {
  seasonName: string; // e.g. "Deep Autumn", "Cool Summer", "Rich Warm Neutral"
  description: string;
  contrastLevel: 'High Contrast' | 'Medium Contrast' | 'Soft / Low Contrast';
  swatches: ColorSwatch[];
  colorsToWear: string[];
  colorsToAvoid: string[];
  metalsRecommended: string[]; // e.g., ["Brushed Silver", "Gunmetal"]
}

export interface HairstyleRecommendation {
  id: string;
  name: string;
  explanation: string;
  whyItWorks: string;
  maintenanceLevel: 'Low' | 'Medium' | 'High';
  stylingEffortMinutes: number; // e.g. 5-10
  suitableProducts: string[]; // e.g. "Matte Clay", "Sea Salt Spray"
  barberInstructions: {
    sidesAndBack: string; // e.g., "Taper fade #2 down to #0.5 around the ears"
    topLength: string;    // e.g., "Scissor cut 2.5 inches, textured point-cut"
    fadeOrTaperType: string;
    stylingFinish: string; // e.g., "Matte, pushed back with natural volume"
  };
  visualPreviewUrl?: string; // Generated preview image
}

export interface ClothingRecommendation {
  category: 'Top' | 'Bottom' | 'Outerwear' | 'Footwear';
  clothingType: string; // e.g., "Camp-collar Linen Shirt", "Tailored Pleated Trousers"
  suggestedColors: string[];
  fitGuidance: string; // e.g., "Relaxed structured shoulder with slight drape to balance broad jawline"
  aesthetic: string; // e.g., "Smart Casual", "Old Money Minimalist"
  occasion: string; // e.g., "College Everyday", "Work Presentation"
}

export interface OutfitPiece {
  item: string;
  color: string;
  stylingTip: string;
  estimatedBudgetINR?: string; // e.g. "₹800 - ₹1200"
}

export interface OutfitCombination {
  id: string;
  title: string;
  aesthetic: string;
  occasion: string;
  pieces: OutfitPiece[];
  totalVibe: string;
  budgetTier?: 'Budget (Under ₹3000)' | 'Mid-range (₹3000-₹6000)' | 'Premium';
  visualPreviewUrl?: string;
}

export interface AccessoryRecommendation {
  type: string; // e.g., "Eyewear", "Watch", "Jewelry", "Headwear"
  recommendation: string;
  whyItComplements: string;
}

export interface GroomingSuggestion {
  category: 'Skincare' | 'Beard/Shave' | 'Hair Care' | 'Fragrance Profile';
  tip: string;
  frequency: string;
}

export interface StyleProfile {
  id: string;
  timestamp: string;
  estimatedAge: AgeEstimate;
  faceGeometry: FaceGeometry;
  hairAnalysis: HairAnalysis;
  facialHairAnalysis: FacialHairAnalysis;
  observations: ObservationData;
  colorPalette: ColorPalette;
  suggestedAesthetics: string[];
  hairstyles: HairstyleRecommendation[];
  clothingRecommendations: ClothingRecommendation[];
  outfitCombinations: OutfitCombination[];
  accessories: AccessoryRecommendation[];
  grooming: GroomingSuggestion[];
  userSelfiePreviewUrl?: string; // Client-only ephemeral blob url for UI
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}

// -------------------------------------------------------------
// ADVANCED CAPABILITIES CONTRACTS
// -------------------------------------------------------------

/** 1. Personal Style Quiz */
export interface StyleQuizAnswers {
  preferredStyle: 'Minimal' | 'Streetwear' | 'Smart Casual' | 'Classic' | 'Sporty' | 'Formal' | 'Traditional/Fusion' | 'Experimental';
  hairStylingTime: 'Almost none' | '5 minutes' | '10–15 minutes' | '15+ minutes';
  clothingBudget: 'Budget' | 'Moderate' | 'Premium';
  primaryOccasions: string[]; // e.g. ["College", "Interview", "Everyday"]
  preferredColors: string[]; // e.g. ["Navy", "White", "Olive", "Black"]
  dislikedStyles: string[]; // e.g. ["Skinny jeans", "Loud logos", "High skin fades"]
  completedAt?: string;
}

/** 2. Style DNA Profile */
export interface StyleDnaBreakdown {
  minimal: number;       // e.g. 82%
  smartCasual: number;   // e.g. 71%
  streetwear: number;    // e.g. 48%
  classic: number;       // e.g. 63%
  traditionalFusion?: number;
}

export interface StyleDnaProfile {
  breakdown: StyleDnaBreakdown;
  signatureStyle: string;
  preferredColors: string[];
  recommendedFits: string[];
  preferredHairMaintenance: string;
  commonOccasions: string[];
  styleKeywords: string[];
  statement: string;
}

/** 3. My Wardrobe Mode */
export type WardrobeCategory = 'T-shirts' | 'Shirts' | 'Pants' | 'Jeans' | 'Jackets' | 'Shoes' | 'Accessories' | 'Ethnic / Traditional';

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  color: string;
  patternOrTexture?: string;
  imageUrl?: string;
  addedAt: string;
  isFavorite?: boolean;
}

/** 4. Look Builder ("Build My Look") */
export interface CustomLookPiece {
  category: 'Hair' | 'Top' | 'Bottom' | 'Shoes' | 'Accessories';
  name: string;
  color: string;
  details?: string;
}

export interface CustomLook {
  id: string;
  name: string;
  hair: { style: string; length: string; maintenance: string };
  top: { item: string; color: string; fit: string };
  bottom: { item: string; color: string; fit: string };
  shoes: { item: string; color: string };
  accessory: { item: string; color: string };
  dominantColors: string[];
  previewUrl?: string;
  createdAt: string;
  occasion?: string;
}

/** 5. AI Stylist Memory */
export interface StylistMemory {
  preferredStyles: string[];
  dislikedStyles: string[];
  preferredColors: string[];
  budgetTier: string;
  hairMaintenanceTolerance: string;
  learnedNotes: string[];
  wardrobePieceCount: number;
  lastUpdated: string;
}

/** 6. Style History Item */
export interface StyleHistoryItem {
  id: string;
  title: string;
  type: 'profile_creation' | 'look_generation' | 'barber_consultation' | 'wardrobe_synthesis' | 'quiz_completion';
  timestamp: string;
  dateFormatted: string; // e.g., "September 24"
  summary: string;
  tags: string[];
}

/** 7. Look Preview ("Try This Look") */
export interface LookPreviewRequest {
  type: 'hairstyle' | 'outfit' | 'complete_look';
  targetName: string;
  targetDetails: {
    color?: string;
    style?: string;
    barberNotes?: string;
    pieces?: { item: string; color: string }[];
    hairColor?: string;
    garmentColor?: string;
    verticalOffset?: number;
    scale?: number;
    [key: string]: any;
  };
  baseImage?: string; // base64 or ephemeral preview
}

export interface LookPreviewResult {
  previewUrl: string;
  originalUrl?: string;
  isAiGeneratedNotice: string;
  styleNotes: string[];
  disclaimer: string;
}

/** 8. Occasion Stylist Plan */
export type OccasionType =
  | 'College'
  | 'Interview'
  | 'Internship'
  | 'Presentation'
  | 'Wedding'
  | 'Festival'
  | 'Party'
  | 'Everyday'
  | 'Travel'
  | 'Formal Event';

export interface OccasionRecommendation {
  occasion: OccasionType;
  title: string;
  hairstyle: {
    name: string;
    stylingTip: string;
    maintenance: string;
  };
  outfit: {
    top: string;
    bottom: string;
    shoes: string;
    layer?: string;
  };
  colors: string[];
  accessories: string[];
  groomingSuggestions: string[];
  reasoning: string;
}

/** 9. Budget Stylist Plan */
export interface BudgetItemEstimate {
  item: string;
  estimatedPriceINR: number;
  isPriority: boolean;
  notes: string;
}

export interface BudgetStylistPlan {
  budgetLimitINR: number;
  estimatedTotalINR: number;
  outfitTitle: string;
  aesthetic: string;
  items: BudgetItemEstimate[];
  optionalUpgrades: {
    item: string;
    priceINR: number;
    upgradeReason: string;
  }[];
  priceNotice: string;
}

/** 10. Style Comparison */
export interface StyleComparisonCandidate {
  id: string;
  name: string;
  category: string;
  maintenanceLevel: string;
  stylingEffort: string;
  suitableOccasions: string[];
  whyItMayWork: string;
  potentialDrawbacks: string;
  tags: string[];
}

/** 11. Unified Saved Look Record */
export interface SavedLookRecord {
  id: string;
  name: string;
  type: 'hairstyle' | 'outfit' | 'complete_look' | 'preview';
  previewUrl?: string;
  occasion: string;
  style: string;
  colors: string[];
  dateSaved: string;
  details: Record<string, any>;
}
