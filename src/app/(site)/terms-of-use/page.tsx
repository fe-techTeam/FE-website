import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { termsOfUseContent } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Use — Using the First Economy Website",
  description:
    "The terms that apply when you use the First Economy website, including intellectual property, enquiries, third-party links and governing law.",
};

export default function TermsOfUsePage() {
  return <LegalDocument document={termsOfUseContent} />;
}
