'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  IndianRupee,
  Sparkles,
  Bookmark,
  Check,
  Eye,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
  ArrowUpRight,
} from 'lucide-react';
import { BudgetStylistPlan } from '@/lib/types';
import { LookPreviewModal } from '@/components/preview/LookPreviewModal';
import { saveLookRecord } from '@/lib/saved/looksStore';

const BUDGET_TIERS = [1000, 2000, 3000, 5000, 10000];

const BUDGET_DATA: Record<number, BudgetStylistPlan> = {
  1000: {
    budgetLimitINR: 1000,
    estimatedTotalINR: 950,
    outfitTitle: 'Thrift & High-Value Minimalist',
    aesthetic: 'Clean Foundation Essentials',
    items: [
      {
        item: 'Heavyweight Cotton Crew Tee (Plain White/Black)',
        estimatedPriceINR: 450,
        isPriority: false,
        notes: 'Source 220 GSM combed cotton from high-value domestic basics lines.',
      },
      {
        item: 'Straight-Fit Chino / Cargo Shorts',
        estimatedPriceINR: 500,
        isPriority: true,
        notes: 'Prioritize neutral olive or charcoal for maximum weekly rotation.',
      },
    ],
    optionalUpgrades: [
      {
        item: 'Minimal Canvas Low-Tops',
        priceINR: 799,
        upgradeReason: 'Clean white sneaker base expands rotation to 4 days/week.',
      },
    ],
    priceNotice:
      'Estimates based on accessible value basics (e.g., Zudio, Max, H&M basics sale). Actual costs may vary.',
  },
  2000: {
    budgetLimitINR: 2000,
    estimatedTotalINR: 1950,
    outfitTitle: 'Collegiate Smart Casual Starter',
    aesthetic: 'Relaxed Campus Tailoring',
    items: [
      {
        item: 'Boxy Drop-Shoulder Oatmeal Tee',
        estimatedPriceINR: 600,
        isPriority: false,
        notes: 'Comfortable oversized drape that holds structure after washing.',
      },
      {
        item: 'Straight-Leg Cotton Trousers',
        estimatedPriceINR: 850,
        isPriority: true,
        notes: 'Focus on clean single-break tailoring for versatile campus wear.',
      },
      {
        item: 'Minimalist Woven Bracelet / Silver Tone Chain',
        estimatedPriceINR: 500,
        isPriority: false,
        notes: 'Adds deliberate finishing touch to simple silhouette.',
      },
    ],
    optionalUpgrades: [
      {
        item: 'Unlined Cotton Chore Overshirt',
        priceINR: 1299,
        upgradeReason: 'Layering elevates everyday outfit into presentation-ready look.',
      },
    ],
    priceNotice:
      'Estimates reflect entry mid-tier brands (e.g., Westside, Snitch, Bewakoof, Ajio).',
  },
  3000: {
    budgetLimitINR: 3000,
    estimatedTotalINR: 2900,
    outfitTitle: 'Balanced Contemporary Capsule',
    aesthetic: 'Refined Modern Silhouette',
    items: [
      {
        item: 'Camp-Collar Textured Linen-Cotton Shirt',
        estimatedPriceINR: 999,
        isPriority: false,
        notes: 'Breathable fabric for multi-season comfort and jawline-framing collar.',
      },
      {
        item: 'Single-Pleat Relaxed Chinos (Mocha / Olive)',
        estimatedPriceINR: 1100,
        isPriority: true,
        notes: 'Invest in durable twill weave with deep pockets.',
      },
      {
        item: 'Retro Gum-Sole Trainers',
        estimatedPriceINR: 801,
        isPriority: true,
        notes: 'High-wear versatility for daily walks and classes.',
      },
    ],
    optionalUpgrades: [
      {
        item: 'Stainless Steel Minimalist Watch',
        priceINR: 1499,
        upgradeReason: 'Polished accessory signal for internships and dinner meetings.',
      },
    ],
    priceNotice: 'Estimates reflect popular contemporary retailers (e.g., Marks & Spencer sale, Uniqlo core, Zara).',
  },
  5000: {
    budgetLimitINR: 5000,
    estimatedTotalINR: 4850,
    outfitTitle: 'Executive Smart Casual Ensemble',
    aesthetic: 'Sharp Polished Professional',
    items: [
      {
        item: 'Fine-Gauge Merino Knit Polo',
        estimatedPriceINR: 1499,
        isPriority: false,
        notes: 'Subtle luster and breathability for presentations and interviews.',
      },
      {
        item: 'Tailored Ankle-Length Wool-Blend Trousers',
        estimatedPriceINR: 1850,
        isPriority: true,
        notes: 'High wrinkle resistance with clean vertical crease.',
      },
      {
        item: 'Dark Chocolate Suede Penny Loafers',
        estimatedPriceINR: 1501,
        isPriority: true,
        notes: 'Quality footwear anchors the entire formal presence.',
      },
    ],
    optionalUpgrades: [
      {
        item: 'Unstructured Navy Blazer',
        priceINR: 2999,
        upgradeReason: 'Instantly transitions outfit from smart casual to full corporate.',
      },
    ],
    priceNotice: 'Estimates reflect quality-first staples (e.g., Uniqlo Supima, Zara Man, Hush Puppies).',
  },
  10000: {
    budgetLimitINR: 10000,
    estimatedTotalINR: 9600,
    outfitTitle: 'Bespoke Premium Investment Suite',
    aesthetic: 'Heritage Craft & Timeless Tailoring',
    items: [
      {
        item: 'Egyptian Long-Staple Cotton Oxford Shirt',
        estimatedPriceINR: 2400,
        isPriority: false,
        notes: 'Unrivaled skin comfort and longevity over dozens of wash cycles.',
      },
      {
        item: 'Japanese Selvedge Raw Denim or Pure Wool Trousers',
        estimatedPriceINR: 3200,
        isPriority: true,
        notes: 'Durable construction that molds uniquely to your frame over time.',
      },
      {
        item: 'Goodyear-Welted Full Grain Leather Loafers / Derbies',
        estimatedPriceINR: 4000,
        isPriority: true,
        notes: 'Can be re-soled for 5+ years of daily elegance and supreme arch support.',
      },
    ],
    optionalUpgrades: [
      {
        item: 'Italian Wool Overcoat or Tailored Blazer',
        priceINR: 5999,
        upgradeReason: 'Lifelong outerwear staple for international travel and formal galas.',
      },
    ],
    priceNotice:
      'Estimates based on premium heritage craftsmanship brands (e.g., Massimo Dutti, Raymond Made-to-Measure, Clarks).',
  },
};

