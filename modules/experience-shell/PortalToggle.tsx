"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePortalContext } from "./PortalContext";

const PortalOverlay = dynamic(() => import("./PortalOverlay"), {
  loading: () => (
    <span role="status" className="portal-overlay__loading">
      Cargando Portal...
    </span>
  ),
  ssr: false
});

function getFallbackCopy(reason: string | undefined) {
  if (reason === "reduced-motion") {
    return "Modo Portal deshabilitado por preferencia de animaciones reducidas.";
  }
  if (reason === "webgl-unavailable") {
    return "Tu dispositivo no soporta WebGL: mantendremos la variante ligera.";
  }
  return null;
}

export interface PortalToggleProps {
  heroId?: string;
}

export function PortalToggle({ heroId = "hero-portal" }: PortalToggleProps) {
  const { mode, togglePortal, markOverlayLoading, markOverlayReady, fallbackReason, metadata, setMode } =
    usePortalContext();
  const [liveMessage, setLiveMessage] = useState("Modo Portal listo para activarse.");
  const [overlayMounted, setOverlayMounted] = useState(mode === "portal");

  useEffect(() => {
    if (mode === "portal") {
      setOverlayMounted(true);
      markOverlayLoading();
      setLiveMessage("Activando modo Portal. CTA siguen disponibles hasta completar la carga.");
    } else {
      setLiveMessage("Portal desactivado. Hero en variante ligera.");
    }
  }, [markOverlayLoading, mode]);

  useEffect(() => {
    const fallbackCopy = getFallbackCopy(fallbackReason);
    if (fallbackCopy) {
      setLiveMessage(fallbackCopy);
    }
  }, [fallbackReason]);

  const handleToggle = useCallback(() => {
    if (fallbackReason) {
      return;
    }
    togglePortal();
  }, [fallbackReason, togglePortal]);

  const handleClose = useCallback(() => {
    setMode("lite", { source: "toggle" });
  }, [setMode]);

  const statusLabel = useMemo(() => (mode === "portal" ? "Portal activo" : "Portal desactivado"), [mode]);
  const fallbackCopy = useMemo(() => getFallbackCopy(fallbackReason), [fallbackReason]);

  return (
    <div className="portal-toggle" data-mode={mode}>
      <button
        type="button"
        role="switch"
        aria-checked={mode === "portal"}
        aria-describedby={`${heroId}-portal-status`}
        aria-controls={`${heroId}-overlay`}
        aria-disabled={Boolean(fallbackReason)}
        onClick={handleToggle}
        className="portal-toggle__button"
      >
        {mode === "portal" ? "Cerrar Portal" : "Activar Portal"}
      </button>
      <p id={`${heroId}-portal-status`} className="portal-toggle__status" aria-live="polite">
        {statusLabel}. Idioma: {metadata.language}.
      </p>
      <span className="sr-only" aria-live="assertive">
        {liveMessage}
      </span>

      {fallbackCopy && (
        <p role="status" className="portal-toggle__fallback">
          {fallbackCopy}
        </p>
      )}

      {overlayMounted && mode === "portal" && (
        <div id={`${heroId}-overlay`} data-testid="portal-overlay-container">
          <PortalOverlay
            onReady={() => {
              markOverlayReady();
              setLiveMessage("Portal cargado. Overlay disponible, CTA ocultos.");
            }}
            onClose={handleClose}
          />
        </div>
      )}
    </div>
  );
}

export default PortalToggle;
