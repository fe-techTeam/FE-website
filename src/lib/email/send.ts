type EmailAttachment = {
  filename: string;
  content: string;
};

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

type SendEmailResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

function getFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "First Economy <onboarding@resend.dev>";
}

export async function sendNotificationEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email:dev] Notification skipped — RESEND_API_KEY is not set.", {
        to: input.to,
        subject: input.subject,
        replyTo: input.replyTo,
        attachments: input.attachments?.map((file) => file.filename),
      });
      return { ok: true };
    }
    return {
      ok: false,
      error: "Our message service is temporarily unavailable. Please email us directly.",
      status: 503,
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
      reply_to: input.replyTo,
      attachments: input.attachments,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[email] Resend API error:", response.status, detail);
    return {
      ok: false,
      error: "We could not send your message right now. Please try again or contact us directly.",
      status: 502,
    };
  }

  return { ok: true };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function notificationRecipients(fallback: string, envKey: string): string[] {
  const configured = process.env[envKey]?.trim();
  if (configured) return configured.split(",").map((email) => email.trim()).filter(Boolean);
  return [fallback];
}
