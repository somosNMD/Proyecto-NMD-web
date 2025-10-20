"use client";

import { useEffect, useRef } from "react";
import { usePortalContext } from "./PortalContext";

export interface PortalOverlayProps {
  onReady: () => void;
  onClose: () => void;
}

export function PortalOverlay(props?: PortalOverlayProps) {
  const { onReady = () => undefined, onClose = () => undefined } = props ?? {};
  const { metadata } = usePortalContext();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onReady();
    }, 220);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onReady]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Portal inmersivo"
      className="portal-overlay"
      data-act={metadata.act}
    >
      <div className="portal-overlay__content">
        <h2>Portal inmersivo listo</h2>
        <p>Estas entrando al acto {metadata.act}. Disfruta la experiencia narrativa completa.</p>
        <button type="button" className="portal-overlay__close" onClick={onClose}>
          Cerrar Portal
        </button>
      </div>
    </div>
  );
}

export default PortalOverlay;

