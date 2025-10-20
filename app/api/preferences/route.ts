import { NextResponse } from "next/server";
import { persistPreference, serializePreferenceResponse } from "@/modules/shared/preferences/server";
import {
  normalizePreferenceRequest,
  portalPreferenceRequestSchema
} from "@/modules/shared/preferences/types";

export async function PUT(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const result = portalPreferenceRequestSchema.safeParse(rawBody);

  if (!result.success) {
    return NextResponse.json({ error: "Solicitud inválida", details: result.error.flatten() }, { status: 400 });
  }

  const preference = normalizePreferenceRequest(result.data);
  const stored = await persistPreference(preference);
  const headers = serializePreferenceResponse(stored);

  return new NextResponse(null, {
    status: 204,
    headers
  });
}
