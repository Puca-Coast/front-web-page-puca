"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Header from "@/components/layout/Header";
import CarouselHome from "@/components/features/home/CarouselHome";
import Intro from "@/components/features/home/Intro";
import { LAYOUT_TOKENS } from "@/design-system/tokens/layout";
import Footer from "@/components/layout/Footer";

const CURRENT_SEASON = "primavera2024";

function HomePageContent() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  
  // Check intro status IMMEDIATELY, not in useEffect
  const shouldShowIntro = (() => {
    if (skipIntro === "true") return false;
    if (typeof window === 'undefined') return false; // SSR check
    
    const lastSeenSeason = localStorage.getItem('puca_intro_seen_season');
    return lastSeenSeason !== CURRENT_SEASON;
  })();

  const [introCompleted, setIntroCompleted] = useState(!shouldShowIntro);
  const [contentReady, setContentReady] = useState(false);

  const handleIntroComplete = () => {
    setIntroCompleted(true);
    localStorage.setItem('puca_intro_seen_season', CURRENT_SEASON);
    // Small delay to ensure smooth transition
    setTimeout(() => setContentReady(true), 100);
  };

  // If intro should show, wait for it to complete
  if (shouldShowIntro && !introCompleted) {
    return (
      <div className="fixed inset-0 z-50">
        <Intro onComplete={handleIntroComplete} />
      </div>
    );
  }

  const headerHeight = LAYOUT_TOKENS.header.height;

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Header renders first with proper z-index */}
      <Header isHome={!introCompleted} />
      
      {/* Main content with proper spacing */}
      <main 
        className="flex-grow relative"
        style={{ 
          opacity: contentReady || !shouldShowIntro ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <CarouselHome carouselHeight={`calc(92vh)`} />
        
      </main>
<Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}