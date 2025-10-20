import { z } from "zod";
import type { PortalFallbackReason, PortalMode } from "@/modules/shared/portal/types";

export const portalModeEnum = z.enum(["portal", "lite"]);

export const portalPreferenceRequestSchema = z.object({
  portal_mode: portalModeEnum,
  act: z.string().min(1),
  language: z.string().min(2),
  fallbackReason: z.enum(["reduced-motion", "webgl-unavailable"]).optional()
});

export type PortalPreferenceRequest = z.infer<typeof portalPreferenceRequestSchema>;

export const portalPreferenceSchema = z.object({
  mode: portalModeEnum,
  act: z.string().min(1),
  language: z.string().min(2),
  fallbackReason: z.enum(["reduced-motion", "webgl-unavailable"]).optional()
});

export type PortalPreferenceInput = z.infer<typeof portalPreferenceSchema>;

export interface StoredPortalPreference {
  mode: PortalMode;
  act: string;
  language: string;
  fallbackReason?: PortalFallbackReason;
  storedAt?: number;
}

export function normalizePreferenceRequest(request: PortalPreferenceRequest): PortalPreferenceInput {
  return {
    mode: request.portal_mode,
    act: request.act,
    language: request.language,
    fallbackReason: request.fallbackReason
  };
}
