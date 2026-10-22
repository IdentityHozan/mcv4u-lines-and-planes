import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { conceptModules, videoLessons } from "@/data/linesAndPlanesData";
import { getManagedLessons } from "@/lib/contentStore";

export const metadata = { title: "Lessons | MCV4U Lines and Planes" };

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const managedLessons = await getManagedLessons().catch(() => []);
  return (
    <>
      <header className="border-b border-white/10">
        <div className="section-shell py-9 sm:py-12">
          <p className="micro-label text-sky-300">Lines and Planes</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Lessons and videos</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">Follow Sections 8.1 to 9.6. Each recording appears before its written lessons, diagrams, and worked examples.</p>
        </div>
      </header>

      <section className="section-shell page-section" aria-labelledby="core-lessons-title">
        <ScrollReveal aria-labelledby="video-lessons-title">
          <p className="micro-label text-sky-300">Video lessons</p>
          <h2 id="video-lessons-title" className="mt-3 text-2xl font-semibold tracking-tight">Watch and learn</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {videoLessons.map((video) => (
              <Link key={video.id} href={`/lessons/${conceptModules.find((lesson) => lesson.videoGroup === video.id)?.id ?? conceptModules[0].id}`} className="group border border-white/10 bg-[#101010] p-6 transition hover:border-sky-400/35 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">Video {String(video.number).padStart(2, "0")}</p>
                <h3 className="mt-4 text-xl font-semibold text-zinc-100 group-hover:text-sky-200">{video.title}</h3>
                <p className="mt-3 text-base leading-7 text-zinc-300">{video.description}</p>
                {video.status !== "ready" && <p className="mt-4 text-sm text-zinc-400">Recording pending</p>}
                <p className="mt-5 text-sm font-semibold text-sky-300">{video.status === "ready" ? "Watch recording and open lessons" : "Open lessons"}</p>
              </Link>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="micro-label text-sky-300">Written lessons</p>
            <h2 id="core-lessons-title" className="mt-3 text-2xl font-semibold tracking-tight">Study in this order</h2>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-400">On average, 8 mins per lesson</p>
        </ScrollReveal>

        {[{ title: "Chapter 8 Equations of lines and planes", lessons: conceptModules.filter((lesson) => lesson.chapter === 8) }, { title: "Chapter 9 Relationships between points lines and planes", lessons: conceptModules.filter((lesson) => lesson.chapter === 9) }].map((stage, stageIndex) => (
          <ScrollReveal key={stage.title} className="mt-10" delay={stageIndex * 0.05}>
            <h3 className="text-lg font-semibold text-zinc-200">{stage.title}</h3>
            <div className="mt-4 grid gap-px bg-white/10 md:grid-cols-2">
              {stage.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="group bg-[#101010] p-6 transition hover:bg-sky-400/[0.035] sm:p-7">
                  <p className="font-mono text-xs font-semibold text-sky-300">{lesson.index}</p>
                  <h4 className="mt-4 text-xl font-semibold text-zinc-100 group-hover:text-sky-200">{lesson.title}</h4>
                  <p className="mt-3 text-base leading-7 text-zinc-300">{lesson.summary}</p>
                  <p className="mt-5 text-sm font-semibold text-sky-300">Open lesson</p>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        ))}
        <div className="mt-10 border-t border-white/10 pt-7">
          <Link href="/formulas" className="secondary-action">Open formula sheet</Link>
        </div>
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
