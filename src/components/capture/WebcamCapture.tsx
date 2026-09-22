'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Camera,
  RefreshCw,
  AlertCircle,
  Laptop,
  Smartphone,
  ChevronDown,
  FlipHorizontal,
  Check,
  Video,
} from 'lucide-react';

interface WebcamCaptureProps {
  onCapture: (base64Image: string) => void;
}

const PREFERRED_CAM_KEY = 'facefit_preferred_camera_id';

function scoreCamera(device: MediaDeviceInfo): number {
  const label = (device.label || '').toLowerCase();
  let score = 0;

  // High preference for laptop built-in webcams
  if (label.includes('integrated') || label.includes('internal') || label.includes('built-in')) score += 60;
  if (label.includes('laptop') || label.includes('notebook')) score += 50;
  if (label.includes('hd webcam') || label.includes('hd camera') || label.includes('webcam')) score += 40;
  if (label.includes('front') || label.includes('user')) score += 20;

  // Penalize mobile, phone link, and virtual cameras
  if (label.includes('phone') || label.includes('mobile')) score -= 60;
  if (label.includes('link to windows') || label.includes('phone link') || label.includes('link')) score -= 50;
  if (label.includes('droidcam') || label.includes('camo') || label.includes('iriun') || label.includes('epoccam')) score -= 60;
  if (label.includes('virtual') || label.includes('obs')) score -= 70;
  if (label.includes('back') || label.includes('rear') || label.includes('environment')) score -= 20;

  return score;
}

