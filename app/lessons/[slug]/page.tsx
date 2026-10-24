import type { Metadata } from "next";
import Link from "@/components/ui/SiteLink";
import { notFound } from "next/navigation";
import { LessonNotebook } from "@/components/lessons/LessonNotebook";
import { LessonHomework } from "@/components/lessons/LessonHomework";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { conceptModules, videoLessons } from "@/data/linesAndPlanesData";
import { unitForSection, quizHref, testHref } from "@/data/courseUnits";

export const dynamicParams = true;
export const revalidate = 0;
export function generateStaticParams() {
  return conceptModules.map((lesson) => ({ slug: lesson.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = conceptModules.find((item) => item.id === slug);
  return lesson ? { title: `${lesson.title} | MCV4U Lines and Planes`, description: lesson.summary } : {};
}
export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = conceptModules.findIndex((item) => item.id === slug);
  if (index < 0) notFound();
  const lesson = conceptModules[index];
  const unit = unitForSection(lesson.index);
  const endsUnit = unit?.sections[unit.sections.length - 1] === lesson.index;
  const video = videoLessons.find((item) => item.id === lesson.videoGroup) ?? null;
  const previous = conceptModules[index - 1];
  const next = conceptModules[index + 1];
  return (
    <article className="section-shell py-8 sm:py-12">
      <header className="mb-8 max-w-4xl">
        <Link href="/lessons" className="text-sm font-semibold text-zinc-400 hover:text-sky-200">All lessons</Link>
        <p className="micro-label mt-6 text-sky-300">Section {lesson.index}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">{lesson.title}</h1>
      </header>
      <LessonNotebook key={lesson.id} lesson={lesson} video={video} />
      <details className="mt-6 border-b border-white/10 pb-5">
        <summary className="w-fit cursor-pointer text-sm font-semibold text-zinc-400 hover:text-zinc-100">Visualizer and calculator</summary>
        <div className="mt-4 flex flex-wrap gap-3"><Link href={`/visualizer?section=${lesson.index}`} className="secondary-action">Visualizer</Link><Link href={`/calculator?section=${lesson.index}`} className="secondary-action">Calculator</Link></div>
      </details>
      <ScrollReveal className="mt-12"><LessonHomework section={lesson.index} /></ScrollReveal>
      {unit && endsUnit && <section className="mt-8 flex flex-wrap gap-3 border-t border-white/15 pt-6" aria-label={`Unit ${unit.id} assessments`}><Link href={quizHref(unit.id)} className="primary-action">Quiz {unit.id}</Link><Link href={testHref(unit.id)} className="secondary-action">Test {unit.id}</Link></section>}
      <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6" aria-label="Lesson navigation">
        {previous ? <Link href={`/lessons/${previous.id}`} className="text-sm font-semibold text-zinc-400 hover:text-zinc-100">Previous lesson</Link> : <span />}
        {next ? <Link href={`/lessons/${next.id}`} className="text-sm font-semibold text-sky-200 hover:text-sky-100">Next lesson {next.index}</Link> : <Link href="/exam" className="text-sm font-semibold text-sky-200 hover:text-sky-100">Final exam</Link>}
      </nav>
    </article>
  );
}
