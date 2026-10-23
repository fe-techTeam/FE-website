import type { Metadata, Viewport } from "next";
import { Archivo, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL, isNoIndex } from "@/lib/seo";
import { GOOGLE_SITE_VERIFICATION } from "@/lib/tracking";

/**
 * Minimal root layout. The public site's chrome (Preloader, Header, Footer)
 * lives in `(site)/layout.tsx` so the admin panel at `/admin` can render its
 * own shell without inheriting it.
 */

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "First Economy — Integrated Digital Marketing Agency in India",
    template: "%s | First Economy",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // "./" resolves against each route, so every page gets a self-referencing canonical.
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    url: "./",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "First Economy — Growth Systems" }],
  },
  twitter: { card: "summary_large_image", images: [DEFAULT_OG_IMAGE] },
  // Search Console ownership, carried over from the live site so the verified property keeps working after cutover.
  verification: { google: GOOGLE_SITE_VERIFICATION },
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  // Staging/preview deploys set SITE_NOINDEX=true; production leaves it unset.
  ...(isNoIndex() ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#080808",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${barlow.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Flags a first-in-session home load before first paint so the preloader overlay shows with no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(location.pathname==="/"&&!sessionStorage.getItem("fe-preloaded"))document.documentElement.setAttribute("data-preload","1")}catch(e){}',
          }}
        />
      </head>
      <body className="flex min-h-full flex-col overflow-x-hidden bg-paper text-ink">{children}</body>
    </html>
  );
}
