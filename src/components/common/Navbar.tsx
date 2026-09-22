'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Scissors,
  Shirt,
  MessageSquare,
  Bookmark,
  Settings,
  Menu,
  X,
  UserCheck,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { getSavedHairstyles, getSavedOutfits } from '@/lib/savedStore';
import { getActiveSession, clearAuthSession, AuthSession } from '@/lib/auth/authStore';
import { AuthModal } from '@/components/auth/AuthModal';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const updateCounts = () => {
    const total = getSavedHairstyles().length + getSavedOutfits().length;
    setSavedCount(total);
  };

  const updateSession = () => {
    setSession(getActiveSession());
  };

  useEffect(() => {
    updateCounts();
    updateSession();

    window.addEventListener('facefit_saved_changed', updateCounts);
    window.addEventListener('facefit_auth_changed', updateSession);

    return () => {
      window.removeEventListener('facefit_saved_changed', updateCounts);
      window.removeEventListener('facefit_auth_changed', updateSession);
    };
  }, []);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    clearAuthSession();
    setUserDropdownOpen(false);
  };

  const navLinks = [
    { label: 'Dashboard', href: '/profile', icon: UserCheck },
    { label: 'Hairstyles', href: '/hairstyles', icon: Scissors },
    { label: 'Outfits', href: '/outfits', icon: Shirt },
    { label: 'AI Stylist', href: '/stylist', icon: MessageSquare },
    {
      label: 'Saved',
      href: '/saved',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : null,
    },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-widest text-neutral-900 uppercase">
              FaceFit <span className="text-amber-700 font-normal">AI</span>
            </span>
            <span className="text-[10px] tracking-wider text-neutral-400 uppercase -mt-0.5 font-medium">
              Personal Stylist
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-600 font-medium">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700' : 'text-neutral-400'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Session Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Session status */}
          {session && session.user.role === 'member' ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors text-xs font-semibold text-neutral-800 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-amber-700 text-white text-[10px] flex items-center justify-center font-bold">
                  {session.user.avatarInitials}
                </div>
                <span className="hidden sm:inline">{session.user.name}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-neutral-200 shadow-xl py-1.5 z-50 animate-fadeIn text-xs">
                  <div className="px-3.5 py-2 border-b border-neutral-100">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Signed in as</span>
                    <span className="font-semibold text-neutral-900 truncate block">{session.user.email}</span>
                  </div>
                  <Link
                    href="/saved"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 hover:bg-neutral-50 text-neutral-700 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-neutral-400" />
                    <span>My Lookbook</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 hover:bg-neutral-50 text-neutral-700 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Settings & Privacy</span>
                  </Link>
                  <div className="border-t border-neutral-100 my-1" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-2 px-3.5 py-2 hover:bg-rose-50 text-rose-700 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full border border-neutral-200/80 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <Link
            href="/analyze"
            className="inline-flex items-center justify-center px-3.5 sm:px-4 py-2 text-xs font-semibold tracking-wide text-white bg-neutral-900 hover:bg-neutral-800 rounded-full transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
          >
            Create Style Profile
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 bg-white px-4 py-4 space-y-1 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-neutral-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between px-3.5 text-xs">
            {session && session.user.role === 'member' ? (
              <button
                onClick={handleSignOut}
                className="text-rose-700 font-semibold flex items-center gap-1.5 py-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out ({session.user.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="text-neutral-800 font-semibold flex items-center gap-1.5 py-2 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-amber-700" />
                <span>Sign In to Sync Looks</span>
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
}
