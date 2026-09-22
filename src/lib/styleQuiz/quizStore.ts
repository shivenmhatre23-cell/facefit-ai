'use client';

import { StyleQuizAnswers } from '../types';
import { updateStylistMemory } from '../stylist/memoryStore';
import { logHistoryMilestone } from '../history/historyStore';

const QUIZ_STORAGE_KEY = 'facefit_style_quiz_answers';

export const DEFAULT_QUIZ_ANSWERS: StyleQuizAnswers = {
  preferredStyle: 'Smart Casual',
  hairStylingTime: '5 minutes',
  clothingBudget: 'Budget',
  primaryOccasions: ['College', 'Everyday', 'Social Events'],
  preferredColors: ['Navy', 'Olive', 'Espresso', 'Oatmeal Sand'],
  dislikedStyles: ['Overly tight skinny jeans', 'Loud fluorescent neons'],
};

export function getSavedQuizAnswers(): StyleQuizAnswers {
  if (typeof window === 'undefined') return DEFAULT_QUIZ_ANSWERS;

  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return DEFAULT_QUIZ_ANSWERS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_QUIZ_ANSWERS;
  }
}

export function saveQuizAnswers(answers: StyleQuizAnswers) {
  if (typeof window === 'undefined') return;

  const payload: StyleQuizAnswers = {
    ...answers,
    completedAt: new Date().toISOString(),
  };

  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(payload));

  // Sync with AI Stylist Memory
  updateStylistMemory({
    preferredStyles: [answers.preferredStyle],
    dislikedStyles: answers.dislikedStyles,
    preferredColors: answers.preferredColors,
    budgetTier: answers.clothingBudget,
    hairMaintenanceTolerance: answers.hairStylingTime,
  });

  // Log to timeline
  logHistoryMilestone({
    title: 'Personal Style Quiz Completed',
    type: 'quiz_completion',
    summary: `Configured baseline style to ${answers.preferredStyle} with ${answers.hairStylingTime} hair styling preference.`,
    tags: [answers.preferredStyle, answers.clothingBudget, ...answers.primaryOccasions.slice(0, 2)],
  });

  window.dispatchEvent(new Event('facefit_quiz_changed'));
  window.dispatchEvent(new Event('facefit_preferences_changed'));
}

export function resetQuizAnswers() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(QUIZ_STORAGE_KEY);
  window.dispatchEvent(new Event('facefit_quiz_changed'));
}
