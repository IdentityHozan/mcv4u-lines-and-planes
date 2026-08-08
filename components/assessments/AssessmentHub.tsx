"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { finalExam, katcLabels, quizzes, type Assessment, type KATCCategory } from "@/data/linesAndPlanesData";
import { KATCBadge } from "./KATCBadge";
import { QuizEngine } from "./QuizEngine";

const SCORE_KEY = "mcv4u-topic-h-scores";

type AssessmentHubProps = {
  variant: "quizzes" | "exam";
};

export function AssessmentHub({ variant }: AssessmentHubProps) {
  const [active, setActive] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<Record<string, { score: number; total: number }>>({});

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(SCORE_KEY);
      if (saved) queueMicrotask(() => setScores(JSON.parse(saved) as Record<string, { score: number; total: number }>));
    } catch {}
  }, []);

  const saveScore = useCallback((assessment: Assessment, score: number, total: number) => {
    setScores((current) => {
      const prior = current[assessment.id];
      const next = !prior || score > prior.score ? { ...current, [assessment.id]: { score, total } } : current;
      window.localStorage.setItem(SCORE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <>
      {variant === "quizzes" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {quizzes.map((quiz) => {
            const saved = scores[quiz.id];
            const categories = Array.from(new Set(quiz.questions.flatMap((question) => question.tags))) as KATCCategory[];
            return (
              <article key={quiz.id} className="flex min-h-[390px] flex-col border border-white/10 bg-[#101010] p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="micro-label text-sky-300">Quiz {quiz.number}</span>
                  {saved && <span className="font-mono text-xs text-zinc-400">Best: {saved.score}/{saved.total}</span>}
                </div>
                <h2 className="mt-10 text-2xl font-semibold tracking-tight">{quiz.title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{quiz.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">{categories.map((category) => <KATCBadge key={category} category={category} showLabel />)}</div>
                <dl className="mt-auto grid grid-cols-2 gap-3 border-t border-white/10 pt-5 text-xs">
                  <div><dt className="text-zinc-600">Questions</dt><dd className="mt-1 font-semibold text-zinc-300">{quiz.questions.length}</dd></div>
                  <div><dt className="text-zinc-600">Suggested time</dt><dd className="mt-1 font-semibold text-zinc-300">{quiz.timeLimit}</dd></div>
                </dl>
                <button type="button" onClick={() => setActive(quiz)} className="primary-action mt-5 w-full">{saved ? "Retake quiz" : "Begin quiz"}</button>
              </article>
            );
          })}
        </div>
      ) : (
        <article className="border border-sky-400/25 bg-sky-400/[0.035]">
          <div className="grid lg:grid-cols-[1fr_360px]">
            <div className="p-7 sm:p-10">
              <p className="micro-label text-sky-300">Comprehensive final assessment</p>
              <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">Complete the Lines and Planes final exam</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400">{finalExam.description} Every solution is fully typed and becomes available after submission.</p>
              <button type="button" onClick={() => setActive(finalExam)} className="primary-action mt-8">{scores[finalExam.id] ? "Retake final exam" : "Start final exam"}</button>
            </div>
            <div className="border-t border-sky-400/15 p-7 lg:border-l lg:border-t-0">
              <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5">
                <div><p className="text-xs text-zinc-600">Questions</p><p className="mt-1 text-xl font-semibold">{finalExam.questions.length}</p></div>
                <div><p className="text-xs text-zinc-600">Suggested time</p><p className="mt-1 text-xl font-semibold">{finalExam.timeLimit}</p></div>
              </div>
              <p className="micro-label mt-6 text-zinc-500">KATC coverage</p>
              <div className="mt-4 space-y-4">
                {(Object.keys(katcLabels) as KATCCategory[]).map((category) => {
                  const count = finalExam.questions.filter((question) => question.tags.includes(category)).length;
                  return <div key={category} className="flex items-center justify-between gap-4"><KATCBadge category={category} showLabel /><span className="font-mono text-xs text-zinc-500">{count} questions</span></div>;
                })}
              </div>
              {scores[finalExam.id] && <div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs text-zinc-600">Best result</p><p className="mt-2 font-mono text-2xl text-sky-300">{scores[finalExam.id].score}/{scores[finalExam.id].total}</p></div>}
            </div>
          </div>
        </article>
      )}

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.title ?? "Assessment"}>
        {active && <QuizEngine assessment={active} onComplete={(score, total) => saveScore(active, score, total)} />}
      </Modal>
    </>
  );
}
