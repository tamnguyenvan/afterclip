'use client';

import { Header } from '@/components/sections/header';
import { MainTool } from '@/components/sections/main-tool';

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <Header />
        <MainTool />
      </div>
    </div>
  );
}