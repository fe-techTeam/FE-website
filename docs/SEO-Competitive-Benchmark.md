# First Economy — SEO / AEO / GEO Benchmark vs Peer Agencies

| | |
|---|---|
| **Run date** | 6 Oct 2026 |
| **What was compared** | The new First Economy site (local production build) and the live legacy site vs seven Indian agencies |
| **Method** | Read-only fetches of each site's public HTML: home page, `robots.txt`, `sitemap.xml`, `llms.txt`, and one SEO-service page. Plus web searches to see who ranks for the core terms. Script: `bench.mjs` (not committed; ask if you want it in `scripts/`). |
| **Companion** | [SEO-AEO-GEO-Documentation.md](SEO-AEO-GEO-Documentation.md) |

## Status of the gaps (updated after the build-out, commit `ea72e2d`)

The comparison below was taken **before** these changes; the table shows where each gap stands now.

| # | Gap found in the benchmark | Status now |
|---|---|---|
| 1 | Home title had no category or location words | **Closed** — `First Economy — Integrated Digital Marketing Agency in India` (60 chars) plus a matching description |
| 2 | Service pages thin | **Partly closed** — each service page has a long-form guide; the SEO page is ≈1,040 words (was ≈550) against peers' 1,200–4,700, and the other nine are 436–721. More reviewed content is still needed |
| 3 | No content hub | **Open** — `/insights` still redirects to the home page |
| 4 | Third-party profiles show the wrong offices | **Open** — outside the site (Qoruz, CB Insights, jobs boards, LinkedIn) |
| 5 | Minimal entity schema | **Closed** — Organization enriched, `WebSite` added; `Person` and `foundingDate` still open |
| 6 | No city/location pages | **Open** — deliberately not built without real local content |
| 7 | Not in agency directories | **Open** — Clutch, DesignRush, GoodFirms, Sortlist, Google Business Profiles |
| 8 | No AI-bot policy or `llms.txt` | **Closed** — explicit allow-all policy in `robots.ts`; `/llms.txt` served |
| — | Hub titles had no keywords | **Closed** — About, Services, Work, Careers, Awards, Contact, Privacy |
| — | FAQs | **Built but hidden** (`FAQS_ENABLED = false`) |

## 0. Read this first — what this benchmark can and cannot say

**It can say:** how each site is *built* (titles, headings, schema, FAQ, bot policy, sitemap size, content depth) and what the SERP landscape looks like.

**It cannot say:** who gets more traffic, ranks higher, or has more backlinks. That needs Search Console, Semrush/Ahrefs, and real-user speed data. None of those were available here.

Other limits:
- **PageSpeed / Core Web Vitals:** Google's free API quota was exhausted (HTTP 429), so there is **no speed comparison**. The new site isn't public yet either.
- **Sitemap counts for large sites are lower bounds.** Only the first six child sitemaps were read.
- **Service-page samples are not like-for-like.** I picked the shortest non-blog `/…seo…` URL per site. Schbang and WATConsult had no SEO service page in their sitemaps, so they're excluded from the page-level table.
- **Unreachable sites, dropped:** Kinnect (TLS certificate mismatch), dentsu Webchutney (domain not found), Interactive Avenues (expired certificate).
- **Peer choice is mine.** I picked agencies that appeared in "top agencies in India" results or in AEO/GEO searches. Say if you want a different set (for example global network agencies, or Local Planet partners).

## 1. The peer set

| Agency | Why included | Type |
|---|---|---|
| Schbang | Appears in top-agency lists; Mumbai integrated creative/media/tech | Integrated (closest in positioning) |
| DigiChefs | Mumbai full-service, ranks in category lists | Performance / SEO-led |
| ROI Minds | Top result for "top integrated digital marketing agencies in India" | Performance, AI-first positioning |
| Techmagnate | "Best SEO company in India", strong SEO-content engine | SEO specialist |
| OneCity | Bangalore, markets itself as an AEO/GEO agency | GEO/AEO specialist |
| Social Panga | Delhi creative/social agency | Social-first |
| WATConsult | Mumbai digital agency, "globally awarded" | Integrated / creative |

## 2. Scorecard — home pages

