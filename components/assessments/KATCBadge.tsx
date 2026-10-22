import { katcLabels, type KATCCategory } from "@/data/linesAndPlanesData";

type KATCBadgeProps = {
  category: KATCCategory;
  showLabel?: boolean;
  appearance?: "dark" | "paper";
};

export function KATCBadge({ category, showLabel = false, appearance = "dark" }: KATCBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 border px-2.5 py-1 text-sm leading-6 ${appearance === "paper" ? "border-slate-300 bg-white text-slate-700" : "border-sky-400/25 bg-sky-400/[0.065] text-sky-200"}`} title={katcLabels[category]}>
      <span className="font-semibold">{category}</span>
      {showLabel && <span>{katcLabels[category]}</span>}
    </span>
  );
}
