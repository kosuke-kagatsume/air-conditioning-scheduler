import { test, expect } from '@playwright/test';

test.describe('メニューのUI確認', () => {
  test('モーダルメニューが正しく表示される', async ({ page }) => {
    await page.goto('/demo');
    
    // メニューボタンをクリック
    await page.click('button:has(svg)');
    
    // メニューが表示されることを確認
    await expect(page.locator('aside')).toBeVisible();
    
    // スクリーンショットを撮影
    await expect(page).toHaveScreenshot('menu-open.png');
  });

  test('メニューアイテムがクリック可能', async ({ page }) => {
    await page.goto('/demo');
    await page.click('button:has(svg)');
    
    // カレンダーメニューをクリック
    const calendarItem = page.locator('a:has-text("カレンダー")');
    await expect(calendarItem).toBeVisible();
    await expect(calendarItem).toHaveCSS('cursor', 'pointer');
  });
});