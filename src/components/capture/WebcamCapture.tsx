'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (base64Image: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initCamera() {
      setCameraError(null);
      setIsReady(false);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsReady(true);
          };
        }
      } catch (err: unknown) {
        console.error('Camera access error:', err);
        setCameraError(
          'Could not access camera. Please ensure camera permissions are granted or use the file upload option.'
        );
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleSnap = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // If front-facing camera, mirror back horizontally to match user perspective
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    onCapture(dataUrl);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="flex flex-col items-center w-full">
      {cameraError ? (
        <div className="w-full p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
          <p className="text-xs text-amber-900 leading-relaxed max-w-sm mx-auto">{cameraError}</p>
        </div>
      ) : (
        <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shadow-lg border border-neutral-800">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
          />

          {/* Oval Framing Guide Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div className="w-56 h-76 sm:w-64 sm:h-84 rounded-[50%] border-2 border-dashed border-white/70 shadow-2xl transition-all" />
            <span className="mt-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] text-white/90 font-medium tracking-wide">
              Center face within oval
            </span>
          </div>

          {/* Top Controls */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={toggleFacingMode}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-colors"
              title="Switch camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Snap Button */}
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center pointer-events-auto">
            <button
              onClick={handleSnap}
              disabled={!isReady}
              className="group flex items-center justify-center w-16 h-16 rounded-full bg-white text-neutral-900 shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              title="Take Photo"
            >
              <div className="w-13 h-13 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                <Camera className="w-6 h-6 text-neutral-900 group-hover:scale-110 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
