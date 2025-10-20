import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/modules/experience-shell/environment", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/modules/experience-shell/environment")>();
  return {
    ...actual,
    prefersReducedMotion: () => true,
    detectWebGLSupport: () => true
  };
});

vi.mock("@/modules/shared/preferences/client", () => ({
  getStoredPortalPreference: () => null,
  storePortalPreference: vi.fn().mockResolvedValue(undefined)
}));

import { PortalProvider } from "@/modules/experience-shell/PortalContext";
import PortalToggle from "@/modules/experience-shell/PortalToggle";

const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
const originalFetch = global.fetch;

function renderToggle() {
  global.fetch = fetchMock as unknown as typeof fetch;
  return render(
    <PortalProvider>
      <PortalToggle heroId="test-hero" />
    </PortalProvider>
  );
}

afterEach(() => {
  global.fetch = originalFetch;
  fetchMock.mockClear();
});

describe("PortalToggle fallback", () => {
  it("deshabilita el toggle cuando la preferencia es reduced-motion", () => {
    renderToggle();
    const button = screen.getByRole("switch");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("status")).toHaveTextContent(/Portal deshabilitado/);
  });
});

