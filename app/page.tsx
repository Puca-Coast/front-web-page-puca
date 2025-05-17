"use client";

import React, { Suspense } from "react";
import HomeWithIntro from "@/components/Home/HomeWithIntro";
import HomeWithoutIntro from "@/components/Home/HomeWithoutIntro";

// Componente interno que usa useSearchParams
function HomeContent() {
  // Este componente será renderizado apenas no cliente
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return <div className="w-screen h-screen flex items-center justify-center bg-black text-white">Carregando...</div>;
  }
  
  // Verificando URL para skipIntro
  const urlParams = new URLSearchParams(window.location.search);
  const skipIntro = urlParams.get('skipIntro') === 'true';
  
  return (
    <>
      {skipIntro ? (
        <HomeWithoutIntro />
      ) : (
        <HomeWithIntro />
      )}
    </>
  );
}

// Componente principal
export default function Home() {
  return (
    <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center bg-black text-white">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}
