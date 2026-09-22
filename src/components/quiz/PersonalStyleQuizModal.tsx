'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { StyleQuizAnswers } from '@/lib/types';
import { getSavedQuizAnswers, saveQuizAnswers, DEFAULT_QUIZ_ANSWERS } from '@/lib/styleQuiz/quizStore';

interface PersonalStyleQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (answers: StyleQuizAnswers) => void;
}

const STYLE_OPTIONS: { id: StyleQuizAnswers['preferredStyle']; title: string; desc: string }[] = [
  { id: 'Smart Casual', title: 'Smart Casual', desc: 'Refined shirts, clean chinos, tailored knitwear, minimalist sneakers' },
  { id: 'Minimal', title: 'Minimalist', desc: 'Monochrome, clean lines, capsule wardrobe, zero logos' },
  { id: 'Streetwear', title: 'Modern Streetwear', desc: 'Relaxed silhouettes, boxy tees, utility layers, statement footwear' },
  { id: 'Classic', title: 'Classic Tailored', desc: 'Crisp oxfords, structured blazers, loafers, timeless cuts' },
  { id: 'Sporty', title: 'Sporty Athleisure', desc: 'Heavyweight tees, structured joggers, effortless overshirts' },
  { id: 'Traditional/Fusion', title: 'Modern Fusion', desc: 'Contemporary kurtas, Nehru jackets, modern ethnic layering' },
];

const HAIR_TIME_OPTIONS: { id: StyleQuizAnswers['hairStylingTime']; title: string; desc: string }[] = [
  { id: 'Almost none', title: 'Low Maintenance (2 mins)', desc: 'Towel dry and go. Natural texture, zero daily styling product required.' },
  { id: '5 minutes', title: 'Moderate (5-10 mins)', desc: 'Quick matte clay or sea-salt spray application with hand styling.' },
  { id: '10–15 minutes', title: 'Structured (10-15 mins)', desc: 'Blow-dry shaping, comb styling, volume control.' },
  { id: '15+ minutes', title: 'High Styling (15+ mins)', desc: 'Detailed pomade, parting, and precision grooming.' },
];

const BUDGET_OPTIONS: { id: StyleQuizAnswers['clothingBudget']; title: string; desc: string }[] = [
  { id: 'Budget', title: 'Budget Conscious', desc: '₹1,000 – ₹2,500 per essential piece. High value-per-wear essentials.' },
  { id: 'Moderate', title: 'Balanced Value', desc: '₹2,500 – ₹5,000 per staple. Durable fabrics and quality construction.' },
  { id: 'Premium', title: 'Premium Investment', desc: '₹5,000 – ₹10,000+. Long-lasting heritage materials, bespoke cuts.' },
];

const OCCASION_OPTIONS = [
  'College',
  'Internship',
  'Job Interview',
  'Client Presentation',
  'Everyday / Casual',
  'Date Night / Social',
  'Wedding / Festival',
  'Weekend Travel',
];

const COLOR_OPTIONS = [
  { name: 'Navy Blue', hex: '#1B2A4A' },
  { name: 'Olive Green', hex: '#4A533E' },
  { name: 'Espresso Brown', hex: '#3E2A24' },
  { name: 'Charcoal Grey', hex: '#2F343B' },
  { name: 'Oatmeal / Sand', hex: '#D6CDBF' },
  { name: 'Off-White', hex: '#F4F3EE' },
  { name: 'Pitch Black', hex: '#181818' },
  { name: 'Burgundy / Wine', hex: '#581D22' },
  { name: 'Sage Green', hex: '#879782' },
  { name: 'Terracotta', hex: '#A85A44' },
];

const DISLIKE_OPTIONS = [
  'Overly tight skinny jeans',
  'Loud fluorescent neons',
  'Huge brand logos / graphics',
  'Distressed ripped denim',
  'Stiff high collars',
  'Uncomfortable dress shoes',
  'Sleeveless athletic tank tops',
  'Synthetic shiny polyester',
];

