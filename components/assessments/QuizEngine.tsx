"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import type { Assessment, AssessmentQuestion } from "@/data/linesAndPlanesData";
import { StepByStepSolution } from "./StepByStepSolution";
import { WorkedSketch } from "./WorkedSketch";
import { StudyPrompt } from "./StudyPrompt";

type QuizEngineProps = {
  assessment: Assessment;
  onComplete: (score: number, total: number) => void;
};

type AnswerValue = number | string;
type Attempt = {
  signature: string;
  currentIndex: number;
  answers: Record<string, AnswerValue>;
  revealed: string[];
  writtenMarks: Record<string, number>;
  submitted: boolean;
};

function isWritten(question: AssessmentQuestion): question is Extract<AssessmentQuestion, { kind: "written" }> {
  return question.kind === "written";
}

export function questionMarks(question: AssessmentQuestion) {
  return question.marks ?? (isWritten(question) ? question.criteria.length : 1);
}

export function assessmentSignature(assessment: Assessment) {
  return JSON.stringify(assessment.questions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    marks: questionMarks(question),
    answer: isWritten(question) ? question.sampleAnswer : [question.correctIndex, ...question.options],
  })));
}

const attemptKey = (id: string) => `mcv4u-assessment-attempt-v4-${id}`;

export function readAssessmentAttempt(assessment: Assessment): Partial<Attempt> | undefined {
  try {
    const stored = window.localStorage.getItem(attemptKey(assessment.id));
    const attempt: unknown = stored ? JSON.parse(stored) : null;
    if (attempt && typeof attempt === "object" && !Array.isArray(attempt) &&
      (attempt as Partial<Attempt>).signature === assessmentSignature(assessment)) return attempt as Partial<Attempt>;
  } catch {
    // Browser storage may be unavailable.
  }
}

