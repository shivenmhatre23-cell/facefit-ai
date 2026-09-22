'use client';

import { addLearnedNote } from '../stylist/memoryStore';
import { getUserPreferences, saveUserPreferences } from './preferencesStore';

export type FeedbackReaction =
  | 'Love this'
  | 'Not for me'
  | 'Show alternatives'
  | 'Too formal'
  | 'Too expensive'
  | 'Too much maintenance'
  | 'Not my style';

export interface FeedbackRecord {
  itemId: string;
  itemType: 'hairstyle' | 'outfit';
  reaction: FeedbackReaction;
  timestamp: string;
}

const FEEDBACK_STORAGE_KEY = 'facefit_user_feedback_history';

export function getFeedbackHistory(): FeedbackRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordStyleFeedback(itemId: string, itemType: 'hairstyle' | 'outfit', reaction: FeedbackReaction) {
  if (typeof window === 'undefined') return;

  const current = getFeedbackHistory();
  const record: FeedbackRecord = {
    itemId,
    itemType,
    reaction,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify([record, ...current].slice(0, 50)));

  // Adapt user preferences and stylist memory based on feedback
  const prefs = getUserPreferences();

  switch (reaction) {
    case 'Too expensive':
      saveUserPreferences({
        ...prefs,
        maxBudgetINR: Math.max(1500, (prefs.maxBudgetINR || 3000) - 500),
      });
      addLearnedNote('Adjusted budget filter downward based on "Too expensive" feedback.');
      break;

    case 'Too much maintenance':
      saveUserPreferences({
        ...prefs,
        hairMaintenance: 'Low maintenance',
      });
      addLearnedNote('Prioritizing low-maintenance haircuts (<4 mins) based on user feedback.');
      break;

    case 'Too formal':
      saveUserPreferences({
        ...prefs,
        preferredStyles: ['Smart casual', 'Minimal', 'Streetwear'],
      });
      addLearnedNote('De-emphasizing formal attire; favoring relaxed smart-casual silhouettes.');
      break;

    case 'Not my style':
    case 'Not for me':
      addLearnedNote(`User rejected recommendation ${itemId}. Exploring complementary alternatives.`);
      break;

    case 'Love this':
      addLearnedNote(`User strongly resonated with ${itemId} aesthetic.`);
      break;
  }

  window.dispatchEvent(new Event('facefit_preferences_changed'));
}
