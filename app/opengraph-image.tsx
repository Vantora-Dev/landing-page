import { ImageResponse } from "next/og";

/**
 * Generated at build time. Deliberately typographic — the same restraint as
 * the page, and it stays legible at the small size a link preview actually
 * gets rendered at.
 */
export const alt =
  "LaundroGrid — your laundromat has customers, it doesn't have a customer list.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLS = 12;
const ROWS = 5;

export default function OpengraphImage() {
  // A flattened echo of the hero grid: cold nodes, warming toward the right.
  const dots = Array.from({ length: COLS * ROWS }, (_, index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);
    const wave = 0.6 * (col / (COLS - 1)) + 0.4 * (row / (ROWS - 1));
    const known = wave < 0.52;
    return { col, row, known };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080a",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* Node field, top-right — clear of the headline at every line length */}
        <div
          style={{
            position: "absolute",
            right: 64,
            top: 56,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {Array.from({ length: ROWS }, (_, row) => (
            <div key={row} style={{ display: "flex", flexDirection: "row" }}>
              {dots
                .filter((dot) => dot.row === row)
                .map((dot) => (
                  <div
                    key={dot.col}
                    style={{
                      width: 9,
                      height: 9,
                      margin: 8,
                      borderRadius: 2,
                      background: dot.known ? "#fbbf24" : "#26262c",
                      opacity: dot.known ? 0.9 : 1,
                    }}
                  />
                ))}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 34, height: 3, background: "#fbbf24" }} />
          <div
            style={{
              marginLeft: 18,
              color: "#a1a1aa",
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            LaundroGrid
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 950 }}>
          <div
            style={{
              color: "#a1a1aa",
              fontSize: 60,
              lineHeight: 1.1,
              letterSpacing: -1.8,
            }}
          >
            Your laundromat has customers.
          </div>
          <div
            style={{
              color: "#fafaf9",
              fontSize: 60,
              lineHeight: 1.1,
              letterSpacing: -1.8,
            }}
          >
            It doesn&apos;t have a customer list.
          </div>
          <div
            style={{
              marginTop: 34,
              color: "#a1a1aa",
              fontSize: 26,
              lineHeight: 1.45,
              maxWidth: 700,
            }}
          >
            We install and run the system that turns anonymous walk-ins into
            members who pay every month.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
