import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { getManagedLesson } from "@/lib/contentStore";
import { StepByStepSolution } from "@/components/assessments/StepByStepSolution";
import { VideoLessonPlayer } from "@/components/lessons/VideoLessonPlayer";
import { LessonDiagram } from "@/components/lessons/LessonDiagram";
import { Badge } from "@/components/ui/Badge";
import { MathJaxRenderer } from "@/components/ui/MathJaxRenderer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { conceptModules, videoLessons } from "@/data/linesAndPlanesData";

export const dynamicParams = true;
export const revalidate = 0;

export function generateStaticParams() {
  return conceptModules.map((lesson) => ({ slug: lesson.id }));
}

function getYouTubeId(url: string | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1).split("/")[0] || null;
    if (parsed.hostname.endsWith("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2] || null;
      return parsed.searchParams.get("v");
    }
  } catch {}
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const coreLesson = conceptModules.find((lesson) => lesson.id === slug);
  if (coreLesson) return { title: `${coreLesson.title} | MCV4U Lines and Planes`, description: coreLesson.summary };
  const lesson = await getManagedLesson(slug).catch(() => null);
  return lesson ? { title: `${lesson.title} | MCV4U Lines and Planes`, description: lesson.summary } : {};
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coreIndex = conceptModules.findIndex((lesson) => lesson.id === slug);

  if (coreIndex >= 0) {
    const lesson = conceptModules[coreIndex];
    const video = videoLessons.find((item) => item.id === lesson.videoGroup) ?? null;
    const previous = coreIndex > 0 ? conceptModules[coreIndex - 1] : null;
    const next = coreIndex < conceptModules.length - 1 ? conceptModules[coreIndex + 1] : null;

    return (
      <>
        <header className="border-b border-white/10">
          <div className="section-shell py-8 sm:py-10">
            <Link href="/lessons" className="text-sm font-semibold text-zinc-400 transition hover:text-sky-200">All lessons</Link>
            <p className="micro-label mt-6 text-sky-300">Section {lesson.index}</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">{lesson.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">{lesson.summary}</p>
          </div>
        </header>
        <article className="section-shell page-section">
          {video && (
            <section aria-labelledby="video-lesson-title">
              <p className="micro-label text-sky-300">Video lesson</p>
              <h2 id="video-lesson-title" className="mt-3 text-2xl font-semibold">{video.title}</h2>
              <div className="mt-6"><VideoLessonPlayer lesson={video} /></div>
              <a href="#written-lesson" className="mt-5 inline-block text-sm font-semibold text-sky-300 hover:text-sky-200">Continue to the written lesson</a>
            </section>
          )}

          <ScrollReveal id="written-lesson" className={`${video ? "mt-16 border-t border-white/10 pt-10" : ""} scroll-mt-24`}>
            <p className="micro-label text-sky-300">Written lesson</p>
            <h2 className="mt-3 text-2xl font-semibold">Understand the method</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-zinc-300">{lesson.instruction.idea}</p>
          </ScrollReveal>

          <ScrollReveal className="mt-7 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <LessonDiagram lessonId={lesson.id} />
            <section aria-labelledby="lesson-method-title" className="border border-white/10 bg-[#101010] p-6 sm:p-7">
              <h3 id="lesson-method-title" className="text-xl font-semibold">Step-by-step method</h3>
              <ol className="mt-5 space-y-5">
                {lesson.instruction.steps.map((step, index) => (
                  <li key={step} className="grid grid-cols-[28px_1fr] gap-3 text-base leading-7 text-zinc-300">
                    <span className="font-mono text-xs text-sky-300">{String(index + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </ScrollReveal>

          <ScrollReveal className="mt-14" aria-labelledby="equation-forms-title">
            <p className="micro-label text-sky-300">Core notation</p>
            <h2 id="equation-forms-title" className="mt-3 text-2xl font-semibold">Equations and notation</h2>
            <div className="mt-6 grid gap-px bg-white/10 lg:grid-cols-2">
              {lesson.equations.map((equation) => (
                <div key={equation.label} className="bg-[#101010] p-6">
                  <Badge>{equation.label}</Badge>
                  <MathJaxRenderer math={equation.math} className="mt-6 min-h-10 text-base text-zinc-100" />
                  <p className="mt-4 text-base leading-7 text-zinc-300">{equation.note}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-8 border-l-2 border-sky-400 bg-sky-400/[0.045] p-5 sm:p-6">
            <p className="micro-label text-sky-300">Common mistake</p>
            <p className="mt-3 max-w-4xl text-base leading-7 text-zinc-300">{lesson.instruction.commonMistake}</p>
          </ScrollReveal>

          <ScrollReveal className="mt-14 grid gap-7 lg:grid-cols-[0.72fr_1.28fr]" aria-labelledby="worked-example-title">
            <div className="border border-white/10 bg-[#101010] p-6">
              <p className="micro-label text-sky-300">Check your work</p>
              <h2 className="mt-3 text-xl font-semibold">Three checks</h2>
              <ul className="mt-5 space-y-4">
                {lesson.keyChecks.map((check) => <li key={check} className="border-l border-sky-400/50 pl-4 text-base leading-7 text-zinc-300">{check}</li>)}
              </ul>
            </div>
            <div>
              <p className="micro-label text-sky-300">Worked example</p>
              <h2 id="worked-example-title" className="mt-3 text-xl font-semibold">{lesson.workedExample.prompt}</h2>
              <div className="mt-5">
                <StepByStepSolution steps={lesson.workedExample.steps} answer={lesson.workedExample.conclusion} defaultOpen title="Worked reasoning" />
              </div>
            </div>
          </ScrollReveal>

          <nav className="mt-16 grid gap-3 border-t border-white/10 pt-7 sm:grid-cols-3" aria-label="Lesson navigation">
            <div>{previous && <Link href={`/lessons/${previous.id}`} className="secondary-action w-full sm:w-auto">Previous lesson</Link>}</div>
            <Link href="/lessons" className="secondary-action w-full">All lessons</Link>
            <div className="sm:text-right">{next ? <Link href={`/lessons/${next.id}`} className="primary-action w-full sm:w-auto">Next lesson</Link> : <Link href="/practice" className="primary-action w-full sm:w-auto">Continue to practice</Link>}</div>
          </nav>
          <details className="mt-8 border-t border-white/10 pt-5">
            <summary className="cursor-pointer text-sm font-semibold text-zinc-300">Classroom reference and assigned practice</summary>
            <p className="mt-4 text-sm leading-7 text-zinc-400">Chapter {lesson.chapter}, Section {lesson.section}. Classroom slide PDF pages: {lesson.sourcePages?.join(", ")}.</p>
            {lesson.sourceNote && <p className="mt-3 text-sm leading-7 text-zinc-400">{lesson.sourceNote}</p>}
            {lesson.homeworkReference && <p className="mt-3 text-sm leading-7 text-zinc-300">{lesson.homeworkReference}</p>}
            <Link href="/practice" className="mt-4 inline-block text-sm font-semibold text-sky-300">Open website homework with typed solutions</Link>
          </details>
        </article>
      </>
    );
  }

  const lesson = await getManagedLesson(slug).catch(() => null);
  if (!lesson) notFound();
  const youtubeId = getYouTubeId(lesson.videoUrl);

  return (
    <>
      <PageHeader eyebrow="Teacher-created lesson" title={lesson.title} description={lesson.summary} />
      <article className="section-shell page-section">
        <p className="text-lg font-semibold text-zinc-200">{lesson.subtitle}</p>
        {youtubeId && (
          <div className="mt-8 aspect-video max-w-4xl overflow-hidden border border-white/10 bg-black">
            <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          </div>
        )}
        {lesson.equation && <MathJaxRenderer math={lesson.equation} className="mt-8 border border-sky-400/25 bg-sky-400/[0.04] p-6 text-xl text-sky-200" />}
        <ScrollReveal><MathJaxRenderer math={lesson.body} className="prose-copy mt-8 max-w-4xl whitespace-pre-wrap text-base leading-8 text-zinc-300" /></ScrollReveal>
        {lesson.takeaways.length > 0 && (
          <section className="mt-10 max-w-4xl border border-white/10 bg-[#101010] p-6">
            <h2 className="text-xl font-semibold">Key takeaways</h2>
            <ul className="mt-5 space-y-3">{lesson.takeaways.map((item) => <li key={item} className="border-l border-sky-400/50 pl-4 text-sm leading-7 text-zinc-400">{item}</li>)}</ul>
          </section>
        )}
        <div className="mt-14 border-t border-white/10 pt-7"><Link href="/lessons" className="secondary-action">All lessons</Link></div>
      </article>
    </>
  );
}
