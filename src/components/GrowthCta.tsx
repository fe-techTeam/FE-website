import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type GrowthCtaVariant = "primary" | "secondary" | "accent";
export type GrowthCtaTone = "light" | "dark";

type GrowthCtaShared = {
  children: ReactNode;
  variant?: GrowthCtaVariant;
  /** Use on ink/dark surfaces — adjusts secondary outline + accent hover. */
  tone?: GrowthCtaTone;
  /** Smaller padding / no min-width (header, tight toolbars). */
  compact?: boolean;
  /** Stretch to container width (mobile heroes, forms). */
  block?: boolean;
  loading?: boolean;
  className?: string;
};

type GrowthCtaLinkProps = GrowthCtaShared & {
  href: string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">;

type GrowthCtaButtonProps = GrowthCtaShared & {
  href?: undefined;
} & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type GrowthCtaProps = GrowthCtaLinkProps | GrowthCtaButtonProps;

/** Site custom CTA arrow — circle + chevron (matches brand arrow SVG assets). */
function GrowthCtaArrow() {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="growth-cta__arrow-icon"
    >
      <circle cx="20" cy="20" r="14.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14.5 20h11M21.5 15.5 26 20l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function buildClassName({
  variant,
  tone,
  compact,
  block,
  className,
}: Pick<GrowthCtaShared, "variant" | "tone" | "compact" | "block" | "className">) {
  return [
    "growth-cta",
    variant === "secondary" ? "growth-cta--secondary" : null,
    variant === "accent" ? "growth-cta--accent" : null,
    variant === "primary" || !variant ? "growth-cta--primary" : null,
    tone === "dark" ? "growth-cta--on-dark" : null,
    compact ? "growth-cta--compact" : null,
    block ? "growth-cta--block" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

function GrowthCtaContent({
  children,
  variant,
  loading,
}: {
  children: ReactNode;
  variant: GrowthCtaVariant;
  loading?: boolean;
}) {
  const beveled = variant === "primary" || variant === "accent";

  return (
    <>
      {beveled ? (
        <span className="growth-cta__frame" aria-hidden>
          <span className="growth-cta__corner growth-cta__corner--tl" />
          <span className="growth-cta__corner growth-cta__corner--br" />
        </span>
      ) : null}
      <span className="growth-cta__face">
        {beveled ? <span className="growth-cta__shell" aria-hidden /> : null}
        <span className="growth-cta__label">{children}</span>
        <span className="growth-cta__arrow" aria-hidden>
          {loading ? (
            <Loader2 strokeWidth={2.25} className="growth-cta__arrow-icon growth-cta__arrow-icon--spin animate-spin" />
          ) : (
            <GrowthCtaArrow />
          )}
        </span>
      </span>
      {variant === "secondary" ? <span className="growth-cta__pip" aria-hidden /> : null}
    </>
  );
}

export default function GrowthCta(props: GrowthCtaProps) {
  const {
    children,
    variant = "primary",
    tone = "light",
    compact = false,
    block = false,
    loading = false,
    className,
  } = props;

  const classes = buildClassName({ variant, tone, compact, block, className });
  const content = (
    <GrowthCtaContent variant={variant} loading={loading}>
      {children}
    </GrowthCtaContent>
  );

  if ("href" in props && props.href) {
    const {
      href,
      children: _c,
      variant: _v,
      tone: _t,
      compact: _co,
      block: _b,
      loading: _l,
      className: _cl,
      ...rest
    } = props;
    return (
      <Link href={href} className={classes} data-no-btn-motion {...rest}>
        {content}
      </Link>
    );
  }

  const {
    children: _c,
    variant: _v,
    tone: _t,
    compact: _co,
    block: _b,
    loading: _l,
    className: _cl,
    disabled,
    type = "button",
    ...rest
  } = props as GrowthCtaButtonProps;

  return (
    <button
      type={type}
      className={classes}
      data-no-btn-motion
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
}
