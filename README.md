# Domands Creative website

Payload CMS 3 + Next.js 16, built from the Website Services Plan and the Phase 1–4 copy decks.
All copy is loaded into the CMS, so prices, packages, FAQs and contact details are edited in `/admin`, not in code.

## Run it

```bash
npm install
npm run seed      # loads all copy into the local SQLite database (safe to re-run)
npm run dev       # http://localhost:3000 — CMS at http://localhost:3000/admin
```

The first visit to `/admin` asks you to create the first admin user.

`npm run seed` **replaces** Services, Industries, Pages, Ad pages, Founders, Site settings and the Digital Health Check with the copy-deck versions. It never touches Leads, Users, Media, Insights or Case studies. Once you start editing in `/admin`, don't re-run it.

## What's where

| In the CMS | What it drives | URL |
| --- | --- | --- |
| **Site settings** (global) | WhatsApp number, email, office, hours, booking link, pre-filled WhatsApp messages, consent text, GA4 ID | every page |
| **Services** (12) | Full service pages: hero, packages, sections, how it works, add-ons, FAQs, pairs-with, closing form, colour theme | `/<slug>/` |
| **Industries** (5) | Industry landing pages | `/industries/<slug>/` |
| **Pages** (13, block-built) | Home, Services hub, Industries hub, Pricing, Contact, Thank you, About, Our work, Insights, Free strategy call, Launchpad, Privacy, Terms | `/<slug>/` (Home = `/`) |
| **Ad pages** (6) | Single-offer pages with no menu, noindex, plus the matching ad copy for reference | `/go/<slug>/` |
| **Digital Health Check** (global) | Quiz questions, scoring bands, free fixes and service links | `/quiz/` |
| **Founders** | Founder/author pages | `/about/<slug>/` |
| **Insights** | Articles (drafts until published) | `/insights/<slug>/` |
| **Case studies** | Our work (drafts until published) | `/work/<slug>/` |
| **Leads** | Every form: contact, service, ad page, quiz, strategy call, Launchpad, newsletter, with UTM tags | admin only |

### Every enquiry is a lead

There are no direct WhatsApp links. Every WhatsApp button (header, heroes, package "Get a quote", footer, mobile bar, ad pages) opens **Get in touch**: name, WhatsApp number and consent. The enquiry is saved in **Leads** as "WhatsApp enquiry" (with the package or page it came from) and emailed to the team, then the visitor gets a **Continue on WhatsApp** button whose message includes their name and the enquiry number, so the chat matches the lead. Once someone has sent any form in that browser session, WhatsApp buttons open WhatsApp directly. Email links (mailto) still bypass the pipeline.

### Writing in text fields

Most text fields use a light format: blank line = new paragraph, `- ` bullets, `1. ` numbered, `### ` sub-heading, `**bold**`, `[link text](/url)`. Anything else in `[square brackets]` shows on the site **highlighted yellow** as a placeholder, so unfinished proof and details are easy to spot before launch.

### Brand

The look follows the **Domands brand & website design system v2** (claude.ai/artifact/KXz5W1bS5XTZiJefVxPT9h): Instrument Sans, black and white, square corners (inputs 4px), blue focus rings, and an always-black footer with the reverse wordmark. The halftone pattern is not used on the site. Red is spent on the dot only: the logo and the full stop on hero headlines (a closing "." in a hero headline is drawn as the red dot automatically; questions get none). Logo files are in `public/brand/`; the favicon is the icon mark.

### Colour

The site uses only pure red, black and white: no greys or shadows. Secondary text is black (hierarchy comes from size and weight), dividers are black hairlines, and bands are separated by rules instead of grey backgrounds; hovers and selected states invert to white-on-black. This is stricter than the brand system, which allows neutral greys. The per-service theme colours under **Card & theme** are kept in the CMS but not shown anywhere. Focus outlines are black (white on black bands), success messages black, and [placeholders] show as white text on black. Buttons are always black or white; WhatsApp uses the black primary style with its icon.

## Built in

