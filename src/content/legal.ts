import { contactInfo } from "@/content/site";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocumentContent = {
  title: string;
  eyebrow: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  contactNote: string;
};

export const privacyPolicyContent: LegalDocumentContent = {
  title: "Privacy Policy",
  eyebrow: "Legal",
  lastUpdated: "29 August 2026",
  intro:
    "First Economy Private Limited (\"First Economy\", \"we\", \"us\", or \"our\") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and protect personal information when you visit our website, contact us, subscribe to updates, or apply for a role.",
  sections: [
    {
      id: "information-we-collect",
      title: "Information we collect",
      paragraphs: [
        "We may collect personal information that you choose to provide, including your name, email address, phone number, company name, message content, job application details, and files you upload (such as a resume).",
        "We may also collect limited technical information automatically, such as IP address, browser type, device information, pages viewed, and referral URLs, through cookies and similar technologies.",
      ],
    },
    {
      id: "how-we-use",
      title: "How we use your information",
      paragraphs: ["We use personal information to:"],
      bullets: [
        "Respond to enquiries and provide information about our services.",
        "Process job applications and communicate about recruitment.",
        "Send newsletters or marketing communications where you have opted in.",
        "Improve our website, services, security, and user experience.",
        "Comply with legal obligations and protect our rights.",
      ],
    },
    {
      id: "legal-basis",
      title: "Legal basis and consent",
      paragraphs: [
        "Where required, we process personal information based on your consent, our legitimate business interests (such as responding to enquiries), contractual necessity, or compliance with applicable law.",
        "By submitting a contact or application form, you confirm that the information you provide is accurate and that you agree to this Privacy Policy and our Terms & Conditions where applicable.",
      ],
    },
    {
      id: "sharing",
      title: "How we share information",
      paragraphs: [
        "We do not sell your personal information. We may share information with trusted service providers who help us operate our website, deliver email, host infrastructure, or support recruitment — only to the extent needed and subject to appropriate safeguards.",
        "We may also disclose information if required by law, court order, or to protect the rights, property, or safety of First Economy, our clients, or others.",
      ],
    },
    {
      id: "retention",
      title: "Data retention",
      paragraphs: [
        "We retain personal information only for as long as necessary for the purposes described in this policy, including to meet legal, accounting, or reporting requirements. Enquiry and application records are typically retained for a limited period unless a longer retention period is required or permitted by law.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We implement reasonable administrative, technical, and organisational measures designed to protect personal information. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      paragraphs: [
        "Depending on applicable law, including India’s Digital Personal Data Protection Act, 2023, you may have rights to access, correction, erasure, withdrawal of consent, grievance redressal, and other remedies regarding your personal information.",
        "To exercise these rights, contact us using the details below. We may need to verify your identity before responding.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and analytics",
      paragraphs: [
        "Our website may use cookies and similar technologies to remember preferences, measure traffic, and improve performance. You can control cookies through your browser settings. Disabling cookies may affect certain site features.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-party links",
      paragraphs: [
        "Our website may contain links to third-party websites or social platforms. We are not responsible for the privacy practices of those sites and encourage you to review their policies separately.",
      ],
    },
    {
      id: "children",
      title: "Children’s privacy",
      paragraphs: [
        "Our services are not directed to individuals under 18 years of age, and we do not knowingly collect personal information from children.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The \"Last updated\" date at the top of this page indicates when it was last revised. Material changes will be posted on this page.",
      ],
    },
  ],
  contactNote:
    `For privacy-related questions or requests, email ${contactInfo.email} or write to First Economy Private Limited, Mumbai, India.`,
};
