import type { PortalFallbackReason, PortalMode } from "@/modules/shared/portal/types";

export type PortalEventName = "portal_open" | "portal_toggle";

export interface PortalAnalyticsPayload {
  act: string;
  language: string;
  mode: PortalMode;
  source: "toggle" | "fallback";
  fallbackReason?: PortalFallbackReason;
}

export interface AnalyticsEventRecord {
  name: PortalEventName;
  payload: PortalAnalyticsPayload;
  timestamp: number;
}

type Listener = (event: AnalyticsEventRecord) => void;

const listeners = new Set<Listener>();

export function trackPortalEvent(name: PortalEventName, payload: PortalAnalyticsPayload) {
  const record: AnalyticsEventRecord = {
    name,
    payload,
    timestamp: Date.now()
  };

  if (typeof window !== "undefined") {
    const dataLayer = (window as typeof window & { dataLayer?: unknown[] }).dataLayer ?? [];
    dataLayer.push({
      event: name,
      ...payload,
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

export function onAnalyticsEvent(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetAnalyticsListeners() {
  listeners.clear();
}
