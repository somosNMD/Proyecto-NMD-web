import {
  portalPreferenceSchema,
  type PortalPreferenceInput,
  type PortalPreferenceRequest,
  type StoredPortalPreference
} from "@/modules/shared/preferences/types";
import type { PortalFallbackReason } from "@/modules/shared/portal/types";

const COOKIE_NAME = "md_preferences";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 días

function decodeCookie(): Record<string, string> {
  if (typeof document === "undefined") {
    return {};
  }

  return document.cookie.split(";").reduce<Record<string, string>>((acc, cookiePart) => {
    const [rawName, ...rest] = cookiePart.trim().split("=");
    if (!rawName) {
      return acc;
    }
    acc[decodeURIComponent(rawName)] = decodeURIComponent(rest.join("=") || "");
    return acc;
  }, {});
}

function parsePreference(raw: string | undefined): StoredPortalPreference | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredPortalPreference;
    if (parsed && (parsed.mode === "portal" || parsed.mode === "lite")) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function getStoredPortalPreference(): StoredPortalPreference | null {
  const cookies = decodeCookie();
  return parsePreference(cookies[COOKIE_NAME]);
}

function writeCookie(preference: StoredPortalPreference) {
  if (typeof document === "undefined") {
    return;
  }
  const value = encodeURIComponent(JSON.stringify(preference));
  document.cookie = `${COOKIE_NAME}=${value};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
}

function toRequestPayload(input: PortalPreferenceInput): PortalPreferenceRequest {
  return {
    portal_mode: input.mode,
    act: input.act,
    language: input.language,
    fallbackReason: input.fallbackReason
  };
}

export async function storePortalPreference(input: PortalPreferenceInput & { fallbackReason?: PortalFallbackReason }) {
  const payload = portalPreferenceSchema.parse(input);
  const snapshot: StoredPortalPreference = {
    ...payload,
    storedAt: Date.now()
  };

  if (typeof fetch === "function") {
    try {
      const response = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toRequestPayload(payload))
      });

      if (!response.ok) {
        throw new Error(`No se pudo persistir la preferencia: ${response.status}`);
      }
    } catch (error) {
      console.warn("Fallo al persistir preferencia remota", error);
    }
  }

  writeCookie(snapshot);
}
