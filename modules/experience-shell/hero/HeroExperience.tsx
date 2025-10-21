"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PortalProvider, usePortalContext } from "@/modules/experience-shell/PortalContext";
import PortalToggle from "@/modules/experience-shell/PortalToggle";
import { getStoredPortalPreference, storePortalPreference } from "@/modules/shared/preferences/client";
import { trackHeroEvent } from "@/modules/shared/analytics";
import HeroMediaPlayer from "./HeroMediaPlayer";
import type { HeroAct } from "./types";

export interface HeroExperienceProps {
  actsByLanguage: Record<string, HeroAct[]>;
  initialLanguage?: string;
}

interface HeroCallToActionsProps {
  actId: string;
  language: string;
  primary: HeroAct["primaryCta"];
  secondary: HeroAct["secondaryCta"];
}

interface HeroLanguageSelectorProps {
  languages: string[];
  currentLanguage: string;
  onSelect: (language: string) => void;
}

function formatOrder(order: number) {
  if (!Number.isFinite(order)) {
    return "00";
  }
  return order.toString().padStart(2, "0");
}

function HeroCallToActions({ actId, language, primary, secondary }: HeroCallToActionsProps) {
  const { overlayReady, mode } = usePortalContext();
  const hideCtas = mode === "portal" && overlayReady;
  const tabIndex = hideCtas ? -1 : undefined;

  const handlePrimaryClick = useCallback(() => {
    trackHeroEvent("pre_save_click", {
      act: actId,
      language,
      portalMode: mode,
      href: primary.href
    });
  }, [actId, language, mode, primary.href]);

  return (
    <div className="hero__cta-group" data-testid="hero-ctas" data-hidden={hideCtas} aria-hidden={hideCtas}>
      <a
        className="hero__cta hero__cta--primary"
        href={primary.href}
        tabIndex={tabIndex}
        data-testid="hero-cta-primary"
        onClick={handlePrimaryClick}
      >
        {primary.label}
      </a>
      <a
        className="hero__cta hero__cta--secondary"
        href={secondary.href}
        tabIndex={tabIndex}
        data-testid="hero-cta-secondary"
      >
        {secondary.label}
      </a>
    </div>
  );
}

function HeroLanguageSelector({ languages, currentLanguage, onSelect }: HeroLanguageSelectorProps) {
  if (languages.length <= 1) {
    return null;
  }

  return (
    <div className="hero__language">
      <p className="hero__language-label" id="hero-language-label">
        Idioma del hero
      </p>
      <div className="hero__language-toggles" role="radiogroup" aria-labelledby="hero-language-label">
        {languages.map((language) => {
          const isActive = language === currentLanguage;
          return (
            <button
              key={language}
              type="button"
              role="radio"
              aria-checked={isActive}
              className="hero__language-button"
              data-active={isActive}
              onClick={() => onSelect(language)}
            >
              {language.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PortalPreferenceSync({ language, actId }: { language: string; actId: string }) {
  const { mode } = usePortalContext();
  const previous = useRef<{ language: string; actId: string; mode: typeof mode }>();

  useEffect(() => {
    const snapshot = previous.current;
    if (!snapshot) {
      previous.current = { language, actId, mode };
      return;
    }
    if (snapshot.language === language && snapshot.actId === actId && snapshot.mode === mode) {
      return;
    }
    previous.current = { language, actId, mode };
    void storePortalPreference({ mode, act: actId, language });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("md_language", language);
        window.localStorage.setItem("md_act", actId);
        window.localStorage.setItem("md_portal_mode", mode);
      } catch {
        // ignore localStorage errors (private mode, etc.)
      }
    }
  }, [language, actId, mode]);

  return null;
}

export function HeroExperience({ actsByLanguage, initialLanguage = "es" }: HeroExperienceProps) {
  const availableLanguages = useMemo(
    () =>
      Object.entries(actsByLanguage)
        .filter(([, acts]) => acts.length > 0)
        .map(([language]) => language),
    [actsByLanguage]
  );

  const fallbackLanguage = availableLanguages[0] ?? initialLanguage;

  const [language, setLanguage] = useState<string>(fallbackLanguage);
  const [activeIndex, setActiveIndex] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const sortedActs = useMemo(() => {
    const acts = actsByLanguage[language] ?? actsByLanguage[fallbackLanguage] ?? [];
    return [...acts].sort((a, b) => a.order - b.order);
  }, [actsByLanguage, language, fallbackLanguage]);

  const activeAct = sortedActs[activeIndex] ?? sortedActs[0];

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedLanguage =
      window.localStorage.getItem("md_language") ?? getStoredPortalPreference()?.language ?? undefined;

    if (storedLanguage && availableLanguages.includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }
  }, [availableLanguages]);

  useEffect(() => {
    setActiveIndex(0);
  }, [language]);

  useEffect(() => {
    if (!sortedActs.length) {
      setAnnouncement("No hay actos disponibles por el momento.");
      return;
    }
    if (activeAct) {
      setAnnouncement(`Mostrando ${activeAct.title} en idioma ${language.toUpperCase()}.`);
    }
  }, [activeAct, sortedActs.length, language]);

  const handleLanguageChange = useCallback(
    (nextLanguage: string) => {
      if (nextLanguage === language) {
        return;
      }
      if (!availableLanguages.includes(nextLanguage)) {
        return;
      }
      setLanguage(nextLanguage);
    },
    [language, availableLanguages]
  );

  if (!sortedActs.length || !activeAct) {
    return (
      <section className="hero" aria-label="Narrativa del proyecto">
        <div className="hero__empty">
          <h1 className="hero__headline">Narrativa del proyecto</h1>
          <p>Aun no hay actos configurados. Vuelve pronto para descubrir la historia NMD.</p>
        </div>
      </section>
    );
  }

  const headingId = "hero-heading";

  return (
    <PortalProvider act={activeAct.id} language={language}>
      <PortalPreferenceSync language={language} actId={activeAct.id} />
      <section className="hero" id="hero-portal" aria-labelledby={headingId}>
        <div className="hero__grid">
          <header className="hero__narrative">
            <p className="hero__eyebrow">Acto {formatOrder(activeAct.order)}</p>
            <h1 id={headingId} className="hero__headline">
              {activeAct.title}
            </h1>
            {activeAct.summary && <p className="hero__summary">{activeAct.summary}</p>}
            <HeroCallToActions
              actId={activeAct.id}
              language={language}
              primary={activeAct.primaryCta}
              secondary={activeAct.secondaryCta}
            />
          </header>

          <HeroMediaPlayer actTitle={activeAct.title} media={activeAct.media} />

          <aside className="hero__acts" aria-label="Actos disponibles">
            <ul className="hero__act-list">
              {sortedActs.map((act, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={`${language}-${act.id}`}>
                    <button
                      type="button"
                      className="hero__act-button"
                      data-active={isActive}
                      data-testid="hero-act-button"
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isActive}
                    >
                      <span className="hero__act-order">{formatOrder(act.order)}</span>
                      <span className="hero__act-title">{act.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="hero__controls">
            <HeroLanguageSelector
              languages={availableLanguages}
              currentLanguage={language}
              onSelect={handleLanguageChange}
            />
            <PortalToggle heroId="hero-portal" />
          </div>
        </div>
        <span className="sr-only" role="status" aria-live="polite">
          {announcement}
        </span>
      </section>
    </PortalProvider>
  );
}

export default HeroExperience;
