import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="industrial-grid border-b border-white/10">
      <ScrollReveal className="section-shell py-12 sm:py-16">
        <div className="max-w-4xl">
          <p className="micro-label text-sky-300">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-zinc-100 sm:text-6xl">{title}</h1>
          <p className="page-lead mt-5">{description}</p>
          {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </ScrollReveal>
    </header>
  );
}
