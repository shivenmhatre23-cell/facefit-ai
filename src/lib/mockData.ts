import { StyleProfile } from './types';

export const SAMPLE_STYLE_PROFILE: StyleProfile = {
  id: 'profile-sample-01',
  timestamp: new Date().toISOString(),
  estimatedAge: {
    range: '17 - 20 years',
    confidence: 'high',
    disclaimer: 'AI approximation based on visual proportions and aesthetic markers. Visual age is used solely for styling, silhouette balance, and color curation.'
  },
  faceGeometry: {
    shape: 'Oval',
    confidence: 'high',
    proportionsSummary: 'Balanced vertical proportions with soft tapered cheekbones and a moderately defined jawline.',
    featuresNotes: [
      'Balanced forehead to chin ratio (approx. 1:1:1)',
      'Subtle cheekbone contour provides versatile haircut compatibility',
      'Smooth jaw curve without extreme angular sharpness'
    ]
  },
  hairAnalysis: {
    length: 'Short',
    texture: 'Wavy',
    volume: 'Dense',
    currentStyle: 'Natural soft wave with moderate temple density',
    hairlineNotes: 'Even mature hairline with slight natural temple recession, highly adaptable to textured crops and tapers'
  },
  facialHairAnalysis: {
    present: true,
    type: 'Stubble',
    density: 'Light-to-medium clean stubble',
    recommendation: 'Maintain a 2–3mm uniform stubble with defined cheekline and neckline cleanup to enhance jawline definition without adding harsh bulk.'
  },
  observations: {
    glassesPresent: false,
    accessoriesObserved: ['Minimalist silver neck chain'],
    currentClothingObservation: 'Casual crewneck tee in heather grey',
    apparentUndertone: 'Warm'
  },
  colorPalette: {
    seasonName: 'Deep Warm Autumn',
    description: 'Rich, grounded earthy tones with warm undertones that enhance natural warmth and olive/golden undertones.',
    contrastLevel: 'Medium Contrast',
    swatches: [
      { name: 'Espresso Bronze', hex: '#3B2F2F', role: 'neutral', explanation: 'Grounded dark neutral alternative to harsh solid black' },
      { name: 'Warm Terracotta', hex: '#C2593F', role: 'accent', explanation: 'Adds vibrant natural warmth without overwhelming skin tone' },
      { name: 'Olive Forest', hex: '#4A5B43', role: 'primary', explanation: 'Compliments warm undertones for effortless overshirts and jackets' },
      { name: 'Oatmeal Sand', hex: '#D7CEBE', role: 'secondary', explanation: 'Clean soft neutral for linen tees and knitwear' },
      { name: 'Deep Mustard Amber', hex: '#CF8A2C', role: 'accent', explanation: 'Striking accent tone for accessories, scarves, or layered accents' },
      { name: 'Rich Navy Slate', hex: '#263445', role: 'primary', explanation: 'Refined structured base for formal trousers and blazers' }
    ],
    colorsToWear: ['Terracotta', 'Forest Olive', 'Espresso Brown', 'Oatmeal', 'Slate Navy', 'Burnt Amber'],
    colorsToAvoid: ['Harsh Icy White', 'Electric Neon Green', 'Washed-out Pastel Pink'],
    metalsRecommended: ['Brushed Antique Brass', 'Warm Gold', 'Smoky Gunmetal']
  },
  suggestedAesthetics: [
    'Smart Casual Contemporary',
    'Minimalist Earth Tones',
    'Modern College Tailoring',
    'Urban Utility'
  ],
  hairstyles: [
    {
      id: 'hair-1',
      name: 'Textured Crop with Low Taper',
      explanation: 'A modern European crop with forward texture on top and a clean, low skin taper around the sideburns and nape.',
      whyItWorks: 'Preserves the natural vertical balance of an oval face while introducing purposeful texture and sharpening the jawline profile.',
      maintenanceLevel: 'Low',
      stylingEffortMinutes: 4,
      suitableProducts: ['Matte Styling Clay', 'Sea Salt Texture Spray'],
      barberInstructions: {
        sidesAndBack: 'Low taper fade starting from #0.5 at the baseline, blending into a #2 guard at the parietal ridge.',
        topLength: 'Scissor cut to 2 to 2.5 inches. Deep point-cutting for irregular separation and texture.',
        fadeOrTaperType: 'Low Taper Fade with natural neck taper',
        stylingFinish: 'Matte, finger-styled forward with a slight fringe lift'
      }
    },
    {
      id: 'hair-2',
      name: 'Soft Side-Part Modern Quiff',
      explanation: 'Slightly longer on top with natural flow brushed back and angled slightly to the side.',
      whyItWorks: 'Adds structured height and sophisticated presence for collegiate presentations, interviews, and semi-formal occasions.',
      maintenanceLevel: 'Medium',
      stylingEffortMinutes: 8,
      suitableProducts: ['Lightweight Styling Cream', 'Vented Brush & Hairdryer'],
      barberInstructions: {
        sidesAndBack: '#3 guard blended into scissor-over-comb near the crown; keep square corners.',
        topLength: '3.5 to 4 inches at the front fringe, tapering down to 3 inches at the vertex.',
        fadeOrTaperType: 'Subtle scissor taper with clean temple line',
        stylingFinish: 'Natural low-shine finish with soft sweep'
      }
    },
    {
      id: 'hair-3',
      name: 'Relaxed Wavy Fringe (Effortless Flow)',
      explanation: 'Embraces natural wave patterns with medium density around the crown and soft temple tapering.',
      whyItWorks: 'Softens facial angles while leaning into natural hair movement, requiring minimal daily heat or product intervention.',
      maintenanceLevel: 'Low',
      stylingEffortMinutes: 3,
      suitableProducts: ['Leave-in Curl Conditioner', 'Argan Oil Drops'],
      barberInstructions: {
        sidesAndBack: 'Scissor cut only; preserve natural wave contour without clipping too tight.',
        topLength: '3 inches, layered to remove bulk without thinning the ends.',
        fadeOrTaperType: 'Natural Scissor Taper',
        stylingFinish: 'Air-dry or diffuser dry with curl enhancer'
      }
    }
  ],
  clothingRecommendations: [
    {
      category: 'Top',
      clothingType: 'Camp-Collar Textured Linen Shirt',
      suggestedColors: ['Oatmeal Sand', 'Olive Forest'],
      fitGuidance: 'Relaxed drop-shoulder silhouette that broadens the upper torso and complements an oval face geometry with open collar lines.',
      aesthetic: 'Minimalist Earth Tones',
      occasion: 'College Everyday / Casual Social'
    },
    {
      category: 'Top',
      clothingType: 'Structured Heavyweight Overshirt',
      suggestedColors: ['Espresso Bronze', 'Slate Navy'],
      fitGuidance: 'Boxy straight hem ending right at mid-fly; sharp collar points add subtle angular definition.',
      aesthetic: 'Urban Utility / Smart Casual',
      occasion: 'Campus Transit / Evening Hangouts'
    },
    {
      category: 'Bottom',
      clothingType: 'Single-Pleat Relaxed Taper Trousers',
      suggestedColors: ['Espresso', 'Charcoal Sand'],
      fitGuidance: 'Roomy through thigh with gentle ankle taper ending cleanly on shoe vamp with zero break.',
      aesthetic: 'Modern College Tailoring',
      occasion: 'College Presentations / Work Events'
    },
    {
      category: 'Footwear',
      clothingType: 'Minimalist Leather Retro Lows / Suede Loafers',
      suggestedColors: ['Off-white / Chalk', 'Deep Tobacco Suede'],
      fitGuidance: 'Slim toe profile with clean soles; avoids bulky dad-sneaker silhouette.',
      aesthetic: 'Smart Casual Contemporary',
      occasion: 'All-Day Wear'
    }
  ],
  outfitCombinations: [
    {
      id: 'outfit-college-budget',
      title: 'Smart College Everyday (Budget-Optimized)',
      aesthetic: 'Contemporary Campus',
      occasion: 'Everyday College / Labs / Coffee Hangout',
      budgetTier: 'Budget (Under ₹3000)',
      totalVibe: 'Effortless, approachable, and tailored without looking like you tried too hard.',
      pieces: [
        {
          item: 'Relaxed Boxy Cotton Tee (Oversized collar band)',
          color: 'Oatmeal / Chalk Sand',
          stylingTip: 'Tuck loosely in the front or wear straight hemmed.',
          estimatedBudgetINR: '₹499 - ₹799'
        },
        {
          item: 'Straight-Fit Chino or Dark Denim',
          color: 'Olive Green or Raw Indigo',
          stylingTip: 'Single pinroll cuff if wearing low sneakers.',
          estimatedBudgetINR: '₹999 - ₹1299'
        },
        {
          item: 'Layer: Light Cotton Utility Overshirt (Open)',
          color: 'Espresso or Navy',
          stylingTip: 'Roll sleeves to forearm to display watch or wrist accessory.',
          estimatedBudgetINR: '₹899 - ₹1199'
        }
      ]
    },
    {
      id: 'outfit-presentation',
      title: 'Executive Campus Presentation',
      aesthetic: 'Smart Formal Tailoring',
      occasion: 'Project Presentation / Placement Interview / Formal Seminar',
      budgetTier: 'Mid-range (₹3000-₹6000)',
      totalVibe: 'Authoritative, sharp, polished, and structured.',
      pieces: [
        {
          item: 'Tailored Knit Polo or Spread Collar Oxford',
          color: 'Crisp Cream / Slate Navy',
          stylingTip: 'Buttoned to second-top; structured collar frames jawline.',
          estimatedBudgetINR: '₹1199 - ₹1699'
        },
        {
          item: 'Single-Pleat Tailored Ankle Trousers',
          color: 'Charcoal / Espresso Bronze',
          stylingTip: 'Ensure hem sits cleanly above shoes without bunching.',
          estimatedBudgetINR: '₹1499 - ₹2199'
        },
        {
          item: 'Minimalist Suede Penny Loafers or Clean Leather Derbies',
          color: 'Dark Chocolate Brown',
          stylingTip: 'Match leather belt tone to shoe color.',
          estimatedBudgetINR: '₹1999 - ₹2999'
        }
      ]
    },
    {
      id: 'outfit-evening',
      title: 'Weekend Social & Dining',
      aesthetic: 'Elevated Monochrome Earth',
      occasion: 'Dinner / Weekend Night Out',
      budgetTier: 'Mid-range (₹3000-₹6000)',
      totalVibe: 'Understated luxury with tactile textures and moody evening tones.',
      pieces: [
        {
          item: 'Textured Knit Tee or Camp-Collar Silk-Blend',
          color: 'Terracotta or Deep Espresso',
          stylingTip: 'Keep neckline relaxed; unbutton top button for collar drape.',
          estimatedBudgetINR: '₹999 - ₹1499'
        },
        {
          item: 'Pleated Wide-Leg Drape Trousers',
          color: 'Warm Black / Deep Slate',
          stylingTip: 'High-waisted with clean concealed waistband.',
          estimatedBudgetINR: '₹1499 - ₹2299'
        },
        {
          item: 'Leather Dress Chelsea Boots or Clean Leather Trainers',
          color: 'Matte Black or Burnished Brown',
          stylingTip: 'Polished clean condition.',
          estimatedBudgetINR: '₹2199 - ₹3499'
        }
      ]
    }
  ],
  accessories: [
    {
      type: 'Eyewear / Sunglasses',
      recommendation: 'Angular Wayfarer or Subtle Geometric Hexagonal Frames in Havana Brown / Matte Tortoise',
      whyItComplements: 'Provides gentle contrast against the curved cheekbones of an oval face shape without overpowering facial proportions.'
    },
    {
      type: 'Wristwear / Watch',
      recommendation: '38–40mm Minimalist Dial with Olive Canvas or Tan Leather Strap',
      whyItComplements: 'Proportionate lug-to-lug size balances everyday wrists while reflecting the warm earthy palette.'
    },
    {
      type: 'Subtle Jewelry',
      recommendation: '2mm Brushed Silver or Antique Brass Box-Link Chain',
      whyItComplements: 'Adds dimension to open-collar shirts without visual clutter.'
    }
  ],
  grooming: [
    {
      category: 'Skincare',
      tip: 'Hyaluronic acid hydrating gel followed by a matte non-comedogenic SPF 50 sunscreen daily.',
      frequency: 'Every Morning'
    },
    {
      category: 'Beard/Shave',
      tip: 'Trim stubble to 2.5mm every 3 days; use a precision razor to keep the neckline 2 fingers above Adam\'s apple clean.',
      frequency: 'Twice Weekly'
    },
    {
      category: 'Hair Care',
      tip: 'Wash wavy hair with sulfate-free shampoo 2x weekly; co-wash with conditioner on alternate days to preserve natural wave texture.',
      frequency: 'Weekly Routine'
    },
    {
      category: 'Fragrance Profile',
      tip: 'Warm Woody Cedarwood & Bergamot with subtle amber undertones (e.g., Vetiver / Amber / Cardamom).',
      frequency: 'Daily Application'
    }
  ]
};
