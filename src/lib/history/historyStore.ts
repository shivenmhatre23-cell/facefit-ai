'use client';

import { StyleHistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'facefit_style_history_timeline';

export const DEFAULT_HISTORY_ITEMS: StyleHistoryItem[] = [
  {
    id: 'hist-1',
    title: 'Style Profile Generated',
    type: 'profile_creation',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    dateFormatted: 'September 22',
    summary: 'Analyzed facial symmetry and warm undertones. Generated curated 6-swatch palette.',
    tags: ['Oval Shape', 'Warm Autumn', 'Textured Crop'],
  },
  {
    id: 'hist-2',
    title: 'Interview & Placement Look',
    type: 'look_generation',
    timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    dateFormatted: 'September 24',
    summary: 'Curated structured French Slate knit polo with tailored single-pleat trousers.',
    tags: ['Interview', 'Placement Ready', '₹2,800'],
  },
  {
    id: 'hist-3',
    title: 'Campus Everyday Look',
    type: 'look_generation',
    timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    dateFormatted: 'September 27',
    summary: 'Configured drop-shoulder boxy tee with relaxed olive chinos and clean sneakers.',
    tags: ['College', 'Smart Casual'],
  },
  {
    id: 'hist-4',
    title: 'New Barber Consultation Card',
    type: 'barber_consultation',
    timestamp: new Date().toISOString(),
    dateFormatted: 'October 2',
    summary: 'Generated exact clipper guard measurements for Low Taper Fade with textured top.',
    tags: ['Low Taper', '#0.5 Guard', 'Matte Clay'],
  },
];

export function getStyleHistory(): StyleHistoryItem[] {
  if (typeof window === 'undefined') return DEFAULT_HISTORY_ITEMS;

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return DEFAULT_HISTORY_ITEMS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_HISTORY_ITEMS;
  }
}

export function logHistoryMilestone(item: Omit<StyleHistoryItem, 'id' | 'timestamp' | 'dateFormatted'>) {
  if (typeof window === 'undefined') return;

  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${months[now.getMonth()]} ${now.getDate()}`;

  const newItem: StyleHistoryItem = {
    ...item,
    id: 'hist-' + Date.now(),
    timestamp: now.toISOString(),
    dateFormatted: formattedDate,
  };

  const current = getStyleHistory();
  const updated = [newItem, ...current].slice(0, 30); // Keep last 30 milestones

  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('facefit_history_changed'));
}

export function clearStyleHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_STORAGE_KEY);
  window.dispatchEvent(new Event('facefit_history_changed'));
}
