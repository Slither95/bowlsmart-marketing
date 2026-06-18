# BowlSmart Marketing Site

Multi-page marketing website for BowlSmart — the smart bowling app for high school teams.

**Tech:** Astro + Tailwind + MDX + Cloudflare Pages + Adapter

## Local development

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Workers

This site uses the Astro Cloudflare adapter with a Worker (not static-only). After `npm run build`, deploy with:

```bash
npm run deploy
```

Or in Cloudflare **Workers Builds**, set:
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`

The Worker must include the `main` entrypoint from `wrangler.jsonc`. If Cloudflare says the project "only has static assets", the Worker script was not deployed — redeploy with the command above.

### Secrets (waitlist email)

After the Worker is deployed, add secrets under **Workers & Pages → bowlsmart-marketing → Settings → Variables and Secrets** (or via CLI):

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put WAITLIST_NOTIFY_EMAIL
```

## Worker automation

The waitlist form on `/get-started` posts to `POST /api/waitlist` and stores submissions in a Cloudflare KV namespace (`WAITLIST` binding).

On first deploy, Cloudflare will auto-provision the KV namespace from `wrangler.jsonc`. To test bindings locally, use:

```bash
npm run build
npx wrangler dev
```

Entries are stored as `entry:{email}` with name, email, role, and timestamp.

### Email notifications

Each signup also emails you via [Resend](https://resend.com). Set these secrets on your Worker:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put WAITLIST_NOTIFY_EMAIL
```

Optional: `WAITLIST_FROM_EMAIL` (defaults to `BowlSmart <onboarding@resend.dev>` for Resend testing). For production, verify your domain in Resend and use an address on that domain.

For local testing, copy `.dev.vars.example` to `.dev.vars` and fill in your values.

## Branding

Navy (#0A192F), Neon Green (#39FF14), Neon Orange (#FF6B35) — matching the Flutter app exactly.

Content pulled from BOWLSMART_PROJECT_PLAN.md and README.

## Next

- Replace placeholder store links with real App Store / Play links when published.
- Add real screenshots from the app.
- Expand MDX blog with more guides.

Built separately from the main Flutter repo so it can be updated independently via Worker or GitHub Actions.# bowlsmart-marketing
