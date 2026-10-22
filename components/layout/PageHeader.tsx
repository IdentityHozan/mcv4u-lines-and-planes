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
      <ScrollReveal className="section-shell py-8 sm:py-11">
        <div className="max-w-4xl">
          <p className="micro-label text-sky-300">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">{description}</p>
          {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </ScrollReveal>
    </header>
  );
}
