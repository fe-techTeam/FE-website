# First Economy Website — SEO, AEO & GEO Technical Reference (developer detail)

| | |
|---|---|
| **Site** | First Economy marketing website (Next.js 16, App Router, Turbopack) |
| **Branch / state documented** | `feat/frontend` at commit `ea72e2d` (pushed 6 Oct 2026); behaviour verified on a production build with `scripts/verify-launch.mjs` (665 checks, 0 failures) |
| **Audience** | Developers (implementation), SEO/content team (governance), marketing leads (strategy & KPIs) |
| **Scope** | Technical SEO, on-page SEO, structured data, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), local SEO, measurement, governance |
| **Companion** | [SEO-Competitive-Benchmark.md](SEO-Competitive-Benchmark.md) — how the site compares with seven Indian agencies, with prioritised actions |
| **Revision** | Revised 6 Oct 2026 after the build-out shipped. Statuses below reflect what is **live in code**; the FAQ sections are built but **hidden** (§7.5). Nothing in this file has been checked against the live domain, which still serves the legacy site |
| **Conventions** | **Implemented** = verified in code and in production HTML. **Gap** = not present today. **Proposal** = recommendation that needs validation or a decision; nothing marked *Proposal* is live. |

---

## 1. Executive summary

### 1.1 What the three disciplines mean here

| Discipline | Goal | Who it serves | Primary signals |
|---|---|---|---|
| **SEO** (Search Engine Optimization) | Rank in classic and AI-augmented Google/Bing results and earn the click | Search crawlers and searchers | Crawlability, indexability, relevance, authority, page experience |
| **AEO** (Answer Engine Optimization) | Be the *answer*: featured snippets, People-Also-Ask, voice answers, AI Overview citations, assistant answers | Answer surfaces that extract a short, direct response | Question-led headings, concise answer blocks, lists/tables, FAQ/Q&A structure, structured data |
| **GEO** (Generative Engine Optimization) | Be *cited and described correctly* inside generated answers (ChatGPT, Gemini, Perplexity, Claude, Copilot, AI Overviews) | LLM-based retrieval and synthesis systems | Server-rendered text, entity clarity, corroboration across the web, quotable facts, bot access policy |

They stack: strong SEO fundamentals are the precondition for AEO, and AEO-style content is what generative engines most readily quote. First Economy sells exactly this service ("SEO/AEO/GEO" is a service page), so the site is also a **proof point** — its own implementation should be a reference case.

### 1.2 Current maturity

| Layer | Status | Summary |
|---|---|---|
| Technical SEO | **Strong** | Server-rendered H1 and content on every page, self-referencing canonicals, robots.txt (with an explicit AI-crawler policy), 38-URL sitemap with real `lastmod`, 28 tested legacy redirects, OG/Twitter tags with per-case share images, `llms.txt`, `en-IN`, staging noindex gate, AVIF/WebP images |
| Structured data | **Strong** | Organization (enriched) and WebSite sitewide; BreadcrumbList, Service, LocalBusiness ×4, JobPosting (with `datePosted`), Article (with `dateModified`) and VideoObject (9 films) on case studies. FAQPage is built but hidden. Gaps: LocalBusiness `geo`/hours, Person, real article publish dates |
| On-page SEO | **Good** | Unique, keyword-aware titles and descriptions on all 38 URLs; no title over 60 chars, no description under 100 or over 160; one H1 per page; a long-form "In depth" guide on each service page. Remaining gaps: service pages are still shorter than the peers' (SEO page ≈1,040 words vs 1,200–4,700; the rest 436–721), no content/insights hub, case studies lack question-style intros |
| AEO | **Built, partly live** | Service-page guides use question-led headings ("What are SEO, AEO and GEO?", "How is success measured?"). FAQ sections with `FAQPage` markup are written for the 10 service pages, home and about (61 Q&As) but **hidden** behind `FAQS_ENABLED = false`. Missing: question-led intros on case studies, visible dates |
| GEO | **Foundations and policy in place; corroboration missing** | SSR text, open crawling, an explicit allow-all AI-crawler policy, `llms.txt`, enriched Organization/WebSite entity data. Still open: Cloudflare AI-bot setting unverified, third-party profiles list the wrong offices, no directory listings, no tracking |
| Local SEO | **Partial** | LocalBusiness schema for 4 offices. Bengaluru address incomplete, no geo/opening hours, Google Business Profile status unknown |
| Measurement | **Gap** | `generate_lead` dataLayer event exists but no tag manager is installed; Search Console/Bing not documented as set up |

### 1.3 Top priorities (in order)

1. **Cut over from the legacy site safely.** `https://www.firsteconomy.com` is currently the **old PHP site** (canonical host `www`; its sitemap lists 11 `.php` URLs and its robots.txt disallows `/proposal/`). The new site's redirects (§3.2) must be live at the moment of cutover, with one host (`www`), the bare domain 301ing to it and http→https. Run `scripts/verify-launch.mjs` against the live domain immediately after.
2. **Production environment.** `NEXT_PUBLIC_SITE_URL=https://www.firsteconomy.com` is set for Production and `SITE_NOINDEX=true` for Preview on the Vercel `fe-website` project (§3.9); both apply only from the next build. The project has no other variables (database, email, admin) and no custom domain yet.
3. **Verify Cloudflare** is not blocking AI crawlers by default; the application policy (§8.3) is allow-all but an edge setting can override it.
4. **Install analytics and Search Console/Bing Webmaster**, then baseline all KPIs — §10.
5. **Replace stand-in data:** real `datePosted` for the 5 roles (currently the date they were added to the site), a role mailbox instead of `bilal@`, complete Bengaluru/Pune addresses — §4.3, §9.
6. **Decide on the FAQs:** review the 61 answers, then set `FAQS_ENABLED = true` — §7.5.
7. **Close the content-depth gap:** deepen the service pages and start an insights hub; fix third-party profiles and directory listings — §7.7, the benchmark.

---

## 2. Site overview and entity facts

### 2.1 Information architecture

| Section | Route | Template / source of content |
|---|---|---|
| Home | `/` | `src/components/home/HomePage.tsx` |
| About | `/about` | `AboutPage.tsx`, `src/content/about.ts` |
| Services hub | `/services` | `ServicesPage.tsx`, `src/content/servicesPage.ts` |
| Service detail ×10 | `/services/{slug}` | `ServiceDetailPage.tsx`, `ServiceGuide.tsx`, `FaqSection.tsx`, `src/content/servicePages/*.ts` (`guides.ts`, `faqs.ts`) |
| Work hub | `/work` | `WorkPage.tsx`, filter tabs in `src/content/workPage.ts` |
| Case study ×15 | `/work/{slug}` | `WorkDetailPage.tsx`, `src/content/caseStudies/*.ts` |
| Careers hub | `/careers` | `CareersPage.tsx`, `src/content/careers.ts` |
| Role ×5 | `/careers/{slug}` | `CareerDetailPage.tsx` |
| Awards | `/awards` | `AwardsPage.tsx`, `src/content/awards.ts` |
| Contact | `Contact Our Marketing Agency in India \| First Economy` | Static | "Let's Discuss {rotating word}" (stable `aria-label`) | LocalBusiness ×4 | Conversion |
| Privacy Policy | `/privacy-policy` | `LegalDocument.tsx`, `src/content/legal.ts` |
| Admin (not public) | `/admin/*` | Behind login; `X-Robots-Tag: noindex, nofollow` set in `src/proxy.ts`; disallowed in robots.txt |

**Service slugs:** `media-buying`, `video-production`, `branding`, `influencer-marketing`, `technology`, `creative`, `social-media`, `seo`, `ai-solutions`, `marketplace-management`.
**Case-study slugs (15):** `fedex-csk`, `vip-industries`, `godrej-blue`, `mahindra-manulife`, `orpat-erp`, `akbar-travels-seo`, `jockey-seo`, `cello-kidzbee`, `ambassador-hotel`, `godrej-greenfront`, `amazon-samsung-great-indian-festival`, `adani-airports-safar-ke-humsafar`, `waaree`, `ajanta-ai-creatives`, `royale-touche-stay-curious`.

### 2.2 Entity facts (the "ground truth" every engine should learn)

These are the facts the site states about the brand. Generative engines assemble answers from exactly this kind of data, so **they must be identical everywhere** (site, schema, social profiles, directories). Source of truth in code: `src/content/stats.ts`, `src/content/site.ts`, `src/content/offices.ts`.

| Fact | Value on site | Source |
|---|---|---|
| Name | First Economy (legal: First Economy Private Limited) | `legal.ts` |
| Positioning | "An integrated digital marketing agency in India combining media buying, creative, technology, SEO, social, influencer marketing and AI" | `SITE_DESCRIPTION` in `src/lib/seo.ts` (root meta description, Organization and WebSite schema, `llms.txt`) |
| Headquarters | Mumbai | `offices.ts` |
| Offices | Mumbai, Bengaluru, Chhatrapati Sambhaji Nagar, Pune (4) | `offices.ts` |
| Team size | 302 specialists | `stats.ts` (`companyOfficeScale`) |
| Experience | 12+ years | `stats.ts` (`homeOfficeStats`) |
| Active clients | 83+ | `stats.ts` |
| Network | 62+ agencies, 85+ markets, 225+ media awards, $17.2B+ billings | `stats.ts` (`networkStats`) |
| Notable proof | Guinness World Record with Godrej Properties (1,000+ influencers live in one hour) | `awards.ts`, `godrej-blue.ts` |
| Social profiles | LinkedIn, Instagram, YouTube, Facebook | `site.ts` → emitted as `sameAs` |

**Consistency status** (contradictory facts create contradictory AI answers):
- **Fixed:** the About description now reads the head count from `stats.ts` (302), not a hard-coded "302+".
- **Fixed in code, confirm in practice:** email is on one domain (`@firsteconomy.com`). Schema and footer use `bilal@firsteconomy.com` (a named individual); the contact form, careers and newsletter default recipients are `hello@`/`careers@firsteconomy.com`. Confirm those role mailboxes exist and receive mail, and prefer a role address in public schema.
- **Still open:** the Awards page description hard-codes "225+ media awards" instead of reading `stats.ts` (§5.6).
- **Still open, outside the site:** third-party profiles (Qoruz, CB Insights, a jobs board) describe First Economy as based in "Mumbai, Bangalore, Hyderabad and Udaipur", which contradicts the four offices above (see the benchmark).

---

## 3. Technical SEO — what is implemented

### 3.1 Rendering and crawlability

- **All public pages are statically generated or server-rendered**; the `<h1>`, body copy, breadcrumbs, schema and links are in the initial HTML. Verified in production HTML for every URL: exactly **one H1** per page.
- Client components (`"use client"`) still server-render; no content depends on `ssr: false`.
- **Carousels:** all slides must be in HTML. The About values slider was changed to render all five values (inactive ones `invisible` + `aria-hidden`); other carousels (Careers gallery, home) have **not** been individually audited for this — check that every slide/card exists in server HTML when touching them.
- **Preloader:** shown on the home page only, once per browser session, with a 0.9s minimum display (was 2.2s, on every home view). It is `aria-hidden`, flagged before first paint by a script in `src/app/layout.tsx`, and absent on repeat visits so the hero is immediately paintable. The route skeleton (`(site)/loading.tsx`) is decorative and emits no "Loading page" text.
- **404s:** unknown URLs return HTTP 404 (global `not-found.tsx`; `notFound()` in all dynamic routes). Closed roles currently return 404, not 410 (acceptable; 410 is optional).

