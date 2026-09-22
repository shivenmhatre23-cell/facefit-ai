import React from 'react';
import { Camera, Cpu, Sparkles } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      icon: Camera,
      title: 'Snap or Upload a Portrait',
      desc: 'Use your front camera with our alignment guide or upload an existing well-lit portrait. Your image is processed entirely in memory.',
    },
    {
      num: '02',
      icon: Cpu,
      title: 'Multimodal Feature Extraction',
      desc: 'Our vision pipeline computes face geometry, hair density, visible beard characteristics, and undertones without saving personal biometric data.',
    },
    {
      num: '03',
      icon: Sparkles,
      title: 'Explore & Chat with Your Stylist',
      desc: 'Receive your bespoke Style Profile, copy your barber instruction cards, and interact with the conversational AI stylist for any outfit query.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-700">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-editorial text-neutral-900 mt-2 mb-3">
            How FaceFit AI Works
          </h2>
          <p className="text-sm text-neutral-500">
            From raw selfie to personalized personal stylist in under thirty seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative flex flex-col p-6 rounded-2xl bg-neutral-50/70 border border-neutral-200/80">
                <span className="text-4xl font-serif-editorial font-bold text-neutral-200 mb-4 select-none">
                  {step.num}
                </span>
                <div className="w-9 h-9 rounded-lg bg-white border border-neutral-200 flex items-center justify-center mb-4 text-amber-700 shadow-2xs">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2 font-serif-editorial">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
