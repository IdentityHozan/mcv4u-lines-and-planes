import { katcLabels, type KATCCategory } from "@/data/linesAndPlanesData";

type KATCBadgeProps = {
  category: KATCCategory;
  showLabel?: boolean;
};

export function KATCBadge({ category, showLabel = false }: KATCBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 border border-sky-400/25 bg-sky-400/[0.065] px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-sky-300"
      title={katcLabels[category]}
    >
      [{category}]
      {showLabel && <span className="hidden normal-case tracking-normal text-zinc-400 sm:inline">{katcLabels[category]}</span>}
    </span>
  );
}
