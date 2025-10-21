import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getActs, getFallbackActs } from "@/modules/content-connector/sanity/getActs";

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalEnv };
  delete process.env.SANITY_PROJECT_ID;
  delete process.env.SANITY_DATASET;
  delete process.env.SANITY_READ_TOKEN;
});

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("getActs", () => {
  it("returns fallback acts when Sanity is not configured", async () => {
    const acts = await getActs({ language: "es" });
    expect(acts.length).toBeGreaterThanOrEqual(3);
    expect(acts[0].primaryCta.label).toBeTruthy();
    expect(acts[0].primaryCta.href).toBeTruthy();
  });

  it("exposes language specific fallback data", () => {
    const fallbackEn = getFallbackActs("en");
    const fallbackEs = getFallbackActs("es");

    expect(fallbackEn).toHaveLength(3);
    expect(fallbackEs).toHaveLength(3);
    expect(fallbackEn[0].language).toBe("en");
    expect(fallbackEs[0].language).toBe("es");
  });
});
