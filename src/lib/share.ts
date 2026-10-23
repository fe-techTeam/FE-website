import type { ComponentType } from "react";
import { Mail } from "lucide-react";
import { FacebookIcon, LinkedInIcon } from "@/components/SocialIcons";

export type CopyStatus = "idle" | "copied" | "error";

export async function copyTextToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

type ShareLink = {
  label: string;
  href: string;
  Icon: ComponentType<{ size?: number }>;
  external?: boolean;
};

type BuildShareLinksOptions = {
  shareUrl: string;
  shareMessage: string;
  emailSubject?: string;
  emailBody?: string;
  includeEmail?: boolean;
};

export function buildShareLinks({
  shareUrl,
  shareMessage,
  emailSubject,
  emailBody,
  includeEmail = false,
}: BuildShareLinksOptions): ShareLink[] {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedEmailSubject = encodeURIComponent(emailSubject ?? shareMessage);
  const encodedEmailBody = encodeURIComponent(emailBody ?? `${shareMessage}\n\n${shareUrl}`);

  const links: ShareLink[] = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: LinkedInIcon,
      external: true,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: FacebookIcon,
      external: true,
    },
  ];

  if (includeEmail) {
    links.push({
      label: "Share via email",
      href: `mailto:?subject=${encodedEmailSubject}&body=${encodedEmailBody}`,
      Icon: Mail,
      external: false,
    });
  }

  return links;
}
