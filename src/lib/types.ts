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
