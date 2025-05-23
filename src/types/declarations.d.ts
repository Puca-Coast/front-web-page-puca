// Declarações de tipos para módulos sem tipagem

// React
declare module 'react' {
  // Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => (void | (() => void | undefined)), deps?: ReadonlyArray<any>): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  
  // Tipos
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type FunctionComponent<P = {}> = (props: P) => React.ReactElement | null;
  export type ReactNode = React.ReactNode;
  export type CSSProperties = React.CSSProperties;
  
  // Outros
  export const Fragment: React.JSXElementConstructor<{}>;
}

// Next.js
declare module 'next/image' {
  import { FC, ImgHTMLAttributes } from 'react';
  
  export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    loader?: any;
    quality?: number | string;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    sizes?: string;
    className?: string;
    style?: React.CSSProperties;
    objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    objectPosition?: string;
    onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    unoptimized?: boolean;
  }
  
  const Image: FC<ImageProps>;
  export default Image;
}

declare module 'next/navigation' {
  export function useSearchParams(): URLSearchParams | null;
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    refresh: () => void;
    prefetch: (url: string) => void;
  };
}

declare module 'next/link' {
  import { FC, AnchorHTMLAttributes } from 'react';
  
  export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    legacyBehavior?: boolean;
    [key: string]: any;
  }

  const Link: FC<LinkProps>;
  export default Link;
}

// Swiper
declare module 'swiper/react' {
  import { FC } from 'react';
  
  interface SwiperProps {
    modules?: any[];
    spaceBetween?: number;
    slidesPerView?: number | 'auto';
    loop?: boolean;
    autoplay?: any;
    speed?: number;
    centeredSlides?: boolean;
    allowTouchMove?: boolean;
    grabCursor?: boolean;
    freeMode?: boolean;
    className?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export const Swiper: FC<SwiperProps>;
  
  interface SwiperSlideProps {
    key?: React.Key;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  export const SwiperSlide: FC<SwiperSlideProps>;
}

declare module 'swiper/modules' {
  export const Autoplay: any;
  export const EffectFade: any;
  export const Navigation: any;
  export const Pagination: any;
}

// Framer Motion
declare module 'framer-motion' {
  import { FC, ReactNode, CSSProperties } from 'react';
  
  interface MotionProps {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: any;
    variants?: any;
    [key: string]: any;
  }
  
  export const motion: {
    div: FC<MotionProps>;
    section: FC<MotionProps>;
    span: FC<MotionProps>;
    p: FC<MotionProps>;
    h1: FC<MotionProps>;
    h2: FC<MotionProps>;
    h3: FC<MotionProps>;
    button: FC<MotionProps>;
    ul: FC<MotionProps>;
    li: FC<MotionProps>;
    img: FC<MotionProps>;
    [key: string]: FC<MotionProps>;
  };

  interface AnimatePresenceProps {
    children?: ReactNode;
    initial?: boolean;
    mode?: "sync" | "wait" | "popLayout";
    onExitComplete?: () => void;
    exitBeforeEnter?: boolean;
    presenceAffectsLayout?: boolean;
    [key: string]: any;
  }

  export const AnimatePresence: FC<AnimatePresenceProps>;

  export function useAnimation(): any;
  export function useCycle<T>(...items: T[]): [T, (next?: number) => void];
}

// React Intersection Observer
declare module 'react-intersection-observer' {
  export function useInView(options?: {
    threshold?: number;
    triggerOnce?: boolean;
    rootMargin?: string;
  }): {
    ref: (node: any) => void;
    inView: boolean;
    entry?: IntersectionObserverEntry;
  };
}

declare module '@react-input/mask' {
  import { ComponentType, InputHTMLAttributes, ReactElement } from 'react';

  interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: string;
    replacement?: { [key: string]: RegExp } | string;
    showMask?: boolean;
    separate?: boolean;
    component?: ComponentType<any>;
    track?: (value: string) => string;
    modify?: (props: any) => any;
  }

  interface UseMaskOptions {
    mask: string;
    replacement?: { [key: string]: RegExp } | string;
    showMask?: boolean;
    separate?: boolean;
    track?: (value: string) => string;
    modify?: (props: any) => any;
  }

  export const InputMask: React.FC<InputMaskProps>;
  export function useMask(options: UseMaskOptions): React.RefObject<HTMLInputElement>;
} 