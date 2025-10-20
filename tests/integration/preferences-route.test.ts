import { describe, expect, it } from "vitest";
import { PUT } from "@/app/api/preferences/route";
import { verifyPreferenceSignature } from "@/modules/shared/preferences/server";

const url = "http://localhost/api/preferences";

describe("/api/preferences", () => {
  it("persiste preferencias validas y firma la cookie", async () => {
    process.env.PREFERENCES_SECRET = "test-secret";
    const request = new Request(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portal_mode: "portal", act: "acto-1", language: "es" })
    });

    const response = await PUT(request);
    expect(response.status).toBe(204);
    const cookie = response.headers.get("set-cookie");
    expect(cookie).toBeTruthy();
    if (cookie) {
      const value = cookie.split("=")[1].split(";")[0];
      expect(verifyPreferenceSignature(value)).toBe(true);
    }
  });

  it("responde 400 ante payload invalido y no firma cookie", async () => {
    const request = new Request(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    const response = await PUT(request);
    expect(response.status).toBe(400);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
