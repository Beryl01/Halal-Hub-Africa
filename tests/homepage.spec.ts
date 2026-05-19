import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('logo image loads at the top of the page', async ({ page }) => {
    const logo = page.locator('header img').first()
    await expect(logo).toBeVisible()
  })

  test('main navigation shows Home, About Us and Contact Us links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'About Us' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact Us' }).first()).toBeVisible()
  })

  test('search box is visible on the homepage', async ({ page }) => {
    await expect(page.getByPlaceholder('Type in your keyword')).toBeVisible()
  })

  test('Sign In link is visible in the header', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()
  })

})
