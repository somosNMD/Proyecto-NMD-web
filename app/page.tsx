'use client';
import { PortalProvider, usePortalContext } from "@/modules/experience-shell/PortalContext";
import PortalToggle from "@/modules/experience-shell/PortalToggle";

function HeroCtas() {
  const { overlayReady, mode } = usePortalContext();
  const hideCtas = mode === "portal" && overlayReady;

  return (
    <div
      className="hero__actions"
      data-hidden={hideCtas}
      aria-hidden={hideCtas}
      data-testid="hero-ctas"
    >
      <button className="hero__cta hero__cta--primary">Ver trailer</button>
      <button className="hero__cta hero__cta--secondary">Descargar presskit</button>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero" id="hero-portal">
      <div className="hero__copy">
        <h1>Portal inmersivo de Nomades</h1>
        <p>
          Explora los actos, idiomas y variantes lite directamente desde el hero. Las acciones clave permanecen visibles
          hasta que el overlay confirme disponibilidad.
        </p>
      </div>
      <PortalToggle heroId="hero-portal" />
      <HeroCtas />
    </section>
  );
}

export default function Page() {
  return (
    <main>
      <PortalProvider act="acto-1" language="es">
        <HeroSection />
      </PortalProvider>
    </main>
  );
}
