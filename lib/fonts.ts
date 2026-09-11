import localFont from "next/font/local";

/**
 * Geist, self-hosted from the `geist` package rather than imported through it,
 * so the two faces can be prioritised differently.
 *
 * Geist Sans carries every headline and is preloaded. Geist Mono appears only
 * in small labels and the diagram, so it is *not* preloaded — a second 71KB
 * font competing with the first on a phone pushes the headline's paint later
 * for no visible gain.
 */
export const geistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

export const geistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
