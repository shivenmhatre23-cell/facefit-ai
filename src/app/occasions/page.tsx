'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Sparkles,
  Scissors,
  Shirt,
  Bookmark,
  Check,
  Eye,
  Briefcase,
  GraduationCap,
  PartyPopper,
  Plane,
  HeartHandshake,
  Award,
  Coffee,
  Glasses,
} from 'lucide-react';
import { OccasionType, OccasionRecommendation } from '@/lib/types';
import { LookPreviewModal } from '@/components/preview/LookPreviewModal';
import { saveLookRecord } from '@/lib/saved/looksStore';

const OCCASIONS: { type: OccasionType; icon: any; desc: string }[] = [
  { type: 'College', icon: GraduationCap, desc: 'Campus casual, breathable layers, durable comfort' },
  { type: 'Internship', icon: Briefcase, desc: 'Approachable professional, neat grooming, smart casual' },
  { type: 'Interview', icon: Award, desc: 'High authority, tailored structure, impeccably sharp cuts' },
  { type: 'Presentation', icon: Glasses, desc: 'Commanding presence, clean contrast, distraction-free silhouettes' },
  { type: 'Wedding', icon: HeartHandshake, desc: 'Traditional elegance, regal color harmonies, elevated fabrics' },
  { type: 'Festival', icon: PartyPopper, desc: 'Celebratory kurtas, contemporary fusion, expressive tones' },
  { type: 'Party', icon: Sparkles, desc: 'Modern night out, subtle textures, relaxed tailoring' },
  { type: 'Everyday', icon: Coffee, desc: 'Low effort, high versatility, effortless rotation' },
  { type: 'Travel', icon: Plane, desc: 'Wrinkle-resistant fabrics, functional layers, slip-on comfort' },
  { type: 'Formal Event', icon: Briefcase, desc: 'Black-tie or formal gala, sharp lapels, immaculate finish' },
];

