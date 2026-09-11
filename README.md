# The Seoul Valeur

English K-beauty and Seoul travel magazine for global beauty seekers.

## Local Development

```bash
pnpm install
pnpm dev
```

## Deployment

Deploy the static export to Cloudflare Pages from the private GitHub repository.

- Build command: `pnpm build`
- Output directory: `out`
- Production branch: `main`

Suggested domains:

- theseoulvaleur.com
- seoulvaleur.com
- the-seoul-valeur.com

Public beta deployments default to `noindex`. Set `NEXT_PUBLIC_SITE_URL` to the
confirmed production domain and `NEXT_PUBLIC_ENABLE_INDEXING=true` only after
the domain, inquiry route, and editorial approval flow are ready.

## Analytics

Cloudflare Web Analytics provides the privacy-first traffic baseline. GA4 loads only
after optional analytics consent and must never receive names, contact details, form
answers, or free-text inquiry content. Google Search Console measures organic search.

## Inquiry Operations

The public form posts to a Cloudflare Pages Function, which validates Turnstile and
forwards the accepted inquiry to the Google Apps Script webhook. See
`integrations/google-apps-script/README.md` for setup.

## Editorial Workflow

Notion remains the internal planning and approval database. Only approved articles and CTA copy should be published to this public site.
