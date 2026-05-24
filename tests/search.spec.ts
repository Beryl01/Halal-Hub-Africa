import { test, expect } from '@playwright/test'

test.describe('Search', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  // happy path - searching a real keyword should redirect to the listings page
  // and the URL should reflect the search term
  test('searching for "halal" redirects to the listings results page', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('halal')
    await searchInput.press('Enter')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/mkd-ls-main-search-keyword=halal/)
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  // edge case - pressing Enter with nothing in the box shouldn't throw an error
  // or leave the user on a broken page
  test('pressing Enter with nothing typed does not break the page', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('')
    await searchInput.press('Enter')
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  // security - an XSS payload in the search box should be safely encoded,
  // not executed. Also checks the page doesn't crash from unexpected input.
  test('searching with an XSS payload does not execute and page stays intact', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('<script>alert("xss")</script>')
    await searchInput.press('Enter')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page).not.toHaveTitle('xss')
  })

})
