import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('load')
  })

  test('page title contains Halal Hub', async ({ page }) => {
    await expect(page).toHaveTitle(/Halal Hub/i)
  })

  test('logo image is visible at the top of the page', async ({ page }) => {
    // logo is an image inside the header, not a text link
    const logo = page.locator('header img').first()
    await expect(logo).toBeVisible()
  })

  test('main nav links are visible - Home, About Us, Contact Us', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Home' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'About Us' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Contact Us' }).first()).toBeVisible()
  })

  test('category cards show up on the homepage', async ({ page }) => {
    // using first() because the text appears in more than one place on the page
    await expect(page.getByText('Fast Food Outlets').first()).toBeVisible()
    await expect(page.getByText('Hotels & Lodges').first()).toBeVisible()
    await expect(page.getByText('Fashion').first()).toBeVisible()
  })

  test('search box is present on the homepage', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Type in your keyword')
    await expect(searchInput).toBeVisible()
  })

  test('Sign In link is visible in the header', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible()
  })

  test('Show More links appear under the category sections', async ({ page }) => {
    const showMore = page.getByText('Show More +')
    await expect(showMore.first()).toBeVisible()
  })

  test('footer loads and shows company name', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.getByText(/Halal Hub Africa/i).last()).toBeVisible()
  })

})
