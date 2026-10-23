import type { Metadata } from "next";
import Link from "next/link";

import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Set a new password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div>
        <p className="text-eyebrow m-0">Link not valid</p>
        <h1 className="text-display-md mt-4 m-0 text-ink">Try again</h1>
        <div className="admin-accent-rule mt-5" aria-hidden />
        <p className="text-body-sm mt-5 m-0 text-muted">
          This reset link is missing its token. Request a new one.
        </p>
        <Link href="/admin/forgot-password" className="admin-btn admin-btn-primary mt-8 w-full">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-eyebrow m-0">Almost there</p>
      <h1 className="text-display-md mt-4 m-0 text-ink">Set a password</h1>
      <div className="admin-accent-rule mt-5" aria-hidden />
      <p className="text-body-sm mt-5 m-0 text-muted">
        Choose a password with at least 10 characters, mixed case and a number.
      </p>

      <ResetPasswordForm token={token} />
    </div>
  );
}
