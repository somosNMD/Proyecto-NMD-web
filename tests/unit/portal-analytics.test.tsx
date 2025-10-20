import React from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/modules/experience-shell/environment", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/modules/experience-shell/environment")>();
  return {
    ...actual,
    prefersReducedMotion: () => false,
    detectWebGLSupport: () => true
  };
});

vi.mock("@/modules/shared/preferences/client", () => ({
  getStoredPortalPreference: () => null,
  storePortalPreference: vi.fn().mockResolvedValue(undefined)
}));

import { PortalProvider } from "@/modules/experience-shell/PortalContext";
import PortalToggle from "@/modules/experience-shell/PortalToggle";
import { onAnalyticsEvent, resetAnalyticsListeners } from "@/modules/shared/analytics";

beforeEach(() => {
  resetAnalyticsListeners();
});

describe("Portal analytics", () => {
  it("emite eventos portal_open y portal_toggle con metadata", async () => {
    const user = userEvent.setup();
    const events: Array<{ name: string }> = [];
    onAnalyticsEvent((event) => events.push({ name: event.name }));

    render(
      <PortalProvider act="acto-1" language="es">
        <PortalToggle heroId="analytics" />
      </PortalProvider>
    );

    const toggle = screen.getByRole("switch");

    await user.click(toggle);
    await user.click(toggle);

    expect(events.map((event) => event.name)).toEqual(["portal_open", "portal_toggle"]);
  });
});
