'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Sparkles,
  Scissors,
  Shirt,
  Bookmark,
  Dna,
  RotateCcw,
  Trash2,
  Calendar,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { StyleHistoryItem } from '@/lib/types';
import { getStyleHistory, clearStyleHistory } from '@/lib/history/historyStore';

export default function StyleHistoryPage() {
  const [historyItems, setHistoryItems] = useState<StyleHistoryItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setHistoryItems(getStyleHistory());

    const handleUpdate = () => {
      setHistoryItems(getStyleHistory());
    };

    window.addEventListener('facefit_history_changed', handleUpdate);
    return () => window.removeEventListener('facefit_history_changed', handleUpdate);
  }, []);

  const handleClear = () => {
    clearStyleHistory();
    setConfirmClear(false);
  };

  const filteredItems = filterType === 'all'
    ? historyItems
    : historyItems.filter((i) => i.type === filterType);

  const getIconForType = (type: StyleHistoryItem['type']) => {
    switch (type) {
      case 'profile_creation':
        return Dna;
      case 'look_generation':
        return Shirt;
      case 'barber_consultation':
        return Scissors;
      case 'wardrobe_synthesis':
        return Bookmark;
      case 'quiz_completion':
        return Sparkles;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <Clock className="w-4 h-4" />
              Style Timeline
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Your Styling Evolution
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Chronological log of your profile generations, curated looks, and barber consultations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {confirmClear ? (
              <div className="flex items-center gap-2 animate-fadeIn">
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition"
                >
                  Confirm Purge
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-200 text-neutral-700 text-xs font-medium transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-medium text-neutral-600 transition shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Timeline
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200/80">
          {[
            { id: 'all', label: 'All Milestones' },
            { id: 'look_generation', label: 'Saved Looks' },
            { id: 'profile_creation', label: 'Profiles' },
            { id: 'barber_consultation', label: 'Barber Specs' },
            { id: 'wardrobe_synthesis', label: 'Wardrobe' },
            { id: 'quiz_completion', label: 'Quizzes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                filterType === tab.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Timeline Items List */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/70 p-8 space-y-3">
            <Clock className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="font-semibold text-neutral-800">Timeline is Empty</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Your style milestones and curated looks will appear here chronologically.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition"
              >
                Run Face Analysis
              </Link>
              <Link
                href="/builder"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 text-neutral-800 text-xs font-medium hover:bg-neutral-50 transition"
              >
                Open Look Builder
              </Link>
            </div>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
            {filteredItems.map((item) => {
              const Icon = getIconForType(item.type);
              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <div className="absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 md:p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-300 shadow-xs hover:shadow-md transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-neutral-700" />
                        <h3 className="font-semibold text-neutral-900 text-sm">{item.title}</h3>
                      </div>
                      <span className="text-xs font-medium text-neutral-400 font-mono">
                        {item.dateFormatted}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">{item.summary}</p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-medium"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
