import { jsonError, jsonOk } from "@/lib/forms/api-response";
import { escapeHtml, notificationRecipients, sendNotificationEmail } from "@/lib/email/send";
import { isHoneypotFilled, isValidEmail } from "@/lib/forms/validation";
import { captureSubmission, clientIp } from "@/lib/admin/submissions";

type NewsletterPayload = {
  email?: string;
  source?: string;
  _gotcha?: string;
};

export async function POST(request: Request) {
  let body: NewsletterPayload;

  try {
    body = (await request.json()) as NewsletterPayload;
  } catch {
    return jsonError("Invalid request body.");
  }

  if (isHoneypotFilled(body._gotcha)) {
    return jsonOk("You are subscribed.");
  }

  const email = String(body.email ?? "").trim();
  const source = String(body.source ?? "website").trim();

  if (!email) return jsonError("Enter your email address.");
  if (!isValidEmail(email)) return jsonError("Enter a valid email address.");

  const recipients = notificationRecipients("hello@firsteconomy.com", "NEWSLETTER_NOTIFICATION_EMAIL");

  const result = await sendNotificationEmail({
    to: recipients,
    replyTo: email,
    subject: "Newsletter subscription request",
    html: `
      <h2>Newsletter subscription</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Source:</strong> ${escapeHtml(source)}</p>
      <p><em>Add this address to your mailing list or CRM workflow.</em></p>
    `,
  });

  // Stored so the subscriber list survives an email delivery failure.
  await captureSubmission({
    type: "NEWSLETTER",
    email,
    subject: "Newsletter subscription",
    payload: { source },
    deliveryError: result.ok ? null : result.error,
    ip: clientIp(request),
  });

  if (!result.ok) {
    return jsonError(result.error, result.status);
  }

  return jsonOk("Thanks for subscribing. You will hear from us soon.");
}
