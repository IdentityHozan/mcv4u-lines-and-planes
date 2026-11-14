"use client";

import { useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import type { Assessment, AssessmentQuestion } from "@/data/linesAndPlanesData";
import { KATCBadge } from "./KATCBadge";
import { questionMarks } from "./QuizEngine";
import { StepByStepSolution } from "./StepByStepSolution";
import { WorkedSketch } from "./WorkedSketch";
import { StudyPrompt } from "./StudyPrompt";

function WorkedAnswer({ question }: { question: AssessmentQuestion }) {
  return (
    <div className="mt-5 space-y-5">
      {question.kind === "written" ? (
        <>
          <div className="border-l-4 border-sky-300 pl-4">
            <h4 className="font-semibold text-zinc-100">Model response</h4>
            <MathJaxRenderer math={question.sampleAnswer} className="mt-2 text-base leading-8 text-zinc-200" />
          </div>
          <div>
            <h4 className="font-semibold text-zinc-100">Marking criteria</h4>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-base leading-7 text-zinc-300">
              {question.criteria.map((criterion, index) => <li key={index}><MathJaxRenderer math={criterion} /></li>)}
            </ol>
          </div>
        </>
      ) : (
        <>
          <p className="font-semibold text-sky-200">Correct choice: {String.fromCharCode(65 + question.correctIndex)}</p>
          <MathJaxRenderer math={question.options[question.correctIndex]} className="text-base leading-8 text-zinc-100" />
        </>
      )}
      <WorkedSketch questionId={question.id} />
      <StepByStepSolution steps={question.steps} defaultOpen title="Worked steps" />
    </div>
  );
}

function SolutionQuestion({ question, index }: { question: AssessmentQuestion; index: number }) {
  const [opened, setOpened] = useState(false);
  const marks = questionMarks(question);
  return (
    <li id={question.id} className="scroll-mt-24 border-b border-white/15 py-5 sm:py-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-100">Question {index + 1}</h3>
        <p className="text-sm text-zinc-300">{marks} {marks === 1 ? "mark" : "marks"}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">{question.tags.map((tag) => <KATCBadge key={tag} category={tag} showLabel />)}</div>
      <StudyPrompt prompt={question.prompt} className="mt-4 max-w-[70ch] text-base leading-7 text-zinc-100" />
      <details className="mt-3" onToggle={(event) => { if (event.currentTarget.open) setOpened(true); }}>
        <summary className="w-fit cursor-pointer py-1 font-semibold text-sky-200">View answer and working</summary>
        {opened && <WorkedAnswer question={question} />}
      </details>
    </li>
  );
}

export function AssessmentSolutions({ assessment }: { assessment: Assessment }) {
  return (
    <section aria-labelledby="solution-paper-title" className="max-w-4xl space-y-5">
      <header className="border-b border-white/15 pb-5">
        <h2 id="solution-paper-title" className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Answer key: {assessment.title}</h2>
      </header>
      <nav aria-label="Solution questions" className="flex flex-wrap gap-2">
        {assessment.questions.map((question, index) => <a key={question.id} href={`#${question.id}`} aria-label={`Go to question ${index + 1}`} className="grid h-10 min-w-10 place-items-center border border-white/20 px-2 text-sm font-semibold text-zinc-100 hover:border-sky-300/60 hover:text-sky-200">{index + 1}</a>)}
      </nav>
      <ol className="border-t border-white/15">{assessment.questions.map((question, index) => <SolutionQuestion key={question.id} question={question} index={index} />)}</ol>
    </section>
  );
}
