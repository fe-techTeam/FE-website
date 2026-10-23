import { jsonError, jsonOk } from "@/lib/forms/api-response";
import { escapeHtml, notificationRecipients, sendNotificationEmail } from "@/lib/email/send";
import { findOverLimit, isHoneypotFilled, isValidEmail, validateResume } from "@/lib/forms/validation";
import { captureSubmission, clientIp } from "@/lib/admin/submissions";

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return jsonError("Invalid form submission.");
  }

  if (isHoneypotFilled(formData.get("_gotcha"))) {
    return jsonOk("Application received.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  const roleSlug = String(formData.get("roleSlug") ?? "").trim();
  const coverLetter = String(formData.get("coverLetter") ?? "").trim();
  const consent = formData.get("consent") === "on" || formData.get("consent") === "true";
  const resume = formData.get("resume");

  if (!name) return jsonError("Enter your full name.");
  if (!email) return jsonError("Enter your email address.");
  if (!isValidEmail(email)) return jsonError("Enter a valid email address.");
  if (!phone) return jsonError("Enter your phone number.");
  if (!roleTitle) return jsonError("Role information is missing. Please refresh and try again.");
  if (!consent) return jsonError("Please agree to the Privacy Policy.");

  const overLimit = findOverLimit({ name, email, phone, roleTitle, roleSlug, coverLetter });
  if (overLimit) return jsonError(overLimit);

  const resumeError =
    resume instanceof File ? validateResume(resume) : "Upload your resume.";
  if (resumeError) return jsonError(resumeError);

  const resumeFile = resume as File;
  const resumeBuffer = Buffer.from(await resumeFile.arrayBuffer());
  const resumeBase64 = resumeBuffer.toString("base64");

  const recipients = notificationRecipients("p&c@firsteconomy.com", "CAREERS_NOTIFICATION_EMAIL");

  const result = await sendNotificationEmail({
    to: recipients,
    replyTo: email,
    subject: `Career application — ${roleTitle}`,
    html: `
      <h2>New career application</h2>
      <p><strong>Role:</strong> ${escapeHtml(roleTitle)}${roleSlug ? ` (${escapeHtml(roleSlug)})` : ""}</p>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      ${
        coverLetter
          ? `<p><strong>Cover letter:</strong></p><p>${escapeHtml(coverLetter).replace(/\n/g, "<br />")}</p>`
          : "<p><strong>Cover letter:</strong> Not provided</p>"
      }
      <p><em>Resume attached. Applicant consented to Privacy Policy.</em></p>
    `,
    attachments: [
      {
        filename: resumeFile.name || "resume",
        content: resumeBase64,
      },
    ],
  });

  // Stored regardless of email delivery so no application is lost.
  await captureSubmission({
    type: "CAREER_APPLICATION",
    name,
    email,
    phone,
    subject: `Career application — ${roleTitle}`,
    message: coverLetter || null,
    payload: { roleTitle, roleSlug, resumeFilename: resumeFile.name || null },
    deliveryError: result.ok ? null : result.error,
    ip: clientIp(request),
  });

  if (!result.ok) {
    return jsonError(result.error, result.status);
  }

  return jsonOk("Thank you for applying. Our team will review your application and get back to you soon.");
}
