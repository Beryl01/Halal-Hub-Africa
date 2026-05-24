# Halal Hub Africa — E2E Test Suite

Playwright end-to-end tests for [halalhub.finbros.co.ke](https://halalhub.finbros.co.ke) — a halal services directory covering prayer locations, halal shopping, and halal products across Africa.

---

## What's tested

| Spec file | What it covers |
|---|---|
| `homepage.spec.ts` | Logo loads, main nav links visible, search box present, Sign In link in header |
| `login.spec.ts` | Password masking, remember me toggle, empty form submission, wrong credentials error, lost password link |
| `navigation.spec.ts` | Contact Us and Shop nav links route correctly, 404 page shows for unknown URLs |
| `search.spec.ts` | Search with a real keyword lands on results page, empty search doesn't crash, XSS payload is safely handled |
| `contact.spec.ts` | Form fields accept input, valid submission doesn't crash, bad email format stays on page, long message isn't truncated |

20 tests across 5 spec files. All run against the live site on Chromium.

---

## Tech

- **Playwright** — test framework
- **TypeScript** — all tests are typed
- **Chromium only** — one browser, one worker (live site, no parallelism needed)
- Base URL: `https://halalhub.finbros.co.ke`

---

## Getting started

You need Node.js 18 or later.

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
- **60s timeout** per test — the site can be slow to load on first navigation
- **Screenshots and video** saved only on failure
- All tests call `waitForLoadState('networkidle')` before asserting — the site uses WooCommerce so several background requests fire after initial load