| | **First Economy (new)** | First Economy (live legacy) | Schbang | DigiChefs | ROI Minds | Techmagnate | OneCity | Social Panga | WATConsult |
|---|---|---|---|---|---|---|---|---|---|
| Title | `First Economy — Growth Systems` (30) | `First Economy - Digital Marketing Agency in India` (49) | `Schbang: Creative + Media + Technology Agency` (45) | `Digital Marketing Agency & Company in Andheri, Mumbai \| DigiChefs` (65) | `Digital Marketing Agency India \| ROI Minds` (42) | `Best SEO Company in India - Techmagnate` (39) | `OneCity – SEO & AI Marketing Agency in Bangalore \| Since 2006` (61) | `Social Panga: Best Digital Marketing Agency in India` (52) | `WATConsult: Globally Awarded Digital Marketing Agency in India` (62) |
| Category/geo keyword in title | **No** | Yes | Yes (category) | Yes (category + city) | Yes | Yes | Yes | Yes | Yes |
| H1s on home | **1** | 17 | 10 | 1 | **0** | 1 | 1 | 1 | 8 |
| Words in HTML (home) | 794 | 242 | 2,206 | 5,217 | 3,861 | 5,559 | 3,190 | 701 | 643 |
| Home schema | Organization | none parseable | Organization (+1 invalid) | WebSite, Organization, LocalBusiness, Breadcrumb | ProfessionalService, Organization, WebSite, **FAQPage** | Corporation, LocalBusiness, Breadcrumb | Organization, ProfessionalService, Service, WebSite, Person, **FAQPage** | Person, Organization, WebSite, Article | WebSite, WebPage, Breadcrumb |
| `lang` | `en-IN` | `en` | `en` | missing | `en-US` | `en-US` | `en` | `en-US` | `en` |
| Social card (OG image) | Yes | **No** | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| `robots.txt` AI-bot rules | None | None | None | None | None | Explicit, all allowed | Explicit, blocks only `CCBot` | None | None |
| `llms.txt` | No | No | No | **Yes** | **Yes** | **Yes** | No | No | No |
| Sitemap URLs (lower bound) | 38 | 12 | 322 | 477 | 593 | 518+ | 149 | 135+ | 75+ |
| Blog URLs seen in sitemap sample | **0** | 0 | 2 | 1 | 2 | **282** | 4 | 1 | 1 |
| Case-study URLs | **15** | 0 | 99 | 2 | 1 | 2 | 2 | 118 | 1 |

## 3. Scorecard — SEO-service pages (comparable pages only)

| Agency | Page | Words | H2s | FAQPage schema | Other schema |
|---|---|---|---|---|---|
| **First Economy (new)** | `/services/seo` | **550** | 4 | **Yes (5 Q&As)** | Service, Breadcrumb, Organization |
| DigiChefs | `/seo-consultants/` | 4,734 | 27 | Yes | WebPage, Breadcrumb, Organization |
| Techmagnate | `/ai-seo-services/` | 3,662 | 14 | Yes | Service, Breadcrumb, Organization |
| OneCity | `/seo-pricing-india` | 1,528 | 10 | Yes | Service, Breadcrumb |
| ROI Minds | `/seo-portfolio/` | 1,182 | 0 | No | Breadcrumb |
| Social Panga | `/seo-company-delhi/` | 512 | 1 | No | Person, Organization, Article |

*Word counts are the full page text including header and footer, so they overstate the main content for every site by a similar amount.*

## 4. Where First Economy stands

### Ahead of the peer set
1. **Clean page structure.** One H1 per page. Schbang has 10 on the home page, WATConsult 8, the legacy site 17, ROI Minds none.
2. **Server-rendered content and sound technical hygiene:** self-referencing canonicals everywhere, a staging noindex gate, `en-IN` language, consistent Open Graph and Twitter cards, a 38-URL sitemap with no junk URLs, tested redirects.
3. **FAQPage schema with visible, matching Q&As** on all 10 service pages. Of the peers, only DigiChefs, ROI Minds, OneCity and Techmagnate use it.
4. **Breadcrumb schema** on every inner page (including the Privacy Policy), as most peers do.
5. **Proof assets.** 15 case studies with specific results (Akbar Travels, Jockey 80/100 AI visibility, Royale Touché cited in ChatGPT, the Godrej Guinness record). Only Schbang (99) and Social Panga (118) list more case URLs in their sitemaps. I did not see comparable AI-visibility results on the home and SEO pages I sampled from the AEO/GEO specialists, but I read only one or two pages per site, so treat that as an observation, not a finding.

### Level with peers
- **Basics every site has:** mobile viewport, a home-page `<title>`, a meta description, Open Graph/Twitter cards (except the legacy site) and HTTPS in production. Not every peer has the rest: **Schbang's home page has no canonical tag** and **DigiChefs has no `lang` attribute**; we have both, on every page.

