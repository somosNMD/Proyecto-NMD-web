import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

import { PortalProvider, usePortalContext } from "@/modules/experience-shell/PortalContext";

function ContextHarness() {
  const { mode, overlayReady, togglePortal, markOverlayReady } = usePortalContext();
  const hideCtas = mode === "portal" && overlayReady;

  return (
    <div>
      <button type="button" onClick={togglePortal}>
        toggle
      </button>
      <button type="button" onClick={markOverlayReady}>
        ready
      </button>
      <div data-testid="cta" data-hidden={hideCtas} aria-hidden={hideCtas}>
        CTA critica
      </div>
    </div>
  );
}

describe("Portal context behaviour", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mantiene CTA visibles hasta confirmar overlay y los oculta despues", async () => {
    render(
      <PortalProvider>
        <ContextHarness />
      </PortalProvider>
    );

    const toggle = screen.getByRole("button", { name: /toggle/i });
    const ready = screen.getByRole("button", { name: /ready/i });
    const cta = screen.getByTestId("cta");

    expect(cta.dataset.hidden).not.toBe("true");

    await user.click(toggle);
    expect(cta.dataset.hidden).not.toBe("true");

    await user.click(ready);
    expect(cta.dataset.hidden).toBe("true");

    await user.click(toggle);
    expect(cta.dataset.hidden).not.toBe("true");
  });
});
