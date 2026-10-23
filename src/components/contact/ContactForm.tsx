"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import GrowthCta from "@/components/GrowthCta";
import { contactFormCopy, contactInterests } from "@/content/contact";
import { trackEvent } from "@/lib/analytics";
import { postJson } from "@/lib/forms/client";
import { FIELD_LIMITS, isValidEmail } from "@/lib/forms/validation";

const fieldClass =
  "field-control min-h-12 bg-white px-4 py-3.5 transition-[border-color] duration-200";

type FieldName = "name" | "email" | "phone" | "company" | "interest" | "requirement" | "consent";

export default function ContactForm() {
  const formId = useId();
  const consentId = `${formId}-consent`;
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
    const company = String(data.get("company") ?? "").trim();
    const requirement = String(data.get("requirement") ?? "").trim();
    const consent = data.get("consent") === "on";

    if (!name) nextErrors.name = "Enter your full name.";
    if (!email) nextErrors.email = "Enter your email address.";
    else if (!isValidEmail(email)) nextErrors.email = "Enter a valid email address.";
    if (!phone) nextErrors.phone = "Enter your phone number.";
    if (!company) nextErrors.company = "Enter your company name.";
    if (!requirement) nextErrors.requirement = "Tell us about your requirement.";
    if (!consent) nextErrors.consent = "Please agree to the Privacy Policy.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const order: FieldName[] = ["name", "email", "phone", "company", "interest", "requirement", "consent"];
      const firstInvalid = order.find((key) => nextErrors[key]);
      const target = firstInvalid
        ? form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        : null;
      target?.focus();
      return;
    }

    setStatus("submitting");

    const result = await postJson("/api/contact", {
      name,
      email,
      phone,
      company,
      interest: String(data.get("interest") ?? "").trim(),
      requirement,
      consent: true,
      _gotcha: String(data.get("_gotcha") ?? "").trim(),
    });

    if (!result.ok) {
      setSubmitError(result.error);
      setStatus("error");
      return;
    }

    trackEvent("generate_lead", { form: "contact" });
    setStatus("submitted");
  }

  if (status === "submitted") {
    return (
      <div
        className="flex min-h-[22rem] flex-col justify-center border border-line bg-white px-6 py-10 sm:px-8"
        role="status"
        aria-live="polite"
      >
        <p className="font-display m-0 text-3xl tracking-wide uppercase">{contactFormCopy.successTitle}</p>
        <p className="text-body mt-3 mb-0 max-w-[28rem] text-muted">{contactFormCopy.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
      aria-describedby={
        Object.keys(errors).length || submitError ? `${formId}-error-summary` : undefined
      }
    >
      {Object.keys(errors).length > 0 || submitError ? (
        <p id={`${formId}-error-summary`} className="sr-only" role="alert">
          {submitError ?? "Please fix the highlighted fields and try again."}
        </p>
      ) : null}

      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden />

      <Field
        id={`${formId}-name`}
        name="name"
        label="Full Name"
        required
        autoComplete="name"
        error={errors.name}
        disabled={status === "submitting"}
        maxLength={FIELD_LIMITS.name}
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
        maxLength={FIELD_LIMITS.email}
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
        maxLength={FIELD_LIMITS.phone}
      />
      <Field
        id={`${formId}-company`}
        name="company"
        label="Company Name"
        required
        autoComplete="organization"
        error={errors.company}
        disabled={status === "submitting"}
        maxLength={FIELD_LIMITS.company}
      />

      <div className="relative min-w-0">
        <label htmlFor={`${formId}-interest`} className="mb-1.5 block text-sm font-medium text-ink">
          Your Interest
        </label>
        <select
          id={`${formId}-interest`}
          name="interest"
          defaultValue=""
          disabled={status === "submitting"}
          className={`${fieldClass} appearance-auto pr-10`}
        >
          <option value="" disabled>
            Select an interest
          </option>
          {contactInterests.map((interest) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
        </select>
      </div>

      <div className="relative min-w-0 sm:col-span-2">
        <label htmlFor={`${formId}-requirement`} className="mb-1.5 block text-sm font-medium text-ink">
          Your requirement <span className="text-red">*</span>
        </label>
        <textarea
          id={`${formId}-requirement`}
          name="requirement"
          required
          rows={5}
          maxLength={FIELD_LIMITS.requirement}
          disabled={status === "submitting"}
          placeholder="Tell us about your requirement"
          aria-invalid={errors.requirement ? true : undefined}
          aria-describedby={errors.requirement ? `${formId}-requirement-error` : undefined}
          className={`${fieldClass} min-h-[8.5rem] resize-y`}
        />
        {errors.requirement ? (
          <p id={`${formId}-requirement-error`} className="mt-1.5 text-sm text-red" role="alert">
            {errors.requirement}
          </p>
        ) : null}
      </div>

      <div className="sm:col-span-2">
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
        <p className="text-body-sm m-0 text-red sm:col-span-2" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <GrowthCta
          type="submit"
          variant="primary"
          block
          loading={status === "submitting"}
        >
          {status === "submitting" ? "Sending…" : contactFormCopy.submit}
        </GrowthCta>
      </div>
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
  maxLength,
}: {
  id: string;
  name: FieldName;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
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
        maxLength={maxLength}
        placeholder={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={fieldClass}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
