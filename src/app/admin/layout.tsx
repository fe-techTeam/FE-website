import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · First Economy Admin",
  },
  robots: { index: false, follow: false },
};

/**
 * The admin panel renders directly inside the root layout, without the public
 * site's header, footer or page-reveal animations. Auth is enforced one level
 * down in `(panel)/layout.tsx`; the `(auth)` group stays reachable signed out.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  // `data-admin` scopes the admin design tokens in src/styles/admin.css.
  return (
    <div data-admin className="flex min-h-dvh flex-col bg-paper">
      {children}
    </div>
  );
}
