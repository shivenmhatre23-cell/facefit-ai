import React from 'react';
import { StyleProfile } from '@/lib/types';
import { Glasses, Droplets } from 'lucide-react';

interface GroomingAndAccessoriesProps {
  profile: StyleProfile;
}

export function GroomingAndAccessories({ profile }: GroomingAndAccessoriesProps) {
  const accessories = Array.isArray(profile?.accessories) && profile.accessories.length > 0
    ? profile.accessories
    : [
        {
          type: 'Eyewear',
          recommendation: 'Subtle rectangular or square metal frames',
          whyItComplements: 'Provides gentle geometry that frames facial contour with precision.',
        },
      ];

  const grooming = Array.isArray(profile?.grooming) && profile.grooming.length > 0
    ? profile.grooming
    : [
        {
          category: 'Skincare',
          tip: 'Lightweight hydrating moisturizer with broad-spectrum SPF 50.',
          frequency: 'Every Morning',
        },
        {
          category: 'Beard / Shaving',
          tip: 'Clean cheekline contours and neckline grooming to preserve jawline sharpness.',
          frequency: 'Twice Weekly',
        },
      ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      {/* Accessories Section */}
      <div className="luxury-card rounded-2xl p-6 sm:p-7 bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <Glasses className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Harmonizing Accents
              </span>
              <h3 className="text-base font-serif-editorial font-bold text-neutral-900">
                Eyewear & Accessory Geometry
              </h3>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {accessories.map((acc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  {acc.type}
                </span>
                <p className="font-semibold text-neutral-900 mb-1 leading-snug break-words">
                  {acc.recommendation}
                </p>
                <p className="text-[11px] text-neutral-500 leading-relaxed break-words">
                  {acc.whyItComplements}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
          Tip: Match accessory metal finishes (watch bezel, chain, glasses wire) to your recommended palette metals.
        </div>
      </div>

      {/* Grooming & Care Protocol */}
      <div className="luxury-card rounded-2xl p-6 sm:p-7 bg-white border border-neutral-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <Droplets className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Grooming Protocol
              </span>
              <h3 className="text-base font-serif-editorial font-bold text-neutral-900">
                Daily & Weekly Regimen
              </h3>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            {grooming.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 text-xs flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    {item.category}
                  </span>
                  <p className="text-neutral-800 text-[11px] leading-relaxed break-words">
                    {item.tip}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white border border-neutral-200 text-neutral-600 shrink-0">
                  {item.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
          Consistency is key: Subtle grooming maintenance compounds into effortless everyday poise.
        </div>
      </div>
    </div>
  );
}
