import { homeworkSets } from "@/data/linesAndPlanesData";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { StudyPrompt } from "@/components/assessments/StudyPrompt";
import { WorkedSketch } from "@/components/assessments/WorkedSketch";
import { HomeworkReview } from "@/components/assessments/HomeworkReview";

type LessonHomeworkProps = {
  section: string;
  embedded?: boolean;
};

export function LessonHomework({ section, embedded = false }: LessonHomeworkProps) {
  const homework = homeworkSets.find((set) => set.number === section);
  if (!homework) return null;

  const headingId = `homework-${section.replace(/\./g, "-")}-title`;

  return (
    <section id={embedded ? undefined : "homework"} aria-labelledby={headingId} className={embedded ? "lesson-homework" : "mt-14 scroll-mt-24 border-t border-white/10 pt-9"}>
      {embedded ? <h3 id={headingId} className="sr-only">Homework {section} questions</h3> : <h2 id={headingId} className="text-2xl font-semibold text-zinc-100">Homework {section}</h2>}
      <ol className="mt-4 space-y-6">
        {homework.problems.map((problem, index) => (
          <li key={problem.id} className="border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
            <h3 className="text-lg font-semibold leading-7 text-zinc-100">
              <span className="mr-3 tabular-nums text-zinc-400">{index + 1}</span>
              {problem.title}
            </h3>
            <StudyPrompt prompt={problem.prompt} className="mt-3 max-w-[68ch] text-base leading-7 text-zinc-200" />
            <HomeworkReview section={section} review={problem.review} />

            <details className="mt-4">
              <summary className="w-fit cursor-pointer py-1 text-sm font-semibold text-zinc-400 hover:text-zinc-100">Hint</summary>
              <MathJaxRenderer math={problem.hint} className="mt-2 max-w-4xl text-base leading-7 text-zinc-300" />
            </details>

            <details className="mt-2">
              <summary className="w-fit cursor-pointer py-1 text-sm font-semibold text-sky-200 hover:text-sky-100">Solution</summary>
              <WorkedSketch questionId={problem.id} />
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
