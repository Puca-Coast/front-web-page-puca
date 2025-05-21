"use client";

import React, { useState } from "react";
import Intro from "@/components/features/home/Intro";
import MainContent from "@/components/features/home/MainContent";

const HomeWithIntro: React.FC = () => {
  const [introCompleted, setIntroCompleted] = useState(false);

  const handleIntroComplete = () => {
    console.log("Intro Concluída");
    setIntroCompleted(true);
  };

  return (
    <>
      {!introCompleted ? (
        <Intro onComplete={handleIntroComplete} />
      ) : (
        <MainContent isHome={false} />
      )}
    </>
  );
};

export default HomeWithIntro;
