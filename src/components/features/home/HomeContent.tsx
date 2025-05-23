"use client";

import { useSearchParams } from "next/navigation";
import Home from "./Home";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  const shouldSkipIntro = skipIntro === "true";

  return <Home showIntro={!shouldSkipIntro} />;
} 