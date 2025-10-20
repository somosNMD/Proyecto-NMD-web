export type PortalMode = "portal" | "lite";

export type PortalFallbackReason = "reduced-motion" | "webgl-unavailable";

export interface PortalPreference {
  mode: PortalMode;
  act: string;
  language: string;
  fallbackReason?: PortalFallbackReason;
}

export interface PortalEventPayload extends PortalPreference {
  source: "toggle" | "fallback";
}
