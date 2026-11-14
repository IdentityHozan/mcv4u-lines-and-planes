"use client";

import Link from "@/components/ui/SiteLink";
import { useCallback, useEffect, useRef, useState } from "react";
import { finalExam, quizzes, tests, type Assessment } from "@/data/linesAndPlanesData";
import { courseUnits, quizHref, sectionRange, testHref } from "@/data/courseUnits";
import { assessmentSignature, questionMarks, QuizEngine, readAssessmentAttempt } from "./QuizEngine";
import { AssessmentSolutions } from "./AssessmentSolutions";

const SCORE_KEY = "mcv4u-lines-and-planes-scores-v4";
const allAssessments = [...quizzes, ...tests, finalExam];
const quietLink = "inline-flex min-h-11 items-center text-sm font-semibold text-sky-200 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300";
type SavedScore = { score: number; total: number; signature: string };
type AttemptStatus = "in progress" | "ready for review";
type AssessmentHubProps = { variant: "quizzes" | "tests" | "exam"; initialUnit?: string; initialSolution?: string };

function getAttemptStatuses() {
  const statuses: Record<string, AttemptStatus> = {};
  for (const assessment of allAssessments) {
    const attempt = readAssessmentAttempt(assessment);
    if (attempt?.submitted === true || (assessment.kind === "quiz" && Array.isArray(attempt?.revealed) && assessment.questions.every((question) =>
      attempt.revealed?.includes(question.id) && (question.kind !== "written" || attempt.writtenMarks?.[question.id] !== undefined)))) {
      statuses[assessment.id] = "ready for review";
    } else if (assessment.questions.some((question) => {
      const answer = attempt?.answers?.[question.id];
      return question.kind === "written"
        ? typeof answer === "string" && !!answer.trim()
        : Number.isInteger(answer) && Number(answer) >= 0 && Number(answer) < question.options.length;
    })) {
      statuses[assessment.id] = "in progress";
    }
  }
  return statuses;
}

export function AssessmentHub({ variant, initialUnit, initialSolution }: AssessmentHubProps) {
  const [selectedUnit, setSelectedUnit] = useState(() => courseUnits.some((unit) => unit.id === initialUnit) ? initialUnit! : "all");
  const [active, setActive] = useState<Assessment | null>(null);
  const [scores, setScores] = useState<Record<string, SavedScore>>({});
  const [attempts, setAttempts] = useState<Record<string, AttemptStatus>>({});
  const workspaceRef = useRef<HTMLDivElement>(null);
  const assessments = variant === "quizzes" ? quizzes : variant === "tests" ? tests : [finalExam];
  const solutionAssessment = assessments.find((assessment) => assessment.id === initialSolution);
  const listPath = variant === "exam" ? "/exam" : variant === "tests" ? "/tests" : "/assessments";
  const returnPath = variant === "exam" || selectedUnit === "all" ? listPath : `${listPath}?unit=${encodeURIComponent(selectedUnit)}`;
  const noun = variant === "exam" ? "exam" : variant === "tests" ? "test" : "quiz";
  const back = variant === "exam" ? "Back to exam" : `Back to ${variant}`;
  const visibleAssessments = variant === "exam" || selectedUnit === "all" ? assessments : assessments.filter((assessment) => assessment.number === selectedUnit);

  useEffect(() => {
    const status = getAttemptStatuses();
    queueMicrotask(() => setAttempts(status));
    try {
      const stored = window.localStorage.getItem(SCORE_KEY);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
      const safe: Record<string, SavedScore> = {};
      allAssessments.forEach((assessment) => {
        const candidate = (parsed as Record<string, Partial<SavedScore>>)[assessment.id];
        const total = assessment.questions.reduce((sum, question) => sum + questionMarks(question), 0);
        if (candidate && typeof candidate.score === "number" && candidate.total === total && Number.isInteger(candidate.score) && candidate.score >= 0 && candidate.score <= total && candidate.signature === assessmentSignature(assessment)) {
          safe[assessment.id] = { score: candidate.score, total: candidate.total, signature: candidate.signature };
        }
      });
      queueMicrotask(() => setScores(safe));
    } catch {
      // A malformed local score must not block the question bank.
    }
  }, []);

  useEffect(() => {
    if (active) workspaceRef.current?.querySelector<HTMLHeadingElement>("h2")?.focus();
  }, [active]);

  const scrollToWorkspace = () => workspaceRef.current?.scrollIntoView({ block: "start" });

  const saveScore = useCallback((assessment: Assessment, score: number, total: number) => {
    setScores((current) => {
      const next = { ...current, [assessment.id]: { score, total, signature: assessmentSignature(assessment) } };
      try { window.localStorage.setItem(SCORE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <div ref={workspaceRef} className="scroll-mt-24">
      {solutionAssessment ? (
        <>
          <Link href={returnPath} className={quietLink}>← {back}</Link>
          <AssessmentSolutions assessment={solutionAssessment} />
        </>
      ) : active ? (
        <>
          <button type="button" onClick={() => { setAttempts(getAttemptStatuses()); setActive(null); scrollToWorkspace(); }} className={`mb-3 ${quietLink}`}>← {back}</button>
          <QuizEngine key={active.id} assessment={active} onComplete={(score, total) => saveScore(active, score, total)} />
        </>
      ) : (
        <>
          {variant !== "exam" && <div className="mb-5">
            <label className="inline-flex flex-wrap items-center gap-3 text-sm font-semibold text-zinc-200">
              Unit
              <select
                value={selectedUnit}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedUnit(value);
                  window.history.replaceState(null, "", value === "all" ? listPath : (variant === "tests" ? testHref(value) : quizHref(value)));
                }}
                className="min-h-11 max-w-full rounded-md border border-white/20 bg-[#111] px-3 py-2 text-base text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
              >
                <option value="all">All units</option>
                {courseUnits.map((unit) => <option key={unit.id} value={unit.id}>Unit {unit.id}</option>)}
              </select>
            </label>
          </div>}
          <div className="divide-y divide-white/15 border-y border-white/15">
            {visibleAssessments.map((assessment) => {
              const saved = scores[assessment.id];
              const attempt = attempts[assessment.id];
              const unit = courseUnits.find((item) => item.id === assessment.number);
              const solutionHref = `${returnPath}${returnPath.includes("?") ? "&" : "?"}solution=${encodeURIComponent(assessment.id)}`;
              const totalMarks = assessment.questions.reduce((total, question) => total + questionMarks(question), 0);
              const title = unit ? `${variant === "tests" ? "Test" : "Quiz"} ${unit.id}: ${assessment.title}` : assessment.title;
              const action = attempt === "ready for review" ? "Review attempt" : attempt ? `Resume ${noun}` : `Start ${noun}`;
              return (
                <article key={assessment.id} className="flex flex-col gap-x-8 gap-y-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold leading-snug text-zinc-100 sm:text-xl">{title}</h2>
                    {unit && <p className="mt-1 text-sm text-zinc-400">Sections {sectionRange(unit.sections)}</p>}
                    <p className="mt-2 text-sm text-zinc-300">{assessment.questions.length} questions<span className="mx-2 text-zinc-500" aria-hidden="true">/</span><span className="sr-only">, </span>{totalMarks} marks{saved && <span className="ml-3 text-sky-200">Last score: {saved.score}/{saved.total}</span>}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
                    <button type="button" onClick={() => { setActive(assessment); scrollToWorkspace(); }} className="primary-action rounded-md" aria-label={`${action}: ${title}`}>{action}</button>
                    <Link href={solutionHref} className={quietLink} aria-label={`Answer key: ${title}`}>Answer key</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
