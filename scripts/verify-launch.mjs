// Usage: node verify-launch.mjs <baseUrl> <expectedOrigin> [--staging]
// baseUrl: where to send requests (e.g. http://localhost:3011); expectedOrigin: what canonicals/sitemap must say.
const [base, origin, flag] = process.argv.slice(2);
const staging = flag === "--staging";
let pass = 0, fail = 0;
const failures = [];
const ok = (cond, msg) => { if (cond) pass++; else { fail++; failures.push(msg); } };
const get = (p, opts = {}) => fetch(base + p, { redirect: "manual", ...opts });
const text = async (p) => { const r = await get(p); return [r, await r.text()]; };

// ---------- 1. Legacy redirects: single hop, correct target, final 200 ----------
const redirects = {
  "/our-work.php": "/work", "/career.php": "/careers", "/contact-us.php": "/contact", "/about-us.php": "/about",
  "/paid-media.php": "/services/media-buying", "/social-network.php": "/services/social-media",
  "/branding.php": "/services/branding", "/videography.php": "/services/video-production",
  "/technology.php": "/services/technology", "/online-store.php": "/services/marketplace-management",
  "/business-solution.php": "/services", "/business-solutions.php": "/services", "/index.php": "/", "/works.php": "/work",
  "/our-advantage": "/services", "/capabilities": "/services", "/terms": "/privacy-policy",
  "/insights": "/", "/insights/x": "/", "/clients": "/about#trusted-by", "/leadership": "/about#team",
  "/locations/mumbai": "/contact#offices", "/industries": "/work", "/industries/retail": "/work",
  "/about/": "/about", "/services/seo/": "/services/seo",
  "/OUR-WORK.PHP": "/work", "/our-work.php?utm_source=t": "/work?utm_source=t",
};
for (const [from, to] of Object.entries(redirects)) {
  const r = await get(from);
  const loc = r.headers.get("location") || "";
  const path = loc.replace(base, "");
  ok([301, 308].includes(r.status), `redirect ${from}: status ${r.status}, want 301/308`);
  ok(path === to, `redirect ${from}: -> "${path}", want "${to}"`);
  const finalPath = to.split("#")[0];
  const f = await get(finalPath);
  ok(f.status === 200, `redirect target ${finalPath} (from ${from}): status ${f.status}`);
}

