import type { Metadata, Viewport } from "next";
import { geistMono, geistSans } from "@/lib/fonts";
import { site } from "@/lib/site";
import { jsonLd } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Recurring revenue systems for laundromats`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "laundromat marketing",
    "laundromat website",
    "wash and fold online ordering",
    "laundry pickup and delivery software",
    "laundromat memberships",
    "laundromat customer database",
    "laundromat recurring revenue",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: "Your laundromat has customers. It doesn't have a customer list.",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Your laundromat has customers. It doesn't have a customer list.",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  /**
   * Only emitted when the env var is set. The DNS TXT route in Search Console
   * is preferable (it verifies the whole domain, including subdomains, and
   * survives a redeploy), but this is here for the HTML-tag route.
   */
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  category: "business",
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Matches the dark hero so mobile browser chrome doesn't flash white.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Opts back in to Next's scroll-behavior override on navigation
      // (changed default in Next 16) so in-page anchors stay smooth
      // without hijacking route transitions.
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-graphite-900">
        <a
          href="#main"
          className="on-dark sr-only rounded-sm bg-ink-950 px-4 py-2 text-sm font-medium text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, build-time constant — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
