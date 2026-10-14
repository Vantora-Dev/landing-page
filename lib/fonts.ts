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

/**
 * Instrument Serif carries the large headlines (h1 and section h2s) only.
 * Geist stays on everything else. A serif at display size is what moves the
 * page from "default Next.js startup" to something that looks considered,
 * and it's cheap: one weight, upright plus italic, latin subset.
 *
 * The italic is used for the turn in the hero ("We bring them back.").
 */
export const displaySerif = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-instrument-serif",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});