// ---------- 2. Sitemap URLs ----------
const [smRes, sm] = await text("/sitemap.xml");
ok(smRes.status === 200, "sitemap.xml status " + smRes.status);
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const lastmods = [...sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
if (!staging) {
  ok(lastmods.length === locs.length, `sitemap: ${lastmods.length} lastmod for ${locs.length} URLs`);
  ok(lastmods.every((d) => /^\d{4}-\d{2}-\d{2}/.test(d) && new Date(d) <= new Date(Date.now() + 864e5)), "sitemap: a lastmod is malformed or in the future");
}
if (staging) ok(locs.length === 0, `staging sitemap should be empty, has ${locs.length}`);
else {
  ok(locs.length === 38, `sitemap has ${locs.length} URLs, want 38`);
  ok(locs.every((l) => l.startsWith(origin + "/") || l === origin), "sitemap contains URLs not on " + origin);
  ok(new Set(locs).size === locs.length, "sitemap has duplicate URLs");
}
const pick = (html, re) => (html.match(re) || [])[1];
const decode = (s = "") => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const seenDesc = new Map();
for (const loc of locs) {
  const path = loc.replace(origin, "") || "/";
  const [r, html] = await text(path);
  ok(r.status === 200, `${path}: status ${r.status}`);
  if (r.status !== 200) continue;
  ok(!r.headers.get("x-robots-tag"), `${path}: unexpected X-Robots-Tag ${r.headers.get("x-robots-tag")}`);
  ok(!/<meta name="robots"[^>]*noindex/i.test(html), `${path}: noindex meta present`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  ok(h1s === 1, `${path}: ${h1s} H1s`);
  const canon = pick(html, /<link rel="canonical" href="([^"]+)"/);
  ok(canon === loc || canon === loc.replace(/\/$/, ""), `${path}: canonical ${canon}, want ${loc}`);
  const title = decode(pick(html, /<title>([^<]*)<\/title>/));
  const desc = decode(pick(html, /<meta name="description" content="([^"]*)"/));
  ok(!!title && !!desc, `${path}: missing title/description`);
  if (desc) {
    ok(!seenDesc.has(desc), `${path}: duplicate description with ${seenDesc.get(desc)}`);
    seenDesc.set(desc, path);
  }
  ok((pick(html, /<meta property="og:url" content="([^"]+)"/) || "").startsWith(origin), `${path}: og:url not on ${origin}`);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  let types = [];
  try { types = blocks.map((b) => JSON.parse(b)); } catch { ok(false, `${path}: JSON-LD does not parse`); }
  ok(types.some((t) => t["@type"] === "Organization"), `${path}: no Organization schema`);
  ok(types.some((t) => t["@type"] === "WebSite"), `${path}: no WebSite schema`);
  // FAQs are behind FAQS_ENABLED: the visible section and the FAQPage markup must be present together, or both absent.
  const faqHtml = (html.match(/<section id="[a-z-]+-faq"[\s\S]*?<\/section>/) || [""])[0];
  const faq = types.find((t) => t["@type"] === "FAQPage");
  ok(!!faqHtml === !!faq, `${path}: FAQ section ${faqHtml ? "present" : "absent"} but FAQPage markup ${faq ? "present" : "absent"}`);
  if (faq && faqHtml) {
    const visible = [...faqHtml.matchAll(/<h3[^>]*>([^<]*)<\/h3>[\s\S]*?<\/summary>\s*<p[^>]*>([^<]*)<\/p>/g)].map((m) => [decode(m[1]), decode(m[2])]);
    ok(visible.length === faq.mainEntity.length && visible.every((v, i) => v[0] === faq.mainEntity[i].name && v[1] === faq.mainEntity[i].acceptedAnswer.text), `${path}: FAQ visible text != schema`);
  }
  if (path.startsWith("/services/")) ok(types.some((t) => t["@type"] === "Service"), `${path}: no Service schema`);
  if (path.startsWith("/work/")) {
    ok(types.some((t) => t["@type"] === "Article"), `${path}: no Article schema`);
    const ogImg = pick(html, /<meta property="og:image" content="([^"]+)"/);
    ok(ogImg.includes("/images/og/cases/"), `${path}: og:image is not the case image (${ogImg})`);
    const img = await get(ogImg.replace(origin, ""));
    ok(img.status === 200 && Number(img.headers.get("content-length") || 0) < 300000, `${path}: og image status ${img.status} / size ${img.headers.get("content-length")}`);
  }
  if (path.startsWith("/careers/") && path !== "/careers") {
    const job = types.find((t) => t["@type"] === "JobPosting");
    ok(!!job, `${path}: no JobPosting`);
    ok(!!job && /^\d{4}-\d{2}-\d{2}/.test(job.datePosted || ""), `${path}: JobPosting has no datePosted`);
  }
  if (path.startsWith("/work/")) {
    const article = types.find((t) => t["@type"] === "Article");
    ok(!!article && /^\d{4}-\d{2}-\d{2}/.test(article.dateModified || ""), `${path}: Article has no dateModified`);
    const videos = types.filter((t) => t["@type"] === "VideoObject");
    for (const v of videos) ok(!!v.name && !!v.thumbnailUrl && !!v.contentUrl && /^\d{4}-\d{2}-\d{2}/.test(v.uploadDate || ""), `${path}: incomplete VideoObject ${v.name}`);
    const expectVideo = ["ajanta-ai-creatives", "cello-kidzbee", "fedex-csk", "godrej-blue", "royale-touche-stay-curious"].includes(path.split("/")[2]);
    ok(expectVideo ? videos.length > 0 : videos.length === 0, `${path}: VideoObject count ${videos.length}, expected ${expectVideo ? "some" : "none"}`);
  }
  if (path !== "/") ok(types.some((t) => t["@type"] === "BreadcrumbList"), `${path}: no BreadcrumbList`);
}

// ---------- 3. robots, 404, gate ----------
const [rbRes, rb] = await text("/robots.txt");
ok(rbRes.status === 200, "robots.txt status");
if (staging) ok(/Disallow: \/\s/.test(rb + "\n"), "staging robots should Disallow: /");
else { ok(/Allow: \//.test(rb) && !/Disallow: \/\s*$/m.test(rb), "robots should Allow: /"); ok(rb.includes(`Sitemap: ${origin}/sitemap.xml`), "robots Sitemap line wrong: " + rb.replace(/\n/g, " | ")); }
if (!staging) {
  for (const bot of ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "GPTBot", "ClaudeBot", "Google-Extended"]) {
    ok(new RegExp(`User-Agent: ${bot}\\b`, "i").test(rb), `robots.txt: no explicit rule for ${bot}`);
  }
  ok(rb.includes("Disallow: /proposal/"), "robots.txt: /proposal/ is not disallowed");
  ok(/User-Agent: GPTBot[\s\S]*?Disallow: \/admin/i.test(rb), "robots.txt: AI-bot group does not repeat the private paths");
}
const [llmsRes, llms] = await text("/llms.txt");
if (staging) ok(llmsRes.status === 404, `staging llms.txt status ${llmsRes.status}, want 404`);
else {
  ok(llmsRes.status === 200 && /text\/plain/.test(llmsRes.headers.get("content-type") || ""), `llms.txt status ${llmsRes.status}`);
  const linked = [...llms.matchAll(/\]\((https?:[^)]+)\)/g)].map((x) => x[1]);
  ok(linked.length >= 24 && linked.every((u) => u.startsWith(origin)), `llms.txt links: ${linked.length}, all on ${origin}?`);
  const sitemapPaths = new Set(locs);
  ok(linked.filter((u) => u !== origin + "/").every((u) => sitemapPaths.has(u)), "llms.txt links a URL that is not in the sitemap");
}
// Tracking carried over from the live site: Tag Manager + Search Console ownership tag. Never on staging or /admin.
const [, homeHtml] = await text("/");
const [, loginHtml] = await text("/admin/login");
// Check the real <noscript> tag, not the string: Next embeds prefetch data for linked pages (the admin login links to "/").
const GTM_NOSCRIPT = '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-';
ok(!loginHtml.includes(GTM_NOSCRIPT), "/admin/login must not load the tag manager");
if (staging) {
  ok(!homeHtml.includes("googletagmanager.com/ns.html"), "staging: the tag manager must not load");
} else {
  ok(homeHtml.includes(GTM_NOSCRIPT), "home: tag manager (noscript) missing");
  ok(homeHtml.includes("gtm-init") || homeHtml.includes("googletagmanager.com/gtm.js"), "home: tag manager script missing");
  ok(homeHtml.includes('name="google-site-verification"'), "home: Search Console verification tag missing");
}
const nf = await get("/definitely-not-a-page");
ok(nf.status === 404, "unknown URL status " + nf.status);
const adm = await get("/admin/login");
ok(adm.status === 200 && /noindex/i.test(adm.headers.get("x-robots-tag") || ""), `/admin X-Robots-Tag: ${adm.headers.get("x-robots-tag")} (status ${adm.status})`);
if (staging) { const h = await get("/about"); ok(/noindex/.test(h.headers.get("x-robots-tag") || ""), "staging: no X-Robots-Tag on /about"); }

console.log(`\nPASS ${pass}   FAIL ${fail}   (pages checked: ${locs.length}, redirects: ${Object.keys(redirects).length})`);
if (failures.length) { console.log("\nFailures:"); for (const f of failures) console.log(" -", f); process.exit(1); }
