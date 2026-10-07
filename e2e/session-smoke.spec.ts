import { expect, test } from "@playwright/test";

/**
 * MVP S0~S6 smoke: 홈 → 세션 → 끊김 1회 + 태그 → 요약
 */
test("session start → breakpoint + tag → summary", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "오늘 세션 시작 (듣기)" }).click();

  await expect(page.getByRole("region", { name: "진단 패널" })).toBeVisible({
    timeout: 20_000,
  });

  const transcriptSection = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "전사 (transcript)" }) });

  await transcriptSection.getByRole("button").first().click();

  await page.getByRole("button", { name: "단어", exact: true }).click();
  await page.getByRole("button", { name: "끊김 저장" }).click();

  await expect(page.getByText("이번 세션에 저장된 끊김 (1)")).toBeVisible();

  await page.getByRole("link", { name: "세션 마무리 — 요약 보기" }).click();

  await expect(
    page.getByRole("heading", { name: "오늘 세션 마무리" }),
  ).toBeVisible({ timeout: 15_000 });

  await expect(page.getByText("끊김 지점 1곳")).toBeVisible();

  const tagStats = page.getByLabel("원인 태그 집계");
  await expect(tagStats.locator("text=단어").locator("..")).toContainText("1");
});
