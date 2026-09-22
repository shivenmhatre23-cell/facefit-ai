'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Bookmark, Check, ShieldCheck, Scissors, AlertCircle, RefreshCw } from 'lucide-react';
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
    };
    baseImage?: string;
  } | null;
}

export function LookPreviewModal({ isOpen, onClose, target }: LookPreviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<LookPreviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copiedBarber, setCopiedBarber] = useState(false);

  useEffect(() => {
    if (isOpen && target) {
      generatePreview();
      setSaved(false);
      setCopiedBarber(false);
    } else {
      setPreviewData(null);
      setError(null);
    }
  }, [isOpen, target?.name, target?.type]);

  const generatePreview = async () => {
    if (!target) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: target.type,
          targetName: target.name,
          targetDetails: target.details || {},
          baseImage: target.baseImage,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-neutral-900 text-base">{target.name}</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 capitalize">
                  {target.type} Preview
                </span>
              </div>
              <p className="text-xs text-neutral-500">Interactive visual style preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-neutral-200 border-t-neutral-900 animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-neutral-800 animate-pulse" />
              </div>
              <p className="font-medium text-neutral-800">Generating Identity-Preserving Preview...</p>
              <p className="text-xs text-neutral-400 max-w-sm mt-1">
                Synthesizing {target.name} while preserving facial structure and skin tone.
              </p>
            </div>
          ) : error ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-neutral-900">Preview Generation Paused</h4>
              <p className="text-sm text-neutral-500 max-w-md mx-auto">{error}</p>
              <button
                onClick={generatePreview}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          ) : previewData ? (
            <div className="space-y-4">
              {/* Draggable Slider */}
              <div className="flex justify-center">
                <BeforeAfterSlider
                  currentImageUrl={previewData.originalUrl || '/sample-portrait.jpg'}
                  suggestedImageUrl={previewData.previewUrl}
                  currentLabel="Current"
                  suggestedLabel="Suggested"
                />
              </div>

              {/* Mandatory AI Disclaimer Badge */}
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-neutral-800">Ethical AI Notice: </span>
                  {previewData.disclaimer}
                </div>
              </div>

              {/* Style Notes & Barber Card snippet */}
              {previewData.styleNotes && previewData.styleNotes.length > 0 && (
                <div className="p-4 rounded-2xl bg-neutral-50/50 border border-neutral-100 space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Styling Rationale</h4>
                  <ul className="space-y-1 text-xs text-neutral-700">
                    {previewData.styleNotes.map((note, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Barber Spec Quick Card if hairstyle */}
              {target.type === 'hairstyle' && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
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
                    className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium transition flex items-center gap-1 flex-shrink-0 ml-3"
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
            className="px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 text-xs font-medium transition"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveLook}
              disabled={loading || !previewData}
              className={`px-4 py-2 rounded-xl text-xs font-medium inline-flex items-center gap-1.5 transition ${
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
