import Link from "@/components/ui/SiteLink";
import { DownloadFormulaSheetButton } from "@/components/lessons/DownloadFormulaSheetButton";
import { PageHeader } from "@/components/layout/PageHeader";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { formulaGroups } from "@/data/linesAndPlanesData";

export const metadata = { title: "Formula Sheet | MCV4U Lines and Planes" };

export default function FormulaSheetPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quick reference"
        title="Formula sheet"
        description="Use this page after learning the method. It keeps the essential equations, conditions, and notation in one place."
        actions={<><DownloadFormulaSheetButton /><Link href="/lessons" className="secondary-action">Return to lessons</Link></>}
      />
      <section className="section-shell page-section">
        <div className="space-y-12">
          {formulaGroups.map((group, index) => (
            <ScrollReveal key={group.title} delay={index * 0.04}>
              <h2 className="text-2xl font-semibold">{group.title}</h2>
              <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                {group.formulas.map((formula) => (
                  <div key={formula.label} className="grid gap-4 py-5 lg:grid-cols-[180px_minmax(0,1fr)_280px] lg:items-center">
                    <p className="text-sm font-semibold text-zinc-300">{formula.label}</p>
                    <MathJaxRenderer math={formula.math} className="text-base text-zinc-100" />
                    <p className="text-sm leading-6 text-zinc-400">{formula.note}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
