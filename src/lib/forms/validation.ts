const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function trimRequired(value: unknown, fieldLabel: string): string | { error: string } {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return { error: `Enter your ${fieldLabel.toLowerCase()}.` };
  return trimmed;
}

export function isHoneypotFilled(value: unknown): boolean {
  return String(value ?? "").trim().length > 0;
}

/** Max lengths enforced on both client (maxLength) and server, so oversized payloads never reach email/DB. */
export const FIELD_LIMITS = {
  name: 120,
  email: 254,
  phone: 30,
  company: 160,
  interest: 120,
  requirement: 4000,
  coverLetter: 4000,
  roleTitle: 200,
  roleSlug: 120,
} as const;

/** Returns an error message for the first field whose trimmed value exceeds its limit, else null. */
export function findOverLimit(values: Partial<Record<keyof typeof FIELD_LIMITS, string>>): string | null {
  for (const [field, value] of Object.entries(values) as [keyof typeof FIELD_LIMITS, string][]) {
    if ((value ?? "").length > FIELD_LIMITS[field]) {
      return `Keep your ${field.replace(/([A-Z])/g, " $1").toLowerCase()} under ${FIELD_LIMITS[field]} characters.`;
    }
  }
  return null;
}

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const RESUME_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export const RESUME_ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function validateResume(file: File | null): string | null {
  if (!file || !file.size) return "Upload your resume.";
  if (file.size > RESUME_MAX_BYTES) return "Resume must be 5MB or smaller.";
  const lowerName = file.name.toLowerCase();
  const extensionOk = RESUME_ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  if (!RESUME_ALLOWED_TYPES.has(file.type) || !extensionOk) return "Upload a PDF, DOC, or DOCX file.";
  return null;
}
