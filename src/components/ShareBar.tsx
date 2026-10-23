"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Link2, Share2 } from "lucide-react";
import {
  buildShareLinks,
  copyTextToClipboard,
  type CopyStatus,
} from "@/lib/share";

type ShareBarProps = {
  title: string;
  shareUrl: string;
  /** Compact icon row (insights) vs expanded pills (careers) */
  variant?: "compact" | "expanded";
  ariaLabel?: string;
  shareMessage?: string;
  emailSubject?: string;
  includeEmail?: boolean;
  includeNativeShare?: boolean;
  copySuccessMessage?: string;
  copyErrorMessage?: string;
};

export default function ShareBar({
  title,
  shareUrl,
  variant = "compact",
  ariaLabel = "Share options",
  shareMessage,
  emailSubject,
  includeEmail = false,
  includeNativeShare = false,
  copySuccessMessage,
  copyErrorMessage,
}: ShareBarProps) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [canNativeShare, setCanNativeShare] = useState(false);

  const message = shareMessage ?? title;
  const resolvedEmailSubject = emailSubject ?? `${title} — First Economy`;
  const emailBody = `${message}\n\n${shareUrl}`;
  const socialLinks = buildShareLinks({
    shareUrl,
    shareMessage: message,
    emailSubject: resolvedEmailSubject,
    emailBody,
    includeEmail,
  });

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timer = window.setTimeout(() => setCopyStatus("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const handleCopyLink = useCallback(async () => {
    try {
      await copyTextToClipboard(shareUrl);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }, [shareUrl]);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) {
      await handleCopyLink();
      return;
    }

    try {
      await navigator.share({
        title: resolvedEmailSubject,
        text: message,
        url: shareUrl,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      await handleCopyLink();
    }
  }, [handleCopyLink, message, resolvedEmailSubject, shareUrl]);

  const statusMessage =
    copyStatus === "copied"
      ? copySuccessMessage ?? "Link copied to clipboard."
      : copyStatus === "error"
        ? copyErrorMessage ?? "Could not copy the link."
        : "";

  if (variant === "expanded") {
    return (
      <div role="group" aria-label={ariaLabel}>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleCopyLink()}
            className="text-cta tap-target-sm inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-mist px-4 text-muted transition hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
          >
            {copyStatus === "copied" ? (
              <Check size={16} aria-hidden />
            ) : (
              <Copy size={16} aria-hidden />
            )}
            {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy link"}
          </button>

          {includeNativeShare && canNativeShare ? (
            <button
              type="button"
              onClick={() => void handleNativeShare()}
              className="text-cta tap-target-sm inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-mist px-4 text-muted transition hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            >
              <Share2 size={16} aria-hidden />
              Share
            </button>
          ) : null}

          {socialLinks.map((link) => {
            const Icon = link.Icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={link.label}
                className="tap-target-sm grid size-11 place-items-center rounded-full border border-line bg-mist text-muted transition hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
              >
                <Icon size={16} aria-hidden />
              </a>
            );
          })}
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {statusMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex shrink-0 flex-wrap items-center gap-2"
    >
      {socialLinks.map((link) => {
        const Icon = link.Icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            aria-label={link.label}
            className="tap-target-sm grid size-9 place-items-center rounded-full border border-line bg-white text-muted transition hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
          >
            <Icon size={15} aria-hidden />
          </a>
        );
      })}
      <button
        type="button"
        onClick={() => void handleCopyLink()}
        aria-label={
          copyStatus === "copied"
            ? "Link copied"
            : copyStatus === "error"
              ? "Copy failed, try again"
              : "Copy link"
        }
        className="tap-target-sm grid size-9 place-items-center rounded-full border border-line bg-white text-muted transition hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
      >
        {copyStatus === "copied" ? <Check size={15} aria-hidden /> : <Link2 size={15} aria-hidden />}
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
}
