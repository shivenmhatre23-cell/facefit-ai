'use client';

import { WardrobeItem, WardrobeCategory } from '../types';
import { updateStylistMemory } from '../stylist/memoryStore';
import { logHistoryMilestone } from '../history/historyStore';

const WARDROBE_STORAGE_KEY = 'facefit_user_wardrobe_items';

export const DEFAULT_WARDROBE_ITEMS: WardrobeItem[] = [
  {
    id: 'w-1',
    name: 'Heavyweight Boxy Cotton Tee',
    category: 'T-shirts',
    color: 'Oatmeal White',
    patternOrTexture: 'Heavy jersey cotton',
    addedAt: '2026-09-20T10:00:00Z',
    isFavorite: true,
  },
  {
    id: 'w-2',
    name: 'Camp-Collar Linen Overshirt',
    category: 'Shirts',
    color: 'Washed Olive',
    patternOrTexture: 'Breathable textured linen',
    addedAt: '2026-09-20T10:05:00Z',
    isFavorite: true,
  },
  {
    id: 'w-3',
    name: 'Straight-Leg Indigo Denim',
    category: 'Jeans',
    color: 'Dark Indigo',
    patternOrTexture: 'Raw selvedge finish',
    addedAt: '2026-09-20T10:10:00Z',
    isFavorite: true,
  },
  {
    id: 'w-4',
    name: 'Single-Pleat Relaxed Chinos',
    category: 'Pants',
    color: 'Mocha Charcoal',
    patternOrTexture: 'Mid-weight twill',
    addedAt: '2026-09-21T09:00:00Z',
    isFavorite: false,
  },
  {
    id: 'w-5',
    name: 'Minimal Leather Low-Top Trainers',
    category: 'Shoes',
    color: 'Chalk White',
    patternOrTexture: 'Smooth calfskin leather',
    addedAt: '2026-09-21T09:15:00Z',
    isFavorite: true,
  },
  {
    id: 'w-6',
    name: 'Textured Trucker Overshirt',
    category: 'Jackets',
    color: 'Deep Espresso',
    patternOrTexture: 'Cotton canvas',
    addedAt: '2026-09-22T08:30:00Z',
    isFavorite: false,
  },
];

export function getWardrobeItems(): WardrobeItem[] {
  if (typeof window === 'undefined') return DEFAULT_WARDROBE_ITEMS;

  try {
    const raw = localStorage.getItem(WARDROBE_STORAGE_KEY);
    if (!raw) return DEFAULT_WARDROBE_ITEMS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_WARDROBE_ITEMS;
  }
}

export function saveWardrobeItems(items: WardrobeItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WARDROBE_STORAGE_KEY, JSON.stringify(items));

  // Sync piece count with Stylist Memory
  updateStylistMemory({ wardrobePieceCount: items.length });

  window.dispatchEvent(new Event('facefit_wardrobe_changed'));
}

export function addWardrobeItem(item: Omit<WardrobeItem, 'id' | 'addedAt'>) {
  const current = getWardrobeItems();
  const newItem: WardrobeItem = {
    ...item,
    id: 'w-' + Date.now(),
    addedAt: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  saveWardrobeItems(updated);

  logHistoryMilestone({
    title: `Added "${item.name}" to Wardrobe`,
    type: 'wardrobe_synthesis',
    summary: `Logged ${item.color} ${item.category} into personal clothing inventory.`,
    tags: [item.category, item.color],
  });

  return newItem;
}

export function removeWardrobeItem(id: string) {
  const current = getWardrobeItems();
  const filtered = current.filter((i) => i.id !== id);
  saveWardrobeItems(filtered);
}

export function toggleFavoriteWardrobeItem(id: string) {
  const current = getWardrobeItems();
  const updated = current.map((i) => (i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  saveWardrobeItems(updated);
}

/**
 * Creates an intelligent outfit combination prioritizing items already in user's wardrobe
 */
export function generateOutfitFromWardrobe(occasion: string = 'College Everyday'): {
  title: string;
  pieces: { item: string; color: string; fromWardrobe: boolean }[];
  aesthetic: string;
  totalVibe: string;
} {
  const items = getWardrobeItems();

  const top = items.find((i) => i.category === 'T-shirts' || i.category === 'Shirts') || {
    name: 'Relaxed Cotton Tee',
    color: 'Oatmeal',
  };
  const layer = items.find((i) => (i.category === 'Jackets' || i.category === 'Shirts') && i.id !== (top as any).id);
  const bottom = items.find((i) => i.category === 'Jeans' || i.category === 'Pants') || {
    name: 'Straight-leg Cotton Chinos',
    color: 'Olive Forest',
  };
  const shoes = items.find((i) => i.category === 'Shoes') || {
    name: 'Clean White Low-Tops',
    color: 'Chalk White',
  };

  const pieces = [
    { item: top.name, color: top.color, fromWardrobe: true },
    ...(layer ? [{ item: layer.name, color: layer.color, fromWardrobe: true }] : []),
    { item: bottom.name, color: bottom.color, fromWardrobe: true },
    { item: shoes.name, color: shoes.color, fromWardrobe: true },
  ];

  return {
    title: `${occasion} Wardrobe Match`,
    pieces,
    aesthetic: 'Curated Capsule Wardrobe',
    totalVibe: 'Cohesive, comfortable, and composed entirely from pieces you already own.',
  };
}
