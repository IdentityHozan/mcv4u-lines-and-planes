"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import { KATCBadge } from "./KATCBadge";
import { StepByStepSolution } from "./StepByStepSolution";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import type { Assessment } from "@/data/linesAndPlanesData";

type QuizEngineProps = {
  assessment: Assessment;
  onComplete?: (score: number, total: number) => void;
};

export function QuizEngine({ assessment, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const current = assessment.questions[currentIndex];
  const selected = answers[current.id];
  const isRevealed = assessment.mode === "quiz" ? revealed.includes(current.id) : submitted;
  const answeredCount = Object.keys(answers).length;
  const score = useMemo(
    () => assessment.questions.reduce((total, question) => total + (answers[question.id] === question.correctIndex ? 1 : 0), 0),
    [answers, assessment.questions],
  );
  const complete = assessment.mode === "quiz"
    ? revealed.length === assessment.questions.length
    : submitted;

  const choose = (index: number) => {
    if (isRevealed) return;
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: index }));
  };

  const revealCurrent = () => {
    if (selected === undefined) return;
    setRevealed((items) => {
      const nextItems = items.includes(current.id) ? items : [...items, current.id];
      if (nextItems.length === assessment.questions.length) {
        queueMicrotask(() => onComplete?.(score, assessment.questions.length));
      }
      return nextItems;
    });
  };

  const submitExam = () => {
    if (answeredCount !== assessment.questions.length) return;
    setSubmitted(true);
    onComplete?.(score, assessment.questions.length);
  };

  const next = () => {
    if (currentIndex < assessment.questions.length - 1) {
      setCurrentIndex((index) => index + 1);
    }
  };

  const reset = () => {
    setCurrentIndex(0);
    setAnswers({});
    setRevealed([]);
    setSubmitted(false);
  };

  return (
    <div className="min-h-[640px] p-5 sm:p-8">
      <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="micro-label text-sky-300">{assessment.mode === "exam" ? "Final assessment" : `Quiz ${assessment.number}`}</span>
            <span className="text-zinc-700">/</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-600">{assessment.timeLimit}</span>
          </div>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight">{assessment.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{assessment.description}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-mono text-sm text-zinc-300">{String(currentIndex + 1).padStart(2, "0")} / {String(assessment.questions.length).padStart(2, "0")}</p>
          <p className="mt-1 text-xs text-zinc-600">{answeredCount} answered</p>
        </div>
      </div>

      <div className="mt-4 flex gap-1" aria-label="Question progress">
        {assessment.questions.map((question, index) => {
          const answered = answers[question.id] !== undefined;
          const checked = revealed.includes(question.id) || submitted;
          const correct = answers[question.id] === question.correctIndex;
          return (
            <button
              type="button"
              key={question.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 flex-1 transition ${
                checked ? (correct ? "bg-sky-300" : "bg-zinc-500") : answered ? "bg-sky-400/35" : "bg-white/10"
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22 }}
          className="mt-8"
        >
          <div className="flex flex-wrap gap-2">
            {current.tags.map((tag) => <KATCBadge key={tag} category={tag} showLabel />)}
          </div>
          <MathJaxRenderer math={current.prompt} className="mt-5 max-w-3xl text-lg font-medium leading-8 text-zinc-100" />

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {current.options.map((option, index) => {
              const chosen = selected === index;
              const correct = current.correctIndex === index;
              const wrongChosen = isRevealed && chosen && !correct;
              return (
                <button
                  type="button"
                  key={`${current.id}-${index}`}
                  onClick={() => choose(index)}
                  disabled={isRevealed}
                  className={`group flex min-h-20 items-center gap-4 border p-4 text-left transition ${
                    isRevealed && correct
                      ? "border-sky-400/55 bg-sky-400/[0.08]"
                      : wrongChosen
                        ? "border-white/25 bg-white/[0.055]"
                        : chosen
                          ? "border-sky-400/40 bg-sky-400/[0.05]"
                          : "border-white/10 bg-[#111] hover:border-white/25"
                  }`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center border font-mono text-[10px] ${chosen ? "border-sky-400/50 text-sky-300" : "border-white/10 text-zinc-600"}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <MathJaxRenderer math={option} className="text-sm leading-6 text-zinc-300" />
                  {isRevealed && correct && <Check size={15} className="ml-auto shrink-0 text-sky-300" />}
                  {wrongChosen && <X size={15} className="ml-auto shrink-0 text-zinc-400" />}
                </button>
              );
            })}
          </div>

          {isRevealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 border border-white/10 bg-[#0b0b0b] p-5">
              <p className={`text-sm font-semibold ${selected === current.correctIndex ? "text-sky-300" : "text-zinc-200"}`}>
                {selected === current.correctIndex ? "Correct reasoning." : "Not quite. Trace the full reasoning below."}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{current.rationale}</p>
              <div className="mt-5">
                <StepByStepSolution steps={current.steps} defaultOpen title="Full solution walkthrough" />
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          disabled={currentIndex === 0}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 px-4 text-sm text-zinc-500 transition enabled:hover:border-white/25 enabled:hover:text-zinc-200 disabled:opacity-30"
        >
          Previous question
        </button>

        <div className="flex flex-col gap-3 sm:flex-row">
          {assessment.mode === "quiz" && !isRevealed && (
            <button
              type="button"
              onClick={revealCurrent}
              disabled={selected === undefined}
              className="min-h-11 bg-sky-300 px-5 text-sm font-semibold text-black transition enabled:hover:bg-sky-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              Check answer
            </button>
          )}
          {assessment.mode === "exam" && currentIndex === assessment.questions.length - 1 && !submitted && (
            <button
              type="button"
              onClick={submitExam}
              disabled={answeredCount !== assessment.questions.length}
              className="min-h-11 bg-sky-300 px-5 text-sm font-semibold text-black transition enabled:hover:bg-sky-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
            >
              Submit complete exam
            </button>
          )}
          {currentIndex < assessment.questions.length - 1 && (
            <button
              type="button"
              onClick={next}
              disabled={assessment.mode === "quiz" ? !isRevealed : selected === undefined}
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 px-5 text-sm font-semibold text-zinc-300 transition enabled:hover:border-sky-400/40 enabled:hover:text-sky-300 disabled:opacity-30"
            >
              Next question
            </button>
          )}
        </div>
      </div>

      {complete && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border border-sky-400/25 bg-sky-400/[0.055] p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="micro-label text-sky-300">Score summary</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{score} / {assessment.questions.length}</p>
              <p className="mt-2 text-sm text-zinc-500">{Math.round((score / assessment.questions.length) * 100)}% · Review any missed walkthrough before retaking.</p>
            </div>
            <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 border border-sky-400/30 px-4 text-sm font-semibold text-sky-300 transition hover:bg-sky-400/10">
              Retake assessment
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