### Behind the peers — in order of impact
| # | Gap | Evidence | Why it matters |
|---|---|---|---|
| 1 | **The home title has no category or location words.** | `First Economy — Growth Systems` vs every peer using "Digital Marketing Agency in India/Mumbai", "SEO Company in India", etc. **The legacy site already had `Digital Marketing Agency in India`**, so cutover would drop the one category phrase the domain currently carries. | The title is the strongest on-page signal and the headline users see in results. Brand-only titles rank for the brand and little else. |
| 2 | **Service pages are thin.** | `/services/seo` has ~550 words; the comparable peer SEO pages run 1,200–4,700 words with 10–27 sections. | Pages that compete for "SEO agency in India" are expected to cover the topic in depth: process, deliverables, tools, pricing factors, FAQs, proof. |
| 3 | **No content hub.** | 0 blog/insight URLs. The `/insights` section was removed and redirects to the home page. Techmagnate has 282+ blog URLs, others have dozens. | An agency that sells SEO/GEO and publishes no expertise is hard to cite or link to. This is the main source of long-tail traffic and AI citations for every peer in this set. |
| 4 | **Third-party profiles disagree with the site.** | Search results show Qoruz, CB Insights and a jobs board describing First Economy as based in "Mumbai, Bangalore, Hyderabad and Udaipur". The site says Mumbai, Bengaluru, Chhatrapati Sambhaji Nagar, Pune. | Generative engines assemble the brand from these profiles. Contradictions produce wrong answers about where you operate. |
| 5 | **Entity schema is minimal.** | Home has `Organization` only. Peers add `WebSite`, `ProfessionalService`, `LocalBusiness`, `Person`. | Weaker brand/knowledge-panel signals and no author trust signals. |
| 6 | **No location pages.** | Peers have city-targeted pages ("SEO company Delhi", "Andheri Mumbai"). We have offices on `/contact` only. | Lost local queries for four office cities. Caveat in §6: thin city pages are a known risk. |
| 7 | **Not present in agency directories.** | The category searches return directory pages (Semrush partners, DesignRush, GoodFirms, Clutch) and "top agencies" listicles. First Economy did not appear in the results I saw. | These pages are what answer engines cite for "best agency" questions. |
| 8 | **Bot policy and `llms.txt`.** | Techmagnate declares an explicit AI-bot policy; three peers publish `llms.txt`. | Low effect on its own (see §6), but cheap and visible to a reviewer. |

### Unknown — needs paid or private data
Rankings, organic traffic, share of voice, backlink profile, Core Web Vitals, and whether any peer is actually cited in ChatGPT/Perplexity for the target prompts. See §7.

## 5. The search landscape (from the queries run)

