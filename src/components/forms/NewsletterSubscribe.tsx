"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { postJson } from "@/lib/forms/client";
import { isValidEmail } from "@/lib/forms/validation";

type NewsletterSubscribeProps = {
  inputId?: string;
  source?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export default function NewsletterSubscribe({
  inputId,
  source = "insights",
  className = "mt-4 flex gap-0 border border-line bg-white",
  inputClassName = "field-control min-h-12 min-w-0 flex-1 border-0 bg-transparent px-4 py-3",
  buttonClassName = "tap-target grid w-12 flex-none place-items-center bg-ink text-white transition hover:bg-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red",
}: NewsletterSubscribeProps) {
  const generatedId = useId();
  const emailId = inputId ?? generatedId;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const gotcha = String(data.get("_gotcha") ?? "").trim();

    if (!email) {
      setError("Enter your email address.");
      setStatus("error");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const result = await postJson("/api/newsletter", {
      email,
      source,
      _gotcha: gotcha,
    });

    if (!result.ok) {
      setError(result.error);
      setStatus("error");
      return;
    }

    form.reset();
    setSuccessMessage(result.message);
    setStatus("success");
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={className} noValidate>
        <label htmlFor={emailId} className="sr-only">
          Email address for newsletter
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
          disabled={status === "submitting"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${emailId}-error` : successMessage ? `${emailId}-success` : undefined}
          className={inputClassName}
        />
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden />
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-label="Subscribe to newsletter"
          className={buttonClassName}
        >
          <ArrowRight size={18} aria-hidden />
        </button>
      </form>
      {error ? (
        <p id={`${emailId}-error`} className="text-body-sm mt-2 mb-0 text-red" role="alert">
          {error}
        </p>
      ) : null}
      {successMessage ? (
        <p id={`${emailId}-success`} className="text-body-sm mt-2 mb-0 text-muted" role="status">
          {successMessage}
        </p>
      ) : null}
    </div>
  );
}
