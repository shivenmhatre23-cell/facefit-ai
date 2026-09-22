import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { MobileBottomNav } from '@/components/common/MobileBottomNav';

const sansFont = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const serifFont = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FaceFit AI — Personal Style, Grooming & Color Architecture',
  description:
    'Discover bespoke hairstyles with barber cards, personal color palettes, and curated wardrobe silhouettes calibrated to your natural facial geometry.',
  keywords: ['AI stylist', 'face shape analysis', 'grooming', 'color palette', 'hairstyle recommendations', 'barber guide'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-[#111827] font-sans selection:bg-amber-100 selection:text-amber-900 pb-16 lg:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
