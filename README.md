# BowlSmart Marketing Site

Multi-page marketing website for BowlSmart — the smart bowling app for high school teams.

**Tech:** Astro + Tailwind + MDX + Cloudflare Pages + Adapter

## Local development

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages

1. Connect this repo to Cloudflare Pages.
2. Build command: `npm run build`
3. Output directory: `dist`
4. The `@astrojs/cloudflare` adapter + wrangler.jsonc are already configured.

## Worker automation (optional)

You can add a Cloudflare Worker (e.g., `worker/index.js`) that:
- Handles waitlist submissions (POST /api/waitlist)
- Refreshes dynamic content (latest ball recommendations, testimonials)
- Uses KV or D1 for storage

Example route can be added later via `functions/` or a separate Worker.

## Branding

Navy (#0A192F), Neon Green (#39FF14), Neon Orange (#FF6B35) — matching the Flutter app exactly.

Content pulled from BOWLSMART_PROJECT_PLAN.md and README.

## Next

- Replace placeholder store links with real App Store / Play links when published.
- Add real screenshots from the app.
- Expand MDX blog with more guides.

Built separately from the main Flutter repo so it can be updated independently via Worker or GitHub Actions.# bowlsmart-marketing
