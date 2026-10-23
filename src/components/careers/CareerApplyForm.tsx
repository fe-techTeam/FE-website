"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Upload } from "lucide-react";
import GrowthCta from "@/components/GrowthCta";
import { trackEvent } from "@/lib/analytics";
import { postFormData } from "@/lib/forms/client";
import { FIELD_LIMITS, isValidEmail, validateResume } from "@/lib/forms/validation";

const fieldClass = "field-control min-h-12 bg-white px-4 py-3.5 transition-[border-color] duration-200";

type FieldName = "name" | "email" | "phone" | "resume" | "coverLetter" | "consent";

export default function CareerApplyForm({
  roleTitle,
  roleSlug,
}: {
  roleTitle: string;
  roleSlug?: string;
}) {
  const formId = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const nextErrors: Partial<Record<FieldName, string>> = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const resume = data.get("resume");
    const consent = data.get("consent") === "on";

    if (!name) nextErrors.name = "Enter your full name.";
    if (!email) nextErrors.email = "Enter your email address.";
    else if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (!phone) nextErrors.phone = "Enter your phone number.";
    if (resume instanceof File) {
      const resumeError = validateResume(resume);
      if (resumeError) nextErrors.resume = resumeError;
    } else {
      nextErrors.resume = "Upload your resume.";
    }
    if (!consent) nextErrors.consent = "Please agree to the Privacy Policy.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const order: FieldName[] = ["name", "email", "phone", "resume", "consent"];
      const firstInvalid = order.find((key) => nextErrors[key]);
      const target = firstInvalid
        ? form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        : null;
      target?.focus();
      return;
    }

    setStatus("submitting");

    data.set("roleTitle", roleTitle);
    if (roleSlug) data.set("roleSlug", roleSlug);

    const result = await postFormData("/api/careers/apply", data);

    if (!result.ok) {
      setSubmitError(result.error);
      setStatus("error");
      return;
    }

    trackEvent("generate_lead", { form: "career_application", role: roleTitle });
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div
        className="flex min-h-[20rem] flex-col justify-center border border-line bg-white px-6 py-10 sm:px-8"
        role="status"
        aria-live="polite"
      >
        <h3 className="font-display m-0 text-2xl tracking-wide uppercase">Application received</h3>
        <p className="text-body mt-3 mb-0 max-w-[24rem] text-muted">
          Thank you for applying for the {roleTitle} role. Our team will review your application and get back to you
          soon.
        </p>
      </div>
    );
  }

  const consentId = `${formId}-consent`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-4 sm:gap-5"
      aria-label={`Application for ${roleTitle}`}
      data-role-slug={roleSlug}
    >
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden />

      <Field
        id={`${formId}-name`}
        name="name"
        label="Full Name"
        required
        autoComplete="name"
        error={errors.name}
        disabled={status === "submitting"}
      />
      <Field
        id={`${formId}-email`}
        name="email"
        type="email"
        label="Email Address"
        required
        autoComplete="email"
        error={errors.email}
        disabled={status === "submitting"}
      />
      <Field
        id={`${formId}-phone`}
        name="phone"
        type="tel"
        label="Phone Number"
        required
        autoComplete="tel"
        error={errors.phone}
        disabled={status === "submitting"}
      />

      <div className="relative min-w-0">
        <label htmlFor={`${formId}-resume`} className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            Resume / CV <span className="text-red">*</span>
          </span>
          <span
            className={`flex min-h-[7.5rem] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed bg-white px-4 py-6 text-center transition hover:border-ink ${
              errors.resume ? "border-red" : "border-line"
            }`}
          >
            <Upload size={24} className="text-muted" aria-hidden />
            <span className="text-body-sm text-ink">
              <span className="text-red">Click to upload</span> or drag and drop
            </span>
            <span className="text-body-sm text-muted">PDF, DOC, DOCX (Max. 5MB)</span>
          </span>
        </label>
        <input
          id={`${formId}-resume`}
          name="resume"
          type="file"
          disabled={status === "submitting"}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          aria-invalid={errors.resume ? true : undefined}
          aria-describedby={errors.resume ? `${formId}-resume-error` : undefined}
        />
        {errors.resume ? (
          <p id={`${formId}-resume-error`} className="mt-1.5 text-sm text-red" role="alert">
            {errors.resume}
          </p>
        ) : null}
      </div>

      <div className="relative min-w-0">
        <label htmlFor={`${formId}-cover-letter`} className="mb-1.5 block text-sm font-medium text-ink">
          Cover Letter <span className="font-normal text-muted">(Optional)</span>
        </label>
        <textarea
          id={`${formId}-cover-letter`}
          name="coverLetter"
          rows={4}
          maxLength={FIELD_LIMITS.coverLetter}
          disabled={status === "submitting"}
          placeholder="Tell us why you’re a great fit for this role"
          className={`${fieldClass} min-h-[6.5rem] resize-y`}
        />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={consentId}
            type="checkbox"
            name="consent"
            required
            disabled={status === "submitting"}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${formId}-consent-error` : undefined}
            className="contact-check mt-[0.15em]"
          />
          <label htmlFor={consentId} className="min-w-0 cursor-pointer text-sm leading-snug text-muted">
            I agree to the{" "}
            <Link
              href="/privacy-policy"
              className="text-red underline-offset-2 transition hover:underline focus-visible:rounded-sm focus-visible:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {errors.consent ? (
          <p id={`${formId}-consent-error`} className="mt-1.5 text-sm text-red" role="alert">
            {errors.consent}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className="text-body-sm m-0 text-red" role="alert">
          {submitError}
        </p>
      ) : null}

      <GrowthCta
        type="submit"
        variant="accent"
        block
        loading={status === "submitting"}
      >
        {status === "submitting" ? "Submitting…" : "Submit application"}
      </GrowthCta>

      <p className="text-body-sm m-0 text-muted">
        Your information is secure and will only be used to process your application in line with our{" "}
        <Link href="/privacy-policy" className="text-red underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  required,
  type = "text",
  autoComplete,
  error,
  disabled,
}: {
  id: string;
  name: FieldName;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required ? <span className="text-red"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        placeholder={label}
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${fieldClass}${error ? " border-red" : ""}`}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
