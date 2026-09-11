# Google Sheets inquiry webhook

1. Open `The Seoul Valeur Website Intake` in Google Sheets.
2. Open Extensions > Apps Script and paste `Code.gs`.
3. Run `setupWorkbook` once and approve the requested spreadsheet permission.
4. In Project Settings > Script properties, add `FORM_SHARED_SECRET`.
5. Deploy as a web app that executes as the owner and allows access to anyone.
6. Store the deployment URL as `GOOGLE_APPS_SCRIPT_WEBHOOK_URL` in Cloudflare Pages.
7. Store the same secret as `FORM_SHARED_SECRET` in Cloudflare Pages.

Do not place either secret in a `NEXT_PUBLIC_*` variable.
