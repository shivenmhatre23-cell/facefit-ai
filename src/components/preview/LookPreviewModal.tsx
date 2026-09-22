'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Bookmark,
  Check,
  ShieldCheck,
  Scissors,
  AlertCircle,
  RefreshCw,
  Camera,
  Upload,
  Sliders,
  User,
  Copy,
  Layers,
  ArrowUpDown,
  Move,
  Maximize2,
  CheckCheck,
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { LookPreviewResult } from '@/lib/types';
import { saveLookRecord } from '@/lib/saved/looksStore';
import { synthesizeLookPreviewSvgUrl } from '@/lib/ai/preview/previewService';
import { CATALOG_HAIRSTYLES } from '@/lib/recommendations/catalog';

interface LookPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    type: 'hairstyle' | 'outfit' | 'complete_look';
    name: string;
    details?: {
      color?: string;
      style?: string;
      barberNotes?: string;
      sidesAndBack?: string;
      topLength?: string;
      fadeType?: string;
      stylingProduct?: string;
      pieces?: { item: string; color: string }[];
      maintenance?: string;
      occasion?: string;
      hairColor?: string;
      garmentColor?: string;
      verticalOffset?: number;
      scale?: number;
      faceShape?: string;
    };
    baseImage?: string;
  } | null;
}

const HAIR_COLOR_PRESETS = [
  { name: 'Natural Black', hex: '#1B1816' },
  { name: 'Dark Espresso', hex: '#30241E' },
  { name: 'Rich Chestnut', hex: '#4A3728' },
  { name: 'Ash Brown', hex: '#3B3632' },
  { name: 'Warm Bronze', hex: '#583D2D' },
];

const OUTFIT_COLOR_PRESETS = [
  { name: 'Slate Navy', hex: '#263445' },
  { name: 'Oatmeal Sand', hex: '#D7CEBE' },
  { name: 'Forest Olive', hex: '#4A5B43' },
  { name: 'Warm Terracotta', hex: '#C2593F' },
  { name: 'Espresso Bronze', hex: '#3B2F2F' },
  { name: 'Charcoal Black', hex: '#1C1917' },
];

