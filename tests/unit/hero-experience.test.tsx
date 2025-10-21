import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/shared/preferences/client", () => ({
  getStoredPortalPreference: vi.fn(() => null),
  storePortalPreference: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("@/modules/shared/analytics", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/modules/shared/analytics")>();
  return {
    ...actual,
    trackHeroEvent: vi.fn()
  };
});

import { HeroExperience } from "@/modules/experience-shell/hero/HeroExperience";
import type { HeroAct } from "@/modules/experience-shell/hero/types";
import { trackHeroEvent } from "@/modules/shared/analytics";
import { storePortalPreference } from "@/modules/shared/preferences/client";

const originalMatchMedia = globalThis.matchMedia;

const actsEs: HeroAct[] = [
  {
    id: "act-1",
    order: 1,
    title: "Acto I - Resonancia inicial",
    summary: "Narrativa introductoria para contextualizar el recorrido del proyecto.",
    language: "es",
    primaryCta: { label: "Pre-save album", href: "https://example.com/pre-save" },
    secondaryCta: { label: "Unirme al boletin", href: "#newsletter" },
    media: {
      type: "youtube",
      src: "https://www.youtube.com/embed/es-es",
      thumbnailUrl: "https://example.com/es-thumb.jpg"
    }
  },
  {
    id: "act-2",
    order: 2,
    title: "Acto II - Horizonte expandido",
    summary: "Profundizamos en los matices sonoros con CTA visibles en todo momento.",
    language: "es",
    primaryCta: { label: "Escuchar teaser", href: "https://example.com/teaser" },
    secondaryCta: { label: "Ver agenda", href: "#agenda" },
    media: {
      type: "spotify",
      src: "https://open.spotify.com/embed/track/es"
    }
  }
];

const actsEn: HeroAct[] = [
  {
    id: "act-en-1",
    order: 1,
    title: "Act I - Resonance Awakening",
    summary: "Intro narrative in English to contextualize the journey.",
    language: "en",
    primaryCta: { label: "Pre-save album", href: "https://example.com/pre-save-en" },
    secondaryCta: { label: "Join the newsletter", href: "#newsletter-en" },
    media: {
      type: "youtube",
      src: "https://www.youtube.com/embed/en-en",
      thumbnailUrl: "https://example.com/en-thumb.jpg"
    }
  }
];

const sampleActs = {
  es: actsEs,
  en: actsEn
};

beforeEach(() => {
  globalThis.matchMedia = originalMatchMedia;
  vi.clearAllMocks();
  if (typeof window !== "undefined") {
    window.localStorage.clear();
  }
});

afterEach(() => {
  globalThis.matchMedia = originalMatchMedia;
});

describe("HeroExperience", () => {
  it("renders hero narrative with acts, CTAs and media embed visibles", () => {
    render(<HeroExperience actsByLanguage={sampleActs} initialLanguage="es" />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("Acto I");

    const ctas = screen.getByTestId("hero-ctas");
    expect(ctas).toHaveAttribute("data-hidden", "false");

    const actButtons = screen.getAllByTestId("hero-act-button");
    expect(actButtons).toHaveLength(actsEs.length);

    expect(screen.getByTestId("hero-media-embed")).toBeInTheDocument();

    expect(storePortalPreference).toHaveBeenCalledWith(
      expect.objectContaining({ mode: "lite", act: "act-1", language: "es" })
    );
  });

  it("updates active act when selecting a different item", () => {
    render(<HeroExperience actsByLanguage={sampleActs} initialLanguage="es" />);

    const actButtons = screen.getAllByTestId("hero-act-button");
    fireEvent.click(actButtons[1]);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toContain("Acto II");
  });

  it("falls back to static media when prefers-reduced-motion is enabled", () => {
    globalThis.matchMedia = () =>
      ({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false
      }) as MediaQueryList;

    render(<HeroExperience actsByLanguage={sampleActs} initialLanguage="es" />);

    expect(screen.getByTestId("hero-media-fallback")).toBeInTheDocument();
    const announcement = screen.getByTestId("hero-media-announcement");
    expect(announcement.textContent).toContain("versión estática");
  });

  it("cambia el idioma del hero al seleccionar EN y actualiza el encabezado", async () => {
    const user = userEvent.setup();
    render(<HeroExperience actsByLanguage={sampleActs} initialLanguage="es" />);

    const englishToggle = screen.getByRole("radio", { name: "EN" });
    await user.click(englishToggle);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain("Act I - Resonance Awakening");
    expect(storePortalPreference).toHaveBeenLastCalledWith(
      expect.objectContaining({ mode: "lite", act: "act-en-1", language: "en" })
    );
  });

  it("emite evento pre_save_click con metadata y portal mode", async () => {
    const user = userEvent.setup();
    render(<HeroExperience actsByLanguage={sampleActs} initialLanguage="es" />);

    const primaryCta = screen.getByTestId("hero-cta-primary");
    primaryCta.addEventListener("click", (event) => event.preventDefault());
    await user.click(primaryCta);

    expect(trackHeroEvent).toHaveBeenCalledWith("pre_save_click", {
      act: "act-1",
      language: "es",
      portalMode: "lite",
      href: "https://example.com/pre-save"
    });
  });
});
