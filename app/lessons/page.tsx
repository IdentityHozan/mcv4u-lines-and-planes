import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { conceptModules, videoLessons } from "@/data/linesAndPlanesData";
import { getManagedLessons } from "@/lib/contentStore";

export const metadata = { title: "Lessons | MCV4U Lines and Planes" };
export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const managedLessons = await getManagedLessons().catch(() => []);

  return (
    <>
      <PageHeader
        eyebrow="Lesson library"
        title="Learn one idea at a time"
        description="The eight core lessons follow a deliberate order. Open each lesson on its own page, work through the example, then test the geometry in the visualizer."
        actions={<Link href="/formulas" className="secondary-action">Open formula sheet</Link>}
      />

      <section className="section-shell page-section" aria-labelledby="core-lessons-title">
        <div className="max-w-3xl">
          <p className="micro-label text-sky-300">Core sequence</p>
          <h2 id="core-lessons-title" className="mt-4 text-3xl font-semibold tracking-tight">Lines and Planes lessons</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {conceptModules.map((lesson, index) => {
            const hasVideo = index < videoLessons.length;
            return (
              <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="group border border-white/10 bg-[#111] p-6 transition hover:border-sky-400/35 hover:bg-sky-400/[0.035] sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="micro-label text-sky-300">{lesson.index}</span>
                  {hasVideo && <span className="text-xs font-semibold text-zinc-400">Includes video</span>}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-zinc-100 group-hover:text-sky-200">{lesson.title}</h3>
                <p className="mt-2 text-xs font-semibold text-zinc-400">{lesson.kicker}</p>
                <p className="mt-4 line-clamp-3 text-sm leading-7 text-zinc-400">{lesson.summary}</p>
                <p className="mt-5 text-sm font-semibold text-sky-300">Open lesson</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0d0d0d]">
        <div className="section-shell page-section">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="micro-label text-sky-300">Teacher-created content</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Additional lessons</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">Lessons published through the admin panel appear here.</p>
            </div>
            <Link href="/admin" className="secondary-action">Open admin</Link>
          </div>

          {managedLessons.length === 0 ? (
            <div className="mt-8 border border-white/10 bg-[#111] p-6 text-sm text-zinc-400">No additional lessons have been published yet.</div>
          ) : (
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
          )}
        </div>
      </section>
    </>
  );
}
