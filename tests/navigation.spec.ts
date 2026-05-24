import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // happy path - clicking Contact Us in the main nav should route to /contact-us/
  test('Contact Us nav link takes you to the contact page', async ({ page }) => {
    await page.locator('nav.mkd-main-menu').getByRole('link', { name: 'Contact Us' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/contact-us/)
  })

  // happy path - Shop should go somewhere other than the homepage root,
  // and the nav should still be present on the destination page
  test('Shop nav link takes you to a shop page', async ({ page }) => {
    await page.locator('nav.mkd-main-menu').getByRole('link', { name: 'Shop' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page).not.toHaveURL('https://halalhub.finbros.co.ke/')
    await expect(page.locator('nav.mkd-main-menu')).toBeVisible()
  })

  // negative - a completely made-up path should return a 404 message,
  // not a blank page or server error
  test('navigating to a made-up URL shows a page not found message', async ({ page }) => {
    await page.goto('/this-page-absolutely-does-not-exist-xyz999')
    await page.waitForLoadState('networkidle')
    const body = await page.locator('body').textContent()
    const shows404 = body?.includes('404') || body?.toLowerCase().includes('not found')
    expect(shows404).toBeTruthy()
  })

})
