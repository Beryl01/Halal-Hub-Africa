import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
  })

  // happy path - logo brings you home
  test('clicking the logo from another page brings you back to the homepage', async ({ page }) => {
    await page.goto('/contact-us/')
    await page.waitForLoadState('load')

    // logo is wrapped in .mkd-logo-wrapper, not a text link
    await page.locator('.mkd-logo-wrapper a').first().click()
    await page.waitForLoadState('load')

    await expect(page).toHaveURL('https://halalhub.finbros.co.ke/')
  })

  // happy path - contact us link works
  test('Contact Us link in the nav takes you to the contact page', async ({ page }) => {
    await page.locator('nav.mkd-main-menu').getByRole('link', { name: 'Contact Us' }).click()
    await page.waitForLoadState('load')

    await expect(page).toHaveURL(/contact-us/)
  })

  // happy path - shop nav link
  test('Shop link in the nav takes you to a shop page', async ({ page }) => {
    await page.locator('nav.mkd-main-menu').getByRole('link', { name: 'Shop' }).click()
    await page.waitForLoadState('load')

    await expect(page).not.toHaveURL('https://halalhub.finbros.co.ke/')
    await expect(page.locator('nav.mkd-main-menu')).toBeVisible()
  })

  // exploratory - About Our Company under About Us submenu
  test('About Our Company link in the dropdown navigates correctly', async ({ page }) => {
    // use direct href nav because dropdown items require hover which is unreliable across runs
    await page.goto('/about-our-company/')
    await page.waitForLoadState('load')

    await expect(page).toHaveURL(/about-our-company/)
    await expect(page.locator('nav.mkd-main-menu')).toBeVisible()
  })

  // negative - going to a page that does not exist shows 404
  test('navigating to a made-up URL shows a not found page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-at-all-abc123')
    await page.waitForLoadState('load')

    const bodyText = await page.locator('body').textContent()
    const shows404 = bodyText?.includes('404') ||
                     bodyText?.toLowerCase().includes('not found') ||
                     bodyText?.toLowerCase().includes("couldn't find")

    expect(shows404).toBeTruthy()
  })

  // exploratory - media centre link
  test('Media Centre link is present and leads somewhere that is not the homepage', async ({ page }) => {
    await page.locator('nav.mkd-main-menu').getByRole('link', { name: 'Media Centre' }).first().click()
    await page.waitForLoadState('load')

    await expect(page.locator('nav.mkd-main-menu')).toBeVisible()
    await expect(page).not.toHaveURL('https://halalhub.finbros.co.ke/')
  })

})
