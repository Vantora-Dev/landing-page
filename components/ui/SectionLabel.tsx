type SectionLabelProps = {
  children: string;
  tone?: "light" | "dark";
  className?: string;
};

/** Mono, uppercase, accent rule. The only recurring ornament on the page. */
export function SectionLabel({
  children,
  tone = "light",
  className = "",
}: SectionLabelProps) {
  return (
    <p
      className={`type-label flex items-center gap-3 ${
        tone === "dark" ? "text-graphite-400" : "text-graphite-600"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-px w-6 ${tone === "dark" ? "bg-signal" : "bg-signal-deep"}`}
      />
      {children}
    </p>
  );
}
