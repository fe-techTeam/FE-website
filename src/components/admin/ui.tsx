import type { ReactNode } from "react";
import Link from "next/link";

import type { ContentStatus } from "@/generated/prisma/enums";

/**
 * Admin building blocks, styled with the public site's design language:
 * Barlow Condensed uppercase display type, red eyebrows, hairline rules,
 * square corners, red on hover and focus. Shared classes live in
 * `src/styles/admin.css`.
 */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-line pb-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? <div className="admin-eyebrow">{eyebrow}</div> : null}
          <h1 className="admin-title mt-2.5 m-0 text-ink text-balance">{title}</h1>
          <div className="admin-accent-rule mt-4" aria-hidden />
          {description ? (
            <p className="text-body-sm mt-4 m-0 max-w-2xl text-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2.5">{actions}</div> : null}
      </div>
    </header>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className = "",
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`admin-card min-w-0 ${className}`}>
      {title ? (
        <div className="admin-card-head">
          <div className="min-w-0">
            <h2 className="admin-card-title m-0 text-ink">{title}</h2>
            {description ? (
              <p className="text-body-sm mt-1.5 m-0 max-w-xl text-muted">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const STATUS_CLASS: Record<ContentStatus, string> = {
  DRAFT: "admin-badge-draft",
  IN_REVIEW: "admin-badge-review",
  PUBLISHED: "admin-badge-live",
  ARCHIVED: "admin-badge-draft",
};

const STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  PUBLISHED: "Live",
  ARCHIVED: "Archived",
};

export function StatusBadge({
  status,
  pendingChanges,
}: {
  status: ContentStatus;
  pendingChanges?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`admin-badge ${STATUS_CLASS[status]}`}>{STATUS_LABELS[status]}</span>
      {pendingChanges ? (
        <span className="admin-badge admin-badge-pending">Edited</span>
      ) : null}
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "danger" | "good";
}) {
  const styles = {
    neutral: "admin-badge-draft",
    danger: "admin-badge-review",
    good: "admin-badge-live",
  }[tone];

  return <span className={`admin-badge ${styles}`}>{children}</span>;
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-4 px-5 py-14">
      <div className="admin-accent-rule" aria-hidden />
      <p className="admin-card-title m-0 text-ink">{title}</p>
      <p className="text-body-sm m-0 max-w-md text-muted">{body}</p>
      {action}
    </div>
  );
}

/**
 * Mirrors the stat bands on the public site — oversized Barlow numeral over a
 * small tracked-out label.
 */
export function StatTile({
  label,
  value,
  hint,
  href,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  hint?: string;
  href?: string;
  tone?: "neutral" | "warn";
}) {
  const highlight = tone === "warn" && Number(value) > 0;

  const body = (
    <>
      <p className="admin-label m-0">{label}</p>
      <p className={`admin-stat mt-3 m-0 ${highlight ? "text-red" : "text-ink"}`}>{value}</p>
      {hint ? <p className="admin-meta mt-2 m-0">{hint}</p> : null}
    </>
  );

  return href ? (
    <Link href={href} className="admin-card admin-card-hover block px-5 py-5">
      {body}
    </Link>
  ) : (
    <div className="admin-card px-5 py-5">{body}</div>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="admin-label block text-ink">
      {children}
      {hint ? (
        <span className="ml-2 font-normal normal-case tracking-normal text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export const inputClass = "admin-input";

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-2 m-0 text-xs font-semibold text-red">
      {children}
    </p>
  );
}

export function RelativeTime({ value }: { value: Date | string | null | undefined }) {
  if (!value) return <span className="text-muted">—</span>;

  const date = typeof value === "string" ? new Date(value) : value;
  return (
    <time dateTime={date.toISOString()} title={date.toLocaleString()}>
      {formatRelative(date)}
    </time>
  );
}

export function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;

  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
