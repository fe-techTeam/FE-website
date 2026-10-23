"use client";

import Link from "next/link";
import { useMemo, useRef, type CSSProperties } from "react";
import {
  ArrowRight,
  Briefcase,
  Clock,
  MapPin,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import CareerApplyForm from "@/components/careers/CareerApplyForm";
import GrowthCta from "@/components/GrowthCta";
import StickySectionNav from "@/components/StickySectionNav";
import { useStickySectionNav } from "@/hooks/useStickySectionNav";
import { usePageReveal } from "@/hooks/usePageReveal";
import ShareBar from "@/components/ShareBar";
import { IconSlot, ImageSlot } from "@/components/media/AssetPlaceholder";
import type { CareerRole, CareerRoleDetail } from "@/content/careers";
import type { CareerDetailTab } from "@/lib/careers";
import { getCareerRoleHref, getFirstDetailSectionId } from "@/lib/careers";
import { careersBenefits, careersHero, careersOpenings, careersWhyJoin } from "@/content/careers";

type CareerDetailPageProps = {
  role: CareerRole;
  detail: CareerRoleDetail;
  sectionTabs: CareerDetailTab[];
  relatedRoles: CareerRole[];
  shareUrl: string;
};

export default function CareerDetailPage({
  role,
  detail,
  sectionTabs,
  relatedRoles,
  shareUrl,
}: CareerDetailPageProps) {
  const sectionTabIds = useMemo(
    () => sectionTabs.map((tab) => tab.id).join(","),
    [sectionTabs],
  );
  const firstContentTarget = useMemo(() => getFirstDetailSectionId(sectionTabs), [sectionTabIds, sectionTabs]);
  const roleMetaItems = useMemo(
    () =>
      [
        role.location ? { label: "Location", value: role.location, Icon: MapPin } : null,
        role.department ? { label: "Department", value: role.department, Icon: Briefcase } : null,
        role.type ? { label: "Job type", value: role.type, Icon: Clock } : null,
        role.experience ? { label: "Experience", value: role.experience, Icon: Briefcase } : null,
      ].filter(Boolean) as {
        label: string;
        value: string;
        Icon: typeof MapPin;
      }[],
    [role.department, role.experience, role.location, role.type],
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const {
    activeTab,
    stickyOffsets,
    tabBarRef,
    tabNavRef,
    scrollToElement,
    handleTabKeyDown,
  } = useStickySectionNav({ tabs: sectionTabs });

  const hasRoleContent =
    Boolean(detail.aboutRole?.trim()) ||
    detail.responsibilities.length > 0 ||
    detail.workAreas.length > 0 ||
    detail.requirements.length > 0 ||
    detail.benefits.length > 0 ||
    Boolean(detail.aboutUs?.trim());

  const relatedSectionClass = "section-shell section-pad bg-mist";

  usePageReveal({ scope: rootRef });

  return (
    <div
      ref={rootRef}
      style={{ "--career-sticky-offset": `${stickyOffsets.total}px` } as CSSProperties}
    >
      <PageHero
        headingId="role-hero-heading"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" },
          { label: role.title, clamp: true },
        ]}
        breadcrumbTone="accent"
        breadcrumbCurrentClassName="max-w-full text-ink"
        eyebrow={detail.eyebrow}
        title={
          <>
            {detail.headlineBefore}{" "}
            <span className="text-red">{detail.headlineAccent}</span>
          </>
        }
        body={undefined}
        copyAfterBody={
          <>
            {roleMetaItems.length > 0 ? (
              <ul
                data-animate="hero-copy"
                className="m-0 mt-5 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 sm:mt-6 sm:gap-x-6"
              >
                {roleMetaItems.map(({ label, value, Icon }) => (
                  <li key={label} className="flex items-center gap-2 text-body-sm text-muted">
                    <Icon size={16} className="flex-none text-red" aria-hidden />
                    <span>
                      <span className="sr-only">{label}: </span>
                      {value}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
            {detail.summary?.trim() ? (
              <p
                data-animate="hero-copy"
                className="text-body section-copy section-copy-on-light mt-5 mb-0 max-w-[28rem] sm:mt-6"
              >
                {detail.summary}
              </p>
            ) : null}
            <div data-animate="hero-copy">
              <GrowthCta
                type="button"
                variant="primary"
                block
                className="mt-7 sm:mt-8"
                onClick={() => scrollToElement("apply")}
              >
                Apply now
              </GrowthCta>
            </div>
          </>
        }
        media={
          <>
            <ImageSlot
              asset={detail.heroImage}
              priority
              className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <p
              className="pointer-events-none absolute top-1/2 right-4 z-[3] hidden max-h-[85%] -translate-y-1/2 overflow-hidden font-display text-[10px] leading-none font-bold tracking-[0.42em] text-red uppercase [writing-mode:vertical-rl] rotate-180 lg:block xl:right-6 xl:text-xs"
              aria-hidden
            >
              {careersHero.verticalMark}
            </p>
          </>
        }
        burstSrc={careersHero.burst}
        seam={{
          onClick: () => scrollToElement(firstContentTarget),
          ariaLabel:
            firstContentTarget === "apply"
              ? "Continue to application form"
              : "Continue to role overview",
          arrowSrc: careersHero.arrow,
        }}
      />

      <StickySectionNav
        tabs={sectionTabs}
        activeTab={activeTab}
        headerOffset={stickyOffsets.header}
        tabBarRef={tabBarRef}
        tabNavRef={tabNavRef}
        ariaLabel="On this page"
        ariaCurrentValue="location"
        scrollRegion
        onSelect={scrollToElement}
        onTabKeyDown={handleTabKeyDown}
      />

      {/* Main content + sidebar */}
      <section className="section-shell section-pad bg-mist" aria-label="Role details">
        <div className="section-inner">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-10 xl:gap-12">
            <div className="order-2 min-w-0 w-full lg:order-1">
              {!hasRoleContent ? (
                <p className="text-body section-copy-on-light m-0" role="status">
                  Role details will be published soon. You can still apply using the form
                  {sectionTabs.length === 0 ? " below" : " on this page"}.
                </p>
              ) : null}

              {detail.aboutRole?.trim() ? (
              <div id="overview" className="career-section-anchor w-full" aria-labelledby="overview-heading">
                <h2 id="overview-heading" className="text-eyebrow m-0">About the role</h2>
                <p className="text-body section-copy-on-light mt-4 mb-0 w-full max-w-none">
                  {detail.aboutRole}
                </p>
              </div>
              ) : null}

              {detail.responsibilities.length > 0 ? (
              <div
                id="responsibilities"
                className={`career-section-anchor w-full ${detail.aboutRole?.trim() ? "mt-12 sm:mt-14" : ""}`}
                aria-labelledby="responsibilities-heading"
              >
                <h2 id="responsibilities-heading" className="text-eyebrow m-0">Key responsibilities</h2>
                <ul className="m-0 mt-6 grid list-none gap-6 p-0 sm:mt-8 sm:gap-7">
                  {detail.responsibilities.map((item, index) => (
                    <li key={`${item.title}-${index}`} className="flex gap-4">
                      <IconSlot
                        asset={item.icon}
                        tone="accent"
                        size={40}
                        className="mt-0.5 h-9 w-9 flex-none sm:h-10 sm:w-10"
                      />
                      <div className="min-w-0">
                        <h3 className="m-0 font-display text-base tracking-[0.04em] uppercase sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="text-body-sm mt-2 mb-0 text-muted">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              ) : null}

              {detail.workAreas.length > 0 ? (
              <div
                className="mt-12 w-full min-w-0 bg-paper px-4 py-8 sm:mt-14 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
                aria-labelledby="work-areas-heading"
              >
                <h2 id="work-areas-heading" className="text-eyebrow m-0">What you&rsquo;ll work on</h2>
                <ul
                  data-animate-stagger
                  className="m-0 mt-6 grid list-none grid-cols-1 gap-2.5 p-0 sm:mt-8 xs:grid-cols-2"
                >
                  {detail.workAreas.map((area, index) => (
                    <li
                      key={`${area.title}-${index}`}
                      className="cap-card flex min-h-[158px] min-w-0 flex-col justify-between border border-line bg-mist p-4 transition-[border-color] duration-200 hover:border-ink sm:p-5"
                    >
                      <IconSlot
                        asset={area.icon}
                        tone="accent"
                        size={44}
                        className="h-9 w-9 sm:h-11 sm:w-11"
                      />
                      <div className="mt-5 min-w-0 sm:mt-6">
                        <h3 className="m-0 font-display text-sm font-bold leading-[1.12] tracking-[0.01em] uppercase sm:text-[15px]">
                          {area.title}
                        </h3>
                        <p className="text-body-sm mt-2 mb-0 text-muted">{area.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              ) : null}

              {detail.requirements.length > 0 ? (
              <div
                id="requirements"
                className="career-section-anchor mt-12 sm:mt-14"
                aria-labelledby="requirements-heading"
              >
                <h2 id="requirements-heading" className="text-eyebrow m-0">Requirements</h2>
                <ul className="m-0 mt-6 grid list-none gap-6 p-0 sm:mt-8 sm:gap-7">
                  {detail.requirements.map((item, index) => (
                    <li key={`${item.title}-${index}`} className="flex gap-4">
                      <IconSlot
                        asset={item.icon}
                        tone="accent"
                        size={40}
                        className="mt-0.5 h-9 w-9 flex-none sm:h-10 sm:w-10"
                      />
                      <div className="min-w-0">
                        <h3 className="m-0 font-display text-base tracking-[0.04em] uppercase sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="text-body-sm mt-2 mb-0 text-muted">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              ) : null}

              {detail.benefits.length > 0 ? (
              <div
                id="benefits"
                className="career-section-anchor mt-12 sm:mt-14"
                aria-labelledby="benefits-heading"
              >
                <h2 id="benefits-heading" className="text-eyebrow m-0">Benefits</h2>
                <ul
                  className={`m-0 mt-6 grid list-none gap-2.5 p-0 sm:mt-8 ${
                    detail.benefits.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {detail.benefits.map((item, index) => (
                    <li
                      key={`${item.title}-${index}`}
                      className="cap-card flex min-h-[158px] gap-4 border border-line bg-white p-4 transition-[border-color] duration-200 hover:border-ink sm:p-5"
                    >
                      <IconSlot
                        asset={item.icon}
                        tone="accent"
                        size={44}
                        className="mt-0.5 h-9 w-9 flex-none sm:h-11 sm:w-11"
                      />
                      <div className="min-w-0">
                        <h3 className="m-0 font-display text-sm font-bold leading-[1.12] tracking-[0.01em] uppercase sm:text-[15px]">
                          {item.title}
                        </h3>
                        <p className="text-body-sm mt-2 mb-0 text-muted">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              ) : null}

              {detail.aboutUs?.trim() ? (
              <div
                id="about-us"
                className="career-section-anchor mt-12 w-full sm:mt-14"
                aria-labelledby="about-us-heading"
              >
                <h2 id="about-us-heading" className="text-eyebrow m-0">About us</h2>
                <p className="text-body section-copy-on-light mt-4 mb-0 w-full max-w-none">
                  {detail.aboutUs}
                </p>
              </div>
              ) : null}
            </div>

            <aside
              id="apply"
              className="career-section-anchor order-1 min-w-0 lg:order-2 lg:sticky lg:self-start"
              style={{ top: stickyOffsets.total }}
              aria-labelledby="apply-heading"
            >
              <div className="border border-line bg-white p-5 sm:p-6">
                <h2 id="apply-heading" className="text-eyebrow m-0">
                  Apply for this role
                </h2>
                <div className="mt-5">
                  <CareerApplyForm roleTitle={role.title} roleSlug={role.slug} />
                </div>
              </div>

              <div className="mt-6 border border-line bg-white p-5 sm:mt-8 sm:p-6" aria-labelledby="share-job-heading">
                <h3 id="share-job-heading" className="text-eyebrow m-0">
                  Share this job
                </h3>
                <div className="mt-3">
                  <ShareBar
                    title={role.title}
                    shareUrl={shareUrl}
                    variant="expanded"
                    includeEmail
                    includeNativeShare
                    shareMessage={`Check out this role at First Economy: ${role.title}`}
                    emailSubject={`${role.title} — Careers at First Economy`}
                    copySuccessMessage="Job link copied to clipboard."
                    copyErrorMessage="Could not copy the job link."
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Why join */}
      <section
        data-animate-section
        className="section-shell section-pad bg-paper"
        aria-labelledby="why-join-detail-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            {careersWhyJoin.eyebrow}
          </p>
          <h2
            data-animate="fade-up"
            id="why-join-detail-heading"
            className="text-display-md mt-4 mb-0 max-w-3xl"
          >
            {careersWhyJoin.titleBefore}{" "}
            <span className="text-red">{careersWhyJoin.titleAccent}</span>
          </h2>

          <ul
            data-animate-stagger
            className="section-media m-0 grid list-none grid-cols-2 gap-x-5 gap-y-8 p-0 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-6"
          >
            {careersBenefits.map((benefit) => (
              <li key={benefit.title} className="min-w-0">
                <IconSlot
                  asset={benefit.icon}
                  size={56}
                  className="h-11 w-11 text-ink sm:h-12 sm:w-12 md:h-14 md:w-14"
                />
                <h3 className="mt-4 mb-0 font-display text-base tracking-[0.06em] uppercase sm:mt-5 sm:text-lg">
                  {benefit.title}
                </h3>
                <p className="text-body-sm mt-2 mb-0 max-w-[16rem] text-muted sm:mt-2.5">
                  {benefit.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related roles */}
      {relatedRoles.length > 0 ? (
        <section
          data-animate-section
          className={relatedSectionClass}
          aria-labelledby="related-roles-heading"
        >
          <div className="section-inner">
            <div className="section-intro">
              <h2 data-animate="fade-up" id="related-roles-heading" className="text-display-md m-0">
                More roles <span className="text-red">you might like</span>
              </h2>
              <div data-animate="fade-up" className="min-w-0 pt-0 md:pt-1 md:justify-self-end md:self-end">
                <Link
                  href="/careers#open-positions"
                  className="text-cta link-cta mt-0 text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red"
                >
                  {careersOpenings.viewAll.label}
                  <ArrowRight size={16} strokeWidth={2} aria-hidden />
                </Link>
              </div>
            </div>

            <ul
              data-animate-stagger
              className={`section-media m-0 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2 lg:gap-4 ${
                relatedRoles.length >= 4 ? "lg:grid-cols-4" : relatedRoles.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
              }`}
            >
              {relatedRoles.map((related) => (
                <li key={related.slug} className="min-w-0">
                  <Link
                    href={related.href ?? getCareerRoleHref(related.slug)}
                    className="cap-card group flex h-full min-h-[11rem] flex-col justify-between border border-line bg-white p-4 transition-[border-color] duration-200 hover:border-ink focus-visible:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:p-5"
                    aria-label={`${related.title}, ${related.location}, ${related.department}, ${related.type}`}
                  >
                    <div className="min-w-0">
                      {related.department ? (
                      <p className="m-0 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] text-red uppercase">
                        <Briefcase size={12} aria-hidden />
                        {related.department}
                      </p>
                      ) : null}
                      <h3 className="mt-2.5 mb-0 font-display text-sm font-bold leading-[1.12] tracking-[0.01em] text-ink uppercase transition group-hover:text-red sm:text-[15px]">
                        {related.title}
                      </h3>
                      <div className="mt-2.5 flex flex-col gap-1">
                        {related.location ? (
                        <p className="text-body-sm m-0 flex items-center gap-1.5 text-muted">
                          <MapPin size={13} className="flex-none text-red" aria-hidden />
                          <span>{related.location}</span>
                        </p>
                        ) : null}
                        {related.type ? (
                        <p className="text-body-sm m-0 flex items-center gap-1.5 text-muted">
                          <Clock size={13} className="flex-none text-red" aria-hidden />
                          <span>{related.type}</span>
                        </p>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end sm:mt-5">
                      <span
                        className="grid h-8 w-8 flex-none place-items-center rounded-full border border-red text-red transition group-hover:bg-red group-hover:text-white"
                        aria-hidden
                      >
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
