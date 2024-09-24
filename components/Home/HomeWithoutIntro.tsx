"use client";

import React from "react";
import MainContent from "@/components/Home/MainContent";

const HomeWithoutIntro: React.FC = () => {
  return <MainContent isHome={false} />;
};

export default HomeWithoutIntro;
