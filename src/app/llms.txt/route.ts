import { caseStudies } from "@/content/caseStudies";
import { officeLocations } from "@/content/offices";
import { serviceOfferings } from "@/content/serviceOfferings";
import { contactInfo } from "@/content/site";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, isNoIndex } from "@/lib/seo";

// Built from the same arrays as the site and sitemap, so it can only describe pages that exist.
export const dynamic = "force-static";

/**
 * /llms.txt — a short Markdown map of the site for language models (https://llmstxt.org).
 * It is a proposed convention, not a standard any major engine has committed to reading; it complements
 * crawlable HTML and does not replace it. Staging (SITE_NOINDEX) does not publish one.
 */
export function GET() {
  if (isNoIndex()) return new Response("Not found", { status: 404 });

  const hq = officeLocations.find((office) => office.isHq) ?? officeLocations[0];
  const others = officeLocations.filter((office) => office !== hq).map((office) => office.city);
  const otherCities = others.length > 1 ? `${others.slice(0, -1).join(", ")} and ${others[others.length - 1]}` : others.join("");
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} is headquartered in ${hq.city}, with offices in ${otherCities}.`,
    "",
    "## Services",
    ...serviceOfferings.map((service) => `- [${service.name}](${absoluteUrl(service.href)}): ${service.description}`),
    "",
    "## Case studies",
    ...caseStudies.map(
      (study) => `- [${study.client} — ${study.campaign}](${absoluteUrl(`/work/${study.slug}`)}): ${study.seoDescription ?? study.hero}`,
    ),
    "",
    `## ${SITE_NAME}`,
    `- [About](${absoluteUrl("/about")}): who we are, leadership, offices and network`,
    `- [Awards](${absoluteUrl("/awards")}): awards and recognition, including a Guinness World Record with Godrej Properties`,
    `- [Careers](${absoluteUrl("/careers")}): open roles`,
    `- [Contact](${absoluteUrl("/contact")}): offices and enquiries — ${contactInfo.email}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
