"use client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { trackPortalEvent } from "@/modules/shared/analytics";
import {
  getStoredPortalPreference,
  storePortalPreference
} from "@/modules/shared/preferences/client";
import type { PortalFallbackReason, PortalMode } from "@/modules/shared/portal/types";
import { detectWebGLSupport, prefersReducedMotion } from "./environment";

export interface PortalContextValue {
  mode: PortalMode;
  overlayReady: boolean;
  isOverlayLoading: boolean;
  fallbackReason?: PortalFallbackReason;
  togglePortal: () => void;
  setMode: (mode: PortalMode, meta?: { source?: "toggle" | "fallback"; reason?: PortalFallbackReason }) => void;
  markOverlayLoading: () => void;
  markOverlayReady: () => void;
  metadata: {
    act: string;
    language: string;
  };
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export interface PortalProviderProps extends PropsWithChildren {
  defaultMode?: PortalMode;
  act?: string;
  language?: string;
}

export function PortalProvider({
  children,
  defaultMode = "lite",
  act = "acto-1",
  language = "es"
}: PortalProviderProps) {
  const [mode, setModeState] = useState<PortalMode>(defaultMode);
  const [overlayReady, setOverlayReady] = useState(false);
  const [isOverlayLoading, setOverlayLoading] = useState(false);
  const [fallbackReason, setFallbackReason] = useState<PortalFallbackReason>();
  const hasRunStartupChecks = useRef(false);

  useEffect(() => {
    const stored = getStoredPortalPreference();
    if (stored?.mode) {
      setModeState(stored.mode);
    }
  }, []);

  const applyFallback = useCallback(
    (reason: PortalFallbackReason) => {
      setModeState("lite");
      setFallbackReason(reason);
      setOverlayReady(false);
      setOverlayLoading(false);
      void storePortalPreference({ mode: "lite", act, language, fallbackReason: reason });
      trackPortalEvent("portal_toggle", { act, language, mode: "lite", source: "fallback", fallbackReason: reason });
    },
    [act, language]
  );

  useEffect(() => {
    if (typeof window === "undefined" || hasRunStartupChecks.current) {
      return;
    }

    hasRunStartupChecks.current = true;

    const reduced = prefersReducedMotion();
    const webglAvailable = detectWebGLSupport();

    if (reduced) {
      applyFallback("reduced-motion");
      return;
    }

    if (!webglAvailable) {
      applyFallback("webgl-unavailable");
    }
  }, [applyFallback]);

  const setMode = useCallback(
    (nextMode: PortalMode, meta?: { source?: "toggle" | "fallback"; reason?: PortalFallbackReason }) => {
      setModeState(nextMode);
      setOverlayReady(nextMode === "portal" ? false : overlayReady);
      setOverlayLoading(nextMode === "portal");
      setFallbackReason(meta?.reason);
      void storePortalPreference({ mode: nextMode, act, language, fallbackReason: meta?.reason });

      const eventName = nextMode === "portal" ? "portal_open" : "portal_toggle";
      trackPortalEvent(eventName, {
        act,
        language,
        mode: nextMode,
        source: meta?.source ?? "toggle",
        fallbackReason: meta?.reason
      });
    },
    [act, language, overlayReady]
  );

  const togglePortal = useCallback(() => {
    setMode(mode === "portal" ? "lite" : "portal", { source: "toggle" });
  }, [mode, setMode]);

  const markOverlayLoading = useCallback(() => {
    setOverlayLoading(true);
    setOverlayReady(false);
  }, []);

  const markOverlayReady = useCallback(() => {
    setOverlayLoading(false);
    setOverlayReady(true);
  }, []);

  const value = useMemo<PortalContextValue>(
    () => ({
      mode,
      overlayReady,
      isOverlayLoading,
      fallbackReason,
      togglePortal,
      setMode,
      markOverlayLoading,
      markOverlayReady,
      metadata: { act, language }
    }),
    [
      act,
      fallbackReason,
      isOverlayLoading,
      language,
      markOverlayLoading,
      markOverlayReady,
      mode,
      overlayReady,
      setMode,
      togglePortal
    ]
  );

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortalContext() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortalContext debe usarse dentro de PortalProvider");
  }
  return context;
}

