# Halal Hub Africa — E2E Test Suite

Playwright end-to-end tests for [halalhub.finbros.co.ke](https://halalhub.finbros.co.ke) — a halal services directory covering prayer locations, halal shopping, and halal products across Africa.

---

## Tech

- **Playwright** — test framework
- **TypeScript** — all tests are typed
- **Chromium only** — one browser, one worker (live site, no parallel testing needed)
- Base URL: `https://halalhub.finbros.co.ke`

---

## Getting started

You need Node.js 18 or above.

```bash
npm install
npx playwright install chromium
```

---

## Running the tests

Run the full suite:

```bash
npx playwright test
```

Run a single spec file:

```bash
npx playwright test tests/login.spec.ts
```

Run in headed mode (watch the browser):

```bash
npx playwright test --headed
```

Show the HTML report after a run:

```bash
npx playwright show-report
```

---

## Config notes

- **1 retry** — enough to handle the occasional network blip on the live site
- **60s timeout** per test — this is because the site can be slow to load on first navigation
- All tests call `waitForLoadState('networkidle')` before asserting — the site uses WooCommerce, so several background requests fire after initial load