export function QuizEngine({ assessment, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [revealed, setRevealed] = useState<string[]>([]);
  const [writtenMarks, setWrittenMarks] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState("");
  const reportedResult = useRef("");
  const questionRef = useRef<HTMLHeadingElement>(null);
  const signature = useMemo(() => assessmentSignature(assessment), [assessment]);
  const storageKey = attemptKey(assessment.id);
  const assessmentKind = assessment.kind ?? (assessment.mode === "quiz" ? "quiz" : "exam");
  const label = assessmentKind === "exam" ? "Final exam" : `${assessmentKind === "test" ? "Unit test" : "Quiz"} ${assessment.number}`;

  useEffect(() => {
    const saved = readAssessmentAttempt(assessment);
    queueMicrotask(() => {
      if (saved?.signature === signature) {
        const safeAnswers: Record<string, AnswerValue> = {};
        const safeMarks: Record<string, number> = {};
        assessment.questions.forEach((question) => {
          const answer = saved?.answers?.[question.id];
          if (isWritten(question)) {
            if (typeof answer === "string") safeAnswers[question.id] = answer;
            const mark = saved?.writtenMarks?.[question.id];
            if (typeof mark === "number" && Number.isInteger(mark) && mark >= 0 && mark <= questionMarks(question)) safeMarks[question.id] = mark;
          } else if (typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer < question.options.length) {
            safeAnswers[question.id] = answer;
          }
        });
        const answeredIds = assessment.questions.filter((question) => isWritten(question)
          ? typeof safeAnswers[question.id] === "string" && String(safeAnswers[question.id]).trim().length > 0
          : typeof safeAnswers[question.id] === "number").map((question) => question.id);
        setAnswers(safeAnswers);
        setWrittenMarks(safeMarks);
        setRevealed(Array.isArray(saved.revealed) ? saved.revealed.filter((id) => answeredIds.includes(id)) : []);
        setSubmitted(saved.submitted === true && answeredIds.length === assessment.questions.length);
        setCurrentIndex(typeof saved.currentIndex === "number" && Number.isInteger(saved.currentIndex)
          ? Math.max(0, Math.min(saved.currentIndex, assessment.questions.length - 1)) : 0);
      }
      setHydrated(true);
    });
  }, [assessment, signature]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ signature, currentIndex, answers, revealed, writtenMarks, submitted } satisfies Attempt));
    } catch {
      // Continue without persistence in private or storage-restricted browsers.
    }
  }, [answers, currentIndex, hydrated, revealed, signature, storageKey, submitted, writtenMarks]);

  const current = assessment.questions[currentIndex];
  const written = isWritten(current);
  const selectedChoice = typeof answers[current.id] === "number" ? answers[current.id] as number : undefined;
  const writtenResponse = typeof answers[current.id] === "string" ? answers[current.id] as string : "";
  const isRevealed = revealed.includes(current.id) || submitted;
  const hasResponse = (question: AssessmentQuestion) => isWritten(question)
    ? typeof answers[question.id] === "string" && String(answers[question.id]).trim().length > 0
    : typeof answers[question.id] === "number";
  const answeredCount = assessment.questions.filter(hasResponse).length;
  const writtenQuestions = assessment.questions.filter(isWritten);
  const autoQuestions = assessment.questions.filter((question) => !isWritten(question));
  const totalMarks = assessment.questions.reduce((total, question) => total + questionMarks(question), 0);
  const autoTotal = autoQuestions.reduce((total, question) => total + questionMarks(question), 0);
  const autoScore = autoQuestions.reduce((total, question) => total + (!isWritten(question) && answers[question.id] === question.correctIndex ? questionMarks(question) : 0), 0);
  const writtenTotal = writtenQuestions.reduce((total, question) => total + questionMarks(question), 0);
  const writtenScore = writtenQuestions.reduce((total, question) => total + (writtenMarks[question.id] ?? 0), 0);
  const reviewedWrittenCount = writtenQuestions.filter((question) => writtenMarks[question.id] !== undefined).length;
  const complete = assessment.mode === "quiz"
    ? assessment.questions.every((question) => revealed.includes(question.id) && (!isWritten(question) || writtenMarks[question.id] !== undefined))
    : submitted && reviewedWrittenCount === writtenQuestions.length;
  const score = autoScore + writtenScore;

  useEffect(() => {
    const resultKey = `${score}/${totalMarks}`;
    if (!hydrated || !complete || reportedResult.current === resultKey) return;
    reportedResult.current = resultKey;
    onComplete(score, totalMarks);
  }, [complete, hydrated, onComplete, score, totalMarks]);

  const scrollToQuestion = () => {
    requestAnimationFrame(() => {
      questionRef.current?.focus({ preventScroll: true });
      questionRef.current?.scrollIntoView({ block: "start" });
    });
  };

  const navigate = (index: number) => {
    setCurrentIndex(index);
    setNotice("");
    setConfirmSubmit(false);
    scrollToQuestion();
  };

  const revealCurrent = () => {
    if (!hasResponse(current)) {
      setNotice(written ? "Write your response before viewing the marking guidance." : "Select one answer before checking this question.");
      return;
    }
    setNotice("");
    setRevealed((items) => items.includes(current.id) ? items : [...items, current.id]);
  };

  const requestSubmit = () => {
    const missing = assessment.questions.flatMap((question, index) => hasResponse(question) ? [] : [index + 1]);
    if (missing.length > 0) {
      setNotice(`Answer every question before submitting. Unanswered questions: ${missing.join(", ")}.`);
      setConfirmSubmit(false);
      return;
    }
    setNotice("");
    setConfirmSubmit(true);
  };

  const confirmSubmission = () => {
    if (answeredCount < assessment.questions.length) {
      requestSubmit();
      return;
    }
    setSubmitted(true);
    setConfirmSubmit(false);
    setCurrentIndex(0);
    scrollToQuestion();
  };

  const reset = () => {
    setCurrentIndex(0);
    setAnswers({});
    setRevealed([]);
    setWrittenMarks({});
    setSubmitted(false);
    setConfirmSubmit(false);
    setConfirmReset(false);
    setNotice("");
    reportedResult.current = "";
  };

  const instructions = [
    "Answer all questions. Give exact values unless an approximation is requested.",
    "Show your working for written questions. Label any sketches you draw on paper.",
    assessment.mode === "quiz"
      ? "Check each answer when you are ready. Checking an answer locks it for this attempt."
      : "You can change any answer before submitting. After submitting, mark your written work with the answer key.",
  ];
  const sections = new Map<string, { question: AssessmentQuestion; index: number }[]>();
  assessment.questions.forEach((question, index) => {
    const name = (question.section ?? "Questions").replace(/^Part ([A-Z]) /, "Part $1: ");
    const group = sections.get(name) ?? [];
    group.push({ question, index });
    sections.set(name, group);
  });
  const paperButton = "min-h-11 rounded border border-slate-400 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-700 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-40";
  const primaryButton = "min-h-11 rounded bg-sky-800 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";
  const mark = questionMarks(current);
  const examNoun = assessmentKind === "test" ? "test" : "exam";

  return (
    <section className="assessment-paper mx-auto max-w-4xl rounded-md bg-[#f7f6f2] text-slate-900" aria-label={assessment.title}>
      <header className="border-b border-slate-300 px-5 py-6 sm:px-10 sm:py-8">
        <p className="text-sm font-semibold text-slate-600">MCV4U <span className="mx-2 text-slate-400" aria-hidden="true">/</span> {label}</p>
        <h2 tabIndex={-1} className="mt-2 scroll-mt-24 text-2xl font-semibold leading-tight tracking-tight focus:outline-none sm:text-3xl">{assessment.title}</h2>
        <p className="mt-3 text-sm font-semibold text-slate-700">{assessment.questions.length} questions<span className="mx-2 text-slate-400" aria-hidden="true">/</span><span className="sr-only">, </span>{totalMarks} marks</p>
        <details className="mt-5 max-w-[70ch]" open>
          <summary className="cursor-pointer text-sm font-semibold">Instructions</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
            {instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
          </ul>
        </details>
      </header>

      <nav className="border-b border-slate-300 px-5 py-5 sm:px-10" aria-label="Assessment questions">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">Jump to a question</p>
          <p className="text-sm tabular-nums text-slate-700" aria-live="polite">{answeredCount}/{assessment.questions.length} answered</p>
        </div>
        <div className="mt-3 grid gap-3">
          {[...sections].map(([name, group]) => <div key={name}>
            <p className="mb-1.5 text-sm text-slate-600">{name}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.map(({ question, index }) => (
                <button type="button" key={question.id} onClick={() => navigate(index)} aria-label={`Question ${index + 1}, ${hasResponse(question) ? "answered" : "unanswered"}`} aria-current={currentIndex === index ? "step" : undefined}
                  className={`grid h-10 min-w-10 place-items-center rounded border px-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${currentIndex === index ? "border-slate-900 bg-slate-900 text-white" : hasResponse(question) ? "border-sky-700 bg-sky-100 text-sky-900 hover:bg-sky-200" : "border-slate-400 bg-white text-slate-700 hover:border-slate-700"}`}>
                  {index + 1}
                </button>
              ))}
            </div>
          </div>)}
        </div>
      </nav>

      <div className="px-5 py-6 sm:px-10 sm:py-8">
        <div className="flex items-baseline justify-between gap-3">
          <h3 ref={questionRef} tabIndex={-1} className="scroll-mt-24 text-xl font-semibold focus:outline-none sm:text-2xl">Question {currentIndex + 1}</h3>
          <p className="shrink-0 text-sm font-semibold text-slate-700">[{mark} {mark === 1 ? "mark" : "marks"}]</p>
        </div>
        <StudyPrompt key={current.id} prompt={current.prompt} className="mt-4 max-w-[68ch] text-base leading-7 text-slate-900 sm:text-lg sm:leading-8" />

        {current.kind !== "written" ? (
          <fieldset className="mt-5 max-w-[68ch] space-y-1.5">
            <legend className="sr-only">Question {currentIndex + 1} answer choices</legend>
            {current.options.map((option, index) => {
              const chosen = selectedChoice === index;
              const correct = current.correctIndex === index;
              return (
                <div key={`${current.id}-${index}`} className={`relative flex min-h-11 items-start gap-2.5 rounded border px-3 py-2.5 text-left focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-sky-700 ${isRevealed && correct ? "border-sky-700 bg-sky-50" : isRevealed && chosen ? "border-amber-700 bg-amber-50" : chosen ? "border-sky-700 bg-sky-50" : "border-transparent"} ${isRevealed ? "" : "hover:border-slate-300 hover:bg-white"}`}>
                  <input id={`answer-${current.id}-${index}`} aria-labelledby={`answer-label-${current.id}-${index}`} type="radio" name={`answer-${current.id}`} checked={chosen} onChange={() => setAnswers((prior) => ({ ...prior, [current.id]: index }))} disabled={isRevealed} className="mt-1.5 h-4 w-4 shrink-0 accent-sky-800" />
                  <div id={`answer-label-${current.id}-${index}`} className="flex min-w-0 flex-1 gap-2.5">
                    <span className="min-w-5 shrink-0 font-semibold leading-7">{String.fromCharCode(65 + index)}.</span>
                    <MathJaxRenderer math={option} className="min-w-0 flex-1 text-base leading-7 text-slate-900" />
                    {isRevealed && correct && <span className="sr-only">Correct answer</span>}
                  </div>
                  {!isRevealed && <label htmlFor={`answer-${current.id}-${index}`} aria-hidden="true" className="absolute inset-0 cursor-pointer" />}
                </div>
              );
            })}
          </fieldset>
        ) : (
          <div className="mt-6 max-w-[68ch]">
            <label htmlFor={`response-${current.id}`} className="text-base font-semibold">Your working and answer</label>
            <textarea id={`response-${current.id}`} value={writtenResponse} onChange={(event) => { if (!isRevealed) setAnswers((prior) => ({ ...prior, [current.id]: event.target.value })); }} disabled={isRevealed} rows={7} className="mt-2 w-full resize-y rounded border border-slate-400 bg-white p-3 text-base leading-7 text-slate-900 outline-none transition focus:border-sky-800 focus:ring-1 focus:ring-sky-800 disabled:bg-slate-100 disabled:text-slate-700" />
            {writtenResponse.trim() && <details className="mt-3 text-base"><summary className="cursor-pointer font-medium text-sky-800">Preview your response</summary><MathJaxRenderer math={writtenResponse} className="mt-3 whitespace-pre-wrap border border-slate-300 bg-white p-4 leading-8" /></details>}
          </div>
        )}

        {isRevealed && (
          <div className="mt-8 border-t-2 border-slate-400 pt-7">
            {current.kind !== "written" ? (
              <>
                <h4 className="text-lg font-semibold text-slate-900">{selectedChoice === current.correctIndex ? "Correct answer" : `Answer: ${String.fromCharCode(65 + current.correctIndex)}`}</h4>
                <p className="mt-1 text-base text-slate-600">Automatically marked: {selectedChoice === current.correctIndex ? questionMarks(current) : 0} / {questionMarks(current)}</p>
                <MathJaxRenderer math={current.rationale} className="mt-4 text-base leading-8 text-slate-700" />
              </>
            ) : (
              <>
                <h4 className="text-xl font-semibold">Marking guidance</h4>
                <p className="mt-2 text-base leading-7 text-slate-700">Use the criteria to mark your own response. Award partial marks for correct work.</p>
                <ol className="mt-5 list-decimal space-y-3 pl-6 text-base leading-8 text-slate-800">{current.criteria.map((criterion, index) => <li key={`${current.id}-criterion-${index}`}><MathJaxRenderer math={criterion} /></li>)}</ol>
                <div className="mt-6 border-l-4 border-sky-800 bg-white p-5 sm:p-6"><h5 className="text-base font-semibold text-sky-900">Model response</h5><MathJaxRenderer math={current.sampleAnswer} className="mt-3 text-base leading-8 text-slate-800" /></div>
                {current.rationale !== current.sampleAnswer && <MathJaxRenderer math={current.rationale} className="mt-5 text-base leading-8 text-slate-700" />}
                <fieldset className="mt-6 border border-slate-300 bg-white p-5">
                  <legend className="px-2 text-base font-semibold">Your self-assessed mark</legend>
                  <p className="text-base leading-7 text-slate-600">Award up to {questionMarks(current)} marks.</p>
                  <div className="mt-4 flex flex-wrap gap-2">{Array.from({ length: questionMarks(current) + 1 }, (_, mark) => <button key={mark} type="button" aria-pressed={writtenMarks[current.id] === mark} onClick={() => setWrittenMarks((prior) => ({ ...prior, [current.id]: mark }))} className={`h-12 min-w-12 border px-3 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${writtenMarks[current.id] === mark ? "border-sky-800 bg-sky-800 text-white" : "border-slate-400 bg-white text-slate-800 hover:bg-slate-100"}`}>{mark}</button>)}</div>
                </fieldset>
              </>
            )}
            <WorkedSketch questionId={current.id} />
            <div className="mt-6"><StepByStepSolution key={current.id} steps={current.steps} defaultOpen title="Worked solution" appearance="paper" /></div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-300 pt-6">
          <button type="button" onClick={() => navigate(currentIndex - 1)} disabled={currentIndex === 0} className={paperButton}>Previous question</button>
          <div className="flex flex-wrap gap-3">
            {assessment.mode === "quiz" && !isRevealed && <button type="button" onClick={revealCurrent} className={primaryButton}>{written ? "View marking guidance" : "Check answer"}</button>}
            {currentIndex < assessment.questions.length - 1 && <button type="button" onClick={() => navigate(currentIndex + 1)} className={paperButton}>Next question</button>}
          </div>
        </div>
        {notice && <p role="alert" className="mt-5 border border-amber-700 bg-amber-50 p-4 text-base leading-7 text-amber-950">{notice}</p>}

        {assessment.mode === "exam" && !submitted && (
          <div className="mt-6 border-t border-slate-300 pt-4">
            <p className="text-sm text-slate-600">Submitting locks your answers and opens the solutions.</p>
            {confirmSubmit ? <div className="mt-5" role="group" aria-label="Confirm submission"><p className="text-base font-semibold">Submit this attempt?</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={confirmSubmission} className={primaryButton}>Confirm submission</button><button type="button" onClick={() => setConfirmSubmit(false)} className={paperButton}>Continue reviewing</button></div></div> : <button type="button" onClick={requestSubmit} className={`mt-4 ${primaryButton}`}>Submit {examNoun}</button>}
          </div>
        )}

        {(submitted || complete) && (
          <section className="mt-7 border-t border-slate-300 pt-5" aria-label="Results summary">
            <h4 className="text-lg font-semibold">{complete ? "Result" : "Review your answers"}</h4>
            <dl className="mt-2 grid max-w-md gap-y-2 text-sm text-slate-700">
              <div className="flex justify-between gap-4"><dt>Multiple choice</dt><dd className="font-semibold tabular-nums">{autoScore}/{autoTotal}</dd></div>
              <div className="flex justify-between gap-4"><dt>Written responses (self-marked)</dt><dd className="font-semibold tabular-nums">{writtenScore}/{writtenTotal}</dd></div>
              {complete && <div className="mt-1 flex justify-between gap-4 border-t border-slate-300 pt-2 font-semibold text-slate-900"><dt>Practice score</dt><dd>{score}/{totalMarks} ({Math.round(score / totalMarks * 100)}%)</dd></div>}
            </dl>
            {!complete && <p className="mt-3 text-sm text-slate-700">Mark each written response to see your total. {reviewedWrittenCount}/{writtenQuestions.length} marked.</p>}
          </section>
        )}

        <div className="mt-8 border-t border-slate-300 pt-5">
          {confirmReset ? <div><p className="text-base text-slate-700">Start a new attempt? Your current responses and self-assessed marks will be cleared.</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={reset} className={paperButton}>Start new attempt</button><button type="button" onClick={() => setConfirmReset(false)} className={paperButton}>Keep current attempt</button></div></div> : <button type="button" onClick={() => setConfirmReset(true)} className="min-h-11 text-base font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900">{complete ? "Retake assessment" : "Restart this attempt"}</button>}
          <p className="mt-4 text-sm leading-6 text-slate-600">Progress is saved in this browser.</p>
        </div>
      </div>
    </section>
  );
}
