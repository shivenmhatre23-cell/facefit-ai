'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, Sparkles } from 'lucide-react';
import { FeedbackReaction, recordStyleFeedback } from '@/lib/recommendations/feedbackEngine';

interface StyleFeedbackWidgetProps {
  itemId: string;
  itemType: 'hairstyle' | 'outfit';
  onFeedbackGiven?: (reaction: FeedbackReaction) => void;
}

const REACTIONS: { label: FeedbackReaction; short: string }[] = [
  { label: 'Love this', short: '❤️ Love this' },
  { label: 'Not for me', short: 'Not for me' },
  { label: 'Too formal', short: 'Too formal' },
  { label: 'Too expensive', short: 'Too pricey' },
  { label: 'Too much maintenance', short: 'High maintenance' },
];

export function StyleFeedbackWidget({ itemId, itemType, onFeedbackGiven }: StyleFeedbackWidgetProps) {
  const [selectedReaction, setSelectedReaction] = useState<FeedbackReaction | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const handleSelect = (reaction: FeedbackReaction) => {
    setSelectedReaction(reaction);
    recordStyleFeedback(itemId, itemType, reaction);
    setAcknowledged(true);
    if (onFeedbackGiven) onFeedbackGiven(reaction);

    setTimeout(() => {
      setAcknowledged(false);
    }, 3500);
  };

  return (
    <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span>Help refine future recommendations:</span>
        {acknowledged && (
          <span className="text-emerald-600 font-medium inline-flex items-center gap-1 animate-fadeIn">
            <Check className="w-3 h-3" />
            Noted • Tuning engine
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {REACTIONS.map(({ label, short }) => {
          const isCurrent = selectedReaction === label;
          return (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                isCurrent
                  ? 'bg-neutral-900 text-white shadow-xs ring-1 ring-neutral-900'
                  : 'bg-neutral-100/70 hover:bg-neutral-200/60 text-neutral-600'
              }`}
            >
              {short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
