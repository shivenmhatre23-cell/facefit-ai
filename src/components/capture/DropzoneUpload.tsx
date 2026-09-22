'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';

interface DropzoneUploadProps {
  onImageSelected: (base64Image: string) => void;
}

export function DropzoneUpload({ onImageSelected }: DropzoneUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Client-side image compression & resizing
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1280;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onImageSelected(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-amber-600 bg-amber-50/50 scale-[1.01]'
            : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/60 hover:bg-neutral-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-center text-amber-700 mb-4 group-hover:scale-105 transition-transform">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h4 className="text-sm font-semibold text-neutral-900 mb-1">
          Upload a clear portrait or selfie
        </h4>
        <p className="text-xs text-neutral-500 max-w-xs mb-4">
          Drag & drop your file here, or browse your files. Best with front-facing natural light.
        </p>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-white border border-neutral-200 text-neutral-700 shadow-2xs">
          <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
          Supports JPG, PNG, WebP up to 10MB
        </span>
      </div>
    </div>
  );
}