- **"Top integrated digital marketing agencies in India"** returns agency-published listicles (ROI Minds, DigiChefs), directories (Semrush, DesignRush) and a blog list. Named agencies: ROI Minds, dentsu Webchutney, SEO Discovery, DigiChefs, Schbang, Kinnect. First Economy was not among them.
- **"SEO AEO GEO agency India"** is dominated by **small specialists and directories**: GEOwallah (Clutch), OneCity ("Bangalore's first GEO + AEO agency"), Billion Game, RAYSolute, plus a Texta.ai "top 10 GEO agencies" roundup. The category is young and **not yet owned by an integrated agency**, which is the opening for First Economy. You also have measured proof (Jockey 80/100 AI visibility, Royale Touché cited in ChatGPT) to build on; I did not check whether the specialists publish equivalent case metrics elsewhere.
- **The Godrej Guinness record** is reported by third parties (Realty Today and others: 1,000+ influencers posting within one hour for Godrej Ivara). The coverage I saw doesn't name First Economy as the agency, so **there's no independent source linking the record to First Economy**. Getting one (a press mention, the client's case page, the Guinness page) would back up a claim the site already makes.
- **First Economy's third-party footprint** today: Qoruz, CB Insights, afaqs and Agency Reporter news items (Page Industries digital mandate for Jockey and Speedo), and job-board listings.

## 6. Rationalised recommendations

### What to copy
| Action | Detail | Effort |
|---|---|---|
| **A. Keyword-aware home title and description — DONE** | Title ≈ `First Economy — Integrated Digital Marketing Agency in India` (60 chars). Keep the brand first. Rewrite the description to name the services and "India". The H1 can stay as the brand line, since the title and intro carry the keywords. | S |
| **B. Service-page titles that name the service and market — DONE (10 pages)** | e.g. `SEO, AEO & GEO Services in India`, `Influencer Marketing Agency in India`, `360° Media Buying Agency in India` (each plus the ` \| First Economy` suffix, all under 60). Keep the brand's own names (`360° Media Buying`) in the H1. | S |
| **C. Deepen the 10 service pages** | Target ~1,200–1,800 words of *useful* content each (approach, deliverables, tools, who it's for, engagement model, proof, FAQs), not padding. Start with SEO/AEO/GEO, AI Solutions, Media Buying, Influencer. | M–L |
| **D. Launch a small insights hub** | 8–12 genuinely expert pieces first (e.g. "SEO vs AEO vs GEO", the Jockey and Akbar Travels playbooks, Reddit → LLM citations from Royale Touché), each with a named author and date, `Article` schema, and links to the service pages. Replace the `/insights → /` redirect once there's content. | L |
| **E. Fix the entity footprint** | One 50-word boilerplate; update Qoruz, CB Insights, LinkedIn, afaqs profiles; claim Google Business Profiles (×4); list on Clutch, DesignRush, GoodFirms, Sortlist; submit to the "top agencies" roundups. | M |
| **F. Schema upgrade** | Add `WebSite`, richer `Organization` (description, founding date, address, `contactPoint`, `knowsAbout`, `sameAs` incl. directory profiles), `Person` for leadership, `Article` for case studies and posts. | M |
| **G. AI-bot policy and `llms.txt`** | Decide and write explicit rules (§8.3 of the main doc); `llms.txt` is optional, no engine has committed to using it. | S |

### What *not* to copy
- **Multiple H1s** (Schbang 10, WATConsult 8, the legacy site 17) and a **missing H1** (ROI Minds). Our one-H1 structure is an advantage.
- **Keyword-stuffed titles and "Best X" claims.** "Best SEO Company in India" style titles are unprovable superlatives and read as spam. Use "…Agency in India", not "Best…".
- **Thin, templated city pages** ("SEO company {city}") for cities with no real office or local proof. If you build location pages, do it only for the four real offices (Mumbai, Bengaluru, Chhatrapati Sambhaji Nagar, Pune) with unique content, and address/phone/GBP details that match.
- **5,000-word pages as a goal.** Length only helps if every section answers something. Match depth to the query.
- **Blocking AI crawlers** (OneCity blocks `CCBot`; some publishers block everything). For a services business that wants to be *recommended* by AI tools, the search/retrieval bots should stay allowed.
- **Missing or mismatched `lang`/social metadata** that some peers have; we already do better.

### Launch risk — resolved
The live site's title carried **"Digital Marketing Agency in India"**. The new home title is now `First Economy — Integrated Digital Marketing Agency in India` (60 chars) and its description names the category and market, so the cutover keeps that phrase. Service pages now carry titles such as `SEO, AEO & GEO Services in India`, `Influencer Marketing Agency in India` and `360° Media Buying Agency in India`. Still unchanged: the hub titles (`Services`, `Work`, `About Us`, `Careers`), which have no keyword.

## 7. How to finish this benchmark properly (needs access/tools)

1. **Rankings and traffic:** connect Search Console for the live domain, then compare against the peers in Semrush or Ahrefs (organic keywords, estimated traffic, referring domains) for: `digital marketing agency in India`, `SEO agency in India`, `influencer marketing agency India`, `AEO agency India`, `GEO agency India`, and the four office-city variants.
2. **Speed / Core Web Vitals:** PageSpeed Insights with an API key (the free quota ran out), plus CrUX for each peer. Test the new site on its preview URL.
3. **AI visibility:** run the prompt sheet from §8.6 of the main doc across ChatGPT, Gemini, Perplexity, Copilot and Claude. Record whether First Economy and each peer is named, and which sources are cited.
4. **Backlinks:** export referring domains for the live domain and the peers to find the directories and publications you are missing.
5. **Re-run this crawl quarterly** to track whether the peers add FAQs, `llms.txt` or bot policies.

## Sources (web searches, 6 Oct 2026)
- Top-agency results: [ROI Minds list](https://roiminds.com/top-digital-marketing-agencies-in-india/), [DigiChefs list](https://digichefs.com/top-25-digital-marketing-agencies-india-2025/), [Semrush agency partners](https://agencies.semrush.com/list/small-business/india/?page=2)
- GEO/AEO specialists: [GEOwallah on Clutch](https://clutch.co/profile/geowallah), [OneCity](https://onecity.co.in/), [Texta.ai GEO roundup](https://www.texta.ai/blog/top-10-geo-agencies-in-india-2026-complete-guide), [Billion Game](https://www.goodfirms.co/company/billion-game)
- Godrej record: [Realty Today](https://therealtytoday.com/news/news/when-1000-influencers-posted-at-once-how-godrej-created-a-guinness-world-record-and-a-viral-real-estate-moment/)
- First Economy third-party profiles: [Qoruz](https://qoruz.com/agencies/profile/first-economy), [CB Insights](https://www.cbinsights.com/company/first-economy), [afaqs](https://afaqs.com/news/advertising/first-economy-wins-digital-media-mandate-for-page-industries-e-commerce-businesses-in-india)
