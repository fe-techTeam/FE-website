import type { Metadata } from "next";
import Link from "next/link";

import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <p className="text-eyebrow m-0">Account recovery</p>
      <h1 className="text-display-md mt-4 m-0 text-ink">Reset password</h1>
      <div className="admin-accent-rule mt-5" aria-hidden />
      <p className="text-body-sm mt-5 m-0 text-muted">
        We will send a link to set a new password. It expires in an hour.
      </p>

      <ForgotPasswordForm />

      <p className="text-body-sm mt-8 m-0 border-t border-line pt-5 text-muted">
        <Link
          href="/admin/login"
          className="font-semibold text-ink underline underline-offset-4 transition hover:text-red"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
