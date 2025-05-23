"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Home from "@/components/features/home/Home";

export default function HomePage() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  const shouldSkipIntro = skipIntro === "true";

  return <Home showIntro={!shouldSkipIntro} />;
} 