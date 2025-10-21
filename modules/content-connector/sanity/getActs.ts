import { randomUUID } from "node:crypto";
import type { HeroAct, HeroMedia } from "@/modules/experience-shell/hero/types";
import { getSanityClient, isSanityConfigured } from "./client";

interface RawHeroMedia {
  _type?: string;
  url?: string;
  assetUrl?: string;
  title?: string;
  thumbnailUrl?: string;
  fallbackImageUrl?: string;
}

interface RawAct {
  _id?: string;
  title?: string;
  order?: number;
  language?: string;
  summary?: string;
  ctaPrimary?: { label?: string; href?: string; title?: string; url?: string };
  ctaSecondary?: { label?: string; href?: string; title?: string; url?: string };
  heroMedia?: RawHeroMedia;
}

const ACTS_QUERY = `
  *[_type == "act"] | order(order asc){
    _id,
    title,
    order,
    language,
    "summary": coalesce(pt::text(copy), copy, description, tagline),
    "ctaPrimary": {
      "label": coalesce(ctaPrimary.label, ctaPrimary.title),
      "href": coalesce(ctaPrimary.url, ctaPrimary.href)
    },
    "ctaSecondary": {
      "label": coalesce(ctaSecondary.label, ctaSecondary.title),
      "href": coalesce(ctaSecondary.url, ctaSecondary.href)
    },
    heroMedia{
      _type,
      url,
      "assetUrl": asset->url,
      title,
      "thumbnailUrl": thumbnail.asset->url,
      "fallbackImageUrl": fallbackImage.asset->url
    }
  }
`;

const FALLBACK_ACTS: Record<string, HeroAct[]> = {
  es: [
    {
      id: "fallback-es-act-1",
      order: 1,
      title: "Acto I - Frontera luminosa",
      summary: "Introducimos la narrativa del viaje NMD con un llamado directo al pre-save del album.",
      language: "es",
      primaryCta: { label: "Pre-save ahora", href: "https://example.com/pre-save" },
      secondaryCta: { label: "Unirme a la newsletter", href: "#newsletter" }
    },
    {
      id: "fallback-es-act-2",
      order: 2,
      title: "Acto II - Ritmos en suspension",
      summary: "Exploramos los matices sonoros con visuales degradables y CTA siempre visibles.",
      language: "es",
      primaryCta: { label: "Escuchar teaser", href: "https://example.com/teaser" },
      secondaryCta: { label: "Ver agenda de shows", href: "#agenda" }
    },
    {
      id: "fallback-es-act-3",
      order: 3,
      title: "Acto III - Portal colaborativo",
      summary: "Invitamos a la comunidad a vivir el modo Portal sin friccion, incluso en dispositivos modestos.",
      language: "es",
      primaryCta: { label: "Activar modo Portal", href: "#portal" },
      secondaryCta: { label: "Descargar presskit", href: "#presskit" }
    }
  ],
  en: [
    {
      id: "fallback-en-act-1",
      order: 1,
      title: "Act I - Luminous border",
      summary: "Set the tone for NMD storytelling with a visible primary CTA for the pre-save.",
      language: "en",
      primaryCta: { label: "Pre-save now", href: "https://example.com/pre-save" },
      secondaryCta: { label: "Join the newsletter", href: "#newsletter" }
    },
    {
      id: "fallback-en-act-2",
      order: 2,
      title: "Act II - Suspended rhythms",
      summary: "Showcase the second act with accessible CTAs and degradable visuals for slow networks.",
      language: "en",
      primaryCta: { label: "Listen to teaser", href: "https://example.com/teaser" },
      secondaryCta: { label: "See live agenda", href: "#agenda" }
    },
    {
      id: "fallback-en-act-3",
      order: 3,
      title: "Act III - Collaborative portal",
      summary: "Invite the community to experience the Portal mode without losing key CTAs.",
      language: "en",
      primaryCta: { label: "Activate Portal", href: "#portal" },
      secondaryCta: { label: "Download press kit", href: "#presskit" }
    }
  ]
};

function normalizeMedia(raw?: RawHeroMedia): HeroMedia | undefined {
  if (!raw) {
    return undefined;
  }

  const type = (raw._type ?? "").toLowerCase();
  const src = raw.url ?? raw.assetUrl;

  if (!src) {
    return undefined;
  }

  if (type.includes("spotify")) {
    return {
      type: "spotify",
      src,
      title: raw.title
    };
  }

  if (type.includes("youtube")) {
    return {
      type: "youtube",
      src,
      title: raw.title,
      thumbnailUrl: raw.thumbnailUrl
    };
  }

  return {
    type: "image",
    src,
    title: raw.title,
    thumbnailUrl: raw.thumbnailUrl,
    fallbackImageUrl: raw.fallbackImageUrl
  };
}

function normalizeAct(raw: RawAct, fallbackLanguage: string): HeroAct | null {
  const id = raw._id ?? randomUUID();
  const title = raw.title?.trim();
  const primaryLabel = raw.ctaPrimary?.label ?? raw.ctaPrimary?.title;
  const primaryHref = raw.ctaPrimary?.href ?? raw.ctaPrimary?.url;
  const secondaryLabel = raw.ctaSecondary?.label ?? raw.ctaSecondary?.title;
  const secondaryHref = raw.ctaSecondary?.href ?? raw.ctaSecondary?.url;

  if (!title || !primaryLabel || !primaryHref || !secondaryLabel || !secondaryHref) {
    return null;
  }

  return {
    id,
    order: typeof raw.order === "number" ? raw.order : Number.POSITIVE_INFINITY,
    title,
    summary: raw.summary?.trim() ?? "",
    language: raw.language ?? fallbackLanguage,
    primaryCta: { label: primaryLabel, href: primaryHref },
    secondaryCta: { label: secondaryLabel, href: secondaryHref },
    media: normalizeMedia(raw.heroMedia)
  };
}

function ensureMinimumActs(acts: HeroAct[], language: string): HeroAct[] {
  const result = [...acts];
  const fallback = FALLBACK_ACTS[language] ?? FALLBACK_ACTS.es;
  let index = 0;

  while (result.length < 3 && index < fallback.length) {
    const candidate = fallback[index++];
    const identifier = `${candidate.id}-fallback-${index}`;
    result.push({
      ...candidate,
      id: identifier
    });
  }

  if (result.length < 3 && language !== "es") {
    return ensureMinimumActs(result, "es");
  }

  return result;
}

export async function getActs(options?: { language?: string }): Promise<HeroAct[]> {
  const language = options?.language ?? "es";
  const client = getSanityClient();

  if (!client || !isSanityConfigured()) {
    return ensureMinimumActs([], language);
  }

  try {
    const rawActs = await client.fetch<RawAct[]>(ACTS_QUERY, { language });
    const normalized = rawActs
      .map((raw) => normalizeAct(raw, language))
      .filter((act): act is HeroAct => act !== null)
      .sort((a, b) => a.order - b.order);

    const acts = normalized.length > 0 ? normalized : [];
    const completed = ensureMinimumActs(acts, language);
    return completed.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.warn("[hero] getActs fallback due to error:", error);
    const fallback = ensureMinimumActs([], language);
    return fallback.sort((a, b) => a.order - b.order);
  }
}

export function getFallbackActs(language: string): HeroAct[] {
  const fallback = FALLBACK_ACTS[language] ?? FALLBACK_ACTS.es;
  return fallback.map((act) => ({ ...act }));
}
