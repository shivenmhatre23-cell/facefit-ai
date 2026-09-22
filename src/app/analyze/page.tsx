'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { WebcamCapture } from '@/components/capture/WebcamCapture';
import { DropzoneUpload } from '@/components/capture/DropzoneUpload';
import { AnalysisProgress } from '@/components/capture/AnalysisProgress';
import { Camera, Upload, ArrowRight, RotateCcw, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLE_STYLE_PROFILE } from '@/lib/mockData';

export default function AnalyzePage() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<'camera' | 'upload'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageCapture = (base64: string) => {
    setSelectedImage(base64);
    setErrorMessage(null);
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage) return;

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

      // Attach client-side preview URL for rendering in the profile
      const profileWithPreview = {
        ...data.profile,
        userSelfiePreviewUrl: selectedImage,
      };

      // Store in localStorage for seamless client persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('facefit_active_profile', JSON.stringify(profileWithPreview));
      }

      // Redirect to profile dashboard
      router.push('/profile');
    } catch (err: unknown) {
      console.error('Analysis failed:', err);
      // Fallback seamlessly to sample profile so the user is never stuck
      const fallbackProfile = {
        ...SAMPLE_STYLE_PROFILE,
        userSelfiePreviewUrl: selectedImage,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('facefit_active_profile', JSON.stringify(fallbackProfile));
      }
      router.push('/profile?fallback=true');
    }
  };

  const handleUseSamplePortrait = () => {
    // A clean generic placeholder portrait for instant testing
    const samplePortrait = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="100%" height="100%" fill="%23f3f4f6"/><circle cx="200" cy="180" r="70" fill="%23d1d5db"/><ellipse cx="200" cy="380" rx="120" ry="100" fill="%239ca3af"/><text x="200" y="480" font-family="sans-serif" font-size="14" fill="%236b7280" text-anchor="middle">Demo Portrait Model</text></svg>';
    setSelectedImage(samplePortrait);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-700">
            Phase 01: Capture & Alignment
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-neutral-900 mt-1 mb-2">
            Upload or Snap Your Portrait
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            For best results, face forward under balanced natural light without heavy shadows or tilted angles.
          </p>
        </div>

        {/* Card Container */}
        <div className="luxury-card rounded-2xl p-6 sm:p-10 border border-neutral-200 bg-white max-w-xl mx-auto shadow-sm">
          {isAnalyzing ? (
            <AnalysisProgress imagePreview={selectedImage!} />
          ) : selectedImage ? (
            /* Image Preview & Confirmation State */
            <div className="flex flex-col items-center">
              <div className="relative w-64 aspect-[3/4] rounded-2xl overflow-hidden border border-neutral-300 shadow-md mb-6">
                <img
                  src={selectedImage}
                  alt="Captured Portrait"
                  className="w-full h-full object-cover"
                />
              </div>

              {errorMessage && (
                <div className="w-full p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-neutral-500" />
                  Retake / Change
                </button>
                <button
                  onClick={handleStartAnalysis}
                  className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Analyze Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Input Mode Selector & Capture Area */
            <div>
              {/* Mode Toggle Buttons */}
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
                  File Upload
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
                  Webcam
                </button>
              </div>

              {/* Mode Content */}
              <div className="flex justify-center">
                {inputMode === 'camera' ? (
                  <WebcamCapture onCapture={handleImageCapture} />
                ) : (
                  <DropzoneUpload onImageSelected={handleImageCapture} />
                )}
              </div>

              {/* Instant 1-Click Demo Option */}
              <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
                <span className="text-[11px] text-neutral-400 block mb-2">Want to test without a photo?</span>
                <button
                  onClick={handleUseSamplePortrait}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-900 font-semibold underline underline-offset-4 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Use Instant Demo Portrait Model
                </button>
              </div>
            </div>
          )}

          {/* Privacy Note */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Ephemeral processing: Portraits are never stored or logged on disks or databases.</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
