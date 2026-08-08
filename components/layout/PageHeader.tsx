import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="industrial-grid border-b border-white/10">
      <div className="section-shell py-14 sm:py-20">
        <p className="micro-label text-sky-300">{eyebrow}</p>
        <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.045em] text-zinc-100 sm:text-6xl">{title}</h1>
        <p className="page-lead mt-6">{description}</p>
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}
