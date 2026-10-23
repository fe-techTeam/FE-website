/*
 * Rendered-text contrast audit (WCAG AA: 4.5:1, or 3:1 for large text).
 *
 * Paste into the browser console on any page of the running site, or fetch and eval it, after scrolling the page
 * once so the scroll reveals have played. It walks every visible text node, works out the colour behind it from the
 * element's ancestors, and returns one line per failing combination. It skips aria-hidden decorative text and
 * elements still mid-fade. Lines marked "(bg image?)" sit over a gradient or image and need a manual look, and a
 * button label drawn over a pseudo-element background (e.g. the growth-cta label) can read as a false positive.
 */
(() => {
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (top, bottom) => {
    const a = top.a + bottom.a * (1 - top.a);
    if (a === 0) return { r: 255, g: 255, b: 255, a: 0 };
    const f = (t, b) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
    return { r: f(top.r, bottom.r), g: f(top.g, bottom.g), b: f(top.b, bottom.b), a };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const la = lum(a), lb = lum(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };
  const effectiveOpacity = (el) => {
    let o = 1;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity);
    return o;
  };
  const backdrop = (el) => {
    // stack backgrounds from the element up to the root; flag images/gradients as unknown
    const layers = [];
    let unknown = false;
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== "none") unknown = true;
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) {
        layers.push(bg);
        if (bg.a >= 1) break;
      }
    }
    let result = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) result = over(layers[i], result);
    return { color: result, unknown };
  };
  const out = new Map();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const text = n.nodeValue.trim();
    if (!text) continue;
    const el = n.parentElement;
    if (!el || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (el.closest("[aria-hidden='true']") && !el.closest("button,a")) continue;
    const fg0 = parse(cs.color);
    if (!fg0) continue;
    const op = effectiveOpacity(el);
    if (op < 0.98) continue; // still mid-animation or deliberately dimmed element: not a stable reading
    const { color: bg, unknown } = backdrop(el);
    const fg = over({ ...fg0, a: fg0.a * op }, bg);
    const size = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    const cr = ratio(fg, bg);
    if (cr + 0.005 < need) {
      const cls = (el.className && typeof el.className === "string" ? el.className : "").split(/\s+/).slice(0, 4).join(".");
      const key = `${el.tagName.toLowerCase()}.${cls} | ${cs.color} on ${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)} | ${size}px`;
      const prev = out.get(key) || { n: 0, ratio: cr.toFixed(2), need, unknown, sample: text.slice(0, 40) };
      prev.n++;
      out.set(key, prev);
    }
  }
  return [...out.entries()].map(([k, v]) => `${v.n}x [${v.ratio} < ${v.need}]${v.unknown ? " (bg image?)" : ""} ${k} :: ${v.sample}`);
})()
