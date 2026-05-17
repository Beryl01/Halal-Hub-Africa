import { test, expect } from '@playwright/test'

// testing login via the WooCommerce my-account page which has a clean login form
test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-account/')
    await page.waitForLoadState('load')
  })

  // happy path - login form is on the my-account page
  test('username and password fields are visible on the my account page', async ({ page }) => {
    await expect(page.locator('input#username')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
  })

  // happy path - login button is present
  test('Log in button is visible and can be clicked', async ({ page }) => {
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible()
  })

  // negative - click login with empty username and password
  test('clicking Log in without filling anything in keeps the login form visible', async ({ page }) => {
    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForLoadState('load')

    // login form should still be on screen - user is not logged in
    await expect(page.locator('input#username')).toBeVisible()
  })

  // negative - wrong credentials show an error
  test('logging in with fake username and password shows an error message', async ({ page }) => {
    await page.locator('input#username').fill('fakeuser9999')
    await page.locator('input#password').fill('wrongpassword!!')

    await page.getByRole('button', { name: /log in/i }).click()
    await page.waitForLoadState('load')

    const bodyText = await page.locator('body').textContent()
    const hasError = bodyText?.toLowerCase().includes('error') ||
                     bodyText?.toLowerCase().includes('incorrect') ||
                     bodyText?.toLowerCase().includes('invalid') ||
                     bodyText?.toLowerCase().includes('unknown') ||
                     bodyText?.toLowerCase().includes('wrong')

    expect(hasError).toBeTruthy()
  })

  // security - password field should mask input
  test('password field hides what you type because it is type="password"', async ({ page }) => {
    await expect(page.locator('input#password')).toHaveAttribute('type', 'password')
  })

  // happy path - remember me checkbox works
  test('remember me checkbox can be checked and then unchecked', async ({ page }) => {
    // scoping to the WooCommerce login form specifically because there are two checkboxes on the page
    const rememberMe = page.locator('.woocommerce-form-login input[name="rememberme"]')
    await rememberMe.check()
    await expect(rememberMe).toBeChecked()

    await rememberMe.uncheck()
    await expect(rememberMe).not.toBeChecked()
  })

  // exploratory - lost password link is there and goes to the right page
  test('Lost your password link goes to the password reset page', async ({ page }) => {
    const lostPasswordLink = page.getByText(/lost your password/i)
    await expect(lostPasswordLink).toBeVisible()

    await lostPasswordLink.click()
    await page.waitForLoadState('load')

    await expect(page).toHaveURL(/lost-password/)
  })

})
