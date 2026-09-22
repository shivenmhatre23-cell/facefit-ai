'use client';

import { SavedLookRecord, CustomLook, HairstyleRecommendation, OutfitCombination } from '../types';
import { logHistoryMilestone } from '../history/historyStore';

const SAVED_LOOKS_KEY = 'facefit_saved_looks_unified';

export function getSavedLookRecords(): SavedLookRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(SAVED_LOOKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLookRecord(record: Omit<SavedLookRecord, 'id' | 'dateSaved'>): SavedLookRecord {
  const current = getSavedLookRecords();
  const newRecord: SavedLookRecord = {
    ...record,
    id: 'look-' + Date.now(),
    dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  const updated = [newRecord, ...current];
  localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(updated));

  logHistoryMilestone({
    title: `Saved Look: "${record.name}"`,
    type: 'look_generation',
    summary: `Added "${record.name}" (${record.style} • ${record.occasion}) to personal lookbook.`,
    tags: [record.style, record.occasion],
  });

  window.dispatchEvent(new Event('facefit_saved_changed'));
  return newRecord;
}

export function renameLookRecord(id: string, newName: string) {
  const current = getSavedLookRecords();
  const updated = current.map((r) => (r.id === id ? { ...r, name: newName.trim() } : r));
  localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('facefit_saved_changed'));
}

export function duplicateLookRecord(id: string): SavedLookRecord | null {
  const current = getSavedLookRecords();
  const existing = current.find((r) => r.id === id);
  if (!existing) return null;

  const duplicated: SavedLookRecord = {
    ...existing,
    id: 'look-' + Date.now(),
    name: `${existing.name} (Copy)`,
    dateSaved: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };

  const updated = [duplicated, ...current];
  localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('facefit_saved_changed'));
  return duplicated;
}

export function updateLookDetails(id: string, patch: Partial<SavedLookRecord>) {
  const current = getSavedLookRecords();
  const updated = current.map((r) => (r.id === id ? { ...r, ...patch } : r));
  localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('facefit_saved_changed'));
}

export function deleteLookRecord(id: string) {
  const current = getSavedLookRecords();
  const filtered = current.filter((r) => r.id !== id);
  localStorage.setItem(SAVED_LOOKS_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event('facefit_saved_changed'));
}
