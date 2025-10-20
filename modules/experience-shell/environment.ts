export function detectWebGLSupport(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    // SSR: asumir soporte hasta comprobar en el cliente
    return true;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl") ??
      (canvas.getContext as unknown as (name: string) => WebGLRenderingContext | null)("webgl2");

    return Boolean(gl);
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
