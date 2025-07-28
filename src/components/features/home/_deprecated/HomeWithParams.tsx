"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Home from "./Home";

const CURRENT_SEASON = "primavera2024"; // Update this when changing collections

function HomeWithParamsContent() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  const [shouldShowIntro, setShouldShowIntro] = useState(true);

  useEffect(() => {
    // If URL explicitly says to skip intro, skip it
    if (skipIntro === "true") {
      setShouldShowIntro(false);
      return;
    }

    // Check if user has seen intro for current season
    const lastSeenSeason = localStorage.getItem('puca_intro_seen_season');
    const hasSeenCurrentSeason = lastSeenSeason === CURRENT_SEASON;

    // Show intro only if:
    // 1. First time visitor (no season in localStorage)
    // 2. New season collection (different season than stored)
    if (hasSeenCurrentSeason) {
      setShouldShowIntro(false);
    } else {
      setShouldShowIntro(true);
      // Mark current season as seen
      localStorage.setItem('puca_intro_seen_season', CURRENT_SEASON);
    }
  }, [skipIntro]);

  return <Home showIntro={shouldShowIntro} />;
}

export default function HomeWithParams() {
  return (
    <Suspense fallback={<Home showIntro={true} />}>
      <HomeWithParamsContent />
    </Suspense>
  );
} 