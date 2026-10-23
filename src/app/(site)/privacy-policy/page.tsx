import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { privacyPolicyContent } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Data, Cookies & Your Rights",
  description:
    "How First Economy collects, uses and protects personal information when you visit our website, contact us, subscribe to updates or apply for a role.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocument document={privacyPolicyContent} />;
}
