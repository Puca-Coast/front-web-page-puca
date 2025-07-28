// Interfaces e tipos usados em múltiplos componentes

export interface LookbookPhoto {
  _id?: string;
  url: string;
  description?: string;
}

export interface CarouselHomeProps {
  carouselHeight?: string;
}

export interface MainContentProps {
  isHome: boolean;
}