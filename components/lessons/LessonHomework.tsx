import { homeworkSets } from "@/data/linesAndPlanesData";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";

type LessonHomeworkProps = {
  section: string;
};

export function LessonHomework({ section }: LessonHomeworkProps) {
  const homework = homeworkSets.find((set) => set.number === section);
  if (!homework) return null;

  const headingId = `homework-${section.replace(/\./g, "-")}-title`;

  return (
    <section id="homework" aria-labelledby={headingId} className="mt-14 scroll-mt-24 border-t border-white/10 pt-9">
      <h2 id={headingId} className="text-2xl font-semibold text-zinc-100">Homework {section}</h2>
      <ol className="mt-7 space-y-9">
        {homework.problems.map((problem, index) => (
          <li key={problem.id} className="border-b border-white/10 pb-8 last:border-b-0 last:pb-0">
            <h3 className="text-lg font-semibold leading-7 text-zinc-100">
              <span className="mr-3 font-mono text-sky-200">{index + 1}</span>
              {problem.title}
            </h3>
            <MathJaxRenderer math={problem.prompt} className="mt-3 max-w-4xl text-base leading-8 text-zinc-200" />

            <details className="mt-4">
              <summary className="w-fit cursor-pointer py-1 text-sm font-semibold text-zinc-400 hover:text-zinc-100">Hint</summary>
              <MathJaxRenderer math={problem.hint} className="mt-2 max-w-4xl text-base leading-7 text-zinc-300" />
            </details>

            <details className="mt-2">
              <summary className="w-fit cursor-pointer py-1 text-sm font-semibold text-sky-200 hover:text-sky-100">Solution</summary>
              <div className="mt-4 max-w-4xl space-y-5 border-l border-white/15 pl-4 sm:pl-5">
                {problem.steps.map((step, stepIndex) => (
                  <div key={`${problem.id}-step-${stepIndex}`}>
                    <MathJaxRenderer math={step.label} className="text-base font-semibold leading-7 text-zinc-200" />
                    <MathJaxRenderer math={step.text} className="mt-1 text-base leading-8 text-zinc-300" />
                    {step.math && <MathJaxRenderer math={step.math} className="mt-2 text-base leading-8 text-zinc-100" />}
                  </div>
                ))}
                <div>
                  <p className="text-base font-semibold text-zinc-200">Answer</p>
                  <MathJaxRenderer math={problem.answer} className="mt-2 text-base leading-8 text-zinc-100" />
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
