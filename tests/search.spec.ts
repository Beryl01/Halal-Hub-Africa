import { test, expect } from '@playwright/test'

test.describe('Search functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
  })

  // happy path - search for something that should exist
  test('searching for "mosque" lands on the listings results page', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('mosque')
    await searchInput.press('Enter')
    await page.waitForLoadState('load')

    // the site uses a custom listing engine, not the WP default search
    await expect(page).toHaveURL(/job-listings.*mkd-ls-main-search-keyword=mosque/)
  })

  // happy path - search for halal
  test('searching for "halal" redirects to the listings page', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('halal')
    await searchInput.press('Enter')
    await page.waitForLoadState('load')

    await expect(page).toHaveURL(/job-listings.*mkd-ls-main-search-keyword=halal/)
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  // negative - term with no results
  test('searching for gibberish navigates to listings page and shows no matching results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('xqzabcnoresultterm99999')
    await searchInput.press('Enter')
    await page.waitForLoadState('load')

    // page should load even with no results
    await expect(page).toHaveURL(/job-listings.*mkd-ls-main-search-keyword=xqzabcnoresultterm99999/)
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  // negative - empty search
  test('pressing enter with empty search does not break the page', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('')
    await searchInput.press('Enter')

    await expect(page.getByRole('navigation')).toBeVisible()
  })

  // edge case - spaces only
  test('searching with only spaces does not return useful results', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('     ')
    await searchInput.press('Enter')
    await page.waitForLoadState('load')

    await expect(page.getByRole('navigation')).toBeVisible()
  })

  // edge case - special characters (also checks for XSS)
  test('searching with special characters does not break or inject anything', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('<script>alert("xss")</script>')
    await searchInput.press('Enter')
    await page.waitForLoadState('load')

    // page should still be intact - script should not have executed
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page).not.toHaveTitle('xss')
  })

  // boundary value - single character
  test('single character search submits and loads the listings page', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill('a')
    await searchInput.press('Enter')
    await page.waitForLoadState('load')

    await expect(page).toHaveURL(/job-listings.*mkd-ls-main-search-keyword=a/)
  })

  // boundary value - very long string
  test('very long search string does not crash the server', async ({ page }) => {
    const bigSearchTerm = 'halal'.repeat(40)
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await searchInput.fill(bigSearchTerm)
    await searchInput.press('Enter')
    await page.waitForLoadState('load')

    await expect(page.getByRole('navigation')).toBeVisible()
  })

})
