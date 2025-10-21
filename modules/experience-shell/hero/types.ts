export type HeroMediaType = "spotify" | "youtube" | "image";

export interface HeroMedia {
  type: HeroMediaType;
  src: string;
  title?: string;
  thumbnailUrl?: string;
  fallbackImageUrl?: string;
}

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroAct {
  id: string;
  order: number;
  title: string;
  summary: string;
  language: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  media?: HeroMedia;
}
