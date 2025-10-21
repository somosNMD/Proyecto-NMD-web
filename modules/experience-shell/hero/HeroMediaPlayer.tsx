"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { prefersReducedMotion } from "@/modules/experience-shell/environment";
import type { HeroMedia } from "./types";

type HeroMediaFallbackReason = "reduced-motion" | "error" | "unsupported";

export interface HeroMediaPlayerProps {
  media?: HeroMedia;
  actTitle: string;
}

function buildFallbackMessage(reason: HeroMediaFallbackReason): string {
  if (reason === "reduced-motion") {
    return "Se muestra la versión estática del teaser porque tu preferencia es reducir animaciones.";
  }
  if (reason === "unsupported") {
    return "Formato multimedia no soportado. Mostramos una versión estática del teaser.";
  }
  return "No pudimos cargar el reproductor. Usa la versión estática para ver el teaser.";
}

function getEmbedTitle(type: HeroMedia["type"], actTitle: string) {
  if (type === "spotify") {
    return `Reproductor Spotify del acto ${actTitle}`;
  }
  if (type === "youtube") {
    return `Reproductor YouTube del acto ${actTitle}`;
  }
  return actTitle;
}

function getEmbedAllow(type: HeroMedia["type"]) {
  if (type === "spotify") {
    return "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  }
  if (type === "youtube") {
    return "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  }
  return undefined;
}

export function HeroMediaPlayer({ media, actTitle }: HeroMediaPlayerProps) {
  const [fallbackReason, setFallbackReason] = useState<HeroMediaFallbackReason | null>(null);
  const [announcement, setAnnouncement] = useState("");

  const shouldRenderEmbed = useMemo(() => {
    if (!media) {
      return false;
    }
    if (fallbackReason) {
      return false;
    }
    return media.type === "spotify" || media.type === "youtube";
  }, [media, fallbackReason]);

  useEffect(() => {
    if (!media) {
      setFallbackReason("unsupported");
      setAnnouncement("No se encontró contenido multimedia. Se muestra fallback estático.");
      return;
    }

    if (prefersReducedMotion()) {
      setFallbackReason("reduced-motion");
      setAnnouncement(buildFallbackMessage("reduced-motion"));
    }

    if (media.type === "image") {
      setFallbackReason("unsupported");
      setAnnouncement(buildFallbackMessage("unsupported"));
    }
  }, [media]);

  useEffect(() => {
    if (fallbackReason) {
      setAnnouncement(buildFallbackMessage(fallbackReason));
    }
  }, [fallbackReason]);

  const fallbackImage = media?.fallbackImageUrl ?? media?.thumbnailUrl;
  const teaserHref = media?.src ?? "#teaser";

  return (
    <div className={clsx("hero__media", fallbackReason && "hero__media--fallback")}>
      {shouldRenderEmbed && media && (
        <iframe
          title={getEmbedTitle(media.type, actTitle)}
          src={media.src}
          className="hero__media-frame"
          allowFullScreen={media.type === "youtube"}
          allow={getEmbedAllow(media.type)}
          loading="lazy"
          onError={() => setFallbackReason("error")}
          data-testid="hero-media-embed"
        />
      )}

      {!shouldRenderEmbed && (
        <div className="hero__media-fallback" data-testid="hero-media-fallback">
          {fallbackImage ? (
            <img
              src={fallbackImage}
              alt={`Teaser del acto ${actTitle}`}
              loading="lazy"
              className="hero__media-fallback-image"
            />
          ) : (
            <div className="hero__media-fallback-placeholder" aria-hidden="true" />
          )}
          <div className="hero__media-fallback-copy">
            <p>{buildFallbackMessage(fallbackReason ?? "unsupported")}</p>
            <a className="hero__cta hero__cta--secondary" href={teaserHref} target="_blank" rel="noreferrer">
              Ver teaser
            </a>
          </div>
        </div>
      )}

      <span className="sr-only" aria-live="assertive" data-testid="hero-media-announcement">
        {announcement}
      </span>
    </div>
  );
}

export default HeroMediaPlayer;
