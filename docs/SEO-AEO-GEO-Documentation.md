# First Economy Website — SEO, AEO & GEO: Status Report

| | |
|---|---|
| **Prepared** | 7 October 2026 |
| **Covers** | The new First Economy website (built, tested, not yet live on the main domain) |
| **In one line** | The search foundation is built and tested. What remains is going live, a few decisions and facts we need from you, and the next phase of content. |

**What the three terms mean.** **SEO** gets the website to rank in search results. **AEO** (answer engine optimisation) shapes content so search features and assistants can lift a direct answer from it. **GEO** (generative engine optimisation) helps AI tools such as ChatGPT, Gemini and Perplexity find, cite and describe First Economy correctly.

---

## 1. Where things stand

| Area | Status |
|---|---|
| **SEO — site foundations** | **Done and tested.** All 38 pages are readable by search engines, with clean titles, descriptions, links to the old site and a sitemap. |
| **SEO — content depth** | **Written, switched off.** Each service page has a new in-depth guide ready, hidden for now. The pages themselves are still shorter than competitors' (see section 3). |
| **AEO — answers** | **Written, switched off.** 61 question-and-answer blocks are ready and waiting for your review. |
| **GEO — AI visibility** | **Done in the website; outside work remains.** AI tools are allowed in, and brand facts are consistent on the site. Listings and profiles elsewhere on the web still need fixing. |
| **Going live** | **Not started.** The main address (www.firsteconomy.com) still shows the old website. |
| **Measuring results** | **Partly done.** The new site reuses the tracking already running on the live website (Tag Manager and the Google Search Console ownership tag). It starts collecting data as soon as the site goes live; a few settings inside your Tag Manager still need checking. |

---

## 2. What we have done

### Search foundations (SEO)
- **Every page is easy for search engines to read.** Content is delivered with the page rather than loaded afterwards, and each page has one clear main heading and its own address.
- **Page titles and descriptions rewritten for all 38 pages.** Each is unique and within the lengths search results display. The home page now reads "First Economy — Integrated Digital Marketing Agency in India", and service pages carry their service and market, for example "SEO, AEO & GEO Services in India". We fixed 12 descriptions that were too short and 4 titles that were too long.
- **The old website's links are protected.** 28 old addresses (the old .php pages and removed sections) now send visitors and search engines to the right new pages. All were tested.
- **A sitemap lists all 38 pages with accurate last-updated dates**, and search engines are told which areas to ignore (admin and technical areas).
- **Test versions can't appear in Google.** Anything that isn't the live site is automatically hidden from search.
- **Link previews look right.** Each of the 15 case studies has its own preview image for WhatsApp, LinkedIn and similar, and the site has proper icons and sharing cards.
- **Faster, lighter pages.** Images are compressed in modern formats, and the loading animation now shows once per visit instead of every time.
- **Large screens fixed.** The home page graphic no longer gets cropped on big (2560 and 4K) monitors, and the page now lines up with the rest of the site.

### Information that helps search engines and AI (structured data)
- **Company details** are now published in a form machines can read: description, head office, team size, services, and the Guinness World Record.
- **Page-level details** for services, offices, job openings (now with posting dates), case studies, and 9 case-study films.
- **Brand facts are consistent.** The team size is now pulled from one place on the site, and contact emails use one domain (firsteconomy.com).

### Answer-ready content (AEO)
- **An "In depth" guide written for each of the 10 service pages**, in plain question-and-answer form (for example "What is 360° media buying?" and "How is success measured?"). They use only claims already on your site, with no prices, timelines or guarantees. They are **switched off for now**, as requested, and can be turned on after review.
- **61 FAQ answers written** for the service pages, the home page and the About page. They are **switched off for now**, as requested, and can be turned on once you have reviewed them.

### AI visibility (GEO)
- **AI tools are welcome.** ChatGPT, Perplexity, Claude and Google's AI systems are all explicitly allowed to read the site. Allowing them to use content for model training is a choice you may change.
- **A machine-readable site summary** (an `llms.txt` file) lists your services and case studies for AI tools. Its benefit is not guaranteed; no major AI product has committed to using it.

### Quality checks
- **665 automated checks passed** on the finished site: pages, headings, redirects, search tags, sitemap, AI rules and test-mode protection.
- **A competitor comparison** against seven Indian agencies was completed (separate report).
- **A re-runnable launch test** is ready to run on the live domain right after go-live.

---

## 3. What is pending

### A. Needed from you (decisions and information)

