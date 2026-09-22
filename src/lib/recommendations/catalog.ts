import { HairstyleCategory, ClothingStyleCategory, OccasionType, ClimateType } from './types';

export interface CatalogHairstyle {
  id: string;
  name: string;
  category: HairstyleCategory;
  suitableFaceShapes: string[];
  maintenanceLevel: 'Low' | 'Medium' | 'High';
  stylingEffortMinutes: number;
  baseExplanation: string;
  whyItWorksBase: string;
  barberInstructions: {
    sidesAndBack: string;
    topLength: string;
    fadeOrTaperType: string;
    stylingFinish: string;
  };
  suitableProducts: string[];
  tags: string[];
}

export interface CatalogOutfit {
  id: string;
  title: string;
  styleCategory: ClothingStyleCategory;
  primaryOccasion: OccasionType;
  compatibleClimates: ClimateType[];
  budgetTier: 'Budget (Under ₹3000)' | 'Mid-range (₹3000-₹6000)' | 'Premium';
  estimatedCostINR: number;
  totalVibe: string;
  pieces: {
    item: string;
    color: string;
    stylingTip: string;
    estimatedBudgetINR: string;
    canBeSubstitutedByOwned?: string;
  }[];
  tags: string[];
}

export const CATALOG_HAIRSTYLES: CatalogHairstyle[] = [
  {
    id: 'hair-crop-low',
    name: 'Textured European Crop with Low Taper',
    category: 'Low maintenance',
    suitableFaceShapes: ['Oval', 'Round', 'Square', 'Heart', 'Diamond'],
    maintenanceLevel: 'Low',
    stylingEffortMinutes: 3,
    baseExplanation: 'Forward texture on top with a clean low taper around the ears and neckline.',
    whyItWorksBase: 'Minimizes horizontal width while providing effortless natural separation.',
    barberInstructions: {
      sidesAndBack: 'Low skin taper blending from #0.5 up to #2 at the parietal ridge.',
      topLength: '2 to 2.5 inches scissor cut with deep point-cutting for texture.',
      fadeOrTaperType: 'Low Taper Fade with natural neckline taper',
      stylingFinish: 'Matte natural finish pushed forward',
    },
    suitableProducts: ['Matte Styling Clay', 'Sea Salt Texture Spray'],
    tags: ['Low maintenance', 'Casual', 'Trendy'],
  },
  {
    id: 'hair-buzz-low',
    name: 'Textured Heavy Buzz with Temple Taper',
    category: 'Low maintenance',
    suitableFaceShapes: ['Square', 'Oval', 'Diamond'],
    maintenanceLevel: 'Low',
    stylingEffortMinutes: 1,
    baseExplanation: 'A modern uniform cut with subtle density on top and crisp temple tapers.',
    whyItWorksBase: 'Accentuates masculine jawline geometry with practically zero daily effort.',
    barberInstructions: {
      sidesAndBack: '#1.5 guard tapered cleanly at temples and nape.',
      topLength: '#4 guard (approx. 0.5 inches) with rounded hairline shaping.',
      fadeOrTaperType: 'Temple Taper',
      stylingFinish: 'Natural dry / no product required',
    },
    suitableProducts: ['Light Argan Hair Oil'],
    tags: ['Low maintenance', 'Sporty', 'Classic'],
  },
  {
    id: 'hair-quiff-med',
    name: 'Modern Soft Quiff with Scissor Taper',
    category: 'Medium maintenance',
    suitableFaceShapes: ['Round', 'Oval', 'Square', 'Oblong'],
    maintenanceLevel: 'Medium',
    stylingEffortMinutes: 7,
    baseExplanation: 'Gently brushed back with lift at the front fringe and scissor-tapered sides.',
    whyItWorksBase: 'Adds vertical height and structured elegance for collegiate and formal settings.',
    barberInstructions: {
      sidesAndBack: '#3 guard blended into scissor-over-comb near the crown.',
      topLength: '3.5 inches at front fringe tapering to 2.5 inches at vertex.',
      fadeOrTaperType: 'Scissor Taper with clean ear outline',
      stylingFinish: 'Natural low-sheen sweep with soft volume',
    },
    suitableProducts: ['Volumizing Sea Salt Spray', 'Light Styling Cream'],
    tags: ['Medium maintenance', 'Professional', 'Classic'],
  },
  {
    id: 'hair-flow-med',
    name: 'Relaxed Mid-Length Wavy Flow',
    category: 'Casual',
    suitableFaceShapes: ['Oval', 'Square', 'Heart', 'Diamond'],
    maintenanceLevel: 'Medium',
    stylingEffortMinutes: 5,
    baseExplanation: 'Embraces natural wave texture with loose movement framing the temples.',
    whyItWorksBase: 'Softens sharper facial features and jaw angles with relaxed organic flow.',
    barberInstructions: {
      sidesAndBack: 'All scissor cut; preserve natural taper without clippers.',
      topLength: '3.5 to 4 inches layered to remove weight while keeping curl clump.',
      fadeOrTaperType: 'Natural Scissor Taper',
      stylingFinish: 'Towel-dried with leave-in curl cream',
    },
    suitableProducts: ['Leave-in Curl Conditioner', 'Matte Paste'],
    tags: ['Casual', 'Medium maintenance', 'Trendy'],
  },
  {
    id: 'hair-pompadour-high',
    name: 'Executive Side-Part Pompadour',
    category: 'High styling',
    suitableFaceShapes: ['Oval', 'Round', 'Square'],
    maintenanceLevel: 'High',
    stylingEffortMinutes: 12,
    baseExplanation: 'Structured high-volume pompadour with a sharp side transition.',
    whyItWorksBase: 'Delivers a commanding presence for interviews, weddings, and executive presentations.',
    barberInstructions: {
      sidesAndBack: 'Mid drop fade starting at #1 guard cleanly faded up to #3.',
      topLength: '4 to 5 inches cut with graduated elevation for backwards comb.',
      fadeOrTaperType: 'Mid Drop Fade with hard part line (optional)',
      stylingFinish: 'High-hold styling pomade dried with blow-dryer and round brush',
    },
    suitableProducts: ['Water-Based High Hold Pomade', 'Blowdryer & Round Brush'],
    tags: ['High styling', 'Professional', 'Classic'],
  },
  {
    id: 'hair-curtain-trend',
    name: 'Modern Textured Middle-Part / Curtains',
    category: 'Trendy',
    suitableFaceShapes: ['Oval', 'Heart', 'Diamond', 'Oblong'],
    maintenanceLevel: 'Medium',
    stylingEffortMinutes: 6,
    baseExplanation: '90s-inspired relaxed center or off-center parting with wispy temple drape.',
    whyItWorksBase: 'Complements symmetrical cheekbone structure with contemporary youth appeal.',
    barberInstructions: {
      sidesAndBack: 'Low taper fade or soft scissor taper preserving temple length.',
      topLength: '4 inches layered evenly with textured ends to fall naturally left and right.',
      fadeOrTaperType: 'Low Taper Fade',
      stylingFinish: 'Air-dry or diffuser dry with texture spray',
    },
    suitableProducts: ['Texture Powder', 'Sea Salt Spray'],
    tags: ['Trendy', 'Casual', 'Medium maintenance'],
  },
  {
    id: 'hair-sidepart-classic',
    name: 'Gentleman\'s Classic Tapered Side-Part',
    category: 'Classic',
    suitableFaceShapes: ['Oval', 'Square', 'Round', 'Oblong', 'Heart'],
    maintenanceLevel: 'Low',
    stylingEffortMinutes: 4,
    baseExplanation: 'A timeless Ivy League cut with neat side part and graduated perimeter.',
    whyItWorksBase: 'Universally accepted professional aesthetic that never looks out of place.',
    barberInstructions: {
      sidesAndBack: '#2 guard tapered down to #1 at neckline with clean squared nape.',
      topLength: '2.5 to 3 inches with subtle left-to-right length graduation.',
      fadeOrTaperType: 'Classic Barber Taper',
      stylingFinish: 'Neat comb-through with light water-based cream',
    },
    suitableProducts: ['Classic Grooming Cream', 'Pocket Comb'],
    tags: ['Classic', 'Professional', 'Low maintenance'],
  },
];

