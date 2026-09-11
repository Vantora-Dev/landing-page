import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  /** The ground the button sits on, which flips its palette. */
  tone?: "light" | "dark";
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

/**
 * Every CTA on this site is a link to the booking section — there is no
 * checkout and no signup, so there are no submit-style buttons here.
 * Minimum 44px tall for thumbs.
 */
const base =
  "inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-md px-6 text-[0.9375rem] font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] active:translate-y-px";

const variants: Record<"light" | "dark", Record<"primary" | "secondary", string>> = {
  dark: {
    // Amber on ink: the accent's one loud moment on the page.
    primary: "bg-signal text-ink-950 hover:bg-[#fcd34d]",
    secondary:
      "border border-ink-700 bg-transparent text-paper hover:border-graphite-400 hover:bg-white/[0.04]",
  },
  light: {
    primary: "bg-ink-950 text-paper hover:bg-ink-800",
    secondary:
      "border border-line bg-transparent text-graphite-900 hover:border-graphite-400 hover:bg-black/[0.03]",
  },
};

export function Button({
  href,
  children,
  variant = "primary",
  tone = "light",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <a
      href={href}
      className={`${base} ${variants[tone][variant]} ${className}`}
      {...rest}
    >
      {children}
    </a>
  );
}
