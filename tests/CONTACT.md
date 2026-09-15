# Contact verification

The contact page replaces the public Korean Unnie persona with clinic-visit and general inquiries. Existing links redirect to `/contact/`; the legacy page also renders the contact experience as a static-host fallback. Article links carry an article slug for inquiry attribution; inquiry answers are not sent to analytics.

## Storage compatibility

`POST /api/inquiry` accepts `formVersion: 2` with inquiry type, country, preferred language, visit-plan status, optional budget and optional article slug. The existing Sheets webhook fields remain unchanged. New context is placed in the question cell above the original message; visit status and timing are stored in travelTiming. No spreadsheet migration or Apps Script deployment is required. Requests without formVersion retain the previous contract for cached clients. Unknown versions are rejected.

## Repeatable checks

- `node --test tests/inquiry.test.mjs` checks required fields, email, consent, type/interest/visit-plan enums, optional fields, legacy compatibility, missing configuration, failed security verification and storage/network failures. Upstream services are mocked.
- Build with the configured public Turnstile site key, then run `node tests/contact-browser.cjs` with Playwright available on NODE_PATH. It serves the static export temporarily and checks 1280px, 390px and 320px layouts, both inquiry modes, invalid email, missing consent, failure/retry, success and removal of stale clinic fields from general inquiries.
- Set LIVE_URL to verify the deployed UI. The browser test always intercepts CAPTCHA and inquiry submission locally; it never sends synthetic personal data to production Sheets. Screenshots go to ignored `out/contact-checks/`.
- Check the deployed legacy URL redirect, the contact page HTTP status, and that an invalid API request is rejected. This does not prove delivery to the production spreadsheet. A real security-verified test inquiry and a receiver-side check remain the end-to-end delivery acceptance step.

No medical review, appointment confirmation, response-time guarantee or preferred-language availability is implied. Existing search indexing settings remain unchanged.