const OCCASION_PLANS: Record<OccasionType, OccasionRecommendation> = {
  College: {
    occasion: 'College',
    title: 'The Collegiate Minimalist',
    hairstyle: {
      name: 'Textured Crop with Low Taper',
      stylingTip: 'Work a nickel-sized amount of matte clay into damp hair for 3-minute texture.',
      maintenance: 'Low (~4 minutes daily)',
    },
    outfit: {
      top: 'Heavyweight Boxy Oatmeal Tee',
      bottom: 'Olive Straight-Fit Chinos',
      shoes: 'Retro Gum-Sole Trainers',
      layer: 'Unlined Washed Denim Overshirt',
    },
    colors: ['#F5F5F0', '#4B5320', '#1C2833', '#C4A482'],
    accessories: ['Canvas Everyday Tote', 'Minimalist Analog Watch'],
    groomingSuggestions: [
      'Clean stubble neckline or natural 3-day beard fade',
      'Matte moisturizer with SPF 30 for campus transit',
    ],
    reasoning:
      'Provides supreme comfort across 6+ hours of lecture halls while maintaining a deliberate, well-proportioned silhouette.',
  },
  Internship: {
    occasion: 'Internship',
    title: 'Modern Business Smart Casual',
    hairstyle: {
      name: 'Soft Scissor-Cut Side Part',
      stylingTip: 'Towel-dry with light sea-salt spray, sweep with fingers off the forehead.',
      maintenance: 'Medium (6 mins daily)',
    },
    outfit: {
      top: 'Crisp Oxford Cotton Button-Down (Light Blue)',
      bottom: 'Single-Pleat Charcoal Trousers',
      shoes: 'Dark Chocolate Suede Penny Loafers',
      layer: 'Fine-Gauge Merino Navy Cardigan',
    },
    colors: ['#A0C4E2', '#36454F', '#1B2A4A', '#4A2E18'],
    accessories: ['Slim Leather Messenger Bag', 'Brown Leather Strap Watch'],
    groomingSuggestions: [
      'Tapered sideburns aligned with mid-ear',
      'Neutral unscented hair pomade for zero grease',
    ],
    reasoning:
      'Strikes the exact balance between youthful approachability and corporate credibility, respecting team hierarchy.',
  },
  Interview: {
    occasion: 'Interview',
    title: 'Executive High-Trust Ensemble',
    hairstyle: {
      name: 'Tapered Classic Scissor Cut with Clean Neckline',
      stylingTip: 'Side part defined with a fine-toothed comb and low-shine styling paste.',
      maintenance: 'Low-Medium (5 mins daily)',
    },
    outfit: {
      top: 'Tailored Egyptian Cotton White Shirt',
      bottom: 'Midnight Navy Wool-Blend Trousers',
      shoes: 'Polished Black Leather Oxford Shoes',
      layer: 'Structured Charcoal Grey Blazer',
    },
    colors: ['#FFFFFF', '#1A2436', '#2E3238', '#000000'],
    accessories: ['Silk Knitted Tie in Deep Burgundy', 'Silver Tie Bar'],
    groomingSuggestions: [
      'Clean shaven or strictly sculpted beard with 1mm edge definition',
      'Nail grooming and subtle sandalwood / cedarwood cologne',
    ],
    reasoning:
      'Maximizes optical clarity and non-verbal signals of precision, reliability, and executive presence.',
  },
  Presentation: {
    occasion: 'Presentation',
    title: 'High-Contrast Stage Presence',
    hairstyle: {
      name: 'Textured Quiff with Matte Finish',
      stylingTip: 'Blow-dry roots upward for 2 minutes to create vertical volume that stays off the forehead.',
      maintenance: 'Medium (8 mins daily)',
    },
    outfit: {
      top: 'Minimalist Charcoal Crewneck Knit',
      bottom: 'Tailored Ankle-Grazer Black Trousers',
      shoes: 'Matte Black Leather Chelsea Boots',
      layer: 'Structured Stone Grey Chore Coat',
    },
    colors: ['#2F353B', '#111111', '#B8B5B0', '#FFFFFF'],
    accessories: ['Understated Black Titanium Chronograph'],
    groomingSuggestions: [
      'Matte blotting powder or oil-control moisturizer to reduce glare under projector lighting',
      'Defined eyebrow framing',
    ],
    reasoning:
      'Monochromatic contrast draws the audience’s gaze directly to your face and eyes without distracting patterns.',
  },
  Wedding: {
    occasion: 'Wedding',
    title: 'Regal Contemporary Kurta Set',
    hairstyle: {
      name: 'Clean Side Pompadour with Mid Fade',
      stylingTip: 'Medium-hold pomade for subtle luster and all-day wind/movement resistance.',
      maintenance: 'High Styling (12 mins)',
    },
    outfit: {
      top: 'Embroidered Raw Silk Ivory Kurta',
      bottom: 'Churidar / Tailored Tapered Pants (Oatmeal)',
      shoes: 'Handcrafted Embroidered Mojaris / Loafers',
      layer: 'Bespoke Bandhgala Nehru Jacket in Emerald',
    },
    colors: ['#F9F6EE', '#043927', '#C5A059', '#704214'],
    accessories: ['Pocket Square with Gold Zari Border', 'Rose Gold Cufflinks'],
    groomingSuggestions: [
      'Beard oiled with argan drops for healthy shine',
      'Exfoliated neckline 24 hours prior to prevent razor burn',
    ],
    reasoning:
      'Celebrates ceremonial richness while modernizing silhouettes with tailored tapering and regal color harmony.',
  },
  Festival: {
    occasion: 'Festival',
    title: 'Modern Festive Fusion',
    hairstyle: {
      name: 'Wavy Middle Part Flow',
      stylingTip: 'Sea salt spray air-dried for natural kinetic movement.',
      maintenance: 'Low-Medium (5 mins)',
    },
    outfit: {
      top: 'Short Mustard / Saffron Linen Kurta',
      bottom: 'Pleated Off-White Cotton Trousers',
      shoes: 'Woven Tan Leather Huaraches or Loafers',
    },
    colors: ['#E1A100', '#F5F5F0', '#8D5B4C', '#2E4057'],
    accessories: ['Braided Leather Wristwear', 'Classic Wayfarer Sunglasses'],
    groomingSuggestions: [
      'Hydrating skin mist for outdoor warmth',
      'Trimmed mustache line above the lip border',
    ],
    reasoning:
      'Effortless movement and breathability designed for daylight outdoor festivities and celebrations.',
  },
  Party: {
    occasion: 'Party',
    title: 'Nocturnal Relaxed Tailoring',
    hairstyle: {
      name: 'Messy Textured Forward Fringe',
      stylingTip: 'Matte molding clay scrunched through top layers.',
      maintenance: 'Medium (6 mins)',
    },
    outfit: {
      top: 'Silk-Modal Camp Collar Shirt (Midnight Navy)',
      bottom: 'Relaxed Wide-Leg Charcoal Trousers',
      shoes: 'Chunky Lug-Sole Leather Derbies',
      layer: 'Cropped Suede Blouson Jacket',
    },
    colors: ['#0B132B', '#1C2541', '#3A506B', '#111111'],
    accessories: ['2mm Silver Rope Chain', 'Signet Ring'],
    groomingSuggestions: [
      'Groomed eyebrows with clear gel',
      'Amber or vanilla-spiced evening fragrance',
    ],
    reasoning:
      'Textural richness under low restaurant and venue lighting with a relaxed, confident drape.',
  },
  Everyday: {
    occasion: 'Everyday',
    title: 'Effortless Capsule Rotation',
    hairstyle: {
      name: 'Natural Texture French Crop',
      stylingTip: 'Air dry with a dot of leave-in styling cream.',
      maintenance: 'Low (2 mins)',
    },
    outfit: {
      top: 'Medium-Weight Vintage Washed Crewneck',
      bottom: 'Relaxed Taper Selvedge Denim',
      shoes: 'Retro Neutral Court Sneakers',
      layer: 'Heavy Canvas Zip Overshirt',
    },
    colors: ['#EAEAEA', '#334155', '#475569', '#1E293B'],
    accessories: ['Canvas Crossbody Bag', 'Minimal Watch'],
    groomingSuggestions: ['Daily hydrating sunscreen', 'Hydrating lip balm'],
    reasoning:
      'Zero decision fatigue. Every element seamlessly interchanges with 80% of any modern wardrobe.',
  },
  Travel: {
    occasion: 'Travel',
    title: 'The High-Mobility Transit Look',
    hairstyle: {
      name: 'Low-Maintenance Buzz Fade',
      stylingTip: 'Zero daily styling required. Ready straight off long-haul flights.',
      maintenance: 'Ultra Low (0 mins)',
    },
    outfit: {
      top: 'Merino Wool Anti-Odor T-Shirt',
      bottom: 'Tailored Technical Stretch Joggers',
      shoes: 'Cushioned Slip-On Running Shoes',
      layer: 'Packable Water-Resistant Windbreaker',
    },
    colors: ['#2B2D42', '#8D99AE', '#EDF2F4', '#1F2421'],
    accessories: ['Noise-Canceling Headphones', 'RFID Travel Passport Wallet'],
    groomingSuggestions: [
      'Sheet mask hydration before flights',
      'Travel-size beard balm to combat dry cabin air',
    ],
    reasoning:
      'Designed around thermal regulation, unrestricted movement, and immediate crease recovery.',
  },
  'Formal Event': {
    occasion: 'Formal Event',
    title: 'Classic Black-Tie Tuxedo Silhouette',
    hairstyle: {
      name: 'Gloss Side Part with Razor Edge',
      stylingTip: 'Water-based high-shine pomade with clean comb lines.',
      maintenance: 'High (10 mins)',
    },
    outfit: {
      top: 'Piqué Bib Front Tuxedo Shirt with French Cuffs',
      bottom: 'Satin-Striped Tailored Black Trousers',
      shoes: 'Patent Leather Evening Slippers or Oxfords',
      layer: 'Peak Lapel Black Dinner Jacket',
    },
    colors: ['#000000', '#FFFFFF', '#1A1A1A', '#C0C0C0'],
    accessories: ['Silk Grosgrain Bowtie', 'Onyx Studs and Cufflinks'],
    groomingSuggestions: [
      'Professional close shave 3 hours prior',
      'Refined bergamot and vetiver scent',
    ],
    reasoning:
      'Timeless adherence to black-tie etiquette while tailoring lapel width to harmonize with user facial width.',
  },
};

