'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shirt,
  Plus,
  Trash2,
  Star,
  Sparkles,
  Layers,
  Check,
  RotateCcw,
  Eye,
  Filter,
  PackageOpen,
} from 'lucide-react';
import { WardrobeItem, WardrobeCategory } from '@/lib/types';
import {
  getWardrobeItems,
  addWardrobeItem,
  removeWardrobeItem,
  toggleFavoriteWardrobeItem,
  generateOutfitFromWardrobe,
} from '@/lib/wardrobe/wardrobeStore';
import { LookPreviewModal } from '@/components/preview/LookPreviewModal';
import { saveLookRecord } from '@/lib/saved/looksStore';

const CATEGORIES: WardrobeCategory[] = [
  'T-shirts',
  'Shirts',
  'Pants',
  'Jeans',
  'Shoes',
  'Jackets',
  'Ethnic / Traditional',
];

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<WardrobeCategory>('T-shirts');
  const [newItemColor, setNewItemColor] = useState('');
  const [newItemTexture, setNewItemTexture] = useState('');

  // Wardrobe Outfit Synthesis State
  const [generatedOutfit, setGeneratedOutfit] = useState<ReturnType<typeof generateOutfitFromWardrobe> | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setItems(getWardrobeItems());

    const handleUpdate = () => {
      setItems(getWardrobeItems());
    };

    window.addEventListener('facefit_wardrobe_changed', handleUpdate);
    return () => window.removeEventListener('facefit_wardrobe_changed', handleUpdate);
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemColor.trim()) return;

    addWardrobeItem({
      name: newItemName.trim(),
      category: newItemCategory,
      color: newItemColor.trim(),
      patternOrTexture: newItemTexture.trim() || 'Standard weave',
      isFavorite: false,
    });

    setNewItemName('');
    setNewItemColor('');
    setNewItemTexture('');
    setShowAddModal(false);
  };

  const handleSynthesizeOutfit = () => {
    const outfit = generateOutfitFromWardrobe('Everyday Capsule');
    setGeneratedOutfit(outfit);
  };

  const handleSaveWardrobeLook = () => {
    if (!generatedOutfit) return;
    saveLookRecord({
      name: generatedOutfit.title,
      type: 'outfit',
      occasion: 'Everyday Capsule',
      style: 'Capsule Wardrobe',
      colors: generatedOutfit.pieces.map((p) => p.color),
      details: {
        pieces: generatedOutfit.pieces,
        aesthetic: generatedOutfit.aesthetic,
      },
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <Shirt className="w-4 h-4" />
              Existing Wardrobe Mode
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              My Wardrobe & Capsule
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Catalog what you already own. Generate outfits composed strictly from your existing garments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-medium text-neutral-800 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Garment
            </button>
            <button
              onClick={handleSynthesizeOutfit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Create Outfit from Wardrobe
            </button>
          </div>
        </div>

        {/* Wardrobe Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Total Items</span>
            <div className="text-2xl font-bold text-neutral-900 mt-1">{items.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Categories</span>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {new Set(items.map((i) => i.category)).size} / 7
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Favorites</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {items.filter((i) => i.isFavorite).length}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/70 shadow-xs">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase">Versatility Score</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">88% High</div>
          </div>
        </div>

        {/* Synthesized Wardrobe Outfit Banner (if triggered) */}
        {generatedOutfit && (
          <div className="p-6 md:p-8 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-xl space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                  100% OWNED GARMENTS
                </span>
                <h3 className="font-serif text-2xl font-bold text-neutral-100">{generatedOutfit.title}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">{generatedOutfit.totalVibe}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSynthesizeOutfit}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                  Regenerate
                </button>
                <button
                  onClick={() => setPreviewModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 text-xs font-medium transition shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  Try This Look
                </button>
                <button
                  onClick={handleSaveWardrobeLook}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition border border-neutral-700"
                >
                  {savedSuccess ? 'Saved!' : 'Save Look'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              {generatedOutfit.pieces.map((piece, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-neutral-800/70 border border-neutral-700 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Piece {idx + 1}</span>
                    <span className="text-emerald-400 font-medium">In Wardrobe</span>
                  </div>
                  <div className="text-sm font-semibold text-neutral-100">{piece.item}</div>
                  <div className="text-xs text-neutral-400">Color: {piece.color}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200/80">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
              activeCategory === 'All'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            All Items ({items.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = items.filter((i) => i.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-neutral-200/70 p-8 space-y-3">
            <PackageOpen className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="font-semibold text-neutral-800">No items found in this category</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Add your garments to start building intelligent capsule recommendations.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <button
                      onClick={() => toggleFavoriteWardrobeItem(item.id)}
                      className={`p-1 rounded-lg transition ${
                        item.isFavorite
                          ? 'text-amber-500'
                          : 'text-neutral-300 hover:text-amber-400'
                      }`}
                      title="Favorite Item"
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-semibold text-neutral-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Color: {item.color}</p>
                    <p className="text-xs text-neutral-400">{item.patternOrTexture}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-[11px] text-neutral-400">
                  <span>Logged in inventory</span>
                  <button
                    onClick={() => removeWardrobeItem(item.id)}
                    className="text-neutral-300 hover:text-rose-600 transition p-1"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-neutral-100 space-y-4">
            <h3 className="font-serif text-xl font-bold text-neutral-900">Add Wardrobe Garment</h3>
            <form onSubmit={handleAddItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Garment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Uniqlo Oxford Cotton Shirt"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as WardrobeCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Color / Tone</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Olive Green"
                    value={newItemColor}
                    onChange={(e) => setNewItemColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Fabric / Fit</label>
                  <input
                    type="text"
                    placeholder="e.g., Heavy Cotton"
                    value={newItemTexture}
                    onChange={(e) => setNewItemTexture(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition shadow-xs"
                >
                  Save to Wardrobe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Look Preview Modal */}
      {generatedOutfit && (
        <LookPreviewModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          target={{
            type: 'outfit',
            name: generatedOutfit.title,
            details: {
              style: 'Capsule Wardrobe',
              pieces: generatedOutfit.pieces.map((p) => ({ item: p.item, color: p.color })),
            },
          }}
        />
      )}
    </div>
  );
}
