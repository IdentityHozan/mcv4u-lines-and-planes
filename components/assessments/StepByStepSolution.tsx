import { Accordion } from "@/components/ui/Accordion";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import type { SolutionStep } from "@/data/linesAndPlanesData";

type StepByStepSolutionProps = {
  steps: SolutionStep[];
  answer?: string;
  defaultOpen?: boolean;
  title?: string;
};

export function StepByStepSolution({
  steps,
  answer,
  defaultOpen = false,
  title = "View typed solution",
}: StepByStepSolutionProps) {
  return (
    <Accordion
      defaultOpen={defaultOpen}
      title={
        <span className="text-sm font-semibold text-zinc-300">{title}</span>
      }
      className="bg-[#0d0d0d]"
    >
      <ol className="space-y-5">
        {steps.map((step, index) => (
          <li key={`${step.label}-${index}`} className="grid gap-3 sm:grid-cols-[32px_1fr]">
            <span className="grid h-8 w-8 place-items-center border border-white/10 font-mono text-[10px] text-sky-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-200">{step.label}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-500">{step.text}</p>
              {step.math && <MathJaxRenderer math={step.math} className="mt-3 text-sm text-zinc-200" />}
            </div>
          </li>
        ))}
      </ol>
      {answer && (
        <div className="mt-6 border-l-2 border-sky-400 bg-sky-400/[0.055] p-4">
          <p className="micro-label text-sky-300">Final answer</p>
          <MathJaxRenderer math={answer} className="mt-2 text-sm text-zinc-200" />
        </div>
      )}
    </Accordion>
  );
}
