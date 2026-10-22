"use client";

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
  const questionRef = useRef<HTMLDivElement>(null);
  const signature = useMemo(() => assessmentSignature(assessment), [assessment]);
  const storageKey = `mcv4u-assessment-attempt-v4-${assessment.id}`;
  const assessmentKind = assessment.kind ?? (assessment.mode === "quiz" ? "quiz" : "exam");
  const label = assessmentKind === "exam" ? "Final examination" : `${assessmentKind === "test" ? "Unit test" : "Practice quiz"} ${Number(assessment.number) || assessment.number}`;

  useEffect(() => {
    let saved: Partial<Attempt> | undefined;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) saved = JSON.parse(stored) as Partial<Attempt>;
    } catch {
      // Storage restrictions must not prevent students from using an assessment.
    }
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
  }, [assessment.questions, signature, storageKey]);

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

  const navigate = (index: number) => {
    setCurrentIndex(index);
    setNotice("");
    setConfirmSubmit(false);
    questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  const instructions = assessment.instructions ?? [
    "Give exact values unless a question asks for a decimal approximation.",
    "For written responses, show your method, define parameters, and state a complete conclusion.",
    assessment.mode === "quiz" ? "Check each response when you are ready. Checked answers cannot be changed during this attempt." : "You may move freely between questions. Solutions appear only after you submit the complete paper.",
    "Written responses are self-assessed using the marking criteria. They are not automatically graded.",
  ];
  const paperButton = "min-h-12 border border-slate-400 px-5 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-700 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section className="assessment-paper border border-white/15 bg-[#f7f6f2] text-slate-900" aria-label={assessment.title}>
      <header className="border-b border-slate-300 p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-sky-800">MCV4U Lines and Planes</p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-base text-slate-600">{label}</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{assessment.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-700">{assessment.description}</p>
          </div>
          <dl className="grid min-w-48 grid-cols-2 gap-x-6 gap-y-3 text-base">
            <div><dt className="text-sm text-slate-600">Suggested time</dt><dd className="mt-1 font-semibold">{assessment.timeLimit}</dd></div>
            <div><dt className="text-sm text-slate-600">Total marks</dt><dd className="mt-1 font-semibold">{totalMarks}</dd></div>
            <div><dt className="text-sm text-slate-600">Questions</dt><dd className="mt-1 font-semibold">{assessment.questions.length}</dd></div>
            <div><dt className="text-sm text-slate-600">Answered</dt><dd className="mt-1 font-semibold">{answeredCount} of {assessment.questions.length}</dd></div>
          </dl>
        </div>
        <details className="mt-7 border-t border-slate-300 pt-5" open>
          <summary className="cursor-pointer text-base font-semibold">Instructions</summary>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-base leading-7 text-slate-700">
            {instructions.map((instruction) => <li key={instruction}><MathJaxRenderer math={instruction} /></li>)}
          </ol>
        </details>
      </header>

      <div className="border-b border-slate-300 bg-white/50 p-6 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-base font-semibold">Question navigation</p>
          <p className="text-sm text-slate-600">Filled boxes have a response. Select any number to review it.</p>
        </div>
        <nav className="mt-4 flex flex-wrap gap-2" aria-label="Assessment questions">
          {assessment.questions.map((question, index) => (
            <button type="button" key={question.id} onClick={() => navigate(index)} aria-label={`Question ${index + 1}${hasResponse(question) ? ", answered" : ", unanswered"}`} aria-current={currentIndex === index ? "step" : undefined}
              className={`grid h-11 min-w-11 place-items-center border px-2 text-base font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${currentIndex === index ? "border-slate-900 bg-slate-900 text-white" : hasResponse(question) ? "border-sky-700 bg-sky-100 text-sky-900 hover:bg-sky-200" : "border-slate-400 bg-white text-slate-700 hover:border-slate-700"}`}>
              {index + 1}
            </button>
          ))}
        </nav>
      </div>

      <div ref={questionRef} className="scroll-mt-28 p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            {current.section && <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-800">{current.section}</p>}
            <h3 className="text-2xl font-semibold">Question {currentIndex + 1}</h3>
            <p className="mt-1 text-base text-slate-600">{written ? "Written response" : "Multiple choice"}</p>
          </div>
          <p className="text-base font-semibold">[{questionMarks(current)} {questionMarks(current) === 1 ? "mark" : "marks"}]</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{current.tags.map((tag) => <KATCBadge key={tag} category={tag} showLabel appearance="paper" />)}</div>
        <MathJaxRenderer math={current.prompt} className="mt-7 max-w-none text-lg leading-9 text-slate-900" />

        {current.kind !== "written" ? (
          <div className="mt-7 space-y-3" role="radiogroup" aria-label={`Question ${currentIndex + 1} answer choices`}>
            {current.options.map((option, index) => {
              const chosen = selectedChoice === index;
              const correct = current.correctIndex === index;
              return (
                <button type="button" role="radio" aria-checked={chosen} key={`${current.id}-${index}`} onClick={() => { if (!isRevealed) setAnswers((prior) => ({ ...prior, [current.id]: index })); }} disabled={isRevealed}
                  className={`flex min-h-16 w-full items-start gap-4 border p-4 text-left text-base transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:p-5 ${isRevealed && correct ? "border-sky-700 bg-sky-50" : isRevealed && chosen ? "border-amber-700 bg-amber-50" : chosen ? "border-sky-700 bg-sky-50" : "border-slate-300 bg-white enabled:hover:border-slate-600"}`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center border text-base font-semibold ${chosen ? "border-sky-800 bg-sky-800 text-white" : "border-slate-400 text-slate-700"}`}>{String.fromCharCode(65 + index)}</span>
                  <MathJaxRenderer math={option} className="min-w-0 flex-1 pt-0.5 text-base leading-7 text-slate-900 sm:text-lg" />
                  {isRevealed && correct && <span className="hidden shrink-0 pt-1 text-sm font-semibold text-sky-800 sm:block">Correct answer</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-7">
            <label htmlFor={`response-${current.id}`} className="text-base font-semibold">Your response and working</label>
            <p className="mt-2 text-base leading-7 text-slate-600">Show each step and explain your conclusion. You may type plain text or LaTeX, or record your working on paper and summarise it here.</p>
            <textarea id={`response-${current.id}`} value={writtenResponse} onChange={(event) => { if (!isRevealed) setAnswers((prior) => ({ ...prior, [current.id]: event.target.value })); }} disabled={isRevealed} rows={9} placeholder="Write your method and conclusion here." className="mt-4 w-full resize-y border border-slate-400 bg-white p-5 text-base leading-8 text-slate-900 outline-none transition focus:border-sky-800 focus:ring-1 focus:ring-sky-800 disabled:bg-slate-100 disabled:text-slate-700" />
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
                <p className="mt-2 text-base leading-7 text-slate-700">Assess your response against each criterion. Award partial marks for correct work. This is a self-assessment, not an automatic grade.</p>
                <ol className="mt-5 list-decimal space-y-3 pl-6 text-base leading-8 text-slate-800">{current.criteria.map((criterion, index) => <li key={`${current.id}-criterion-${index}`}><MathJaxRenderer math={criterion} /></li>)}</ol>
                <div className="mt-6 border-l-4 border-sky-800 bg-white p-5 sm:p-6"><h5 className="text-base font-semibold text-sky-900">Model response</h5><MathJaxRenderer math={current.sampleAnswer} className="mt-3 text-base leading-8 text-slate-800" /></div>
                <MathJaxRenderer math={current.rationale} className="mt-5 text-base leading-8 text-slate-700" />
                <fieldset className="mt-6 border border-slate-300 bg-white p-5">
                  <legend className="px-2 text-base font-semibold">Your self-assessed mark</legend>
                  <p className="text-base leading-7 text-slate-600">Select a mark out of {questionMarks(current)} using the criteria above. A teacher may award a different mark.</p>
                  <div className="mt-4 flex flex-wrap gap-2">{Array.from({ length: questionMarks(current) + 1 }, (_, mark) => <button key={mark} type="button" aria-pressed={writtenMarks[current.id] === mark} onClick={() => setWrittenMarks((prior) => ({ ...prior, [current.id]: mark }))} className={`h-12 min-w-12 border px-3 text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 ${writtenMarks[current.id] === mark ? "border-sky-800 bg-sky-800 text-white" : "border-slate-400 bg-white text-slate-800 hover:bg-slate-100"}`}>{mark}</button>)}</div>
                </fieldset>
              </>
            )}
            <div className="mt-6"><StepByStepSolution steps={current.steps} defaultOpen title="Worked solution" appearance="paper" /></div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-300 pt-6">
          <button type="button" onClick={() => navigate(currentIndex - 1)} disabled={currentIndex === 0} className={paperButton}>Previous question</button>
          <div className="flex flex-wrap gap-3">
            {assessment.mode === "quiz" && !isRevealed && <button type="button" onClick={revealCurrent} className="min-h-12 bg-sky-800 px-6 py-3 text-base font-semibold text-white hover:bg-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700">{written ? "View marking guidance" : "Check answer"}</button>}
            {currentIndex < assessment.questions.length - 1 && <button type="button" onClick={() => navigate(currentIndex + 1)} className={paperButton}>Next question</button>}
          </div>
        </div>
        {notice && <p role="alert" className="mt-5 border border-amber-700 bg-amber-50 p-4 text-base leading-7 text-amber-950">{notice}</p>}

        {assessment.mode === "exam" && !submitted && (
          <div className="mt-8 border border-slate-300 bg-white p-5 sm:p-6">
            <h4 className="text-lg font-semibold">Submit your {assessmentKind === "test" ? "test" : "examination"}</h4>
            <p className="mt-2 text-base leading-7 text-slate-600">{answeredCount} of {assessment.questions.length} questions answered. Check your work before submitting. Your answers will then be locked and solutions will become available.</p>
            {confirmSubmit ? <div className="mt-5" role="group" aria-label="Confirm submission"><p className="text-base font-semibold">Are you ready to submit? You cannot edit this attempt afterwards.</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => { setSubmitted(true); setConfirmSubmit(false); setCurrentIndex(0); questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="min-h-12 bg-sky-800 px-6 py-3 text-base font-semibold text-white hover:bg-sky-900">Confirm submission</button><button type="button" onClick={() => setConfirmSubmit(false)} className={paperButton}>Continue reviewing</button></div></div> : <button type="button" onClick={requestSubmit} className="mt-5 min-h-12 bg-sky-800 px-6 py-3 text-base font-semibold text-white hover:bg-sky-900">Submit {assessmentKind === "test" ? "test" : "examination"}</button>}
          </div>
        )}

        {(submitted || complete) && (
          <section className="mt-8 border-t-2 border-slate-800 pt-6" aria-label="Results summary">
            <h4 className="text-2xl font-semibold">{complete ? "Assessment summary" : "Submission received"}</h4>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="border border-slate-300 bg-white p-5"><p className="text-base text-slate-600">Automatically marked multiple choice</p><p className="mt-2 text-3xl font-semibold">{autoScore} / {autoTotal}</p></div>
              <div className="border border-slate-300 bg-white p-5"><p className="text-base text-slate-600">Self-assessed written responses</p><p className="mt-2 text-3xl font-semibold">{writtenScore} / {writtenTotal}</p><p className="mt-2 text-sm text-slate-600">{reviewedWrittenCount} of {writtenQuestions.length} reviewed</p></div>
            </div>
            {complete ? <p className="mt-5 text-base leading-7 text-slate-800">Practice result: <strong>{score} / {totalMarks} ({Math.round(score / totalMarks * 100)}%)</strong>. This includes your self-assessed written marks and is not a teacher-awarded grade.</p> : <p className="mt-5 text-base leading-7 text-slate-800">Use the numbered navigation to review and self-assess every written response. Your combined practice result will appear when all written responses have a mark.</p>}
          </section>
        )}

        <div className="mt-8 border-t border-slate-300 pt-5">
          {confirmReset ? <div><p className="text-base text-slate-700">Start a new attempt? Your current responses and self-assessed marks will be cleared.</p><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={reset} className={paperButton}>Start new attempt</button><button type="button" onClick={() => setConfirmReset(false)} className={paperButton}>Keep current attempt</button></div></div> : <button type="button" onClick={() => setConfirmReset(true)} className="min-h-11 text-base font-medium text-slate-600 underline underline-offset-4 hover:text-slate-900">{complete ? "Retake assessment" : "Restart this attempt"}</button>}
          <p className="mt-4 text-sm leading-6 text-slate-600">Your attempt is saved on this browser when browser storage is available.</p>
        </div>
      </div>
    </section>
  );
}
