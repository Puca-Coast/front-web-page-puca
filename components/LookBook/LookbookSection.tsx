// components/Lookbook/LookbookSection.tsx

"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface LookbookSectionProps {
  pattern: "single" | "double" | "triple" | "mixed" | "masonry";
  images: { id: string; src: string; orientation: "horizontal" | "vertical" }[];
}

const LookbookSection: React.FC<LookbookSectionProps> = ({ pattern, images }) => {
  const fadeInVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`lookbook-section w-full my-12 ${pattern === "masonry" ? "masonry-grid" : "flex flex-wrap"} gap-8`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      variants={fadeInVariant}
    >
      {pattern === "single" && images.length === 1 && (
        <div className={`w-full relative ${images[0].orientation === "horizontal" ? "h-144" : "h-128"}`}>
          <Image 
            src={images[0].src} 
            alt="Lookbook Image" 
            fill 
            className="object-cover rounded-md" 
            loading="lazy" // Lazy loading
            placeholder="blur" // Placeholder de blur
            blurDataURL="/assets/placeholder.png" // Substitua pelo caminho da sua imagem placeholder
          />
        </div>
      )}

      {pattern === "double" && images.length === 2 && (
        <div className="flex flex-col lg:flex-row w-full gap-8">
          {images.map((image) => (
            <motion.div
              key={image.id}
              variants={fadeInVariant}
              className={`relative ${image.orientation === "horizontal" ? "w-full lg:w-1/2 h-144" : "w-full lg:w-1/2 h-128"}`}
            >
              <Image 
                src={image.src} 
                alt={`Lookbook Image ${image.id}`} 
                fill 
                className="object-cover rounded-md" 
                loading="lazy" // Lazy loading
                placeholder="blur" 
                blurDataURL="/assets/placeholder.png" 
              />
            </motion.div>
          ))}
        </div>
      )}

      {pattern === "triple" && images.length === 3 && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            key={images[0].id}
            variants={fadeInVariant}
            className={`lg:col-span-2 relative ${images[0].orientation === "horizontal" ? "h-144" : "h-128"}`}
          >
            <Image 
              src={images[0].src} 
              alt={`Lookbook Image ${images[0].id}`} 
              fill 
              className="object-cover rounded-md" 
              loading="lazy" 
              placeholder="blur" 
              blurDataURL="/assets/placeholder.png" 
            />
          </motion.div>
          {images.slice(1).map((image) => (
            <motion.div
              key={image.id}
              variants={fadeInVariant}
              className={`relative ${image.orientation === "horizontal" ? "h-80" : "h-72"}`}
            >
              <Image 
                src={image.src} 
                alt={`Lookbook Image ${image.id}`} 
                fill 
                className="object-cover rounded-md" 
                loading="lazy" 
                placeholder="blur" 
                blurDataURL="/assets/placeholder.png" 
              />
            </motion.div>
          ))}
        </div>
      )}

      {pattern === "mixed" && images.length === 3 && (
        <div className="flex flex-col lg:flex-row w-full gap-8">
          <motion.div
            key={images[0].id}
            variants={fadeInVariant}
            className={`relative ${images[0].orientation === "horizontal" ? "w-full lg:w-2/3 h-144" : "w-full lg:w-2/3 h-128"}`}
          >
            <Image 
              src={images[0].src} 
              alt={`Lookbook Image ${images[0].id}`} 
              fill 
              className="object-cover rounded-md" 
              loading="lazy" 
              placeholder="blur" 
              blurDataURL="/assets/placeholder.png" 
            />
          </motion.div>
          <div className="w-full lg:w-1/3 h-144 flex flex-col gap-8">
            {images.slice(1).map((image) => (
              <motion.div
                key={image.id}
                variants={fadeInVariant}
                className={`relative flex-1 ${image.orientation === "horizontal" ? "h-72" : "h-64"}`}
              >
                <Image 
                  src={image.src} 
                  alt={`Lookbook Image ${image.id}`} 
                  fill 
                  className="object-cover rounded-md" 
                  loading="lazy" 
                  placeholder="blur" 
                  blurDataURL="/assets/placeholder.png" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {pattern === "masonry" && (
        <>
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="masonry-item relative w-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                gridRowEnd: `span ${image.orientation === "horizontal" ? 60 : 50}`, // Ajuste conforme o tamanho das imagens
              }}
            >
              <Image 
                src={image.src} 
                alt={`Lookbook Image ${image.id}`} 
                fill 
                className="rounded-md" 
                loading="lazy" 
                placeholder="blur" 
                blurDataURL="/assets/placeholder.png" 
              />
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
};

export default LookbookSection;
