import { expect, test } from "@playwright/test";

test.describe("Experiencia Portal", () => {
  test("CTA permanecen visibles hasta que overlay confirma disponibilidad", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("switch");
    const ctas = page.getByTestId("hero-ctas");

    await expect(ctas).not.toHaveAttribute("data-hidden", "true");

    await toggle.click();

    await expect(ctas).not.toHaveAttribute("data-hidden", "true");

    const overlay = page.locator(".portal-overlay");
    await overlay.waitFor({ state: "visible" });

    await expect(ctas).toHaveAttribute("data-hidden", "true");

    await page.getByRole("button", { name: "Cerrar Portal" }).click();

    await expect(ctas).not.toHaveAttribute("data-hidden", "true");
  });

  test("El cambio de idioma se refleja y persiste tras recargar", async ({ page }) => {
    await page.goto("/");

    const englishToggle = page.getByRole("radio", { name: "EN" });
    await englishToggle.click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Act I/i);

    await page.waitForTimeout(500);

    await expect
      .poll(
        () => page.evaluate(() => window.localStorage.getItem("md_language")),
        { timeout: 10000 }
      )
      .toBe("en");

    await page.reload();

    await page.waitForFunction(() => {
      const heading = document.querySelector("h1");
      return heading?.textContent?.includes("Act I");
    });
  });

  test("El CTA primario emite pre_save_click con metadata requerida", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      (window as typeof window & { dataLayer?: unknown[] }).dataLayer = [];
    });

    const primaryCta = page.getByTestId("hero-cta-primary");
    await primaryCta.evaluate((element) =>
      element.addEventListener("click", (event) => event.preventDefault(), { once: true })
    );
    await primaryCta.click();

    const dataLayer = await page.evaluate(() => (window as typeof window & { dataLayer?: unknown[] }).dataLayer);
    const lastEvent = Array.isArray(dataLayer) ? (dataLayer[dataLayer.length - 1] as Record<string, unknown>) : null;

    expect(lastEvent?.event).toBe("pre_save_click");
    expect(lastEvent?.portal_mode).toBe("lite");
    expect(lastEvent?.act).toBeTruthy();
    expect(lastEvent?.language).toBeTruthy();
    expect(lastEvent?.cta_href).toBeTruthy();
  });
});
