import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { conceptModules } from "@/data/linesAndPlanesData";

export const metadata = { title: "Course Resources | MCV4U Lines and Planes" };

export default function ResourcesPage() {
  return (
    <>
      <PageHeader eyebrow="Chapters 8 and 9" title="Course resources" description="Use the formula sheet for reference and the course PDF for offline study. The lesson sequence follows the classroom sections." />
      <section className="section-shell page-section">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="border border-white/15 bg-[#111] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Formula sheet</h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">Review equation forms, conditions, and exact distance formulas after studying the lessons.</p>
            <Link href="/formulas" className="primary-action mt-6">Open formula sheet</Link>
          </article>
          <article className="border border-white/15 bg-[#111] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Website PDF</h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">Download the written lessons, diagrams, practice questions, assessments, and typed solutions. Use the website for video recordings and interactive geometry.</p>
            <a href="/course/website.pdf" download="MCV4U_Lines_and_Planes_Website.pdf" className="primary-action mt-6">Download course PDF</a>
          </article>
        </div>
        <section className="mt-14" aria-labelledby="course-sections-title">
          <h2 id="course-sections-title" className="text-2xl font-semibold">Classroom sequence</h2>
          <ol className="mt-6 grid gap-px bg-white/10 md:grid-cols-2">
            {conceptModules.map((lesson) => <li key={lesson.id} className="bg-[#101010] p-5"><Link href={`/lessons/${lesson.id}`} className="block text-base font-semibold text-zinc-100 hover:text-sky-200"><span className="mr-3 text-sky-300">{lesson.index}</span>{lesson.title}</Link></li>)}
          </ol>
        </section>
        <section className="mt-14 max-w-4xl border-t border-white/15 pt-7" aria-labelledby="classroom-sources-title">
          <h2 id="classroom-sources-title" className="text-2xl font-semibold">Classroom references</h2>
          <p className="mt-4 text-base leading-8 text-zinc-300">Chapter 8 Slides, Sections 8.1 to 8.5 and the chapter overview for Section 8.6. Chapter 9 Relationships Between Points Lines and Planes, Sections 9.1 to 9.6. The written explanations, diagrams, examples, and assessment questions on this website support those classroom topics.</p>
          <p className="mt-4 text-base leading-8 text-zinc-300">The course also includes the Lines and Planes requirements in the MCV4U Course Culminating Task Guidelines July 2026. Homework, quizzes, tests, and the final examination include typed worked solutions. Knowledge, Application, Thinking, and Communication are identified throughout the assessments.</p>
        </section>
      </section>
    </>
  );
}
