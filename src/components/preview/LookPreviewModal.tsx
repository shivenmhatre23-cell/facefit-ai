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
  ChevronUp,
  ChevronDown,
  User,
} from 'lucide-react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { LookPreviewResult } from '@/lib/types';
import { saveLookRecord } from '@/lib/saved/looksStore';

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
      pieces?: { item: string; color: string }[];
      maintenance?: string;
      occasion?: string;
      hairColor?: string;
      garmentColor?: string;
      verticalOffset?: number;
      scale?: number;
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
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<LookPreviewResult | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copiedBarber, setCopiedBarber] = useState(false);

  // Fine-tuning state
  const [verticalOffset, setVerticalOffset] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize photo and settings when modal opens
  useEffect(() => {
    if (isOpen && target) {
      // 1. Resolve user's actual photo
      let resolvedPhoto: string | null = target.baseImage || null;
      if (!resolvedPhoto && typeof window !== 'undefined') {
        resolvedPhoto = sessionStorage.getItem('facefit_preview_image');
      }
      setUserPhoto(resolvedPhoto);

      // Default color
      const defaultColor =
        target.type === 'hairstyle'
          ? target.details?.hairColor || '#241C18'
          : target.details?.garmentColor || target.details?.color || '#263445';
      setSelectedColor(defaultColor);
      setVerticalOffset(0);
      setScale(1.0);

      generatePreview(resolvedPhoto || undefined, defaultColor, 0, 1.0);
      setSaved(false);
      setCopiedBarber(false);
    } else {
      setPreviewData(null);
      setError(null);
    }
  }, [isOpen, target?.name, target?.type]);

  const generatePreview = async (
    photoToUse?: string,
    colorOverride?: string,
    offsetOverride?: number,
    scaleOverride?: number
  ) => {
    if (!target) return;
    setLoading(true);
    setError(null);

    const activePhoto = photoToUse !== undefined ? photoToUse : userPhoto || undefined;
    const activeColor = colorOverride || selectedColor;
    const activeOffset = offsetOverride !== undefined ? offsetOverride : verticalOffset;
    const activeScale = scaleOverride !== undefined ? scaleOverride : scale;

    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: target.type,
          targetName: target.name,
          targetDetails: {
            ...(target.details || {}),
            color: activeColor,
            hairColor: activeColor,
            garmentColor: activeColor,
            verticalOffset: activeOffset,
            scale: activeScale,
          },
          baseImage: activePhoto,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to synthesize style preview.');
      }

      setPreviewData(data.result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Visual preview synthesis encountered an unexpected error.';
      setError(message);
    } finally {
      setLoading(false);
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
        generatePreview(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    generatePreview(userPhoto || undefined, hex, verticalOffset, scale);
  };

  const handleNudge = (deltaY: number) => {
    const newOffset = Math.max(-60, Math.min(60, verticalOffset + deltaY));
    setVerticalOffset(newOffset);
    generatePreview(userPhoto || undefined, selectedColor, newOffset, scale);
  };

  const handleScale = (deltaScale: number) => {
    const newScale = Math.max(0.85, Math.min(1.2, Number((scale + deltaScale).toFixed(2))));
    setScale(newScale);
    generatePreview(userPhoto || undefined, selectedColor, verticalOffset, newScale);
  };

  if (!isOpen || !target) return null;

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

  const handleCopyBarberNotes = () => {
    const notes = [
      `FACFIT AI - BARBER SPEC CARD`,
      `Style: ${target.name}`,
      `Details: ${target.details?.style || 'Textured natural'}`,
      `Barber Notes: ${target.details?.barberNotes || 'Taper fade on sides (#2 guard down to #1 at neckline), maintain natural length on top, textured finish.'}`,
      `Maintenance: ${target.details?.maintenance || 'Medium maintenance (3-4 weeks)'}`,
    ].join('\n');

    navigator.clipboard.writeText(notes);
    setCopiedBarber(true);
    setTimeout(() => setCopiedBarber(false), 2500);
  };

  const isHair = target.type === 'hairstyle';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-editorial font-bold text-neutral-900 text-base sm:text-lg">
                  {target.name}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Try On You
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {userPhoto ? 'Styled directly on your uploaded portrait' : 'Visual style simulation'}
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

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Missing photo prompt banner if user doesn't have an uploaded selfie */}
          {!userPhoto && !showUploader && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Want to see this style on your own face?</strong> Snap or upload a quick photo.
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
                  className="text-neutral-400 hover:text-neutral-600 text-xs"
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
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" /> Choose File
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="relative w-14 h-14 mb-3">
                <div className="absolute inset-0 rounded-full border-3 border-neutral-200 border-t-neutral-900 animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-amber-600 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">
                {userPhoto ? 'Applying Style to Your Portrait...' : 'Generating Style Simulation...'}
              </p>
              <p className="text-xs text-neutral-400 max-w-sm mt-1">
                Aligning {target.name} over natural facial contours with identity preservation.
              </p>
            </div>
          ) : error ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-neutral-900">Preview Synthesis Paused</h4>
              <p className="text-sm text-neutral-500 max-w-md mx-auto">{error}</p>
              <button
                onClick={() => generatePreview()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          ) : previewData ? (
            <div className="space-y-4">
              {/* Draggable Before / After Slider */}
              <div className="flex justify-center">
                <BeforeAfterSlider
                  currentImageUrl={userPhoto || previewData.originalUrl || previewData.previewUrl}
                  suggestedImageUrl={previewData.previewUrl}
                  currentLabel={userPhoto ? 'Before (You)' : 'Original'}
                  suggestedLabel={userPhoto ? 'After (Styled)' : 'Suggested'}
                />
              </div>

              {/* Interactive Fine-Tuning Bar (Nudge Up/Down + Tone Selector) */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-700" />
                    Fine-Tune Fit & Tone
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

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {/* Color Swatch Options */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-neutral-500 mr-1">
                      {isHair ? 'Hair Tone:' : 'Color:'}
                    </span>
                    {(isHair ? HAIR_COLOR_PRESETS : OUTFIT_COLOR_PRESETS).map((preset) => (
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

                  {/* Alignment / Position Controls */}
                  <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-600">
                    <span className="mr-1">Position:</span>
                    <button
                      type="button"
                      onClick={() => handleNudge(-8)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 transition cursor-pointer"
                      title="Nudge upward"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNudge(8)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 transition cursor-pointer"
                      title="Nudge downward"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScale(0.04)}
                      className="px-2 py-1 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-[10px] font-bold cursor-pointer"
                      title="Increase size"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScale(-0.04)}
                      className="px-2 py-1 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 text-[10px] font-bold cursor-pointer"
                      title="Decrease size"
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>

              {/* Mandatory AI Disclaimer Badge */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-800">Ethical Identity Guarantee: </span>
                  {previewData.disclaimer}
                </div>
              </div>

              {/* Barber Spec Quick Card if hairstyle */}
              {target.type === 'hairstyle' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
                      <Scissors className="w-3.5 h-3.5" />
                      Barber Ready Spec
                    </div>
                    <p className="text-xs text-amber-800/80">
                      {target.details?.barberNotes || 'Taper fade (#2 guard to #1 neckline), scissor textured top'}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyBarberNotes}
                    className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition flex items-center gap-1 shrink-0 ml-3 cursor-pointer"
                  >
                    {copiedBarber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Scissors className="w-3.5 h-3.5" />}
                    {copiedBarber ? 'Copied' : 'Copy Spec'}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
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

