"use client";

import { Check, Download, FileText } from "lucide-react";
import { useCallback, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { Modal } from "@/components/ui/Modal";
import { StepByStepSolution } from "@/components/assessments/StepByStepSolution";
import { conceptModules, formulaGroups } from "@/data/linesAndPlanesData";

export function TextMaterial() {
  const [formulaOpen, setFormulaOpen] = useState(false);

  const downloadFormulaSheet = useCallback(() => {
    const sections = formulaGroups
      .map(
        (group) => `<section><h2>${group.title}</h2>${group.formulas
          .map(
            (formula) => `<article><h3>${formula.label}</h3><div class="formula">${formula.math}</div><p>${formula.note}</p></article>`,
          )
          .join("")}</section>`,
      )
      .join("");

    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MCV4U Topic H Formula Sheet</title><script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script><style>body{font-family:Arial,sans-serif;max-width:960px;margin:0 auto;padding:48px;color:#111}header{border-bottom:3px solid #111;padding-bottom:22px;margin-bottom:30px}h1{font-size:34px;margin:0 0 8px}header p{color:#555;margin:0}section{break-inside:avoid;margin:30px 0}h2{font-size:20px;border-bottom:1px solid #bbb;padding-bottom:8px}article{display:grid;grid-template-columns:150px 1fr 180px;gap:18px;align-items:center;border-bottom:1px solid #e5e5e5;padding:14px 0}h3,p{font-size:13px;margin:0}.formula{font-size:16px}article p{color:#555}@media(max-width:650px){article{grid-template-columns:1fr;gap:6px}}@media print{body{padding:0}button{display:none}}</style></head><body><header><h1>Lines &amp; Planes</h1><p>MCV4U · Topic H · Formula Sheet</p></header>${sections}</body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "MCV4U_Topic_H_Formula_Sheet.html";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }, []);

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="micro-label text-sky-300">Reference system</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Theory, without the fog.</h2>
        </div>
        <button
          type="button"
          onClick={() => setFormulaOpen(true)}
          className="inline-flex min-h-11 items-center justify-center gap-3 border border-white/15 px-4 text-sm font-semibold text-zinc-300 transition hover:border-sky-400/45 hover:text-sky-300"
        >
          <FileText size={16} /> Formula sheet
        </button>
      </div>

      <div className="space-y-3">
        {conceptModules.map((concept, index) => (
          <Accordion
            key={concept.id}
            defaultOpen={index === 0}
            title={
              <span className="grid gap-3 sm:grid-cols-[64px_1fr_auto] sm:items-center">
                <span className="micro-label text-sky-300">{concept.index}</span>
                <span>
                  <span className="block text-base font-semibold text-zinc-200">{concept.title}</span>
                  <span className="mt-1 block text-xs text-zinc-600">{concept.kicker}</span>
                </span>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-600 sm:block">
                  {concept.equations.length} forms
                </span>
              </span>
            }
          >
            <p className="max-w-4xl text-sm leading-7 text-zinc-400">{concept.summary}</p>
            <div className="mt-6 grid gap-px bg-white/10 lg:grid-cols-2">
              {concept.equations.map((equation) => (
                <div key={equation.label} className="bg-[#0e0e0e] p-5">
                  <Badge>{equation.label}</Badge>
                  <MathJaxRenderer math={equation.math} className="mt-5 min-h-9 text-base text-zinc-100" />
                  <p className="mt-3 text-xs leading-5 text-zinc-600">{equation.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="border border-white/10 p-5">
                <p className="micro-label text-zinc-500">Quality checks</p>
                <ul className="mt-4 space-y-3">
                  {concept.keyChecks.map((check) => (
                    <li key={check} className="flex gap-3 text-sm leading-6 text-zinc-500">
                      <Check size={14} className="mt-1 shrink-0 text-sky-300" /> {check}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-3 border-l-2 border-sky-400 pl-4">
                  <p className="micro-label text-sky-300">Worked example</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{concept.workedExample.prompt}</p>
                </div>
                <StepByStepSolution
                  steps={concept.workedExample.steps}
                  answer={concept.workedExample.conclusion}
                  title="Reveal worked reasoning"
                />
              </div>
            </div>
          </Accordion>
        ))}
      </div>

      <Modal open={formulaOpen} onClose={() => setFormulaOpen(false)} title="MCV4U Topic H formula sheet">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="micro-label text-sky-300">Quick reference · Topic H</p>
              <h3 className="mt-2 text-2xl font-semibold">Lines &amp; Planes</h3>
            </div>
            <button
              type="button"
              onClick={downloadFormulaSheet}
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-sky-300 px-4 text-sm font-semibold text-black transition hover:bg-sky-200"
            >
              <Download size={15} /> Download MathJax sheet
            </button>
          </div>
          <div className="mt-7 space-y-8">
            {formulaGroups.map((group) => (
              <section key={group.title}>
                <h4 className="text-sm font-semibold text-zinc-200">{group.title}</h4>
                <div className="mt-3 divide-y divide-white/10 border-y border-white/10">
                  {group.formulas.map((formula) => (
                    <div key={formula.label} className="grid gap-3 py-4 sm:grid-cols-[140px_1fr_200px] sm:items-center">
                      <p className="micro-label text-zinc-600">{formula.label}</p>
                      <MathJaxRenderer math={formula.math} className="text-sm text-zinc-100" />
                      <p className="text-xs text-zinc-600">{formula.note}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
