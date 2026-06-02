import { test, expect } from "@playwright/test";

test("map page loads and renders the Leaflet container", async ({ page }) => {
  await page.goto("/map", { timeout: 20_000 });

  // The Leaflet map container must be present and visible
  await expect(page.locator(".leaflet-container")).toBeVisible({ timeout: 15_000 });

  // At least one Leaflet pane is attached to the DOM (tile-pane visibility is
  // managed by Leaflet internally and may be hidden until tiles load)
  await expect(page.locator(".leaflet-map-pane")).toBeAttached({ timeout: 10_000 });
});
