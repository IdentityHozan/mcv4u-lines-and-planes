import Link from "@/components/ui/SiteLink";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata = { title: "Course Resources | MCV4U Lines and Planes" };

export default function ResourcesPage() {
  return (
    <>
      <PageHeader eyebrow="Chapters 8 and 9" title="Resources" description="Downloads and references." />
      <section className="section-shell page-section">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="border border-white/15 bg-[#111] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Formula sheet</h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">Equation forms and distance formulas.</p>
            <Link href="/formulas" className="primary-action mt-6">Open formula sheet</Link>
          </article>
          <article className="border border-white/15 bg-[#111] p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Course PDF</h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">Written lessons and assessments with solutions.</p>
            <a href="/course/website.pdf" download="MCV4U_Lines_and_Planes_Website.pdf" className="primary-action mt-6">Download course PDF</a>
          </article>
        </div>
        <section className="mt-12 border-t border-white/15 pt-7" aria-labelledby="lesson-slides-title">
          <h2 id="lesson-slides-title" className="text-2xl font-semibold">Lesson slides</h2>
          <div className="mt-5 flex flex-wrap gap-3"><a href="/course/slides/video-1-lines.pptx" download className="secondary-action">Video 1 Sections 8.1 to 8.3</a><a href="/course/slides/video-2-planes.pptx" download className="secondary-action">Video 2 Sections 8.4 to 8.6</a></div>
        </section>
        <section className="mt-14 max-w-4xl border-t border-white/15 pt-7" aria-labelledby="classroom-sources-title">
          <h2 id="classroom-sources-title" className="text-2xl font-semibold">Classroom references</h2>
          <p className="mt-4 text-base leading-7 text-zinc-300">Chapter 8 Slides, Sections 8.1 to 8.5 and the chapter overview for Section 8.6.</p>
          <p className="mt-3 text-base leading-7 text-zinc-300">Chapter 9 Relationships Between Points Lines and Planes, Sections 9.1 to 9.6.</p>
          <p className="mt-3 text-base leading-7 text-zinc-300">MCV4U Course Culminating Task Guidelines July 2026.</p>
        </section>
      </section>
    </>
  );
}
