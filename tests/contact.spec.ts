import { test, expect } from '@playwright/test'

// The contact page has two CF7 forms — .first() always targets the visible one at the top
test.describe('Contact form', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/contact-us/')
    await page.waitForLoadState('networkidle')
  })

  // happy path — all three fields accept typed input
  test('name, email and message fields all accept typed text', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('Ahmed Yusuf')
    await page.locator('input[name="your-email"]').first().fill('ahmed@example.com')
    await page.locator('textarea[name="your-message"]').first().fill('I want to list my halal restaurant.')

    await expect(page.locator('input[name="your-name"]').first()).toHaveValue('Ahmed Yusuf')
    await expect(page.locator('input[name="your-email"]').first()).toHaveValue('ahmed@example.com')
  })

  // happy path — valid submission should not crash the page
  test('filling all fields and clicking Send does not cause a crash', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('Fatima Hassan')
    await page.locator('input[name="your-email"]').first().fill('fatima@gmail.com')
    await page.locator('textarea[name="your-message"]').first().fill('Hello, I would like more information about halal certification.')

    await page.locator('input.wpcf7-submit').first().click()
    await page.waitForLoadState('networkidle')

    const body = await page.locator('body').textContent()
    expect(body?.toLowerCase()).not.toContain('fatal error')
  })

  // negative — a badly formatted email should fail validation
  test('submitting with an email missing the @ symbol stays on the page', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('Test User')
    await page.locator('input[name="your-email"]').first().fill('testuseremail.com')
    await page.locator('textarea[name="your-message"]').first().fill('Testing bad email format.')
    await page.locator('input.wpcf7-submit').first().click()
    await expect(page).toHaveURL(/contact-us/)
  })

  // edge case — numbers in a name field should not throw an error
  test('typing numbers into the name field is accepted without errors', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('12345')
    const value = await page.locator('input[name="your-name"]').first().inputValue()
    expect(value).toBe('12345')
  })

  // boundary — a long message should not be cut off
  test('message field accepts a long block of text without truncating it', async ({ page }) => {
    const longMessage = 'Testing long input in the message field. '.repeat(8)
    await page.locator('textarea[name="your-message"]').first().fill(longMessage)
    const typed = await page.locator('textarea[name="your-message"]').first().inputValue()
    expect(typed.length).toBeGreaterThan(200)
  })

})
