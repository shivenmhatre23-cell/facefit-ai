import React from 'react';
import { Eye, Scissors, Palette, Sparkles, Shirt, ShieldCheck } from 'lucide-react';

export function PillarsSection() {
  const pillars = [
    {
      icon: Eye,
      title: 'Facial Geometry & Proportions',
      description:
        'Analyzes jawline structure, cheekbone taper, and forehead proportions to categorize your face shape (Oval, Square, Heart, Diamond, etc.) without superficial beauty scoring.',
    },
    {
      icon: Palette,
      title: 'Seasonal Color Harmonization',
      description:
        'Calculates your undertones and contrast levels to generate a tailored 6-swatch palette with exact hex codes, recommended accent metals, and colors to avoid.',
    },
    {
      icon: Scissors,
      title: 'Actionable Barber Cards',
      description:
        'Every hairstyle recommendation comes with explicit clipper guard numbers, scissor texturing notes, and taper instructions you can hand directly to your barber.',
    },
    {
      icon: Shirt,
      title: 'Collegiate & Occasion Outfits',
      description:
        'Get complete outfit combinations including realistic Indian Rupee (₹) budget formulas, campus casual pairings, and sharp seminar presentation attire.',
    },
    {
      icon: Sparkles,
      title: 'Conversational Personal Stylist',
      description:
        'Chat with an AI stylist trained on your specific profile. Ask "What should I wear for an interview under ₹3000?" and receive tailored, real-time advice.',
    },
    {
      icon: ShieldCheck,
      title: 'Privacy & Ethical Safeguards',
      description:
        'Zero photo storage. Age is strictly estimated as an approximate bracket with confidence indicators—never stated as an absolute fact.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-700">
            Sartorial Science
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-editorial text-neutral-900 mt-2 mb-3">
            Grounded in Optical Harmony
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            FaceFit AI treats grooming as an architectural discipline—balancing contrast, silhouette, and proportions to accentuate your natural identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="luxury-card rounded-2xl p-6 bg-white border border-neutral-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-center mb-4 text-neutral-900">
                    <Icon className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-2 font-serif-editorial">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