export default function BudgetStylistPage() {
  const [selectedBudget, setSelectedBudget] = useState<number>(3000);
  const [previewTarget, setPreviewTarget] = useState<any | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const plan = BUDGET_DATA[selectedBudget] || BUDGET_DATA[3000];

  const handleSaveLook = () => {
    saveLookRecord({
      name: `${plan.outfitTitle} (₹${plan.budgetLimitINR})`,
      type: 'outfit',
      occasion: 'Budget Curated',
      style: plan.aesthetic,
      colors: ['Navy', 'Charcoal', 'Oatmeal Sand'],
      details: plan,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <IndianRupee className="w-4 h-4" />
              Budget Stylist
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mt-1">
              Style Within Your Means
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Realistic, itemized cost breakdowns with prioritized investment guidance from ₹1,000 to ₹10,000+.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setPreviewTarget({
                  type: 'outfit',
                  name: plan.outfitTitle,
                  details: {
                    style: plan.aesthetic,
                    pieces: plan.items.map((i) => ({ item: i.item, color: 'Curated' })),
                  },
                })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 text-xs font-medium text-neutral-800 transition shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              Try This Look (AI Preview)
            </button>
            <button
              onClick={handleSaveLook}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              {savedSuccess ? 'Saved to Looks' : 'Save Plan'}
            </button>
          </div>
        </div>

        {/* Budget Tier Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200/80">
          {BUDGET_TIERS.map((tier) => {
            const isSelected = selectedBudget === tier;
            return (
              <button
                key={tier}
                onClick={() => {
                  setSelectedBudget(tier);
                  setSavedSuccess(false);
                }}
                className={`inline-flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm ring-1 ring-neutral-900'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                ₹{tier.toLocaleString('en-IN')}{tier === 10000 ? '+' : ''} Cap
              </button>
            );
          })}
        </div>

        {/* Budget Plan Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Plan & Itemized List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-6">
              {/* Summary Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    {plan.aesthetic}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 mt-0.5">{plan.outfitTitle}</h2>
                </div>
                <div className="text-right sm:text-right">
                  <span className="text-[10px] text-neutral-400 uppercase block">Estimated Total</span>
                  <span className="text-2xl font-bold text-neutral-900">
                    ₹{plan.estimatedTotalINR.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-emerald-600 block">
                    Within ₹{plan.budgetLimitINR.toLocaleString('en-IN')} limit
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Itemized Cost & Priority Breakdown
                </div>
                <div className="space-y-3">
                  {plan.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-neutral-200/70 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-neutral-900">{item.item}</h4>
                          {item.isPriority ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                              Priority Investment
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600">
                              Budget Value
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed">{item.notes}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-neutral-900">
                          ~₹{item.estimatedPriceINR.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-start gap-2.5 text-xs text-neutral-500">
                <AlertCircle className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-neutral-700">Market Estimate Notice: </strong>
                  {plan.priceNotice}
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Strategic Upgrades & Priority Rules */}
          <div className="lg:col-span-4 space-y-5">
            {/* Optional Upgrades */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                  Next Strategic Upgrade
                </span>
              </div>
              <div className="space-y-3">
                {plan.optionalUpgrades.map((upg, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-900">{upg.item}</span>
                      <span className="font-bold text-neutral-800">+₹{upg.priceINR}</span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">{upg.upgradeReason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Investment Rule */}
            <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-md space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
                THE 70/30 RULE
              </span>
              <h4 className="font-serif text-base font-bold text-white">Where to Spend vs Save</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Invest 70% of your budget in foundational footwear and tailored trousers—they withstand the highest friction
                and determine posture. Save on basic crewneck t-shirts and seasonal accessories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Look Preview Modal */}
      {previewTarget && (
        <LookPreviewModal
          isOpen={!!previewTarget}
          onClose={() => setPreviewTarget(null)}
          target={previewTarget}
        />
      )}
    </div>
  );
}
