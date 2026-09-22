'use client';

import React, { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  currentImageUrl: string;
  suggestedImageUrl: string;
  currentLabel?: string;
  suggestedLabel?: string;
}

export function BeforeAfterSlider({
  currentImageUrl,
  suggestedImageUrl,
  currentLabel = 'Current',
  suggestedLabel = 'Suggested',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      className="relative w-full aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden select-none border border-neutral-200 shadow-md cursor-ew-resize bg-neutral-100"
    >
      {/* Background Image: Suggested Look */}
      <img
        src={suggestedImageUrl}
        alt="Suggested Look"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase pointer-events-none">
        {suggestedLabel}
      </div>

      {/* Foreground Image: Current Look (Clipped by slider position) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={currentImageUrl}
          alt="Current Look"
          className="absolute inset-0 w-full h-full object-cover max-w-none pointer-events-none"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase">
          {currentLabel}
        </div>
      </div>

      {/* Draggable Divider Line & Knob */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-neutral-800 shadow-xl flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing border border-neutral-300 transition-transform hover:scale-110"
          title="Drag left or right to compare"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
        </div>
      </div>

      {/* Subtle Hint */}
      <div className="absolute bottom-2.5 inset-x-0 text-center pointer-events-none">
        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[9px] text-white/90 font-medium">
          Drag slider to compare Current vs Suggested
        </span>
      </div>
    </div>
  );
}
