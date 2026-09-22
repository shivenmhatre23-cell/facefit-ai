'use client';

import { CustomLook } from '../types';

export interface LookBuilderOptions {
  hairstyles: { name: string; length: string; maintenance: string }[];
  tops: { name: string; category: string; defaultColor: string }[];
  bottoms: { name: string; category: string; defaultColor: string }[];
  shoes: { name: string; category: string; defaultColor: string }[];
  accessories: { name: string; category: string; defaultColor: string }[];
  colorThemes: { name: string; colors: string[] }[];
}

export const BUILDER_OPTIONS: LookBuilderOptions = {
  hairstyles: [
    { name: 'Low Taper + Textured Crop', length: 'Short-Medium', maintenance: 'Low' },
    { name: 'Classic Side Part Scissor Cut', length: 'Medium', maintenance: 'Medium' },
    { name: 'Modern Buzz Cut with Fade', length: 'Short', maintenance: 'Low' },
    { name: 'Mid Fade + Forward Texture', length: 'Short-Medium', maintenance: 'Low' },
    { name: 'Relaxed Wavy Quiff', length: 'Medium-Long', maintenance: 'High' },
    { name: 'Clean Slicked Undercut', length: 'Medium', maintenance: 'Medium' },
  ],
  tops: [
    { name: 'Oversized Boxy Cotton Tee', category: 'T-shirt', defaultColor: 'Oatmeal White' },
    { name: 'Camp-Collar Textured Shirt', category: 'Shirt', defaultColor: 'Washed Olive' },
    { name: 'Ribbed Knit Minimal Polo', category: 'Polo', defaultColor: 'French Slate' },
    { name: 'Heavyweight Fleece Hoodie', category: 'Hoodie', defaultColor: 'Heather Grey' },
    { name: 'Textured Cotton Overshirt', category: 'Sweater/Layer', defaultColor: 'Deep Espresso' },
    { name: 'Structured Unlined Chore Jacket', category: 'Jacket', defaultColor: 'Dark Navy' },
  ],
  bottoms: [
    { name: 'Straight-Leg Selvedge Jeans', category: 'Jeans', defaultColor: 'Dark Indigo' },
    { name: 'Single-Pleat Relaxed Trousers', category: 'Trousers', defaultColor: 'Mocha Charcoal' },
    { name: 'Straight-Fit Cotton Chinos', category: 'Chinos', defaultColor: 'Olive Forest' },
    { name: 'Relaxed Minimalist Cargo Pants', category: 'Cargo', defaultColor: 'Desert Sand' },
    { name: 'Tailored Ankle Shorts', category: 'Shorts', defaultColor: 'Charcoal Black' },
  ],
  shoes: [
    { name: 'Clean Minimal White Sneakers', category: 'Sneakers', defaultColor: 'Chalk White' },
    { name: 'Retro Gum-Sole Trainers', category: 'Sneakers', defaultColor: 'Beige & Gum' },
    { name: 'Dark Chocolate Suede Loafers', category: 'Loafers', defaultColor: 'Espresso Suede' },
    { name: 'Matte Leather Chelsea Boots', category: 'Boots', defaultColor: 'Obsidian Black' },
    { name: 'Clean Leather Derby Shoes', category: 'Formal', defaultColor: 'Deep Brown' },
  ],
  accessories: [
    { name: 'Minimalist Stainless Watch', category: 'Watch', defaultColor: 'Silver / Tan Leather' },
    { name: 'Geometric Wireframe Glasses', category: 'Glasses', defaultColor: 'Brushed Brass' },
    { name: '2mm Silver Box Chain', category: 'Necklace', defaultColor: 'Polished Silver' },
    { name: 'Braided Minimalist Bracelet', category: 'Bracelet', defaultColor: 'Dark Brown' },
    { name: 'Heavyweight Canvas Tote Bag', category: 'Bag', defaultColor: 'Ecru / Slate' },
  ],
  colorThemes: [
    { name: 'Warm Earth & Terracotta', colors: ['#C2593F', '#4A5B43', '#D7CEBE', '#3B2F2F'] },
    { name: 'Collegiate Navy & Slate', colors: ['#1E3A8A', '#475569', '#E2E8F0', '#0F172A'] },
    { name: 'Minimal Monochrome', colors: ['#171717', '#737373', '#F5F5F5', '#FFFFFF'] },
    { name: 'Forest & Sand Harmony', colors: ['#2D4A3E', '#C2A68D', '#EDE8E1', '#332924'] },
  ],
};

export const DEFAULT_LOOK: CustomLook = {
  id: 'look-default',
  name: 'Clean Campus Minimalist',
  hair: { style: 'Low Taper + Textured Crop', length: 'Short-Medium', maintenance: 'Low (~4 mins)' },
  top: { item: 'Oversized Boxy Cotton Tee', color: 'Oatmeal Sand', fit: 'Relaxed drop-shoulder' },
  bottom: { item: 'Straight-Fit Cotton Chinos', color: 'Olive Forest', fit: 'Straight single-break' },
  shoes: { item: 'Clean Minimal White Sneakers', color: 'Chalk White' },
  accessory: { item: 'Minimalist Stainless Watch', color: 'Brushed Silver with Tan Leather' },
  dominantColors: ['Oatmeal Sand', 'Olive Forest', 'Chalk White', 'Brushed Silver'],
  createdAt: new Date().toISOString(),
  occasion: 'Everyday / College',
};
