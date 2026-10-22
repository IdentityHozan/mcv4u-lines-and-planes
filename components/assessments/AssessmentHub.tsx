"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { finalExam, quizzes, tests, type Assessment } from "@/data/linesAndPlanesData";
import { assessmentSignature, questionMarks, QuizEngine } from "./QuizEngine";

const SCORE_KEY = "mcv4u-lines-and-planes-scores-v4";
type SavedScore = { score: number; total: number; signature: string };
type AssessmentHubProps = { variant: "quizzes" | "tests" | "exam" };

const sequence = [
  { variant: "quizzes", href: "/assessments", title: "Quizzes", detail: "Guided checks" },
  { variant: "tests", href: "/tests", title: "Tests", detail: "Independent practice" },
  { variant: "exam", href: "/exam", title: "Examination", detail: "Complete unit review" },
] as const;

export function AssessmentHub({ variant }: AssessmentHubProps) {
  const [active, setActive] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<Record<string, SavedScore>>({});
  const workspaceRef = useRef<HTMLDivElement>(null);
  const assessments = variant === "quizzes" ? quizzes : variant === "tests" ? tests : [finalExam];

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SCORE_KEY);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
      const safe: Record<string, SavedScore> = {};
      [...quizzes, ...tests, finalExam].forEach((assessment) => {
        const candidate = (parsed as Record<string, Partial<SavedScore>>)[assessment.id];
        if (candidate && typeof candidate.score === "number" && typeof candidate.total === "number" && Number.isFinite(candidate.score) && candidate.score >= 0 && candidate.score <= candidate.total && candidate.signature === assessmentSignature(assessment)) {
          safe[assessment.id] = { score: candidate.score, total: candidate.total, signature: candidate.signature };
        }
      });
      queueMicrotask(() => setScores(safe));
    } catch {
      // An unavailable or malformed local score must not block the question bank.
    }
  }, []);

  useEffect(() => {
    if (active) workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [active]);

  const saveScore = useCallback((assessment: Assessment, score: number, total: number) => {
    setScores((current) => {
      const next = { ...current, [assessment.id]: { score, total, signature: assessmentSignature(assessment) } };
      try { window.localStorage.setItem(SCORE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <div ref={workspaceRef} className="scroll-mt-28">
      <nav aria-label="Assessment sequence" className="mb-8 grid gap-2 sm:grid-cols-3">
        {sequence.map((step, index) => <Link key={step.variant} href={step.href} aria-current={variant === step.variant ? "page" : undefined} className={`flex min-h-20 items-start gap-4 border p-4 transition ${variant === step.variant ? "border-sky-300/40 bg-sky-300/[0.07]" : "border-white/15 bg-[#111] hover:border-white/35"}`}><span className="pt-0.5 text-base text-sky-200">{index + 1}</span><span><span className="block text-base font-semibold text-zinc-100">{step.title}</span><span className="mt-1 block text-sm text-zinc-400">{step.detail}</span></span></Link>)}
      </nav>

      {active ? (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <button type="button" onClick={() => { setActive(null); workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="min-h-12 border border-white/20 px-5 py-3 text-base font-semibold text-zinc-200 hover:border-sky-300/50 hover:text-sky-200">Back to {variant === "exam" ? "examination overview" : variant === "tests" ? "test list" : "quiz list"}</button>
            <p className="text-sm leading-6 text-zinc-400">Your current attempt stays on this browser.</p>
          </div>
          <QuizEngine key={active.id} assessment={active} onComplete={(score, total) => saveScore(active, score, total)} />
        </>
      ) : (
        <>
          <div className="space-y-5">
            {assessments.map((assessment) => {
              const saved = scores[assessment.id];
              const writtenCount = assessment.questions.filter((question) => question.kind === "written").length;
              const totalMarks = assessment.questions.reduce((total, question) => total + questionMarks(question), 0);
              const sections = [...new Set(assessment.questions.map((question) => question.section).filter(Boolean))];
              const kind = variant === "exam" ? "Final examination" : `${variant === "tests" ? "Test" : "Quiz"} ${Number(assessment.number) || assessment.number}`;
              return (
                <article key={assessment.id} className="grid border border-white/15 bg-[#111] lg:grid-cols-[1fr_280px]">
                  <div className="p-6 sm:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-sky-200">{kind}</p>
                    <h2 className="mt-3 text-2xl font-semibold leading-tight text-zinc-100 sm:text-3xl">{assessment.title}</h2>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">{assessment.description}</p>
                    {sections.length > 0 && <div className="mt-5"><p className="text-base font-semibold text-zinc-200">Paper structure</p><ul className="mt-2 space-y-2 text-base leading-7 text-zinc-400">{sections.map((section) => <li key={section}>{section}</li>)}</ul></div>}
                    <p className="mt-5 text-base leading-7 text-zinc-400">{assessment.mode === "quiz" ? "Check each answer and study the worked solution as you go." : "Complete the full paper before viewing solutions and marking guidance."}</p>
                  </div>
                  <div className="border-t border-white/15 bg-black/15 p-6 sm:p-8 lg:border-l lg:border-t-0">
                    <dl className="space-y-4 text-base">
                      <div className="flex justify-between gap-3"><dt className="text-zinc-400">Questions</dt><dd className="font-semibold text-zinc-100">{assessment.questions.length}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-zinc-400">Marks</dt><dd className="font-semibold text-zinc-100">{totalMarks}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-zinc-400">Suggested time</dt><dd className="font-semibold text-zinc-100">{assessment.timeLimit}</dd></div>
                    </dl>
                    <p className="mt-5 border-t border-white/15 pt-4 text-sm leading-6 text-zinc-400">{assessment.questions.length - writtenCount} multiple-choice questions<br />{writtenCount} written-response questions</p>
                    <button type="button" onClick={() => setActive(assessment)} className="mt-6 min-h-12 w-full bg-sky-200 px-5 py-3 text-base font-semibold text-slate-950 hover:bg-sky-100">Open {variant === "exam" ? "examination" : variant === "tests" ? "test" : "quiz"}</button>
                    {saved && <div className="mt-5 border-t border-white/15 pt-4"><p className="text-sm text-zinc-400">Last completed practice result</p><p className="mt-2 text-2xl font-semibold text-sky-200">{saved.score} / {saved.total}</p><p className="mt-2 text-sm leading-6 text-zinc-400">Includes self-assessed written marks.</p></div>}
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="mt-6 border-l-2 border-sky-300/50 bg-sky-300/[0.035] p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-100">How marking works</h2>
            <p className="mt-2 max-w-4xl text-base leading-7 text-zinc-300">Multiple-choice answers are marked automatically. Written responses include a model answer, worked solution, and criteria for awarding partial marks. You assess your own written work; the combined result is a practice estimate, not a teacher-awarded grade.</p>
          </aside>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={variant === "quizzes" ? "/tests" : variant === "tests" ? "/exam" : "/lessons"} className="primary-action">{variant === "quizzes" ? "Continue to tests" : variant === "tests" ? "Continue to the examination" : "Review the lessons"}</Link>
            {variant !== "quizzes" && <Link href={variant === "tests" ? "/assessments" : "/tests"} className="secondary-action">{variant === "tests" ? "Review the quizzes" : "Review the tests"}</Link>}
          </div>
        </>
      )}
    </div>
  );
}