export default function OccasionsPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('College');
  const [previewTarget, setPreviewTarget] = useState<any | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const plan = OCCASION_PLANS[selectedOccasion];

  const handleSaveLook = () => {
    saveLookRecord({
      name: plan.title,
      type: 'complete_look',
      occasion: plan.occasion,
      style: `${plan.occasion} Curated`,
      colors: plan.colors,
      details: plan,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <Calendar className="w-4 h-4" />
              Occasion Stylist
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Dressed for the Moment
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Select any life event to receive a synchronized hairstyle, outfit, color harmony, and grooming plan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPreviewTarget({
                  type: 'complete_look',
                  name: plan.title,
                  details: {
                    occasion: plan.occasion,
                    style: plan.hairstyle.name,
                    pieces: [
                      { item: plan.outfit.top, color: 'Primary' },
                      { item: plan.outfit.bottom, color: 'Base' },
                      { item: plan.outfit.shoes, color: 'Accent' },
                    ],
                  },
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-medium text-neutral-800 transition shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Try This Look (AI Preview)
            </button>
            <button
              onClick={handleSaveLook}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {savedSuccess ? 'Saved Look' : 'Save Plan'}
            </button>
          </div>
        </div>

        {/* 10 Occasion Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200/80">
          {OCCASIONS.map((occ) => {
            const Icon = occ.icon;
            const isSelected = selectedOccasion === occ.type;
            return (
              <button
                key={occ.type}
                onClick={() => {
                  setSelectedOccasion(occ.type);
                  setSavedSuccess(false);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {occ.type}
              </button>
            );
          })}
        </div>

        {/* Selected Occasion Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Blueprint Plan */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
              <div>
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                  Curated Occasion Strategy
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900 mt-1">
                  {plan.title}
                </h2>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{plan.reasoning}</p>
              </div>

              {/* Hairstyle Section */}
              <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-neutral-800" />
                    <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                      Optimal Hairstyle
                    </span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700">
                    {plan.hairstyle.maintenance}
                  </span>
                </div>
                <div className="text-sm font-semibold text-neutral-900">{plan.hairstyle.name}</div>
                <p className="text-xs text-neutral-600 leading-relaxed">{plan.hairstyle.stylingTip}</p>
              </div>

              {/* Outfit Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                  <Shirt className="w-4 h-4 text-neutral-800" />
                  Garment Ensemble
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl border border-neutral-200/70 bg-white">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase">Top</span>
                    <div className="text-xs font-semibold text-neutral-900 mt-0.5">{plan.outfit.top}</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-neutral-200/70 bg-white">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase">Bottom</span>
                    <div className="text-xs font-semibold text-neutral-900 mt-0.5">{plan.outfit.bottom}</div>
                  </div>
                  <div className="p-4 rounded-2xl border border-neutral-200/70 bg-white">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase">Footwear</span>
                    <div className="text-xs font-semibold text-neutral-900 mt-0.5">{plan.outfit.shoes}</div>
                  </div>
                  {plan.outfit.layer && (
                    <div className="p-4 rounded-2xl border border-neutral-200/70 bg-white">
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase">Layer</span>
                      <div className="text-xs font-semibold text-neutral-900 mt-0.5">{plan.outfit.layer}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Grooming Suggestions */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
                  Grooming & Finishing Touches
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-600">
                  {plan.groomingSuggestions.map((g, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Palette & Accessories */}
          <div className="lg:col-span-4 space-y-5">
            {/* Color Palette Card */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Harmonizing Palette
              </span>
              <div className="grid grid-cols-4 gap-2">
                {plan.colors.map((hex, idx) => (
                  <div key={idx} className="space-y-1 text-center">
                    <div
                      className="w-full aspect-square rounded-xl border border-black/10 shadow-xs"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[10px] font-mono text-neutral-400">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Accessories */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Finishing Accessories
              </span>
              <ul className="space-y-2 text-xs text-neutral-700">
                {plan.accessories.map((acc, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                    <span>{acc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Look Preview Modal */}
      {previewTarget && (
        <LookPreviewModal
          isOpen={!!previewTarget}
          onClose={() => setPreviewTarget(null)}
          target={previewTarget}
        />
      )}
    </div>
  );
}