| # | What we need | Why it matters |
|---|---|---|
| 1 | **Approval to go live**: connect www.firsteconomy.com to the new site. | This replaces the old website, so it needs your sign-off and a planned moment. |
| 2 | **The `/proposal/` folder (confirmed in use): please send us the folder as it is on the old server**, and tell us whether the links are single files (for example `/proposal/name.html`) or folders (`/proposal/name/`). | The website is ready to serve the files unchanged and keep them out of search, as the old site did. We only need the files. If the pages link to other old-site folders such as `/img/` or `/css/`, we need those too, or they will appear broken. |
| 3 | **Review and approve the written content**: the 61 FAQ answers and the 10 service guides. | We wrote them from your own site, but someone who knows the services should confirm accuracy and tone before they go public. |
| 3b | **Decide when to show the hidden items**: the FAQ answers and the service guides (both switched off), and the small tag labels (Branding, OOH, Influencer, Print) on case-study pages (hidden at your request). | Each can be switched back on with a one-line change once you are ready. |
| 4 | **Real posting dates for the 5 job roles**, and closing dates where they exist. | Today they show the date each role was added to the site (27 Aug 2026), which may not be accurate. |
| 5 | **A shared inbox for public use** (such as hello@) in place of a named person's address. Please also confirm hello@ and careers@ firsteconomy.com exist and receive email. | The company's public details currently show one person's email. |
| 6 | **Full Bengaluru and Pune street addresses with pincodes.** | They are incomplete, which weakens local search. |
| 7 | **Confirm the AI-training choice.** | We currently allow AI companies to use site content for training. This is easy to reverse. |
| 8 | **Optional facts:** founding date, and publication dates of the case-study campaigns. | They would add credibility signals. |

### B. Launch and hosting (done together)
- **Connect the live domain** and add the remaining hosting settings (database, email and admin settings are not set up yet for the new site).
- **Set the web address rules**: the version without "www" and the older address (firsteconomy.in) should redirect to www.firsteconomy.com, and http should redirect to https.
- **Check the Cloudflare setting** that can block AI tools by default, so the permissions above actually take effect.
- **Run the launch test on the live domain** right after go-live.
- **Place the proposal folder** into the new site exactly as it is (it is then served unchanged, hidden from search), and confirm a few real client links open correctly before go-live.
- **Collect any other old addresses that have links pointing at them** (a link report from Google Search Console or a tool such as Ahrefs will show them), so we can redirect them too.

### C. Tracking and accounts
- **Already carried over from the live site:** the Google Tag Manager container (`GTM-THFF9GV`) and the Search Console ownership tag. Because the domain is the same, your existing Tag Manager, Analytics and Search Console accounts keep working and keep their history. Tracking switches on automatically when the site is served from www.firsteconomy.com (or firsteconomy.com), and never on test versions, local copies or the admin area.
- **To confirm in Tag Manager (one short session):** that the container's Google Analytics tag still fires on the new pages, including when a visitor moves between pages without a full reload; and that a tag listens for the new `generate_lead` event so contact and job-application forms are counted as conversions.
- **To confirm in Search Console:** that the existing verified property still shows as verified after go-live, then submit the new sitemap.
- **Bing Webmaster Tools**, with the sitemap submitted.
- **Cookie notice.** The live site shows none, and the new site matches it. Please confirm that is acceptable for your legal position.
- **Google Business Profiles for the four offices.**
- **First speed and mobile measurements** on the live site (these have not been taken yet).

### D. Recommended next phase (not started)
1. **Deepen the service pages.** The SEO/AEO/GEO page now has about 1,040 words, against 1,200–4,700 on competitors' comparable pages. The other nine have 436–721. Closing this gap needs more reviewed content, not padding.
2. **Add questions-and-answers openings to case studies** and show their dates.
3. **Fix how First Economy appears elsewhere.** Qoruz, CB Insights and a jobs board list the wrong offices ("Mumbai, Bangalore, Hyderabad and Udaipur"), which confuses AI answers. Also list the company on agency directories (Clutch, DesignRush, GoodFirms).
4. **Leadership profiles** with credentials, which strengthen trust signals.
5. **Monthly AI visibility checks**: ask ChatGPT, Gemini, Perplexity and others the questions customers ask, and record whether First Economy is named and described correctly.
6. **City pages for the four offices**, only if there is real local content for each.
7. **Smaller items:** send a "gone" signal for closed job pages, and check the mobile layout at more screen sizes.

### E. What we cannot know yet
Rankings, website traffic, links from other sites, and page speed compared with competitors cannot be measured until the site is live and the accounts in section C are connected. A baseline after the first four to eight weeks will show where to focus.

---

## 4. Summary of the work ahead

| Who | Next steps |
|---|---|
| **You** | Sign off go-live; answer the `/proposal/` question; review the FAQ and guide copy; supply job dates, a shared inbox and the two missing addresses |
| **Together** | Connect the domain, redirect rules, hosting settings, the Cloudflare check, and the live launch test |
| **After launch** | Search and analytics accounts, business profiles, first measurements |
| **Next phase** | Deeper service pages, fixing profiles elsewhere, monthly AI checks |

*Technical detail for the development team is in `SEO-AEO-GEO-Technical-Reference.md`; the competitor comparison is in `SEO-Competitive-Benchmark.md`.*
