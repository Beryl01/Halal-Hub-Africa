import { test, expect } from '@playwright/test'

// the contact page has two CF7 forms with identical field names
// we use .first() to always target the visible one at the top of the page
test.describe('Contact form', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/contact-us/')
    await page.waitForLoadState('load')
  })

  // happy path - form fields are on the page
  test('contact form fields are visible on the page', async ({ page }) => {
    await expect(page.locator('input[name="your-name"]').first()).toBeVisible()
    await expect(page.locator('input[name="your-email"]').first()).toBeVisible()
    await expect(page.locator('textarea[name="your-message"]').first()).toBeVisible()
  })

  // happy path - can type into each field
  test('you can type into the name, email and message fields', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('Ahmed Yusuf')
    await page.locator('input[name="your-email"]').first().fill('ahmed.yusuf@email.com')
    await page.locator('textarea[name="your-message"]').first().fill('I want to list my halal restaurant on your platform.')

    await expect(page.locator('input[name="your-name"]').first()).toHaveValue('Ahmed Yusuf')
    await expect(page.locator('input[name="your-email"]').first()).toHaveValue('ahmed.yusuf@email.com')
  })

  // happy path - valid form submission does not crash
  test('filling in all fields correctly and clicking send does not crash the page', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('Fatima Hassan')
    await page.locator('input[name="your-email"]').first().fill('fatima.hassan@gmail.com')
    await page.locator('textarea[name="your-message"]').first().fill('Hello, I would like more information about halal certification. Thank you.')

    await page.locator('input.wpcf7-submit').first().click()
    await page.waitForLoadState('load')

    const bodyText = await page.locator('body').textContent()
    expect(bodyText).not.toBeNull()
    expect(bodyText?.toLowerCase()).not.toContain('fatal error')
  })

  // negative - submit without email
  test('submitting the form without an email address stays on the contact page', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('Test User')
    await page.locator('textarea[name="your-message"]').first().fill('Testing with no email field filled.')

    await page.locator('input.wpcf7-submit').first().click()

    await expect(page).toHaveURL(/contact-us/)
  })

  // negative - invalid email format
  test('submitting with "notanemail" as the email stays on the contact page', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('Test User')
    await page.locator('input[name="your-email"]').first().fill('notanemail')
    await page.locator('textarea[name="your-message"]').first().fill('Testing with a bad email format.')

    await page.locator('input.wpcf7-submit').first().click()

    await expect(page).toHaveURL(/contact-us/)
  })

  // negative - email with no @ symbol
  test('email address without the @ symbol does not pass validation', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('Test User')
    await page.locator('input[name="your-email"]').first().fill('testuseremail.com')
    await page.locator('textarea[name="your-message"]').first().fill('No at sign in email.')

    await page.locator('input.wpcf7-submit').first().click()

    await expect(page).toHaveURL(/contact-us/)
  })

  // edge case - name field accepts numbers as input
  test('typing numbers into the name field does not throw an error', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('12345')
    const value = await page.locator('input[name="your-name"]').first().inputValue()
    expect(value).toBe('12345')
  })

  // boundary value - long message text
  test('message field accepts a long message without cutting it off', async ({ page }) => {
    const longMsg = 'This is a test message to check how the platform handles longer text inputs. '.repeat(7)
    await page.locator('textarea[name="your-message"]').first().fill(longMsg)

    const typed = await page.locator('textarea[name="your-message"]').first().inputValue()
    expect(typed.length).toBeGreaterThan(100)
  })

  // edge case - name and message with only spaces
  test('submitting only spaces in name and message stays on contact page', async ({ page }) => {
    await page.locator('input[name="your-name"]').first().fill('   ')
    await page.locator('input[name="your-email"]').first().fill('test@example.com')
    await page.locator('textarea[name="your-message"]').first().fill('   ')

    await page.locator('input.wpcf7-submit').first().click()
    await page.waitForLoadState('load')

    await expect(page.getByRole('navigation')).toBeVisible()
  })

})
