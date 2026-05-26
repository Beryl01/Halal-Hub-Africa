import { test, expect } from '@playwright/test'

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/my-account/')
    await page.waitForLoadState('networkidle')
  })

  // security — password characters must be masked
  test('password field masks input with type="password"', async ({ page }) => {
    await expect(page.locator('input#password')).toHaveAttribute('type', 'password')
  })

  // happy path — checkbox interaction
  test('remember me checkbox can be checked and unchecked', async ({ page }) => {
    const rememberMe = page.locator('.woocommerce-form-login input[name="rememberme"]')
    await rememberMe.check()
    await expect(rememberMe).toBeChecked()
    await rememberMe.uncheck()
    await expect(rememberMe).not.toBeChecked()
  })

  // negative — wrong credentials must produce an error
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

})
