'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Camera,
  UserCheck,
  Layers,
  Shirt,
  MessageSquare,
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Analyze', href: '/analyze', icon: Camera },
    { label: 'Profile', href: '/profile', icon: UserCheck },
    { label: 'Builder', href: '/builder', icon: Layers },
    { label: 'Wardrobe', href: '/wardrobe', icon: Shirt },
    { label: 'Stylist', href: '/stylist', icon: MessageSquare },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? 'text-neutral-950 font-semibold scale-105'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <div className={`relative p-1 rounded-lg ${isActive ? 'bg-neutral-100' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-900' : 'text-neutral-400'}`} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
