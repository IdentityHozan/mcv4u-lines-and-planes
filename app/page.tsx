import Link from "@/components/ui/SiteLink";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function HomePage() {
  return (
    <section className="industrial-grid min-h-[calc(100dvh-4.5rem)]">
      <ScrollReveal className="section-shell py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="micro-label text-sky-300">MCV4U</p>
          <h1 className="page-title mt-5 text-zinc-100">Lines and Planes</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">Learn line and plane equations, intersections and distances through Sections 8.1 to 9.6.</p>
          <nav aria-label="Course" className="mt-8 flex flex-wrap gap-3">
            <Link href="/lessons" className="primary-action">Lessons</Link>
            <Link href="/practice" className="secondary-action">Homework</Link>
            <Link href="/assessments" className="secondary-action">Assessments</Link>
          </nav>
        </div>
      </ScrollReveal>
    </section>
  );
}
