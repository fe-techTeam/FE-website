import Image from "next/image";
import Link from "next/link";

/**
 * Signed-out screens. Split-panel treatment echoing the site's hero bands:
 * an ink panel with oversized display type, and the form on paper.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-ink px-10 py-12 text-white lg:flex xl:px-14">
        {/* Soft brand-red glow, in CSS rather than a 277KB decorative PNG. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 size-[34rem] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-red) 45%, transparent) 0%, transparent 68%)",
          }}
        />

        <Link href="/" className="relative z-10 inline-flex" aria-label="First Economy home">
          <Image
            src="/images/brand/fe_logo.svg"
            alt="First Economy"
            width={143}
            height={46}
            priority
            unoptimized
            className="h-11 w-auto"
          />
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-eyebrow text-eyebrow-on-dark m-0">Admin panel</p>
          <h2 className="text-display-lg mt-5 m-0 text-white text-balance">
            One place to run the growth system.
          </h2>
          <p className="text-body mt-6 m-0 text-muted-on-dark">
            Case studies, roles and every page on firsteconomy.com — drafted, reviewed and
            published from here.
          </p>
        </div>

        <p className="relative z-10 admin-label m-0 text-white/45">
          © {new Date().getFullYear()} First Economy
        </p>
      </aside>

      <main className="flex items-center justify-center bg-paper px-[var(--gutter)] py-14">
        <div className="w-full max-w-[26rem]">
          <Link href="/" className="mb-10 inline-flex lg:hidden" aria-label="First Economy home">
            <Image
              src="/images/brand/fe_logo_black.svg"
              alt="First Economy"
              width={143}
              height={46}
              priority
              unoptimized
              className="h-10 w-auto"
            />
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
