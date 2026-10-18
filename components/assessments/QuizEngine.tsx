"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import type { Assessment, AssessmentQuestion } from "@/data/linesAndPlanesData";
import { KATCBadge } from "./KATCBadge";
import { StepByStepSolution } from "./StepByStepSolution";

type QuizEngineProps = {
  assessment: Assessment;
  onComplete: (score: number, total: number) => void;
};

type AnswerValue = number | string;

function isWritten(question: AssessmentQuestion): question is Extract<AssessmentQuestion, { kind: "written" }> {
  return question.kind === "written";
}

export function QuizEngine({ assessment, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [writtenReviews, setWrittenReviews] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const completionReported = useRef(false);

  const current = assessment.questions[currentIndex];
  const written = isWritten(current);
  const selectedChoice = typeof answers[current.id] === "number" ? answers[current.id] as number : undefined;
  const writtenResponse = typeof answers[current.id] === "string" ? answers[current.id] as string : "";
  const isRevealed = revealed.includes(current.id) || submitted;

  const hasResponse = (question: AssessmentQuestion) => {
    const value = answers[question.id];
    return isWritten(question) ? typeof value === "string" && value.trim().length >= 5 : typeof value === "number";
  };

  const answeredCount = assessment.questions.filter(hasResponse).length;
  const writtenQuestions = useMemo(() => assessment.questions.filter(isWritten), [assessment.questions]);
  const reviewedWrittenCount = writtenQuestions.filter((question) => writtenReviews[question.id] !== undefined).length;
  const score = assessment.questions.reduce((total, question) => {
    if (isWritten(question)) return total + (writtenReviews[question.id] ? 1 : 0);
    return total + (answers[question.id] === question.correctIndex ? 1 : 0);
  }, 0);

  const complete = assessment.mode === "quiz"
    ? assessment.questions.every((question) => revealed.includes(question.id) && (!isWritten(question) || writtenReviews[question.id] !== undefined))
    : submitted && reviewedWrittenCount === writtenQuestions.length;

  useEffect(() => {
    if (!complete || completionReported.current) return;
    completionReported.current = true;
    onComplete(score, assessment.questions.length);
  }, [assessment.questions.length, complete, onComplete, score]);

  const choose = (index: number) => {
    if (isRevealed || written) return;
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: index }));
  };

  const updateWritten = (value: string) => {
    if (isRevealed || !written) return;
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: value }));
  };

  const revealCurrent = () => {
    if (!hasResponse(current)) return;
    setRevealed((items) => items.includes(current.id) ? items : [...items, current.id]);
  };

  const reviewWritten = (meetsCriteria: boolean) => {
    if (!written) return;
    setWrittenReviews((currentReviews) => ({ ...currentReviews, [current.id]: meetsCriteria }));
  };

  const currentReady = assessment.mode === "exam"
    ? hasResponse(current) || submitted
    : isRevealed && (!written || writtenReviews[current.id] !== undefined);

  const next = () => {
    if (!currentReady) return;
    setCurrentIndex((index) => Math.min(assessment.questions.length - 1, index + 1));
  };

  const submitExam = () => {
    if (answeredCount !== assessment.questions.length) return;
    setSubmitted(true);
  };

  const reset = () => {
    setCurrentIndex(0);
    setAnswers({});
    setRevealed([]);
    setWrittenReviews({});
    setSubmitted(false);
    completionReported.current = false;
  };

  return (
    <div className="min-h-[680px] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="micro-label text-sky-300">{assessment.mode === "exam" ? "Final assessment" : `Quiz ${assessment.number}`}</span>
            <span className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">{assessment.timeLimit}</span>
            <span className="border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">{written ? "Written response" : "Multiple choice"}</span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight">{assessment.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{assessment.description}</p>
          {submitted && writtenQuestions.length > 0 && reviewedWrittenCount < writtenQuestions.length && (
            <p className="mt-3 text-sm font-semibold text-sky-300">Review the written responses to complete your score. {reviewedWrittenCount} of {writtenQuestions.length} reviewed.</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-sm text-zinc-300">Question {currentIndex + 1} of {assessment.questions.length}</p>
          <p className="mt-1 text-xs text-zinc-600">{answeredCount} answered</p>
        </div>
      </div>

      <div className="mt-4 flex gap-1" aria-label="Question progress">
        {assessment.questions.map((question, index) => {
          const answered = hasResponse(question);
          const checked = revealed.includes(question.id) || submitted;
          const reviewed = !isWritten(question) || writtenReviews[question.id] !== undefined;
          const correct = isWritten(question) ? writtenReviews[question.id] === true : answers[question.id] === question.correctIndex;
          return (
            <button
              type="button"
              key={question.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 flex-1 transition ${checked && reviewed ? (correct ? "bg-sky-300" : "bg-zinc-500") : answered ? "bg-sky-400/35" : "bg-white/10"}`}
              aria-label={`Go to question ${index + 1}`}
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mt-8">
          <div className="flex flex-wrap gap-2">{current.tags.map((tag) => <KATCBadge key={tag} category={tag} showLabel />)}</div>
          <MathJaxRenderer math={current.prompt} className="mt-5 max-w-3xl text-lg font-medium leading-8 text-zinc-100" />

          {current.kind !== "written" && (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {current.options.map((option, index) => {
                const chosen = selectedChoice === index;
                const correct = current.correctIndex === index;
                const wrongChosen = isRevealed && chosen && !correct;
                return (
                  <button
                    type="button"
                    key={`${current.id}-${index}`}
                    onClick={() => choose(index)}
                    disabled={isRevealed}
                    className={`flex min-h-20 items-center gap-4 border p-4 text-left transition ${isRevealed && correct ? "border-sky-400/55 bg-sky-400/[0.08]" : wrongChosen ? "border-white/30 bg-white/[0.055]" : chosen ? "border-sky-400/40 bg-sky-400/[0.05]" : "border-white/10 bg-[#111] hover:border-white/25"}`}
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center border font-mono text-[10px] ${chosen ? "border-sky-400/50 text-sky-300" : "border-white/10 text-zinc-600"}`}>{String.fromCharCode(65 + index)}</span>
                    <MathJaxRenderer math={option} className="text-sm leading-6 text-zinc-300" />
                    {isRevealed && correct && <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-sky-300">Correct</span>}
                  </button>
                );
              })}
            </div>
          )}

          {current.kind === "written" && (
            <div className="mt-7">
              <label htmlFor={`response-${current.id}`} className="text-sm font-semibold text-zinc-200">Your response</label>
              <textarea
                id={`response-${current.id}`}
                value={writtenResponse}
                onChange={(event) => updateWritten(event.target.value)}
                disabled={isRevealed}
                rows={7}
                placeholder="Show your reasoning and state a complete conclusion."
                className="mt-3 w-full resize-y border border-white/15 bg-[#0b0b0b] p-4 text-sm leading-7 text-zinc-200 outline-none transition focus:border-sky-400/50 disabled:text-zinc-400"
              />
              <p className="mt-2 text-xs text-zinc-600">{writtenResponse.trim().length} characters</p>
            </div>
          )}

          {isRevealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border border-white/10 bg-[#0b0b0b] p-5">
              {current.kind !== "written" && (
                <>
                  <p className={`text-sm font-semibold ${selectedChoice === current.correctIndex ? "text-sky-300" : "text-zinc-200"}`}>{selectedChoice === current.correctIndex ? "Correct reasoning" : "Review the method"}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{current.rationale}</p>
                </>
              )}

              {current.kind === "written" && (
                <>
                  <p className="text-sm font-semibold text-zinc-100">Compare your answer with the criteria</p>
                  <ol className="mt-4 space-y-3">
                    {current.criteria.map((criterion, index) => <li key={criterion} className="grid grid-cols-[28px_1fr] gap-3 text-sm leading-6 text-zinc-400"><span className="font-mono text-xs text-sky-300">{String(index + 1).padStart(2, "0")}</span><span>{criterion}</span></li>)}
                  </ol>
                  <div className="mt-5 border border-sky-400/20 bg-sky-400/[0.04] p-4">
                    <p className="micro-label text-sky-300">Student sample</p>
                    <MathJaxRenderer math={current.sampleAnswer} className="mt-3 text-sm leading-7 text-zinc-300" />
                  </div>
                  <p className="mt-5 text-sm leading-6 text-zinc-400">{current.rationale}</p>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => reviewWritten(true)} className={`min-h-11 border px-4 text-sm font-semibold ${writtenReviews[current.id] === true ? "border-sky-400/50 bg-sky-400/[0.09] text-sky-200" : "border-white/15 text-zinc-300"}`}>My response meets the criteria</button>
                    <button type="button" onClick={() => reviewWritten(false)} className={`min-h-11 border px-4 text-sm font-semibold ${writtenReviews[current.id] === false ? "border-white/35 bg-white/[0.055] text-zinc-100" : "border-white/15 text-zinc-400"}`}>I need to revise</button>
                  </div>
                </>
              )}

              <div className="mt-5"><StepByStepSolution steps={current.steps} defaultOpen title="Full solution" /></div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row">
        <button type="button" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={currentIndex === 0} className="min-h-11 border border-white/10 px-4 text-sm text-zinc-500 enabled:hover:border-white/25 enabled:hover:text-zinc-200 disabled:opacity-30">Previous question</button>
        <div className="flex flex-col gap-3 sm:flex-row">
          {assessment.mode === "quiz" && !isRevealed && <button type="button" onClick={revealCurrent} disabled={!hasResponse(current)} className="min-h-11 bg-sky-300 px-5 text-sm font-semibold text-black enabled:hover:bg-sky-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600">{written ? "Compare response" : "Check answer"}</button>}
          {assessment.mode === "exam" && currentIndex === assessment.questions.length - 1 && !submitted && <button type="button" onClick={submitExam} disabled={answeredCount !== assessment.questions.length} className="min-h-11 bg-sky-300 px-5 text-sm font-semibold text-black enabled:hover:bg-sky-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600">Submit exam</button>}
          {currentIndex < assessment.questions.length - 1 && <button type="button" onClick={next} disabled={!currentReady} className="min-h-11 border border-white/15 px-5 text-sm font-semibold text-zinc-300 enabled:hover:border-sky-400/40 enabled:hover:text-sky-300 disabled:opacity-30">Next question</button>}
        </div>
      </div>

      {complete && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border border-sky-400/25 bg-sky-400/[0.055] p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="micro-label text-sky-300">Score summary</p><p className="mt-2 text-4xl font-semibold tracking-tight">{score} of {assessment.questions.length}</p><p className="mt-2 text-sm text-zinc-500">{Math.round((score / assessment.questions.length) * 100)}%. Review any missed solutions before retaking.</p></div>
            <button type="button" onClick={reset} className="min-h-11 border border-sky-400/30 px-4 text-sm font-semibold text-sky-300 hover:bg-sky-400/10">Retake assessment</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
