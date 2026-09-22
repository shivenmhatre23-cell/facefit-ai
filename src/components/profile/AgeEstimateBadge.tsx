import React, { useState } from 'react';
import { AgeEstimate } from '@/lib/types';
import { Info, Sliders, Check, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { addLearnedNote } from '@/lib/stylist/memoryStore';

interface AgeEstimateBadgeProps {
  age: AgeEstimate;
  onAgeUpdate?: (newRange: string) => void;
}

const AGE_PRESETS = [
  {
    range: '15 - 18 years',
    stage: 'High School / Teen',
    detail: 'Youthful low-maintenance cuts, clean casual campus wear',
  },
  {
    range: '17 - 20 years',
    stage: 'Late Teen / College (Age 17)',
    detail: 'Modern textured crops, relaxed campus tailoring, budget fits',
  },
  {
    range: '20 - 23 years',
    stage: 'University / Early Grad',
    detail: 'Versatile smart casual, internship & presentation ready',
  },
  {
    range: '23 - 26 years',
    stage: 'Young Professional',
    detail: 'Structured silhouettes, sharp tapers, elevated everyday',
  },
  {
    range: '27 - 32 years',
    stage: 'Established Career',
    detail: 'Refined minimalism, classic tailored profiles',
  },
  {
    range: '33+ years',
    stage: 'Mature & Executive',
    detail: 'Sophisticated timeless tailoring and distinguished grooming',
  },
];

export function AgeEstimateBadge({ age, onAgeUpdate }: AgeEstimateBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string>(age.range);
  const [customAge, setCustomAge] = useState<string>('17');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const confidenceStyles = {
    high: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    medium: 'bg-amber-50 text-amber-800 border-amber-200',
    low: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  const handleCustomAgeChange = (val: string) => {
    setCustomAge(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num <= 18) {
        setSelectedRange('17 - 20 years');
      } else if (num <= 23) {
        setSelectedRange('20 - 23 years');
      } else if (num <= 26) {
        setSelectedRange('23 - 26 years');
      } else if (num <= 32) {
        setSelectedRange('27 - 32 years');
      } else {
        setSelectedRange('33+ years');
      }
    }
  };

  const handleSaveCalibration = () => {
    const finalRange = selectedRange || '17 - 20 years';
    
    // 1. Notify parent profile
    onAgeUpdate?.(finalRange);

    // 2. Persist update to active profile in localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('facefit_active_profile');
        if (stored) {
          const profile = JSON.parse(stored);
          profile.estimatedAge = {
            range: finalRange,
            confidence: 'high',
            disclaimer: 'User-calibrated age stage for precision personalized styling.',
          };
          localStorage.setItem('facefit_active_profile', JSON.stringify(profile));
        }
      } catch (e) {
        console.error('Error saving calibrated age:', e);
      }
    }

    // 3. Update AI Stylist memory
    addLearnedNote(`User calibrated age bracket to ${finalRange}. Ensure all recommendations match this life stage.`);

    // 4. Close modal and show feedback toast
    setIsModalOpen(false);
    setToastMessage(`Calibrated to ${finalRange}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <>
      <div className="relative inline-flex items-center gap-1.5 flex-wrap">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200/90 text-xs font-medium cursor-help select-none group"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip((prev) => !prev)}
        >
          <span className="text-neutral-400 font-normal">Bracket:</span>
          <span className="font-semibold text-neutral-900">{age.range}</span>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
              confidenceStyles[age.confidence] || confidenceStyles.medium
            }`}
          >
            {age.confidence}
          </span>
          <Info className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
        </div>

        {/* Calibrate Age Trigger Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedRange(age.range);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-neutral-900 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
          title="Adjust age bracket if AI overestimated your age"
        >
          <Sliders className="w-3 h-3 text-amber-600" />
          Calibrate
        </button>

        {/* Hover/Tap Tooltip */}
        {showTooltip && (
          <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-neutral-900 text-white text-[11px] leading-relaxed rounded-xl shadow-xl z-50 animate-fadeIn border border-neutral-800">
            <p className="font-semibold text-amber-400 mb-1">Ethical AI Estimate Notice</p>
            <p className="text-neutral-300">
              {age.disclaimer ||
                'Approximate AI visual estimate for aesthetic, silhouette proportion, and color curation only. Never presented as exact biometric fact.'}
            </p>
          </div>
        )}

        {/* Toast confirmation */}
        {toastMessage && (
          <div className="absolute left-0 -top-8 bg-neutral-900 text-white text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-md animate-fadeIn flex items-center gap-1.5 whitespace-nowrap z-40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {toastMessage}
          </div>
        )}
      </div>

      {/* Interactive Age Calibration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-neutral-200 shadow-2xl p-6 sm:p-8 animate-scaleUp">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif-editorial font-bold text-neutral-900">
                  Calibrate Visual Age Bracket
                </h3>
                <p className="text-xs text-neutral-500">
                  Guarantee your recommendations match your actual life stage.
                </p>
              </div>
            </div>

            <div className="p-3 mb-5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
              <span className="font-semibold text-neutral-900">Why calibrate?</span> AI vision models occasionally overestimate late teenagers (16–19) into young adult brackets due to posture, camera perspective, or casual clothing. Setting your true bracket ensures styling, cuts, and wardrobe fit your campus or career reality.
            </div>

            {/* Quick exact age input */}
            <div className="mb-5 flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-white">
              <span className="text-xs font-semibold text-neutral-700">Enter your exact age:</span>
              <input
                type="number"
                min={14}
                max={90}
                value={customAge}
                onChange={(e) => handleCustomAgeChange(e.target.value)}
                placeholder="17"
                className="w-16 px-2.5 py-1 text-sm font-semibold rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-center"
              />
              <span className="text-xs text-neutral-400">
                (Automatically highlights best bracket)
              </span>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-1">
              {AGE_PRESETS.map((p) => {
                const isSelected = selectedRange === p.range;
                return (
                  <button
                    key={p.range}
                    type="button"
                    onClick={() => setSelectedRange(p.range)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-neutral-900'}`}>
                          {p.range}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-amber-400 text-neutral-900' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {p.stage}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {p.detail}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 mt-1 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCalibration}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Apply Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
