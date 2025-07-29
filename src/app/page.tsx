"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Header from "@/components/layout/Header";
import CarouselHome from "@/components/features/home/CarouselHome";
import Intro from "@/components/features/home/Intro";
import { LAYOUT_TOKENS } from "@/design-system/tokens/layout";
import Footer from "@/components/layout/Footer";

const CURRENT_SEASON = "primavera2024";

function HomePageContent() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  
  // Start with null to handle SSR
  const [shouldShowIntro, setShouldShowIntro] = useState<boolean | null>(null);
  const [introCompleted, setIntroCompleted] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  // Check intro status after mount (client-side only)
  useEffect(() => {
    if (skipIntro === "true") {
      setShouldShowIntro(false);
      setIntroCompleted(true);
      setContentReady(true);
    } else {
      const lastSeenSeason = localStorage.getItem('puca_intro_seen_season');
      const showIntro = lastSeenSeason !== CURRENT_SEASON;
      setShouldShowIntro(showIntro);
      if (!showIntro) {
        setIntroCompleted(true);
        setContentReady(true);
      }
    }
  }, [skipIntro]);

  const handleIntroComplete = () => {
    setIntroCompleted(true);
    localStorage.setItem('puca_intro_seen_season', CURRENT_SEASON);
    setTimeout(() => setContentReady(true), 100);
  };

  // Show loading while determining intro state
  if (shouldShowIntro === null) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm opacity-70">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show intro if needed
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
      <Header isHome={!introCompleted} />
      
      <main
        className="flex-grow relative"
        style={{
          opacity: contentReady ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        <CarouselHome carouselHeight="calc(92vh)" />
      </main>
      
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm opacity-70">Carregando...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}