export const CATALOG_OUTFITS: CatalogOutfit[] = [
  {
    id: 'outfit-college-minimal-budget',
    title: 'Minimalist Campus Everyday',
    styleCategory: 'Minimal',
    primaryOccasion: 'College',
    compatibleClimates: ['Hot / Humid', 'Mild / Temperate', 'Monsoon / Rainy'],
    budgetTier: 'Budget (Under ₹3000)',
    estimatedCostINR: 2399,
    totalVibe: 'Clean, understated, and breathable for long hours across campus.',
    pieces: [
      {
        item: 'Heavyweight Boxy Cotton Tee (Ribbed Collar)',
        color: 'Oatmeal Sand / Off-White',
        stylingTip: 'Loose casual tuck in front; clean sleeve drape.',
        estimatedBudgetINR: '₹599 - ₹799',
        canBeSubstitutedByOwned: 'Plain white tee',
      },
      {
        item: 'Relaxed Straight-Fit Cotton Chinos',
        color: 'Forest Olive or Dark Taupe',
        stylingTip: 'Clean single roll at hem ending above sneaker vamp.',
        estimatedBudgetINR: '₹1099 - ₹1299',
      },
      {
        item: 'Minimalist Retro Gumsole Lows',
        color: 'Chalk White / Raw Gum',
        stylingTip: 'Keep clean with matte finish.',
        estimatedBudgetINR: '₹799 - ₹1099',
        canBeSubstitutedByOwned: 'White minimalist sneakers',
      },
    ],
    tags: ['Minimal', 'College', 'Budget', 'Hot / Humid'],
  },
  {
    id: 'outfit-smart-college-overshirt',
    title: 'Contemporary Layered Campus Look',
    styleCategory: 'Smart casual',
    primaryOccasion: 'College',
    compatibleClimates: ['Hot / Humid', 'Mild / Temperate', 'Monsoon / Rainy'],
    budgetTier: 'Budget (Under ₹3000)',
    estimatedCostINR: 2799,
    totalVibe: 'Approachable, structured, and versatile from lectures to coffee hangouts.',
    pieces: [
      {
        item: 'Textured Open-Weave Cotton Overshirt',
        color: 'Espresso Bronze or Slate Blue',
        stylingTip: 'Wear completely unbuttoned over a light base tee to create vertical lines.',
        estimatedBudgetINR: '₹899 - ₹1199',
      },
      {
        item: 'Breathable Slub Cotton Base Tee',
        color: 'Warm Sand / Off-White',
        stylingTip: 'Crewneck sits cleanly under overshirt collar.',
        estimatedBudgetINR: '₹499 - ₹699',
        canBeSubstitutedByOwned: 'Plain white tee',
      },
      {
        item: 'Straight-Leg Indigo Denim (Selvedge Aesthetic)',
        color: 'Raw Deep Indigo',
        stylingTip: 'No artificial distressing; uniform rich dark wash.',
        estimatedBudgetINR: '₹1199 - ₹1399',
        canBeSubstitutedByOwned: 'Dark indigo denim',
      },
    ],
    tags: ['Smart casual', 'College', 'Everyday', 'Budget'],
  },
  {
    id: 'outfit-presentation-formal',
    title: 'Executive Seminar & Placement Tailoring',
    styleCategory: 'Formal',
    primaryOccasion: 'Presentation',
    compatibleClimates: ['Mild / Temperate', 'Hot / Humid', 'Cold / Winter'],
    budgetTier: 'Mid-range (₹3000-₹6000)',
    estimatedCostINR: 4299,
    totalVibe: 'Sharp, authoritative, and sophisticated without stiff corporate awkwardness.',
    pieces: [
      {
        item: 'Structured Milanese Knit Polo with Ribbed Collar',
        color: 'Rich Navy Slate or Crisp Cream',
        stylingTip: 'Firm collar stands upright framing jawline; buttoned to second button.',
        estimatedBudgetINR: '₹1299 - ₹1699',
      },
      {
        item: 'Single-Pleat Tailored Ankle Trousers',
        color: 'Charcoal Mocha or Deep Graphite',
        stylingTip: 'Tailored drape with zero break over shoe collar.',
        estimatedBudgetINR: '₹1699 - ₹2199',
      },
      {
        item: 'Minimalist Suede Penny Loafers or Leather Derbies',
        color: 'Dark Chocolate Brown',
        stylingTip: 'Match leather belt tone to footwear.',
        estimatedBudgetINR: '₹1999 - ₹2899',
      },
    ],
    tags: ['Formal', 'Presentation', 'Interview', 'Internship'],
  },
  {
    id: 'outfit-interview-sharp',
    title: 'Campus Interview & Internship Onboarding',
    styleCategory: 'Smart casual',
    primaryOccasion: 'Interview',
    compatibleClimates: ['Mild / Temperate', 'Hot / Humid'],
    budgetTier: 'Mid-range (₹3000-₹6000)',
    estimatedCostINR: 3899,
    totalVibe: 'Polished, competent, and modern business-casual.',
    pieces: [
      {
        item: 'Tailored Oxford Cloth Button-Down (OCBD)',
        color: 'Light Slate Blue or Pure Chalk White',
        stylingTip: 'Tucked cleanly with gentle billow at natural waistline.',
        estimatedBudgetINR: '₹1199 - ₹1599',
      },
      {
        item: 'Tapered Stretch Cotton Chinos',
        color: 'Dark Navy or Warm Khaki',
        stylingTip: 'Pressed center crease adds visual height.',
        estimatedBudgetINR: '₹1299 - ₹1799',
      },
      {
        item: 'Clean Burnished Leather Dress Shoes',
        color: 'Tobacco Brown',
        stylingTip: 'Pair with tonal socks matching trouser hue.',
        estimatedBudgetINR: '₹1799 - ₹2499',
      },
    ],
    tags: ['Smart casual', 'Interview', 'Internship', 'Professional'],
  },
  {
    id: 'outfit-streetwear-casual',
    title: 'Urban Utility Streetwear',
    styleCategory: 'Streetwear',
    primaryOccasion: 'Date/social event',
    compatibleClimates: ['Mild / Temperate', 'Monsoon / Rainy', 'Cold / Winter'],
    budgetTier: 'Budget (Under ₹3000)',
    estimatedCostINR: 2899,
    totalVibe: 'Tactile, textured, and streetwear-forward with functional accents.',
    pieces: [
      {
        item: 'Boxy Drop-Shoulder Heavy Tee',
        color: 'Washed Charcoal Black',
        stylingTip: 'Loose fit balances wider pant silhouettes.',
        estimatedBudgetINR: '₹699 - ₹899',
      },
      {
        item: 'Single-Pleat Wide-Leg Utility Skate Pants',
        color: 'Olive Khaki or Matte Black',
        stylingTip: 'Sits resting easily on chunky or retro sneakers.',
        estimatedBudgetINR: '₹1399 - ₹1699',
      },
      {
        item: 'Minimal Canvas Crossbody Bag & Wrist Accent',
        color: 'Matte Black / Smoky Grey',
        stylingTip: 'Provides functional utility while anchoring monochrome layers.',
        estimatedBudgetINR: '₹499 - ₹799',
      },
    ],
    tags: ['Streetwear', 'Casual', 'Date/social event', 'Trendy'],
  },
  {
    id: 'outfit-fusion-festive',
    title: 'Modern Festive Kurta & Tapered Chino Fusion',
    styleCategory: 'Traditional/fusion',
    primaryOccasion: 'Wedding/festival',
    compatibleClimates: ['Hot / Humid', 'Mild / Temperate'],
    budgetTier: 'Mid-range (₹3000-₹6000)',
    estimatedCostINR: 3699,
    totalVibe: 'Subtle contemporary festive elegance with breathable comfort.',
    pieces: [
      {
        item: 'Mandarin-Collar Short Textured Linen Kurta',
        color: 'Terracotta Rust or Raw Mustard',
        stylingTip: 'Slightly high side slits; sleeves rolled to mid-forearm.',
        estimatedBudgetINR: '₹1399 - ₹1899',
      },
      {
        item: 'Tailored Ankle Chinos or Silk-Blend Trousers',
        color: 'Ivory Cream or Deep Espresso',
        stylingTip: 'Contrast tone grounds the festive color on top.',
        estimatedBudgetINR: '₹1299 - ₹1699',
      },
      {
        item: 'Leather Kolhapuri Slip-ons or Monk Straps',
        color: 'Antique Tan Leather',
        stylingTip: 'Hand-crafted leather adds authentic artisanal finish.',
        estimatedBudgetINR: '₹1499 - ₹2199',
      },
    ],
    tags: ['Traditional/fusion', 'Wedding/festival', 'Festive', 'Hot / Humid'],
  },
  {
    id: 'outfit-sporty-athleisure',
    title: 'Elevated Tech Knit Athleisure',
    styleCategory: 'Sporty',
    primaryOccasion: 'Everyday',
    compatibleClimates: ['Hot / Humid', 'Mild / Temperate'],
    budgetTier: 'Budget (Under ₹3000)',
    estimatedCostINR: 2499,
    totalVibe: 'Active, dynamic, and ultra-comfortable for commutes and weekend movement.',
    pieces: [
      {
        item: 'Quarter-Zip Performance Knit Top',
        color: 'Heather Slate or Forest Green',
        stylingTip: 'Collar zipped halfway for clean neck framing.',
        estimatedBudgetINR: '₹899 - ₹1199',
      },
      {
        item: 'Tapered Tech Stretch Joggers',
        color: 'Matte Charcoal',
        stylingTip: 'Fitted ankle cuff with zero bagginess.',
        estimatedBudgetINR: '₹1099 - ₹1399',
      },
      {
        item: 'Lightweight Breathable Mesh Runners',
        color: 'Monochrome Black / White',
        stylingTip: 'Sleek profile without loud neon logos.',
        estimatedBudgetINR: '₹899 - ₹1299',
      },
    ],
    tags: ['Sporty', 'Casual', 'Everyday', 'Hot / Humid'],
  },
];
