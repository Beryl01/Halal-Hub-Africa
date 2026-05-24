import { test, expect } from '@playwright/test'

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-account/')
    await page.waitForLoadState('networkidle')
  })

  // security - password characters must be masked so they're not visible in
  // the browser or in screenshots
  test('password field masks input with type="password"', async ({ page }) => {
    await expect(page.locator('input#password')).toHaveAttribute('type', 'password')
  })

  // happy path - the remember me checkbox should toggle cleanly both ways
  test('remember me checkbox can be checked and unchecked', async ({ page }) => {
    const rememberMe = page.locator('.woocommerce-form-login input[name="rememberme"]')
    await rememberMe.check()
    await expect(rememberMe).toBeChecked()
    await rememberMe.uncheck()
    await expect(rememberMe).not.toBeChecked()
  })

  // negative - submitting empty credentials should keep the form visible;
  // the user shouldn't be redirected anywhere
  test('clicking Log in with empty fields keeps the login form on screen', async ({ page }) => {
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('input#username')).toBeVisible()
  })

  // negative - wrong credentials must produce a visible error message.
  // Checking for any of the common WooCommerce error strings covers variations
  // across different plugin versions.
  test('wrong username and password shows a login error message', async ({ page }) => {
    await page.locator('input#username').fill('notarealuser9999')
    await page.locator('input#password').fill('wrongpassword!!')
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForLoadState('networkidle')

    const body = await page.locator('body').textContent()
    const hasError = body?.toLowerCase().includes('error') ||
                     body?.toLowerCase().includes('incorrect') ||
                     body?.toLowerCase().includes('invalid') ||
                     body?.toLowerCase().includes('unknown')
    expect(hasError).toBeTruthy()
  })

  // click-through - the lost password link should route to the reset page
  test('Lost your password link navigates to the password reset page', async ({ page }) => {
    await page.getByText(/lost your password/i).click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/lost-password/)
  })

})
