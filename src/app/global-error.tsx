"use client";

import { useEffect } from "react";
import { Archivo, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${archivo.variable} ${barlow.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-paper text-ink">
        <main id="main-content" className="flex-1" tabIndex={-1}>
          <section className="section-shell section-pad bg-paper" aria-labelledby="global-error-heading">
            <div className="section-inner max-w-2xl">
              <p className="text-eyebrow m-0 text-red">Error</p>
              <h1 id="global-error-heading" className="text-display-md mt-4 m-0 text-balance">
                Something went wrong.
              </h1>
              <p className="text-body mt-5 m-0 max-w-lg text-muted">
                We hit an unexpected problem. Try again, or return home.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={retry}
                  className="text-cta tap-target inline-flex min-h-12 w-full max-w-full items-center justify-center gap-3 bg-red px-5 py-3.5 text-white transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto"
                >
                  Try again
                </button>
                <a
                  href="/"
                  className="text-cta tap-target inline-flex min-h-12 w-full items-center justify-center border border-ink/25 px-5 py-3.5 text-ink transition hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto"
                >
                  Back to home
                </a>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