### 3.2 URLs, hosts and redirects

- **Trailing slash:** Next default — `/about/` → `/about` (308). Keep it that way; the canonical and sitemap use the no-slash form.
- **Permanent redirects** are defined in `next.config.ts` (`redirects()`), one hop, no chains. Next emits **308** for `permanent: true`; Google treats 308 as equivalent to 301 for consolidation.

| Old URL | → New URL | Notes |
|---|---|---|
| `/our-work.php` | `/work` | Legacy site |
| `/career.php` | `/careers` | Legacy site |
| `/contact-us.php` | `/contact` | Legacy site |
| `/about-us.php` | `/about` | Legacy site |
| `/paid-media.php` | `/services/media-buying` | Legacy site |
| `/social-network.php` | `/services/social-media` | Legacy site |
| `/branding.php` | `/services/branding` | Legacy site |
| `/videography.php` | `/services/video-production` | Legacy site |
| `/technology.php` | `/services/technology` | Legacy site |
| `/online-store.php` | `/services/marketplace-management` | **Best fit** — no exact equivalent |
| `/business-solution.php`, `/business-solutions.php` | `/services` | **Best fit** — no exact equivalent. The old sitemap lists the singular (which 404s on the live site); the live nav links to the plural. Both are mapped |
| `/index.php` | `/` | The old site 301s this itself |
| `/works.php` | `/work` | The old site 301s this to `/our-work.php` |
| `/our-advantage`, `/capabilities` | `/services` | Removed pages |
| `/terms` | `/privacy-policy` | Removed page |
| `/insights`, `/insights/*` | `/` | Removed section |
| `/clients` | `/about#trusted-by` | Consolidated |
| `/leadership` | `/about#team` | Consolidated |
| `/locations/{slug}` | `/contact#offices` | Consolidated |
| `/industries`, `/industries/{slug}` | `/work` | Consolidated |

- The legacy list was built from the old site's `sitemap.xml` (11 URLs) **and a crawl of the live site's internal links**, which found three more URLs (`/business-solutions.php`, `/index.php`, `/works.php`). **`/proposal/` (confirmed in use, plain HTML files):** supported by dropping the folder into `public/proposal/` — Next serves `public/` files as they are, so `/proposal/name.html` and its relative assets are byte-identical (tested with throwaway files, then removed). `next.config.ts` adds `X-Robots-Tag: noindex, nofollow` for `/proposal/:path*` and `robots.ts` disallows `/proposal/`, matching the old robots.txt. **Limitations:** the folder is not in the repo yet; folder-style URLs (`/proposal/name/` serving an `index.html`) are 308-redirected to `/proposal/name` and then 404 under the site's no-trailing-slash rule, so if proposals use that layout a rewrite (and trailing-slash handling for that path) is needed; root-relative references to other legacy folders (`/img/`, `/css/`) would not exist on the new site. **Remaining gap:** any other URL with external backlinks. Export the old site's backlink report (Search Console links, Ahrefs/Semrush) and add any URL with external links.
- The old site already 301s the bare domain to `www` and http to https at Cloudflare. Keep that rule when the new site goes live.
- **Not handled in code (hosting/Cloudflare):** `http`→`https`, `www`↔apex single host, and the old domain's host-level redirect. Decide and configure at the edge.
- **Production host: `https://www.firsteconomy.com` (confirmed live URL).** The code default in `src/lib/site-url.ts` and `src/lib/seo.ts`, `.env.example`, and the Vercel Production variable all use the `www` host. Bare `firsteconomy.com` must 301 to `www`; `http` must 301 to `https`; `firsteconomy.in` and `new.firsteconomy.com` should redirect too if they resolve. **Status:** the Vercel project `fe-website` has no custom domain attached yet — attaching `www.firsteconomy.com` is the cutover step and replaces the legacy site. Email stays on the bare domain (`@firsteconomy.com`).

### 3.3 Canonical tags

- `metadataBase` is set from `NEXT_PUBLIC_SITE_URL` in `src/app/layout.tsx`, and `alternates.canonical: "./"` resolves **per route to the path without any query string**.
- Verified (origin shown is the environment value at test time; with the production value it reads `https://www.firsteconomy.com/...`): `/work?service=seo` → `<link rel="canonical" href="{SITE_URL}/work">`; `/services/seo` → `{SITE_URL}/services/seo`. Filter/deep-link URLs therefore never compete with the clean URL.
- Rule: never set a page-level canonical that includes a query string, and never canonicalize across domains except to the production origin.

### 3.4 Robots and indexing control

- `src/app/robots.ts` (production, `SITE_NOINDEX` unset): the `*` group plus an explicit group for the AI crawlers (§8.3), each repeating the private paths:
  ```
  User-Agent: *
  Allow: /
  Disallow: /admin
  Disallow: /api/
  Disallow: /cdn-cgi/

  User-Agent: OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot,
              Claude-User, GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot
  Allow: /
  Disallow: /admin   (and /api/, /cdn-cgi/)

  Host: <SITE_URL>
  Sitemap: <SITE_URL>/sitemap.xml
  ```
  (Next prints one `User-Agent:` line per bot; they are shown joined here.) `/cdn-cgi/` is disallowed because Cloudflare's email-protection links on every page point there.
- **Staging gate** — `SITE_NOINDEX=true` (staging/preview only) enables four layers at once: `<meta name="robots" content="noindex, nofollow">`, an `X-Robots-Tag: noindex, nofollow` header on every route (`next.config.ts` `headers()`), `Disallow: /` in robots.txt, and an empty sitemap. Verified: a build with the flag produces all four; a build without it produces none.
- The flag is read at **build time** for headers and at runtime for metadata/robots — set it in the staging environment *before* building. `/llms.txt` returns 404 in this mode.

### 3.5 XML sitemap

