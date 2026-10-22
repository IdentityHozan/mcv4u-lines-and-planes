import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import type { SolutionStep } from "@/data/linesAndPlanesData";

type StepByStepSolutionProps = {
  steps: SolutionStep[];
  answer?: string;
  defaultOpen?: boolean;
  title?: string;
  appearance?: "dark" | "paper";
};

export function StepByStepSolution({ steps, answer, defaultOpen = false, title = "View worked solution", appearance = "dark" }: StepByStepSolutionProps) {
  const paper = appearance === "paper";
  return (
    <details open={defaultOpen} className={`border ${paper ? "border-slate-300 bg-white text-slate-800" : "border-white/15 bg-[#111] text-zinc-200"}`}>
      <summary className={`cursor-pointer p-5 text-base font-semibold ${paper ? "text-slate-900" : "text-zinc-100"}`}>{title}</summary>
      <div className={`border-t p-5 sm:p-6 ${paper ? "border-slate-300" : "border-white/15"}`}>
        <ol className="space-y-7">
          {steps.map((step, index) => (
            <li key={`${step.label}-${index}`} className="grid grid-cols-[32px_1fr] gap-3 sm:gap-4">
              <span className={`grid h-8 w-8 place-items-center border text-sm font-semibold ${paper ? "border-slate-300 text-sky-900" : "border-white/20 text-sky-200"}`}>{index + 1}</span>
              <div className="min-w-0"><MathJaxRenderer math={step.label} className="text-base font-semibold leading-7" /><MathJaxRenderer math={step.text} className={`mt-2 text-base leading-8 ${paper ? "text-slate-700" : "text-zinc-300"}`} />{step.math && <MathJaxRenderer math={step.math} className="mt-3 text-base leading-8 sm:text-lg" />}</div>
            </li>
          ))}
        </ol>
        {answer && <div className={`mt-7 border-l-4 p-5 ${paper ? "border-sky-800 bg-sky-50" : "border-sky-400 bg-sky-400/[0.055]"}`}><p className="text-base font-semibold">Final answer</p><MathJaxRenderer math={answer} className="mt-3 text-base leading-8" /></div>}
      </div>
    </details>
  );
}
