# Car Installment App

Standalone port of the 3-step car financing form (Car Info → Financing → Personal Info)
from the `contact.eg-website` repo's `feat: add car installment 3-step financing form` commit,
extended with a language switcher, full RTL support, cascading car dropdowns, phone OTP
verification, an email field, and a reCAPTCHA gate before submission.

## What's included

- `src/pages/car-installment/index.jsx` — the 3-step form
- `src/components/car-installment/InstallmentStepper.jsx` — step progress indicator
- `src/components/car-installment/BranchModal.jsx` — searchable branch picker
- `src/components/LanguageSwitcher.jsx` — AR/EN toggle (switches Next.js locale + URL)
- `src/utils/styles/car-installment-styles.js` — MUI `sx` styles
- `src/i18n/I18nProvider.js` + `locales/ar.js` / `locales/en.js` — Arabic (default) / English translations
- `src/utils/api.js` — API client (branches, car catalog, OTP, S3 upload, submit)
- `src/utils/car-data.js` — dummy brand → model → category catalog
- `src/pages/api/verify-recaptcha.js` — server-side reCAPTCHA verification route

## Language & RTL

- `LanguageSwitcher` flips `next-i18n` locale (`ar`/`en`) via the router, changing the URL
  (e.g. `/car-installment` ↔ `/en/car-installment`).
- `src/pages/_document.js` sets `<html lang dir>` from the active locale.
- `src/pages/_app.js` sets the MUI theme's `direction` and swaps in an emotion cache with
  `stylis-plugin-rtl` (`src/utils/createEmotionCache.js`) only when the locale is Arabic —
  English keeps emotion's default cache untouched.

## Car brand / model / category dropdowns

`Step3` (Car Information) now fetches brands from `/general/car-brands`, then models for the
selected brand from `/general/car-models?brandId=`, then categories for the selected model from
`/general/car-categories?modelId=`. Each selection resets and disables the dependent dropdown(s)
until its parent is chosen. The catalog itself (`src/utils/car-data.js`) is dummy data — swap
`api.js`'s mock handlers for real endpoints when a backend is available.

## Phone verification (OTP) + Email

The Personal Information step now has an Email field and a "Send Code" flow for the mobile
number: `api.post("/auth/send-otp")` generates a 4-digit code (logged to the server console
since there's no real SMS gateway) and `api.post("/auth/verify-otp")` checks it. The phone
resets to unverified if it's edited after being verified.

## reCAPTCHA

A `react-google-recaptcha` v2 checkbox sits above the submit button. It defaults to Google's
public **test keypair** (documented at
https://developers.google.com/recaptcha/docs/faq — always verifies successfully, safe for
demos). On submit, the client token is checked server-side via `/api/verify-recaptcha` (which
calls Google's real `siteverify` API) before the request-info call is made. Set
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` / `RECAPTCHA_SECRET_KEY` to your own registered keys for
production.

## What's different from the original

The original app calls its real backend through a signing HMAC proxy with
secrets that live only in that repo. This project can't replicate those
secrets, so `src/utils/api.js` instead:

- calls `NEXT_PUBLIC_API_BASE_URL` directly if you set it (copy `.env.example`
  to `.env.local`), or
- falls back to built-in mock responses for `/general/branches`,
  `/general/car-brands`, `/general/car-models`, `/general/car-categories`,
  `/auth/send-otp`, `/auth/verify-otp`, `/s3/public/generate-presigned-url`,
  and `/services/request-info`, so the form works end-to-end out of the box.

Site chrome (navbar, footer, Redux store, analytics trackers, product
fetching) from the original app was intentionally left out — this project
only ports the car-installment feature itself.

## Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` (redirects to `/car-installment`), or
`http://localhost:3000/en/car-installment` for English.