- `src/app/sitemap.ts` → `/sitemap.xml`, **38 URLs**: 8 static pages + 10 services + 15 case studies + 5 active roles.
- Excludes filter URLs, `/admin`, API routes and redirected paths. New case studies, services and roles appear automatically because the sitemap reads the same arrays that generate the routes (`caseStudies`, `servicePageSlugs`, `getCareerRoles()`).
- **`lastmod` is emitted for every URL, from real dates.** `scripts/update-content-dates.mjs` reads git history and writes `src/content/contentDates.ts` (last change to each page's source files; uncommitted changes are stamped with today). Role pages use the role's `datePosted`. **Run the script before each release** — the dates are committed because production builds may not have git history. Trade-off: `servicePages/faqs.ts` is shared, so an FAQ edit moves every service page's date (an over-estimate, never an under-estimate). Engines ignore `lastmod` that is not consistently accurate, so do not hand-edit it.
- Submit in Google Search Console and Bing Webmaster Tools (§10.1).

### 3.6 Titles and meta descriptions (mechanism)

- Root template: `title.default = "First Economy — Integrated Digital Marketing Agency in India"` (60 chars, the home page), `template = "%s | First Economy"` (`src/app/layout.tsx`). A page sets only its own title; the brand suffix is automatic. The tagline "Growth Systems" is kept for the web-app manifest and the default social image alt text.
- Page sources: static `metadata` exports in each `page.tsx`; `generateMetadata` for dynamic routes:
  - Services: title = `seoTitle ?? name` (e.g. `SEO, AEO & GEO Services in India`), description = `seoDescription ?? summary` (`src/content/servicePages/*.ts`).
  - Case studies: title = `seoTitle ?? "{client} — {campaign}"`, description = `seoDescription ?? hero`; also a per-case `openGraph`/`twitter` image (`src/app/(site)/work/[slug]/page.tsx`).
  - Roles: title = `"{role} — Careers"` (drops the tail when over 44 chars), description generated from location/type/department/experience plus a closing line when short.
  - Hubs: About `About Us — Integrated Marketing Agency`, Services `Integrated Marketing Services in India`, Work `Marketing Case Studies & Campaign Work`, Careers `Careers in Digital Marketing & Technology`, Awards `Marketing & Media Awards and Recognition`, Contact `Contact Our Marketing Agency in India`, Privacy `Privacy Policy — Data, Cookies & Your Rights`.
- Inventory and length audit: Appendix A and §5.5.

### 3.7 Open Graph, Twitter, icons, manifest, language

- OG/Twitter defaults come from the root layout; the page's own `title`/`description` are inherited into `og:title`/`og:description`, and `og:url` follows the canonical. Image: `/og-default.png` (1200×630, brand wordmark on black). `twitter:card = summary_large_image`.
- **Per-case-study share images (shipped):** each case study shares its own 1200×630 JPEG (`public/images/og/cases/{slug}.jpg`, 50–162 KB, generated from the 1600×1000 cover with `fit: cover`). The full covers are 0.6–2.9 MB, which is too heavy for link previews. Set in `generateMetadata` in `work/[slug]/page.tsx`; a new case study needs its JPEG generated from its cover (same sharp crop) or it falls back to the site-wide card.
- Icons: `/icons/icon-32.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` (180), plus `src/app/favicon.ico`. `manifest.webmanifest` (`src/app/manifest.ts`), `theme-color #080808`, `<html lang="en-IN">`.

### 3.8 Images (SEO and speed)

- All content images use `next/image`. `next.config.ts` serves **AVIF first, WebP fallback**, caps generated widths at **1920** (`deviceSizes: [640, 750, 828, 1080, 1200, 1920]`) and keeps `qualities: [75, 100]`. Verified: no `w=3840` fallback `src` remains anywhere.
- Case-study/campaign covers are authored at **1600×1000** (8:5). Keep that ratio so cards and heroes share one file without cropping.
- **Alt-text policy:**
  - Meaningful images: descriptive alt (e.g. team and location photos).
  - Linked card thumbnails (home/work cards): `alt=""` is intentional because the wrapping link is labelled by the card title — announcing both would duplicate.
  - Client logo wall: 57 of 59 logos are SVG crop frames with `role="img"` and `aria-label="{Brand} logo"`; duplicate marquee copies are `aria-hidden`. Crawlers do not treat SVG `<image>` as an image result, so logos give no image-search value. **Proposal:** render the first marquee set as `<img alt>` if image-search visibility of client logos matters (needs an optical-crop approach that does not alter source PNGs).
- Priority loading: only above-the-fold hero media should use `priority`; everything else lazy-loads.

### 3.9 Environment variables

| Variable | Where | Purpose | Production | Staging/preview |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `src/lib/seo.ts`, `src/lib/site-url.ts` | Origin for canonical, `og:url`, sitemap, JSON-LD, share URLs (no trailing slash) | Set to the final origin | Set to prod origin (canonicals still point to prod) |
| `SITE_NOINDEX` | `next.config.ts`, `src/lib/seo.ts`, robots/sitemap | `true` → noindex meta + header + Disallow-all + empty sitemap | **Unset** | `true` |

Documented in `.env.example`. **Risk:** if staging forgets `SITE_NOINDEX=true`, staging is indexable (the pre-fix status quo). If *production* accidentally sets it, the whole site de-indexes — add it to the deployment checklist as a "must be unset in prod" item and alert on `X-Robots-Tag` in production monitoring.

---

## 4. Structured data (JSON-LD)

### 4.1 Implementation

- Builders live in `src/lib/seo.ts`; rendering is via `src/components/JsonLd.tsx`, a server-rendered `<script type="application/ld+json">` that escapes `<` so content can never terminate the tag.
- Multiple blocks per page are emitted as separate scripts. All entities cross-reference via `@id` (`{SITE_URL}/#organization`).

| Type | Where | Source | Notes |
|---|---|---|---|
| `Organization` | Every public page (`(site)/layout.tsx`) | `organizationJsonLd()` | name, url, logo, description, HQ address, contactPoint (sales), numberOfEmployees (from `stats.ts`), areaServed India, knowsAbout (service names), award (Guinness record), email, telephone, `sameAs` (4 social profiles) |
| `WebSite` | Every public page | `websiteJsonLd()` | name, url, description, `inLanguage` en-IN, `publisher` → Organization. No `SearchAction` (the site has no search) |
| `BreadcrumbList` | Every inner page (inside `PageHero`) | `breadcrumbJsonLd()` | Last crumb (current page) omitted `item`, which Google allows |
| `Service` | 10 service pages | `serviceJsonLd()` | name, description, url, `provider` → Organization, `areaServed` India |
| `LocalBusiness` ×4 | `/contact` | `localBusinessJsonLd()` | One per office; `PostalAddress` (free-text street + city, `IN`), phone/email, `parentOrganization` → Organization |
| `JobPosting` | 5 role pages | `jobPostingJsonLd()` | title, description, employmentType, hiringOrganization, jobLocation, **`datePosted`**. `validThrough` is emitted only when set on the role |
| `Article` | 15 case studies | `caseStudyJsonLd()` | headline (matches the H1 rule), description, url, image (the case's 1200×630 share image), `about` = client, author/publisher → Organization, `dateModified` from git. No `datePublished` (the real campaign dates are not in the content) |
| `VideoObject` | Case studies with hosted films (Ajanta, Cello Kidzbee, FedEx, Godrej Blue, Royale Touché — 9 films) | `videoObjectJsonLd()` | name, description, `thumbnailUrl` (the poster), `contentUrl`, `uploadDate` (the date the file was added to the site, from git), url, publisher |
| `FAQPage` | Service pages, home, about — **currently hidden** | `faqPageJsonLd()` | Emitted only while `FAQS_ENABLED` is true, always together with the visible section (§7.5) |

Verified present and valid JSON on all 38 URLs in the production build.

### 4.2 Example (Organization as emitted)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.firsteconomy.com/#organization",
  "name": "First Economy",
  "url": "https://www.firsteconomy.com/",
  "logo": "https://www.firsteconomy.com/icons/icon-512.png",
  "description": "First Economy is an integrated digital marketing agency in India combining media buying, creative, technology, SEO, social, influencer marketing and AI.",
  "email": "bilal@firsteconomy.com",
  "telephone": "+91 9664859850",
  "address": { "@type": "PostalAddress", "streetAddress": "Plot No. 240, … Vidya Vihar West, Mumbai 400086", "addressLocality": "Mumbai", "addressCountry": "IN" },
  "contactPoint": { "@type": "ContactPoint", "contactType": "sales", "telephone": "+91 9664859850", "email": "bilal@firsteconomy.com", "areaServed": "IN", "availableLanguage": ["English"] },
  "numberOfEmployees": { "@type": "QuantitativeValue", "value": 302 },
  "areaServed": { "@type": "Country", "name": "India" },
  "knowsAbout": ["360° Media Buying", "Video Production", "Project Innovation & Branding", "…"],
  "award": "Guinness World Record — 1,000+ influencers live in one hour, with Godrej Properties",
  "sameAs": ["https://www.linkedin.com/company/first-economy/", "https://www.instagram.com/first_economy/", "https://www.youtube.com/@FirstEconomy", "https://www.facebook.com/FirstEconomy/"]
}
```

### 4.3 Known gaps in what is emitted

| Gap | Impact | Fix |
|---|---|---|
| `datePosted` is a stand-in | All 5 roles carry `datePosted: "2026-08-27"`, the date they were added to the site (from git history). Eligible for job rich results, but it is not the true posting date | Replace with the real posting date per role in `src/content/careers.ts`; add `validThrough` for any role with a closing date |
| Personal email (`bilal@…`) in public schema | Privacy; brittle if the person leaves | Use a role mailbox (e.g. `hello@`) once confirmed |
| No `foundingDate` | Thin entity description | Add when the date is confirmed (it is not in the content) |
| LocalBusiness lacks `geo`, `openingHoursSpecification`, `sameAs` per office, structured street/postcode | Weaker local ranking/answers | Split `address` into street/locality/region/postcode; add geo + hours |
| No `datePublished` on case studies; `VideoObject.uploadDate` is the file-added date | Freshness signals are approximate | Add real campaign/publication dates to the content model and use them |
| No `Person` schema | Weak authorship/E-E-A-T signals | Add once leadership bios exist (§8.5) |
| `FAQPage` hidden | No machine-readable Q&A today | Enable with `FAQS_ENABLED` after copy review (§7.5) |

### 4.4 Remaining enrichments (**Proposal**)

1. **Organization** — consider `@type: ["Organization", "ProfessionalService"]` (schema.org has no dedicated agency type); add `foundingDate` and `parentOrganization`/`memberOf` for the agency network **only** if the relationship is public and approved.
2. **Person** for leadership once bios exist (§8.5).
3. **Dates:** `datePublished` for case studies and real `uploadDate`s for films once the content model carries them.
4. Keep every value in schema identical to visible page content; markup that disagrees with the page is ignored or penalised.

### 4.5 Validation

- Google Rich Results Test (JobPosting, Breadcrumb); Schema.org Markup Validator (all types); Search Console → Enhancements after launch.
- Quick local check (production build): fetch a page and parse every `application/ld+json` block with `JSON.parse` — the build must show zero parse errors.


### 4.6 Schema changes shipped in the build-out

| Change | File | Notes |
|---|---|---|
| Organization enriched | `src/lib/seo.ts` → `organizationJsonLd()` | Adds `description` (shared `SITE_DESCRIPTION`, also the root meta description), HQ `address`, `contactPoint` (sales), `numberOfEmployees` (from `stats.ts`), `areaServed` India, `knowsAbout` (the service names), `award` (Guinness World Record with Godrej Properties — same claim as the Awards page). **Not added:** `foundingDate` (no founding date in the content) |
| `WebSite` | `websiteJsonLd()`, emitted beside Organization in `(site)/layout.tsx` | `publisher` links to the Organization `@id`. No `SearchAction` (the site has no search) |
| `Article` on case studies | `caseStudyJsonLd()`, `work/[slug]/page.tsx` | headline matches the H1 rule, `about` = client, `author`/`publisher` = Organization, `image` = the case's 1200×630 share image. Dates omitted until the content model has them |
| `FAQPage` on home and about | `src/content/siteFaqs.ts`, `FaqSection.tsx` | Figures are read from `stats.ts`, so they cannot drift |
| Case-study share images | `public/images/og/cases/{slug}.jpg`, `shareImage()` in the case page | Full covers are 0.6–2.9 MB; link previews can fail above a few hundred KB. A page-level `openGraph` replaces the root one wholesale, so `type`, `siteName`, `locale` and `url` are repeated there — the launch script checks `og:url` on every page, which is how a regression here was caught |

---

## 5. On-page SEO

### 5.1 Heading architecture

- One `<h1>` per page, rendered once by `PageHero`; then H2 > H3 in order (heading-level order was not exhaustively audited across all 38 pages; H2 counts per page are in Appendix A — run an automated heading-order check before launch).
- **Case-study H1 template:** `"{Client} — {Case title}"` (e.g. "Jockey — SEO & AI Search Growth"). The client prefix is omitted when the campaign name already contains it ("FedEx × Chennai Super Kings"). Implemented in `WorkDetailPage.tsx`.
- Case-study H2 outline is identical across all cases: *01 The Objective, 02 The Mandate, 03 The Execution, 04 The Result, 05 Related Work*. Good for consistency and scanning; **weak for search** because the headings carry no topical keywords. **Proposal:** keep the numbered labels visually but add topical context in the intro sentence of each section (e.g. "The objective: win organic visibility against OTAs…").
- Service pages: H1 "{Service} Solutions.", then the process grid, an "In depth" guide (one H2, topic- or question-led H3s per section), case studies and the CTA (plus the FAQ section when enabled).

### 5.2 Page-type playbook

| Page type | Title pattern | Description source | H1 | Primary schema | Intent |
|---|---|---|---|---|---|
| Home | `First Economy — Integrated Digital Marketing Agency in India` | Positioning sentence with category and market | Brand statement | Organization | Brand/navigational |
| Service | `{seoTitle} \| First Economy`, e.g. `SEO, AEO & GEO Services in India` (falls back to the service `name`) | `seoDescription ?? summary` | `{Service} Solutions.` (brand's own service name) | Service + FAQPage + Breadcrumb | Commercial investigation |
| Case study | `{seoTitle ?? Client — Campaign} \| First Economy` | `seoDescription ?? hero` | `{Client} — {Campaign}` | Article + VideoObject (when films) + Breadcrumb | Proof / consideration |
| Role | `{Role} — Careers \| First Economy` | Generated | Role title | JobPosting + Breadcrumb | Job search |
| Hub (About, Services, Work, Careers, Awards, Privacy) | Keyword-aware static titles (§3.6) | Static | Brand-voiced statement | Breadcrumb | Navigational/trust |
| Contact | `Contact Us \| First Economy` | Static | "Let's Discuss {rotating word}" | LocalBusiness ×4 | Conversion |

### 5.3 Topic and intent map (**Proposal** — validate with keyword tooling before committing)

No keyword research is stored in the repo. The table maps each commercial page to the topic cluster it should own; volumes and difficulty must come from Search Console/Semrush.

| Page | Core topic | Likely secondary topics / questions | Notes |
|---|---|---|---|
| `/services/seo` | SEO, AEO, GEO services India | AI Overviews optimization, local SEO, technical SEO audit, "what is GEO" | Flagship for the discipline this document covers |
| `/services/media-buying` | 360° media buying / performance marketing agency | OOH + digital planning, programmatic, omnichannel | Owns the "360° Media" brand term |
| `/services/influencer-marketing` | Influencer marketing agency India | Creator programmes, UGC, influencer activation at scale | Proof: Godrej Blue (1,000+ influencers) |
| `/services/video-production` | Brand film / social video production | AI-assisted video production | Proof: Ajanta, Cello Kidzbee |
| `/services/branding` | Brand identity and positioning | Brand experience, signage/craft | Proof: Ambassador Hotel, Godrej Greenfront |
| `/services/technology` | ERP / platform / web & mobile development | Fintech platform rebuilds | Proof: Mahindra Manulife, Orpat ERP |
| `/services/social-media` | Social media marketing agency | B2B + B2C social, community | Proof: Waaree |
| `/services/marketplace-management` | Amazon/Flipkart marketplace management | Quick-commerce, e-commerce growth | Proof needed (no dedicated case study) |
| `/services/creative` | Creative/ad campaign agency | Integrated campaigns | Proof: Royale Touché |
| `/services/ai-solutions` | AI marketing solutions | AI analytics, AI creatives, automation | Proof: Ajanta Magic Moments |
| `/work`, case pages | Brand+campaign terms | `{client} campaign case study` | Capture branded long-tail from clients' own audiences |
| `/careers/*` | `{role} jobs in {city}` | Salary/experience terms | JobPosting eligibility depends on `datePosted` |

### 5.4 Internal linking model

- **Global:** header nav (About, Services, Work, Careers, Contact), footer (Company: About, Team, Awards, Careers, Locations; Services: all 9 service offerings; Privacy Policy), breadcrumbs on every inner page.
- **Service ↔ case study:** each service page shows its case studies (`caseStudiesForService`) and links to `/work?service={slug}` ("explore"); the Work tab for that service preselects via the query. Services with no Work tab (AI, Branding, Marketplace) link to plain `/work`.
- **Case study → related:** a "Related Work" block (up to 3 cards) selected by same industry, then same family, then featured (`getRelatedWork`). Cards reuse the `/work` card component, so tag/title/image logic is identical.
- **Work filters:** a case matches a tab if its badge matches **or** any of its `services` match (`matchesWorkFilter` in `workPage.ts`). Jockey carries the "Integrated Campaign" badge but also appears under SEO. **Exception:** Royale Touché is listed only under "All Cases" and "Integrated Campaign" — its slug is in `badgeOnlyFilterCases` (`workPage.ts`), which skips the service-based matching. Add other slugs there to give them the same behaviour. (Service pages still list it as proof for the services it used.)
- **Orphans:** none known — every sitemap URL is reachable from the nav, footer or a hub within two clicks. Re-check after adding pages.
- **Proposal:** add a "Services used" link row on each case study (service names → `/services/{slug}`) to give service pages more internal anchors from proof pages, and a "Related services" row on service pages.

### 5.5 Metadata audit (from the production build)

Guidance (not hard rules): titles ≈ 50–60 characters including the brand suffix; descriptions ≈ 120–160 characters, unique, written for the click.

- **Duplicate descriptions: 0** across 38 URLs. **Missing H1: 0.** **Missing canonical: 0.**
- **Descriptions under 100 chars: 0 (was 12) — fixed.** The 12 short descriptions came from using the case-study `hero` sentence (written for on-page display). Now: optional `seoDescription` on `CaseStudy` (`src/content/types.ts`) and on `ServicePageContent`, used by `generateMetadata` (`seoDescription ?? hero|summary`). Written for Mahindra Manulife, Orpat, Ambassador Hotel, Godrej Greenfront, Amazon × Samsung, Waaree, Ajanta and Royale Touché, plus Social Media (service) and Privacy Policy. Roles shorter than 115 characters get a closing line ("Join First Economy’s integrated growth team.") from the template in `careers/[slug]/page.tsx`.
- **Titles over 60 chars: 0 (was 4) — fixed.** Optional `seoTitle` on `CaseStudy` (without the 16-character ` | First Economy` suffix, so keep it ≤ 44 chars). Set for VIP Industries, Mahindra Manulife and Amazon × Samsung; the long role title drops its " — Careers" tail when `title — Careers` exceeds 44 characters.
- **Also trimmed:** `/careers` (was 179) and `/contact` (was 161) descriptions to stay within ~160 characters. Current audit: **38 URLs, 0 titles over 60, 0 descriptions under 100 or over 160, 0 duplicates** (re-run from Appendix A).
- **Hub titles are now keyword-aware** (About, Services, Work, Careers, Awards, Contact, Privacy — §3.6). All 38 titles are unique.
- **Contact H1 rotates** through eight words client-side (`RotatingWord`, 1.5s). Server HTML is stable ("Let's Discuss Media Buying"). **Mitigated:** the H1 now has `aria-label="Let’s discuss your next move"` (new `titleAriaLabel` prop on `PageHero`), so assistive tech gets a stable name. The visible rotation and the server-rendered text are unchanged; a crawler that reads text content still sees the first word.

### 5.6 Content rules for authors

1. Every claim with a number must trace to `stats.ts` or the case study's `results`; never hard-code a figure in a meta description. The About description now reads from `stats.ts`; the Awards description ("225+") still hard-codes it — fix when next touched.
2. Use the brand's exact service names (`360° Media Buying`, `Tech Solutions`, `Project Innovation & Branding`, `SEO/AEO/GEO`) consistently — see `src/content/serviceOfferings.ts`. Name variants fragment entity recognition.
3. Apostrophes use the typographic ’ (U+2019) site-wide; do not mix.
4. Do not publish a page without a unique description and an H1 that states the topic.

---

## 6. Performance and page experience (SEO-relevant)

Core Web Vitals are a ranking signal and, more importantly, an AEO/GEO eligibility factor (slow or unstable pages are crawled less and quoted less). **Not yet measured** — see §10.

| Area | Implemented | Remaining risk |
|---|---|---|
| LCP | Preloader limited to first-in-session home visit; AVIF/WebP; capped widths | Large PNG covers (1–3 MB sources); hero image priority per page unaudited |
| CLS | Fixed aspect ratios on cards/heroes | GSAP entrance animations and marquees must not shift layout — verify in field data |
| INP | — | Heavy scroll/marquee animation libraries (GSAP/ScrollTrigger) load site-wide; lazy-load below the fold |
| Mobile UX | No horizontal overflow and ≥44px tap targets verified at 375px | Check 360px and 414px |
| Large screens (≥1440p, 4K) | The home hero visual is sized against the capped hero height (`--hero-h`), and the hero grid and title follow the site container (`--content`), so nothing clips and the hero lines up with the header at 1440, 1920, 2560 and 3840 wide (`src/styles/growth-system.css`) | Hero is still capped at 48rem tall, so on very tall screens it fills only the top of the viewport (design choice) |

**Targets (mobile, 75th percentile):** LCP < 2.5 s, CLS < 0.1, INP < 200 ms. Measure with PageSpeed Insights (lab + CrUX field), Search Console → Core Web Vitals, and `next build` bundle output.

---

## 7. AEO — Answer Engine Optimization

### 7.1 Where answers appear

Featured snippets, People-Also-Ask, Google AI Overviews / AI Mode, voice assistants, Bing/Copilot answers, and the answer panels of ChatGPT search and Perplexity. All of them reward content that **states the answer in the first sentence under a heading phrased like the question**, followed by supporting detail.

### 7.2 Current state

The site copy is brand-voice marketing ("We don't just connect the dots…"): excellent for conversion, weaker for extraction. What has changed:

- **Service pages now carry a long-form guide** (§7.7) with question- and topic-led headings, definitions ("What is 360° media buying?"), process lists and results, all server-rendered.
- **FAQ sections with `FAQPage` markup are written** for the 10 service pages, home and about, but are **hidden** (§7.5).
- Still missing: question-led intros on case studies, and visible dates. Case studies hold strong, specific facts (e.g. Akbar Travels: 130%+ traffic growth, 1,000+ → 20,000+ monthly visa leads; Jockey: 3.2× top-3 keyword growth, 99.5% impressions growth, 80/100 AI visibility score) under generic headings.

### 7.3 AEO content patterns

Apply per page type. Keep answers factual, brand-accurate and short.

1. **Definition block** (service pages, ~40–60 words), directly under the first heading:
   *"{Term} is … . At First Economy it means … ."* One definition sentence, one differentiator sentence.
2. **FAQ section** (4–8 questions per service page). Each question is an `<h3>` (or a `<details><summary>`), the answer is ideally 30–80 words (the shipped service FAQs run 19–59), begins with the direct answer, then adds a qualifier or example. Questions must be real: derive from People-Also-Ask, Search Console queries, sales-call objections, and client emails.
3. **Steps / process lists** — service pages already have process steps (`process` in `ServicePageContent`); render them as an ordered list so engines can lift them as step answers.
4. **Comparison tables** where a user compares options (e.g. SEO vs AEO vs GEO — see §1.1) — tables are the most-lifted format.
5. **Results as quotable sentences** on case studies: "Akbar Travels grew organic traffic by 130%+ and reached 20,000 monthly visa leads through keyword architecture, WhatsApp lead capture and trend-based blogs." One sentence per case, placed near the top, with a `dateModified`.
6. **Local answers** — "digital marketing agency in {Mumbai/Bengaluru/Pune/Chhatrapati Sambhaji Nagar}" — need per-city content and consistent NAP (§9).

### 7.4 Proposed question bank (**Proposal** — validate and prune with real query data)

| Page | Candidate questions |
|---|---|
| `/services/seo` | What is the difference between SEO, AEO and GEO? · How do you get a brand cited in Google AI Overviews? · What does an SEO/AEO/GEO engagement include? · How long does it take to see organic growth? · How do you measure visibility in AI answers? · Do you handle local SEO for multi-city brands? |
| `/services/media-buying` | What does 360° media buying mean? · How do you split budget between OOH, digital and programmatic? · How do you measure incremental impact across channels? · What is the minimum campaign size? |
| `/services/influencer-marketing` | How do you choose creators for a campaign? · Can you activate hundreds of creators at once? (proof: 1,000+ influencers live in one hour) · How do you prevent off-brief content? |
| `/services/video-production` | Do you produce end to end, from script to edit? · How is AI used in video production? · What turnaround should we expect? |
| `/services/technology` | Do you build custom ERPs and regulated-industry platforms? · How do you handle compliance and audit trails? |
| `/services/ai-solutions` | What AI work do you deliver today? · How do you keep brand control over AI-generated creative? |
| `/about` | What is First Economy? · Where are your offices? · How big is the team? · What awards has the agency won? |
| `/` | What does First Economy do? · Who do you work with? |

### 7.5 Implementation — service-page FAQs (**built, currently hidden**)

> **Status: hidden for now.** `FAQS_ENABLED = false` in `src/content/features.ts` switches off the visible FAQ sections (all 10 service pages, home, about) **and** their `FAQPage` markup together — markup for text that is not on the page breaks Google's structured-data rules, so the two must never be split. The copy, components and tests are intact: set the flag to `true` to publish. The launch script (`scripts/verify-launch.mjs`) accepts either state but fails if the section and the markup disagree. Everything below describes the feature when enabled; the counts of FAQ pages in §1.2 and the backlog apply once it is on.

> **Also hidden (switches in `src/content/features.ts`):** `SERVICE_GUIDES_ENABLED` (§7.7) and `WORK_TAGS_ENABLED`, which controls the small tag chips (e.g. Branding, OOH, Influencer, Print) under the hero text of case-study pages (`WorkDetailHero.tsx`). The `/work` listing cards are unaffected.

**What exists**

| Piece | File | Notes |
|---|---|---|
| Copy (single source) | `src/content/servicePages/faqs.ts` | `serviceFaqs: Record<slug, {question, answer}[]>`; 5 Q&As for each of the 10 services. Writing rules are in the file header |
| Type and switch | `ServiceFaqItem`, `ServicePageContent.faq?` in `servicePages/types.ts`; `FAQS_ENABLED` in `src/content/features.ts` | Attached to each page in `servicePages/index.ts` only when the flag is on; home and about gate their section and JSON-LD on the same flag |
| Visible section | `src/components/FaqSection.tsx` (shared by services, home and about) | Server-rendered native `<details>/<summary>`, one `<h3>` per question. All answers are in the initial HTML; keyboard-operable; no JS. On the home page the scroll-reveal attributes are off (`animate={false}`) because the home page's own script hides every `[data-animate]` element it does not manage |
| Schema | `faqPageJsonLd()` in `src/lib/seo.ts` | Emitted from `services/[slug]/page.tsx`, `services/media-buying/page.tsx`, `(site)/page.tsx` and `about/page.tsx` from the same arrays as the visible text |

Because media buying has a dedicated route, `media-buying/page.tsx` and `MediaBuyingPage.tsx` now read the page via `getServicePageContent("media-buying")` so the FAQ attached in `index.ts` reaches them.

**Verified (dev server, all 10 service URLs):** one H1; 5 FAQ items each; `FAQPage` question and answer text is identical to the visible text; no console errors; no horizontal overflow at 375px; each question row is at least 91px tall (tap target); the question rows are focusable.

**Grounding rule.** Every figure in an answer comes from a case study or `stats.ts` (e.g. Akbar Travels 130%+ traffic and 1,000+ to 20,000+ monthly visa leads; Jockey 3.2x top-3 keywords and 80/100 AI visibility; FedEx x CSK 1.2B+ impressions and 42% brand-search growth; the Godrej Properties Guinness World Record of 1,000+ influencers in one hour; Royale Touché 4.9/5 LLM rating). No timelines, prices or minimum budgets are quoted anywhere, because the site does not state them.

**Authoring a new FAQ**
1. Add the item to `serviceFaqs[slug]` — nothing else; the section and the schema both update.
2. First sentence answers the question outright; name First Economy and the service so the passage still makes sense when quoted alone.
3. Do not add a number that is not in a case study or `stats.ts`.
4. Keep answers plain text (no HTML) — the schema `text` field is the same string.

**Honest expectations on rich results.** Since 2023 Google shows FAQ rich results only for well-known government and health sites, so do **not** expect the expandable FAQ snippet in Google. The markup still helps Bing, assistants and LLM parsers, and the visible Q&A text is what earns snippets and citations.

**Still to do**
- **Team review** of the 61 answers (50 service, 6 home, 5 about) for tone and accuracy before enabling; replace any with questions drawn from real Search Console queries and sales conversations (§7.4 is a candidate bank, not data).
- Answer-first intro sentences and a `dateModified` on case studies.
- Display a "Last updated" date on FAQ sections once a content-date field exists.
- `<details>` closed by default means answers are collapsed on screen; they are still in the HTML. If analytics show low engagement, test opening the first item by default.

### 7.6 AEO measurement

- Search Console → Performance → filter queries starting with who/what/how/why/can/does; track impressions and CTR over time.
- Manual SERP checks for the target questions (monthly): snippet owner, PAA presence, AI Overview citation list.
- Third-party rank trackers that report featured-snippet and AI Overview ownership (Semrush, Ahrefs, SE Ranking, etc.).

### 7.7 Service-page guides (**built, currently hidden**)

> **Status: hidden for now.** `SERVICE_GUIDES_ENABLED = false` in `src/content/features.ts` removes the section from every service page (`servicePages/index.ts` attaches `guide` only when the flag is on). The copy and component are intact; set it to `true` to publish. The word counts below and the page-depth figures elsewhere in this file describe the pages **with** the guides on; with them off the pages are back to ≈440–550 words.

When enabled, each of the 10 service pages has a server-rendered "In depth" section between the process grid and the case studies.

| Piece | File | Notes |
|---|---|---|
| Copy | `src/content/servicePages/guides.ts` | `serviceGuides: Record<slug, { title, intro, sections[] }>`; each section has a heading, paragraphs and optional bullets. Rules are in the file header |
| Component | `src/components/services/ServiceGuide.tsx` | One H2, one H3 per section; plain HTML, no JS |
| Wiring | `servicePages/index.ts`, `ServiceDetailPage.tsx` | `ServicePageContent.guide` |

**Grounding rules.** Explain the discipline plainly; describe First Economy's work only as the site already does (process steps, case-study results, the listed tools); every figure traces to a case study or `stats.ts`; no timelines, prices, minimum budgets or guaranteed outcomes.

**Measured depth** (visible text of the full page in the production build, including header and footer):

| Page | Words |
|---|---|
| `/services/seo` | 1,042 |
| `/services/influencer-marketing` | 721 |
| `/services/media-buying` | 691 |
| `/services/branding` | 629 |
| `/services/video-production` | 591 |
| `/services/social-media` | 519 |
| `/services/ai-solutions` | 499 |
| `/services/technology` | 481 |
| `/services/creative`, `/services/marketplace-management` | 436 each |

**Honest status:** the SEO page went from ≈550 to ≈1,040 words, but the comparable peer SEO pages run 1,200–4,700. The other nine are still short. Closing the gap needs more written content (pricing factors, tools, engagement model, deeper proof), reviewed by someone who knows the services — not padding. The guides also need that review.

---

## 8. GEO — Generative Engine Optimization

### 8.1 How generative engines choose sources

Generative systems (a) retrieve pages from a search index or their own crawler, (b) extract passages, (c) synthesize an answer and cite a handful of sources. To be cited a page must be **retrievable** (crawlable, fast, in the index), **extractable** (clear, self-contained passages in HTML), and **trusted** (corroborated across independent sources, clear authorship and entity). Most AI crawlers **do not execute JavaScript**, which is why server-rendered text matters.

### 8.2 What the site already does well

- All primary content is in the initial HTML (no client-only content gating).
- Clean heading structure, breadcrumbs, internal links, sitemap, canonical URLs.
- Entity data in JSON-LD with `sameAs` links to the four social profiles.
- Specific, quantified proof on case studies and awards pages (the raw material LLMs prefer to cite).
- An explicit allow-all AI-crawler policy (§8.3) and an `llms.txt` (§8.4).

### 8.3 AI crawler access policy (**decided and shipped**)

**Decision: allow every named AI crawler.** First Economy wants to be found, cited and described correctly by AI tools, and it sells that exact service, so blocking would work against the goal. The policy lives in `src/app/robots.ts` as three lists (`AI_BOTS_RETRIEVAL`, `AI_BOTS_TRAINING`, `AI_BOTS_BLOCKED`); moving a name into `AI_BOTS_BLOCKED` opts that bot out with a one-line change. It can be reversed at any time. Private paths (`/admin`, `/api/`, `/cdn-cgi/`) are repeated inside the AI-bot group because a crawler with its own group ignores the `*` group.

| Purpose | User agents | Policy |
|---|---|---|
| **Search / answer retrieval** (cited in answers, drives referral traffic) | `OAI-SearchBot` (ChatGPT search), `ChatGPT-User` (user-initiated fetch), `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User` | **Allowed** — keep allowed |
| **Model training** | `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot` | **Allowed** — improves baseline knowledge of the brand. `Google-Extended` and `Applebot-Extended` control AI-training use only; they do not affect Google ranking or AI Overviews. This is the one genuine business choice: block these if you do not want content reused for model training |
| Googlebot, Bingbot, everyone else | — | Default allow (`*` group) |

Review quarterly — bot names change. Staging (`SITE_NOINDEX=true`) disallows everything for every crawler.

**Verify at the edge (Cloudflare):** the site sits behind Cloudflare (`/cdn-cgi/` links). Cloudflare has offered managed controls that block or challenge known AI crawlers, and has defaulted to blocking them on newly onboarded domains. Check *Security → Bots / AI Crawl Control* and the zone's managed `robots.txt` setting, otherwise an application-level "allow" is silently overridden and answer engines never see the pages. Also confirm that WAF/rate limits do not challenge legitimate bots, and that the `/robots.txt` served publicly is the one generated by the app.

**Index sources matter:** Google AI Overviews use Google's index (no separate opt-in); Bing's index feeds Copilot and is a source for several assistants — so Bing Webmaster Tools setup and **IndexNow** pings are part of GEO, not just SEO.

### 8.4 `llms.txt` (**shipped, optional value**)

`/llms.txt` is served by `src/app/llms.txt/route.ts`: a Markdown map (positioning line, HQ and offices, the services, the 15 case studies with descriptions, and the About/Awards/Careers/Contact pages), built from the same arrays as the sitemap so it can only describe pages that exist. It returns 404 on staging. **It is a proposed convention, not a ratified standard, and no major engine has committed to using it** — it is cheap and harmless, a complement to crawlable HTML and never a substitute. Do not rely on it for GEO results; the launch script verifies that every link in it is also in the sitemap.

### 8.5 Entity and trust signals (**the core of GEO**)

LLMs describe a brand from what multiple independent sources agree on. Make that agreement easy.

| Signal | Current | Action |
|---|---|---|
| Consistent name/description everywhere | Partly (see §2.2 inconsistencies) | One canonical "boilerplate" paragraph (≈50 words) reused on site, LinkedIn, GBP, directories, press kits |
| `sameAs` / profile coverage | 4 social profiles | Add Google Business Profile ×4, Crunchbase, Clutch/Sortlist/DesignRush-type directories, awards-body pages, Wikidata (if notability criteria met) |
| Authorship & expertise (E-E-A-T) | Leadership carousel; no bios, no bylines, no dates | Leadership pages with credentials; named authors on any editorial content; show dates |
| Third-party corroboration | Awards imagery on About/Awards | Link each award to the awarding body's page; earn mentions (client press, trade media: Campaign India, afaqs, exchange4media, BestMediaInfo, Business Standard, LinkedIn articles) |
| Client proof | 15 case studies with metrics | Add client-approved quotes; link to the client's own announcement where public |
| Data worth citing | Case-study metrics | Publish original, methodology-backed numbers (e.g. anonymized AI-search visibility benchmarks) — original data is the single most citable asset |
| Freshness | `dateModified` in Article schema and sitemap `lastmod` (from git); no visible dates, no `datePublished` | Show "last updated" dates; add real publication dates; refresh high-value pages at least every 6–12 months |

**Quotable fact blocks:** place a 2–4 sentence, self-contained summary at the top of each service and case page (answer first, no pronouns that depend on prior context, brand named explicitly, figure + unit + timeframe). That passage is what an LLM will paraphrase.

### 8.6 Prompt-based visibility testing (**Proposal**)

Because there is no Search Console for AI answers, test directly. Maintain a sheet of ~25–40 prompts across the funnel and run them monthly on ChatGPT (search on), Gemini/AI Mode, Perplexity, Copilot and Claude (web on):

- Brand: "What is First Economy?", "Is First Economy a good agency?", "Where is First Economy located?"
- Category: "Best integrated marketing agencies in India", "Agencies that do SEO and AEO/GEO in Mumbai", "Influencer marketing agency that activated 1,000 creators"
- Proof: "Who ran the Godrej Blue influencer campaign?", "Who did SEO for Akbar Travels / Jockey?"
- Comparison/problem: "How do I get my brand cited in AI Overviews?"

Record per prompt: brand mentioned (Y/N), position in list, sources cited (is our domain among them), sentiment/accuracy, competitor set. Track share-of-voice over time and log **inaccuracies** so they can be corrected at the source.

### 8.7 GEO measurement

- **Referral traffic:** create a GA4 custom channel group "AI assistants" matching referrers `chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`. Expect low absolute volume; track growth and conversion rate.
- **Bot hits:** monitor server/Cloudflare logs for the user agents in §8.3; confirm 200 responses and no challenges.
- **Citation monitoring:** the prompt sheet above, or tools that track AI citations/mentions.
- **Brand-search lift:** branded query impressions in Search Console often rise as AI exposure grows.

---

## 9. Local SEO

### 9.1 NAP (name, address, phone) — current data

| Office | Address in `offices.ts` | Local contact |
|---|---|---|
| Mumbai (HQ) | Plot No. 240, 240/1 to 8, 2nd Floor, Office No. 205 & 206, Neelkanth Corporate IT Park, Kirol Road, Vidya Vihar West, Mumbai 400086 | Main number (no local line) |
| Bengaluru | "Bengaluru, Karnataka" — **incomplete** | Megha Mathur, +91 86960 23191 |
| Chhatrapati Sambhaji Nagar | Office 101, First Floor, Vastu Elite Square, Beed Bypass, Chhatrapati Sambhaji Nagar (Aurangabad), 431001 | — |
| Pune | "WeWork, Kalyani Nagar, Pune" — **incomplete** (no street/pincode) | Deep Ajmera, +91 99870 22040 |

### 9.2 Actions

1. Complete the Bengaluru and Pune street addresses and pincodes; structure them in data (`street`, `locality`, `region`, `postalCode`) and feed `PostalAddress` properly.
2. Claim and verify **Google Business Profiles** for each office; use identical NAP to the site; add categories ("Marketing agency", "Internet marketing service"), photos, and link to `/contact`. Same for Bing Places and Apple Business Connect.
3. Extend `LocalBusiness` schema with `geo`, `openingHoursSpecification`, `sameAs` (GBP URL), `priceRange` (optional) and `hasMap`.
4. Spelling: always "Chhatrapati Sambhaji Nagar" (the site standard); mention the former name "Aurangabad" once in the address for recognition, as the data already does.
5. Optional: dedicated city landing pages only if there is real, distinct local content — thin city pages hurt more than help.

---

## 10. Measurement, tooling and KPIs

### 10.1 Setup checklist

**Tracking carried over from the live site (read from its public HTML, 7 Oct 2026):** one Google Tag Manager container `GTM-THFF9GV` on every page (head script + noscript iframe) and a Search Console `google-site-verification` tag on the home page. No GA4, ads or pixel code is in the page HTML; those live inside the container. A commented-out Google Partners badge (agency id 3235089376) was ignored.

**Implemented:** `src/lib/tracking.ts` (IDs, `trackingEnabled()`, allowed hostnames), `src/components/GoogleTagManager.tsx` (rendered in `(site)/layout.tsx`, so never on `/admin`), and `verification.google` in `src/app/layout.tsx`. It loads only when `NODE_ENV === "production"`, `SITE_NOINDEX` is unset and the page is served from the live domain — the explicit `LIVE_HOSTNAMES` list in `src/lib/tracking.ts` (`www.firsteconomy.com`, `firsteconomy.com`), independent of `NEXT_PUBLIC_SITE_URL` — so `localhost` and preview URLs never reach the live data. If the production domain changes, update that list. `NEXT_PUBLIC_GTM_ID` overrides the container; an empty string turns it off. No consent banner (the live site has none). The launch script checks the tag on the home page, its absence on staging and `/admin/login`, and the verification tag.

**Still to verify in the container:** the GA4 tag fires on the new pages (App Router navigation does not reload the page; GA4 Enhanced Measurement's history-change page views, or a GTM History Change trigger, must be on), and a trigger exists for the `generate_lead` dataLayer event (`form: "contact"` / `"career_application"`).

| Tool | Action |
|---|---|
| Google Search Console | Add a **Domain** property for the production domain; submit `/sitemap.xml`; inspect key URLs; review Pages (indexing), Core Web Vitals, Enhancements (breadcrumbs, jobs), Links |
| Bing Webmaster Tools | Verify site; submit sitemap; enable **IndexNow** (instant URL change notification — useful for new roles and case studies) |
| GA4 + Tag Manager | Install GTM; map the existing `dataLayer` event `generate_lead` (`form: "contact"` or `"career_application"`) to a GA4 conversion; add the AI-assistant channel group (§8.7) |
| Google Ads (if used) | Import the GA4 conversion |
| Cloudflare | Review bot/AI-crawler settings and cache rules for `/sitemap.xml`, `/robots.txt` |
| Uptime/headers monitor | Alert if `X-Robots-Tag: noindex` or a `noindex` meta ever appears on production |

### 10.2 KPI framework

Set targets only after a 4–8 week baseline.

| Layer | KPI | Source | Cadence |
|---|---|---|---|
| SEO | Indexed pages vs sitemap (38), organic clicks/impressions/CTR/avg. position, branded vs non-branded split, top-3/top-10 keyword counts | GSC, rank tracker | Weekly/monthly |
| SEO | Core Web Vitals pass rate (mobile) | CrUX/GSC | Monthly |
| SEO | Organic leads (`generate_lead` from organic) and lead quality | GA4, CRM | Monthly |
| AEO | Featured snippets / PAA owned for target questions; Q&A pages' impressions | GSC, tracker | Monthly |
| GEO | Prompt-test mention rate and citation rate; AI-assistant referral sessions; bot crawl success | Prompt sheet, GA4, logs | Monthly |
| Local | GBP views/calls/direction requests per office; local pack rank | GBP, tracker | Monthly |
| Authority | Referring domains, new coverage/mentions, directory/profile completeness | Backlink tool | Quarterly |

---

## 11. Content operations and governance

### 11.1 Adding a new case study (SEO checklist)

1. Create `src/content/caseStudies/{slug}.ts` and register it in `src/content/caseStudies/index.ts` (**both** the `caseStudies` array and the export list — a study left out of the array silently never renders, has no route and no sitemap entry).
2. Fill `client`, `campaign`, `hero` (the on-page line), `seoDescription` (120–160 chars, becomes the meta description; falls back to `hero`), `seoTitle` only if `{client} — {campaign}` is over 44 chars, `services` (drives Work filters and service-page proof), `tags`, `family`, `results` (real numbers with units), `industry`.
3. Add the 1600×1000 cover to `public/images/work/cases/{slug}.png` and register it in `src/content/workPhotos.ts`, then generate its 1200×630 share image at `public/images/og/cases/{slug}.jpg` (sharp, `fit: cover`, JPEG q80) — without it the link preview falls back to the generic card.
4. Set the card badge in `cardTagOverrides` (`src/content/workPage.ts`) if it differs from the family default.
5. Link it from the relevant service via `caseStudySlugs` (`src/content/services.ts`) and the industry (`industries.ts`).
6. Run `node scripts/update-content-dates.mjs`, build, and run `scripts/verify-launch.mjs`: route returns 200, appears in `/sitemap.xml` with a `lastmod`, has a unique title/description, one H1, Article schema and a share image.

### 11.2 Adding a service or role

- **Service:** add content in `src/content/servicePages/{slug}.ts` (unique `summary`, plus `seoTitle` and optionally `seoDescription`), a guide in `guides.ts` and FAQs in `faqs.ts`; register in `servicePages/index.ts` and `serviceOfferings.ts`; the nav, footer, stack, sitemap and `Service` schema update automatically.
- **Role:** add to `careersRoles` with a real `datePosted` (and `validThrough`); remove the role (or set it past `validThrough`) when filled so the page stops being indexable as an open job.

### 11.3 When a URL changes or is removed

- Add a permanent redirect in `next.config.ts` **in the same release**; never leave a 404 for a page that had traffic or backlinks.
- Update internal links and the sitemap source; avoid redirect chains.

### 11.4 Admin CMS note

`src/lib/admin/structure-defaults.ts`, `revalidate.ts` and `health.ts` hold route lists used for cache revalidation and link checks. When adding or removing public routes, update these lists so published edits revalidate the right pages and the broken-link scan does not flag valid URLs.

---

## 12. QA and validation

### 12.1 Pre-launch checklist

- [ ] `NEXT_PUBLIC_SITE_URL` set to the final origin; `SITE_NOINDEX` **unset** in production
- [ ] `https://{prod}/robots.txt` shows `Allow: /` and a sitemap line; no `noindex` header or meta on production
- [ ] `/sitemap.xml` returns 38 URLs on the production origin
- [ ] Canonical on every sampled page equals its own production URL
- [ ] Legacy PHP URLs redirect in one hop to the intended pages
- [ ] Host-level redirects configured (http→https, www/apex, old domain → new)
- [ ] Rich Results Test passes for a service page, a role page (with `datePosted`) and `/contact`
- [ ] OG preview verified on LinkedIn Post Inspector and WhatsApp
- [ ] Lighthouse/PageSpeed run on home, a service page and a case study (mobile)
- [ ] Cloudflare AI-crawler setting reviewed (§8.3)
- [ ] Search Console and Bing Webmaster verified and sitemap submitted
- [ ] `node scripts/update-content-dates.mjs` run and committed (sitemap `lastmod`)
- [ ] `FAQS_ENABLED` is a deliberate value (§7.5); real `datePosted` dates entered for open roles
- [ ] `node scripts/verify-launch.mjs https://www.firsteconomy.com https://www.firsteconomy.com` passes right after cutover

### 12.2 Useful verification commands

**Automated launch check — `scripts/verify-launch.mjs`.** One script runs ~665 checks against any running instance:

```bash
# Local production build (expected origin = the live host)
node scripts/verify-launch.mjs http://localhost:3011 https://www.firsteconomy.com
# Staging (noindex mode): expects header, meta, Disallow: / and an empty sitemap
node scripts/verify-launch.mjs http://localhost:3012 https://www.firsteconomy.com --staging
# After cutover: run against the live domain itself
node scripts/verify-launch.mjs https://www.firsteconomy.com https://www.firsteconomy.com
```

It checks 28 legacy redirects (status, single hop, exact target, final 200, query strings kept), then for each of the 38 sitemap URLs: 200, one H1, self-canonical, unique description, `og:url`, valid JSON-LD (Organization, WebSite, Breadcrumb, Service, Article + case share image, VideoObject on pages with films, JobPosting with `datePosted`), FAQ section and markup present together or absent together, no stray noindex; plus sitemap `lastmod` on every URL, explicit AI-bot rules in `robots.txt`, `llms.txt` links all in the sitemap, a real 404 and the admin noindex header. Last full run on the production build: **665 pass / 0 fail**. The staging build (noindex mode) last passed **92 / 0** before the final content changes — rerun it. It exits non-zero on any failure.

```bash
# Build and serve the production output locally
npx next build && npx next start -p 3011

# Status codes and redirects
curl -sI http://localhost:3011/about/            # 308 -> /about
curl -sI http://localhost:3011/paid-media.php     # 308 -> /services/media-buying
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3011/does-not-exist   # 404

# Head tags and robots
curl -s http://localhost:3011/services/seo | grep -oE '<link rel="canonical"[^>]*>|<meta property="og:[a-z:]+"[^>]*>'
curl -s http://localhost:3011/robots.txt
curl -s http://localhost:3011/sitemap.xml | grep -c "<loc>"

# Staging gate (build with the flag, then expect header + meta + Disallow: /)
SITE_NOINDEX=true npx next build && SITE_NOINDEX=true npx next start -p 3012
curl -sI http://localhost:3012/about | grep -i x-robots-tag
```

### 12.3 Post-launch (first 90 days)

- **Day 1–7:** confirm indexing of the sitemap, no unexpected `noindex`, check the Pages report for exclusions, review crawl stats.
- **Day 8–30:** compare impressions/clicks to the old site's baseline for legacy URLs; fix any redirect-related drops; start the prompt-test sheet.
- **Day 31–90:** extend AEO content (case-study intros, more questions from real queries), replace the stand-in `datePosted` values and add article publish dates, first KPI review and target-setting.

---

## 13. Backlog (consolidated)

Status key: **Done** = shipped and verified; **Open** = needs work; **Decision** = needs a business choice.

| # | Item | Layer | Status | Priority | Notes |
|---|---|---|---|---|---|
| 1 | Self-referencing canonicals, `metadataBase` | SEO | Done | P0 | §3.3 |
| 2 | robots.txt + sitemap + staging noindex gate | SEO | Done | P0 | §3.4–3.5 |
| 3 | OG/Twitter, icons, manifest, `en-IN` | SEO | Done | P1 | §3.7 |
| 4 | JSON-LD (Org, Breadcrumb, Service, LocalBusiness, JobPosting) | SEO | Done | P1 | §4 |
| 5 | Legacy 301 map | SEO | Done (known URLs) | P0 | Add backlink-bearing URLs not in the old sitemap |
| 6 | Server-rendered H1/content, carousels in HTML, preloader | SEO | Done | P0 | §3.1 |
| 7 | AVIF/WebP, width cap, leadership images via `next/image` | SEO | Done | P1 | §3.8 |
| 8 | Set production env vars | SEO | Open | P0 | §3.9 |
| 9 | Production host `https://www.firsteconomy.com` (live URL; currently the legacy PHP site): attach to new project at cutover with redirects live, bare domain → www, http → https, redirect `.in`/staging | SEO/GEO | Host confirmed; cutover open | P0 | §3.2 |
| 10 | Job `datePosted` (stand-in: date added to the site, 2026-08-27) / `validThrough` | SEO | **Done in code** — replace with real posting dates | P1 | §4.3 |
| 11 | Fix 12 short descriptions, 4 long titles (`seoDescription`/`seoTitle`) | SEO | **Done** | P1 | §5.5 |
| 12 | Contact H1: stable accessible name | SEO/A11y | **Done** (visible rotation kept; H1 has `aria-label="Let’s discuss your next move"`) | P2 | §5.5 |
| 13 | Per-case social image (1200×630 JPEG, 50–162 KB each, `public/images/og/cases/`) | SEO | **Done** | P2 | §3.7 |
| 14 | `lastmod` in sitemap (from git, `scripts/update-content-dates.mjs`) | SEO | **Done** — rerun the script each release | P2 | §3.5 |
| 15 | FAQ + `FAQPage` schema on the 10 service pages | AEO | **Built, hidden** (`FAQS_ENABLED = false`); copy needs team review | **P0** | §7.5 |
| 15b | FAQ on home (6 Q&As) and about (5 Q&As) with `FAQPage` markup | AEO | **Built, hidden**; question-led intros on case studies still open | P1 | §7.5 |
| 16 | Question-led headings / answer-first intros on case studies | AEO | Open | P1 | §5.1, §7.3 |
| 17 | Case-study `Article` (with `dateModified`) and `VideoObject` (9 films) schema | AEO/GEO | **Done** — article publish dates still unknown | P1 | §4.4 |
| 18 | AI-crawler policy in `robots.ts` (all named bots allowed); verify Cloudflare | GEO | **Done in code**; Cloudflare check still open | **P0** | §8.3 |
| 19 | Entity data: Organization enriched (description, address, contactPoint, numberOfEmployees from `stats.ts`, knowsAbout, award) and `WebSite` schema added; hub titles keyword-aware; "302+" now read from `stats.ts` | GEO | **Done in code**. Still open: role mailbox instead of `bilal@`, third-party profile cleanup, foundingDate (not in the content) | P1 | §2.2, §8.5 |
| 20 | Leadership bios, bylines, visible dates | GEO | Open | P1 | §8.5 |
| 21 | Prompt-test sheet + AI referral channel group | GEO | Open | P1 | §8.6–8.7 |
| 22 | `llms.txt` | GEO | **Done** (optional value) | P3 | §8.4 |
| 23 | Complete Bengaluru/Pune addresses; GBP ×4; richer LocalBusiness | Local | Open | P1 | §9 |
| 24 | GTM/GA4/Search Console/Bing/IndexNow | Measurement | Open | **P0** | §10.1 |
| 25 | Core Web Vitals baseline and fixes | SEO | Open | P1 | §6 |
| 26 | Client-logo `<img alt>` for image-search | SEO | Optional | P3 | §3.8 |
| 27 | Long-form "In depth" guide on each service page | AEO/SEO | **Built, hidden** (`SERVICE_GUIDES_ENABLED = false`); when on, pages are still shorter than peers (SEO ≈1,040 words; others 436–721) — deepen with reviewed content | P1 | §7.7 |
| 28 | Keyword-aware hub titles (About, Services, Work, Careers, Awards, Contact, Privacy) | SEO | **Done** | P1 | §3.6 |
| 29 | Home hero: no clipping on tall/4K screens; hero follows the site container | UX/SEO | **Done** | P2 | §6 |
| 30 | Insights hub; case-study question-led intros; fix third-party profiles and directory listings | SEO/GEO | Open | P1 | benchmark §6 |
| 31 | Rotating-word H1 on Contact still changes visually | SEO/A11y | Accepted (stable `aria-label`) | P3 | §5.5 |

---

## Appendix A — URL inventory (production build)

Generated from the production build of the current branch. Lengths are in characters; titles are shown as rendered (including the `| First Economy` suffix).

| # | URL | Title (chars) | Description (chars) | H1 | H2s | Schema types |
|---|---|---|---|---|---|---|
| 1 | `/` | First Economy — Integrated Digital Marketing Agency in India (60) | First Economy is an integrated digital marketing agency in India combining media buying, creative, technology, SEO, social, influencer marketing and AI. (152) | We don’t just connect the dots. We make them count. | 6 | Organization, WebSite |
| 2 | `/about` | About Us — Integrated Marketing Agency \| First Economy (54) | First Economy is an integrated marketing agency with 302 specialists across Mumbai, Bengaluru, Chhatrapati Sambhaji Nagar and Pune, building growth systems. (156) | We don’t just market brands. We build their next move. | 7 | Organization, WebSite, BreadcrumbList |
| 3 | `/services` | Integrated Marketing Services in India \| First Economy (54) | From strategy to execution — branding, performance marketing, creative, digital experience, e-commerce, social and analytics engineered as one growth system. (157) | Big challenges need more than one kind of thinking. | 5 | Organization, WebSite, BreadcrumbList |
| 4 | `/work` | Marketing Case Studies & Campaign Work \| First Economy (54) | Explore how we engineer growth systems that solve real business challenges and deliver measurable results. (106) | Our Work. | 2 | Organization, WebSite, BreadcrumbList |
| 5 | `/careers` | Careers in Digital Marketing & Technology \| First Economy (57) | Build your career at First Economy across media, creative, technology and data. Open roles in Mumbai, Bengaluru, Pune and Chhatrapati Sambhaji Nagar. (149) | Your next big move could start here. | 3 | Organization, WebSite, BreadcrumbList |
| 6 | `/awards` | Marketing & Media Awards and Recognition \| First Economy (56) | 225+ media awards across the First Economy network — recognized for creative excellence, innovation and measurable business impact. (131) | Recognized for impact. Driven by purpose. | 3 | Organization, WebSite, BreadcrumbList |
| 7 | `/contact` | Contact Our Marketing Agency in India \| First Economy (53) | Tell us about your challenge and First Economy’s experts will reply within 24 hours. Offices in Mumbai, Bengaluru, Chhatrapati Sambhaji Nagar and Pune. (151) | Let’s Discuss Media Buying | 3 | Organization, WebSite, LocalBusiness, BreadcrumbList |
| 8 | `/privacy-policy` | Privacy Policy — Data, Cookies & Your Rights \| First Economy (60) | How First Economy collects, uses and protects personal information when you visit our website, contact us, subscribe to updates or apply for a role. (148) | Privacy Policy | 11 | Organization, WebSite, BreadcrumbList |
| 9 | `/services/media-buying` | 360° Media Buying Agency in India \| First Economy (49) | Integrated media strategy across search, social, programmatic, OTT and hyperlocal OOH — planned as one system, not separate buys. (129) | 360° Media Buying. | 4 | Organization, WebSite, Service, BreadcrumbList |
| 10 | `/services/video-production` | Brand Film & Video Production in India \| First Economy (54) | Brand films, social video and campaign production — increasingly accelerated by AI-assisted workflows without losing craft. (123) | Video Production. | 4 | Organization, WebSite, Service, BreadcrumbList |
| 11 | `/services/branding` | Brand Strategy & Identity Agency in India \| First Economy (57) | Brand strategy and identity carried all the way through to physical, on-ground experience — not just a logo and a deck. (119) | Project Innovation & Branding. | 4 | Organization, WebSite, Service, BreadcrumbList |
| 12 | `/services/influencer-marketing` | Influencer Marketing Agency in India \| First Economy (52) | From celebrity collaborations to micro-creator networks, built for scale, authenticity and measurable amplification. (116) | Influencer Marketing. | 4 | Organization, WebSite, Service, BreadcrumbList |
| 13 | `/services/marketplace-management` | E-commerce Marketplace Management in India \| First Economy (58) | End-to-end management of brand presence on e-commerce marketplaces — listings, catalogue, store optimisation and promotion. (123) | Marketplace Management. | 3 | Organization, WebSite, Service, BreadcrumbList |
| 14 | `/services/technology` | Custom ERP & Platform Development in India \| First Economy (58) | Ground-up digital platforms, ERP builds and system integrations for businesses that have outgrown off-the-shelf software. (121) | Tech Solutions. | 4 | Organization, WebSite, Service, BreadcrumbList |
| 15 | `/services/creative` | Performance Creative Agency in India \| First Economy (52) | Campaign and performance creative across formats — from static and motion to retail and social-first storytelling. (114) | Creative Solutions. | 3 | Organization, WebSite, Service, BreadcrumbList |
| 16 | `/services/social-media` | Social Media Marketing Agency in India \| First Economy (54) | Always-on social media strategy, content and community management for B2B and B2C brands, built to compound brand presence over time. (133) | Social Media Management. | 4 | Organization, WebSite, Service, BreadcrumbList |
| 17 | `/services/seo` | SEO, AEO & GEO Services in India \| First Economy (48) | Technical, on-page and local SEO built for how search actually works now — including AI Overviews, AEO and GEO. (111) | SEO Solutions. | 4 | Organization, WebSite, Service, BreadcrumbList |
| 18 | `/services/ai-solutions` | AI Solutions for Marketing in India \| First Economy (51) | AI applied across creative production, analytics and search discoverability — a practical accelerator, not a buzzword. (118) | AI Solutions. | 4 | Organization, WebSite, Service, BreadcrumbList |
| 19 | `/work/fedex-csk` | FedEx — FedEx × Chennai Super Kings \| First Economy (51) | Turning the scale of the IPL into lasting FedEx brand recall across mass consumers and core business audiences. (111) | FedEx × Chennai Super Kings | 6 | Organization, WebSite, Article, VideoObject, BreadcrumbList |
| 20 | `/work/vip-industries` | VIP Industries — Visibility Into Visits \| First Economy (55) | Turning VIP Industries’ digital visibility into real-world impact, from online discovery to website visits and store footfalls. (127) | VIP Industries — Turning Visibility Into Visits | 6 | Organization, WebSite, Article, BreadcrumbList |
| 21 | `/work/godrej-blue` | Godrej Properties — Godrej Blue \| First Economy (47) | Making Godrej Blue the symbol of Godrej Properties grand arrival in Kolkata, with citywide top of mind recall. (110) | Godrej Properties — Godrej Blue | 5 | Organization, WebSite, Article, VideoObject, BreadcrumbList |
| 22 | `/work/mahindra-manulife` | Mahindra Manulife — Digital Reinvention \| First Economy (55) | How First Economy rebuilt web and mobile platforms from the ground up for Mahindra Manulife, a regulated asset-management business, under strict compliance. (156) | Mahindra Manulife — Ground-up Digital Reinvention | 6 | Organization, WebSite, Article, BreadcrumbList |
| 23 | `/work/orpat-erp` | Orpat — Manufacturing ERP Transformation \| First Economy (56) | First Economy built a manufacturing ERP for Orpat, joining raw material, production, quality, dispatch, sales, accounts and HR into one connected system. (153) | Orpat — Manufacturing ERP Transformation | 6 | Organization, WebSite, Article, BreadcrumbList |
| 24 | `/work/akbar-travels-seo` | Akbar Travels — SEO Growth \| First Economy (42) | Taking on travel giants and technical roadblocks to make a mark in one of the most competitive search spaces. (109) | Akbar Travels — SEO Growth | 6 | Organization, WebSite, Article, BreadcrumbList |
| 25 | `/work/jockey-seo` | Jockey — SEO & AI Search Growth \| First Economy (47) | Turning Jockey’s strong organic visibility into stronger traffic, engagement and revenue by improving rankings where clicks actually happen. (140) | Jockey — SEO & AI Search Growth | 6 | Organization, WebSite, Article, BreadcrumbList |
| 26 | `/work/cello-kidzbee` | Cello Kidzbee — Back to School \| First Economy (46) | Turning everyday school moments into colourful experiences with Cello Kidzbee’s Back to School campaign. (104) | Cello Kidzbee — Back to School | 4 | Organization, WebSite, Article, VideoObject, BreadcrumbList |
| 27 | `/work/ambassador-hotel` | The Ambassador Hotel — Brand Experience \| First Economy (55) | How First Economy gave The Ambassador Hotel a fresh brand experience, carrying its identity into physical spaces while keeping its original character intact. (157) | The Ambassador Hotel — Brand Experience | 6 | Organization, WebSite, Article, BreadcrumbList |
| 28 | `/work/godrej-greenfront` | Godrej Properties — The Greenfront \| First Economy (50) | How First Economy built The Greenfront campaign for Godrej Properties around the project’s natural surroundings, across outdoor and on-ground activation. (153) | Godrej Properties — The Greenfront | 5 | Organization, WebSite, Article, BreadcrumbList |
| 29 | `/work/amazon-samsung-great-indian-festival` | Amazon × Samsung: Great Indian Festival 2025 \| First Economy (60) | How First Economy positioned the Samsung Galaxy M36 5G as the best-value 5G phone under ₹15K with an influencer campaign for Amazon’s Great Indian Festival. (156) | Amazon × Samsung — Great Indian Festival 2025 | 5 | Organization, WebSite, Article, BreadcrumbList |
| 30 | `/work/adani-airports-safar-ke-humsafar` | Adani Airports — Safar Ke Humsafar \| First Economy (50) | Drive mass awareness by positioning Adani Airports as a human-centric, world-class gateway to modern India. (107) | Adani Airports — Safar Ke Humsafar | 6 | Organization, WebSite, Article, BreadcrumbList |
| 31 | `/work/waaree` | Waaree — Integrated B2B/B2C Social \| First Economy (50) | How First Economy strengthened Waaree’s brand presence across B2B and B2C audiences with integrated social communication around the clean energy story. (151) | Waaree — Integrated B2B/B2C Social | 7 | Organization, WebSite, Article, BreadcrumbList |
| 32 | `/work/ajanta-ai-creatives` | Ajanta — Ajanta Magic Moments \| First Economy (45) | How First Economy produced Ajanta Magic Moments, a premium fairy-led brand film made end to end with AI-assisted craft on an accelerated timeline. (146) | Ajanta Magic Moments | 4 | Organization, WebSite, Article, VideoObject, BreadcrumbList |
| 33 | `/work/royale-touche-stay-curious` | Royale Touché — #StayCurious \| First Economy (44) | How First Economy’s #StayCurious campaign drove footfall to Royalé Touché’s 200+ Experience Centres, with Reddit content earning citations in ChatGPT and LLMs. (159) | Royale Touché — #StayCurious | 7 | Organization, WebSite, Article, VideoObject, BreadcrumbList |
| 34 | `/careers/senior-performance-marketing-manager` | Senior Performance Marketing Manager \| First Economy (52) | Apply for the Senior Performance Marketing Manager role at First Economy in Mumbai, India. Full-time · Marketing. 5-8 Yrs. (122) | Senior Performance Marketing Manager | 9 | Organization, WebSite, JobPosting, BreadcrumbList |
| 35 | `/careers/creative-art-director` | Creative Art Director — Careers \| First Economy (47) | Apply for the Creative Art Director role at First Economy in Bengaluru. Full-time · Creative. 6-10 Yrs. Join First Economy’s integrated growth team. (148) | Creative Art Director | 9 | Organization, WebSite, JobPosting, BreadcrumbList |
| 36 | `/careers/video-editor` | Video Editor — Careers \| First Economy (38) | Apply for the Video Editor role at First Economy in Pune. Full-time · Creative. 2-4 Yrs. Join First Economy’s integrated growth team. (133) | Video Editor | 9 | Organization, WebSite, JobPosting, BreadcrumbList |
| 37 | `/careers/ai-data-analyst` | AI & Data Analyst — Careers \| First Economy (43) | Apply for the AI & Data Analyst role at First Economy in Mumbai. Full-time · Data & Technology. 3-5 Yrs. Join First Economy’s integrated growth team. (149) | AI & Data Analyst | 9 | Organization, WebSite, JobPosting, BreadcrumbList |
| 38 | `/careers/seo-specialist` | SEO Specialist — Careers \| First Economy (40) | Apply for the SEO Specialist role at First Economy in Bengaluru. Full-time · Marketing. 2-5 Yrs. Join First Economy’s integrated growth team. (141) | SEO Specialist | 9 | Organization, WebSite, JobPosting, BreadcrumbList |

⚠ = title over 60 characters, or description under 100 characters (see §5.5). `Organization` and `WebSite` are emitted sitewide by `(site)/layout.tsx`; the other types are page-level.

## Appendix B — Code map

| Concern | File(s) |
|---|---|
| Site origin, noindex flag, schema builders | `src/lib/seo.ts`, `src/lib/site-url.ts` |
| JSON-LD component | `src/components/JsonLd.tsx` |
| Root metadata, viewport, `lang`, preloader flag script | `src/app/layout.tsx` |
| Robots / sitemap / manifest | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/manifest.ts` |
| Redirects, image formats, staging header | `next.config.ts` |
| Breadcrumb schema | `src/components/PageHero.tsx` |
| Service / LocalBusiness / JobPosting schema wiring | `src/app/(site)/services/[slug]/page.tsx`, `services/media-buying/page.tsx`, `contact/page.tsx`, `careers/[slug]/page.tsx` |
| Case-study titles, H1, related work | `src/app/(site)/work/[slug]/page.tsx`, `src/components/work/WorkDetailPage.tsx`, `src/content/workDetail.ts` |
| Work filters and card tags | `src/content/workPage.ts`, `src/components/work/WorkCaseBrowser.tsx` |
| Entity facts | `src/content/stats.ts`, `src/content/site.ts`, `src/content/offices.ts` |
| Conversion event | `src/lib/analytics.ts` (`trackEvent("generate_lead", …)`) |
| Env documentation | `.env.example` |
| AI-crawler policy | `src/app/robots.ts` (`AI_BOTS_*` lists) |
| `llms.txt` | `src/app/llms.txt/route.ts` |
| Sitemap dates | `scripts/update-content-dates.mjs` → `src/content/contentDates.ts` → `src/app/sitemap.ts`, Article `dateModified`, VideoObject `uploadDate` |
| Case-study share images | `public/images/og/cases/*.jpg`, `shareImage()` in `src/app/(site)/work/[slug]/page.tsx` |
| Schema builders (Organization, WebSite, Article, VideoObject, FAQPage, JobPosting) | `src/lib/seo.ts` |
| Service guides | `src/content/servicePages/guides.ts`, `src/components/services/ServiceGuide.tsx` |
| FAQs and the switch | `src/content/servicePages/faqs.ts`, `src/content/siteFaqs.ts`, `src/components/FaqSection.tsx`, `src/content/features.ts` |
| Titles/descriptions overrides | `seoTitle`/`seoDescription` on `CaseStudy` (`src/content/types.ts`) and `ServicePageContent` (`servicePages/types.ts`) |
| Hero layout | `src/styles/growth-system.css` (`--hero-h`, container width, title size) |
| Launch verification | `scripts/verify-launch.mjs` |

## Appendix C — Glossary

- **SEO** — optimizing to rank in search results. **AEO** — optimizing to be the extracted answer (snippets, PAA, voice, AI answers). **GEO** — optimizing to be retrieved, cited and accurately described by generative AI systems.
- **Entity** — a uniquely identifiable thing (the brand, a person, an office) that engines model independently of any one page.
- **E-E-A-T** — Experience, Expertise, Authoritativeness, Trustworthiness; Google's quality framework.
- **NAP** — Name, Address, Phone; must match everywhere for local SEO.
- **`sameAs`** — schema property linking an entity to its other official profiles.
- **IndexNow** — protocol to notify participating engines (including Bing) of changed URLs.
- **CrUX** — Chrome User Experience Report; real-user Core Web Vitals data.
