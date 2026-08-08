"use client";

import { useCallback } from "react";
import { formulaGroups } from "@/data/linesAndPlanesData";

export function DownloadFormulaSheetButton() {
  const download = useCallback(() => {
    const sections = formulaGroups
      .map(
        (group) => `<section><h2>${group.title}</h2>${group.formulas
          .map((formula) => `<article><h3>${formula.label}</h3><div class="formula">${formula.math}</div><p>${formula.note}</p></article>`)
          .join("")}</section>`,
      )
      .join("");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>MCV4U Topic H Formula Sheet</title><script>window.MathJax={tex:{inlineMath:[['\\\\(','\\\\)']],displayMath:[['\\\\[','\\\\]']]},svg:{fontCache:'global'}};</script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script><style>body{font-family:Arial,sans-serif;max-width:920px;margin:0 auto;padding:42px;color:#111}header{border-bottom:3px solid #111;padding-bottom:20px;margin-bottom:28px}h1{font-size:32px;margin:0 0 8px}header p{color:#555;margin:0}section{break-inside:avoid;margin:30px 0}h2{font-size:20px;border-bottom:1px solid #aaa;padding-bottom:8px}article{display:grid;grid-template-columns:150px 1fr 210px;gap:18px;align-items:center;border-bottom:1px solid #ddd;padding:14px 0}h3,p{font-size:13px;margin:0}.formula{font-size:16px}article p{color:#555}@media(max-width:650px){article{grid-template-columns:1fr;gap:6px}}@media print{body{padding:0}}</style></head><body><header><h1>Lines and Planes</h1><p>MCV4U · Topic H · Formula Sheet</p></header>${sections}</body></html>`;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "MCV4U_Topic_H_Formula_Sheet.html";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }, []);

  return <button type="button" onClick={download} className="primary-action">Download formula sheet</button>;
}
