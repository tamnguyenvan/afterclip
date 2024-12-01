'use client';

import { Header } from '@/components/sections/header';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { FAQs } from '@/components/sections/faqs';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <Header />

        <Hero />
        <Features />
        <FAQs />
      </div>
    </div>
  );
}