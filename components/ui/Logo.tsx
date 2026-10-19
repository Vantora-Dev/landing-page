import { useId } from "react";
import {
  LOGO_COLORS,
  LOGO_HEIGHT,
  LOGO_WIDTH,
  MARK,
  WORDMARK,
  WORDMARK_TRANSFORM,
  type LogoTone,
} from "@/lib/logo";
import { site } from "@/lib/site";

/**
 * The letterhead logo, inline so it paints with the HTML. `tone` is the
 * background it sits on: on dark, "Laundro" turns paper-white and the mark and
 * "Grid" keep their colours. Height comes from `className`; width follows.
 */
export function Logo({ tone, className = "" }: { tone: LogoTone; className?: string }) {
  // Header and footer both draw the logo, so the gradient id must be unique.
  const gradientId = `lg-mark-${useId().replace(/:/g, "")}`;
  const { stem } = MARK;
  return (
    <svg
      viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}
      role="img"
      aria-label={site.name}
      className={`w-auto ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="96" y2="104">
          <stop offset="0" stopColor={LOGO_COLORS.markFrom} />
          <stop offset="0.55" stopColor={LOGO_COLORS.markMid} />
          <stop offset="1" stopColor={LOGO_COLORS.markTo} />
        </linearGradient>
      </defs>
      <path fill={`url(#${gradientId})`} d={MARK.outline} />
      <rect
        fill={`url(#${gradientId})`}
        x={stem.x}
        y={stem.y}
        width={stem.width}
        height={stem.height}
        rx={stem.rx}
      />
      <g fill={LOGO_COLORS.orange}>
        {MARK.squares.map((s) => (
          <rect
            key={`${s.x}-${s.y}`}
            x={s.x}
            y={s.y}
            width={MARK.squareSize}
            height={MARK.squareSize}
            rx={MARK.squareRx}
          />
        ))}
      </g>
      <g transform={WORDMARK_TRANSFORM}>
        <path
          className="transition-[fill] duration-300"
          fill={tone === "dark" ? "#fafaf9" : LOGO_COLORS.indigo}
          d={WORDMARK.laundro}
        />
        <path fill={LOGO_COLORS.orange} d={WORDMARK.grid} />
      </g>
    </svg>
  );
}
