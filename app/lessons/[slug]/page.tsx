import type { Metadata } from "next";
import Link from "@/components/ui/SiteLink";
import { notFound } from "next/navigation";
import { WrittenLesson, writtenLessons } from "@/components/lessons/WrittenLesson";
import { LessonHomework } from "@/components/lessons/LessonHomework";
import { VideoLessonPlayer } from "@/components/lessons/VideoLessonPlayer";
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
  const content = writtenLessons.find((item) => item.section === lesson.index);
  if (!content) notFound();
  const unit = unitForSection(lesson.index);
  const endsUnit = unit?.sections.at(-1) === lesson.index;
  const video = videoLessons.find((item) => item.id === lesson.videoGroup);
  const chapter = video?.timestamps.find((timestamp) => timestamp.label.startsWith(`${lesson.index} `));
  const previous = conceptModules[index - 1];
  const next = conceptModules[index + 1];

  return (
    <article className="section-shell study-shell py-7 sm:py-10">
      <header className="study-header">
        <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
          <Link href="/lessons">Lessons</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Section {lesson.index}</span>
        </nav>
        <h1>{content.title}</h1>
      </header>

      {video && <section id="lesson-video" className="lesson-video" aria-label={video.title}>
        <VideoLessonPlayer lesson={video} initialChapter={chapter} embedded />
      </section>}

      <nav className="lesson-jumps" aria-label="On this lesson">
        {video && <a href="#lesson-video">Video</a>}
        <a href="#understand">Read the lesson</a>
        <a href="#homework">Homework</a>
      </nav>

      <WrittenLesson content={content} lessonId={lesson.id}>
        <LessonHomework section={lesson.index} embedded />
        <nav className="lesson-tools" aria-label="Lesson tools">
          <Link href={`/visualizer?section=${lesson.index}`}>Visualizer</Link>
          <Link href={`/calculator?section=${lesson.index}`}>Calculator</Link>
        </nav>
        {unit && endsUnit && <section className="lesson-unit-review" aria-labelledby="unit-review-title">
          <h3 id="unit-review-title">Unit assessment</h3>
          <div className="flex flex-wrap gap-3">
            <Link href={quizHref(unit.id)} className="primary-action rounded-md">Quiz {unit.id}</Link>
            <Link href={testHref(unit.id)} className="secondary-action rounded-md">Test {unit.id}</Link>
          </div>
        </section>}
        <nav className="lesson-pagination" aria-label="Lesson navigation">
          {previous ? <Link href={`/lessons/${previous.id}`}>Previous: {previous.index}</Link> : <Link href="/lessons">All lessons</Link>}
          {next ? <Link href={`/lessons/${next.id}`}>Next: {next.index}</Link> : <Link href="/exam">Final exam</Link>}
        </nav>
      </WrittenLesson>
    </article>
  );
}
