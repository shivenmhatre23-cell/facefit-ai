import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { SampleProfilePreview } from '@/components/landing/SampleProfilePreview';
import { HowItWorks } from '@/components/landing/HowItWorks';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <SampleProfilePreview />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
