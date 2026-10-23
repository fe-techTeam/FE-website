import "server-only";

/**
 * Feature 10 — one-time content migration.
 *
 * Reads the hardcoded TypeScript content in `src/content/**` and writes it into
 * `ContentEntry` rows so the admin panel starts populated instead of empty.
 *
 * Runs inside Next.js, so `@/content/...` path aliases resolve natively and no
 * separate build step is needed. Imports are dynamic to keep the ~11k lines of
 * content out of every other admin request's module graph.
 *
 * Idempotent: re-running updates existing entries in place (matched on
 * module + slug) rather than duplicating them.
 */

export type ImportRecord = {
  slug: string;
  title: string;
  data: Record<string, unknown>;
};

export type ModuleImporter = {
  moduleKey: string;
  load: () => Promise<ImportRecord[]>;
};

const asJson = <T,>(value: T): Record<string, unknown> =>
  JSON.parse(JSON.stringify(value)) as Record<string, unknown>;

export const IMPORTERS: ModuleImporter[] = [
  // ---------------------------------------------------------------- Content
  {
    moduleKey: "case-studies",
    load: async () => {
      const { caseStudies } = await import("@/content/caseStudies");
      return caseStudies.map((study) => ({
        slug: study.slug,
        title: `${study.client} — ${study.campaign}`,
        data: asJson(study),
      }));
    },
  },
  {
    moduleKey: "careers",
    load: async () => {
      const { careersRoles, careerRoleDetails } = await import("@/content/careers");
      return careersRoles.map((role) => ({
        slug: role.slug,
        title: role.title,
        data: asJson({ ...role, detail: careerRoleDetails[role.slug] ?? null }),
      }));
    },
  },
  {
    moduleKey: "service-pages",
    load: async () => {
      const { servicePagesBySlug } = await import("@/content/servicePages");
      return Object.values(servicePagesBySlug).map((page) => ({
        slug: page.slug,
        title: page.name,
        data: asJson(page),
      }));
    },
  },
  {
    moduleKey: "services",
    load: async () => {
      const { services } = await import("@/content/services");
      return services.map((service) => ({
        slug: service.slug,
        title: service.name,
        data: asJson(service),
      }));
    },
  },
  {
    moduleKey: "service-offerings",
    load: async () => {
      const { serviceOfferings } = await import("@/content/serviceOfferings");
      return serviceOfferings.map((offering) => ({
        slug: offering.slug,
        title: offering.name,
        data: asJson(offering),
      }));
    },
  },
  {
    moduleKey: "industries",
    load: async () => {
      const { industries } = await import("@/content/industries");
      return industries.map((industry) => ({
        slug: industry.slug,
        title: industry.name,
        data: asJson(industry),
      }));
    },
  },

  // ------------------------------------------------------------------ Pages
  {
    moduleKey: "home-page",
    load: async () => {
      const [home, workPage] = await Promise.all([
        import("@/content/home"),
        import("@/content/workPage"),
      ]);
      return [
        {
          slug: "home",
          title: "Home",
          data: asJson({
            cta: home.homeCta,
            featuredWorkLimit: workPage.homeFeaturedWorkLimit,
          }),
        },
      ];
    },
  },
  {
    moduleKey: "about-page",
    load: async () => {
      const about = await import("@/content/about");
      return [
        {
          slug: "about",
          title: "About",
          data: asJson({
            hero: about.aboutHero,
            story: about.aboutStory,
            timeline: about.aboutTimeline,
            whatWeDo: about.aboutWhatWeDo,
            values: about.aboutValues,
            teamTagline: about.aboutTeamTagline,
            featuredAchievement: about.aboutFeaturedAchievement,
            cta: about.aboutCta,
          }),
        },
      ];
    },
  },
  {
    moduleKey: "work-page",
    load: async () => {
      const workPage = await import("@/content/workPage");
      return [
        {
          slug: "work",
          title: "Work",
          data: asJson({
            hero: workPage.workHero,
            filters: workPage.workFilters,
            showcaseOrder: workPage.workShowcaseOrder,
            stats: workPage.workStats,
            cta: workPage.workCta,
          }),
        },
      ];
    },
  },
  {
    moduleKey: "services-page",
    load: async () => {
      const servicesPage = await import("@/content/servicesPage");
      return [
        {
          slug: "services",
          title: "Services",
          data: asJson({
            hero: servicesPage.servicesHero,
            grid: servicesPage.servicesGrid,
            process: servicesPage.servicesProcess,
            processSteps: servicesPage.servicesProcessSteps,
            trusted: servicesPage.servicesTrusted,
            cta: servicesPage.servicesCta,
          }),
        },
      ];
    },
  },
  {
    moduleKey: "careers-page",
    load: async () => {
      const careers = await import("@/content/careers");
      return [
        {
          slug: "careers",
          title: "Careers",
          data: asJson({
            hero: careers.careersHero,
            culture: careers.careersCulture,
            values: careers.careersValues,
            whyJoin: careers.careersWhyJoin,
            benefits: careers.careersBenefits,
            openings: careers.careersOpenings,
            detailWhyJoin: careers.careerDetailWhyJoin,
            cta: careers.careersCta,
          }),
        },
      ];
    },
  },
  {
    moduleKey: "contact-page",
    load: async () => {
      const contact = await import("@/content/contact");
      return [
        {
          slug: "contact",
          title: "Contact",
          data: asJson({
            hero: contact.contactHero,
            formCopy: contact.contactFormCopy,
            interests: contact.contactInterests,
            touch: contact.contactTouch,
            officesCopy: contact.contactOfficesCopy,
          }),
        },
      ];
    },
  },
  {
    moduleKey: "legal",
    load: async () => {
      const legal = await import("@/content/legal");
      return [
        {
          slug: "privacy-policy",
          title: legal.privacyPolicyContent.title,
          data: asJson(legal.privacyPolicyContent),
        },
      ];
    },
  },

  // -------------------------------------------------------- People & Proof
  {
    moduleKey: "team",
    load: async () => {
      const { aboutTeam } = await import("@/content/about");
      return aboutTeam.map((member) => ({
        slug: slugify(member.name),
        title: member.name,
        data: asJson(member),
      }));
    },
  },
  {
    moduleKey: "awards",
    load: async () => {
      const { campaignAwards } = await import("@/content/about");
      return campaignAwards.map((award) => ({
        slug: slugify(`${award.client}-${award.accolade}`),
        title: `${award.client} — ${award.accolade}`,
        data: asJson(award),
      }));
    },
  },
  {
    moduleKey: "clients",
    load: async () => {
      const { clientLogos } = await import("@/content/partners");
      return clientLogos.map((logo) => ({
        slug: logo.slug,
        title: logo.name,
        data: asJson(logo),
      }));
    },
  },
  {
    moduleKey: "partners",
    load: async () => {
      const { platformPartnerLogos } = await import("@/content/capabilities");
      return platformPartnerLogos.map((logo) => ({
        slug: logo.slug,
        title: logo.name,
        data: asJson(logo),
      }));
    },
  },
  {
    moduleKey: "stats",
    load: async () => {
      const { networkStats } = await import("@/content/stats");
      return networkStats.map((stat) => ({
        slug: slugify(stat.label),
        title: stat.label,
        data: asJson(stat),
      }));
    },
  },

  // ------------------------------------------------------------------- Site
  {
    moduleKey: "offices",
    load: async () => {
      const { officeLocations } = await import("@/content/offices");
      return officeLocations.map((office) => ({
        slug: office.slug,
        title: office.city,
        data: asJson(office),
      }));
    },
  },
  {
    moduleKey: "site-settings",
    load: async () => {
      const site = await import("@/content/site");
      return [
        {
          slug: "site-settings",
          title: "Site settings",
          data: asJson({
            contactInfo: site.contactInfo,
            footerCta: site.footerCta,
            socialLinks: site.socialLinks,
            dataTools: site.dataTools,
            platformPartners: site.platformPartners,
          }),
        },
      ];
    },
  },
];

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function getImporter(moduleKey: string): ModuleImporter | undefined {
  return IMPORTERS.find((importer) => importer.moduleKey === moduleKey);
}

export const IMPORTABLE_MODULE_KEYS = IMPORTERS.map((importer) => importer.moduleKey);
