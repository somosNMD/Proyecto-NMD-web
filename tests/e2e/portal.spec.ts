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
});
