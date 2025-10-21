import type { PortalFallbackReason, PortalMode } from "@/modules/shared/portal/types";

export type PortalEventName = "portal_open" | "portal_toggle";
export type HeroEventName = "pre_save_click";

export type AnalyticsEventName = PortalEventName | HeroEventName;

export interface PortalAnalyticsPayload {
  act: string;
  language: string;
  mode: PortalMode;
  source: "toggle" | "fallback";
  fallbackReason?: PortalFallbackReason;
}

export interface HeroAnalyticsPayload {
  act: string;
  language: string;
  portalMode: PortalMode;
  href?: string;
}

export type AnalyticsPayload = PortalAnalyticsPayload | HeroAnalyticsPayload;

export interface AnalyticsEventRecord {
  name: AnalyticsEventName;
  payload: AnalyticsPayload;
  timestamp: number;
}

type Listener = (event: AnalyticsEventRecord) => void;

const listeners = new Set<Listener>();

function publishAnalyticsEvent(name: AnalyticsEventName, payload: AnalyticsPayload) {
  const record: AnalyticsEventRecord = {
    name,
    payload,
    timestamp: Date.now()
  };

  if (typeof window !== "undefined") {
    const dataLayer = (window as typeof window & { dataLayer?: unknown[] }).dataLayer ?? [];
    const normalizedPayload =
      name === "pre_save_click"
        ? {
            ...payload,
            portal_mode: (payload as HeroAnalyticsPayload).portalMode,
            cta_href: (payload as HeroAnalyticsPayload).href
          }
        : {
            ...payload,
            portal_mode: (payload as PortalAnalyticsPayload).mode
          };
    dataLayer.push({
      event: name,
      ...normalizedPayload,
      timestamp: record.timestamp
    });
    (window as typeof window & { dataLayer?: unknown[] }).dataLayer = dataLayer;
  }

  for (const listener of listeners) {
    listener(record);
  }

  if (typeof console !== "undefined" && process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${name}`, payload);
  }
}

export function trackPortalEvent(name: PortalEventName, payload: PortalAnalyticsPayload) {
  publishAnalyticsEvent(name, payload);
}

export function trackHeroEvent(name: HeroEventName, payload: HeroAnalyticsPayload) {
  publishAnalyticsEvent(name, payload);
}

export function onAnalyticsEvent(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetAnalyticsListeners() {
  listeners.clear();
}
