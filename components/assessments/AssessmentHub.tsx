"use client";

import Link from "@/components/ui/SiteLink";
import { useCallback, useEffect, useRef, useState } from "react";
import { finalExam, quizzes, tests, type Assessment } from "@/data/linesAndPlanesData";
import { assessmentSignature, questionMarks, QuizEngine } from "./QuizEngine";

import { courseUnits, sectionRange, homeworkHref, quizHref, testHref } from "@/data/courseUnits";

const SCORE_KEY = "mcv4u-lines-and-planes-scores-v4";
type SavedScore = { score: number; total: number; signature: string };
type AssessmentHubProps = { variant: "quizzes" | "tests" | "exam"; initialUnit?: string };

export function AssessmentHub({ variant, initialUnit }: AssessmentHubProps) {
  const [selectedUnit, setSelectedUnit] = useState(() => courseUnits.some((unit) => unit.id === initialUnit) ? initialUnit! : "all");
  const [active, setActive] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<Record<string, SavedScore>>({});
  const workspaceRef = useRef<HTMLDivElement>(null);
  const assessments = variant === "quizzes" ? quizzes : variant === "tests" ? tests : [finalExam];

  const visibleAssessments = variant === "exam" || selectedUnit === "all" ? assessments : assessments.filter((assessment) => assessment.number === selectedUnit);

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

      {active ? (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <button type="button" onClick={() => { setActive(null); workspaceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="min-h-12 border border-white/20 px-5 py-3 text-base font-semibold text-zinc-200 hover:border-sky-300/50 hover:text-sky-200">Back to {variant === "exam" ? "examination" : variant === "tests" ? "tests" : "quizzes"}</button>
          </div>
          <QuizEngine key={active.id} assessment={active} onComplete={(score, total) => saveScore(active, score, total)} />
        </>
      ) : (
        <>
          {variant !== "exam" && <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
            <label className="text-sm font-semibold text-zinc-200">Unit<select value={selectedUnit} onChange={(event) => { setSelectedUnit(event.target.value); window.history.replaceState(null, "", event.target.value === "all" ? (variant === "tests" ? "/tests" : "/assessments") : (variant === "tests" ? testHref(event.target.value) : quizHref(event.target.value))); }} className="mt-2 block max-w-full border border-white/20 bg-[#111] p-3 text-base text-zinc-100"><option value="all">All units</option>{courseUnits.map((unit) => <option key={unit.id} value={unit.id}>Unit {unit.id} Sections {sectionRange(unit.sections)}</option>)}</select></label>
          </div>}
          <div className="space-y-5">
            {visibleAssessments.map((assessment) => {
              const saved = scores[assessment.id];
              const unit = courseUnits.find((item) => item.id === assessment.number);
              const writtenCount = assessment.questions.filter((question) => question.kind === "written").length;
              const totalMarks = assessment.questions.reduce((total, question) => total + questionMarks(question), 0);
              const kind = variant === "exam" ? "Final examination" : `${variant === "tests" ? "Test" : "Quiz"} ${assessment.number}`;
              return (
                <article key={assessment.id} className="grid border border-white/15 bg-[#111] lg:grid-cols-[1fr_280px]">
                  <div className="p-6 sm:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-sky-200">{kind}</p>
                    {unit && <p className="mt-2 text-sm text-zinc-400">Sections {sectionRange(unit.sections)}</p>}
                    <h2 className="mt-3 text-2xl font-semibold leading-tight text-zinc-100 sm:text-3xl">{assessment.title}</h2>
                    {unit && <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-sky-200"><Link href={homeworkHref(unit.sections[0])}>Homework</Link><Link href={variant === "tests" ? quizHref(unit.id) : testHref(unit.id)}>{variant === "tests" ? `Quiz ${unit.id}` : `Test ${unit.id}`}</Link></div>}
                  </div>
                  <div className="border-t border-white/15 bg-black/15 p-6 sm:p-8 lg:border-l lg:border-t-0">
                    <dl className="space-y-4 text-base">
                      <div className="flex justify-between gap-3"><dt className="text-zinc-400">Questions</dt><dd className="font-semibold text-zinc-100">{assessment.questions.length}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-zinc-400">Marks</dt><dd className="font-semibold text-zinc-100">{totalMarks}</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-zinc-400">Suggested time</dt><dd className="font-semibold text-zinc-100">{assessment.timeLimit}</dd></div>
                    </dl>
                    <p className="mt-5 border-t border-white/15 pt-4 text-sm leading-6 text-zinc-400">{assessment.questions.length - writtenCount} multiple choice<br />{writtenCount} written response</p>
                    <button type="button" onClick={() => setActive(assessment)} className="mt-6 min-h-12 w-full bg-sky-200 px-5 py-3 text-base font-semibold text-slate-950 hover:bg-sky-100">Open {variant === "exam" ? "examination" : variant === "tests" ? "test" : "quiz"}</button>
                    {saved && <div className="mt-5 border-t border-white/15 pt-4"><p className="text-sm text-zinc-400">Last result</p><p className="mt-2 text-2xl font-semibold text-sky-200">{saved.score} / {saved.total}</p><p className="mt-2 text-sm leading-6 text-zinc-400">Includes self-assessed written marks.</p></div>}
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-zinc-400">Multiple choice is marked automatically. Written responses are self-assessed. Results are practice estimates.</p>
        </>
      )}
    </div>
  );
}
