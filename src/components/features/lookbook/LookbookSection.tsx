"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import "@/styles/lookbookStyles.css";

interface LookbookSectionProps {
  pattern: "single" | "double" | "triple" | "mixed" | "masonry";
  images: {
    id: string;
    src: string;
    orientation: "horizontal" | "vertical";
    width: number;
    height: number;
    alt: string;
    blurDataURL: string;
  }[];
}

const LookbookSection: React.FC<LookbookSectionProps> = ({ pattern, images }) => {
  const fadeInVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`lookbook-section w-full my-12 ${
        pattern === "masonry" ? "masonry-grid" : "flex flex-wrap"
      } gap-8`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      variants={fadeInVariant}
    >
      {/* SINGLE */}
      {pattern === "single" && images.length === 1 && (
        <div
          className={`w-full relative ${
            images[0].orientation === "horizontal" ? "h-144" : "h-128"
          }`}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            fill
            style={{ objectFit: "contain" }}
            className="object-cover rounded-md"
            loading="lazy"
            placeholder="blur"
            blurDataURL={images[0].blurDataURL}
          />
        </div>
      )}

      {/* DOUBLE */}
      {pattern === "double" && images.length === 2 && (
        <div className="flex flex-col lg:flex-row w-full gap-8">
          {images.map((image) => (
            <motion.div
              key={image.id}
              variants={fadeInVariant}
              className={`relative ${
                image.orientation === "horizontal"
                  ? "w-full lg:w-1/2 h-144"
                  : "w-full lg:w-1/2 h-128"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
                loading="lazy"
                placeholder="blur"
                blurDataURL={image.blurDataURL}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* TRIPLE */}
      {pattern === "triple" && images.length === 3 && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            key={images[0].id}
            variants={fadeInVariant}
            className={`lg:col-span-2 relative ${
              images[0].orientation === "horizontal" ? "h-144" : "h-128"
            }`}
          >
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-md"
              loading="lazy"
              placeholder="blur"
              blurDataURL={images[0].blurDataURL}
            />
          </motion.div>

          {images.slice(1).map((image) => (
            <motion.div
              key={image.id}
              variants={fadeInVariant}
              className={`relative ${
                image.orientation === "horizontal" ? "h-80" : "h-72"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
                loading="lazy"
                placeholder="blur"
                blurDataURL={image.blurDataURL}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* MIXED */}
      {pattern === "mixed" && images.length === 3 && (
        <div className="flex flex-col lg:flex-row w-full gap-8">
          <motion.div
            key={images[0].id}
            variants={fadeInVariant}
            className={`relative ${
              images[0].orientation === "horizontal"
                ? "w-full lg:w-2/3 h-144"
                : "w-full lg:w-2/3 h-128"
            }`}
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
                className={`relative flex-1 ${
                  image.orientation === "horizontal" ? "h-72" : "h-64"
                }`}
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

      {/* MASONRY */}
      {pattern === "masonry" && (
        <motion.div
          className="masonry-grid w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          variants={fadeInVariant}
        >
          {images.map((image) => (
            <motion.div
              key={image.id}
              className="masonry-item mb-4 break-inside-avoid"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                style={{ objectFit: "cover" }}
                className="rounded-md"
                loading="lazy"
                placeholder="blur"
                blurDataURL={image.blurDataURL}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LookbookSection;
