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

/*
 * DRAFT legal copy for the Terms of Use and Cookie Policy. Written to match the existing Privacy Policy and what the
 * site actually does today. It has not been reviewed by counsel: have it checked before go-live.
 */
export const termsOfUseContent: LegalDocumentContent = {
  title: "Terms of Use",
  eyebrow: "Legal",
  lastUpdated: "23 October 2026",
  intro:
    "These Terms of Use govern your access to and use of the First Economy website (the \"Website\"), operated by First Economy Private Limited (\"First Economy\", \"we\", \"us\", or \"our\"). By using the Website you agree to these terms. If you do not agree, please do not use it.",
  sections: [
    {
      id: "use-of-website",
      title: "Use of the Website",
      paragraphs: [
        "You may use the Website for lawful purposes only and in a way that does not infringe the rights of others or restrict their use of it.",
      ],
      bullets: [
        "Do not attempt to gain unauthorised access to the Website, its servers or any connected systems.",
        "Do not introduce malware, scrape the Website at a scale that affects its performance, or interfere with its security.",
        "Do not submit false, misleading or unlawful information through our forms.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual property",
      paragraphs: [
        "The Website and its content, including text, graphics, logos, case studies, videos, designs and code, belong to First Economy or its licensors and are protected by Indian and international intellectual property laws.",
        "Client names, logos and campaign materials shown on the Website belong to their respective owners and are shown to describe our work. You may not copy, reproduce or reuse any content without our prior written consent, except for personal, non-commercial viewing.",
      ],
    },
    {
      id: "information-only",
      title: "Information, not advice",
      paragraphs: [
        "The Website describes our services and shares general information about marketing, technology and AI. It is provided for information only and does not constitute professional advice or a binding offer. Results described in case studies reflect specific engagements and are not a guarantee of future outcomes.",
        "Any engagement with First Economy is governed by a separate written agreement.",
      ],
    },
    {
      id: "enquiries-applications",
      title: "Enquiries and job applications",
      paragraphs: [
        "When you send an enquiry or apply for a role, you confirm that the information you provide is accurate and that you are entitled to share it. We use it as described in our Privacy Policy.",
        "Submitting an enquiry does not create a client relationship, and applying for a role does not guarantee an interview or offer.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-party links and content",
      paragraphs: [
        "The Website may link to or embed third-party sites and services (for example social platforms and video players). We do not control them and are not responsible for their content, availability or privacy practices.",
      ],
    },
    {
      id: "disclaimer",
      title: "Disclaimer",
      paragraphs: [
        "We try to keep the Website accurate and available, but it is provided on an \"as is\" and \"as available\" basis. To the fullest extent permitted by law, we do not warrant that it will be uninterrupted, error-free or free of harmful components.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      paragraphs: [
        "To the extent permitted by law, First Economy is not liable for any indirect, incidental or consequential loss arising from your use of, or inability to use, the Website. Nothing in these terms limits liability that cannot be limited by law.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of India. Subject to applicable law, the courts at Mumbai have exclusive jurisdiction over any dispute arising from them.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      paragraphs: [
        "We may update these terms from time to time. The \"Last updated\" date above shows when they were last revised, and continued use of the Website after a change means you accept the updated terms.",
      ],
    },
  ],
  contactNote: `Questions about these terms? Email ${contactInfo.email} or write to First Economy Private Limited, Mumbai, India.`,
};

export const cookiePolicyContent: LegalDocumentContent = {
  title: "Cookie Policy",
  eyebrow: "Legal",
  lastUpdated: "23 October 2026",
  intro:
    "This Cookie Policy explains how the First Economy website uses cookies and similar technologies, and how you can control them. It should be read with our Privacy Policy.",
  sections: [
    {
      id: "what-are-cookies",
      title: "What cookies are",
      paragraphs: [
        "Cookies are small text files stored on your device when you visit a website. Similar technologies, such as local storage and tracking tags, do the same job. They help a site work, remember your choices and understand how it is used.",
      ],
    },
    {
      id: "types",
      title: "The cookies we use",
      paragraphs: ["We group the technologies we use into three categories:"],
      bullets: [
        "Essential: needed for the Website to work and to remember your cookie choice. These are always on and do not need consent.",
        "Analytics: help us understand which pages are visited and how the Website performs, so we can improve it. These are set only if you accept.",
        "Marketing: used to measure the effect of our campaigns and, where enabled, to show relevant ads. These are set only if you accept.",
      ],
    },
    {
      id: "third-parties",
      title: "Third parties",
      paragraphs: [
        "Analytics and marketing tags are loaded through Google Tag Manager and may set cookies from Google (for example Google Analytics). Embedded videos and social links may also set their own cookies when you use them. Those providers have their own privacy policies.",
      ],
    },
    {
      id: "your-choices",
      title: "Your choices",
      paragraphs: [
        "When you first visit, a banner lets you accept or reject analytics and marketing cookies. Until you choose, those cookies stay off. You can change your mind at any time using the \"Cookie settings\" link in the footer.",
        "You can also block or delete cookies in your browser settings. Doing so may stop parts of the Website from working as intended.",
      ],
    },
    {
      id: "retention",
      title: "How long your choice is kept",
      paragraphs: [
        "We save your cookie choice in your browser so we do not ask on every visit. If you clear your browser data, the banner will appear again.",
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      paragraphs: [
        "We may update this policy as the Website or the law changes. The \"Last updated\" date above shows the latest revision.",
      ],
    },
  ],
  contactNote: `Questions about cookies? Email ${contactInfo.email} or write to First Economy Private Limited, Mumbai, India.`,
};