function getCameraTypeLabel(label: string): { type: 'laptop' | 'phone' | 'external'; cleanName: string } {
  const l = label.toLowerCase();
  if (l.includes('phone') || l.includes('mobile') || l.includes('link to windows')) {
    return { type: 'phone', cleanName: label || 'Mobile Camera' };
  }
  if (l.includes('integrated') || l.includes('internal') || l.includes('built-in') || l.includes('laptop') || l.includes('hd webcam')) {
    return { type: 'laptop', cleanName: label || 'Laptop Webcam' };
  }
  return { type: 'external', cleanName: label || 'Camera Device' };
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [activeCameraLabel, setActiveCameraLabel] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);

  // Helper to stop current video stream
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Update device list from navigator.mediaDevices
  const refreshDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return [];
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoDevices);
      return videoDevices;
    } catch {
      return [];
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(
    async (targetDeviceId?: string) => {
      setCameraError(null);
      setIsReady(false);
      stopStream();

      try {
        const constraints: MediaStreamConstraints = {
          audio: false,
          video: targetDeviceId
            ? {
                deviceId: { exact: targetDeviceId },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              }
            : {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = mediaStream;

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(() => {});
            setIsReady(true);
          };
        }

        // Get active track details
        const videoTrack = mediaStream.getVideoTracks()[0];
        const activeLabel = videoTrack?.label || '';
        setActiveCameraLabel(activeLabel);

        // Fetch refreshed device list with granted labels
        const updatedDevices = await refreshDevices();

        // If no target device was chosen yet, check if Windows selected a phone camera while a laptop webcam exists!
        if (!targetDeviceId && updatedDevices.length > 1) {
          const sorted = [...updatedDevices].sort((a, b) => scoreCamera(b) - scoreCamera(a));
          const bestLaptopCam = sorted[0];

          // If the best camera is different from what was opened (e.g. phone was opened instead of laptop webcam)
          if (
            bestLaptopCam &&
            bestLaptopCam.deviceId &&
            bestLaptopCam.label !== activeLabel &&
            scoreCamera(bestLaptopCam) > 0
          ) {
            // Switch automatically to the laptop webcam
            setSelectedDeviceId(bestLaptopCam.deviceId);
            localStorage.setItem(PREFERRED_CAM_KEY, bestLaptopCam.deviceId);
            return startCamera(bestLaptopCam.deviceId);
          }
        }

        // Keep selectedDeviceId in sync
        const currentDevice = updatedDevices.find((d) => d.label === activeLabel);
        if (currentDevice?.deviceId) {
          setSelectedDeviceId(currentDevice.deviceId);
          localStorage.setItem(PREFERRED_CAM_KEY, currentDevice.deviceId);
        }
      } catch (err: unknown) {
        console.error('Camera stream error:', err);
        stopStream();
        setCameraError(
          'Could not access the laptop camera. Please make sure camera permissions are enabled in your browser or select an alternate camera from the list.'
        );
      }
    },
    [stopStream, refreshDevices]
  );

  // Initial startup
  useEffect(() => {
    let preferredId: string | null = null;
    if (typeof window !== 'undefined') {
      preferredId = localStorage.getItem(PREFERRED_CAM_KEY);
    }

    startCamera(preferredId || undefined);

    return () => {
      stopStream();
    };
  }, []);

  // Listen to device changes (e.g. plugged/unplugged webcams)
  useEffect(() => {
    const handleDeviceChange = () => {
      refreshDevices();
    };

    navigator.mediaDevices?.addEventListener('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [refreshDevices]);

  const handleSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setShowDeviceDropdown(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PREFERRED_CAM_KEY, deviceId);
    }
    startCamera(deviceId);
  };

  const handleSnap = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror image horizontally if mirroring is enabled
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCapture(dataUrl);
  };

  // Find if a laptop camera is available among devices
  const laptopCam = devices.find((d) => scoreCamera(d) > 0);
  const isCurrentlyUsingPhone = activeCameraLabel.toLowerCase().includes('phone') || activeCameraLabel.toLowerCase().includes('link');

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {/* Camera Selection & Status Bar */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 px-1">
        {/* Device Switcher Dropdown */}
        {devices.length > 1 ? (
          <div className="relative flex-1">
            <button
              onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
              className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white border border-neutral-200/90 text-xs font-medium text-neutral-800 hover:border-neutral-300 transition shadow-2xs"
            >
              <div className="flex items-center gap-1.5 truncate">
                {isCurrentlyUsingPhone ? (
                  <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                ) : (
                  <Laptop className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
                <span className="truncate">
                  {activeCameraLabel ? getCameraTypeLabel(activeCameraLabel).cleanName : 'Select Camera'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </button>

            {showDeviceDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-1.5 bg-white border border-neutral-200 rounded-2xl shadow-xl z-50 space-y-1 animate-fadeIn text-xs">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1 block">
                  Available Cameras
                </span>
                {devices.map((device, idx) => {
                  const info = getCameraTypeLabel(device.label);
                  const isSelected = device.deviceId === selectedDeviceId || device.label === activeCameraLabel;
                  return (
                    <button
                      key={device.deviceId || idx}
                      onClick={() => handleSelectDevice(device.deviceId)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                        isSelected
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'hover:bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {info.type === 'phone' ? (
                          <Smartphone className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-neutral-500'}`} />
                        ) : (
                          <Laptop className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-neutral-500'}`} />
                        )}
                        <span className="truncate">{info.cleanName}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
            <Laptop className="w-3.5 h-3.5 text-neutral-400" />
            <span className="truncate">{activeCameraLabel || 'Laptop Webcam'}</span>
          </div>
        )}

        {/* Mirror Toggle */}
        <button
          onClick={() => setIsMirrored(!isMirrored)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
            isMirrored
              ? 'bg-neutral-100 text-neutral-800 border-neutral-200'
              : 'bg-white text-neutral-500 border-neutral-200 hover:text-neutral-800'
          }`}
          title="Toggle mirror view"
        >
          <FlipHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Mirror</span>
        </button>
      </div>

      {/* Switch to Laptop Cam Quick Alert (if phone camera is active) */}
      {isCurrentlyUsingPhone && laptopCam && (
        <div className="w-full max-w-md p-3 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-center justify-between gap-3 text-xs text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Currently using phone camera. Switch to your laptop webcam?</span>
          </div>
          <button
            onClick={() => handleSelectDevice(laptopCam.deviceId)}
            className="px-3 py-1 rounded-xl bg-amber-900 text-white font-semibold text-[11px] shrink-0 hover:bg-amber-800 transition"
          >
            Use Laptop Cam
          </button>
        </div>
      )}

      {/* Camera Viewfinder */}
      {cameraError ? (
        <div className="w-full max-w-md p-8 rounded-3xl bg-amber-50/90 border border-amber-200 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-semibold text-neutral-900 text-sm">Camera Access Paused</h4>
            <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
              {cameraError}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={() => startCamera()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Laptop Camera
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-950 shadow-xl border border-neutral-800">
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover transition-transform duration-200 ${
              isMirrored ? '-scale-x-100' : ''
            }`}
          />

          {/* Oval Framing Guide Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div className="w-56 h-76 sm:w-64 sm:h-84 rounded-[50%] border-2 border-dashed border-white/60 shadow-[0_0_24px_rgba(0,0,0,0.5)] transition-all" />
            <span className="mt-4 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-[11px] text-white/90 font-medium tracking-wide">
              Center face within oval
            </span>
          </div>

          {/* Top Controls Overlay */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {devices.length > 1 && (
              <button
                onClick={() => {
                  const currentIndex = devices.findIndex((d) => d.deviceId === selectedDeviceId);
                  const nextIndex = (currentIndex + 1) % devices.length;
                  handleSelectDevice(devices[nextIndex].deviceId);
                }}
                className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                title="Switch to next camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom Snap Button */}
          <div className="absolute bottom-6 inset-x-0 flex items-center justify-center pointer-events-auto z-10">
            <button
              onClick={handleSnap}
              disabled={!isReady}
              className="group flex items-center justify-center w-16 h-16 rounded-full bg-white text-neutral-900 shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
              title="Take Photo"
              aria-label="Capture Photo"
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
