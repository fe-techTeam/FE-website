import type { Metadata } from "next";
import Link from "next/link";

import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div>
      <p className="text-eyebrow m-0">Welcome back</p>
      <h1 className="text-display-md mt-4 m-0 text-ink">Sign in</h1>
      <div className="admin-accent-rule mt-5" aria-hidden />
      <p className="text-body-sm mt-5 m-0 text-muted">
        Use the email address your account was created with.
      </p>

      <LoginForm next={next} />

      <p className="text-body-sm mt-8 m-0 border-t border-line pt-5 text-muted">
        Forgotten your password?{" "}
        <Link
          href="/admin/forgot-password"
          className="font-semibold text-ink underline underline-offset-4 transition hover:text-red"
        >
          Reset it
        </Link>
      </p>
    </div>
  );
}
