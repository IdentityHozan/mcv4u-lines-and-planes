"use client";

import Link from "@/components/ui/SiteLink";
import { useEffect, useMemo, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { KATCBadge } from "./KATCBadge";
import { StepByStepSolution } from "./StepByStepSolution";
import { homeworkSets } from "@/data/linesAndPlanesData";

import { courseUnits, homeworkHref, quizHref, testHref, unitForSection } from "@/data/courseUnits";

const STORAGE_KEY = "mcv4u-lines-and-planes-homework";

export function HomeworkModule({ initialSection }: { initialSection?: string }) {
  const [activeSet, setActiveSet] = useState(() => (homeworkSets.find((set) => set.number === initialSection) ?? homeworkSets[0]).id);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        const ids = new Set(homeworkSets.flatMap((set) => set.problems.map((problem) => problem.id)));
        if (Array.isArray(parsed)) queueMicrotask(() => setCompleted([...new Set(parsed.filter((id): id is string => typeof id === "string" && ids.has(id)))]));
      }
    } catch {}
  }, []);

  const selected = homeworkSets.find((set) => set.id === activeSet) ?? homeworkSets[0];
  const unit = unitForSection(selected.number);
  const selectSection = (id: string) => {
    setActiveSet(id);
    const set = homeworkSets.find((item) => item.id === id);
    if (set) window.history.replaceState(null, "", homeworkHref(set.number));
  };
  const totalProblems = homeworkSets.reduce((total, set) => total + set.problems.length, 0);
  const progress = Math.round((completed.length / totalProblems) * 100);

  const toggleCompleted = (problemId: string) => {
    setCompleted((current) => {
      const next = current.includes(problemId)
        ? current.filter((id) => id !== problemId)
        : [...current, problemId];
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const setCompletion = useMemo(
    () => selected.problems.filter((problem) => completed.includes(problem.id)).length,
    [completed, selected.problems],
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[270px_1fr]">
      <div>
        <div className="border-b border-white/10 pb-4">
          <p className="text-sm text-zinc-400">Completed {completed.length} / {totalProblems}</p>
          <div className="mt-3 h-1 bg-white/10"><div className="h-full bg-sky-300 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        </div>
        <label className="mt-5 block text-base font-semibold xl:hidden">Section
          <select value={activeSet} onChange={(event) => selectSection(event.target.value)} className="mt-3 w-full border border-white/20 bg-[#111] p-3 text-base text-zinc-100">{homeworkSets.map((set) => <option key={set.id} value={set.id}>Homework {set.number} {set.title}</option>)}</select>
        </label>
        <nav aria-label="Section homework" className="mt-5 hidden space-y-5 xl:block">
          {courseUnits.map((group) => <section key={group.id}><h2 className="mb-2 text-sm font-semibold text-zinc-300">Unit {group.id}</h2>{homeworkSets.filter((set) => group.sections.includes(set.number)).map((set) => {
            const done = set.problems.filter((problem) => completed.includes(problem.id)).length;
            return (
              <button
                type="button"
                key={set.id}
                aria-current={selected.id === set.id ? "page" : undefined}
                onClick={() => selectSection(set.id)}
                className={`w-full border p-4 text-left transition ${
                  selected.id === set.id
                    ? "border-sky-400/35 bg-sky-400/[0.055]"
                    : "border-white/10 bg-[#0e0e0e] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="micro-label text-sky-300">Homework {set.number}</span>
                  <span className="font-mono text-xs text-zinc-400">{done}/{set.problems.length}</span>
                </div>
              </button>
            );
          })}</section>)}
        </nav>
      </div>

      <div>
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="micro-label text-sky-300">Homework {selected.number}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{selected.title}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>{selected.estimatedMinutes} min</span>
            <span>{setCompletion}/{selected.problems.length} complete</span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {selected.problems.map((problem, index) => {
            const isComplete = completed.includes(problem.id);
            return (
              <article key={problem.id} className={`border bg-[#111] p-5 sm:p-6 ${isComplete ? "border-sky-400/25" : "border-white/10"}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-4">
                    <span className="font-mono text-xs text-zinc-600">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag) => <KATCBadge key={tag} category={tag} />)}
                      </div>
                      <h4 className="mt-4 text-lg font-semibold text-zinc-200">{problem.title}</h4>
                      <MathJaxRenderer math={problem.prompt} className="mt-3 max-w-3xl text-base leading-8 text-zinc-200" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCompleted(problem.id)}
                    className={`flex shrink-0 items-center gap-2 border px-3 py-2 text-xs font-semibold transition ${
                      isComplete
                        ? "border-sky-400/40 bg-sky-400/[0.08] text-sky-300"
                        : "border-white/10 text-zinc-500 hover:border-white/25 hover:text-zinc-300"
                    }`}
                    aria-pressed={isComplete}
                  >
                    {isComplete ? "Completed" : "Mark complete"}
                  </button>
                </div>

                <details className="group mt-5 border-l border-white/10 pl-4">
                  <summary className="cursor-pointer text-base font-semibold text-zinc-300 transition hover:text-zinc-100">
                    Show hint
                  </summary>
                  <MathJaxRenderer math={problem.hint} className="mt-3 text-base leading-7 text-zinc-300" />
                </details>

                <div className="mt-5">
                  <StepByStepSolution steps={problem.steps} answer={problem.answer} />
                </div>
              </article>
            );
          })}
        </div>
        {unit && <section className="mt-10 border-t border-white/15 pt-7" aria-label="Continue this unit">
          <div className="flex flex-wrap gap-3">
            {(() => { const next = unit.sections[unit.sections.indexOf(selected.number) + 1]; return next ? <Link href={homeworkHref(next)} onClick={(event) => { event.preventDefault(); const set = homeworkSets.find((item) => item.number === next); if (set) { selectSection(set.id); window.scrollTo({ top: 0, behavior: "smooth" }); } }} className="primary-action">Next homework {next}</Link> : <Link href={quizHref(unit.id)} className="primary-action">Quiz {unit.id}</Link>; })()}
            {unit.sections.indexOf(selected.number) < unit.sections.length - 1 && <Link href={quizHref(unit.id)} className="secondary-action">Quiz {unit.id}</Link>}
            <Link href={testHref(unit.id)} className="secondary-action">Test {unit.id}</Link>
          </div>
        </section>}
      </div>
    </div>
  );
}
