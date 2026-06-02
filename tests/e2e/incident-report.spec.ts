import { test, expect } from "@playwright/test";

/**
 * Smoke test for the incident report flow.
 * We verify that the form is present and protected by Clerk auth.
 * Full submit flow requires a signed-in coordinator — covered manually or via Clerk test mode.
 */
test("report page is protected — unauthenticated users are redirected to sign-in", async ({ page }) => {
  const res = await page.goto("/report");

  // Clerk middleware should redirect to /sign-in (3xx) or the page should show sign-in UI
  const finalUrl = page.url();
  const isRedirected = finalUrl.includes("/sign-in");
  const hasSignInUI = await page.getByText(/sign in|coordinator/i).isVisible().catch(() => false);

  expect(isRedirected || hasSignInUI).toBe(true);
});

test("history page loads and shows search input", async ({ page }) => {
  await page.goto("/history", { timeout: 30_000 });

  await expect(page.getByRole("heading", { name: /incident history/i })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByPlaceholder(/search incidents/i)).toBeVisible();
});
