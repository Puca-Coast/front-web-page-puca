// components/Lookbook/SingleSection.tsx
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface SingleSectionProps {
  image: { id: string; src: string; orientation: "horizontal" | "vertical" };
}

const SingleSection: React.FC<SingleSectionProps> = ({ image }) => (
  <motion.div
    className={`w-full relative ${image.orientation === "horizontal" ? "h-144" : "h-128"}`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <Image src={image.src} alt="Lookbook Image" fill className="object-cover rounded-md" />
  </motion.div>
);

export default SingleSection;
