"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HomeWithIntro from "@/components/Home/HomeWithIntro";
import HomeWithoutIntro from "@/components/Home/HomeWithoutIntro";

export default function HomeClient() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  const shouldSkipIntro = skipIntro === "true";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-screen h-screen bg-black"></div>; // Placeholder durante SSR
  }

  return (
    <>
      {shouldSkipIntro ? (
        <HomeWithoutIntro />
      ) : (
        <HomeWithIntro />
      )}
    </>
  );
} 