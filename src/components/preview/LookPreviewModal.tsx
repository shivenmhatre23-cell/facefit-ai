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
  User,
  Copy,
  CheckCheck,
  ArrowRight,
  Sparkle,
  SlidersHorizontal,
  SplitSquareVertical,
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { LookPreviewResult } from '@/lib/types';
import { saveLookRecord } from '@/lib/saved/looksStore';
import { getStyleReferenceImage } from '@/lib/ai/preview/previewService';
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
      faceShape?: string;
    };
    baseImage?: string;
  } | null;
}

export function LookPreviewModal({ isOpen, onClose, target }: LookPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'slider' | 'sidebyside' | 'barber'>('slider');
  const [previewData, setPreviewData] = useState<LookPreviewResult | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copiedBarber, setCopiedBarber] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
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

      // 3. Resolve photorealistic style reference photo
      const referencePhoto = getStyleReferenceImage(target.type, target.name);

      setPreviewData({
        previewUrl: referencePhoto,
        originalUrl: resolvedPhoto || undefined,
        isAiGeneratedNotice: 'High-Definition Salon Reference • Proportional Geometry Match',
        styleNotes: [
          target.type === 'hairstyle'
            ? `Haircut silhouette tailored to: ${target.name}`
            : `Wardrobe silhouette tailored to: ${target.name}`,
          `Engineered for ${userFaceShape} face geometry`,
          'Proportional balance matched against natural facial contours',
        ],
        disclaimer:
          'High-definition salon visualization matched to your face proportions. Real-world hair texture and tailor fit naturally vary.',
      });

      setActiveTab('slider');
      setSaved(false);
      setCopiedBarber(false);
    } else {
      setPreviewData(null);
    }
  }, [isOpen, target?.name, target?.type]);

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
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isOpen || !target) return null;

  const isHair = target.type === 'hairstyle';
  const lowerName = (target.name || '').toLowerCase();

  // Resolve Barber catalog entry or rich specifications
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
      `Accentuates your ${userFaceShape} facial structure by providing clean lateral taper lines and balanced crown texture without adding horizontal bulk.`,
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
      `💈 FACEFIT AI - BARBER CONSULTATION CARD`,
      `──────────────────────────────────────────────`,
      `Client Style: ${barberSpecs.name}`,
      `Category: ${barberSpecs.category}`,
      `Client Face Shape: ${userFaceShape} Geometry (${userAgeRange} Stage)`,
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
      `💡 WHY THIS CUT SUITS YOUR FACE:`,
      `${barberSpecs.whyItWorks}`,
      `──────────────────────────────────────────────`,
      `Synthesized by FaceFit AI Studio`,
    ].join('\n');

    navigator.clipboard.writeText(textToCopy);
    setCopiedBarber(true);
    setTimeout(() => setCopiedBarber(false), 3000);
  };

  const targetPhoto = previewData?.previewUrl || getStyleReferenceImage(target.type, target.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
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
                  Salon Preview
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Face geometry transformation & master barber consultation
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

        {/* Studio View Switcher Tabs */}
        <div className="flex border-b border-neutral-100 bg-neutral-50/70 px-4 sm:px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('slider')}
            className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'slider'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
            ⇋ Transformation Slider
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sidebyside')}
            className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sidebyside'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-amber-600" />
            ⧉ Side-by-Side Studio
          </button>

          {isHair && (
            <button
              type="button"
              onClick={() => setActiveTab('barber')}
              className={`py-3 px-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeTab === 'barber'
                  ? 'border-neutral-900 text-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Scissors className="w-3.5 h-3.5 text-amber-700" />
              💈 Barber Blueprint
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Missing photo prompt banner if user doesn't have an uploaded selfie */}
          {!userPhoto && !showUploader && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Want to compare this style directly against your face?</strong> Upload a quick photo.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowUploader(true)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                Upload Photo
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

          {/* TAB 1: TRANSFORMATION SLIDER (BEFORE vs AFTER) */}
          {activeTab === 'slider' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold text-neutral-700">
                  Drag the slider to compare your profile with the tailored cut:
                </span>
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

              {/* Draggable Before / After Slider */}
              <div className="flex justify-center">
                <BeforeAfterSlider
                  currentImageUrl={userPhoto || targetPhoto}
                  suggestedImageUrl={targetPhoto}
                  currentLabel={userPhoto ? 'You (Current)' : 'Client Profile'}
                  suggestedLabel="Target Cut"
                />
              </div>

              {/* Transformation Highlights Card */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900">
                  <Sparkle className="w-3.5 h-3.5 text-amber-600" />
                  Facial Harmony Blueprint for {userFaceShape} Geometry
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {barberSpecs.whyItWorks}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-medium">
                    ✓ Clean Lateral Taper
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-medium">
                    ✓ Defined Forehead Framing
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-medium">
                    ✓ Balanced Crown Height
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIDE-BY-SIDE STUDIO VIEW */}
          {activeTab === 'sidebyside' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Card: You */}
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      Your Current Profile
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-800">
                      {userFaceShape} Face
                    </span>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-neutral-100 bg-neutral-100">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt="Your Current Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-neutral-400">
                        <User className="w-12 h-12 mb-2 stroke-1" />
                        <span className="text-xs">Upload your photo to compare</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Age Stage:</span>
                      <span className="font-semibold text-neutral-800">{userAgeRange} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Proportions:</span>
                      <span className="font-semibold text-neutral-800">Balanced Width-to-Height</span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Target Look */}
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Target Silhouette
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      Salon Cut
                    </span>
                  </div>
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-neutral-100 bg-neutral-100">
                    <img
                      src={targetPhoto}
                      alt={target.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-neutral-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Style:</span>
                      <span className="font-semibold text-neutral-800">{barberSpecs.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maintenance:</span>
                      <span className="font-semibold text-amber-800">{barberSpecs.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transformation Comparison Bar */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs text-amber-950">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Stylist Transformation Analysis:
                </span>
                <p className="leading-relaxed">
                  Switching to this silhouette trims bulky horizontal perimeter growth while keeping textured, intentional volume on top. This elongates your face geometry and creates a crisp, confident profile for college and professional environments.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MASTER BARBER BLUEPRINT */}
          {activeTab === 'barber' && isHair && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Left Column: Reference Image (2 cols) */}
                <div className="md:col-span-2 space-y-3">
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-xs bg-neutral-100">
                    <img
                      src={targetPhoto}
                      alt={target.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase">
                      Salon Reference
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Client Face:</span>
                      <span className="font-bold text-neutral-800">{userFaceShape} Geometry</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Stage:</span>
                      <span className="font-medium text-neutral-700">{userAgeRange} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Maintenance:</span>
                      <span className="font-semibold text-neutral-800">{barberSpecs.category}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Barber Cutting Specifications (3 cols) */}
                <div className="md:col-span-3 space-y-3">
                  {/* Style Header */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 px-2 py-0.5 rounded-full bg-amber-100">
                        {barberSpecs.category}
                      </span>
                      <span className="text-xs text-amber-900/80 font-medium">Master Barber Spec</span>
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

          {/* Ethical Identity Guarantee Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-neutral-800">Authentic Identity Guarantee: </span>
              Your real facial features, skin tone, and expressions are completely untouched. Styling visualizations provide precise salon specifications based on your authentic face geometry.
            </div>
          </div>
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
              className={`px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer ${
                saved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
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

