import { UserStylePreferences } from './types';

export const DEFAULT_USER_PREFERENCES: UserStylePreferences = {
  preferredStyles: ['Smart casual', 'Minimal'],
  preferredColors: ['Espresso Bronze', 'Warm Terracotta', 'Olive Forest', 'Oatmeal Sand'],
  budgetTier: 'Budget (Under ₹3000)',
  maxBudgetINR: 3000,
  hairMaintenance: 'Low maintenance',
  hairCategories: ['Low maintenance', 'Casual', 'Classic'],
  primaryOccasion: 'College',
  climate: 'Hot / Humid',
  ownedWardrobe: ['Plain white tee', 'Dark indigo denim', 'White minimalist sneakers'],
  dislikedStyles: ['Skinny jeans', 'Loud graphic logos', 'Harsh neon colors'],
};

const PREFERENCES_KEY = 'facefit_user_style_preferences';

export function getUserPreferences(): UserStylePreferences {
  if (typeof window === 'undefined') return DEFAULT_USER_PREFERENCES;
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) return DEFAULT_USER_PREFERENCES;
    return { ...DEFAULT_USER_PREFERENCES, ...JSON.parse(stored) };
  } catch (e) {
    console.error('Error loading preferences:', e);
    return DEFAULT_USER_PREFERENCES;
  }
}

export function saveUserPreferences(preferences: UserStylePreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    window.dispatchEvent(new Event('facefit_preferences_changed'));
  } catch (e) {
    console.error('Error saving preferences:', e);
  }
}