- Service pages follow the plan's 12-part structure, with jump links, package cards that open WhatsApp pre-filled with the package name, and a short quote form.
- JSON-LD: Organization (every page), ProfessionalService (Home, Contact), Service with an Offer per package, FAQPage and BreadcrumbList (service pages), Article and Person.
- `sitemap.xml` (ad pages, Thank you and noindex pages left out), `robots.txt` (AI crawlers allowed, `/go/` blocked), canonical URLs with trailing slashes as in the plan.
- Sticky WhatsApp bar on mobile; real 404 page with links and search.
- Pages are prerendered as static HTML and revalidated automatically when anything changes in the CMS.
- GA4 loads only once a measurement ID is set in Site settings, and sends a `generate_lead` event for WhatsApp and call clicks. **Add a cookie consent banner before turning it on** (the Privacy notice promises consent for analytics cookies).

## Before launch

1. Fill in **Site settings**: WhatsApp number (digits, e.g. `254712345678`), email, office area, hours, booking link. Until the number is set, WhatsApp buttons go to `/contact/`.
2. Search the site for yellow placeholders and replace each one (proof, post counts, notice periods, VAT, founder details, Launchpad dates…). The "Still to fill in" lists at the end of each copy deck are the checklist.
3. Have a Kenyan advocate review **Privacy** and **Terms**; confirm ODPC registration.
4. Publish industry pages only once each has a case study or client logo (per Phase 3).
5. Deploy to Vercel + Supabase (see below).
6. **Lead emails:** fill in `SMTP_HOST` and `SMTP_PASS` in `.env` (and on your host) with the SMTP details for info@domandsagency.com from your email provider, then restart the site. Every new lead is then emailed to `LEAD_EMAIL_TO` (or the Site settings email), with the lead as Reply-To, a "Reply on WhatsApp" button and a link to the lead in the CMS. Until SMTP is set, emails are only printed to the server console. A failed email never loses a lead; it stays in the CMS and the error is logged.

## Deploying (Vercel + Supabase)

The site uses Postgres (Supabase) in production and SQLite locally. The adapter switches on the `DATABASE_URL` shape — `postgres://` → Postgres, anything else → SQLite. No media storage is configured: images go through Cloudinary and videos embed from YouTube (see below).

**1. Supabase — database**

- Project Settings → Database → "Connection string" → **Transaction pooler** (port 6543). Pooler is required on Vercel's serverless runtime; the direct port (5432) will exhaust Postgres's connection limit.
- Copy the URL; it looks like `postgresql://postgres.<ref>:<pw>@aws-1-<region>.pooler.supabase.com:6543/postgres`.

**2. Vercel env vars**

Set these on the Vercel project (Production + Preview):

- `DATABASE_URL` — the pooler URL from step 1
- `PAYLOAD_SECRET` — any long random string
- `NEXT_PUBLIC_SERVER_URL` — e.g. `https://domandsagency.com`
- SMTP vars for lead emails (as above)

**3. First deploy**

Push to GitHub, import on Vercel. On the first boot, Payload creates the Postgres schema automatically (dev-push mode). Visit `/admin` to create the first admin user, then run the seed once against the production DB from your machine:

```bash
# in .env, point DATABASE_URL at the Supabase pooler URL for this one command
npm run seed
```

(`npm run seed` replaces Services, Industries, Pages, Ad pages, Founders, Site settings and the Digital Health Check with the copy-deck versions. Don't re-run it once you've started editing in `/admin`.)

### Media

Until Cloudinary is wired up, **don't upload files in `/admin` on production** — Vercel's filesystem is ephemeral, so any uploaded image will vanish on the next deploy. In the meantime:

- **Images** — host on Cloudinary and paste the URL into content fields. When you're ready to move uploads into the CMS, add `@payloadcms/plugin-cloud-storage` with a Cloudinary adapter (or a dedicated Cloudinary Payload plugin), wire it into the `Media` collection in `src/payload.config.ts`, and add the Cloudinary hostname to `next.config.ts` → `images.remotePatterns`.
- **Videos** — embed from YouTube by URL; no backend wiring needed.

## Known gaps

- `npm run lint` crashes inside the Payload template's ESLint config (an upstream `eslint-config-next` / FlatCompat issue). TypeScript (`npx tsc --noEmit`) and `npm run build` both pass.
- No articles or case studies are seeded: the copy decks only have planned titles, and proof must not be invented. Empty states show the planned titles as placeholders.
- The 404 page doesn't log broken URLs yet; use Search Console's crawl report or add logging at your host.