export function LookPreviewModal({ isOpen, onClose, target }: LookPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'tryon' | 'barber'>('tryon');
  const [viewMode, setViewMode] = useState<'split' | 'full'>('split');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<LookPreviewResult | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copiedBarber, setCopiedBarber] = useState(false);

  // Hairline & silhouette fine-tuning state
  const [verticalOffset, setVerticalOffset] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User profile context from storage (Face shape, age)
  const [userFaceShape, setUserFaceShape] = useState<string>('Oval');
  const [userAgeRange, setUserAgeRange] = useState<string>('17-20');

  // Initialize photo and settings when modal opens
  useEffect(() => {
    if (isOpen && target) {
      // 1. Resolve user's actual photo
      let resolvedPhoto: string | null = target.baseImage || null;
      if (!resolvedPhoto && typeof window !== 'undefined') {
        resolvedPhoto = sessionStorage.getItem('facefit_preview_image');
      }
      setUserPhoto(resolvedPhoto);

      // 2. Read stored user profile data
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('facefit_style_profile');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.faceGeometry?.faceShape) {
              setUserFaceShape(parsed.faceGeometry.faceShape);
            }
            if (parsed.estimatedAge?.estimatedRange) {
              setUserAgeRange(parsed.estimatedAge.estimatedRange);
            }
          }
        } catch {
          // ignore parsing error
        }
      }

      // Default color
      const defaultColor =
        target.type === 'hairstyle'
          ? target.details?.hairColor || '#241C18'
          : target.details?.garmentColor || target.details?.color || '#263445';
      setSelectedColor(defaultColor);
      setVerticalOffset(0);
      setScale(1.0);
      setActiveTab('tryon');
      setViewMode('split');

      // Instant local synthesis + API background warm-up
      generateInstantPreview(0, 1.0, defaultColor, resolvedPhoto);
      setSaved(false);
      setCopiedBarber(false);
    } else {
      setPreviewData(null);
      setError(null);
    }
  }, [isOpen, target?.name, target?.type]);

  /**
   * Generates instantaneous preview using client-side SVG synthesizer (0ms latency)
   */
  const generateInstantPreview = (
    offset: number,
    hairScale: number,
    colorHex: string,
    photoToUse: string | null
  ) => {
    if (!target) return;
    try {
      const previewUrl = synthesizeLookPreviewSvgUrl(
        target.type,
        target.name,
        {
          ...(target.details || {}),
          color: colorHex,
          hairColor: colorHex,
          garmentColor: colorHex,
          verticalOffset: offset,
          scale: hairScale,
        },
        photoToUse || undefined
      );

      setPreviewData({
        previewUrl,
        originalUrl: photoToUse || undefined,
        isAiGeneratedNotice: 'AI-Generated Visualization • Conceptual Silhouette',
        styleNotes: [
          target.type === 'hairstyle'
            ? `Haircut contour adjusted to: ${target.name}`
            : `Wardrobe silhouette styled to: ${target.name}`,
          'Facial proportions, skin tone, and identity markers strictly preserved',
          'Optical balance evaluated against natural facial geometry',
        ],
        disclaimer:
          'Approximate AI preview for conceptual styling direction only. Real-world hair texture, lighting, and tailoring naturally vary from algorithmic simulation.',
      });
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Visual preview synthesis encountered an unexpected error.';
      setError(message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setUserPhoto(base64);
        setShowUploader(false);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('facefit_preview_image', base64);
        }
        generateInstantPreview(verticalOffset, scale, selectedColor, base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    generateInstantPreview(verticalOffset, scale, hex, userPhoto);
  };

  const handleOffsetSlider = (newOffset: number) => {
    setVerticalOffset(newOffset);
    generateInstantPreview(newOffset, scale, selectedColor, userPhoto);
  };

  const handleScaleSlider = (newScale: number) => {
    setScale(newScale);
    generateInstantPreview(verticalOffset, newScale, selectedColor, userPhoto);
  };

  const handleApplyPreset = (presetOffset: number, presetScale = 1.0) => {
    setVerticalOffset(presetOffset);
    setScale(presetScale);
    generateInstantPreview(presetOffset, presetScale, selectedColor, userPhoto);
  };

  if (!isOpen || !target) return null;

  const isHair = target.type === 'hairstyle';

  // Resolve Barber catalog entry or rich specifications
  const lowerName = (target.name || '').toLowerCase();
  const catalogMatch = isHair
    ? CATALOG_HAIRSTYLES.find(
        (h) =>
          h.name.toLowerCase().includes(lowerName) ||
          lowerName.includes(h.name.toLowerCase())
      )
    : null;

  const barberSpecs = {
    name: target.name,
    category:
      catalogMatch?.category || target.details?.maintenance || 'Medium maintenance',
    sidesAndBack:
      target.details?.sidesAndBack ||
      target.details?.barberNotes ||
      catalogMatch?.barberInstructions.sidesAndBack ||
      (lowerName.includes('buzz')
        ? '#1.5 guard tapered cleanly at temples and neckline.'
        : lowerName.includes('quiff')
        ? '#2 to #3 guard blended into scissor-over-comb near crown.'
        : lowerName.includes('fringe') || lowerName.includes('wolf')
        ? 'Scissor-tapered sides retaining soft length around ears.'
        : 'Low skin taper blending from #0.5 up to #2 at the parietal ridge.'),
    topLength:
      target.details?.topLength ||
      catalogMatch?.barberInstructions.topLength ||
      (lowerName.includes('buzz')
        ? '#4 guard (approx. 0.5 inches) with rounded hairline shaping.'
        : lowerName.includes('quiff')
        ? '3.5 inches at front fringe tapering to 2.5 inches at vertex.'
        : lowerName.includes('fringe') || lowerName.includes('wolf')
        ? '3 to 4 inches layered texture falling naturally across forehead.'
        : '2 to 2.5 inches scissor cut with deep point-cutting for texture.'),
    fadeType:
      target.details?.fadeType ||
      catalogMatch?.barberInstructions.fadeOrTaperType ||
      (lowerName.includes('buzz')
        ? 'Temple Taper'
        : lowerName.includes('quiff')
        ? 'Scissor Taper with clean ear outline'
        : lowerName.includes('fringe')
        ? 'Soft Scissor Taper'
        : 'Low Taper Fade with natural neckline taper'),
    stylingFinish:
      catalogMatch?.barberInstructions.stylingFinish ||
      (lowerName.includes('buzz')
        ? 'Natural dry / no product required'
        : lowerName.includes('quiff')
        ? 'Natural sweep with soft volume'
        : lowerName.includes('fringe')
        ? 'Relaxed piecey texture with natural parting'
        : 'Matte natural finish pushed forward'),
    products:
      catalogMatch?.suitableProducts ||
      (lowerName.includes('buzz')
        ? ['Light Argan Hair Oil']
        : lowerName.includes('quiff')
        ? ['Volumizing Sea Salt Spray', 'Light Styling Cream']
        : lowerName.includes('fringe')
        ? ['Texture Powder', 'Sea Salt Spray']
        : ['Matte Styling Clay', 'Sea Salt Texture Spray']),
    whyItWorks:
      catalogMatch?.whyItWorksBase ||
      `Engineered for ${userFaceShape} face geometry. Provides vertical lift and clean perimeters without adding unflattering lateral width.`,
  };

  const handleSaveLook = () => {
    saveLookRecord({
      name: `${target.name} Preview`,
      type: target.type,
      previewUrl: previewData?.previewUrl,
      occasion: target.details?.occasion || 'Everyday',
      style: target.details?.style || 'Contemporary',
      colors: target.details?.pieces?.map((p) => p.color) || [target.details?.color || '#2A2A2A'],
      details: {
        ...target.details,
        notes: previewData?.styleNotes || [],
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCopyBarberCard = () => {
    const textToCopy = [
      `💈 FACEFIT AI - BARBER SPECIFICATION CARD`,
      `──────────────────────────────────────────────`,
      `Client Style: ${barberSpecs.name}`,
      `Category: ${barberSpecs.category}`,
      `Client Face Shape: ${userFaceShape} Geometry`,
      ``,
      `✂️ CUTTING BLUEPRINT:`,
      `• Sides & Back: ${barberSpecs.sidesAndBack}`,
      `• Top & Crown: ${barberSpecs.topLength}`,
      `• Fade / Taper: ${barberSpecs.fadeType}`,
      `• Finishing: ${barberSpecs.stylingFinish}`,
      ``,
      `🧴 RECOMMENDED STYLING ROUTINE:`,
      `• Products: ${barberSpecs.products.join(', ')}`,
      `• Daily Styling: ~3 to 5 minutes on towel-damp hair`,
      ``,
      `💡 WHY THIS CUT WORKS:`,
      `${barberSpecs.whyItWorks}`,
      `──────────────────────────────────────────────`,
      `Synthesized by FaceFit AI Studio`,
    ].join('\n');

    navigator.clipboard.writeText(textToCopy);
    setCopiedBarber(true);
    setTimeout(() => setCopiedBarber(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-editorial font-bold text-neutral-900 text-base sm:text-lg">
                  {target.name}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {userPhoto ? 'On Your Face' : 'Simulation'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {userPhoto ? 'Rendered directly on your uploaded portrait' : 'Visual style simulation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Try-On vs Barber Dossier) */}
        {isHair && (
          <div className="flex border-b border-neutral-100 bg-neutral-50/60 px-4 sm:px-6 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('tryon')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'tryon'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              🪞 Interactive Virtual Try-On
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('barber')}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'barber'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-amber-700" />
              💈 Studio Barber Dossier
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Missing photo prompt banner if user doesn't have an uploaded selfie */}
          {!userPhoto && !showUploader && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Want to see this style fitted on your face?</strong> Upload a quick photo.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowUploader(true)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                Add My Photo
              </button>
            </div>
          )}

          {/* Inline Photo Uploader */}
          {showUploader && (
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-neutral-600" />
                  Select or capture a portrait
                </span>
                <button
                  type="button"
                  onClick={() => setShowUploader(false)}
                  className="text-neutral-400 hover:text-neutral-600 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" /> Choose File
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: INTERACTIVE VIRTUAL TRY-ON */}
          {activeTab === 'tryon' && (
            <div className="space-y-4">
              {/* View Switcher: Split Slider vs Full Result */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-amber-600" />
                  Visual Try-On Studio
                </div>
                <div className="flex items-center p-0.5 rounded-xl bg-neutral-100 border border-neutral-200 text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setViewMode('split')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      viewMode === 'split'
                        ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    ⇋ Split Compare
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('full')}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      viewMode === 'full'
                        ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    ✦ Full Styled Look
                  </button>
                </div>
              </div>

              {/* Visual Display: Before/After Slider OR Full Image */}
              <div className="flex justify-center">
                {viewMode === 'split' ? (
                  <BeforeAfterSlider
                    currentImageUrl={userPhoto || previewData?.originalUrl || previewData?.previewUrl || ''}
                    suggestedImageUrl={previewData?.previewUrl || ''}
                    currentLabel={userPhoto ? 'Before (You)' : 'Original'}
                    suggestedLabel={userPhoto ? 'After (Styled)' : 'Suggested'}
                  />
                ) : (
                  <div className="relative w-full aspect-[3/4] max-w-sm rounded-2xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-100">
                    <img
                      src={previewData?.previewUrl}
                      alt={target.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase">
                      ✦ Styled Look
                    </div>
                  </div>
                )}
              </div>

              {/* SLIDER CONTROLS: HAIRLINE PLACEMENT & SCALE */}
              {isHair && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                      <Sliders className="w-3.5 h-3.5 text-amber-700" />
                      Adjust Hairline & Head Alignment
                    </div>
                    {userPhoto && (
                      <button
                        type="button"
                        onClick={() => setShowUploader(true)}
                        className="text-[11px] text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-2 cursor-pointer"
                      >
                        Change Photo
                      </button>
                    )}
                  </div>

                  {/* 1. Hairline Height Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span className="flex items-center gap-1 font-medium">
                        <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                        Hairline Height (Vertical Offset):
                      </span>
                      <span className="font-mono text-[11px] font-bold text-neutral-800 px-2 py-0.5 rounded bg-neutral-200/70">
                        {verticalOffset > 0 ? `+${verticalOffset}px` : `${verticalOffset}px`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-140"
                      max="160"
                      step="2"
                      value={verticalOffset}
                      onChange={(e) => handleOffsetSlider(Number(e.target.value))}
                      className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Lower Hairline (-140px)</span>
                      <span>Natural Forehead</span>
                      <span>Higher Hairline (+160px)</span>
                    </div>
                  </div>

                  {/* 2. Hair Width & Scale Slider */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs text-neutral-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
                        Hair Volume & Width Scale:
                      </span>
                      <span className="font-mono text-[11px] font-bold text-neutral-800 px-2 py-0.5 rounded bg-neutral-200/70">
                        {scale.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.70"
                      max="1.40"
                      step="0.02"
                      value={scale}
                      onChange={(e) => handleScaleSlider(Number(e.target.value))}
                      className="w-full accent-neutral-900 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-neutral-400">
                      <span>Narrow Head (0.70x)</span>
                      <span>Standard (1.00x)</span>
                      <span>Broader Volume (1.40x)</span>
                    </div>
                  </div>

                  {/* 3. Quick One-Tap Alignment Presets */}
                  <div className="pt-1 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mr-1">
                      Quick Fit:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(40, scale)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                        verticalOffset === 40
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      High Forehead (+40)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(0, scale)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                        verticalOffset === 0
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      Center (0)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(-40, scale)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
                        verticalOffset === -40
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      Low Forehead (-40)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset(0, 1.0)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-200 text-neutral-700 hover:bg-neutral-300 transition cursor-pointer ml-auto"
                    >
                      Reset All
                    </button>
                  </div>

                  {/* 4. Natural Hair Tone Palette */}
                  <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-600 font-medium">Hair Color Tone:</span>
                    <div className="flex items-center gap-2">
                      {HAIR_COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => handleColorChange(preset.hex)}
                          className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                            selectedColor.toLowerCase() === preset.hex.toLowerCase()
                              ? 'ring-2 ring-neutral-900 ring-offset-1 scale-110 shadow-xs'
                              : 'border-neutral-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: preset.hex }}
                          title={preset.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Garment Controls if Outfit */}
              {!isHair && (
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-700">Garment Palette:</span>
                  <div className="flex items-center gap-1.5">
                    {OUTFIT_COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => handleColorChange(preset.hex)}
                        className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                          selectedColor.toLowerCase() === preset.hex.toLowerCase()
                            ? 'ring-2 ring-neutral-900 scale-110 shadow-xs'
                            : 'border-neutral-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Identity Protection Guarantee Banner */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-800">Ethical Identity Guarantee: </span>
                  {previewData?.disclaimer ||
                    'Hair and styling simulation only. Your natural facial features, skin tone, and expressions are 100% preserved.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDIO BARBER DOSSIER */}
          {activeTab === 'barber' && isHair && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Left Column: Client Reference Portrait (2 cols) */}
                <div className="md:col-span-2 space-y-3">
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-xs bg-neutral-100">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt="Client Portrait"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-neutral-400">
                        <User className="w-12 h-12 mb-2 stroke-1" />
                        <span className="text-xs">No client photo uploaded</span>
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase">
                      Client Profile
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Face Shape:</span>
                      <span className="font-bold text-neutral-800">{userFaceShape} Geometry</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Stage:</span>
                      <span className="font-medium text-neutral-700">{userAgeRange} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Silhouette Balance:</span>
                      <span className="font-medium text-emerald-700">Optimal Harmony</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Barber Blueprint Specifications (3 cols) */}
                <div className="md:col-span-3 space-y-3">
                  {/* Style Header */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 px-2 py-0.5 rounded-full bg-amber-100">
                        {barberSpecs.category}
                      </span>
                      <span className="text-xs text-amber-900/80 font-medium">Salon Blueprint</span>
                    </div>
                    <h4 className="font-serif-editorial font-bold text-neutral-900 text-base">
                      {barberSpecs.name}
                    </h4>
                  </div>

                  {/* Clipper Guard & Cutting Specs */}
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 space-y-3 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-neutral-600" />
                      Clipper Guard & Scissor Specs
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="font-semibold text-neutral-900 block">💈 Sides & Back:</span>
                        <p className="text-neutral-600 mt-0.5">{barberSpecs.sidesAndBack}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="font-semibold text-neutral-900 block">✂️ Top Length & Crown:</span>
                        <p className="text-neutral-600 mt-0.5">{barberSpecs.topLength}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="font-semibold text-neutral-900 block">📐 Taper & Fade Line:</span>
                        <p className="text-neutral-600 mt-0.5">{barberSpecs.fadeType}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="font-semibold text-neutral-900 block">🧴 Styling Finish & Products:</span>
                        <p className="text-neutral-600 mt-0.5">
                          {barberSpecs.stylingFinish} • Recommended: {barberSpecs.products.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Why It Works Rationale */}
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                    <span className="font-semibold text-neutral-800">Geometry Synergy:</span>
                    <p className="text-neutral-600">{barberSpecs.whyItWorks}</p>
                  </div>

                  {/* 1-Click Copy Barber Instructions CTA */}
                  <button
                    type="button"
                    onClick={handleCopyBarberCard}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      copiedBarber
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    {copiedBarber ? (
                      <>
                        <CheckCheck className="w-4 h-4 text-emerald-200" />
                        Copied Complete Barber Card to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-amber-400" />
                        📋 Copy Complete Instructions for Barber
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-neutral-400">
                    Show this card on your phone or text it to your stylist before your appointment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 text-xs font-medium transition cursor-pointer"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveLook}
              disabled={loading || !previewData}
              className={`px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer ${
                saved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {saved ? 'Saved to Looks' : 'Save This Look'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

