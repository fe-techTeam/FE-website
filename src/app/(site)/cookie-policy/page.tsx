import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { cookiePolicyContent } from "@/content/legal";

export const metadata: Metadata = {
  title: "Cookie Policy — How We Use Cookies",
  description:
    "Which cookies the First Economy website uses, what they are for, and how to accept, reject or change your cookie choices at any time.",
};

export default function CookiePolicyPage() {
  return <LegalDocument document={cookiePolicyContent} />;
}
