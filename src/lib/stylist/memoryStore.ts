'use client';

import { StylistMemory } from '../types';

const MEMORY_STORAGE_KEY = 'facefit_stylist_memory';

export const DEFAULT_STYLIST_MEMORY: StylistMemory = {
  preferredStyles: ['Smart Casual', 'Clean Minimal'],
  dislikedStyles: ['Overly loud neons', 'Skinny jeans'],
  preferredColors: ['Olive', 'Espresso', 'Navy', 'Oatmeal'],
  budgetTier: 'Budget (Under ₹3,000)',
  hairMaintenanceTolerance: 'Low to Medium (~5 mins)',
  learnedNotes: [
    'Prefers structured shoulder cuts and boxy silhouettes.',
    'Wants low-maintenance styling on busy weekdays.',
    'Values college presentation versatility.',
  ],
  wardrobePieceCount: 6,
  lastUpdated: new Date().toISOString(),
};

export function getStylistMemory(): StylistMemory {
  if (typeof window === 'undefined') return DEFAULT_STYLIST_MEMORY;

  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return DEFAULT_STYLIST_MEMORY;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STYLIST_MEMORY;
  }
}

export function updateStylistMemory(patch: Partial<StylistMemory>) {
  if (typeof window === 'undefined') return;

  const current = getStylistMemory();
  const updated: StylistMemory = {
    ...current,
    ...patch,
    preferredStyles: Array.from(new Set([...(patch.preferredStyles || current.preferredStyles)])),
    dislikedStyles: Array.from(new Set([...(patch.dislikedStyles || current.dislikedStyles)])),
    preferredColors: Array.from(new Set([...(patch.preferredColors || current.preferredColors)])),
    learnedNotes: Array.from(new Set([...(patch.learnedNotes || current.learnedNotes)])),
    lastUpdated: new Date().toISOString(),
  };

  localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('facefit_memory_changed'));
}

export function addLearnedNote(note: string) {
  const current = getStylistMemory();
  updateStylistMemory({
    learnedNotes: [note, ...current.learnedNotes].slice(0, 8),
  });
}

export function addDislikedStyle(dislike: string) {
  const current = getStylistMemory();
  updateStylistMemory({
    dislikedStyles: [dislike, ...current.dislikedStyles],
    learnedNotes: [`User explicitly avoids ${dislike}.`, ...current.learnedNotes],
  });
}

export function resetStylistMemory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(MEMORY_STORAGE_KEY);
  window.dispatchEvent(new Event('facefit_memory_changed'));
}
