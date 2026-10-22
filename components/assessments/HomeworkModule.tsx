"use client";

import { useEffect, useMemo, useState } from "react";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { KATCBadge } from "./KATCBadge";
import { StepByStepSolution } from "./StepByStepSolution";
import { homeworkSets } from "@/data/linesAndPlanesData";

const STORAGE_KEY = "mcv4u-lines-and-planes-homework";

export function HomeworkModule() {
  const [activeSet, setActiveSet] = useState(homeworkSets[0].id);
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
        <div className="border border-white/10 bg-[#111] p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="micro-label text-zinc-500">Practice progress</p>
              <p className="mt-2 font-mono text-3xl text-zinc-100">{progress}%</p>
            </div>
            <p className="text-xs text-zinc-600">{completed.length}/{totalProblems}</p>
          </div>
          <div className="mt-4 h-1 bg-white/10">
            <div className="h-full bg-sky-300 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="mt-3 space-y-1">
          {homeworkSets.map((set) => {
            const done = set.problems.filter((problem) => completed.includes(problem.id)).length;
            return (
              <button
                type="button"
                key={set.id}
                onClick={() => setActiveSet(set.id)}
                className={`w-full border p-4 text-left transition ${
                  selected.id === set.id
                    ? "border-sky-400/35 bg-sky-400/[0.055]"
                    : "border-white/10 bg-[#0e0e0e] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="micro-label text-sky-300">Set {set.number}</span>
                  <span className="font-mono text-[10px] text-zinc-600">{done}/{set.problems.length}</span>
                </div>
                <p className="mt-2 text-base font-semibold text-zinc-200">{set.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="micro-label text-sky-300">Homework {selected.number}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{selected.title}</h3>
            <p className="mt-2 text-base leading-7 text-zinc-300">{selected.focus}</p>
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
      </div>
    </div>
  );
}
