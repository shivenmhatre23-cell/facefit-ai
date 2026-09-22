import { HairstyleRecommendation, OutfitCombination } from './types';

const SAVED_HAIRSTYLES_KEY = 'facefit_saved_hairstyles';
const SAVED_OUTFITS_KEY = 'facefit_saved_outfits';

export function getSavedHairstyles(): HairstyleRecommendation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_HAIRSTYLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading saved hairstyles:', e);
    return [];
  }
}

export function isHairstyleSaved(id: string): boolean {
  const saved = getSavedHairstyles();
  return saved.some((item) => item.id === id);
}

export function toggleSaveHairstyle(hair: HairstyleRecommendation): boolean {
  if (typeof window === 'undefined') return false;
  const current = getSavedHairstyles();
  const exists = current.some((item) => item.id === hair.id);
  let updated: HairstyleRecommendation[];

  if (exists) {
    updated = current.filter((item) => item.id !== hair.id);
  } else {
    updated = [hair, ...current];
  }

  localStorage.setItem(SAVED_HAIRSTYLES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('facefit_saved_changed'));
  return !exists;
}

export function getSavedOutfits(): OutfitCombination[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_OUTFITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading saved outfits:', e);
    return [];
  }
}

export function isOutfitSaved(id: string): boolean {
  const saved = getSavedOutfits();
  return saved.some((item) => item.id === id);
}

export function toggleSaveOutfit(outfit: OutfitCombination): boolean {
  if (typeof window === 'undefined') return false;
  const current = getSavedOutfits();
  const exists = current.some((item) => item.id === outfit.id);
  let updated: OutfitCombination[];

  if (exists) {
    updated = current.filter((item) => item.id !== outfit.id);
  } else {
    updated = [outfit, ...current];
  }

  localStorage.setItem(SAVED_OUTFITS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('facefit_saved_changed'));
  return !exists;
}
