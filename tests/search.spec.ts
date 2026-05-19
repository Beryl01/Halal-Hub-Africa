import { test, expect } from '@playwright/test'

test.describe('Search', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // happy path — a real search term should land on the listings page
  test('searching for "halal" redirects to the listings results page', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('halal')
    await searchInput.press('Enter')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/mkd-ls-main-search-keyword=halal/)
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  // edge case — pressing Enter on an empty search should not break the page
  test('pressing Enter with nothing typed does not break the page', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('')
    await searchInput.press('Enter')
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  // security — injecting a script tag should not execute or crash the page
  test('searching with an XSS payload does not execute and page stays intact', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('<script>alert("xss")</script>')
    await searchInput.press('Enter')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page).not.toHaveTitle('xss')
  })

})
