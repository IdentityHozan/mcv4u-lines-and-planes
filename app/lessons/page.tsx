import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { conceptModules } from "@/data/linesAndPlanesData";
import { getManagedLessons } from "@/lib/contentStore";

export const metadata = { title: "Lessons | MCV4U Lines and Planes" };
export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const managedLessons = await getManagedLessons().catch(() => []);

  return (
    <>
      <PageHeader
        eyebrow="8 lessons"
        title="Learn in a clear order"
        description="Start with equations, build the geometry, then solve intersections and distance. Each lesson includes a diagram, a method, and one complete example."
        actions={<Link href="/formulas" className="secondary-action">Open formula sheet</Link>}
      />

      <section className="section-shell page-section" aria-labelledby="core-lessons-title">
        <ScrollReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="micro-label text-sky-300">Core sequence</p>
            <h2 id="core-lessons-title" className="mt-4 text-3xl font-semibold tracking-tight">Follow the lesson order</h2>
          </div>
          <p className="text-sm font-semibold text-zinc-400">On average, 8 mins per lesson</p>
        </ScrollReveal>

        {[{ title: "Foundations", lessons: conceptModules.slice(0, 4) }, { title: "Solving in three dimensions", lessons: conceptModules.slice(4) }].map((stage, stageIndex) => (
          <ScrollReveal key={stage.title} className="mt-10" delay={stageIndex * 0.05}>
            <h3 className="text-lg font-semibold text-zinc-200">{stage.title}</h3>
            <div className="mt-4 grid gap-px bg-white/10 md:grid-cols-2">
              {stage.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="group bg-[#101010] p-6 transition hover:bg-sky-400/[0.035] sm:p-7">
                  <p className="font-mono text-xs font-semibold text-sky-300">{lesson.index}</p>
                  <h4 className="mt-4 text-xl font-semibold text-zinc-100 group-hover:text-sky-200">{lesson.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{lesson.summary}</p>
                  <p className="mt-5 text-sm font-semibold text-sky-300">Open lesson</p>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        ))}
      </section>

      {managedLessons.length > 0 && (
        <section className="border-t border-white/10 bg-[#0d0d0d]">
          <ScrollReveal className="section-shell page-section">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="micro-label text-sky-300">Added lessons</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Additional lessons</h2>
            </div>
            <Link href="/admin" className="secondary-action">Open admin</Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {managedLessons.map((lesson) => (
              <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="border border-white/10 bg-[#111] p-6 transition hover:border-sky-400/35">
                <p className="micro-label text-sky-300">Additional lesson</p>
                <h3 className="mt-4 text-lg font-semibold">{lesson.title}</h3>
                <p className="mt-2 text-xs text-zinc-400">{lesson.subtitle}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-400">{lesson.summary}</p>
                <p className="mt-5 text-sm font-semibold text-sky-300">Open lesson</p>
              </Link>
            ))}
          </div>
          </ScrollReveal>
        </section>
      )}
    </>
  );
}
