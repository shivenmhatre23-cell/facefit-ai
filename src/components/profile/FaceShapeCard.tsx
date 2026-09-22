import React from 'react';
import { StyleProfile } from '@/lib/types';
import { ScanFace, Check, Eye, UserCheck } from 'lucide-react';

interface FaceShapeCardProps {
  profile: StyleProfile;
}

export function FaceShapeCard({ profile }: FaceShapeCardProps) {
  const { faceGeometry, hairAnalysis, facialHairAnalysis, observations } = profile;

  return (
    <div className="luxury-card rounded-2xl p-6 sm:p-7 bg-white border border-neutral-200/90 shadow-2xs h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <ScanFace className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Geometry & Features
              </span>
              <h3 className="text-base font-serif-editorial font-bold text-neutral-900">
                {faceGeometry.shape} Face Structure
              </h3>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200">
            {faceGeometry.confidence} confidence
          </span>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed mb-4">
          {faceGeometry.proportionsSummary}
        </p>

        {/* Bullet characteristics */}
        <div className="space-y-2 mb-6">
          {faceGeometry.featuresNotes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-600">
              <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hair & Facial Hair Snapshot */}
      <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-0.5">
            Hairline & Texture
          </span>
          <p className="font-semibold text-neutral-900 text-[11px]">
            {hairAnalysis.length} • {hairAnalysis.texture}
          </p>
          <p className="text-[10px] text-neutral-500 truncate mt-0.5">
            {hairAnalysis.volume} volume
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/60">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block mb-0.5">
            Facial Hair
          </span>
          <p className="font-semibold text-neutral-900 text-[11px]">
            {facialHairAnalysis.type}
          </p>
          <p className="text-[10px] text-neutral-500 truncate mt-0.5">
            {facialHairAnalysis.density || 'Natural density'}
          </p>
        </div>
      </div>
    </div>
  );
}
