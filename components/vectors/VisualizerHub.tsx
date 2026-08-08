"use client";

import { useState } from "react";
import { VectorLab } from "./VectorLab";
import { VectorWorkbench } from "./VectorWorkbench";

type VisualizerView = "geometry" | "vectors";

export function VisualizerHub() {
  const [view, setView] = useState<VisualizerView>("geometry");

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-[#0a0a0a] sm:h-[calc(100dvh-4.5rem)]">
      <div className="grid shrink-0 grid-cols-2 border-b border-white/10 bg-[#090909]" role="tablist" aria-label="Visualizer section">
        <button
          type="button"
          role="tab"
          aria-selected={view === "geometry"}
          onClick={() => setView("geometry")}
          className={`min-h-11 border-b-2 px-3 text-xs font-semibold transition ${view === "geometry" ? "border-sky-400 bg-sky-400/[0.07] text-sky-200" : "border-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100"}`}
        >
          Lines and planes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "vectors"}
          onClick={() => setView("vectors")}
          className={`min-h-11 border-b-2 border-l border-l-white/10 px-3 text-xs font-semibold transition ${view === "vectors" ? "border-b-sky-400 bg-sky-400/[0.07] text-sky-200" : "border-b-transparent text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100"}`}
        >
          Vector operations
        </button>
      </div>

      <div className="min-h-0 flex-1" role="tabpanel">
        {view === "geometry" ? (
          <VectorLab embedded />
        ) : (
          <VectorWorkbench embedded vectorOnly title="Vector Explorer" />
        )}
      </div>
    </div>
  );
}
