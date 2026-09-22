'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { WebcamCapture } from '@/components/capture/WebcamCapture';
import { DropzoneUpload } from '@/components/capture/DropzoneUpload';
import { AnalysisProgress } from '@/components/capture/AnalysisProgress';
import { Camera, Upload, ArrowRight, RotateCcw, ShieldCheck, Sparkles, Trash2, AlertCircle } from 'lucide-react';
import { SAMPLE_STYLE_PROFILE } from '@/lib/mockData';

export default function AnalyzePage() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageCapture = (base64: string) => {
    setSelectedImage(base64);
    setErrorMessage(null);
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage || isAnalyzing) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage }),
      });

      const data = await response.json();

      if (!response.ok || !data.profile) {
        throw new Error(data.error || 'Failed to analyze portrait.');
      }

      // PRIVACY HARDENING: Store user photo preview ONLY in ephemeral sessionStorage.
      // Do NOT persist raw facial base64 to unencrypted permanent localStorage.
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('facefit_preview_image', selectedImage);

        // Store structured profile JSON (without embedding the raw face image) in localStorage
        const profileWithoutRawPhoto = {
          ...data.profile,
          userSelfiePreviewUrl: undefined,
        };
        localStorage.setItem('facefit_active_profile', JSON.stringify(profileWithoutRawPhoto));
      }

      router.push('/profile');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      console.warn('Analysis pipeline warning:', msg);

      // In case of rate limit or explicit error, show message to user rather than silent failure
      if (msg.includes('rate limit') || msg.includes('Wait') || msg.includes('Too many')) {
        setErrorMessage(msg);
        setIsAnalyzing(false);
        return;
      }

      // Resilient fallback for demo continuity
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('facefit_preview_image', selectedImage);
        localStorage.setItem('facefit_active_profile', JSON.stringify(SAMPLE_STYLE_PROFILE));
      }
      router.push('/profile?fallback=true');
    }
  };

  const handleUseDemoModel = () => {
    // Standard high-contrast synthetic sample avatar
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f5f5f4';
      ctx.fillRect(0, 0, 400, 500);
      ctx.fillStyle = '#d6d3d1';
      ctx.beginPath();
      ctx.arc(200, 190, 75, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a8a29e';
      ctx.beginPath();
      ctx.ellipse(200, 400, 130, 110, 0, 0, Math.PI * 2);
      ctx.fill();
      setSelectedImage(canvas.toDataURL('image/jpeg', 0.85));
      setErrorMessage(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-700">
            Selfie Analysis
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-neutral-900 mt-1 mb-2">
            Upload or Capture Your Photo
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            For highest precision, look straight ahead under natural lighting without sunglasses or heavy filters.
          </p>
        </div>

        {/* The Card Container */}
        <div className="luxury-card rounded-2xl p-6 sm:p-10 border border-neutral-200 bg-white max-w-xl mx-auto shadow-sm">
          {isAnalyzing ? (
            <AnalysisProgress imagePreview={selectedImage!} />
          ) : selectedImage ? (
            /* Preview State with Remove / Re-upload support */
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="relative w-64 aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-300 shadow-md mb-6">
                <img
                  src={selectedImage}
                  alt="Portrait Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors cursor-pointer"
                  title="Remove and choose another image"
                  aria-label="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {errorMessage && (
                <div className="w-full p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  disabled={isAnalyzing}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4 text-neutral-400" />
                  Remove / Re-upload
                </button>
                <button
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Build Style Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Upload / Capture Selector */
            <div>
              <div className="flex p-1 rounded-xl bg-neutral-100 border border-neutral-200/80 mb-6 max-w-xs mx-auto">
                <button
                  onClick={() => setInputMode('upload')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inputMode === 'upload'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Drag & Drop
                </button>
                <button
                  onClick={() => setInputMode('camera')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    inputMode === 'camera'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Live Camera
                </button>
              </div>

              <div className="flex justify-center">
                {inputMode === 'camera' ? (
                  <WebcamCapture onCapture={handleImageCapture} />
                ) : (
                  <DropzoneUpload onImageSelected={handleImageCapture} />
                )}
              </div>

              {/* Instant 1-Click Demo Option */}
              <div className="mt-8 pt-5 border-t border-neutral-100 text-center">
                <span className="text-[11px] text-neutral-400 block mb-1.5">Don't have a photo handy right now?</span>
                <button
                  onClick={handleUseDemoModel}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-4 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Use Demo Portrait Model
                </button>
              </div>
            </div>
          )}

          {/* Verbatim Privacy Notice */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-500 text-center leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Your photo is used to generate your Style Profile. We minimize storage and do not use your image for unrelated purposes.</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
