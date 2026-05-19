import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // happy path — main nav click goes to the right page
  test('Contact Us nav link takes you to the contact page', async ({ page }) => {
    await page.locator('nav.mkd-main-menu').getByRole('link', { name: 'Contact Us' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/contact-us/)
  })

  // happy path — shop is a different page from the homepage
  test('Shop nav link takes you to a shop page', async ({ page }) => {
    await page.locator('nav.mkd-main-menu').getByRole('link', { name: 'Shop' }).click()
    await page.waitForLoadState('networkidle')
    await expect(page).not.toHaveURL('https://halalhub.finbros.co.ke/')
    await expect(page.locator('nav.mkd-main-menu')).toBeVisible()
  })

  // negative — going to a URL that does not exist should show a 404
  test('navigating to a made-up URL shows a page not found message', async ({ page }) => {
    await page.goto('/this-page-absolutely-does-not-exist-xyz999')
    await page.waitForLoadState('networkidle')
    const body = await page.locator('body').textContent()
    const shows404 = body?.includes('404') || body?.toLowerCase().includes('not found')
    expect(shows404).toBeTruthy()
  })

})
