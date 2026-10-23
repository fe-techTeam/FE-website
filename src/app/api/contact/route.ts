import { jsonError, jsonOk } from "@/lib/forms/api-response";
import { escapeHtml, notificationRecipients, sendNotificationEmail } from "@/lib/email/send";
import { findOverLimit, isHoneypotFilled, isValidEmail } from "@/lib/forms/validation";
import { captureSubmission, clientIp } from "@/lib/admin/submissions";

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  interest?: string;
  requirement?: string;
  consent?: boolean;
  _gotcha?: string;
};

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return jsonError("Invalid request body.");
  }

  if (isHoneypotFilled(body._gotcha)) {
    return jsonOk("Message sent.");
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const company = String(body.company ?? "").trim();
  const interest = String(body.interest ?? "").trim();
  const requirement = String(body.requirement ?? "").trim();
  const consent = body.consent === true;

  if (!name) return jsonError("Enter your full name.");
  if (!email) return jsonError("Enter your email address.");
  if (!isValidEmail(email)) return jsonError("Enter a valid email address.");
  if (!phone) return jsonError("Enter your phone number.");
  if (!company) return jsonError("Enter your company name.");
  if (!requirement) return jsonError("Tell us about your requirement.");
  if (!consent) return jsonError("Please agree to the Privacy Policy.");

  const overLimit = findOverLimit({ name, email, phone, company, interest, requirement });
  if (overLimit) return jsonError(overLimit);

  const recipients = notificationRecipients("hello@firsteconomy.com", "CONTACT_NOTIFICATION_EMAIL");

  const result = await sendNotificationEmail({
    to: recipients,
    replyTo: email,
    subject: `Website enquiry — ${company}`,
    html: `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Company:</strong> ${escapeHtml(company)}</p>
      <p><strong>Interest:</strong> ${escapeHtml(interest || "Not specified")}</p>
      <p><strong>Requirement:</strong></p>
      <p>${escapeHtml(requirement).replace(/\n/g, "<br />")}</p>
      <p><em>Submitted via firsteconomy.com contact form. User consented to the Privacy Policy.</em></p>
    `,
  });

  // Stored regardless of email delivery so nothing is lost if Resend fails.
  await captureSubmission({
    type: "CONTACT",
    name,
    email,
    phone,
    company,
    subject: `Website enquiry — ${company}`,
    message: requirement,
    payload: { interest: interest || null },
    deliveryError: result.ok ? null : result.error,
    ip: clientIp(request),
  });

  if (!result.ok) {
    return jsonError(result.error, result.status);
  }

  return jsonOk("Thank you. Our team will get back to you within 24 working hours.");
}
