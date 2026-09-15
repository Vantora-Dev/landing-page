import { site } from "@/lib/site";

/**
 * A phone number is only useful if it dials. On a phone this opens the
 * dialler; on a desktop it hands off to whatever handles tel: (or can simply
 * be read off the screen), so the number stays visible in the label rather
 * than hiding behind a generic "Call us".
 */
export function CallButton({
  tone = "primary",
  className = "",
}: {
  tone?: "primary" | "quiet";
  className?: string;
}) {
  const palette =
    tone === "primary"
      ? "bg-signal text-ink-950 hover:bg-[#fcd34d]"
      : "border border-ink-700 text-paper hover:border-graphite-400 hover:bg-white/[0.06]";

  return (
    <a
      href={`tel:${site.phoneHref}`}
      className={`inline-flex min-h-[3.25rem] items-center justify-center gap-3 rounded-md px-6 text-[1.0625rem] font-medium tracking-[-0.01em] transition-colors ${palette} ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="h-[1.05rem] w-[1.05rem] shrink-0"
        fill="currentColor"
      >
        <path d="M5.2 1.6a1.3 1.3 0 0 1 1.75.34l1.2 1.7a1.3 1.3 0 0 1-.2 1.72l-.83.73a7.6 7.6 0 0 0 3.06 3.06l.73-.83a1.3 1.3 0 0 1 1.72-.2l1.7 1.2a1.3 1.3 0 0 1 .34 1.75l-.8 1.3a1.9 1.9 0 0 1-2.1.85C8.3 12.2 3.8 7.7 2.85 4.23a1.9 1.9 0 0 1 .85-2.1l1.5-.53z" />
      </svg>
      Call {site.phone}
    </a>
  );
}
