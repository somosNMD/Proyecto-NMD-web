import crypto from "node:crypto";
import { portalPreferenceSchema, type PortalPreferenceInput } from "@/modules/shared/preferences/types";
import type { StoredPortalPreference } from "@/modules/shared/preferences/types";

const COOKIE_NAME = "md_preferences";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

function resolveSecret() {
  return process.env.PREFERENCES_SECRET ?? "local-dev-secret";
}

function signPreference(preference: StoredPortalPreference) {
  const fallbackSegment = preference.fallbackReason ?? "";
  const timestamp = preference.storedAt ?? 0;
  const toSign = `${preference.mode}|${preference.act}|${preference.language}|${fallbackSegment}|${timestamp}`;
  return crypto.createHmac("sha256", resolveSecret()).update(toSign).digest("hex");
}

export function buildPreferenceCookie(preference: StoredPortalPreference) {
  const signature = signPreference(preference);
  const payload = {
    ...preference,
    signature
  };

  const value = encodeURIComponent(JSON.stringify(payload));
  return `${COOKIE_NAME}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export async function persistPreference(input: PortalPreferenceInput): Promise<StoredPortalPreference> {
  const validated = portalPreferenceSchema.parse(input);
  const stored: StoredPortalPreference = {
    ...validated,
    storedAt: Date.now()
  };

  // Placeholder: integrar Supabase cuando este disponible.
  return stored;
}

export function verifyPreferenceSignature(raw: string): boolean {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as StoredPortalPreference & { signature?: string };
    if (!parsed.signature) {
      return false;
    }
    const signature = parsed.signature;
    delete (parsed as Partial<typeof parsed>).signature;
    const expected = signPreference(parsed);
    return expected === signature;
  } catch {
    return false;
  }
}

export function serializePreferenceResponse(preference: StoredPortalPreference) {
  const headers = new Headers();
  headers.append("Set-Cookie", buildPreferenceCookie(preference));
  return headers;
}
