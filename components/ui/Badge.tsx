import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "accent";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] ${
        tone === "accent"
          ? "border-sky-400/35 bg-sky-400/10 text-sky-300"
          : "border-white/15 bg-white/[0.035] text-zinc-400"
      }`}
    >
      {children}
    </span>
  );
}
