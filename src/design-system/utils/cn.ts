/**
 * className utility for consistent class name handling
 * 
 * This utility provides a clean way to conditionally combine class names
 * and will be the foundation for our design system components.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}