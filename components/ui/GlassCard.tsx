import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  accent?: boolean;
};

export function GlassCard({ children, accent, className = "", ...props }: GlassCardProps) {
  return (
    <div
      className={`border bg-[#121212]/90 ${
        accent ? "border-sky-400/30" : "border-white/10"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