export function PersonalStyleQuizModal({ isOpen, onClose, onComplete }: PersonalStyleQuizModalProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<StyleQuizAnswers>(DEFAULT_QUIZ_ANSWERS);

  useEffect(() => {
    if (isOpen) {
      const saved = getSavedQuizAnswers();
      if (saved) setAnswers(saved);
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleOccasion = (occ: string) => {
    setAnswers((prev) => {
      const exists = prev.primaryOccasions.includes(occ);
      const updated = exists
        ? prev.primaryOccasions.filter((o) => o !== occ)
        : [...prev.primaryOccasions, occ];
      return { ...prev, primaryOccasions: updated.length > 0 ? updated : [occ] };
    });
  };

  const toggleColor = (col: string) => {
    setAnswers((prev) => {
      const exists = prev.preferredColors.includes(col);
      const updated = exists
        ? prev.preferredColors.filter((c) => c !== col)
        : [...prev.preferredColors, col];
      return { ...prev, preferredColors: updated.length > 0 ? updated : [col] };
    });
  };

  const toggleDislike = (dis: string) => {
    setAnswers((prev) => {
      const exists = prev.dislikedStyles.includes(dis);
      const updated = exists
        ? prev.dislikedStyles.filter((d) => d !== dis)
        : [...prev.dislikedStyles, dis];
      return { ...prev, dislikedStyles: updated };
    });
  };

  const handleFinish = () => {
    saveQuizAnswers(answers);
    if (onComplete) onComplete(answers);
    onClose();
  };

  const totalSteps = 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 text-base">Personal Style Quiz</h3>
              <p className="text-xs text-neutral-500">
                Step {step} of {totalSteps} • Personalize your style engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-1 bg-neutral-100">
          <div
            className="h-full bg-neutral-900 transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Question Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: PREFERRED STYLE */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900">What is your primary style direction?</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Select the aesthetic that feels most authentic to your routine.</p>
              </div>
              <div className="space-y-2.5">
                {STYLE_OPTIONS.map((opt) => {
                  const selected = answers.preferredStyle === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers({ ...answers, preferredStyle: opt.id })}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        selected
                          ? 'border-neutral-900 bg-neutral-50 shadow-sm ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-neutral-900 text-sm">{opt.title}</span>
                        <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selected ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: HAIR TIME */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900">How much time do you dedicate to hair styling?</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Recommendations will balance effortless vs precision cuts.</p>
              </div>
              <div className="space-y-2.5">
                {HAIR_TIME_OPTIONS.map((opt) => {
                  const selected = answers.hairStylingTime === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers({ ...answers, hairStylingTime: opt.id })}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        selected
                          ? 'border-neutral-900 bg-neutral-50 shadow-sm ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-neutral-900 text-sm">{opt.title}</span>
                        <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selected ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900">What is your typical clothing budget per piece?</h4>
                <p className="text-xs text-neutral-500 mt-0.5">All outfit and wardrobe advice will adapt to realistic price expectations.</p>
              </div>
              <div className="space-y-2.5">
                {BUDGET_OPTIONS.map((opt) => {
                  const selected = answers.clothingBudget === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAnswers({ ...answers, clothingBudget: opt.id })}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        selected
                          ? 'border-neutral-900 bg-neutral-50 shadow-sm ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-neutral-900 text-sm">{opt.title}</span>
                        <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selected ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: PRIMARY OCCASIONS */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900">Which occasions do you dress for most often?</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Select all relevant settings.</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {OCCASION_OPTIONS.map((occ) => {
                  const selected = answers.primaryOccasions.includes(occ);
                  return (
                    <button
                      key={occ}
                      onClick={() => toggleOccasion(occ)}
                      className={`p-3 rounded-xl border text-xs font-medium text-left transition flex items-center justify-between ${
                        selected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{occ}</span>
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: PREFERRED COLORS */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900">Which colors do you enjoy wearing most?</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Our recommendation engine will prioritize these tones in outfits.</p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {COLOR_OPTIONS.map((c) => {
                  const selected = answers.preferredColors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      onClick={() => toggleColor(c.name)}
                      className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2.5 ${
                        selected
                          ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                          : 'border-neutral-200 hover:bg-neutral-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-xs font-medium text-neutral-800">{c.name}</span>
                      </div>
                      {selected && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: DISLIKED STYLES */}
          {step === 6 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-neutral-900">Are there any styles or garments you dislike?</h4>
                <p className="text-xs text-neutral-500 mt-0.5">FaceFit AI will actively exclude these elements from future proposals.</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {DISLIKE_OPTIONS.map((dis) => {
                  const selected = answers.dislikedStyles.includes(dis);
                  return (
                    <button
                      key={dis}
                      onClick={() => toggleDislike(dis)}
                      className={`p-3 rounded-xl border text-xs text-left font-medium transition flex items-center justify-between ${
                        selected
                          ? 'border-rose-300 bg-rose-50 text-rose-800'
                          : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span>{dis}</span>
                      {selected && <span className="text-rose-600 text-xs font-semibold">Excluded</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-xs font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <button
              onClick={() => setAnswers(DEFAULT_QUIZ_ANSWERS)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-neutral-600 text-xs transition"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition shadow-md"
            >
              <Check className="w-4 h-4" />
              Save Style Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
